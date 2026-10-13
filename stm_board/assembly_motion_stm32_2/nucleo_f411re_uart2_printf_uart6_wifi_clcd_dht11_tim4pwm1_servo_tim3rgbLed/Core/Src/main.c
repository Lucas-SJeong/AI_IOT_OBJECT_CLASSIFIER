/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.c
  * @brief          : Main program body
  ******************************************************************************
  * @attention
  *
  * Copyright (c) 2024 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  ******************************************************************************
  */
/* USER CODE END Header */
/* Includes ------------------------------------------------------------------*/
#include "main.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "esp.h"
#include "dht.h"
#include "clcd.h"
/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
/* USER CODE BEGIN PTD */

/* USER CODE END PTD */

/* Private define ------------------------------------------------------------*/
/* USER CODE BEGIN PD */
#ifdef __GNUC__
/* With GCC, small printf (option LD Linker->Libraries->Small printf
   set to 'Yes') calls __io_putchar() */
#define PUTCHAR_PROTOTYPE int __io_putchar(int ch)
#else
#define PUTCHAR_PROTOTYPE int fputc(int ch, FILE *f)
#endif /* __GNUC__ */
#define ARR_CNT 5
#define CMD_SIZE 50

/* USER CODE END PD */

/* Private macro -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/
I2C_HandleTypeDef hi2c1;

TIM_HandleTypeDef htim3;
TIM_HandleTypeDef htim4;

UART_HandleTypeDef huart2;
UART_HandleTypeDef huart6;

/* USER CODE BEGIN PV */
uint8_t rx2char;
extern volatile unsigned char rx2Flag;
extern volatile char rx2Data[50];
volatile int tim3Flag1Sec = 0;
volatile unsigned int tim3Sec = 0;
volatile int keyNo = 0;
int servoPulse = 500;
int rgbFlag = 0;
/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_USART2_UART_Init(void);
static void MX_USART6_UART_Init(void);
static void MX_TIM3_Init(void);
static void MX_I2C1_Init(void);
static void MX_TIM4_Init(void);
/* USER CODE BEGIN PFP */
char strBuff[MAX_ESP_MESSAGE_LEN];
void MX_GPIO_LED_ON(int flag);
void MX_GPIO_LED_OFF(int flag);
void esp_event(char *recvBuf);
long map(long x, long in_min, long in_max, long out_min, long out_max);
void set_rgb_led(int red, int green, int blue);
void print_reset_cause(void);
static int parse_int_range(const char *text, int min_value, int max_value, int *out);
/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */

/* USER CODE END 0 */

/**
  * @brief  The application entry point.
  * @retval int
  */
int main(void)
{

  /* USER CODE BEGIN 1 */
	int ret;
	DHT11_TypeDef dht11Data;
	char buff[30];
	int red = 500;
	int green = 500;
	int blue = 500;
  /* USER CODE END 1 */

  /* MCU Configuration--------------------------------------------------------*/

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* USER CODE BEGIN Init */

  /* USER CODE END Init */

  /* Configure the system clock */
  SystemClock_Config();

  /* USER CODE BEGIN SysInit */

  /* USER CODE END SysInit */

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_USART2_UART_Init();
  MX_USART6_UART_Init();
  MX_TIM3_Init();
  MX_I2C1_Init();
  MX_TIM4_Init();
  /* USER CODE BEGIN 2 */
  printf("Start main() - wifi\r\n");
  print_reset_cause();

  /* 로컬 기능은 Wi-Fi 상태와 무관하게 먼저 정상 동작시키는 구조 */
  if(drv_uart_init() != 0)
      printf("UART2 receive init fail\r\n");

  DHT11_Init();
  LCD_init(&hi2c1);
  LCD_writeStringXY(0, 0, "hello lcd       ");

  if(HAL_TIM_Base_Start_IT(&htim3) != HAL_OK)
  {
      Error_Handler();
  }
  if(HAL_TIM_PWM_Start(&htim4, TIM_CHANNEL_1) != HAL_OK)
  {
      Error_Handler();
  }
  __HAL_TIM_SetCompare(&htim4,TIM_CHANNEL_1,(servoPulse-1)<0?0:servoPulse-1);

  __HAL_TIM_SetCompare(&htim3,TIM_CHANNEL_2,(red-1)<0?0:red-1);
  __HAL_TIM_SetCompare(&htim3,TIM_CHANNEL_3,(green-1)<0?0:green-1);
  __HAL_TIM_SetCompare(&htim3,TIM_CHANNEL_4,(blue-1)<0?0:blue-1);
  if(HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_2) != HAL_OK)
  {
      Error_Handler();
  }
  if(HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_3) != HAL_OK)
  {
      Error_Handler();
  }
  if(HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_4) != HAL_OK)
  {
      Error_Handler();
  }

  /* ESP 실패 때문에 Error_Handler()로 들어가 로컬 기능까지 멈추지 않는다. */

  ret = drv_esp_init();
  if(ret == 0)
  {
      ret = AiotClient_Init();
      if(ret == 0)
      {
          printf("ESP/Server ready\r\n");
      }
      else
      {
          printf("ESP network init fail - local mode continues\r\n");
      }
  }
  else
  {
      printf("ESP no response - local mode continues\r\n");
  }

  /* USER CODE END 2 */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
  while (1)
  {
			/* +IPD payload가 완성되면 가져와서 명령 처리 */
			if(esp_get_message(strBuff, sizeof(strBuff)) > 0)
			{
				esp_event(strBuff);
			}

			if(rx2Flag)
			{
				printf("recv2 : %s\r\n",rx2Data);
				rx2Flag = 0;
			}

			/* 버튼/서보 처리는 네트워크 상태와 완전히 독립 */
			if(keyNo != 0)
			{
			  int currentKey = keyNo;
			  keyNo = 0;

			  if((currentKey == 1) && (servoPulse > 500))
			  {
				  servoPulse -= 200;
			  }
			  else if((currentKey == 2) && (servoPulse < 2500))
			  {
				  servoPulse += 200;
			  }

			  __HAL_TIM_SetCompare(&htim4,TIM_CHANNEL_1,(servoPulse-1)<0?0:servoPulse-1);
			  printf("keyNo : %u, servoPulse : %d\r\n",currentKey,servoPulse);
			}

			if(tim3Flag1Sec)
			{
				tim3Flag1Sec = 0;

				/* 주기적 CIPSTATUS/CIPSTART는 제거: 로컬 기능 blocking 방지 */
				if(!(tim3Sec%5))
				{
					dht11Data = DHT11_readData();
					if(dht11Data.status == 1)
					{
						snprintf(buff, sizeof(buff), "h:%d%% t:%d.%dC",
						         dht11Data.rh_byte1,
						         dht11Data.temp_byte1,
						         dht11Data.temp_byte2);
						printf("%s\r\n", buff);
						LCD_writeStringXY(1, 0, "                ");
						LCD_writeStringXY(1, 0, buff);
					}
					else
					{
						printf("DHT11 read/checksum error\r\n");
					}
				}

				if(rgbFlag == 0)
				{
					if(!(tim3Sec%3))
					{
						red = 1000; green = 0; blue = 0;
					}
					else if((tim3Sec%3)==1)
					{
						red = 0; green = 1000; blue = 0;
					}
					else
					{
						red = 0; green = 0; blue = 1000;
					}
					set_rgb_led(red, green, blue);
				}
			}
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
  }
  /* USER CODE END 3 */
}

/**
  * @brief System Clock Configuration
  * @retval None
  */
void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

  /** Configure the main internal regulator output voltage
  */
  __HAL_RCC_PWR_CLK_ENABLE();
  __HAL_PWR_VOLTAGESCALING_CONFIG(PWR_REGULATOR_VOLTAGE_SCALE1);

  /** Initializes the RCC Oscillators according to the specified parameters
  * in the RCC_OscInitTypeDef structure.
  */
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
  RCC_OscInitStruct.HSEState = RCC_HSE_ON;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
  RCC_OscInitStruct.PLL.PLLM = 8;
  RCC_OscInitStruct.PLL.PLLN = 336;
  RCC_OscInitStruct.PLL.PLLP = RCC_PLLP_DIV4;
  RCC_OscInitStruct.PLL.PLLQ = 4;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }

  /** Initializes the CPU, AHB and APB buses clocks
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV2;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_2) != HAL_OK)
  {
    Error_Handler();
  }
}

/**
  * @brief I2C1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_I2C1_Init(void)
{

  /* USER CODE BEGIN I2C1_Init 0 */

  /* USER CODE END I2C1_Init 0 */

  /* USER CODE BEGIN I2C1_Init 1 */

  /* USER CODE END I2C1_Init 1 */
  hi2c1.Instance = I2C1;
  hi2c1.Init.ClockSpeed = 100000;
  hi2c1.Init.DutyCycle = I2C_DUTYCYCLE_2;
  hi2c1.Init.OwnAddress1 = 0;
  hi2c1.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
  hi2c1.Init.DualAddressMode = I2C_DUALADDRESS_DISABLE;
  hi2c1.Init.OwnAddress2 = 0;
  hi2c1.Init.GeneralCallMode = I2C_GENERALCALL_DISABLE;
  hi2c1.Init.NoStretchMode = I2C_NOSTRETCH_DISABLE;
  if (HAL_I2C_Init(&hi2c1) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN I2C1_Init 2 */

  /* USER CODE END I2C1_Init 2 */

}

/**
  * @brief TIM3 Initialization Function
  * @param None
  * @retval None
  */
static void MX_TIM3_Init(void)
{

  /* USER CODE BEGIN TIM3_Init 0 */

  /* USER CODE END TIM3_Init 0 */

  TIM_ClockConfigTypeDef sClockSourceConfig = {0};
  TIM_MasterConfigTypeDef sMasterConfig = {0};
  TIM_OC_InitTypeDef sConfigOC = {0};

  /* USER CODE BEGIN TIM3_Init 1 */

  /* USER CODE END TIM3_Init 1 */
  htim3.Instance = TIM3;
  htim3.Init.Prescaler = 84-1;
  htim3.Init.CounterMode = TIM_COUNTERMODE_UP;
  htim3.Init.Period = 1000-1;
  htim3.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
  htim3.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_ENABLE;
  if (HAL_TIM_Base_Init(&htim3) != HAL_OK)
  {
    Error_Handler();
  }
  sClockSourceConfig.ClockSource = TIM_CLOCKSOURCE_INTERNAL;
  if (HAL_TIM_ConfigClockSource(&htim3, &sClockSourceConfig) != HAL_OK)
  {
    Error_Handler();
  }
  if (HAL_TIM_PWM_Init(&htim3) != HAL_OK)
  {
    Error_Handler();
  }
  sMasterConfig.MasterOutputTrigger = TIM_TRGO_RESET;
  sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
  if (HAL_TIMEx_MasterConfigSynchronization(&htim3, &sMasterConfig) != HAL_OK)
  {
    Error_Handler();
  }
  sConfigOC.OCMode = TIM_OCMODE_PWM1;
  sConfigOC.Pulse = 0;
  sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
  sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
  if (HAL_TIM_PWM_ConfigChannel(&htim3, &sConfigOC, TIM_CHANNEL_1) != HAL_OK)
  {
    Error_Handler();
  }
  if (HAL_TIM_PWM_ConfigChannel(&htim3, &sConfigOC, TIM_CHANNEL_2) != HAL_OK)
  {
    Error_Handler();
  }
  if (HAL_TIM_PWM_ConfigChannel(&htim3, &sConfigOC, TIM_CHANNEL_3) != HAL_OK)
  {
    Error_Handler();
  }
  if (HAL_TIM_PWM_ConfigChannel(&htim3, &sConfigOC, TIM_CHANNEL_4) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN TIM3_Init 2 */

  /* USER CODE END TIM3_Init 2 */
  HAL_TIM_MspPostInit(&htim3);

}

/**
  * @brief TIM4 Initialization Function
  * @param None
  * @retval None
  */
static void MX_TIM4_Init(void)
{

  /* USER CODE BEGIN TIM4_Init 0 */

  /* USER CODE END TIM4_Init 0 */

  TIM_ClockConfigTypeDef sClockSourceConfig = {0};
  TIM_MasterConfigTypeDef sMasterConfig = {0};
  TIM_OC_InitTypeDef sConfigOC = {0};

  /* USER CODE BEGIN TIM4_Init 1 */

  /* USER CODE END TIM4_Init 1 */
  htim4.Instance = TIM4;
  htim4.Init.Prescaler = 84-1;
  htim4.Init.CounterMode = TIM_COUNTERMODE_UP;
  htim4.Init.Period = 20000-1;
  htim4.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
  htim4.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_DISABLE;
  if (HAL_TIM_Base_Init(&htim4) != HAL_OK)
  {
    Error_Handler();
  }
  sClockSourceConfig.ClockSource = TIM_CLOCKSOURCE_INTERNAL;
  if (HAL_TIM_ConfigClockSource(&htim4, &sClockSourceConfig) != HAL_OK)
  {
    Error_Handler();
  }
  if (HAL_TIM_PWM_Init(&htim4) != HAL_OK)
  {
    Error_Handler();
  }
  sMasterConfig.MasterOutputTrigger = TIM_TRGO_RESET;
  sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
  if (HAL_TIMEx_MasterConfigSynchronization(&htim4, &sMasterConfig) != HAL_OK)
  {
    Error_Handler();
  }
  sConfigOC.OCMode = TIM_OCMODE_PWM1;
  sConfigOC.Pulse = 500;
  sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
  sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
  if (HAL_TIM_PWM_ConfigChannel(&htim4, &sConfigOC, TIM_CHANNEL_1) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN TIM4_Init 2 */

  /* USER CODE END TIM4_Init 2 */
  HAL_TIM_MspPostInit(&htim4);

}

/**
  * @brief USART2 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART2_UART_Init(void)
{

  /* USER CODE BEGIN USART2_Init 0 */

  /* USER CODE END USART2_Init 0 */

  /* USER CODE BEGIN USART2_Init 1 */

  /* USER CODE END USART2_Init 1 */
  huart2.Instance = USART2;
  huart2.Init.BaudRate = 38400;
  huart2.Init.WordLength = UART_WORDLENGTH_8B;
  huart2.Init.StopBits = UART_STOPBITS_1;
  huart2.Init.Parity = UART_PARITY_NONE;
  huart2.Init.Mode = UART_MODE_TX_RX;
  huart2.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart2.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart2) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART2_Init 2 */

  /* USER CODE END USART2_Init 2 */

}

/**
  * @brief USART6 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART6_UART_Init(void)
{

  /* USER CODE BEGIN USART6_Init 0 */

  /* USER CODE END USART6_Init 0 */

  /* USER CODE BEGIN USART6_Init 1 */

  /* USER CODE END USART6_Init 1 */
  huart6.Instance = USART6;
  huart6.Init.BaudRate = 38400;
  huart6.Init.WordLength = UART_WORDLENGTH_8B;
  huart6.Init.StopBits = UART_STOPBITS_1;
  huart6.Init.Parity = UART_PARITY_NONE;
  huart6.Init.Mode = UART_MODE_TX_RX;
  huart6.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart6.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart6) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART6_Init 2 */

  /* USER CODE END USART6_Init 2 */

}

/**
  * @brief GPIO Initialization Function
  * @param None
  * @retval None
  */
static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  /* USER CODE BEGIN MX_GPIO_Init_1 */
  /* USER CODE END MX_GPIO_Init_1 */

  /* GPIO Ports Clock Enable */
  __HAL_RCC_GPIOC_CLK_ENABLE();
  __HAL_RCC_GPIOH_CLK_ENABLE();
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(LD2_GPIO_Port, LD2_Pin, GPIO_PIN_RESET);

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(DHT11_GPIO_Port, DHT11_Pin, GPIO_PIN_RESET);

  /*Configure GPIO pin : B1_Pin */
  GPIO_InitStruct.Pin = B1_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  HAL_GPIO_Init(B1_GPIO_Port, &GPIO_InitStruct);

  /*Configure GPIO pin : PC0_EXTI0_BUTTON_Pin */
  GPIO_InitStruct.Pin = PC0_EXTI0_BUTTON_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_IT_RISING;
  GPIO_InitStruct.Pull = GPIO_PULLDOWN;
  HAL_GPIO_Init(PC0_EXTI0_BUTTON_GPIO_Port, &GPIO_InitStruct);

  /*Configure GPIO pin : LD2_Pin */
  GPIO_InitStruct.Pin = LD2_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(LD2_GPIO_Port, &GPIO_InitStruct);

  /*Configure GPIO pin : DHT11_Pin */
  GPIO_InitStruct.Pin = DHT11_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(DHT11_GPIO_Port, &GPIO_InitStruct);

  /* EXTI interrupt init*/
  HAL_NVIC_SetPriority(EXTI0_IRQn, 0, 0);
  HAL_NVIC_EnableIRQ(EXTI0_IRQn);

  HAL_NVIC_SetPriority(EXTI15_10_IRQn, 0, 0);
  HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);

  /* USER CODE BEGIN MX_GPIO_Init_2 */
  /* USER CODE END MX_GPIO_Init_2 */
}

/* USER CODE BEGIN 4 */
void MX_GPIO_LED_ON(int pin)
{
    HAL_GPIO_WritePin(LD2_GPIO_Port, pin, GPIO_PIN_SET);
}

void MX_GPIO_LED_OFF(int pin)
{
    HAL_GPIO_WritePin(LD2_GPIO_Port, pin, GPIO_PIN_RESET);
}

static int parse_int_range(const char *text, int min_value, int max_value, int *out)
{
    char *endptr;
    long value;

    if(text == NULL || out == NULL || *text == '\0')
        return 0;

    value = strtol(text, &endptr, 10);
    if(*endptr != '\0')
        return 0;

    if(value < min_value || value > max_value)
        return 0;

    *out = (int)value;
    return 1;
}

void esp_event(char *recvBuf)
{
    int i = 0;
    char *pToken;
    char *pArray[ARR_CNT] = {0};
    char sendBuf[MAX_ESP_COMMAND_LEN] = {0};
    size_t recvLen;

    if(recvBuf == NULL)
        return;

    recvLen = strlen(recvBuf);
    while(recvLen > 0 &&
          (recvBuf[recvLen - 1] == '\n' || recvBuf[recvLen - 1] == '\r'))
    {
        recvBuf[--recvLen] = '\0';
    }

    printf("\r\nDebug recv : %s\r\n", recvBuf);

    pToken = strtok(recvBuf, "[@]");
    while(pToken != NULL && i < ARR_CNT)
    {
        pArray[i++] = pToken;
        pToken = strtok(NULL, "[@]");
    }

    if(i < 2 || pArray[0] == NULL || pArray[1] == NULL)
        return;

    if(!strcmp(pArray[1], "PLUG"))
    {
        if(i < 3 || pArray[2] == NULL)
            return;

        if(!strcmp(pArray[2], "ON"))
            MX_GPIO_LED_ON(LD2_Pin);
        else if(!strcmp(pArray[2], "OFF"))
            MX_GPIO_LED_OFF(LD2_Pin);
        else
            return;

        snprintf(sendBuf, sizeof(sendBuf),
                 "[%s]%s@%s\n", pArray[0], pArray[1], pArray[2]);
    }
    else if(!strcmp(pArray[1], "SERVO"))
    {
        int degree;
        int value;

        if(i < 3 || !parse_int_range(pArray[2], 0, 180, &degree))
        {
            printf("SERVO value error\r\n");
            return;
        }

        value = (int)map(degree, 0, 180, 500, 2500);
        servoPulse = value;
        __HAL_TIM_SetCompare(&htim4, TIM_CHANNEL_1,
                             (servoPulse - 1) < 0 ? 0 : servoPulse - 1);

        snprintf(sendBuf, sizeof(sendBuf),
                 "[%s]%s@%d\n", pArray[0], pArray[1], degree);
    }
    else if(!strcmp(pArray[1], "RGB"))
    {
        if(i < 3 || pArray[2] == NULL)
            return;

        if(!strcmp(pArray[2], "OFF"))
        {
            rgbFlag = 1;
            set_rgb_led(0, 0, 0);
            snprintf(sendBuf, sizeof(sendBuf),
                     "[%s]%s@OFF\n", pArray[0], pArray[1]);
        }
        else
        {
            int r, g, b;

            if(i < 5 ||
               !parse_int_range(pArray[2], 0, 100, &r) ||
               !parse_int_range(pArray[3], 0, 100, &g) ||
               !parse_int_range(pArray[4], 0, 100, &b))
            {
                printf("RGB value error\r\n");
                return;
            }

            rgbFlag = 1;
            set_rgb_led(r * 10, g * 10, b * 10);
            snprintf(sendBuf, sizeof(sendBuf),
                     "[%s]%s@%d@%d@%d\n",
                     pArray[0], pArray[1], r, g, b);
        }
    }
    else if(!strncmp(pArray[1], " New conn", 8))
    {
        return;
    }
    else if(!strncmp(pArray[1], " Already log", 8))
    {
        return;
    }
    else
    {
        return;
    }

    if(esp_send_data(sendBuf) == 0)
        printf("Debug send : %s\r\n", sendBuf);
    else
        printf("Debug send fail (server offline)\r\n");
}

void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    static int tim3Cnt = 0;

    if(htim->Instance != TIM3)
        return;

    tim3Cnt++;
    if(tim3Cnt >= 1000)
    {
        tim3Flag1Sec = 1;
        tim3Sec++;
        tim3Cnt = 0;
    }
}

void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
    static uint32_t lastPc0Tick = 0;
    static uint32_t lastB1Tick = 0;
    uint32_t now = HAL_GetTick();

    switch(GPIO_Pin)
    {
        case GPIO_PIN_0:
            if(lastPc0Tick == 0 || (now - lastPc0Tick) >= 80U)
            {
                keyNo = 1;
                lastPc0Tick = now;
            }
            break;

        case GPIO_PIN_13:
            if(lastB1Tick == 0 || (now - lastB1Tick) >= 80U)
            {
                keyNo = 2;
                lastB1Tick = now;
            }
            break;

        default:
            break;
    }
}

long map(long x, long in_min, long in_max, long out_min, long out_max)
{
    return (x - in_min) * (out_max - out_min) /
           (in_max - in_min) + out_min;
}

void set_rgb_led(int red, int green, int blue)
{
    if(red < 0) red = 0;
    if(red > 1000) red = 1000;
    if(green < 0) green = 0;
    if(green > 1000) green = 1000;
    if(blue < 0) blue = 0;
    if(blue > 1000) blue = 1000;

    __HAL_TIM_SetCompare(&htim3, TIM_CHANNEL_2, red > 0 ? red - 1 : 0);
    __HAL_TIM_SetCompare(&htim3, TIM_CHANNEL_3, green > 0 ? green - 1 : 0);
    __HAL_TIM_SetCompare(&htim3, TIM_CHANNEL_4, blue > 0 ? blue - 1 : 0);
}

void print_reset_cause(void)
{
    printf("Reset cause :");

    if(__HAL_RCC_GET_FLAG(RCC_FLAG_BORRST))  printf(" BOR");
    if(__HAL_RCC_GET_FLAG(RCC_FLAG_PORRST))  printf(" POR/PDR");
    if(__HAL_RCC_GET_FLAG(RCC_FLAG_PINRST))  printf(" PIN");
    if(__HAL_RCC_GET_FLAG(RCC_FLAG_SFTRST))  printf(" SOFTWARE");
    if(__HAL_RCC_GET_FLAG(RCC_FLAG_IWDGRST)) printf(" IWDG");
    if(__HAL_RCC_GET_FLAG(RCC_FLAG_WWDGRST)) printf(" WWDG");
    if(__HAL_RCC_GET_FLAG(RCC_FLAG_LPWRRST)) printf(" LOWPOWER");

    printf("\r\n");
    __HAL_RCC_CLEAR_RESET_FLAGS();
}
/* USER CODE END 4 */

/**
  * @brief  This function is executed in case of error occurrence.
  * @retval None
  */
void Error_Handler(void)
{
  /* USER CODE BEGIN Error_Handler_Debug */
  /* User can add his own implementation to report the HAL error return state */
  __disable_irq();
  while (1)
  {
  }
  /* USER CODE END Error_Handler_Debug */
}
#ifdef USE_FULL_ASSERT
/**
  * @brief  Reports the name of the source file and the source line number
  *         where the assert_param error has occurred.
  * @param  file: pointer to the source file name
  * @param  line: assert_param error line source number
  * @retval None
  */
void assert_failed(uint8_t *file, uint32_t line)
{
  /* USER CODE BEGIN 6 */
  /* User can add his own implementation to report the file name and line number,
     ex: printf("Wrong parameters value: file %s on line %d\r\n", file, line) */
  /* USER CODE END 6 */
}
#endif /* USE_FULL_ASSERT */
