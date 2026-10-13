//서울기술교육센터 AIOT & Embedded System
//2024-04-16 By KSH
//2026-09-29 reviewed version

#ifndef __ESP_H__
#define __ESP_H__

#include "stm32f4xx_hal.h"

#define MAX_ESP_RX_BUFFER      1024
#define MAX_ESP_COMMAND_LEN    64
#define MAX_ESP_MESSAGE_LEN    160

#define SSID "kcci603"
#define PASS "@kcci603!"
#define LOGID "SJH_ARD"
#define PASSWD "PASSWD"
#define DST_IP "10.10.16.77"
#define DST_PORT 5000

int drv_esp_init(void);
int AiotClient_Init(void);
int esp_client_conn(void);
int esp_get_status(void);
int esp_send_data(const char *data);
int esp_get_message(char *out, uint16_t out_size);
int esp_is_server_connected(void);

void reset_func(void);
void version_func(void);
void ip_state_func(void);

int drv_uart_init(void);
int drv_uart_tx_buffer(uint8_t *buf, uint16_t size);

#endif /* __ESP_H__ */
