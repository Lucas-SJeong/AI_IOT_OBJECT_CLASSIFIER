/*
 * dht.c
 * Original: Nov 20, 2024 / IoT Main
 * Reviewed: 2026-09-29
 * - uninitialized byte fix
 * - response/checksum validation
 * - GPIO wait timeout to prevent infinite blocking
 */

#include <string.h>
#include "dht.h"

static int dht11_read_byte(uint8_t *value);
static int dht11_wait_pin(GPIO_PinState state, uint32_t timeout_us);

uint32_t DWT_Delay_Init(void)
{
    CoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;
    DWT->CTRL &= ~DWT_CTRL_CYCCNTENA_Msk;
    DWT->CYCCNT = 0;
    DWT->CTRL |= DWT_CTRL_CYCCNTENA_Msk;

    __ASM volatile ("NOP");
    __ASM volatile ("NOP");
    __ASM volatile ("NOP");

    return DWT->CYCCNT ? 0U : 1U;
}

void DWT_Delay_us(volatile uint32_t microseconds)
{
    uint32_t clk_cycle_start = DWT->CYCCNT;
    uint32_t cycles_per_us = HAL_RCC_GetHCLKFreq() / 1000000U;
    uint32_t wait_cycles = microseconds * cycles_per_us;

    while((DWT->CYCCNT - clk_cycle_start) < wait_cycles)
    {
    }
}

static int dht11_wait_pin(GPIO_PinState state, uint32_t timeout_us)
{
    uint32_t start = DWT->CYCCNT;
    uint32_t cycles_per_us = HAL_RCC_GetHCLKFreq() / 1000000U;
    uint32_t timeout_cycles = timeout_us * cycles_per_us;

    while(HAL_GPIO_ReadPin(DHT11_PORT, DHT11_PIN) != state)
    {
        if((DWT->CYCCNT - start) >= timeout_cycles)
            return 0;
    }

    return 1;
}

void Set_Pin_Output(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin)
{
    GPIO_InitTypeDef GPIO_InitStruct = {0};

    GPIO_InitStruct.Pin = GPIO_Pin;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    HAL_GPIO_Init(GPIOx, &GPIO_InitStruct);
}

void Set_Pin_Input(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin)
{
    GPIO_InitTypeDef GPIO_InitStruct = {0};

    GPIO_InitStruct.Pin = GPIO_Pin;
    GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    HAL_GPIO_Init(GPIOx, &GPIO_InitStruct);
}

void DHT11_Init(void)
{
    DWT_Delay_Init();
    Set_Pin_Output(DHT11_PORT, DHT11_PIN);
    HAL_GPIO_WritePin(DHT11_PORT, DHT11_PIN, GPIO_PIN_SET);
    HAL_Delay(1000);
}

void DHT11_Start(void)
{
    Set_Pin_Output(DHT11_PORT, DHT11_PIN);
    HAL_GPIO_WritePin(DHT11_PORT, DHT11_PIN, GPIO_PIN_RESET);
    DWT_Delay_us(18000);
    HAL_GPIO_WritePin(DHT11_PORT, DHT11_PIN, GPIO_PIN_SET);
    DWT_Delay_us(20);
    Set_Pin_Input(DHT11_PORT, DHT11_PIN);
}

void DHT11_Stop(void)
{
    Set_Pin_Output(DHT11_PORT, DHT11_PIN);
    HAL_GPIO_WritePin(DHT11_PORT, DHT11_PIN, GPIO_PIN_SET);
}

uint8_t DHT11_Check_Response(void)
{
    /* Sensor response: LOW 약 80us -> HIGH 약 80us -> first data LOW */
    if(!dht11_wait_pin(GPIO_PIN_RESET, 120U))
        return 0;

    if(!dht11_wait_pin(GPIO_PIN_SET, 120U))
        return 0;

    if(!dht11_wait_pin(GPIO_PIN_RESET, 120U))
        return 0;

    return 1;
}

static int dht11_read_byte(uint8_t *value)
{
    uint8_t result = 0;

    if(value == NULL)
        return 0;

    for(uint8_t bit = 0; bit < 8U; bit++)
    {
        /* 각 bit의 50us LOW 구간이 끝날 때까지 대기 */
        if(!dht11_wait_pin(GPIO_PIN_SET, 100U))
            return 0;

        /* HIGH 시작 후 40us 시점: LOW면 0, 아직 HIGH면 1 */
        DWT_Delay_us(40U);
        if(HAL_GPIO_ReadPin(DHT11_PORT, DHT11_PIN) == GPIO_PIN_SET)
            result |= (uint8_t)(1U << (7U - bit));

        /* 다음 bit LOW가 올 때까지 대기 */
        if(!dht11_wait_pin(GPIO_PIN_RESET, 100U))
            return 0;
    }

    *value = result;
    return 1;
}

uint8_t DHT11_Read(void)
{
    uint8_t value = 0;

    if(!dht11_read_byte(&value))
        return 0xFFU;

    return value;
}

DHT11_TypeDef DHT11_readData(void)
{
    DHT11_TypeDef dht11;
    uint8_t sum;

    memset(&dht11, 0, sizeof(dht11));
    dht11.status = 0;

    DHT11_Start();

    if(!DHT11_Check_Response())
    {
        DHT11_Stop();
        return dht11;
    }

    if(!dht11_read_byte(&dht11.rh_byte1) ||
       !dht11_read_byte(&dht11.rh_byte2) ||
       !dht11_read_byte(&dht11.temp_byte1) ||
       !dht11_read_byte(&dht11.temp_byte2) ||
       !dht11_read_byte(&dht11.checksum))
    {
        DHT11_Stop();
        return dht11;
    }

    DHT11_Stop();

    sum = (uint8_t)(dht11.rh_byte1 + dht11.rh_byte2 +
                    dht11.temp_byte1 + dht11.temp_byte2);

    if(sum != dht11.checksum)
        return dht11;

    dht11.status = 1;
    return dht11;
}
