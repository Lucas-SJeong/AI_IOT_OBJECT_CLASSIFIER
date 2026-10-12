#ifndef PROTOCOL_H
#define PROTOCOL_H

#define SERVER_PORT     8080
#define MAX_CLIENTS     32
#define BUF_SIZE        2048
#define ID_SIZE         32
#define PASSWD_SIZE     32

#define AUTH_PASSWD     "PASSWD"

// 클라이언트 식별자
#define CLIENT_CTRL     "T8_CTRL"
#define CLIENT_HMI      "T8_HMI"
#define CLIENT_MOTION   "T8_MOTION"
#define CLIENT_VISION   "T8_VISION"
#define CLIENT_WEB      "T8_WEB"
#define CLIENT_SERVER   "SERVER"

// 공정 FSM 머신 상태
#define STATE_READY     "READY"
#define STATE_IDLE      "READY"
#define STATE_WORKING   "WORKING"
#define STATE_INSPECT   "INSPECTING"
#define STATE_PASS      "PASS"
#define STATE_FAIL      "FAIL"
#define STATE_ESTOP     "ESTOP"

// 공정 운전 모드
#define MODE_AUTO       "AUTO"
#define MODE_MANUAL     "MANUAL"

#endif // PROTOCOL_H
