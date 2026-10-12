CC = gcc
CFLAGS = -Wall -Wextra -O2 -Iinclude -pthread
BUILD_DIR = build
SRC_DIR = src

TARGET_SERVER = $(BUILD_DIR)/broker_server
TARGET_CTRL = $(BUILD_DIR)/t8_ctrl

all: $(BUILD_DIR) $(TARGET_SERVER) $(TARGET_CTRL)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(TARGET_SERVER): $(SRC_DIR)/broker_server.c
	$(CC) $(CFLAGS) -o $@ $^

$(TARGET_CTRL): $(SRC_DIR)/t8_ctrl.c $(SRC_DIR)/db_manager.c
	$(CC) $(CFLAGS) -o $@ $^

clean:
	rm -rf $(BUILD_DIR) *.log

run-server: $(TARGET_SERVER)
	./$(TARGET_SERVER) 8080

run-ctrl: $(TARGET_CTRL)
	./$(TARGET_CTRL) 127.0.0.1 8080

.PHONY: all clean run-server run-ctrl
