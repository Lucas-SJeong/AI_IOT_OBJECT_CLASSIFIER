
/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.h
  * @brief          : Header for main.c file.
  *                   This file contains the common defines of the application.
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

#ifndef __MAIN_H
#define __MAIN_H

#ifdef __cplusplus
extern "C" {
#endif

#include "stm32f4xx_hal.h"

void Error_Handler(void);

#define B1_Pin GPIO_PIN_13
#define B1_GPIO_Port GPIOC
#define B1_EXTI_IRQn EXTI15_10_IRQn
#define MODE_SW_Pin GPIO_PIN_1
#define MODE_SW_GPIO_Port GPIOA
#define USART_TX_Pin GPIO_PIN_2
#define USART_TX_GPIO_Port GPIOA
#define USART_RX_Pin GPIO_PIN_3
#define USART_RX_GPIO_Port GPIOA
#define LD3_Pin GPIO_PIN_4
#define LD3_GPIO_Port GPIOA
#define LD2_Pin GPIO_PIN_5
#define LD2_GPIO_Port GPIOA
#define RGB_R_Pin GPIO_PIN_6
#define RGB_R_GPIO_Port GPIOA
#define RGB_G_Pin GPIO_PIN_7
#define RGB_G_GPIO_Port GPIOA
#define RGB_B_Pin GPIO_PIN_0
#define RGB_B_GPIO_Port GPIOB
#define CLCD_SDA_Pin GPIO_PIN_9
#define CLCD_SDA_GPIO_Port GPIOC
#define CLCD_SCL_Pin GPIO_PIN_8
#define CLCD_SCL_GPIO_Port GPIOA
#define END_BTN_Pin GPIO_PIN_9
#define END_BTN_GPIO_Port GPIOA
#define ESTOP_BTN_Pin GPIO_PIN_10
#define ESTOP_BTN_GPIO_Port GPIOA
#define ESTOP_BTN_EXTI_IRQn EXTI15_10_IRQn
#define TMS_Pin GPIO_PIN_13
#define TMS_GPIO_Port GPIOA
#define TCK_Pin GPIO_PIN_14
#define TCK_GPIO_Port GPIOA
#define DHT11_Pin GPIO_PIN_15
#define DHT11_GPIO_Port GPIOA
#define SWO_Pin GPIO_PIN_3
#define SWO_GPIO_Port GPIOB
#define CHECK_BTN_Pin GPIO_PIN_4
#define CHECK_BTN_GPIO_Port GPIOB
#define START_BTN_Pin GPIO_PIN_5
#define START_BTN_GPIO_Port GPIOB

#ifdef __cplusplus
}
#endif

#endif /* __MAIN_H */
