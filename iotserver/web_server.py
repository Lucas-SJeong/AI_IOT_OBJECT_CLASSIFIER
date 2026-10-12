import os
import re
import sys
import time
import uuid
import socket
import sqlite3
import hashlib
import threading
from collections import deque
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, Request, Response, status, Header, Depends, Query
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import uvicorn

try:
    import cv2
    import numpy as np
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

# ==============================================================================
# 1. 환경 설정 및 SQLite DB 초기화
# ==============================================================================
BROKER_HOST = "127.0.0.1"
BROKER_PORT = 8080
WEB_PORT = 8000

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "factory_users.db")

JETSON_STREAM_URL = "http://10.10.16.117:5000/video_feed"
REQUIRED_NODES = ["T8_CTRL", "T8_HMI", "T8_MOTION", "T8_VISION"]

def get_db():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'operator',
            created_at REAL
        )
    """)
    cur.execute("SELECT username FROM users WHERE username = 'admin'")
    if not cur.fetchone():
        pw_hash = hashlib.sha256("admin1234".encode()).hexdigest()
        cur.execute("INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?)",
                    ("admin", pw_hash, "admin", time.time()))
    conn.commit()
    return conn

get_db().close()

# ==============================================================================
# 2. 전역 시스템 상태 관리
# ==============================================================================
class SmartFactoryManager:
    def __init__(self):
        self.lock = threading.RLock()
        
        self.broker_sock: Optional[socket.socket] = None
        self.broker_connected: bool = False
        
        self.active_sessions: Dict[str, str] = {}
        
        self.claimed_user: Optional[str] = None
        self.claim_deadline: float = 0.0
        self.claim_duration_sec: float = 300.0  # 5분
        
        self.nodes_online: Dict[str, bool] = {
            "T8_CTRL": False,
            "T8_HMI": False,
            "T8_MOTION": False,
            "T8_VISION": False
        }
        
        self.ctrl_state: str = "READY"
        self.ctrl_mode: str = "AUTO"
        self.tray_position: int = 90
        self.last_event_msg: str = "시스템 준비 완료"
        self.vision_result: str = "NONE"
        
        self.cycle_timer_active: bool = False
        self.system_logs = deque(maxlen=70)

    def log(self, text: str):
        with self.lock:
            ts = time.strftime("%H:%M:%S")
            self.system_logs.append(f"[{ts}] {text}")

    def set_node_status(self, node_id: str, is_online: bool):
        with self.lock:
            if node_id in self.nodes_online:
                self.nodes_online[node_id] = is_online

    def is_online(self, node_id: str) -> bool:
        with self.lock:
            return self.nodes_online.get(node_id, False)

    def get_offline_required_nodes(self) -> List[str]:
        with self.lock:
            return [n for n in REQUIRED_NODES if not self.nodes_online.get(n, False)]

    def are_all_required_nodes_online(self) -> bool:
        return len(self.get_offline_required_nodes()) == 0

    def check_claim_expiration(self):
        with self.lock:
            if not self.claimed_user:
                return

            if time.time() > self.claim_deadline:
                self.system_logs.append(f"[{time.strftime('%H:%M:%S')}] [제어권] '{self.claimed_user}' 점유 시간 만료 (자동 해제)")
                self.claimed_user = None
                self.claim_deadline = 0.0
                self.send_broker_cmd("[T8_VISION]LOCK\n")

    def send_broker_cmd(self, raw_cmd: str) -> bool:
        with self.lock:
            if self.broker_sock and self.broker_connected:
                try:
                    self.broker_sock.sendall(raw_cmd.encode("utf-8"))
                    return True
                except Exception:
                    self.broker_connected = False
            return False

    def schedule_next_cycle(self):
        with self.lock:
            if self.cycle_timer_active:
                return
            self.cycle_timer_active = True

        def auto_cycle_worker():
            time.sleep(2.5)
            with self.lock:
                self.cycle_timer_active = False
                if self.ctrl_state in ["PASS", "FAIL"]:
                    self.send_broker_cmd("[T8_CTRL]ACT@DONE\n")
                    self.log("[사이클] 판정 표시 완료 -> 다음 공정 대기")

        t = threading.Thread(target=auto_cycle_worker, daemon=True)
        t.start()

sf_mgr = SmartFactoryManager()

# ==============================================================================
# 3. 브로커 통신 백그라운드 워커
# ==============================================================================
def broker_client_worker():
    while True:
        try:
            sf_mgr.log("[*] 브로커 서버(127.0.0.1:8080) 연결 시도...")
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5.0)
            sock.connect((BROKER_HOST, BROKER_PORT))
            
            sock.sendall(b"[T8_WEB:PASSWD]\n")
            
            with sf_mgr.lock:
                sf_mgr.broker_sock = sock
                sf_mgr.broker_connected = True
                
            sf_mgr.log("[+] T8_WEB 브로커 접속 완료")
            sock.settimeout(1.0)
            
            buffer = ""
            last_sync_time = 0.0

            while True:
                if time.time() - last_sync_time > 3.0:
                    try:
                        sock.sendall(b"[T8_CTRL]SYNC\n")
                        sock.sendall(b"[SERVER]GET_CLIENTS\n")
                        last_sync_time = time.time()
                    except Exception:
                        break

                try:
                    data = sock.recv(2048)
                    if not data:
                        break
                    buffer += data.decode("utf-8", errors="ignore")
                except socket.timeout:
                    sf_mgr.check_claim_expiration()
                    continue
                except Exception:
                    break

                while "\n" in buffer:
                    line, buffer = buffer.split("\n", 1)
                    line = line.strip()
                    if line:
                        parse_incoming_broker_packet(line)

        except Exception:
            with sf_mgr.lock:
                sf_mgr.broker_connected = False
                sf_mgr.broker_sock = None
            time.sleep(3)

def parse_incoming_broker_packet(line: str):
    sf_mgr.log(f">> {line}")
    
    if "CLIENT_LIST@" in line:
        raw_list = line.split("CLIENT_LIST@")[1].strip()
        online_nodes = [n.strip() for n in raw_list.split(",") if n.strip()]
        for req in REQUIRED_NODES:
            sf_mgr.set_node_status(req, req in online_nodes)
        return

    if "NODE_EVENT@" in line:
        parts = line.split("NODE_EVENT@")[1].split("@")
        if len(parts) >= 2:
            node, ev = parts[0], parts[1]
            sf_mgr.set_node_status(node, (ev == "ONLINE"))
        return

    m_warn = re.search(r"Target client '([^']+)' not connected", line)
    if m_warn:
        dead_node = m_warn.group(1)
        sf_mgr.set_node_status(dead_node, False)
        return

    for node in ["T8_HMI", "T8_CTRL", "T8_MOTION", "T8_VISION"]:
        if node in line:
            sf_mgr.set_node_status(node, True)

    with sf_mgr.lock:
        if "ESTOP" in line:
            sf_mgr.ctrl_state = "ESTOP"
            sf_mgr.last_event_msg = "비상 정지(ESTOP) 발령"
        elif "STATE TRANSITION" in line:
            parts = line.split("->")
            if len(parts) > 1:
                sf_mgr.ctrl_state = parts[1].strip()
        elif "STATE@" in line:
            m = re.search(r"STATE@([A-Z_]+)", line)
            if m: sf_mgr.ctrl_state = m.group(1)

        m_mode = re.search(r"MODE@([A-Z_]+)", line)
        if m_mode: sf_mgr.ctrl_mode = m_mode.group(1)

        m_tray = re.search(r"TRAY@(\d+)", line)
        if m_tray: sf_mgr.tray_position = int(m_tray.group(1))

        m_evt = re.search(r"FROM:\s*([^|]+)\|\s*CMD:\s*([^\s]+)", line)
        if m_evt: sf_mgr.last_event_msg = f"{m_evt.group(1).strip()}: {m_evt.group(2).strip()}"

    if sf_mgr.ctrl_state in ["PASS", "FAIL"]:
        sf_mgr.schedule_next_cycle()

# ==============================================================================
# 4. 보안 카메라 스트리밍 프록시
# ==============================================================================
def create_security_slate(title: str, subtitle: str, color=(0, 165, 255)) -> bytes:
    if not HAS_CV2:
        return b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xbf\x00\xff\xd9'

    img = np.zeros((480, 640, 3), dtype=np.uint8)
    img[:] = (15, 20, 28)

    cv2.rectangle(img, (20, 20), (620, 460), (40, 50, 70), 2)
    cv2.putText(img, title, (50, 210), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
    cv2.putText(img, subtitle, (50, 255), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (160, 175, 195), 1)
    
    cur_time = time.strftime("%Y-%m-%d %H:%M:%S")
    cv2.putText(img, f"SERVER TIME: {cur_time}", (50, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100, 115, 135), 1)

    if int(time.time() * 2) % 2 == 0:
        cv2.circle(img, (35, 202), 7, color, -1)

    _, buf = cv2.imencode(".jpg", img)
    return buf.tobytes()

def mjpeg_stream_proxy_generator(req_user: Optional[str]):
    while True:
        if not sf_mgr.claimed_user:
            frame = create_security_slate(
                title="[STANDBY] CAMERA LOCKED",
                subtitle="제어권을 점유(Claim)하면 실시간 렌즈 영상이 활성화됩니다.",
                color=(0, 165, 255)
            )
            yield (b"--FRAME\r\nContent-Type: image/jpeg\r\nContent-Length: " +
                   str(len(frame)).encode() + b"\r\n\r\n" + frame + b"\r\n")
            time.sleep(0.5)
            continue

        if sf_mgr.claimed_user != req_user:
            frame = create_security_slate(
                title="[ACCESS DENIED] CAMERA OCCUPIED",
                subtitle=f"현재 '{sf_mgr.claimed_user}' 사용자가 점유 중입니다. (접근 차단)",
                color=(0, 0, 220)
            )
            yield (b"--FRAME\r\nContent-Type: image/jpeg\r\nContent-Length: " +
                   str(len(frame)).encode() + b"\r\n\r\n" + frame + b"\r\n")
            time.sleep(0.5)
            continue

        try:
            with requests.get(JETSON_STREAM_URL, stream=True, timeout=3.0) as r:
                if r.status_code == 200:
                    sf_mgr.set_node_status("T8_VISION", True)
                    for chunk in r.iter_content(chunk_size=4096):
                        if sf_mgr.claimed_user != req_user:
                            break
                        yield chunk
                else:
                    raise Exception("Jetson non-200")
        except Exception:
            frame = create_security_slate(
                title="T8_VISION : CONNECTING...",
                subtitle="Jetson camera_ai_client 영상 스트림 수신 대기 중...",
                color=(0, 100, 220)
            )
            yield (b"--FRAME\r\nContent-Type: image/jpeg\r\nContent-Length: " +
                   str(len(frame)).encode() + b"\r\n\r\n" + frame + b"\r\n")
            time.sleep(0.5)

# ==============================================================================
# 5. FastAPI 라우터 및 API
# ==============================================================================
app = FastAPI(title="Smart Factory SCADA Management Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuthForm(BaseModel):
    username: str
    password: str

class ControlActionForm(BaseModel):
    action: str

class TrayControlForm(BaseModel):
    angle: int

def get_current_user_from_header(authorization: Optional[str] = Header(None)) -> Optional[str]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    return sf_mgr.active_sessions.get(token)

@app.post("/api/auth/register")
def api_register(form: AuthForm):
    u = form.username.strip()
    p = form.password.strip()
    if not u or not p:
        return JSONResponse(status_code=400, content={"error": "아이디와 비밀번호를 입력하세요."})
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT username FROM users WHERE username = ?", (u,))
    if cur.fetchone():
        conn.close()
        return JSONResponse(status_code=400, content={"error": "이미 존재하는 아이디입니다."})
    
    pw_hash = hashlib.sha256(p.encode()).hexdigest()
    cur.execute("INSERT INTO users VALUES (?, ?, ?, ?)", (u, pw_hash, "operator", time.time()))
    conn.commit()
    conn.close()
    sf_mgr.log(f"[계정] 신규 가입: '{u}'")
    return {"message": "회원가입이 완료되었습니다."}

@app.post("/api/auth/login")
def api_login(form: AuthForm):
    u = form.username.strip()
    p = form.password.strip()
    pw_hash = hashlib.sha256(p.encode()).hexdigest()
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT username, role FROM users WHERE username = ? AND password_hash = ?", (u, pw_hash))
    row = cur.fetchone()
    conn.close()
    
    if not row:
        return JSONResponse(status_code=401, content={"error": "아이디 또는 비밀번호가 올바르지 않습니다."})
    
    token = str(uuid.uuid4())
    sf_mgr.active_sessions[token] = u
    sf_mgr.log(f"[로그인] 사용자 '{u}' 로그인 성공")
    return {"token": token, "username": u, "role": row[1]}

@app.post("/api/auth/logout")
def api_logout(user: Optional[str] = Depends(get_current_user_from_header), authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        sf_mgr.active_sessions.pop(token, None)
    if user and sf_mgr.claimed_user == user:
        with sf_mgr.lock:
            sf_mgr.claimed_user = None
            sf_mgr.claim_deadline = 0.0
        sf_mgr.send_broker_cmd("[T8_VISION]LOCK\n")
    return {"message": "로그아웃되었습니다."}

@app.get("/api/auth/me")
def api_me(user: Optional[str] = Depends(get_current_user_from_header)):
    return {"username": user, "is_authenticated": user is not None}

@app.get("/api/control/status")
def api_control_status(user: Optional[str] = Depends(get_current_user_from_header)):
    sf_mgr.check_claim_expiration()
    with sf_mgr.lock:
        rem = max(0, int(sf_mgr.claim_deadline - time.time())) if sf_mgr.claimed_user else 0
        claimed_user = sf_mgr.claimed_user

    all_ready = sf_mgr.are_all_required_nodes_online()
    offline_nodes = sf_mgr.get_offline_required_nodes()
    is_occupied_by_other = (claimed_user is not None and claimed_user != user)

    return {
        "claimed_by": claimed_user,
        "is_claimed": claimed_user is not None,
        "is_occupied_by_other": is_occupied_by_other,
        "remaining_sec": rem,
        "all_nodes_ready": all_ready,
        "offline_nodes": offline_nodes,
        "can_control": (claimed_user == user) and (user is not None)
    }

@app.post("/api/control/claim")
def api_control_claim(user: Optional[str] = Depends(get_current_user_from_header)):
    if not user:
        return JSONResponse(status_code=401, content={"error": "점유 권한을 얻으려면 먼저 로그인해야 합니다."})

    offline_nodes = sf_mgr.get_offline_required_nodes()
    if offline_nodes:
        err_msg = f"필수 설비 연결 대기 중: [{', '.join(offline_nodes)}]"
        sf_mgr.log(f"[점유 거부] '{user}' 점유 실패: 오프라인 모듈 존재 ({', '.join(offline_nodes)})")
        return JSONResponse(status_code=400, content={"error": err_msg})

    sf_mgr.check_claim_expiration()
    with sf_mgr.lock:
        if sf_mgr.claimed_user and sf_mgr.claimed_user != user:
            return JSONResponse(
                status_code=403,
                content={"error": f"현재 '{sf_mgr.claimed_user}' 사용자가 제어권을 점유 중입니다. (접근 거부)"}
            )
        sf_mgr.claimed_user = user
        sf_mgr.claim_deadline = time.time() + sf_mgr.claim_duration_sec

    sf_mgr.send_broker_cmd("[T8_VISION]UNLOCK\n")
    sf_mgr.log(f"[제어권 획득] '{user}' 점유 획득 -> [T8_VISION]UNLOCK 송출")
    return {"message": "제어권을 점유했습니다.", "claimed_by": user}

@app.post("/api/control/release")
def api_control_release(user: Optional[str] = Depends(get_current_user_from_header)):
    if not user:
        return JSONResponse(status_code=401, content={"error": "로그인이 필요합니다."})
    
    with sf_mgr.lock:
        if sf_mgr.claimed_user != user:
            return JSONResponse(status_code=403, content={"error": "본인이 점유한 제어권만 해제할 수 있습니다."})
        sf_mgr.claimed_user = None
        sf_mgr.claim_deadline = 0.0

    sf_mgr.send_broker_cmd("[T8_VISION]LOCK\n")
    sf_mgr.log(f"[제어권 반납] '{user}' 점유 해제 -> [T8_VISION]LOCK 송출")
    return {"message": "제어권이 정상적으로 해제되었습니다."}

@app.post("/api/control/action")
def api_control_action(form: ControlActionForm, user: Optional[str] = Depends(get_current_user_from_header)):
    act = form.action.upper().strip()

    if not user:
        return JSONResponse(status_code=401, content={"error": "로그인이 필요합니다."})

    sf_mgr.check_claim_expiration()
    with sf_mgr.lock:
        claimed = sf_mgr.claimed_user

    if claimed and claimed != user:
        return JSONResponse(status_code=403, content={"error": f"현재 '{claimed}' 사용자가 독점 점유 중입니다."})

    if not claimed:
        return JSONResponse(status_code=403, content={"error": "제어권을 먼저 점유해야 조작할 수 있습니다."})

    cmd_table = {
        "START": "[T8_CTRL]START\n",
        "END": "[T8_CTRL]END\n",
        "RESET": "[T8_CTRL]RESET\n",
        "MODE_AUTO": "[T8_CTRL]MODE@AUTO\n",
        "MODE_MANUAL": "[T8_CTRL]MODE@MANUAL\n",
        "ESTOP": "[T8_CTRL]ESTOP\n"
    }

    if act not in cmd_table:
        return JSONResponse(status_code=400, content={"error": "지원하지 않는 명령입니다."})

    ok = sf_mgr.send_broker_cmd(cmd_table[act])
    if ok:
        sf_mgr.log(f"[조작 송출] {user} -> {cmd_table[act].strip()}")
        return {"message": f"{act} 명령 전송 완료"}
    else:
        return JSONResponse(status_code=500, content={"error": "브로커 서버와의 통신 에러"})

# 수동 점검 모드 서보모터 트레이 각도 제어 API
@app.post("/api/control/tray")
def api_control_tray(form: TrayControlForm, user: Optional[str] = Depends(get_current_user_from_header)):
    if not user:
        return JSONResponse(status_code=401, content={"error": "로그인이 필요합니다."})

    sf_mgr.check_claim_expiration()
    with sf_mgr.lock:
        claimed = sf_mgr.claimed_user
        mode = sf_mgr.ctrl_mode

    if claimed and claimed != user:
        return JSONResponse(status_code=403, content={"error": f"현재 '{claimed}' 사용자가 점유 중입니다."})

    if not claimed:
        return JSONResponse(status_code=403, content={"error": "제어권을 먼저 점유해야 합니다."})

    if mode != "MANUAL":
        return JSONResponse(status_code=400, content={"error": "트레이 수동 조작은 MANUAL(점검) 모드에서만 가능합니다."})

    angle = max(0, min(180, form.angle))
    cmd = f"[T8_CTRL]TRAY@{angle}\n"
    ok = sf_mgr.send_broker_cmd(cmd)
    if ok:
        with sf_mgr.lock:
            sf_mgr.tray_position = angle
        sf_mgr.log(f"[수동 제어] 트레이 각도 설정: {angle}°")
        return {"message": f"트레이 각도 {angle}° 전송 완료", "angle": angle}
    return JSONResponse(status_code=500, content={"error": "브로커 통신 에러"})

@app.get("/video_feed")
def get_video_stream(token: Optional[str] = Query(None)):
    req_user = sf_mgr.active_sessions.get(token) if token else None
    return StreamingResponse(
        mjpeg_stream_proxy_generator(req_user),
        media_type="multipart/x-mixed-replace; boundary=FRAME"
    )

@app.get("/api/devices")
def get_device_nodes():
    return {
        "T8_CTRL": {"name": "중앙 FSM 제어기", "online": sf_mgr.is_online("T8_CTRL")},
        "T8_HMI": {"name": "작업자 HMI 패널 (BT)", "online": sf_mgr.is_online("T8_HMI")},
        "T8_MOTION": {"name": "모션 구동 노드 (Wi-Fi)", "online": sf_mgr.is_online("T8_MOTION")},
        "T8_VISION": {"name": "AI 비전 검사 노드 (Jetson)", "online": sf_mgr.is_online("T8_VISION")}
    }

@app.get("/api/ctrl/status")
def get_controller_status():
    with sf_mgr.lock:
        return {
            "state": sf_mgr.ctrl_state,
            "mode": sf_mgr.ctrl_mode,
            "tray": sf_mgr.tray_position,
            "last_event": sf_mgr.last_event_msg
        }

@app.get("/api/logs")
def get_recent_logs():
    with sf_mgr.lock:
        return list(sf_mgr.system_logs)

# ==============================================================================
# 6. 임베디드 웹 SCADA 대시보드 UI
# ==============================================================================
@app.get("/", response_class=HTMLResponse)
def serve_dashboard():
    return """
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>스마트 팩토리 통합 SCADA 공정 관제</title>
  <style>
    :root {
      --bg: #090d16; --panel: #131b29; --panel-border: #1e293b;
      --text: #f8fafc; --sub: #94a3b8;
      --green: #10b981; --red: #ef4444; --yellow: #f59e0b; --blue: #3b82f6; --purple: #a855f7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--bg); color: var(--text); padding: 18px; }

    header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; border-bottom: 1px solid var(--panel-border); margin-bottom: 18px; }
    .title { font-size: 20px; font-weight: 800; color: var(--blue); display: flex; align-items: center; gap: 8px; }

    #estop-banner {
      display: none; background: var(--red); color: white; padding: 14px;
      font-size: 18px; font-weight: 900; text-align: center; border-radius: 8px;
      margin-bottom: 18px; animation: blink 0.8s infinite alternate;
    }
    #occupied-banner {
      display: none; background: #7f1d1d; border: 1px solid var(--red); color: #fecaca;
      padding: 12px; font-size: 14px; font-weight: 800; text-align: center; border-radius: 8px;
      margin-bottom: 18px;
    }
    @keyframes blink { from { opacity: 0.8; } to { opacity: 1; } }

    #interlock-status-bar {
      background: rgba(245, 158, 11, 0.12); border: 1px solid var(--yellow); color: var(--yellow);
      padding: 10px 16px; border-radius: 6px; font-size: 13px; font-weight: 700;
      margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between;
    }

    .top-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 14px; margin-bottom: 18px; }
    .top-card {
      background: var(--panel); border: 1px solid var(--panel-border); border-radius: 8px;
      padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;
    }

    .nodes-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 18px; }
    .node-card {
      background: var(--panel); border: 1px solid var(--panel-border); border-radius: 8px;
      padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;
    }
    .node-name { font-weight: 700; font-size: 14px; }
    .node-desc { font-size: 11px; color: var(--sub); margin-top: 2px; }
    .badge {
      padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 800;
      display: flex; align-items: center; gap: 6px;
    }
    .badge-on { background: rgba(16, 185, 129, 0.15); color: var(--green); border: 1px solid var(--green); }
    .badge-off { background: rgba(239, 68, 68, 0.15); color: var(--red); border: 1px solid var(--red); }
    .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .dot-on { background: var(--green); box-shadow: 0 0 8px var(--green); }
    .dot-off { background: var(--red); }

    .main-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: 18px; }
    .panel { background: var(--panel); border: 1px solid var(--panel-border); border-radius: 8px; padding: 16px; }
    .panel-head { font-weight: 700; font-size: 14px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }

    .cam-box {
      width: 100%; height: 350px; background: #000; border-radius: 6px;
      overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;
    }
    .cam-box img { width: 100%; height: 100%; object-fit: contain; }

    .state-banner {
      background: #080c14; border: 1px solid var(--panel-border); border-radius: 8px;
      padding: 16px; text-align: center; margin-bottom: 14px;
    }
    .state-title { font-size: 11px; color: var(--sub); text-transform: uppercase; }
    .state-val { font-size: 32px; font-weight: 900; letter-spacing: 2px; margin: 4px 0; color: var(--blue); }

    .pipeline { display: flex; gap: 4px; margin-bottom: 14px; }
    .step {
      flex: 1; text-align: center; font-size: 11px; padding: 8px 2px;
      background: #1e293b; color: var(--sub); border-radius: 4px; font-weight: 600;
      transition: all 0.25s ease;
    }
    .step.active { background: var(--blue); color: white; font-weight: 800; box-shadow: 0 0 10px rgba(59,130,246,0.5); }
    .step.pass { background: var(--green); color: white; }
    .step.fail { background: var(--red); color: white; }

    /* 수동 점검 트레이 조작 패널 */
    .jog-card {
      background: #0b111e; border: 1px solid #1e293b; border-radius: 6px;
      padding: 12px 14px; margin-bottom: 14px;
    }
    .jog-head { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 8px; }
    .jog-slider {
      width: 100%; cursor: pointer; accent-color: var(--blue); height: 6px; margin-bottom: 10px;
    }
    .jog-btn-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .jog-btn {
      padding: 6px 8px; font-size: 11px; font-weight: 700; border-radius: 4px;
      background: #1e293b; color: #cbd5e1; border: 1px solid #334155;
    }
    .jog-btn:hover:not(:disabled) { background: #334155; color: white; }

    .btn-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 14px; }
    button {
      cursor: pointer; padding: 10px 14px; border-radius: 6px; font-weight: 700;
      font-size: 13px; border: 1px solid transparent; transition: all 0.2s;
    }
    button:disabled { opacity: 0.3; cursor: not-allowed; }
    .btn-blue { background: #1d4ed8; color: white; }
    .btn-blue:hover:not(:disabled) { background: #2563eb; }
    .btn-gray { background: #334155; color: white; }
    .btn-gray:hover:not(:disabled) { background: #475569; }
    .btn-red { background: #dc2626; color: white; grid-column: span 3; padding: 12px; font-size: 15px; }
    .btn-red:hover:not(:disabled) { background: #ef4444; }

    .terminal {
      background: #050811; height: 140px; border-radius: 6px; padding: 10px;
      font-family: monospace; font-size: 11px; overflow-y: auto; color: #93c5fd; margin-top: 18px;
    }

    .modal {
      display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7); justify-content: center; align-items: center; z-index: 100;
    }
    .modal-box { background: var(--panel); border: 1px solid var(--panel-border); padding: 24px; border-radius: 8px; width: 330px; }
    .modal-box input { width: 100%; padding: 10px; margin-bottom: 12px; background: #0a0e17; border: 1px solid var(--panel-border); color: white; border-radius: 4px; }
  </style>
</head>
<body>

  <div id="estop-banner">🚨 EMERGENCY STOP TRIGGERED - SYSTEM LOCKED 🚨</div>
  <div id="occupied-banner">⚠️ 현재 다른 사용자가 설비를 점유하여 조작 중입니다. 조작 권한 및 카메라 열람이 전면 제한됩니다.</div>

  <header>
    <div class="title">⚙ SMART FACTORY MES / SCADA DASHBOARD</div>
    <div id="auth-status-text" style="font-size: 13px; color: var(--sub);">확인 중...</div>
  </header>

  <div id="interlock-status-bar">
    <span id="interlock-msg">🔍 설비 상태 확인 중...</span>
    <span id="interlock-badge" style="padding: 2px 8px; border-radius: 4px; font-size: 11px; background: #334155; color: white;">확인 중</span>
  </div>

  <div class="top-grid">
    <div class="top-card">
      <div>
        <span style="font-size: 12px; color: var(--sub);">접속 계정:</span>
        <strong id="user-name" style="margin-left: 6px;">Guest (로그인 필요)</strong>
      </div>
      <div id="user-btn-box">
        <button class="btn-blue" onclick="showModal('login')">로그인</button>
        <button class="btn-gray" onclick="showModal('register')">회원가입</button>
      </div>
    </div>

    <div class="top-card">
      <div>
        <span style="font-size: 12px; color: var(--sub);">제어 권한(Authority):</span>
        <strong id="claim-desc" style="margin-left: 6px; color: var(--yellow);">미점유 (조작 불가)</strong>
      </div>
      <div>
        <button id="btn-claim" class="btn-blue" onclick="reqClaim()">제어권 점유(Claim)</button>
        <button id="btn-release" class="btn-gray" style="display:none;" onclick="reqRelease()">점유 해제</button>
      </div>
    </div>
  </div>

  <div class="nodes-grid">
    <div class="node-card">
      <div>
        <div class="node-name">T8_CTRL</div>
        <div class="node-desc">중앙 FSM 제어기</div>
      </div>
      <div id="b-ctrl" class="badge badge-off"><span class="dot dot-off"></span>OFFLINE</div>
    </div>
    <div class="node-card">
      <div>
        <div class="node-name">T8_HMI</div>
        <div class="node-desc">작업자 패널 (Bluetooth)</div>
      </div>
      <div id="b-hmi" class="badge badge-off"><span class="dot dot-off"></span>OFFLINE</div>
    </div>
    <div class="node-card">
      <div>
        <div class="node-name">T8_MOTION</div>
        <div class="node-desc">서보모터 구동 (Wi-Fi)</div>
      </div>
      <div id="b-motion" class="badge badge-off"><span class="dot dot-off"></span>OFFLINE</div>
    </div>
    <div class="node-card">
      <div>
        <div class="node-name">T8_VISION</div>
        <div class="node-desc">AI 비전 검사 노드 (Jetson)</div>
      </div>
      <div id="b-vision" class="badge badge-off"><span class="dot dot-off"></span>OFFLINE</div>
    </div>
  </div>

  <div class="main-grid">
    <div class="panel">
      <div class="panel-head">
        <span>VISION CAMERA FEED</span>
        <span id="cam-tag" style="font-size: 11px; color: var(--yellow); font-weight: bold;">● LOCKED</span>
      </div>
      <div class="cam-box">
        <img id="cam-img" src="/video_feed" alt="Vision Stream">
      </div>
      <div style="margin-top: 10px; font-size: 12px; color: var(--sub);">
        보안 정책: 본인이 점유한 경우에만 실시간 카메라 피드가 개방됩니다.
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">MACHINE FSM PROCESS CONTROL</div>
      
      <div id="fsm-box" class="state-banner">
        <div class="state-title">Current Machine State</div>
        <div id="val-state" class="state-val">UNKNOWN</div>
        <div style="font-size: 12px; color: var(--sub);">
          <span id="val-mode">AUTO</span> MODE | 트레이 서보: <span id="val-tray">90</span>°
        </div>
      </div>

      <!-- 공정 파이프라인 (MANUAL 시 전체 소등) -->
      <div class="pipeline">
        <div id="pipe-1" class="step">1. READY</div>
        <div id="pipe-2" class="step">2. WORKING</div>
        <div id="pipe-3" class="step">3. INSPECTING</div>
        <div id="pipe-4" class="step">4. RESULT</div>
      </div>

      <!-- 수동 점검 트레이 조작 카드 -->
      <div class="jog-card">
        <div class="jog-head">
          <span>🛠️ 서보 트레이 수동 조작 (점검 모드)</span>
          <span style="color: var(--blue);"><span id="jog-deg">90</span>°</span>
        </div>
        <input type="range" id="tray-slider" class="jog-slider" min="0" max="180" value="90" oninput="onSliderInput(this.value)" onchange="onSliderChange(this.value)" disabled>
        <div class="jog-btn-grid">
          <button id="jog-b1" class="jog-btn" onclick="sendTrayAngle(30)" disabled>30° (FAIL 배출)</button>
          <button id="jog-b2" class="jog-btn" onclick="sendTrayAngle(90)" disabled>90° (HOME 원점)</button>
          <button id="jog-b3" class="jog-btn" onclick="sendTrayAngle(150)" disabled>150° (PASS 배출)</button>
        </div>
      </div>

      <div style="font-size: 12px; color: var(--sub); margin-bottom: 8px;">
        최근 이벤트: <strong id="val-evt" style="color: var(--text);">-</strong>
      </div>

      <div class="btn-grid">
        <button id="btn-start" class="btn-blue" onclick="sendAction('START')" disabled>▶ START (공정 시작)</button>
        <button id="btn-end" class="btn-gray" onclick="sendAction('END')" disabled>⏹ STOP / END</button>
        <button id="btn-mode" class="btn-gray" onclick="toggleMode()" disabled>⚙ MODE 전환</button>
        <button id="btn-reset" class="btn-gray" style="grid-column: span 3;" onclick="sendAction('RESET')" disabled>🔄 FAULT / ESTOP 복구</button>
        <button id="btn-estop" class="btn-red" onclick="sendAction('ESTOP')" disabled>🚨 EMERGENCY STOP (ESTOP)</button>
      </div>
    </div>
  </div>

  <div class="panel" style="margin-top: 18px;">
    <div style="font-weight: 700; font-size: 13px; margin-bottom: 6px;">실시간 브로커 메시지 라우팅 콘솔</div>
    <div id="term" class="terminal"></div>
  </div>

  <div id="modal" class="modal">
    <div class="modal-box">
      <h3 id="modal-title" style="margin-bottom: 14px;">로그인</h3>
      <input type="text" id="m-user" placeholder="사용자 ID">
      <input type="password" id="m-pass" placeholder="비밀번호">
      <button id="m-btn" class="btn-blue" style="width: 100%; margin-bottom: 8px;">확인</button>
      <button class="btn-gray" style="width: 100%;" onclick="hideModal()">취소</button>
    </div>
  </div>

  <script>
    let token = localStorage.getItem('jwt_token') || '';
    let currentUser = null;
    let canControl = false;
    let currentMode = 'AUTO';
    let modalMode = 'login';
    let lastClaimedBy = null;
    let isUserDraggingSlider = false;

    function getHeaders() {
      return token
        ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };
    }

    function showModal(m) {
      modalMode = m;
      document.getElementById('modal-title').innerText = m === 'login' ? '로그인' : '회원가입';
      document.getElementById('m-btn').innerText = m === 'login' ? '로그인' : '가입하기';
      document.getElementById('modal').style.display = 'flex';
    }
    function hideModal() { document.getElementById('modal').style.display = 'none'; }

    document.getElementById('m-btn').onclick = async () => {
      const u = document.getElementById('m-user').value.trim();
      const p = document.getElementById('m-pass').value.trim();
      if (!u || !p) return alert('아이디와 비밀번호를 입력하세요.');
      
      const endpoint = modalMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error);

      if (modalMode === 'login') {
        token = data.token;
        localStorage.setItem('jwt_token', token);
        hideModal();
        reloadCameraFeed();
        pollData();
      } else {
        alert('회원가입 성공! 로그인해 주세요.');
        showModal('login');
      }
    };

    async function reqLogout() {
      await fetch('/api/auth/logout', { method: 'POST', headers: getHeaders() });
      token = '';
      localStorage.removeItem('jwt_token');
      reloadCameraFeed();
      pollData();
    }

    async function reqClaim() {
      const res = await fetch('/api/control/claim', { method: 'POST', headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      else reloadCameraFeed();
      pollData();
    }

    async function reqRelease() {
      const res = await fetch('/api/control/release', { method: 'POST', headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      else reloadCameraFeed();
      pollData();
    }

    function reloadCameraFeed() {
      const img = document.getElementById('cam-img');
      if (img) {
        img.src = '/video_feed?token=' + encodeURIComponent(token || '') + '&t=' + Date.now();
      }
    }

    async function sendAction(act) {
      const res = await fetch('/api/control/action', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action: act })
      });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      pollData();
    }

    // 소프트웨어 트레이 각도 송출
    async function sendTrayAngle(angle) {
      document.getElementById('tray-slider').value = angle;
      document.getElementById('jog-deg').innerText = angle;
      const res = await fetch('/api/control/tray', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ angle: parseInt(angle) })
      });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      pollData();
    }

    function onSliderInput(val) {
      isUserDraggingSlider = true;
      document.getElementById('jog-deg').innerText = val;
    }

    function onSliderChange(val) {
      isUserDraggingSlider = false;
      sendTrayAngle(val);
    }

    function toggleMode() {
      const nxt = currentMode === 'AUTO' ? 'MODE_MANUAL' : 'MODE_AUTO';
      sendAction(nxt);
    }

    function updateBadge(id, isOnline) {
      const el = document.getElementById(id);
      if (isOnline) {
        el.className = 'badge badge-on';
        el.innerHTML = '<span class="dot dot-on"></span>ONLINE';
      } else {
        el.className = 'badge badge-off';
        el.innerHTML = '<span class="dot dot-off"></span>OFFLINE';
      }
    }

    async function pollData() {
      try {
        const meRes = await fetch('/api/auth/me', { headers: getHeaders() });
        if (meRes.ok) {
          const meData = await meRes.json();
          currentUser = meData.username;
          document.getElementById('user-name').innerText = currentUser || 'Guest (로그인 필요)';
          document.getElementById('user-btn-box').innerHTML = currentUser
            ? `<button class="btn-gray" onclick="reqLogout()">로그아웃</button>`
            : `<button class="btn-blue" onclick="showModal('login')">로그인</button> <button class="btn-gray" onclick="showModal('register')">회원가입</button>`;
        }

        const claimRes = await fetch('/api/control/status', { headers: getHeaders() });
        if (claimRes.ok) {
          const cData = await claimRes.json();
          canControl = cData.can_control;

          if (lastClaimedBy !== cData.claimed_by) {
            lastClaimedBy = cData.claimed_by;
            reloadCameraFeed();
          }

          const occBanner = document.getElementById('occupied-banner');
          const iBar = document.getElementById('interlock-status-bar');
          const iMsg = document.getElementById('interlock-msg');
          const iBadge = document.getElementById('interlock-badge');
          const cText = document.getElementById('claim-desc');
          const bClaim = document.getElementById('btn-claim');
          const bRel = document.getElementById('btn-release');
          const camTag = document.getElementById('cam-tag');

          if (cData.is_occupied_by_other) {
            occBanner.style.display = 'block';
            occBanner.innerText = `⚠️ 현재 '${cData.claimed_by}' 님이 설비를 점유 중입니다. 조작 권한 및 카메라 열람이 전면 제한됩니다.`;
            cText.innerText = `타 사용자 점유 중: ${cData.claimed_by}`;
            cText.style.color = 'var(--red)';
            bClaim.style.display = 'inline-block';
            bClaim.disabled = true;
            bRel.style.display = 'none';
            camTag.style.color = 'var(--red)';
            camTag.innerText = '● LOCKED (접근 차단)';
          } else {
            occBanner.style.display = 'none';
            if (cData.is_claimed) {
              cText.innerText = `점유자: ${cData.claimed_by} (잔여: ${cData.remaining_sec}s)`;
              cText.style.color = 'var(--green)';
              bClaim.style.display = 'none';
              bRel.style.display = 'inline-block';
              camTag.style.color = 'var(--green)';
              camTag.innerText = '● LIVE FEED ACTIVE';
            } else {
              cText.innerText = '미점유 (조작 불가)';
              cText.style.color = 'var(--yellow)';
              bClaim.style.display = 'inline-block';
              bClaim.disabled = !currentUser || !cData.all_nodes_ready;
              bRel.style.display = 'none';
              camTag.style.color = 'var(--yellow)';
              camTag.innerText = '● LOCKED (점유 필요)';
            }
          }

          if (cData.all_nodes_ready) {
            iBar.style.background = 'rgba(16, 185, 129, 0.12)';
            iBar.style.borderColor = 'var(--green)';
            iBar.style.color = 'var(--green)';
            iMsg.innerText = '✅ 모든 필수 모듈(T8_CTRL, T8_HMI, T8_MOTION, T8_VISION) 활성화 완료';
            iBadge.style.background = 'var(--green)';
            iBadge.innerText = 'ONLINE';
          } else {
            iBar.style.background = 'rgba(239, 68, 68, 0.12)';
            iBar.style.borderColor = 'var(--red)';
            iBar.style.color = 'var(--red)';
            iMsg.innerText = `⛔ 설비 미연결 감지 [오프라인: ${cData.offline_nodes.join(', ')}]`;
            iBadge.style.background = 'var(--red)';
            iBadge.innerText = 'OFFLINE DETECTED';
          }
        }

        const devRes = await fetch('/api/devices');
        if (devRes.ok) {
          const devs = await devRes.json();
          updateBadge('b-ctrl', devs.T8_CTRL.online);
          updateBadge('b-hmi', devs.T8_HMI.online);
          updateBadge('b-motion', devs.T8_MOTION.online);
          updateBadge('b-vision', devs.T8_VISION.online);
        }

        const ctrlRes = await fetch('/api/ctrl/status');
        if (ctrlRes.ok) {
          const ctrl = await ctrlRes.json();
          currentMode = ctrl.mode;

          const sVal = document.getElementById('val-state');
          const estop = document.getElementById('estop-banner');

          // 1. 파이프라인 표시 초기화 (소등 기본값)
          ['pipe-1', 'pipe-2', 'pipe-3', 'pipe-4'].forEach(id => {
            document.getElementById(id).className = 'step';
          });

          // 2. 상태 배너 및 파이프라인 점등/소등 제어
          if (ctrl.state === 'ESTOP') {
            sVal.innerText = 'ESTOP';
            sVal.style.color = 'var(--red)';
            estop.style.display = 'block';
          } else if (ctrl.mode === 'MANUAL' || ctrl.state === 'MANUAL') {
            estop.style.display = 'none';
            sVal.innerText = 'MANUAL (점검 모드)';
            sVal.style.color = 'var(--yellow)';
            // MANUAL(점검 모드)인 경우: READY, WORKING 등 모든 파이프라인 점등을 소등 상태로 유지
          } else {
            estop.style.display = 'none';
            sVal.innerText = ctrl.state;

            if (ctrl.state === 'READY' || ctrl.state === 'IDLE') {
              sVal.style.color = 'var(--blue)';
              document.getElementById('pipe-1').className = 'step active';
            } else if (ctrl.state === 'WORKING') {
              sVal.style.color = 'var(--yellow)';
              document.getElementById('pipe-2').className = 'step active';
            } else if (ctrl.state === 'INSPECTING') {
              sVal.style.color = 'var(--purple)';
              document.getElementById('pipe-3').className = 'step active';
            } else if (ctrl.state === 'PASS') {
              sVal.style.color = 'var(--green)';
              const p = document.getElementById('pipe-4');
              p.className = 'step pass';
              p.innerText = '4. PASS (양품)';
            } else if (ctrl.state === 'FAIL') {
              sVal.style.color = 'var(--red)';
              const p = document.getElementById('pipe-4');
              p.className = 'step fail';
              p.innerText = '4. FAIL (불량)';
            }
          }

          document.getElementById('val-mode').innerText = ctrl.mode;
          document.getElementById('val-tray').innerText = ctrl.tray;
          document.getElementById('val-evt').innerText = ctrl.last_event;

          // 3. 서보 트레이 슬라이더 및 프리셋 동기화
          if (!isUserDraggingSlider) {
            document.getElementById('tray-slider').value = ctrl.tray;
            document.getElementById('jog-deg').innerText = ctrl.tray;
          }

          const isManualControlAllowed = canControl && (ctrl.mode === 'MANUAL');
          document.getElementById('tray-slider').disabled = !isManualControlAllowed;
          document.getElementById('jog-b1').disabled = !isManualControlAllowed;
          document.getElementById('jog-b2').disabled = !isManualControlAllowed;
          document.getElementById('jog-b3').disabled = !isManualControlAllowed;

          // 4. 제어 버튼 활성화/비활성화 (MANUAL 모드에서는 START 차단)
          document.getElementById('btn-start').disabled = !canControl || (ctrl.mode === 'MANUAL');
          document.getElementById('btn-end').disabled = !canControl;
          document.getElementById('btn-mode').disabled = !canControl;
          document.getElementById('btn-reset').disabled = !canControl;
          document.getElementById('btn-estop').disabled = !canControl;
        }

        const logRes = await fetch('/api/logs');
        if (logRes.ok) {
          const logs = await logRes.json();
          const term = document.getElementById('term');
          term.innerHTML = logs.map(l => `<div>${l}</div>`).join('');
          term.scrollTop = term.scrollHeight;
        }

      } catch (err) {
        console.error("Dashboard Poll Error:", err);
      }
    }

    setInterval(pollData, 1000);
    pollData();
  </script>
</body>
</html>
    """

# ==============================================================================
# 7. 실행 엔트리포인트
# ==============================================================================
if __name__ == "__main__":
    t_broker = threading.Thread(target=broker_client_worker, daemon=True)
    t_broker.start()

    print(f"[*] 스마트 팩토리 SCADA 웹 서버 가동: http://0.0.0.0:{WEB_PORT}")
    try:
        uvicorn.run(app, host="0.0.0.0", port=WEB_PORT, log_level="warning")
    except KeyboardInterrupt:
        print("\n[*] 서버 안전 종료 완료")
