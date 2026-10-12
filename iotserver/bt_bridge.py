#!/usr/bin/env python3
import os
import sys
import time
import socket
import signal
import threading

# ----------------- 설정 파라미터 -----------------
HC06_MAC    = "98:DA:60:0D:A1:FB"
RFCOMM_CH   = 1  # HC-06 표준 SPP 채널

BROKER_HOST = "127.0.0.1"
BROKER_PORT = 8080

stop_requested = False

def sig_handler(signum, frame):
    global stop_requested
    stop_requested = True
    sys.exit(0)

signal.signal(signal.SIGINT, sig_handler)
signal.signal(signal.SIGTERM, sig_handler)

def bt_to_broker(bt_sock, broker_sock, stop_event):
    """HMI 물리 보드 -> 브로커 서버"""
    rx_buf = ""
    while not stop_event.is_set() and not stop_requested:
        try:
            data = bt_sock.recv(512)
            if not data:
                print("[!] HC-06 물리 연결 단절 감지 (0 bytes)")
                stop_event.set()
                break

            rx_buf += data.decode('utf-8', errors='ignore')
            while '\n' in rx_buf:
                line, rx_buf = rx_buf.split('\n', 1)
                line = line.strip()
                if line:
                    broker_sock.sendall(f"{line}\n".encode('utf-8'))
                    print(f"[BT BUTTON -> BROKER] {line}")

        except socket.timeout:
            continue
        except Exception as e:
            if not stop_requested:
                print(f"[!] BT -> BROKER 수신 오류: {e}")
            stop_event.set()
            break

def broker_to_bt(bt_sock, broker_sock, stop_event):
    """브로커 피드백 -> HMI CLCD"""
    while not stop_event.is_set() and not stop_requested:
        try:
            data = broker_sock.recv(512)
            if not data:
                stop_event.set()
                break

            bt_sock.sendall(data)
            decoded = data.decode('utf-8', errors='ignore').strip()
            if decoded:
                print(f"[BROKER -> HMI LCD] {decoded}")

        except socket.timeout:
            continue
        except Exception as e:
            if not stop_requested:
                print(f"[!] BROKER -> BT 송신 오류: {e}")
            stop_event.set()
            break

def start_bridge():
    global stop_requested
    while not stop_requested:
        bt_sock = None
        broker_sock = None
        stop_event = threading.Event()

        try:
            print(f"[*] HC-06 네이티브 블루투스 연결 시도 중 ({HC06_MAC}:CH{RFCOMM_CH})...")
            # 리눅스 표준 RFCOMM 블루투스 소켓 생성 (sudo/rfcomm bind 불필요)
            bt_sock = socket.socket(socket.AF_BLUETOOTH, socket.SOCK_STREAM, socket.BTPROTO_RFCOMM)
            bt_sock.settimeout(5.0)
            bt_sock.connect((HC06_MAC, RFCOMM_CH))
            bt_sock.settimeout(1.0)
            print("[+] HC-06 물리 링크 연결 성공 (모듈 LED 상시 점등 확인)!")

            print(f"[*] 브로커 서버({BROKER_HOST}:{BROKER_PORT}) 접속 중...")
            broker_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            broker_sock.settimeout(5.0)
            broker_sock.connect((BROKER_HOST, BROKER_PORT))
            broker_sock.sendall(b"[T8_HMI:PASSWD]\n")
            broker_sock.settimeout(1.0)
            print("[+] T8_HMI 브로커 등록 완료! 양방향 통신 대기 중\n")

            t1 = threading.Thread(target=bt_to_broker, args=(bt_sock, broker_sock, stop_event), daemon=True)
            t2 = threading.Thread(target=broker_to_bt, args=(bt_sock, broker_sock, stop_event), daemon=True)
            t1.start()
            t2.start()

            stop_event.wait()

        except Exception as e:
            print(f"[!] 연결 에러: {e}")
        finally:
            stop_event.set()
            if bt_sock:
                try: bt_sock.close()
                except Exception: pass
            if broker_sock:
                try: broker_sock.close()
                except Exception: pass

        if not stop_requested:
            print("[*] 3초 후 재연결 시도...\n")
            time.sleep(3)

if __name__ == "__main__":
    start_bridge()
