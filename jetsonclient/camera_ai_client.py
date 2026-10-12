import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import cv2
import numpy as np
import os
from ultralytics import YOLO

# ----------------- YOLOv8 모델 초기화 -----------------
MODEL_PATH = "best.pt"
yolo_model = None

if not os.path.isabs(MODEL_PATH):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    candidate_path = os.path.join(script_dir, MODEL_PATH)
    if os.path.exists(candidate_path):
        MODEL_PATH = candidate_path

if os.path.exists(MODEL_PATH):
    try:
        print(f"[*] YOLOv8 가중치 로드 시도: {MODEL_PATH}")
        yolo_model = YOLO(MODEL_PATH)
        print("[+] YOLOv8 모델 로드 성공!")
        print(f"[*] 등록된 클래스 목록: {yolo_model.names}")
    except Exception as e:
        print(f"[!] 모델 로드 에러: {e}")
else:
    print(f"[경고] {MODEL_PATH} 가중치 파일이 없습니다.")

# ----------------- AI 판정 임계값(Threshold) 설정 -----------------
BOX_CONF_THRESHOLD = 0.65       # 정상 큐브 최소 확신도 (65% 이상)
DEFECT_CONF_THRESHOLD = 0.35    # 결함/불량 감지 기준 (35% 이상)
PREDICT_CONF_CUTOFF = 0.25      # 모델 최소 탐지 컷오프

# ----------------- 네트워크 및 하드웨어 설정 -----------------
SERVER_IP = "10.10.16.87"       # 라즈베리파이 IP
SERVER_PORT = 8080              # 브로커 포트
CAMERA_INDEX = 1                # OBSBOT Meet 2 할당 노드 (/dev/video1)

# ----------------- 상태 플래그 -----------------
is_occupied = False             # 웹 점유 여부
current_mode = "AUTO"           # "AUTO" 또는 "MANUAL"
is_running = False              # 공정 가동 여부
is_sorting = False              # 모터 분류 중 플래그
sort_start_time = 0.0
is_estop = False

lock = threading.Lock()
sock_lock = threading.Lock()
c_sock = None

latest_jpeg = None
current_frame_w = 1280
current_frame_h = 720

# ----------------- 라우터 브로커 통신 (T8_VISION) -----------------
def connect_router():
    global c_sock, is_occupied, current_mode, is_running, is_sorting, is_estop
    while True:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((SERVER_IP, SERVER_PORT))
            s.sendall(b"[T8_VISION:PASSWD]\n")
            with sock_lock:
                c_sock = s
            print(f"[+] 브로커 서버({SERVER_IP}:{SERVER_PORT}) 연결 성공 (T8_VISION 등록)")

            line_buf = ""
            while True:
                data = s.recv(512)
                if not data:
                    break
                line_buf += data.decode('utf-8', errors='ignore')
                while '\n' in line_buf:
                    line, line_buf = line_buf.split('\n', 1)
                    line = line.strip()
                    if not line:
                        continue

                    if line.startswith("["):
                        parts = line.split("]", 1)
                        if len(parts) == 2:
                            sender = parts[0][1:]
                            cmd = parts[1].strip()
                            print(f"[RX FROM {sender}] {cmd}")

                            if cmd == "UNLOCK":
                                is_occupied = True
                                print("[VISION] 카메라 잠금 해제")
                            elif cmd == "LOCK":
                                is_occupied = False
                                is_running = False
                                is_sorting = False
                            elif cmd == "MODE@AUTO":
                                current_mode = "AUTO"
                                is_sorting = False
                                print("[VISION] AUTO 모드 전환 -> AI 자동 검사 활성화")
                            elif cmd == "MODE@MANUAL":
                                current_mode = "MANUAL"
                                is_sorting = False
                                print("[VISION] MANUAL 모드 전환 -> AI 검사 비활성화")
                            elif cmd == "STATE@WORKING" or cmd == "START":
                                is_running = True
                                is_sorting = False
                                print("[VISION] 공정 가동 (RUNNING=True)")
                            elif cmd in ["STATE@READY", "RESET", "END", "ACT@DONE"]:
                                is_sorting = False
                                is_estop = False
                                if cmd != "END":
                                    is_running = (current_mode == "AUTO")
                                else:
                                    is_running = False
                                print(f"[VISION] 사이클 복귀 (RUNNING={is_running})")
                            elif cmd.startswith("ACK@"):
                                is_sorting = True
                            elif cmd == "ESTOP":
                                is_estop = True
                                is_running = False
                                is_sorting = False

        except Exception as e:
            print(f"[!] 브로커 소켓 재시도 중: {e}")

        with sock_lock:
            c_sock = None
        time.sleep(2)

def send_result_to_ctrl(label: str):
    with sock_lock:
        if c_sock is None:
            return
        try:
            msg = f"[T8_CTRL]{label}\n"
            c_sock.sendall(msg.encode('utf-8'))
            print(f"[TX TO CTRL] >>> {msg.strip()} 전송 완료")
        except Exception as e:
            print(f"[TX ERR] {e}")

# ----------------- 정밀 박스/큐브 AI 판정 및 동적 스케일링 로직 -----------------
BOX_KEYWORDS = ["cube", "box", "package", "carton", "큐브", "상자", "박스"]
DEFECT_KEYWORDS = ["defect", "crush", "ng", "bad", "scratch", "crack", "dent", "fault", "error", "broken", "불량", "파손"]

def run_yolo_detection(frame):
    """
    ROI 영역만 잘라내어(Crop) YOLO에 입력하는 고정밀 추론 방식
    - ROI 외부는 모델에 전달되지 않아 100% 완벽 차단
    - 해상도 압축 손실이 사라져 큐브 인식률 대폭 향상
    """
    if yolo_model is None:
        return False, False, "NO_MODEL", frame

    h, w = frame.shape[:2]
    scale = w / 640.0

    # 1. ROI 검사 영역: 화면 중앙 약 55% 구역으로 확장 (0.22 ~ 0.78)
    roi_x1 = int(w * 0.22)
    roi_y1 = int(h * 0.22)
    roi_x2 = int(w * 0.78)
    roi_y2 = int(h * 0.78)

    # 2. ROI 영역만 잘라내기 (Crop)
    roi_crop = frame[roi_y1:roi_y2, roi_x1:roi_x2]
    if roi_crop.size == 0:
        return False, False, "EMPTY", frame

    # 3. 잘라낸 ROI 영역만 YOLO 추론 (큐브의 해상도가 유지되어 인식률 극대화)
    results = yolo_model.predict(source=roi_crop, imgsz=416, conf=PREDICT_CONF_CUTOFF, verbose=False, device=0)
    boxes = results[0].boxes
    annotated = frame.copy()

    # 화면에 ROI 가이드라인 사각형 표시 (노란색)
    roi_line_th = max(1, int(1.5 * scale))
    cv2.rectangle(annotated, (roi_x1, roi_y1), (roi_x2, roi_y2), (255, 200, 0), roi_line_th)
    cv2.putText(annotated, "STRICT INSPECTION ROI", (roi_x1 + int(10 * scale), roi_y1 + int(24 * scale)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.55 * scale, (255, 200, 0), max(1, int(1.5 * scale)))

    if len(boxes) == 0:
        return False, False, "EMPTY", annotated

    has_valid_box = False
    has_defect = False
    detected_names = []
    valid_objects_count = 0

    box_line_th = max(2, int(2.5 * scale))
    font_scale = 0.65 * scale
    font_th = max(1, int(2 * scale))

    # 받침판/노이즈 크기 필터 (ROI 기준 비율)
    roi_w = roi_x2 - roi_x1
    roi_h = roi_y2 - roi_y1
    max_allowed_w = int(roi_w * 0.85)  # ROI의 85%를 넘게 채우면 판으로 간주
    max_allowed_h = int(roi_h * 0.85)
    min_allowed_w = int(25 * scale)

    for box in boxes:
        cls_id = int(box.cls[0])
        cls_name = str(yolo_model.names[cls_id]).lower()
        conf = float(box.conf[0])

        # 크롭 좌표를 원본 프레임 좌표로 복원 (+ roi_x1, + roi_y1)
        bx1, by1, bx2, by2 = map(int, box.xyxy[0])
        x1 = bx1 + roi_x1
        y1 = by1 + roi_y1
        x2 = bx2 + roi_x1
        y2 = by2 + roi_y1

        bw = x2 - x1
        bh = y2 - y1

        # 판 자체(거대 객체) 필터링
        if bw > max_allowed_w or bh > max_allowed_h:
            cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 100, 200), max(1, int(1.5 * scale)))
            cv2.putText(annotated, "[PLATE/IGNORE]", (x1, max(y1 - 5, 20)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5 * scale, (0, 100, 200), 1)
            continue

        # 미세 노이즈 무시
        if bw < min_allowed_w or bh < min_allowed_w:
            continue

        valid_objects_count += 1
        detected_names.append(f"{cls_name}({conf:.2f})")

        is_defect_class = any(k in cls_name for k in DEFECT_KEYWORDS)
        is_box_class = any(k in cls_name for k in BOX_KEYWORDS)

        # 판정 기준 (CONF 판별)
        if is_defect_class and conf >= DEFECT_CONF_THRESHOLD:
            has_defect = True
            color = (0, 0, 255)
            tag = f"[DEFECT] {cls_name} {conf:.2f}"
        elif is_box_class and conf >= BOX_CONF_THRESHOLD:
            has_valid_box = True
            color = (0, 255, 0)
            tag = f"[OK-CUBE] {cls_name} {conf:.2f}"
        else:
            has_defect = True
            color = (0, 0, 255)
            tag = f"[REJECT] {cls_name} {conf:.2f}"

        cv2.rectangle(annotated, (x1, y1), (x2, y2), color, box_line_th)
        cv2.putText(annotated, tag, (x1, max(y1 - int(10 * scale), int(25 * scale))),
                    cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, font_th)

    if valid_objects_count == 0:
        return False, False, "EMPTY", annotated

    is_pass = (has_valid_box and not has_defect)
    primary_label = detected_names[0] if detected_names else "OBJECT"

    return True, is_pass, primary_label, annotated

# ----------------- 웹 스트리밍 서버 (Port: 5000) -----------------
class ReusableThreadingHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True

class StreamingHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global latest_jpeg
        if self.path.startswith('/video_feed'):
            self.send_response(200)
            self.send_header('Age', '0')
            self.send_header('Cache-Control', 'no-cache, private, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME')
            self.end_headers()
            try:
                while True:
                    with lock:
                        frame_data = latest_jpeg
                    if frame_data is not None:
                        self.wfile.write(b'--FRAME\r\n')
                        self.wfile.write(b'Content-Type: image/jpeg\r\n')
                        self.wfile.write(f'Content-Length: {len(frame_data)}\r\n\r\n'.encode('utf-8'))
                        self.wfile.write(frame_data)
                        self.wfile.write(b'\r\n')
                    time.sleep(0.033)
            except Exception:
                pass
        else:
            self.send_error(404)
            self.end_headers()

    def log_message(self, format, *args):
        return

def run_web_server():
    server = ReusableThreadingHTTPServer(('0.0.0.0', 5000), StreamingHandler)
    server.serve_forever()

def open_obsbot_camera(target_index=1):
    """OBSBOT Meet 2 MJPEG 고속 스트림 오픈"""
    print(f"[*] OBSBOT 카메라(/dev/video{target_index}) 오픈 시도...")
    cap = cv2.VideoCapture(target_index, cv2.CAP_V4L2)
    cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    cap.set(cv2.CAP_PROP_FPS, 30)

    ret, _ = cap.read()
    if cap.isOpened() and ret:
        actual_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        actual_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        print(f"[+] OBSBOT 카메라(/dev/video{target_index}) 정상 연결! 해상도: {actual_w}x{actual_h}")
        return cap

    cap.release()
    alt_index = 0 if target_index == 1 else 1
    print(f"[!] /dev/video{target_index} 실패. 보조 인덱스 /dev/video{alt_index} 재시도...")
    cap = cv2.VideoCapture(alt_index, cv2.CAP_V4L2)
    cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    ret, _ = cap.read()
    if cap.isOpened() and ret:
        actual_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        actual_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        print(f"[+] 보조 노드(/dev/video{alt_index}) 연결 성공! 해상도: {actual_w}x{actual_h}")
        return cap

    return None

def draw_top_banner(img, text, bg_color):
    """화면 해상도(W, H)에 맞춘 상단 상태 배너 동적 렌더링"""
    h, w = img.shape[:2]
    scale = w / 640.0
    banner_h = int(52 * scale)

    cv2.rectangle(img, (0, 0), (w, banner_h), bg_color, -1)
    font_scale = 0.75 * scale
    font_th = max(2, int(2 * scale))
    text_y = int(35 * scale)
    text_x = int(25 * scale)
    cv2.putText(img, text, (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), font_th)

# ----------------- 메인 비전 루프 -----------------
def main():
    global latest_jpeg, is_sorting, sort_start_time

    threading.Thread(target=run_web_server, daemon=True).start()
    threading.Thread(target=connect_router, daemon=True).start()
    time.sleep(0.5)

    cap = open_obsbot_camera(CAMERA_INDEX)
    if cap is None:
        print("[!] OBSBOT 카메라를 열 수 없습니다. USB 케이블 연결을 확인하세요.")
        while True:
            time.sleep(2)

    print("[+] 비전 파이프라인 가동 완료 (해상도 적응형 오버레이 활성화)")

    last_decision_text = "READY"
    detect_streak = 0

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                time.sleep(0.01)
                continue

            h, w = frame.shape[:2]
            scale = w / 640.0

            # 1. 점유 전: 카메라 잠금 보안 화면
            if not is_occupied:
                debug_frame = np.zeros((h, w, 3), dtype=np.uint8)
                debug_frame[:] = (15, 20, 28)
                cv2.rectangle(debug_frame, (int(20*scale), int(20*scale)), (w - int(20*scale), h - int(20*scale)), (40, 50, 70), max(1, int(2*scale)))
                cv2.putText(debug_frame, "[STANDBY] CAMERA LOCKED", (int(50*scale), int(h*0.45)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.85 * scale, (0, 165, 255), max(2, int(2*scale)))
                cv2.putText(debug_frame, "Please Occupy Device on Web Dashboard", (int(50*scale), int(h*0.55)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55 * scale, (180, 180, 180), max(1, int(1.5*scale)))

            # 2. 비상 정지 상태
            elif is_estop:
                debug_frame = frame.copy()
                draw_top_banner(debug_frame, "[EMERGENCY STOPPED] SYSTEM LOCKED", (0, 0, 200))

            # 3. 매뉴얼 모드
            elif current_mode == "MANUAL":
                debug_frame = frame.copy()
                draw_top_banner(debug_frame, "[MANUAL MODE] AI DISABLED / MANUAL CONTROL", (60, 60, 60))

            # 4. 오토 모드: 해상도 적응형 YOLO 실시간 검사
            elif current_mode == "AUTO":
                has_obj, is_valid_cube, label_name, annotated_frame = run_yolo_detection(frame)
                debug_frame = annotated_frame

                if is_sorting:
                    if time.time() - sort_start_time > 3.5:
                        is_sorting = False

                    banner_col = (0, 160, 0) if last_decision_text == "NORMAL" else (0, 0, 200)
                    draw_top_banner(debug_frame, f"[SORTING] {last_decision_text} - ACTUATOR OPERATING...", banner_col)

                elif is_running:
                    if has_obj:
                        detect_streak += 1
                        if detect_streak >= 3:
                            decision = "NORMAL" if is_valid_cube else "DEFECT"
                            last_decision_text = decision
                            is_sorting = True
                            sort_start_time = time.time()
                            detect_streak = 0

                            print(f"\n[*] [유효 객체 판정 완료] {label_name} -> 결과: {decision}")
                            send_result_to_ctrl(decision)

                        draw_top_banner(debug_frame, f"[CHECKING] {label_name}...", (0, 140, 255))
                    else:
                        detect_streak = 0
                        draw_top_banner(debug_frame, "[AUTO RUNNING] WAITING FOR OBJECT...", (30, 40, 60))

                else:
                    detect_streak = 0
                    draw_top_banner(debug_frame, "[SYSTEM READY] PRESS START TO BEGIN", (40, 40, 40))

            _, buffer = cv2.imencode('.jpg', debug_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
            with lock:
                latest_jpeg = buffer.tobytes()

    except KeyboardInterrupt:
        print("\n[*] 종료")
    finally:
        if cap:
            cap.release()

if __name__ == '__main__':
    main()