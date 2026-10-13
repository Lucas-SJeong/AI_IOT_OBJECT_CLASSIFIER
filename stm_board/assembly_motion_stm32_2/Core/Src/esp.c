#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "esp.h"

static char ip_addr[16];
static char response[MAX_ESP_RX_BUFFER];
extern UART_HandleTypeDef huart2;
volatile unsigned char rx2Flag = 0;
volatile char rx2Data[50];
static uint8_t cdata;
extern UART_HandleTypeDef huart6;
static uint8_t data;

typedef struct
{
    uint8_t buf[MAX_ESP_RX_BUFFER];
    volatile uint16_t length;
} esp_rx_buffer_t;

static esp_rx_buffer_t at_data;
static volatile uint8_t at_busy = 0;
static char ipd_message[MAX_ESP_MESSAGE_LEN];
static volatile uint16_t ipd_message_len = 0;
static volatile uint8_t ipd_ready = 0;
static volatile uint8_t tcp_connected = 0;

static void esp_ipd_feed(uint8_t ch)
{
    enum { IPD_WAIT = 0, IPD_PREFIX, IPD_LENGTH, IPD_PAYLOAD };
    static uint8_t state = IPD_WAIT;
    static uint8_t prefix_index = 0;
    static uint32_t payload_length = 0;
    static uint32_t payload_count = 0;
    static const char prefix[] = "+IPD,";

    switch(state)
    {
        case IPD_WAIT:
            if(ch == '+') { state = IPD_PREFIX; prefix_index = 1; }
            break;
        case IPD_PREFIX:
            if(ch == (uint8_t)prefix[prefix_index])
            {
                prefix_index++;
                if(prefix[prefix_index] == '\0') { state = IPD_LENGTH; payload_length = 0; }
            }
            else
            {
                state = (ch == '+') ? IPD_PREFIX : IPD_WAIT;
                prefix_index = (ch == '+') ? 1 : 0;
            }
            break;
        case IPD_LENGTH:
            if(ch >= '0' && ch <= '9')
            {
                payload_length = payload_length * 10U + (uint32_t)(ch - '0');
                if(payload_length > 65535U) { state = IPD_WAIT; prefix_index = 0; }
            }
            else if(ch == ':' && payload_length > 0U)
            {
                payload_count = 0;
                state = IPD_PAYLOAD;
            }
            else { state = IPD_WAIT; prefix_index = 0; }
            break;
        case IPD_PAYLOAD:
            if(!ipd_ready && payload_count < (MAX_ESP_MESSAGE_LEN - 1U))
                ipd_message[payload_count] = (char)ch;
            payload_count++;
            if(payload_count >= payload_length)
            {
                if(!ipd_ready)
                {
                    uint32_t stored = payload_length;
                    if(stored >= MAX_ESP_MESSAGE_LEN) stored = MAX_ESP_MESSAGE_LEN - 1U;
                    ipd_message[stored] = '\0';
                    ipd_message_len = (uint16_t)stored;
                    ipd_ready = 1;
                }
                state = IPD_WAIT; prefix_index = 0; payload_length = 0; payload_count = 0;
            }
            break;
        default:
            state = IPD_WAIT; prefix_index = 0; payload_length = 0; payload_count = 0;
            break;
    }
}

static void esp_closed_feed(uint8_t ch)
{
    static const char token[] = "CLOSED";
    static uint8_t index = 0;
    if(ch == (uint8_t)token[index])
    {
        index++;
        if(token[index] == '\0') { tcp_connected = 0; index = 0; }
    }
    else index = (ch == 'C') ? 1U : 0U;
}

static void esp_copy_response(uint8_t *resp, uint16_t *length)
{
    uint16_t copy_len = at_data.length;
    if(copy_len >= MAX_ESP_RX_BUFFER) copy_len = MAX_ESP_RX_BUFFER - 1U;
    memcpy(resp, at_data.buf, copy_len);
    resp[copy_len] = '\0';
    *length = copy_len;
}

static int esp_at_command_expect(const uint8_t *cmd, uint8_t *resp, uint16_t *length, int32_t timeout_ms, const char *ok_token)
{
    memset(resp, 0x00, MAX_ESP_RX_BUFFER);
    memset((void *)&at_data, 0x00, sizeof(at_data));
    *length = 0;
    at_busy = 1;
    if(HAL_UART_Transmit(&huart6, (uint8_t *)cmd, (uint16_t)strlen((const char *)cmd), 100) != HAL_OK)
    { at_busy = 0; return -1; }
    while(timeout_ms > 0)
    {
        if(at_data.length >= (MAX_ESP_RX_BUFFER - 1U))
        { at_busy = 0; esp_copy_response(resp, length); return -2; }
        if(strstr((char *)at_data.buf, ok_token) != NULL)
        { at_busy = 0; esp_copy_response(resp, length); return 0; }
        if(strstr((char *)at_data.buf, "ERROR") != NULL || strstr((char *)at_data.buf, "FAIL") != NULL)
        { at_busy = 0; esp_copy_response(resp, length); return -3; }
        HAL_Delay(10);
        timeout_ms -= 10;
    }
    at_busy = 0;
    esp_copy_response(resp, length);
    return -4;
}

static int esp_at_command(const uint8_t *cmd, uint8_t *resp, uint16_t *length, int32_t timeout_ms)
{
    return esp_at_command_expect(cmd, resp, length, timeout_ms, "OK");
}

static int esp_test_at(void)
{
    uint16_t length = 0;
    for(int retry = 0; retry < 3; retry++)
    {
        if(esp_at_command((const uint8_t *)"AT\r\n", (uint8_t *)response, &length, 500) == 0) return 0;
        HAL_Delay(100);
    }
    return -1;
}

static int esp_ap_is_connected(const char *ssid)
{
    uint16_t length = 0;
    char expected[48];
    if(esp_at_command((const uint8_t *)"AT+CWJAP?\r\n", (uint8_t *)response, &length, 1000) != 0) return 0;
    snprintf(expected, sizeof(expected), "+CWJAP:\"%s\"", ssid);
    return (strstr(response, expected) != NULL) ? 1 : 0;
}

static int esp_join_ap(const char *ssid, const char *passwd)
{
    uint16_t length = 0;
    char at_cmd[MAX_ESP_COMMAND_LEN] = {0};
    if(esp_ap_is_connected(ssid)) { printf("WiFi already connected : %s\r\n", ssid); return 0; }
    if(esp_at_command((const uint8_t *)"AT+CWMODE=1\r\n", (uint8_t *)response, &length, 1000) != 0)
    { printf("Station mode fail : %s\r\n", response); return -1; }
    snprintf(at_cmd, sizeof(at_cmd), "AT+CWJAP=\"%s\",\"%s\"\r\n", ssid, passwd);
    if(esp_at_command((const uint8_t *)at_cmd, (uint8_t *)response, &length, 6000) != 0)
    { printf("AP connect fail : %s\r\n", response); return -1; }
    printf("WiFi connected : %s\r\n", ssid);
    return 0;
}

static int request_ip_addr(void)
{
    uint16_t length = 0;
    char *start; char *end; size_t copy_len;
    if(esp_at_command((const uint8_t *)"AT+CIFSR\r\n", (uint8_t *)response, &length, 1000) != 0)
    { printf("request ip_addr command fail : %s\r\n", response); return -1; }
    start = strstr(response, "+CIFSR:STAIP,\"");
    if(start == NULL) { printf("ESP IP parse fail\r\n"); return -1; }
    start += strlen("+CIFSR:STAIP,\"");
    end = strchr(start, '\"');
    if(end == NULL) return -1;
    copy_len = (size_t)(end - start);
    if(copy_len >= sizeof(ip_addr)) copy_len = sizeof(ip_addr) - 1U;
    memset(ip_addr, 0, sizeof(ip_addr));
    memcpy(ip_addr, start, copy_len);
    if(strcmp(ip_addr, "0.0.0.0") == 0) return -1;
    printf("ESP IP : %s\r\n", ip_addr);
    return 0;
}

int esp_get_status(void)
{
    uint16_t length = 0;
    int ret = esp_at_command((const uint8_t *)"AT+CIPSTATUS\r\n", (uint8_t *)response, &length, 1000);
    if(ret == 0 && strstr(response, "STATUS:3") != NULL) { tcp_connected = 1; return 0; }
    tcp_connected = 0;
    return -1;
}

int esp_client_conn(void)
{
    char at_cmd[MAX_ESP_COMMAND_LEN] = {0};
    uint16_t length = 0;
    int ret;
    if(esp_get_status() == 0) { printf("TCP already connected\r\n"); return 0; }
    if(esp_at_command((const uint8_t *)"AT+CIPMUX=0\r\n", (uint8_t *)response, &length, 1000) != 0)
    { printf("CIPMUX setup fail : %s\r\n", response); return -1; }
    if(esp_at_command((const uint8_t *)"AT+CIPMODE=0\r\n", (uint8_t *)response, &length, 1000) != 0)
    { printf("CIPMODE setup fail : %s\r\n", response); return -1; }
    snprintf(at_cmd, sizeof(at_cmd), "AT+CIPSTART=\"TCP\",\"%s\",%d\r\n", DST_IP, DST_PORT);
    ret = esp_at_command((const uint8_t *)at_cmd, (uint8_t *)response, &length, 3000);
    if(ret != 0)
    {
        if(strstr(response, "ALREADY CONNECTED") != NULL) { tcp_connected = 1; printf("TCP already connected\r\n"); return 0; }
        tcp_connected = 0; printf("TCP connect fail(%d) : %s\r\n", ret, response); return -1;
    }
    tcp_connected = 1;
    printf("TCP connected : %s:%d\r\n", DST_IP, DST_PORT);
    if(esp_send_data("[" LOGID ":" PASSWD "]") != 0) { printf("server login send fail\r\n"); return -1; }
    return 0;
}

int drv_esp_init(void)
{
    memset(ip_addr, 0x00, sizeof(ip_addr));
    memset((void *)&at_data, 0x00, sizeof(at_data));
    memset(ipd_message, 0x00, sizeof(ipd_message));
    ipd_message_len = 0; ipd_ready = 0; at_busy = 0; tcp_connected = 0;
    if(HAL_UART_Receive_IT(&huart6, &data, 1) != HAL_OK) return -1;
    if(esp_test_at() != 0) return -1;
    return 0;
}

int AiotClient_Init(void)
{
    if(esp_join_ap(SSID, PASS) != 0) return -1;
    if(request_ip_addr() != 0) return -1;
    if(esp_client_conn() != 0) return -1;
    return 0;
}

int esp_send_data(const char *data_buf)
{
    char at_cmd[MAX_ESP_COMMAND_LEN] = {0};
    uint16_t length = 0;
    if(data_buf == NULL || data_buf[0] == '\0') return -1;
    if(!tcp_connected) return -1;
    snprintf(at_cmd, sizeof(at_cmd), "AT+CIPSEND=%u\r\n", (unsigned int)strlen(data_buf));
    if(esp_at_command_expect((const uint8_t *)at_cmd, (uint8_t *)response, &length, 1200, ">") != 0)
    { tcp_connected = 0; printf("CIPSEND fail : %s\r\n", response); return -1; }
    if(esp_at_command_expect((const uint8_t *)data_buf, (uint8_t *)response, &length, 1500, "SEND OK") != 0)
    { tcp_connected = 0; printf("send data fail : %s\r\n", response); return -1; }
    return 0;
}

int esp_get_message(char *out, uint16_t out_size)
{
    uint16_t len; uint32_t primask;
    if(out == NULL || out_size < 2U) return 0;
    primask = __get_PRIMASK();
    __disable_irq();
    if(!ipd_ready) { if(!primask) __enable_irq(); return 0; }
    len = ipd_message_len;
    if(len >= out_size) len = out_size - 1U;
    memcpy(out, ipd_message, len);
    out[len] = '\0';
    ipd_ready = 0; ipd_message_len = 0;
    if(!primask) __enable_irq();
    return (int)len;
}

int esp_is_server_connected(void) { return tcp_connected ? 1 : 0; }

void reset_func(void)
{
    uint16_t length = 0;
    printf("esp reset... ");
    if(esp_at_command((const uint8_t *)"AT+RST\r\n", (uint8_t *)response, &length, 1500) == 0)
    { printf("OK\r\n"); HAL_Delay(1500); }
    else printf("fail : %s\r\n", response);
}

void version_func(void)
{
    uint16_t length = 0;
    printf("esp firmware version\r\n");
    if(esp_at_command((const uint8_t *)"AT+GMR\r\n", (uint8_t *)response, &length, 1000) == 0) printf("%s\r\n", response);
    else printf("version command fail : %s\r\n", response);
}

void ip_state_func(void)
{
    uint16_t length = 0;
    if(esp_at_command((const uint8_t *)"AT+CWJAP?\r\n", (uint8_t *)response, &length, 1000) == 0) printf("%s\r\n", response);
    else printf("ap connected info command fail : %s\r\n", response);
    request_ip_addr();
}

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    if(huart->Instance == USART6)
    {
        if(at_busy && at_data.length < (MAX_ESP_RX_BUFFER - 1U))
        {
            at_data.buf[at_data.length++] = data;
            at_data.buf[at_data.length] = '\0';
        }
        esp_ipd_feed(data);
        esp_closed_feed(data);
        HAL_UART_Receive_IT(huart, &data, 1);
    }
    if(huart->Instance == USART2)
    {
        static uint8_t i = 0;
        if(cdata == '\r' || cdata == '\n')
        {
            if(i > 0U) { rx2Data[i] = '\0'; rx2Flag = 1; i = 0; }
        }
        else if(i < (sizeof(rx2Data) - 1U)) rx2Data[i++] = (char)cdata;
        else { rx2Data[sizeof(rx2Data) - 1U] = '\0'; rx2Flag = 1; i = 0; }
        HAL_UART_Receive_IT(huart, &cdata, 1);
    }
}

int drv_uart_init(void) { return (HAL_UART_Receive_IT(&huart2, &cdata, 1) == HAL_OK) ? 0 : -1; }
int drv_uart_tx_buffer(uint8_t *buf, uint16_t size)
{
    if(HAL_UART_Transmit(&huart2, buf, size, 100) != HAL_OK) return -1;
    return 0;
}
int __io_putchar(int ch)
{
    if(HAL_UART_Transmit(&huart2, (uint8_t *)&ch, 1, 10) == HAL_OK) return ch;
    return -1;
}
