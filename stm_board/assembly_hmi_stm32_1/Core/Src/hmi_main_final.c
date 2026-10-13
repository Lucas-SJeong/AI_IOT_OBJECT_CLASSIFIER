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
#include "clcd.h"
/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
/* USER CODE BEGIN PTD */

/* USER CODE END PTD */

/* Private define ------------------------------------------------------------*/
/* USER CODE BEGIN PD */
#ifdef __GNUC__
#define PUTCHAR_PROTOTYPE int __io_putchar(int ch)
#else
#define PUTCHAR_PROTOTYPE int fputc(int ch, FILE *f)
#endif

#define ARR_CNT                 4
#define CMD_SIZE                128
#define BT_RX_QUEUE_SIZE        8
#define BUTTON_DEBOUNCE_MS      30U
#define ESTOP_CLEAR_HOLD_MS     2000U
#define POT_DEADBAND             50U
#define POT_READ_PERIOD_MS      200U
/* USER CODE END PD */

/* Private macro -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/
ADC_HandleTypeDef hadc1;

I2C_HandleTypeDef hi2c3;

UART_HandleTypeDef huart2;
UART_HandleTypeDef huart6;

/* USER CODE BEGIN PV */
volatile uint8_t estopEvent = 0;
volatile uint8_t estopLatched = 0;

uint8_t btchar;
char btData[CMD_SIZE];
char btRxQueue[BT_RX_QUEUE_SIZE][CMD_SIZE];
volatile uint8_t btRxHead = 0;
volatile uint8_t btRxTail = 0;
volatile uint32_t btRxDropCount = 0;

GPIO_PinState startRawPrev = GPIO_PIN_SET;
GPIO_PinState startStable = GPIO_PIN_SET;
uint32_t startChangeTick = 0;

GPIO_PinState checkRawPrev = GPIO_PIN_SET;
GPIO_PinState checkStable = GPIO_PIN_SET;
uint32_t checkChangeTick = 0;

GPIO_PinState endRawPrev = GPIO_PIN_SET;
GPIO_PinState endStable = GPIO_PIN_SET;
uint32_t endChangeTick = 0;
uint32_t endPressTick = 0;
uint8_t estopClearSent = 0;

GPIO_PinState modeRawPrev = GPIO_PIN_SET;
GPIO_PinState modeStable = GPIO_PIN_SET;
uint32_t modeChangeTick = 0;

uint8_t manualMode = 0;   /* 0=AUTO, 1=MANUAL */
uint16_t potValue = 0;
uint32_t potReadTick = 0;
uint16_t potAccepted = 0;
uint8_t potInitialized = 0;
uint16_t trayAngle = 90;

typedef enum
{
    HMI_READY = 0,
    HMI_WORKING,
    HMI_INSPECTING,
    HMI_PASS,
    HMI_FAIL,
    HMI_ESTOP
} HMI_State;

HMI_State hmiState = HMI_READY;
uint32_t rgbBlinkTick = 0;
uint8_t rgbBlinkState = 0;
/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_USART2_UART_Init(void);
static void MX_USART6_UART_Init(void);
static void MX_I2C3_Init(void);
static void MX_ADC1_Init(void);

/* USER CODE BEGIN PFP */
void bluetooth_Event(void);
void RGB_Set(uint8_t r, uint8_t g, uint8_t b);
void RGB_Update(void);
void HMI_ShowMode(void);
static void HMI_Send(const char *message);
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
  MX_I2C3_Init();
  MX_ADC1_Init();
  /* USER CODE BEGIN 2 */
if(HAL_UART_Receive_IT(&huart6, &btchar, 1) != HAL_OK)
  {
      Error_Handler();
  }

  startRawPrev = HAL_GPIO_ReadPin(START_BTN_GPIO_Port, START_BTN_Pin);
  startStable = startRawPrev;
  startChangeTick = HAL_GetTick();

  checkRawPrev = HAL_GPIO_ReadPin(CHECK_BTN_GPIO_Port, CHECK_BTN_Pin);
  checkStable = checkRawPrev;
  checkChangeTick = HAL_GetTick();

  endRawPrev = HAL_GPIO_ReadPin(END_BTN_GPIO_Port, END_BTN_Pin);
  endStable = endRawPrev;
  endChangeTick = HAL_GetTick();

  modeRawPrev = HAL_GPIO_ReadPin(MODE_SW_GPIO_Port, MODE_SW_Pin);
  modeStable = modeRawPrev;
  modeChangeTick = HAL_GetTick();

  manualMode = 0;

  LCD_init(&hi2c3);
  LCD_writeStringXY(0, 0, "HMI READY       ");
  LCD_writeStringXY(1, 0, "MODE: AUTO      ");

  hmiState = HMI_READY;
  rgbBlinkTick = HAL_GetTick();
  rgbBlinkState = 0;
  RGB_Set(0, 0, 0);

  printf("HMI BOOT / MODE INIT -> AUTO\r\n");
  printf("ESTOP latch = %u\r\n", estopLatched);

  /* 중앙제어의 실제 상태/MODE를 부팅 직후 다시 받는다. */
  HMI_Send("[T8_CTRL]SYNC\n");
  printf("HMI SYNC -> BT TX\r\n");
/* USER CODE END 2 */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
while (1)
  {
      static uint32_t lastDropCount = 0;

      /* Bluetooth RX queue를 메인 루프에서 순서대로 처리 */
      while(btRxTail != btRxHead)
      {
          uint8_t tail = btRxTail;

          strncpy(btData, btRxQueue[tail], CMD_SIZE - 1U);
          btData[CMD_SIZE - 1U] = '\0';

          btRxTail = (uint8_t)((tail + 1U) % BT_RX_QUEUE_SIZE);

          printf("BT RX : %s\r\n", btData);
          bluetooth_Event();
      }

      if(lastDropCount != btRxDropCount)
      {
          lastDropCount = btRxDropCount;
          printf("BT RX DROP COUNT = %lu\r\n", (unsigned long)lastDropCount);
      }

      /* START button */
      {
          GPIO_PinState raw = HAL_GPIO_ReadPin(START_BTN_GPIO_Port, START_BTN_Pin);

          if(raw != startRawPrev)
          {
              startRawPrev = raw;
              startChangeTick = HAL_GetTick();
          }

          if((HAL_GetTick() - startChangeTick >= BUTTON_DEBOUNCE_MS) &&
             (raw != startStable))
          {
              startStable = raw;

              if((startStable == GPIO_PIN_RESET) && !estopLatched)
              {
                  if(manualMode)
                      printf("START IGNORED : MANUAL MODE\r\n");
                  else
                  {
                      HMI_Send("[T8_CTRL]START\n");
                      printf("START button -> BT TX\r\n");
                  }
              }
          }
      }

      /* CHECK button */
      {
          GPIO_PinState raw = HAL_GPIO_ReadPin(CHECK_BTN_GPIO_Port, CHECK_BTN_Pin);

          if(raw != checkRawPrev)
          {
              checkRawPrev = raw;
              checkChangeTick = HAL_GetTick();
          }

          if((HAL_GetTick() - checkChangeTick >= BUTTON_DEBOUNCE_MS) &&
             (raw != checkStable))
          {
              checkStable = raw;

              if((checkStable == GPIO_PIN_RESET) && !estopLatched)
              {
                  if(manualMode)
                      printf("CHECK IGNORED : MANUAL MODE\r\n");
                  else
                  {
                      HMI_Send("[T8_CTRL]CHECK\n");
                      printf("CHECK button -> BT TX\r\n");
                  }
              }
          }
      }

      /* END button + ESTOP clear long press */
      {
          GPIO_PinState raw = HAL_GPIO_ReadPin(END_BTN_GPIO_Port, END_BTN_Pin);

          if(raw != endRawPrev)
          {
              endRawPrev = raw;
              endChangeTick = HAL_GetTick();
          }

          if((HAL_GetTick() - endChangeTick >= BUTTON_DEBOUNCE_MS) &&
             (raw != endStable))
          {
              endStable = raw;

              if(endStable == GPIO_PIN_RESET)
              {
            	  if(!estopLatched)
            	  {
            	      if(manualMode)
            	      {
            	          printf("END IGNORED : MANUAL MODE\r\n");
            	      }
            	      else
            	      {
            	          HMI_Send("[T8_CTRL]END\n");
            	          printf("END button -> BT TX\r\n");
            	      }
            	  }
                  else
                  {
                      endPressTick = HAL_GetTick();
                      estopClearSent = 0;
                      LCD_writeStringXY(0, 0, "EMERGENCY STOP  ");
                      LCD_writeStringXY(1, 0, "HOLD END 2 SEC  ");
                      printf("ESTOP CLEAR : HOLD END 2 SEC\r\n");
                  }
              }
              else
              {
                  endPressTick = 0;
                  estopClearSent = 0;
              }
          }

          if(estopLatched &&
             endStable == GPIO_PIN_RESET &&
             !estopClearSent &&
             endPressTick != 0U &&
             (HAL_GetTick() - endPressTick >= ESTOP_CLEAR_HOLD_MS))
          {
              HMI_Send("[T8_CTRL]ESTOP_CLEAR\n");
              estopClearSent = 1;
              LCD_writeStringXY(0, 0, "CLEAR REQUEST   ");
              LCD_writeStringXY(1, 0, "WAIT CTRL ACK   ");
              printf("ESTOP_CLEAR -> BT TX\r\n");
          }
      }

      /* ISR에서는 latch만 걸고 실제 BT 전송/LCD 처리는 main에서 수행 */
      if(estopEvent)
      {
          estopEvent = 0;
          endPressTick = 0;
          estopClearSent = 0;

          HMI_Send("[T8_CTRL]ESTOP\n");

          hmiState = HMI_ESTOP;
          rgbBlinkTick = HAL_GetTick();
          rgbBlinkState = 0;
          LCD_writeStringXY(0, 0, "EMERGENCY STOP  ");
          LCD_writeStringXY(1, 0, "SYSTEM LOCKED   ");

          printf("!!! E-STOP LATCHED !!!\r\n");
      }

      /* MODE button : HMI는 요청만 하고 실제 MODE는 CTRL ACK로 확정 */
      {
          GPIO_PinState raw = HAL_GPIO_ReadPin(MODE_SW_GPIO_Port, MODE_SW_Pin);

          if(raw != modeRawPrev)
          {
              modeRawPrev = raw;
              modeChangeTick = HAL_GetTick();
          }

          if((HAL_GetTick() - modeChangeTick >= BUTTON_DEBOUNCE_MS) &&
             (raw != modeStable))
          {
              modeStable = raw;

              if((modeStable == GPIO_PIN_RESET) && !estopLatched)
              {
                  if(manualMode)
                      HMI_Send("[T8_CTRL]MODE@AUTO\n");
                  else
                      HMI_Send("[T8_CTRL]MODE@MANUAL\n");

                  printf("MODE CHANGE REQUEST -> BT TX\r\n");
              }
          }
      }

      /* MANUAL mode potentiometer JOG */
      if(manualMode && !estopLatched &&
         (HAL_GetTick() - potReadTick >= POT_READ_PERIOD_MS))
      {
          potReadTick = HAL_GetTick();

          if(HAL_ADC_Start(&hadc1) == HAL_OK)
          {
              if(HAL_ADC_PollForConversion(&hadc1, 10) == HAL_OK)
              {
                  potValue = HAL_ADC_GetValue(&hadc1);

                  if(!potInitialized)
                  {
                      potAccepted = potValue;
                      potInitialized = 1;
                      trayAngle = (uint16_t)(((uint32_t)potAccepted * 180UL) / 4095UL);
                      printf("POT BASE = %u, TRAY ANGLE = %u\r\n",
                             potAccepted, trayAngle);
                  }
                  else
                  {
                      uint16_t potDiff = (potValue > potAccepted) ?
                                         (potValue - potAccepted) :
                                         (potAccepted - potValue);

                      if(potDiff >= POT_DEADBAND)
                      {
                          char trayMsg[40];

                          potAccepted = potValue;
                          trayAngle = (uint16_t)(((uint32_t)potAccepted * 180UL) / 4095UL);

                          snprintf(trayMsg, sizeof(trayMsg),
                                   "[T8_CTRL]TRAY@%u\n", trayAngle);
                          HMI_Send(trayMsg);

                          printf("POT = %u, TRAY ANGLE = %u / BT TX\r\n",
                                 potAccepted, trayAngle);
                      }
                  }
              }

              HAL_ADC_Stop(&hadc1);
          }
      }

      RGB_Update();
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
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSI;
  RCC_OscInitStruct.HSIState = RCC_HSI_ON;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSI;
  RCC_OscInitStruct.PLL.PLLM = 16;
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
  * @brief ADC1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_ADC1_Init(void)
{

  /* USER CODE BEGIN ADC1_Init 0 */

  /* USER CODE END ADC1_Init 0 */

  ADC_ChannelConfTypeDef sConfig = {0};

  /* USER CODE BEGIN ADC1_Init 1 */

  /* USER CODE END ADC1_Init 1 */

  /** Configure the global features of the ADC (Clock, Resolution, Data Alignment and number of conversion)
  */
  hadc1.Instance = ADC1;
  hadc1.Init.ClockPrescaler = ADC_CLOCK_SYNC_PCLK_DIV4;
  hadc1.Init.Resolution = ADC_RESOLUTION_12B;
  hadc1.Init.ScanConvMode = DISABLE;
  hadc1.Init.ContinuousConvMode = DISABLE;
  hadc1.Init.DiscontinuousConvMode = DISABLE;
  hadc1.Init.ExternalTrigConvEdge = ADC_EXTERNALTRIGCONVEDGE_NONE;
  hadc1.Init.ExternalTrigConv = ADC_SOFTWARE_START;
  hadc1.Init.DataAlign = ADC_DATAALIGN_RIGHT;
  hadc1.Init.NbrOfConversion = 1;
  hadc1.Init.DMAContinuousRequests = DISABLE;
  hadc1.Init.EOCSelection = ADC_EOC_SINGLE_CONV;
  if (HAL_ADC_Init(&hadc1) != HAL_OK)
  {
    Error_Handler();
  }

  /** Configure for the selected ADC regular channel its corresponding rank in the sequencer and its sample time.
  */
  sConfig.Channel = ADC_CHANNEL_0;
  sConfig.Rank = 1;
  sConfig.SamplingTime = ADC_SAMPLETIME_3CYCLES;
  if (HAL_ADC_ConfigChannel(&hadc1, &sConfig) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN ADC1_Init 2 */

  /* USER CODE END ADC1_Init 2 */

}

/**
  * @brief I2C3 Initialization Function
  * @param None
  * @retval None
  */
static void MX_I2C3_Init(void)
{

  /* USER CODE BEGIN I2C3_Init 0 */

  /* USER CODE END I2C3_Init 0 */

  /* USER CODE BEGIN I2C3_Init 1 */

  /* USER CODE END I2C3_Init 1 */
  hi2c3.Instance = I2C3;
  hi2c3.Init.ClockSpeed = 100000;
  hi2c3.Init.DutyCycle = I2C_DUTYCYCLE_2;
  hi2c3.Init.OwnAddress1 = 0;
  hi2c3.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
  hi2c3.Init.DualAddressMode = I2C_DUALADDRESS_DISABLE;
  hi2c3.Init.OwnAddress2 = 0;
  hi2c3.Init.GeneralCallMode = I2C_GENERALCALL_DISABLE;
  hi2c3.Init.NoStretchMode = I2C_NOSTRETCH_DISABLE;
  if (HAL_I2C_Init(&hi2c3) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN I2C3_Init 2 */

  /* USER CODE END I2C3_Init 2 */

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
  huart2.Init.BaudRate = 115200;
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
  huart6.Init.BaudRate = 9600;
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

  __HAL_RCC_GPIOC_CLK_ENABLE();
  __HAL_RCC_GPIOH_CLK_ENABLE();
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /* RGB outputs */
  HAL_GPIO_WritePin(GPIOA, RGB_R_Pin|RGB_G_Pin, GPIO_PIN_RESET);
  HAL_GPIO_WritePin(RGB_B_GPIO_Port, RGB_B_Pin, GPIO_PIN_RESET);

  GPIO_InitStruct.Pin = RGB_R_Pin|RGB_G_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

  GPIO_InitStruct.Pin = RGB_B_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(RGB_B_GPIO_Port, &GPIO_InitStruct);

  /* MODE / END */
  GPIO_InitStruct.Pin = MODE_SW_Pin|END_BTN_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

  /* START / CHECK */
  GPIO_InitStruct.Pin = START_BTN_Pin|CHECK_BTN_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

  /* E-STOP : falling-edge EXTI */
  GPIO_InitStruct.Pin = ESTOP_BTN_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(ESTOP_BTN_GPIO_Port, &GPIO_InitStruct);

  HAL_NVIC_SetPriority(EXTI15_10_IRQn, 0, 0);
  HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);
}

/* USER CODE BEGIN 4 */
static void HMI_Send(const char *message)
{
    if(message == NULL || message[0] == '\0')
        return;

    if(HAL_UART_Transmit(&huart6,
                         (uint8_t *)message,
                         (uint16_t)strlen(message),
                         100) != HAL_OK)
    {
        printf("BT TX ERROR\r\n");
    }
}

void RGB_Set(uint8_t r, uint8_t g, uint8_t b)
{
    HAL_GPIO_WritePin(RGB_R_GPIO_Port, RGB_R_Pin,
                      r ? GPIO_PIN_SET : GPIO_PIN_RESET);
    HAL_GPIO_WritePin(RGB_G_GPIO_Port, RGB_G_Pin,
                      g ? GPIO_PIN_SET : GPIO_PIN_RESET);
    HAL_GPIO_WritePin(RGB_B_GPIO_Port, RGB_B_Pin,
                      b ? GPIO_PIN_SET : GPIO_PIN_RESET);
}

void HMI_ShowMode(void)
{
    if(manualMode)
        LCD_writeStringXY(1, 0, "MODE: MANUAL    ");
    else
        LCD_writeStringXY(1, 0, "MODE: AUTO      ");
}

void RGB_Update(void)
{
    switch(hmiState)
    {
        case HMI_READY:
            if(HAL_GetTick() - rgbBlinkTick >= 500U)
            {
                rgbBlinkTick = HAL_GetTick();
                rgbBlinkState = !rgbBlinkState;
                RGB_Set(0, rgbBlinkState, 0);
            }
            break;

        case HMI_WORKING:
        case HMI_PASS:
            RGB_Set(0, 1, 0);
            break;

        case HMI_INSPECTING:
            if(HAL_GetTick() - rgbBlinkTick >= 500U)
            {
                rgbBlinkTick = HAL_GetTick();
                rgbBlinkState = !rgbBlinkState;
                RGB_Set(rgbBlinkState, rgbBlinkState, rgbBlinkState);
            }
            break;

        case HMI_FAIL:
            RGB_Set(1, 1, 0);
            break;

        case HMI_ESTOP:
            if(HAL_GetTick() - rgbBlinkTick >= 250U)
            {
                rgbBlinkTick = HAL_GetTick();
                rgbBlinkState = !rgbBlinkState;
                RGB_Set(rgbBlinkState, 0, 0);
            }
            break;

        default:
            RGB_Set(0, 0, 0);
            break;
    }
}

void bluetooth_Event(void)
{
    int count = 0;
    char *token;
    char *parts[ARR_CNT] = {0};
    char recvBuf[CMD_SIZE] = {0};

    strncpy(recvBuf, btData, sizeof(recvBuf) - 1U);
    recvBuf[sizeof(recvBuf) - 1U] = '\0';

    token = strtok(recvBuf, "[@]");
    while(token != NULL && count < ARR_CNT)
    {
        parts[count++] = token;
        token = strtok(NULL, "[@]");
    }

    if(count < 2 || parts[0] == NULL || parts[1] == NULL)
    {
        printf("BT PACKET ERROR : %s\r\n", btData);
        return;
    }

    /* HMI는 중앙제어(T8_CTRL)의 명령만 수용 */
    if(strcmp(parts[0], "T8_CTRL") != 0)
        return;

    if(strcmp(parts[1], "ESTOP_CLEARED") == 0)
    {
        estopLatched = 0;
        estopEvent = 0;
        endPressTick = 0;
        estopClearSent = 0;
        potInitialized = 0;

        hmiState = HMI_READY;
        rgbBlinkTick = HAL_GetTick();
        rgbBlinkState = 0;

        LCD_writeStringXY(0, 0, "HMI READY       ");
        HMI_ShowMode();

        printf("ESTOP CLEARED BY CTRL\r\n");
        return;
    }

    if(count < 3 || parts[2] == NULL)
    {
        printf("BT PACKET ARG ERROR : %s\r\n", btData);
        return;
    }

    if(strcmp(parts[1], "MODE") == 0)
    {
        if(strcmp(parts[2], "AUTO") == 0)
        {
            manualMode = 0;
            potInitialized = 0;
            HMI_ShowMode();
            printf("MODE ACK -> AUTO\r\n");
            return;
        }

        if(strcmp(parts[2], "MANUAL") == 0)
        {
            manualMode = 1;
            potInitialized = 0;
            HMI_ShowMode();
            printf("MODE ACK -> MANUAL\r\n");
            return;
        }

        printf("UNKNOWN MODE : %s\r\n", parts[2]);
        return;
    }

    if(strcmp(parts[1], "STATE") == 0)
    {
        if(strcmp(parts[2], "ESTOP") == 0)
        {
            estopLatched = 1;
            estopEvent = 0;
            potInitialized = 0;
            hmiState = HMI_ESTOP;
            rgbBlinkTick = HAL_GetTick();
            rgbBlinkState = 0;

            LCD_writeStringXY(0, 0, "EMERGENCY STOP  ");
            LCD_writeStringXY(1, 0, "SYSTEM LOCKED   ");
            printf("STATE -> ESTOP\r\n");
            return;
        }

        if(estopLatched)
        {
            printf("STATE %s IGNORED : ESTOP LATCHED\r\n", parts[2]);
            return;
        }

        if(strcmp(parts[2], "READY") == 0)
        {
            hmiState = HMI_READY;
            LCD_writeStringXY(0, 0, "HMI READY       ");
            HMI_ShowMode();
            rgbBlinkTick = HAL_GetTick();
            rgbBlinkState = 0;
            printf("STATE -> READY\r\n");
            return;
        }

        if(strcmp(parts[2], "WORKING") == 0)
        {
            hmiState = HMI_WORKING;
            LCD_writeStringXY(0, 0, "WORKING         ");
            printf("STATE -> WORKING\r\n");
            return;
        }

        if(strcmp(parts[2], "INSPECTING") == 0)
        {
            hmiState = HMI_INSPECTING;
            LCD_writeStringXY(0, 0, "INSPECTING      ");
            rgbBlinkTick = HAL_GetTick();
            rgbBlinkState = 0;
            printf("STATE -> INSPECTING\r\n");
            return;
        }

        if(strcmp(parts[2], "PASS") == 0)
        {
            hmiState = HMI_PASS;
            LCD_writeStringXY(0, 0, "INSPECT PASS    ");
            printf("STATE -> PASS\r\n");
            return;
        }

        if(strcmp(parts[2], "FAIL") == 0)
        {
            hmiState = HMI_FAIL;
            LCD_writeStringXY(0, 0, "INSPECT FAIL    ");
            printf("STATE -> FAIL\r\n");
            return;
        }

        printf("UNKNOWN STATE : %s\r\n", parts[2]);
        return;
    }

    if(strcmp(parts[1], "WARN") == 0)
    {
        if(strcmp(parts[2], "NO_ITEM") == 0)
        {
            LCD_writeStringXY(0, 0, "NO ITEM         ");
            LCD_writeStringXY(1, 0, "PLACE ONE ITEM  ");

            printf("WARN -> NO ITEM\r\n");
            return;
        }

        if(strcmp(parts[2], "MULTI_ITEM") == 0)
        {
            LCD_writeStringXY(0, 0, "MULTI ITEM      ");
            LCD_writeStringXY(1, 0, "ONE ITEM ONLY   ");

            printf("WARN -> MULTI ITEM\r\n");
            return;
        }

        printf("UNKNOWN WARNING : %s\r\n", parts[2]);
        return;
    }

    printf("UNKNOWN CTRL COMMAND : %s\r\n", parts[1]);
}

PUTCHAR_PROTOTYPE
{
    HAL_UART_Transmit(&huart2, (uint8_t *)&ch, 1, 0xFFFF);
    return ch;
}

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    if(huart->Instance == USART6)
    {
        static char buildBuf[CMD_SIZE];
        static uint16_t buildLen = 0;

        if(btchar == '\r' || btchar == '\n')
        {
            if(buildLen > 0U)
            {
                uint8_t head = btRxHead;
                uint8_t nextHead = (uint8_t)((head + 1U) % BT_RX_QUEUE_SIZE);

                buildBuf[buildLen] = '\0';

                if(nextHead != btRxTail)
                {
                    memcpy(btRxQueue[head], buildBuf, buildLen + 1U);
                    __DMB();
                    btRxHead = nextHead;
                }
                else
                {
                    btRxDropCount++;
                }

                buildLen = 0;
            }
        }
        else
        {
            if(buildLen < CMD_SIZE - 1U)
            {
                buildBuf[buildLen++] = (char)btchar;
            }
            else
            {
                buildLen = 0;
                btRxDropCount++;
            }
        }

        HAL_UART_Receive_IT(&huart6, &btchar, 1);
    }
}

void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
    if(GPIO_Pin == ESTOP_BTN_Pin && !estopLatched)
    {
        estopLatched = 1;
        estopEvent = 1;
    }
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
  * @param  line: pointer to the source line number
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
