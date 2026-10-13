#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/select.h>
#include <sys/time.h>
#include <pthread.h>
#include <errno.h>

#define BUF_SIZE 128
#define NAME_SIZE 20

/* -------------------------------------------------------------------------
 * T8_CTRL : Raspberry Pi central control client
 *
 * Final scope
 * - HMI command/state authority
 * - AUTO / MANUAL interlock
 * - Vision mock result handling (stdin NORMAL / DEFECT)
 * - Motion SORT / HOME / ESTOP routing
 * - No DB direct access: DB remains T8_DB(sql_client) responsibility
 * ------------------------------------------------------------------------- */

typedef enum
{
    CTRL_IDLE = 0,
    CTRL_WORKING,
    CTRL_INSPECTING,
    CTRL_PASS,
    CTRL_FAIL,
    CTRL_ESTOP
} ControlState;

typedef enum
{
    CTRL_MODE_AUTO = 0,
    CTRL_MODE_MANUAL
} ControlMode;

static char name[NAME_SIZE] = "Default";

static ControlState ctrlState = CTRL_IDLE;
static ControlMode ctrlMode = CTRL_MODE_AUTO;

/* PASS/FAIL 판정과 실제 분류 완료는 분리해서 관리한다. */
static int sortCompleted = 0;

/* HOME@DONE은 상태 전이 조건이 아니라 HOME 명령 ACK 추적용이다. */
static int homePending = 0;

static pthread_mutex_t stateMutex = PTHREAD_MUTEX_INITIALIZER;
static pthread_mutex_t txMutex = PTHREAD_MUTEX_INITIALIZER;

static void *send_msg(void *arg);
static void *recv_msg(void *arg);
static void error_handling(const char *msg);

static const char *control_state_name(ControlState state);
static const char *control_mode_name(ControlMode mode);
static void control_set_state(ControlState newState);
static void control_set_mode(ControlMode newMode);

static int server_send(int sock, const char *text);
static void send_hmi_state(int sock, const char *state);
static void send_hmi_mode(int sock);
static void send_current_hmi_state(int sock);
static void process_vision_result(int sock, const char *result);
static void control_event(int sock, const char *recvLine);
static int parse_int_range(const char *text, int minValue, int maxValue, int *out);
static void send_vision_state(int sock, const char *state);
static void send_vision_mode(int sock);
static void send_current_vision_state(int sock);

static void send_hmi_warning(int sock, const char *warning);

static void process_vision_detect(int sock, const char *detect);

int main(int argc, char *argv[])
{
    int sock;
    struct sockaddr_in servAddr;
    pthread_t sndThread, rcvThread;
    char loginMsg[NAME_SIZE + 16];

    if(argc != 4)
    {
        printf("Usage : %s <IP> <port> <name>\n", argv[0]);
        return 1;
    }

    if(strlen(argv[3]) >= sizeof(name))
    {
        fprintf(stderr, "client name too long\n");
        return 1;
    }

    snprintf(name, sizeof(name), "%s", argv[3]);

    sock = socket(PF_INET, SOCK_STREAM, 0);
    if(sock == -1)
        error_handling("socket() error");

    memset(&servAddr, 0, sizeof(servAddr));
    servAddr.sin_family = AF_INET;
    servAddr.sin_port = htons((uint16_t)atoi(argv[2]));

    if(inet_pton(AF_INET, argv[1], &servAddr.sin_addr) != 1)
        error_handling("invalid server IP");

    if(connect(sock, (struct sockaddr *)&servAddr, sizeof(servAddr)) == -1)
        error_handling("connect() error");

    snprintf(loginMsg, sizeof(loginMsg), "[%s:PASSWD]", name);
    if(write(sock, loginMsg, strlen(loginMsg)) <= 0)
        error_handling("login send error");

    printf("T8_CTRL CONNECTED\n");
    printf("STATE=%s MODE=%s\n",
           control_state_name(ctrlState),
           control_mode_name(ctrlMode));

    if(pthread_create(&rcvThread, NULL, recv_msg, (void *)&sock) != 0)
        error_handling("recv thread create error");

    if(pthread_create(&sndThread, NULL, send_msg, (void *)&sock) != 0)
        error_handling("send thread create error");

    pthread_join(sndThread, NULL);
    pthread_join(rcvThread, NULL);

    if(sock >= 0)
        close(sock);

    return 0;
}

static const char *control_state_name(ControlState state)
{
    switch(state)
    {
        case CTRL_IDLE:       return "IDLE";
        case CTRL_WORKING:    return "WORKING";
        case CTRL_INSPECTING: return "INSPECTING";
        case CTRL_PASS:       return "PASS";
        case CTRL_FAIL:       return "FAIL";
        case CTRL_ESTOP:      return "ESTOP";
        default:              return "UNKNOWN";
    }
}

static const char *control_mode_name(ControlMode mode)
{
    switch(mode)
    {
        case CTRL_MODE_AUTO:   return "AUTO";
        case CTRL_MODE_MANUAL: return "MANUAL";
        default:               return "UNKNOWN";
    }
}

static void control_set_state(ControlState newState)
{
    if(ctrlState == newState)
        return;

    printf("STATE : %s -> %s\n",
           control_state_name(ctrlState),
           control_state_name(newState));

    ctrlState = newState;
}

static void control_set_mode(ControlMode newMode)
{
    if(ctrlMode == newMode)
        return;

    printf("MODE : %s -> %s\n",
           control_mode_name(ctrlMode),
           control_mode_name(newMode));

    ctrlMode = newMode;
}

static int server_send(int sock, const char *text)
{
    size_t length;
    size_t sentTotal = 0;

    if(sock < 0 || text == NULL)
        return -1;

    length = strlen(text);
    if(length == 0U)
        return -1;

    pthread_mutex_lock(&txMutex);

    while(sentTotal < length)
    {
        ssize_t sent = write(sock,
                             text + sentTotal,
                             length - sentTotal);

        if(sent < 0 && errno == EINTR)
            continue;

        if(sent <= 0)
        {
            pthread_mutex_unlock(&txMutex);
            return -1;
        }

        sentTotal += (size_t)sent;
    }

    pthread_mutex_unlock(&txMutex);
    return 0;
}

static void send_hmi_state(int sock, const char *state)
{
    char sendBuf[96];

    snprintf(sendBuf, sizeof(sendBuf),
             "[T8_HMI]STATE@%s\n", state);

    if(server_send(sock, sendBuf) != 0)
    {
        printf("HMI STATE SEND ERROR\n");
        return;
    }

    printf("CTRL -> HMI : STATE@%s\n", state);
}

static void send_hmi_warning(int sock, const char *warning)
{
    char sendBuf[96];

    snprintf(sendBuf, sizeof(sendBuf),
             "[T8_HMI]WARN@%s\n",
             warning);

    if(server_send(sock, sendBuf) != 0)
    {
        printf("HMI WARNING SEND ERROR\n");
        return;
    }

    printf("CTRL -> HMI : WARN@%s\n", warning);
}

static void send_hmi_mode(int sock)
{
    char sendBuf[96];

    snprintf(sendBuf, sizeof(sendBuf),
             "[T8_HMI]MODE@%s\n",
             control_mode_name(ctrlMode));

    if(server_send(sock, sendBuf) != 0)
    {
        printf("HMI MODE SEND ERROR\n");
        return;
    }

    printf("CTRL -> HMI : MODE@%s\n",
           control_mode_name(ctrlMode));
}

static void send_current_hmi_state(int sock)
{
    switch(ctrlState)
    {
        case CTRL_IDLE:       send_hmi_state(sock, "READY");      break;
        case CTRL_WORKING:    send_hmi_state(sock, "WORKING");    break;
        case CTRL_INSPECTING: send_hmi_state(sock, "INSPECTING"); break;
        case CTRL_PASS:       send_hmi_state(sock, "PASS");       break;
        case CTRL_FAIL:       send_hmi_state(sock, "FAIL");       break;
        case CTRL_ESTOP:      send_hmi_state(sock, "ESTOP");      break;
        default: break;
    }
}

static int parse_int_range(const char *text, int minValue, int maxValue, int *out)
{
    char *endptr;
    long value;

    if(text == NULL || out == NULL || *text == '\0')
        return 0;

    value = strtol(text, &endptr, 10);

    if(*endptr != '\0' || value < minValue || value > maxValue)
        return 0;

    *out = (int)value;
    return 1;
}

static void send_vision_state(int sock, const char *state)
{
    char sendBuf[96];

    snprintf(sendBuf, sizeof(sendBuf),
             "[T8_VISION]STATE@%s\n",
             state);

    if(server_send(sock, sendBuf) != 0)
    {
        printf("VISION STATE SEND ERROR\n");
        return;
    }

    printf("CTRL -> VISION : STATE@%s\n", state);
}

static void send_vision_mode(int sock)
{
    char sendBuf[96];

    snprintf(sendBuf, sizeof(sendBuf),
             "[T8_VISION]MODE@%s\n",
             control_mode_name(ctrlMode));

    if(server_send(sock, sendBuf) != 0)
    {
        printf("VISION MODE SEND ERROR\n");
        return;
    }

    printf("CTRL -> VISION : MODE@%s\n",
           control_mode_name(ctrlMode));
}

static void send_current_vision_state(int sock)
{
    switch(ctrlState)
    {
        case CTRL_IDLE:
            send_vision_state(sock, "READY");
            break;

        case CTRL_WORKING:
            send_vision_state(sock, "WORKING");
            break;

        case CTRL_INSPECTING:
            send_vision_state(sock, "INSPECTING");
            break;

        case CTRL_PASS:
            send_vision_state(sock, "PASS");
            break;

        case CTRL_FAIL:
            send_vision_state(sock, "FAIL");
            break;

        case CTRL_ESTOP:
            send_vision_state(sock, "ESTOP");
            break;

        default:
            break;
    }
}

static void process_vision_detect(int sock, const char *detect)
{
    if(ctrlMode != CTRL_MODE_AUTO)
    {
        printf("VISION DETECT IGNORED : MODE=%s\n",
               control_mode_name(ctrlMode));
        return;
    }

    if(ctrlState != CTRL_INSPECTING)
    {
        printf("VISION DETECT IGNORED : STATE=%s\n",
               control_state_name(ctrlState));
        return;
    }

    if(strcmp(detect, "NONE") == 0)
    {
        printf("VISION DETECT : NO ITEM\n");

        control_set_state(CTRL_WORKING);

        send_hmi_state(sock, "WORKING");
        send_vision_state(sock, "WORKING");

        send_hmi_warning(sock, "NO_ITEM");

        return;
    }

    if(strcmp(detect, "MULTI") == 0)
    {
        printf("VISION DETECT : MULTIPLE ITEMS\n");

        control_set_state(CTRL_WORKING);

        send_hmi_state(sock, "WORKING");
        send_vision_state(sock, "WORKING");

        send_hmi_warning(sock, "MULTI_ITEM");

        return;
    }

    if(strcmp(detect, "SINGLE") == 0)
    {
        printf("VISION DETECT : SINGLE ITEM\n");
        printf("VISION QUALITY INSPECTION ALLOWED\n");

        /*
         * 현재 상태 INSPECTING 유지.
         * 다음 RESULT@NORMAL / RESULT@DEFECT를 기다린다.
         */
        return;
    }

    printf("UNKNOWN VISION DETECT : %s\n", detect);
}

static void process_vision_result(int sock, const char *result)
{
    char sendBuf[96];

    if(ctrlMode != CTRL_MODE_AUTO)
    {
        printf("VISION RESULT IGNORED : MODE=%s\n",
               control_mode_name(ctrlMode));
        return;
    }

    if(ctrlState != CTRL_INSPECTING)
    {
        printf("VISION RESULT IGNORED : STATE=%s\n",
               control_state_name(ctrlState));
        return;
    }

    sortCompleted = 0;

    if(strcmp(result, "NORMAL") == 0)
    {
        control_set_state(CTRL_PASS);
        printf("VISION RESULT : NORMAL -> PASS\n");

        snprintf(sendBuf, sizeof(sendBuf),
                 "[T8_MOTION]SORT@PASS\n");

        if(server_send(sock, sendBuf) != 0)
            printf("PASS SORT SEND ERROR\n");
        else
            printf("CTRL -> MOTION : SORT@PASS\n");

        send_hmi_state(sock, "PASS");
        send_vision_state(sock, "PASS");
        return;
    }

    if(strcmp(result, "DEFECT") == 0)
    {
        control_set_state(CTRL_FAIL);
        printf("VISION RESULT : DEFECT -> FAIL\n");

        snprintf(sendBuf, sizeof(sendBuf),
                 "[T8_MOTION]SORT@FAIL\n");

        if(server_send(sock, sendBuf) != 0)
            printf("FAIL SORT SEND ERROR\n");
        else
            printf("CTRL -> MOTION : SORT@FAIL\n");

        send_hmi_state(sock, "FAIL");
        send_vision_state(sock, "FAIL");
        return;
    }

    printf("UNKNOWN VISION RESULT : %s\n", result);
}

static void control_event(int sock, const char *recvLine)
{
    char sender[20] = {0};
    char command[100] = {0};
    char sendBuf[120] = {0};

    if(sscanf(recvLine,
              "[%19[^]]]%99[^\n]",
              sender,
              command) != 2)
    {
        printf("PARSE ERROR : %s\n", recvLine);
        return;
    }

    printf("FROM=%s CMD=%s\n", sender, command);

    /* ---------------------------------------------------------------------
     * T8_MOTION responses
     * --------------------------------------------------------------------- */
    if(strcmp(sender, "T8_MOTION") == 0)
    {
        if(strcmp(command, "SORT_DONE@PASS") == 0)
        {
            if(ctrlState == CTRL_PASS)
            {
                sortCompleted = 1;
                printf("EVENT : SORT_DONE PASS\n");
                printf("SORT COMPLETE CONFIRMED : PASS\n");
            }
            else
            {
                printf("SORT_DONE PASS IGNORED : STATE=%s\n",
                       control_state_name(ctrlState));
            }
            return;
        }

        if(strcmp(command, "SORT_DONE@FAIL") == 0)
        {
            if(ctrlState == CTRL_FAIL)
            {
                sortCompleted = 1;
                printf("EVENT : SORT_DONE FAIL\n");
                printf("SORT COMPLETE CONFIRMED : FAIL\n");
            }
            else
            {
                printf("SORT_DONE FAIL IGNORED : STATE=%s\n",
                       control_state_name(ctrlState));
            }
            return;
        }

        if(strcmp(command, "HOME@DONE") == 0)
        {
            if(homePending)
            {
                homePending = 0;
                printf("EVENT : HOME ACK\n");
                printf("HOME COMMAND CONFIRMED\n");
            }
            else
            {
                printf("HOME ACK IGNORED : NOT PENDING\n");
            }
            return;
        }

        if(strcmp(command, "ESTOP@CANCELLED") == 0)
        {
            printf("MOTION ESTOP ACK\n");
            return;
        }

        /* SORT@..., TRAY@... immediate echo ACK */
        if(strncmp(command, "SORT@", 5) == 0 ||
           strncmp(command, "TRAY@", 5) == 0)
        {
            printf("MOTION ACK : %s\n", command);
            return;
        }

        printf("UNKNOWN MOTION RESPONSE : %s\n", command);
        return;
    }
        
    /* ---------------------------------------------------------------------
     * T8_VISION
     * --------------------------------------------------------------------- */
    if(strcmp(sender, "T8_VISION") == 0)
    {
        if(strcmp(command, "SYNC") == 0)
        {
            printf("EVENT : VISION SYNC\n");

            send_current_vision_state(sock);
            send_vision_mode(sock);

            return;
        }

        if(strcmp(command, "DETECT@NONE") == 0)
        {
            process_vision_detect(sock, "NONE");
            return;
        }

        if(strcmp(command, "DETECT@SINGLE") == 0)
        {
            process_vision_detect(sock, "SINGLE");
            return;
        }

        if(strcmp(command, "DETECT@MULTI") == 0)
        {
            process_vision_detect(sock, "MULTI");
            return;
        }

        if(strcmp(command, "RESULT@NORMAL") == 0)
        {
            process_vision_result(sock, "NORMAL");
            return;
        }

        if(strcmp(command, "RESULT@DEFECT") == 0)
        {
            process_vision_result(sock, "DEFECT");
            return;
        }

        printf("UNKNOWN VISION COMMAND : %s\n", command);
        return;
    }

    /* 중앙제어용 작업자 명령은 T8_HMI만 수용 */
    if(strcmp(sender, "T8_HMI") != 0)
        return;

    /* HMI reboot/resync */
    if(strcmp(command, "SYNC") == 0)
    {
        printf("EVENT : HMI SYNC\n");
        send_current_hmi_state(sock);
        send_hmi_mode(sock);
        return;
    }

    /* E-STOP is highest priority. */
    if(strcmp(command, "ESTOP") == 0)
    {
        if(ctrlState != CTRL_ESTOP)
        {
            sortCompleted = 0;
            homePending = 0;
            control_set_state(CTRL_ESTOP);
            printf("EVENT : ESTOP\n");
            printf("CONTROL LOCKED\n");

            if(server_send(sock, "[T8_MOTION]ESTOP\n") != 0)
                printf("MOTION ESTOP SEND ERROR\n");
            else
                printf("CTRL -> MOTION : ESTOP\n");
        }
        else
        {
            printf("ESTOP IGNORED : ALREADY ESTOP\n");
        }

        send_hmi_state(sock, "ESTOP");
        send_vision_state(sock, "ESTOP");
        return;
    }

    /* CLEAR only releases the software lock. It never moves the servo. */
    if(strcmp(command, "ESTOP_CLEAR") == 0)
    {
        if(ctrlState != CTRL_ESTOP)
        {
            printf("ESTOP_CLEAR IGNORED : STATE=%s\n",
                   control_state_name(ctrlState));
            return;
        }

        printf("EVENT : ESTOP_CLEAR\n");
        sortCompleted = 0;
        homePending = 0;
        control_set_state(CTRL_IDLE);

        if(server_send(sock, "[T8_HMI]ESTOP_CLEARED\n") != 0)
            printf("ESTOP CLEAR ACK SEND ERROR\n");
        else
            printf("CTRL -> HMI : ESTOP_CLEARED\n");

        send_hmi_state(sock, "READY");
        send_hmi_mode(sock);
        send_vision_state(sock, "READY");
        send_vision_mode(sock);
        return;
    }

    if(ctrlState == CTRL_ESTOP)
    {
        printf("BLOCKED IN ESTOP : %s\n", command);
        return;
    }

    /* MODE change is allowed only while IDLE. */
    if(strcmp(command, "MODE@AUTO") == 0 ||
   strcmp(command, "MODE@MANUAL") == 0)
{
    ControlMode requestedMode =
        (strcmp(command, "MODE@AUTO") == 0) ?
        CTRL_MODE_AUTO : CTRL_MODE_MANUAL;

    if(ctrlState != CTRL_IDLE)
    {
        printf("MODE CHANGE IGNORED : STATE=%s\n",
               control_state_name(ctrlState));

        send_hmi_mode(sock);
        return;
    }

    /*
     * MANUAL -> AUTO 복귀 시
     * 수동 조작으로 변경된 Tray를 기준위치 HOME(90°)로 복귀시킨다.
     */
    if((ctrlMode == CTRL_MODE_MANUAL) &&
       (requestedMode == CTRL_MODE_AUTO))
    {
        if(server_send(sock, "[T8_MOTION]HOME\n") == 0)
        {
            homePending = 1;
            printf("MANUAL -> AUTO : RETURN HOME\n");
            printf("CTRL -> MOTION : HOME\n");
        }
        else
        {
            homePending = 0;
            printf("AUTO HOME SEND ERROR\n");
        }
    }

    control_set_mode(requestedMode);

    printf("EVENT : MODE %s\n",
           control_mode_name(ctrlMode));

    send_hmi_mode(sock);
    send_vision_mode(sock);
    return;
}

    /* MANUAL JOG */
    if(strncmp(command, "TRAY@", 5) == 0)
    {
        int angle;

        if(ctrlMode != CTRL_MODE_MANUAL)
        {
            printf("TRAY IGNORED : MODE=%s\n",
                   control_mode_name(ctrlMode));
            return;
        }

        if(ctrlState != CTRL_IDLE)
        {
            printf("TRAY IGNORED : STATE=%s\n",
                   control_state_name(ctrlState));
            return;
        }

        if(!parse_int_range(command + 5, 0, 180, &angle))
        {
            printf("TRAY VALUE ERROR : %s\n", command + 5);
            return;
        }

        snprintf(sendBuf, sizeof(sendBuf),
                 "[T8_MOTION]TRAY@%d\n", angle);

        if(server_send(sock, sendBuf) != 0)
            printf("TRAY SEND ERROR\n");
        else
            printf("CTRL -> MOTION : TRAY@%d\n", angle);

        return;
    }

    /* Production START is AUTO-only. */
    if(strcmp(command, "START") == 0)
    {
        if(ctrlMode != CTRL_MODE_AUTO)
        {
            printf("START IGNORED : MODE=%s\n",
                   control_mode_name(ctrlMode));
            send_current_hmi_state(sock);
            return;
        }

        if(ctrlState != CTRL_IDLE)
        {
            printf("START IGNORED : STATE=%s\n",
                   control_state_name(ctrlState));
            send_current_hmi_state(sock);
            return;
        }

        sortCompleted = 0;
        homePending = 0;
        control_set_state(CTRL_WORKING);
        printf("EVENT : START\n");
        send_hmi_state(sock, "WORKING");
        send_vision_state(sock, "WORKING");
        return;
    }

    if(strcmp(command, "CHECK") == 0)
    {
        if(ctrlMode != CTRL_MODE_AUTO)
        {
            printf("CHECK IGNORED : MODE=%s\n",
                   control_mode_name(ctrlMode));
            send_current_hmi_state(sock);
            return;
        }

        if(ctrlState != CTRL_WORKING)
        {
            printf("CHECK IGNORED : STATE=%s\n",
                   control_state_name(ctrlState));
            send_current_hmi_state(sock);
            return;
        }

        control_set_state(CTRL_INSPECTING);

        printf("EVENT : CHECK\n");

        send_hmi_state(sock, "INSPECTING");
        send_vision_state(sock, "INSPECTING");

        if(server_send(sock, "[T8_VISION]CHECK\n") != 0)
        {
            printf("VISION CHECK SEND ERROR\n");
        }
        else
        {
            printf("CTRL -> VISION : CHECK\n");
        }

        return;
    }

    /*
     * END has one consistent meaning: terminate the current work and HOME.
     * - PASS/FAIL + SORT_DONE -> COMPLETE
     * - otherwise            -> CANCELLED
     * This also allows END to cancel an in-progress sort cleanly.
     */
    if(strcmp(command, "END") == 0)
    {
        const char *workResult;

        if(ctrlState == CTRL_IDLE)
        {
            printf("END IGNORED : ALREADY IDLE\n");
            send_current_hmi_state(sock);
            return;
        }

        if(ctrlState != CTRL_WORKING &&
           ctrlState != CTRL_INSPECTING &&
           ctrlState != CTRL_PASS &&
           ctrlState != CTRL_FAIL)
        {
            printf("END IGNORED : STATE=%s\n",
                   control_state_name(ctrlState));
            return;
        }

        if((ctrlState == CTRL_PASS || ctrlState == CTRL_FAIL) &&
           sortCompleted)
            workResult = "COMPLETE";
        else
            workResult = "CANCELLED";

        printf("EVENT : END\n");
        printf("WORK RESULT : %s\n", workResult);

        if(server_send(sock, "[T8_MOTION]HOME\n") == 0)
        {
            homePending = 1;
            printf("CTRL -> MOTION : HOME\n");
        }
        else
        {
            homePending = 0;
            printf("MOTION HOME SEND ERROR\n");
        }

        sortCompleted = 0;
        control_set_state(CTRL_IDLE);
        send_hmi_state(sock, "READY");
        send_vision_state(sock, "READY");
        return;
    }

    printf("UNKNOWN HMI COMMAND : %s\n", command);
}

static void *send_msg(void *arg)
{
    int *sock = (int *)arg;
    char input[BUF_SIZE];
    fd_set initSet, readSet;
    struct timeval tv;

    FD_ZERO(&initSet);
    FD_SET(STDIN_FILENO, &initSet);

    printf("Vision mock: NORMAL / DEFECT, quit to exit\n");

    while(1)
    {
        int ret;

        if(*sock < 0)
            return NULL;

        readSet = initSet;
        tv.tv_sec = 0;
        tv.tv_usec = 200000;

        ret = select(STDIN_FILENO + 1,
                     &readSet,
                     NULL,
                     NULL,
                     &tv);

        if(ret < 0)
        {
            perror("select");
            return NULL;
        }

        if(ret == 0)
            continue;

        if(!FD_ISSET(STDIN_FILENO, &readSet))
            continue;

        if(fgets(input, sizeof(input), stdin) == NULL)
            continue;

        if(strcmp(input, "NORMAL\n") == 0)
        {
            pthread_mutex_lock(&stateMutex);
            process_vision_result(*sock, "NORMAL");
            pthread_mutex_unlock(&stateMutex);
            continue;
        }

        if(strcmp(input, "DEFECT\n") == 0)
        {
            pthread_mutex_lock(&stateMutex);
            process_vision_result(*sock, "DEFECT");
            pthread_mutex_unlock(&stateMutex);
            continue;
        }

        if(strcmp(input, "STATUS\n") == 0 ||
           strcmp(input, "status\n") == 0)
        {
            pthread_mutex_lock(&stateMutex);
            printf("STATUS : STATE=%s MODE=%s SORT_DONE=%d HOME_PENDING=%d\n",
                   control_state_name(ctrlState),
                   control_mode_name(ctrlMode),
                   sortCompleted,
                   homePending);
            pthread_mutex_unlock(&stateMutex);
            continue;
        }

        if(strcmp(input, "quit\n") == 0)
        {
            int currentSock = *sock;
            *sock = -1;
            if(currentSock >= 0)
                shutdown(currentSock, SHUT_RDWR);
            return NULL;
        }

        printf("Unknown local command. Use NORMAL / DEFECT / STATUS / quit\n");
    }
}

static void *recv_msg(void *arg)
{
    int *sock = (int *)arg;
    char readBuf[128];
    char lineBuf[512];
    size_t lineLen = 0;

    while(1)
    {
        ssize_t strLen;

        if(*sock < 0)
            return NULL;

        strLen = read(*sock, readBuf, sizeof(readBuf));

        if(strLen <= 0)
        {
            *sock = -1;
            return NULL;
        }

        for(ssize_t i = 0; i < strLen; i++)
        {
            char ch = readBuf[i];

            if(ch == '\r')
                continue;

            if(ch == '\n')
            {
                if(lineLen == 0U)
                    continue;

                lineBuf[lineLen] = '\0';
                printf("%s\n", lineBuf);

                pthread_mutex_lock(&stateMutex);
                control_event(*sock, lineBuf);
                pthread_mutex_unlock(&stateMutex);

                lineLen = 0;
                continue;
            }

            if(lineLen < sizeof(lineBuf) - 1U)
            {
                lineBuf[lineLen++] = ch;
            }
            else
            {
                printf("RX LINE TOO LONG : DROP\n");
                lineLen = 0;
            }
        }
    }
}

static void error_handling(const char *msg)
{
    perror(msg);
    exit(1);
}
