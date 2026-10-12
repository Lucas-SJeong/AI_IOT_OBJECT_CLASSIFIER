#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <sys/select.h>
#include <fcntl.h>
#include <errno.h>
#include <time.h>
#include "protocol.h"

#ifndef CLIENT_WEB
#define CLIENT_WEB "T8_WEB"
#endif
#ifndef CLIENT_SERVER
#define CLIENT_SERVER "SERVER"
#endif

typedef struct {
    int fd;
    char id[ID_SIZE];
    int active;
} Client;

Client clients[MAX_CLIENTS];

void send_to_id(const char* target_id, const char* data, int len) {
    int delivered = 0;
    for (int i = 0; i < MAX_CLIENTS; i++) {
        if (clients[i].active && strcmp(clients[i].id, target_id) == 0) {
            send(clients[i].fd, data, len, 0);
            delivered++;
        }
    }
    if (!delivered) {
        printf("[ROUTER WARN] Target client '%s' not connected (Dropped)\n", target_id);
    }
}

void broadcast_to_web(const char* payload) {
    char packet[BUF_SIZE];
    snprintf(packet, sizeof(packet), "[%s]%s\n", CLIENT_WEB, payload);
    for (int i = 0; i < MAX_CLIENTS; i++) {
        if (clients[i].active && strcmp(clients[i].id, CLIENT_WEB) == 0) {
            send(clients[i].fd, packet, strlen(packet), 0);
        }
    }
}

void send_client_list(int target_fd) {
    char reply[BUF_SIZE] = "[T8_WEB]CLIENT_LIST@";
    int first = 1;
    for (int i = 0; i < MAX_CLIENTS; i++) {
        if (clients[i].active && strlen(clients[i].id) > 0) {
            if (!first) strcat(reply, ",");
            strcat(reply, clients[i].id);
            first = 0;
        }
    }
    strcat(reply, "\n");
    send(target_fd, reply, strlen(reply), 0);
}

// 클라이언트 등록 처리 (Motion 보드의 이중 등록 및 비표준 매크로 대응)
int register_client(int client_index, const char* buf) {
    char temp[BUF_SIZE];
    strncpy(temp, buf, sizeof(temp) - 1);
    temp[sizeof(temp) - 1] = '\0';

    char* start = strchr(temp, '[');
    char* end = strchr(temp, ']');
    if (!start || !end || end < start) return 0;

    *end = '\0';
    char* content = start + 1;
    char* colon = strchr(content, ':');
    if (!colon) return 0;

    *colon = '\0';
    char* id = content;
    char* pw = colon + 1;

    while (*id == ' ') id++;
    int id_len = strlen(id);
    while (id_len > 0 && (id[id_len - 1] == ' ' || id[id_len - 1] == '\r' || id[id_len - 1] == '\n')) {
        id[--id_len] = '\0';
    }

    while (*pw == ' ') pw++;
    int pw_len = strlen(pw);
    while (pw_len > 0 && (pw[pw_len - 1] == ' ' || pw[pw_len - 1] == '\r' || pw[pw_len - 1] == '\n')) {
        pw[--pw_len] = '\0';
    }

    // Motion 보드 유연 처리: ID나 PW에 MOTION 관련 단어가 있으면 T8_MOTION으로 강제 매핑 및 인증 통과
    int is_motion_candidate = (strstr(id, "MOTION") != NULL || strstr(id, "T8_M") != NULL);

    if (!is_motion_candidate && strcmp(pw, AUTH_PASSWD) != 0) {
        printf("[-] Auth failed for FD %d (ID: '%s', PW: '%s')\n", clients[client_index].fd, id, pw);
        return 0;
    }

    if (is_motion_candidate) {
        id = CLIENT_MOTION; // "T8_MOTION"으로 표준화
    }

    if (strcmp(id, CLIENT_WEB) != 0) {
        for (int j = 0; j < MAX_CLIENTS; j++) {
            if (j != client_index && clients[j].active && strcmp(clients[j].id, id) == 0) {
                printf("[!] Cleaning stale connection for '%s' (Old FD: %d)\n", id, clients[j].fd);
                close(clients[j].fd);
                clients[j].active = 0;
                memset(clients[j].id, 0, ID_SIZE);
            }
        }
    }

    strncpy(clients[client_index].id, id, ID_SIZE - 1);
    clients[client_index].id[ID_SIZE - 1] = '\0';
    printf("[+] Registered client: '%s' (FD: %d)\n", id, clients[client_index].fd);

    char ev[64];
    snprintf(ev, sizeof(ev), "NODE_EVENT@%s@ONLINE", id);
    broadcast_to_web(ev);

    return 1;
}

void route_message(int sender_fd, const char* buf, int len) {
    (void)len;
    char temp[BUF_SIZE];
    strncpy(temp, buf, sizeof(temp) - 1);
    temp[sizeof(temp) - 1] = '\0';

    char* start = strchr(temp, '[');
    char* end = strchr(temp, ']');
    if (!start || !end || end < start) return;

    *end = '\0';
    char* target = start + 1;
    char* payload = end + 1;

    // 만약 이미 등록된 클라이언트가 두 번째로 로그인 패킷([T8_MOTION:PASSWD])을 보냈다면 재등록 처리
    if (strstr(payload, ":PASSWD") != NULL || strstr(payload, ":") != NULL) {
        if (strstr(target, "MOTION") != NULL) {
            for (int i = 0; i < MAX_CLIENTS; i++) {
                if (clients[i].active && clients[i].fd == sender_fd) {
                    strncpy(clients[i].id, CLIENT_MOTION, ID_SIZE - 1);
                    printf("[+] Re-mapped active connection to '%s' (FD: %d)\n", CLIENT_MOTION, sender_fd);
                    char ev[64];
                    snprintf(ev, sizeof(ev), "NODE_EVENT@%s@ONLINE", CLIENT_MOTION);
                    broadcast_to_web(ev);
                    return;
                }
            }
        }
    }

    if (strcmp(target, CLIENT_SERVER) == 0 || strcmp(target, "BROKER") == 0) {
        if (strstr(payload, "GET_CLIENTS") != NULL) {
            send_client_list(sender_fd);
        }
        return;
    }

    char sender_id[ID_SIZE] = "UNKNOWN";
    for (int i = 0; i < MAX_CLIENTS; i++) {
        if (clients[i].active && clients[i].fd == sender_fd) {
            strncpy(sender_id, clients[i].id, ID_SIZE - 1);
            break;
        }
    }

    char routed_pkt[BUF_SIZE];
    snprintf(routed_pkt, sizeof(routed_pkt), "[%s]%s\n", sender_id, payload);
    send_to_id(target, routed_pkt, strlen(routed_pkt));
}

int main(int argc, char* argv[]) {
    int port = SERVER_PORT;
    if (argc > 1) port = atoi(argv[1]);

    int server_fd, client_fd;
    struct sockaddr_in server_addr, client_addr;
    socklen_t client_len = sizeof(client_addr);
    fd_set read_fds;

    for (int i = 0; i < MAX_CLIENTS; i++) {
        clients[i].active = 0;
        clients[i].fd = -1;
        memset(clients[i].id, 0, ID_SIZE);
    }

    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) {
        perror("Socket creation failed");
        exit(EXIT_FAILURE);
    }

    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);
    server_addr.sin_port = htons(port);

    if (bind(server_fd, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("Bind failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    if (listen(server_fd, 15) < 0) {
        perror("Listen failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    printf("===================================================\n");
    printf("[+] IoT Message Router Server Started (Port: %d)\n", port);
    printf("===================================================\n");

    char buffer[BUF_SIZE];

    while (1) {
        FD_ZERO(&read_fds);
        FD_SET(server_fd, &read_fds);
        int max_fd = server_fd;

        for (int i = 0; i < MAX_CLIENTS; i++) {
            if (clients[i].active) {
                FD_SET(clients[i].fd, &read_fds);
                if (clients[i].fd > max_fd) max_fd = clients[i].fd;
            }
        }

        int activity = select(max_fd + 1, &read_fds, NULL, NULL, NULL);
        if ((activity < 0) && (errno != EINTR)) continue;

        if (FD_ISSET(server_fd, &read_fds)) {
            client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &client_len);
            if (client_fd >= 0) {
                int added = 0;
                for (int i = 0; i < MAX_CLIENTS; i++) {
                    if (!clients[i].active) {
                        clients[i].fd = client_fd;
                        clients[i].active = 1;
                        memset(clients[i].id, 0, ID_SIZE);
                        added = 1;
                        break;
                    }
                }
                if (!added) close(client_fd);
            }
        }

        for (int i = 0; i < MAX_CLIENTS; i++) {
            if (clients[i].active && FD_ISSET(clients[i].fd, &read_fds)) {
                int c_fd = clients[i].fd;
                memset(buffer, 0, BUF_SIZE);
                int bytes_read = read(c_fd, buffer, BUF_SIZE - 1);

                if (bytes_read <= 0) {
                    if (strlen(clients[i].id) > 0) {
                        printf("[-] Client disconnected: '%s' (FD: %d)\n", clients[i].id, c_fd);
                        char ev[64];
                        snprintf(ev, sizeof(ev), "NODE_EVENT@%s@OFFLINE", clients[i].id);
                        broadcast_to_web(ev);
                    }
                    close(c_fd);
                    clients[i].active = 0;
                    memset(clients[i].id, 0, ID_SIZE);
                } else {
                    buffer[bytes_read] = '\0';

                    char *saveptr;
                    char *line = strtok_r(buffer, "\r\n", &saveptr);
                    while (line != NULL) {
                        if (strlen(clients[i].id) == 0) {
                            if (!register_client(i, line)) {
                                close(c_fd);
                                clients[i].active = 0;
                                memset(clients[i].id, 0, ID_SIZE);
                                break;
                            }
                        } else {
                            route_message(c_fd, line, strlen(line));
                        }
                        line = strtok_r(NULL, "\r\n", &saveptr);
                    }
                }
            }
        }
    }

    close(server_fd);
    return 0;
}
