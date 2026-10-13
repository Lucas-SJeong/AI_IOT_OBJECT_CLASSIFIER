#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <signal.h>
#include <sys/time.h>
#include "protocol.h"
#include "db_manager.h"

#define STATE_MANUAL "MANUAL"

static int broker_sock = -1;
static char current_state[32] = STATE_READY;
static char current_mode[32] = MODE_AUTO;
static int tray_percent = 90;

static long long get_current_time_ms(void) {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return (long long)tv.tv_sec * 1000 + (tv.tv_usec / 1000);
}

void send_to_broker(const char* packet) {
    if (broker_sock >= 0) {
        send(broker_sock, packet, strlen(packet), 0);
    }
}

// 모든 조작 단말기(HMI, WEB, VISION)로 상태 및 모드 전파
void broadcast_all(const char* command, const char* value) {
    char pkt[128];
    snprintf(pkt, sizeof(pkt), "[%s]%s@%s\n", CLIENT_HMI, command, value);
    send_to_broker(pkt);
    snprintf(pkt, sizeof(pkt), "[%s]%s@%s\n", CLIENT_WEB, command, value);
    send_to_broker(pkt);
    snprintf(pkt, sizeof(pkt), "[%s]%s@%s\n", CLIENT_VISION, command, value);
    send_to_broker(pkt);
    printf("CTRL -> ALL : %s@%s\n", command, value);
}

void transition_state(const char* new_state) {
    if (strcmp(current_state, new_state) != 0) {
        printf("STATE TRANSITION : %s -> %s\n", current_state, new_state);
        strncpy(current_state, new_state, sizeof(current_state) - 1);
        broadcast_all("STATE", current_state);
        db_log_event("STATE_CHANGE", current_state);
    }
}

void handle_sync_request(const char* target_client) {
    char pkt[128];
    snprintf(pkt, sizeof(pkt), "[%s]STATE@%s\n", target_client, current_state);
    send_to_broker(pkt);
    snprintf(pkt, sizeof(pkt), "[%s]MODE@%s\n", target_client, current_mode);
    send_to_broker(pkt);
    snprintf(pkt, sizeof(pkt), "[%s]TRAY@%d\n", target_client, tray_percent);
    send_to_broker(pkt);
}

void parse_incoming_event(const char* raw_packet) {
    char temp[BUF_SIZE];
    strncpy(temp, raw_packet, sizeof(temp) - 1);
    temp[sizeof(temp) - 1] = '\0';

    char* start = strchr(temp, '[');
    char* end = strchr(temp, ']');
    if (!start || !end || end < start) return;

    *end = '\0';
    char* from_id = start + 1;
    char* cmd = end + 1;

    while (*cmd == ' ' || *cmd == '\r' || *cmd == '\n') cmd++;
    int len = strlen(cmd);
    while (len > 0 && (cmd[len - 1] == ' ' || cmd[len - 1] == '\r' || cmd[len - 1] == '\n')) {
        cmd[--len] = '\0';
    }

    if (strlen(cmd) == 0) return;
    printf("EVENT RECV -> FROM: %s | CMD: %s\n", from_id, cmd);

    // 1. 상태 동기화 요청
    if (strcmp(cmd, "SYNC") == 0) {
        handle_sync_request(from_id);
        return;
    }

    // 2. 비상 정지 (ESTOP)
    if (strcmp(cmd, "ESTOP") == 0) {
        printf("[EMERGENCY] ESTOP TRIGGERED BY %s!\n", from_id);
        transition_state(STATE_ESTOP);
        send_to_broker("[" CLIENT_MOTION "]ESTOP\n");
        send_to_broker("[" CLIENT_VISION "]ESTOP\n");
        return;
    }

    // 3. E-STOP 해제
    if (strcmp(cmd, "ESTOP_CLEAR") == 0 || strcmp(cmd, "RESET") == 0) {
        printf("[SYSTEM] ESTOP CLEAR REQUEST ACCEPTED\n");
        send_to_broker("[" CLIENT_HMI "]ESTOP_CLEARED\n");
        send_to_broker("[" CLIENT_MOTION "]HOME\n");
        send_to_broker("[" CLIENT_VISION "]RESET\n");
        tray_percent = 90;
        send_to_broker("[" CLIENT_WEB "]TRAY@90\n");
        
        if (strcmp(current_mode, MODE_MANUAL) == 0) {
            transition_state(STATE_MANUAL);
        } else {
            transition_state(STATE_READY);
        }
        return;
    }

    if (strcmp(current_state, STATE_ESTOP) == 0) {
        printf("COMMAND IGNORED : IN ESTOP STATE\n");
        return;
    }

    // 4. 공정 시작 (START) - 점검(MANUAL) 모드에서는 차단
    if (strcmp(cmd, "START") == 0) {
        if (strcmp(current_mode, MODE_MANUAL) == 0) {
            printf("[CTRL] START IGNORED: IN MANUAL INSPECTION MODE\n");
            return;
        }
        transition_state(STATE_WORKING);
        send_to_broker("[" CLIENT_VISION "]STATE@WORKING\n");
        return;
    }

    // 5. 공정 중지 (END)
    if (strcmp(cmd, "END") == 0) {
        if (strcmp(current_mode, MODE_MANUAL) == 0) {
            transition_state(STATE_MANUAL);
        } else {
            transition_state(STATE_READY);
        }
        send_to_broker("[" CLIENT_VISION "]END\n");
        return;
    }

    // 6. 운전 모드 전환 (AUTO / MANUAL)
    if (strncmp(cmd, "MODE@", 5) == 0) {
        char* new_mode = cmd + 5;
        strncpy(current_mode, new_mode, sizeof(current_mode) - 1);
        broadcast_all("MODE", current_mode);

        if (strcmp(current_mode, MODE_MANUAL) == 0) {
            // MANUAL(점검 모드) 진입: READY 등 공정 파이프라인 소등을 위해 MANUAL 상태로 전이
            transition_state(STATE_MANUAL);
            send_to_broker("[" CLIENT_VISION "]RESET\n");
            send_to_broker("[" CLIENT_VISION "]MODE@MANUAL\n");
            printf("[CTRL] MANUAL 점검 모드 전환 -> 공정 파이프라인 소등 및 수동 조작 활성화\n");
        } else if (strcmp(current_mode, MODE_AUTO) == 0) {
            // AUTO 전환: READY 상태 복귀 및 트레이 자동 정렬 (90도 원점)
            transition_state(STATE_READY);
            tray_percent = 90;
            send_to_broker("[" CLIENT_MOTION "]HOME\n");
            send_to_broker("[" CLIENT_WEB "]TRAY@90\n");
            send_to_broker("[" CLIENT_VISION "]MODE@AUTO\n");
            printf("[CTRL] AUTO 모드 복귀 -> READY 상태 전이 및 트레이 원점 정렬(90도)\n");
        }
        return;
    }

    // 7. 트레이 각도 제어 (가변저항 입력 또는 웹 소프트웨어 제어)
    if (strncmp(cmd, "TRAY@", 5) == 0) {
        int incoming_angle = atoi(cmd + 5);
        if (incoming_angle < 0) incoming_angle = 0;
        if (incoming_angle > 180) incoming_angle = 180;

        // [해결 1] 모션 보드(T8_MOTION) 자신이 보낸 피드백 패킷은 모션으로 재전송 금지 (에코 무한루프 차단)
        if (strcmp(from_id, CLIENT_MOTION) == 0) {
            tray_percent = incoming_angle;
            char web_tray[64];
            snprintf(web_tray, sizeof(web_tray), "[%s]TRAY@%d\n", CLIENT_WEB, tray_percent);
            send_to_broker(web_tray); // 웹 대시보드 동기화만 수행
            return;
        }

        // [해결 2] 소프트웨어 불감대(Deadband) 필터: 3도 미만의 미세한 ADC 노이즈 무시
        if (abs(incoming_angle - tray_percent) < 3) {
            return;
        }

        // [해결 3] 시간 스로틀링(Rate Limiting): ESP-01 Wi-Fi 병목 방지를 위해 최소 150ms 간격 보장
        static long long last_tray_send_time = 0;
        long long now = get_current_time_ms();
        if (now - last_tray_send_time < 150) {
            return; // 너무 빠르게 유입된 연속 패킷 드롭
        }
        last_tray_send_time = now;

        tray_percent = incoming_angle;

        char motion_tray[64], web_tray[64];
        snprintf(motion_tray, sizeof(motion_tray), "[%s]TRAY@%d\n", CLIENT_MOTION, tray_percent);
        snprintf(web_tray, sizeof(web_tray), "[%s]TRAY@%d\n", CLIENT_WEB, tray_percent);
        
        send_to_broker(motion_tray); // STM32 서보모터 구동 (1회만 전달)
        send_to_broker(web_tray);    // 웹 대시보드 동기화
        printf("[CTRL] 트레이 각도 제어 승인: %d도 (From: %s)\n", tray_percent, from_id);
        return;
    }

    // 8. 비전 판정 결과 수신 (AUTO 모드 전용)
    if (strcmp(cmd, "NORMAL") == 0 || strcmp(cmd, "PASS") == 0) {
        if (strcmp(current_mode, MODE_AUTO) == 0) {
            transition_state(STATE_PASS);
            send_to_broker("[" CLIENT_MOTION "]SORT@PASS\n");
            send_to_broker("[" CLIENT_VISION "]ACK@PASS\n");
        }
        return;
    }

    if (strcmp(cmd, "DEFECT") == 0 || strcmp(cmd, "FAIL") == 0) {
        if (strcmp(current_mode, MODE_AUTO) == 0) {
            transition_state(STATE_FAIL);
            send_to_broker("[" CLIENT_MOTION "]SORT@FAIL\n");
            send_to_broker("[" CLIENT_VISION "]ACK@FAIL\n");
        }
        return;
    }

    // 9. 모터 노드 동작 완료 응답 수신
    if (strncmp(cmd, "SORT_DONE@", 10) == 0 || strcmp(cmd, "MOTION_DONE") == 0 || strcmp(cmd, "ACT@DONE") == 0) {
        send_to_broker("[" CLIENT_VISION "]ACT@DONE\n");

        if (strcmp(current_mode, MODE_AUTO) == 0) {
            transition_state(STATE_WORKING);
            send_to_broker("[" CLIENT_VISION "]STATE@WORKING\n");
        } else {
            transition_state(STATE_MANUAL);
        }
        return;
    }

    // 10. 홈 정렬 완료 응답
    if (strcmp(cmd, "HOME@DONE") == 0) {
        printf("[MOTION] 트레이 홈 정렬 완료 확인 (90도)\n");
        return;
    }
}

int main(int argc, char* argv[]) {
    char broker_ip[32] = "127.0.0.1";
    int broker_port = SERVER_PORT;

    if (argc > 1) strncpy(broker_ip, argv[1], sizeof(broker_ip) - 1);
    if (argc > 2) broker_port = atoi(argv[2]);

    db_init();

    while (1) {
        broker_sock = socket(AF_INET, SOCK_STREAM, 0);
        if (broker_sock < 0) {
            sleep(2);
            continue;
        }

        struct sockaddr_in serv_addr;
        memset(&serv_addr, 0, sizeof(serv_addr));
        serv_addr.sin_family = AF_INET;
        serv_addr.sin_port = htons(broker_port);
        inet_pton(AF_INET, broker_ip, &serv_addr.sin_addr);

        printf("[*] Connecting to broker server %s:%d...\n", broker_ip, broker_port);
        if (connect(broker_sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) < 0) {
            close(broker_sock);
            broker_sock = -1;
            sleep(3);
            continue;
        }

        send_to_broker("[" CLIENT_CTRL ":" AUTH_PASSWD "]\n");
        printf("[+] Registered to broker as '%s'\n", CLIENT_CTRL);
        broadcast_all("STATE", current_state);
        broadcast_all("MODE", current_mode);

        char recv_buf[BUF_SIZE];
        while (1) {
            memset(recv_buf, 0, sizeof(recv_buf));
            int n = recv(broker_sock, recv_buf, sizeof(recv_buf) - 1, 0);
            if (n <= 0) {
                printf("[-] Disconnected from broker server. Reconnecting...\n");
                break;
            }
            recv_buf[n] = '\0';

            char* line = strtok(recv_buf, "\r\n");
            while (line != NULL) {
                parse_incoming_event(line);
                line = strtok(NULL, "\r\n");
            }
        }

        close(broker_sock);
        broker_sock = -1;
        sleep(2);
    }

    db_close();
    return 0;
}
