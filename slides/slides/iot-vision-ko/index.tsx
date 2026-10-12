import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

// 슬라이드 내 포함된 실제 고해상도 그래픽 자산 Import
import coverImg from './assets/cover-line.png';
import contentsImg from './assets/contents-line.png';
import visionImg from './assets/vision-inspect.png';
import dbImg from './assets/db-dashboard.png';
import servoImg from './assets/servo-tray.png';
import flowImg from './assets/flow-overview.png';

// ==============================================================================
// 1. PPT 원본 테마 시스템 정의 (Deep Industrial Navy & Bright Accent)
// ==============================================================================
export const design: DesignSystem = {
  palette: {
    bg: '#0a1626',
    text: '#ffffff',
    accent: '#0a66c2',
  },
  fonts: {
    display: '"Pretendard", "Noto Sans KR", system-ui, -apple-system, sans-serif',
    body: '"Pretendard", "Noto Sans KR", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 130, body: 28 },
  radius: 14,
};

const c = {
  bg: '#0a1626',
  surface: '#112238',
  card: 'rgba(17, 34, 56, 0.85)',
  cardBorder: 'rgba(215, 229, 241, 0.18)',
  navyDark: '#002060',
  navyDeep: '#132A44',
  bluePoint: '#0A4CB9',
  cyanPoint: '#087F8C',
  greenSuccess: '#187750',
  redDanger: '#B43B42',
  textMuted: '#94a9bf',
  textSub: '#d7e5f1',
};

const monoFont = '"JetBrains Mono", "SF Mono", Consolas, monospace';

const canvasBase: CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: c.bg,
  color: '#ffffff',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  padding: '70px 90px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

// ==============================================================================
// 2. 공통 프레임 컴포넌트 (Footer, Header, Card)
// ==============================================================================
const SlideFooter = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(215, 229, 241, 0.15)',
        paddingTop: 16,
        fontSize: 16,
        color: c.textMuted,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ color: '#ffffff', fontWeight: 700 }}>IoT Vision 자동 품질 검사·분류 시스템</span>
        <span>|</span>
        <span>8조 손준호 · 정승헌</span>
        <span>|</span>
        <span style={{ color: c.textSub }}>온디바이스 AI SW 개발 과정</span>
      </div>
      <div style={{ fontWeight: 700, fontFamily: monoFont, color: '#38bdf8' }}>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
    </div>
  );
};

const Header = ({
  category,
  title,
  subtitle,
}: {
  category: string;
  title: string;
  subtitle: string;
}) => (
  <div style={{ marginBottom: 28 }}>
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 14px',
        borderRadius: 9999,
        backgroundColor: 'rgba(10, 76, 185, 0.25)',
        border: '1px solid #0A4CB9',
        color: '#60a5fa',
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 12,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#38bdf8' }} />
      {category}
    </div>
    <h1
      style={{
        fontSize: 44,
        fontWeight: 800,
        margin: 0,
        lineHeight: 1.2,
        color: '#ffffff',
        letterSpacing: '-0.02em',
      }}
    >
      {title}
    </h1>
    <p
      style={{
        fontSize: 20,
        color: c.textSub,
        margin: '8px 0 0 0',
        lineHeight: 1.4,
      }}
    >
      {subtitle}
    </p>
  </div>
);

// ==============================================================================
// Slide 1: 표지 (Cover)
// ==============================================================================
const Slide1: Page = () => (
  <div
    style={{
      ...canvasBase,
      padding: '80px 100px',
      background: `linear-gradient(135deg, rgba(0, 32, 96, 0.95) 0%, rgba(10, 22, 38, 0.98) 100%)`,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div
        style={{
          padding: '6px 18px',
          borderRadius: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: 18,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '0.04em',
        }}
      >
        온디바이스 AI SW 개발 과정 IoT 시스템 프로젝트
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 18, color: c.textMuted }}>
        2026. 10. 13
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 50, alignItems: 'center', my: 'auto' }}>
      <div>
        <div style={{ fontSize: 28, color: '#38bdf8', fontWeight: 800, marginBottom: 12 }}>
          IoT Vision 기반
        </div>
        <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.15, margin: 0, letterSpacing: '-0.03em' }}>
          자동 품질 검사·분류 <br />
          <span style={{ color: '#60a5fa' }}>스마트 팩토리 시스템</span>
        </h1>
        <p style={{ fontSize: 24, color: c.textSub, marginTop: 24, lineHeight: 1.5, maxWidth: 800 }}>
          Edge Vision(Jetson Nano) 추론과 중앙 통합 제어(Raspberry Pi), 정밀 구동(STM32 Nucleo)을 연동한 엔드투엔드 공정 자동화
        </p>

        <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
          <div style={{ padding: '14px 28px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span style={{ fontSize: 14, color: c.textMuted, display: 'block' }}>팀 구성</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#ffffff' }}>8조 (손준호 · 정승헌)</span>
          </div>
          <div style={{ padding: '14px 28px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <span style={{ fontSize: 14, color: c.textMuted, display: 'block' }}>핵심 기술</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8' }}>YOLOv8 · C Socket · STM32 HAL</span>
          </div>
        </div>
      </div>

      <div style={{ borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(56, 189, 248, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <img src={coverImg} alt="Smart Factory Conveyor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 2: 목차 (Agenda)
// ==============================================================================
const Slide2: Page = () => (
  <div style={canvasBase}>
    <Header
      category="INDEX"
      title="발표 목차"
      subtitle="프로젝트의 배경 목표부터 아키텍처, 세부 구현, 트러블슈팅 리뷰까지 체계적으로 공유합니다."
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 50, alignItems: 'center', flex: 1, marginBottom: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '24px 30px', backgroundColor: c.surface, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#38bdf8', fontFamily: monoFont }}>01</div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>Project Overview</div>
            <div style={{ fontSize: 16, color: c.textMuted, marginTop: 4 }}>프로젝트 개발 배경 및 목표 · 전체 통합 검사 흐름</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '24px 30px', backgroundColor: c.surface, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#60a5fa', fontFamily: monoFont }}>02</div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>Project Structure</div>
            <div style={{ fontSize: 16, color: c.textMuted, marginTop: 4 }}>시스템 토폴로지 · 통신 인터페이스 · HMI / 중앙제어 / Motion / Vision 세부 구현</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '24px 30px', backgroundColor: c.surface, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#a78bfa', fontFamily: monoFont }}>03</div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>Project Review & Troubleshooting</div>
            <div style={{ fontSize: 16, color: c.textMuted, marginTop: 4 }}>통합 과정의 구조적 문제 해결(Non-blocking Tick, RX Queue, E-STOP) 및 구현 소감</div>
          </div>
        </div>
      </div>

      <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', height: '100%', maxHeight: 420 }}>
        <img src={contentsImg} alt="Smart Inspection Line" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 3: 프로젝트 개요 & 4단계 자동화 파이프라인
// ==============================================================================
const Slide3: Page = () => (
  <div style={canvasBase}>
    <Header
      category="01. PROJECT OVERVIEW"
      title="프로젝트 배경 및 핵심 목표"
      subtitle="STM32 마이크로컨트롤러, 무선 통신(BT/Wi-Fi), Raspberry Pi 브로커, Vision AI를 하나의 통합 시스템으로 완성"
    />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, flex: 1, marginBottom: 20 }}>
      <div style={{ backgroundColor: c.surface, padding: '26px 22px', borderRadius: 16, border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>1</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Vision 제품 검사</div>
          <p style={{ fontSize: 16, color: c.textMuted, lineHeight: 1.5 }}>
            Jetson Nano + YOLOv8로 컨베이어 위 객체 실시간 다중 결함 검출 (정상 큐브 vs 결함)
          </p>
        </div>
        <div style={{ borderRadius: 10, overflow: 'hidden', height: 160, border: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={visionImg} alt="Vision Inspect" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      <div style={{ backgroundColor: c.surface, padding: '26px 22px', borderRadius: 16, border: '1px solid rgba(96, 165, 250, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(96, 165, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>2</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>중앙 결과 승인</div>
          <p style={{ fontSize: 16, color: c.textMuted, lineHeight: 1.5 }}>
            Raspberry Pi 중앙 FSM(T8_CTRL)이 SINGLE 객체 조건 충족 시에만 공식 판정 승인
          </p>
        </div>
        <div style={{ borderRadius: 10, overflow: 'hidden', height: 160, border: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={flowImg} alt="Flow Logic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      <div style={{ backgroundColor: c.surface, padding: '26px 22px', borderRadius: 16, border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>3</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>하드웨어 분류</div>
          <p style={{ fontSize: 16, color: c.textMuted, lineHeight: 1.5 }}>
            STM32 Nucleo #2(Motion)가 서보모터 트레이를 구동하여 PASS(150°) / FAIL(30°) 물리 배출
          </p>
        </div>
        <div style={{ borderRadius: 10, overflow: 'hidden', height: 160, border: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={servoImg} alt="Servo Tray" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      <div style={{ backgroundColor: c.surface, padding: '26px 22px', borderRadius: 16, border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>4</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>DB & 웹 대시보드</div>
          <p style={{ fontSize: 16, color: c.textMuted, lineHeight: 1.5 }}>
            FastAPI + MariaDB/SQLite로 검사 이력, 실시간 영상 스트리밍, 기기 점유 제어 제공
          </p>
        </div>
        <div style={{ borderRadius: 10, overflow: 'hidden', height: 160, border: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={dbImg} alt="DB Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 4: 시스템 아키텍처 및 노드 토폴로지 (System Architecture)
// ==============================================================================
const Slide4: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="전체 시스템 아키텍처 및 역할 분담"
      subtitle="라즈베리파이의 C Socket Broker를 중심으로 각 이종 단말기(STM32 2대, Jetson, Web)가 정형화된 프로토콜로 통신"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 32, flex: 1, marginBottom: 20 }}>
      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '28px 32px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 16, alignItems: 'center' }}>
          {/* 현장 조작부 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: '16px', borderRadius: 12, backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <div style={{ fontSize: 13, color: '#38bdf8', fontWeight: 800 }}>STM32 #1 (HMI)</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>[T8_HMI]</div>
              <div style={{ fontSize: 13, color: c.textMuted, marginTop: 4 }}>버튼 4개 · LCD · 가변저항 · RGB</div>
            </div>
            <div style={{ textAlign: 'center', color: '#38bdf8', fontSize: 13, fontWeight: 700 }}>
              ▼ HC-06 Bluetooth (RFCOMM)
            </div>
            <div style={{ padding: '12px', borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>bt_bridge.py</span>
              <span style={{ fontSize: 12, color: c.textMuted, display: 'block' }}>Gateway (BT ➔ TCP)</span>
            </div>
          </div>

          {/* 중앙 제어 서버 */}
          <div style={{ padding: '22px', borderRadius: 14, backgroundColor: 'rgba(10, 76, 185, 0.25)', border: '2px solid #0A4CB9', textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: '#60a5fa', fontWeight: 800, letterSpacing: '0.05em' }}>RASPBERRY PI CORE</div>
            <div style={{ fontSize: 26, fontWeight: 900, margin: '8px 0' }}>iot_server (:8080)</div>
            <div style={{ fontSize: 13, color: c.textSub, marginBottom: 14 }}>인증 · 연결 관리 · 메시지 라우팅</div>
            <div style={{ padding: '10px', borderRadius: 8, backgroundColor: '#002060', border: '1px solid #38bdf8' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8' }}>[T8_CTRL] (control_client)</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>중앙 State Machine / 안전 인터락</div>
            </div>
          </div>

          {/* 구동 및 비전 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: '14px', borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: 13, color: '#10b981', fontWeight: 800 }}>STM32 #2 (Motion)</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>[T8_MOTION]</div>
              <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>ESP-01 Wi-Fi TCP · 서보모터 트레이</div>
            </div>
            <div style={{ padding: '14px', borderRadius: 12, backgroundColor: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <div style={{ fontSize: 13, color: '#f43f5e', fontWeight: 800 }}>Jetson Nano</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>[T8_VISION]</div>
              <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>YOLOv8 AI 추론 · MJPEG (:5000)</div>
            </div>
            <div style={{ padding: '14px', borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 800 }}>FastAPI Dashboard</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>[T8_WEB]</div>
              <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>MariaDB / SQLite 이력 관리 (:8000)</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, padding: '12px 18px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, fontSize: 14, color: c.textSub, display: 'flex', justifyContent: 'space-between' }}>
          <span>💡 <strong>패킷 형식 규칙:</strong> <code style={{ color: '#38bdf8' }}>[TARGET_ID]COMMAND@VALUE\n</code></span>
          <span>모든 통신은 T8_CTRL의 상태 승인을 거쳐야만 동작</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8', marginBottom: 12 }}>손준호 담당 영역</div>
          <div style={{ fontSize: 15, color: '#ffffff', fontWeight: 700 }}>HMI · 중앙제어 · Motion · 전체 통합</div>
          <ul style={{ margin: '10px 0 0 0', paddingLeft: 20, fontSize: 14, color: c.textMuted, lineHeight: 1.6 }}>
            <li>STM32 HMI 인터페이스 (LCD, 버튼, EXTI)</li>
            <li>STM32 Motion 서보 PWM 구동 및 ESP-01 통신</li>
            <li>Raspberry Pi C Broker 및 t8_ctrl 상태 머신</li>
          </ul>
        </div>

        <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#60a5fa', marginBottom: 12 }}>정승헌 담당 영역</div>
          <div style={{ fontSize: 15, color: '#ffffff', fontWeight: 700 }}>Vision · DB · Web Dashboard</div>
          <ul style={{ margin: '10px 0 0 0', paddingLeft: 20, fontSize: 14, color: c.textMuted, lineHeight: 1.6 }}>
            <li>Jetson Nano YOLOv8 결함 검출 알고리즘</li>
            <li>FastAPI 기반 실시간 스트리밍 프록시</li>
            <li>MariaDB/SQLite 스키마 설계 및 검사 이력 관리</li>
          </ul>
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 5: 전체 동작 Flow 및 검사 시퀀스 (Flow & State)
// ==============================================================================
const Slide5: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="전체 동작 Flow: START(작업 시작)와 CHECK(공식 검사) 분리"
      subtitle="카메라 상시 모니터링과 공식 품질 판정 단계를 명확히 분리하여 오작동 없는 안전 공정 실현"
    />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
      <div style={{ backgroundColor: c.surface, padding: 18, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 13, color: '#38bdf8', fontWeight: 800, fontFamily: monoFont }}>STAGE 01</div>
        <div style={{ fontSize: 20, fontWeight: 800, margin: '6px 0' }}>IDLE</div>
        <div style={{ fontSize: 13, color: c.textMuted }}>작업 대기 상태 (MODE 변경 허용)</div>
      </div>
      <div style={{ backgroundColor: c.surface, padding: 18, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 800, fontFamily: monoFont }}>STAGE 02</div>
        <div style={{ fontSize: 20, fontWeight: 800, margin: '6px 0' }}>WORKING</div>
        <div style={{ fontSize: 13, color: c.textMuted }}>START 수신, Vision 단순 모니터링</div>
      </div>
      <div style={{ backgroundColor: 'rgba(10, 76, 185, 0.3)', padding: 18, borderRadius: 12, border: '2px solid #0A4CB9' }}>
        <div style={{ fontSize: 13, color: '#93c5fd', fontWeight: 800, fontFamily: monoFont }}>STAGE 03</div>
        <div style={{ fontSize: 20, fontWeight: 800, margin: '6px 0' }}>INSPECTING</div>
        <div style={{ fontSize: 13, color: '#ffffff' }}>CHECK 버튼 수신 ➔ 공식 검사 착수</div>
      </div>
      <div style={{ backgroundColor: c.surface, padding: 18, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 800, fontFamily: monoFont }}>STAGE 04</div>
        <div style={{ fontSize: 20, fontWeight: 800, margin: '6px 0' }}>OBJECT COUNT</div>
        <div style={{ fontSize: 13, color: c.textMuted }}>객체 수 판별 (0개 / 1개 / 2개 이상)</div>
      </div>
      <div style={{ backgroundColor: c.surface, padding: 18, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 13, color: '#34d399', fontWeight: 800, fontFamily: monoFont }}>STAGE 05</div>
        <div style={{ fontSize: 20, fontWeight: 800, margin: '6px 0' }}>SORT & DONE</div>
        <div style={{ fontSize: 13, color: c.textMuted }}>PASS/FAIL 분기 서보 구동 및 복귀</div>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, flex: 1, marginBottom: 20 }}>
      <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', padding: '24px', borderRadius: 16, border: '1px solid rgba(244, 63, 94, 0.3)' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#f43f5e' }}>OBJECT = 0개 (NONE)</div>
        <div style={{ fontSize: 22, fontWeight: 800, margin: '10px 0' }}>NO ITEM 경고</div>
        <p style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.5 }}>
          검사 대상이 없으므로 분류를 수행하지 않고 WORKING 상태로 복귀. HMI LCD에 안내 메시지 표시.
        </p>
      </div>

      <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '24px', borderRadius: 16, border: '2px solid #10b981' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>OBJECT = 1개 (SINGLE)</div>
        <div style={{ fontSize: 22, fontWeight: 800, margin: '10px 0' }}>품질 판정 및 자동 SORT</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <div style={{ padding: '8px 12px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: 8, fontSize: 14 }}>
            <strong>NORMAL:</strong> [T8_MOTION]SORT@PASS ➔ 서보 150°
          </div>
          <div style={{ padding: '8px 12px', backgroundColor: 'rgba(244, 63, 94, 0.2)', borderRadius: 8, fontSize: 14 }}>
            <strong>DEFECT:</strong> [T8_MOTION]SORT@FAIL ➔ 서보 30°
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '24px', borderRadius: 16, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b' }}>OBJECT = 2개 이상 (MULTI)</div>
        <div style={{ fontSize: 22, fontWeight: 800, margin: '10px 0' }}>ONE ITEM ONLY 경고</div>
        <p style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.5 }}>
          다중 객체 혼입 시 잘못된 분류를 방지하기 위해 SORT를 즉시 차단하고 WORKING 상태로 안전 복귀.
        </p>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 6: STM32 #1 HMI 현장 제어 인터페이스
// ==============================================================================
const Slide6: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="현장 HMI 조작부 및 중앙 동기화 (STM32 #1)"
      subtitle="설계 원칙: HMI는 요청만 송신하고, T8_CTRL이 현재 상태를 검증한 후 승인 패킷을 반환해야 LCD에 반영"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, flex: 1, marginBottom: 20 }}>
      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '28px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#38bdf8', marginBottom: 16 }}>하드웨어 물리 인터페이스 구현</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ padding: '14px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#60a5fa' }}>START / CHECK / END 버튼</div>
            <div style={{ fontSize: 13, color: c.textMuted, marginTop: 4 }}>30ms Software Debounce 필터링</div>
          </div>
          <div style={{ padding: '14px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f43f5e' }}>E-STOP (EXTI Falling Edge)</div>
            <div style={{ fontSize: 13, color: c.textMuted, marginTop: 4 }}>최우선 하드웨어 인터럽트 즉각 래치</div>
          </div>
          <div style={{ padding: '14px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>가변저항 (ADC Potentiometer)</div>
            <div style={{ fontSize: 13, color: c.textMuted, marginTop: 4 }}>Deadband(50) 필터링, MANUAL JOG 제어</div>
          </div>
          <div style={{ padding: '14px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#34d399' }}>I2C CLCD (16x2) & RGB LED</div>
            <div style={{ fontSize: 13, color: c.textMuted, marginTop: 4 }}>상태별 녹/황/백/적 점멸 및 모드 시각화</div>
          </div>
        </div>

        <div style={{ marginTop: 24, padding: '16px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>부팅 시 상태 동기화 (SYNC)</div>
          <p style={{ fontSize: 14, color: c.textMuted, margin: 0 }}>
            HMI 부팅 직후 <code style={{ color: '#38bdf8' }}>[T8_CTRL]SYNC</code>를 송신하여 중앙의 현재 STATE/MODE를 즉시 회신받아 단말기 간 상태 불일치를 원천 차단합니다.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '28px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#60a5fa', marginBottom: 14 }}>T8_CTRL 권한 중앙 집중화</div>
          <p style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.6 }}>
            현장 작업자가 임의로 버튼을 눌러도, 중앙 컨트롤러의 허가가 없으면 모터 구동이나 검사 명령이 실행되지 않습니다.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>MANUAL 중 START/CHECK 차단</span>
              <span style={{ fontSize: 13, color: '#f43f5e', fontWeight: 800 }}>IGNORED (안전 잠금)</span>
            </div>
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>E-STOP 중 모드 전환 차단</span>
              <span style={{ fontSize: 13, color: '#f43f5e', fontWeight: 800 }}>LOCKED</span>
            </div>
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>END 버튼 2초 롱프레스 시</span>
              <span style={{ fontSize: 13, color: '#10b981', fontWeight: 800 }}>ESTOP_CLEAR 요청 송신</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px', borderRadius: 10, backgroundColor: 'rgba(10, 76, 185, 0.15)', border: '1px solid #0A4CB9', fontSize: 13, color: c.textSub }}>
          ✓ UART RX Queue(버퍼 8개)를 메인 루프에서 순차 소각하여 연속 패킷 유실 방지
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 7: STM32 #2 Motion 서보 트레이 구동 장치
// ==============================================================================
const Slide7: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="서보 모터 기반 제품 분류 장치 (STM32 #2 Motion)"
      subtitle="SG90 서보모터 혼(Horn)에 분류 트레이를 직결하여 좌/우 각도 회전으로 PASS / FAIL 기계적 분기 달성"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 32, flex: 1, marginBottom: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '26px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#38bdf8', marginBottom: 14 }}>하드웨어 PWM 사양 및 각도 보정</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <div style={{ padding: '14px', backgroundColor: 'rgba(244, 63, 94, 0.12)', borderRadius: 10, textAlign: 'center', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <div style={{ fontSize: 13, color: '#f43f5e', fontWeight: 800 }}>FAIL 불량 배출</div>
              <div style={{ fontSize: 28, fontWeight: 900, margin: '4px 0' }}>30°</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>펄스 약 958 μs</div>
            </div>
            <div style={{ padding: '14px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 10, textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: 13, color: '#93c5fd', fontWeight: 800 }}>HOME 대기 원점</div>
              <div style={{ fontSize: 28, fontWeight: 900, margin: '4px 0' }}>90°</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>펄스 1575 μs</div>
            </div>
            <div style={{ padding: '14px', backgroundColor: 'rgba(16, 185, 129, 0.12)', borderRadius: 10, textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: 13, color: '#10b981', fontWeight: 800 }}>PASS 정상 배출</div>
              <div style={{ fontSize: 28, fontWeight: 900, margin: '4px 0' }}>150°</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>펄스 약 2191 μs</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: c.textMuted, marginTop: 12 }}>
            * SG90 타이머 설정: TIM4 CH1, 50 Hz 주기 (Period=20,000-1, Prescaler=84-1, 실측 범위 650~2500 μs)
          </div>
        </div>

        <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#60a5fa', marginBottom: 12 }}>Non-blocking 자동 분류 시퀀스</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 800 }}>STEP 1</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>분류각 회전</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 800 }}>STEP 2</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>1초 위치 유지</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 800 }}>STEP 3</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>HOME(90°) 복귀</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 800 }}>STEP 4</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>SORT_DONE 전송</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#34d399', marginTop: 12 }}>
            ✓ <code style={{ color: '#ffffff' }}>HAL_GetTick()</code>을 활용하여 1초 지연 동안에도 ESP-01 Wi-Fi 소켓 수신 루프가 멈추지 않고 실시간 가동됨
          </div>
        </div>
      </div>

      <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', height: '100%', maxHeight: 420 }}>
        <img src={servoImg} alt="Servo Diverter Mechanism" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 8: AUTO / MANUAL / E-STOP 3대 운전 모드
// ==============================================================================
const Slide8: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="공정 모드 체계: AUTO · MANUAL · E-STOP"
      subtitle="생산 운전, 장비 유지보수/테스트, 비상 안전 잠금을 독립된 상태 머신 규칙으로 제어"
    />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26, flex: 1, marginBottom: 20 }}>
      {/* AUTO */}
      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '26px', borderTop: '4px solid #10b981', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#10b981' }}>정상 생산 운전</span>
            <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 4, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>PRODUCTION</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>AUTO 모드</div>
          <p style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.5, marginBottom: 20 }}>
            센서 및 비전 검사 결과에 따라 자동으로 트레이가 구동되는 표준 양산 모드
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✓ CHECK 버튼 후 공식 검사 착수
            </div>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✓ 유효 판정 시 자동 서보 분류 (PASS/FAIL)
            </div>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✕ 가변저항 수동 JOG 차단
            </div>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✓ IDLE 상태에서만 MODE 변경 가능
            </div>
          </div>
        </div>
        <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.1)', fontSize: 13, color: '#34d399', textAlign: 'center' }}>
          실시간 불량 선별 자동화
        </div>
      </div>

      {/* MANUAL */}
      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '26px', borderTop: '4px solid #f59e0b', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#f59e0b' }}>유지보수 및 점검</span>
            <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 4, backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>MAINTENANCE</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>MANUAL 모드</div>
          <p style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.5, marginBottom: 20 }}>
            엔지니어가 서보 트레이 각도를 가변저항으로 수동 조정하며 장비를 캘리브레이션
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✓ Vision 카메라는 Monitoring Only 동작
            </div>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✕ START / CHECK / END 생산 명령 차단
            </div>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✓ 가변저항 JOG 제어로 서보 0~180° 실시간 제어
            </div>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✓ 웹 대시보드 슬라이더와 각도 양방향 동기화
            </div>
          </div>
        </div>
        <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(245, 158, 11, 0.1)', fontSize: 13, color: '#fbbf24', textAlign: 'center' }}>
          수동 각도 점검 및 영점 조절
        </div>
      </div>

      {/* E-STOP */}
      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '26px', borderTop: '4px solid #f43f5e', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#f43f5e' }}>비상 정지 우선 잠금</span>
            <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 4, backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e' }}>INTERLOCK</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>E-STOP 모드</div>
          <p style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.5, marginBottom: 20 }}>
            위험 상황 발생 시 하드웨어 EXTI 인터럽트로 즉시 가동 중단 및 모든 구동 래치
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✓ 모든 구동 즉시 중단 (진행 중 Sort 즉각 취소)
            </div>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✕ 모든 제어 버튼(START/CHECK) 및 JOG 완전 차단
            </div>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✓ 카메라는 현장 확인용 영상 유지 (Safety Slate)
            </div>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', fontSize: 14 }}>
              ✓ END 버튼 2초 롱프레스 시에만 잠금 해제
            </div>
          </div>
        </div>
        <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(244, 63, 94, 0.1)', fontSize: 13, color: '#f87171', textAlign: 'center' }}>
          * CLEAR 시 잠금 해제만 수행 (자동 재가동 방지)
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 9: Jetson Nano 고정밀 AI Vision 검사 파이프라인
// ==============================================================================
const Slide9: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="Jetson Nano: YOLOv8 고정밀 ROI 크롭 추론"
      subtitle="중앙 55% ROI 영역 크롭(Crop) 후 416x416 입력으로 큐브 해상도 손실 제거 및 초고속 불량 판정"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32, flex: 1, marginBottom: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ backgroundColor: c.surface, borderRadius: 14, padding: '22px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8', marginBottom: 10 }}>엄격한 2단계 판정 임계값 (Dual-Threshold)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ padding: 14, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: 13, color: '#10b981', fontWeight: 800 }}>정상 큐브 검출 확신도</div>
              <div style={{ fontSize: 28, fontWeight: 900, margin: '4px 0' }}>≥ 65%</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>BOX_CONF_THRESHOLD: 큐브 본체 안착 확정</div>
            </div>
            <div style={{ padding: 14, backgroundColor: 'rgba(244, 63, 94, 0.1)', borderRadius: 10, border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <div style={{ fontSize: 13, color: '#f43f5e', fontWeight: 800 }}>결함/스크래치 감지 기준</div>
              <div style={{ fontSize: 28, fontWeight: 900, margin: '4px 0' }}>≥ 35%</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>DEFECT_CONF_THRESHOLD: 미세 흠집 민감 검출</div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: c.surface, borderRadius: 14, padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#60a5fa', marginBottom: 8 }}>배경 노이즈 및 받침판 완벽 필터링</div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: c.textMuted, lineHeight: 1.6 }}>
            <li>ROI 영역의 85% 이상을 차지하는 거대 바닥판은 <code style={{ color: '#f59e0b' }}>[PLATE/IGNORE]</code>로 무시</li>
            <li>25px 미만의 센서 먼지/미세 노이즈는 카운트에서 배제</li>
            <li>연속 3프레임(<code style={{ color: '#38bdf8' }}>detect_streak &gt;= 3</code>) 검출 시에만 유효 판정 확정</li>
          </ul>
        </div>

        <div style={{ backgroundColor: 'rgba(10, 76, 185, 0.15)', padding: '14px 20px', borderRadius: 12, border: '1px solid #0A4CB9', fontSize: 14, color: c.textSub }}>
          💡 <strong>핵심 분리:</strong> WORKING 상태의 추론 결과는 화면 모니터링에만 사용되며, CHECK 수신 시점에만 최종 자동 SORT를 트리거함
        </div>
      </div>

      <div style={{ backgroundColor: '#070f1a', borderRadius: 16, padding: '22px', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: '#38bdf8', fontWeight: 800, fontFamily: monoFont }}>camera_ai_client.py</span>
            <span style={{ fontSize: 12, color: '#10b981', fontFamily: monoFont }}>30 FPS @ 720p</span>
          </div>

          <pre style={{ margin: 0, padding: 14, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, fontSize: 13, lineHeight: 1.5, fontFamily: monoFont, color: '#e2e8f0', overflow: 'hidden' }}>
{`# 1. 고정밀 ROI 크롭 추론
roi_crop = frame[roi_y1:roi_y2, roi_x1:roi_x2]
results = yolo_model.predict(
    source=roi_crop,
    imgsz=416,
    conf=0.25,
    device=0
)

# 2. 객체 수 및 결함 여부 판정
if valid_objects_count == 1:
    if has_defect:
        send_result_to_ctrl("DEFECT")
    else:
        send_result_to_ctrl("NORMAL")`}
          </pre>
        </div>

        <div style={{ marginTop: 14, padding: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', fontSize: 13, color: c.textMuted }}>
          MJPEG 스트리밍 서버(Port 5000)를 자체 탑재하여 브라우저에서 제로 레이턴시 영상 시청 가능
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 10: MariaDB / SQLite 이력 및 웹 대시보드
// ==============================================================================
const Slide10: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="DB 및 Web Dashboard: 작업 Cycle과 제품 판정 분리"
      subtitle="작업 공정 진행(Timeline)과 실제 완제품 품질(PASS/FAIL)을 분리 저장하여 신뢰도 높은 통계 구축"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, flex: 1, marginBottom: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8', marginBottom: 14 }}>검사 이력 데이터베이스 스키마</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#60a5fa' }}>inspection_logs (품질 검사 이력)</div>
              <div style={{ fontSize: 13, color: c.textMuted, marginTop: 2 }}>device_id, model_id, result (PASS/FAIL), confidence, inspected_at</div>
            </div>
            <div style={{ padding: '12px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#34d399' }}>devices & ai_models (스마트 팩토리 기기)</div>
              <div style={{ fontSize: 13, color: c.textMuted, marginTop: 2 }}>Jetson Nano IP(10.10.16.117), 점유 상태, 모델 가중치(best.pt)</div>
            </div>
            <div style={{ padding: '12px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>users (권한 및 보안)</div>
              <div style={{ fontSize: 13, color: c.textMuted, marginTop: 2 }}>username, SHA-256 password_hash, role (admin / operator)</div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '18px 24px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>데이터 무결성 원칙</div>
          <p style={{ fontSize: 14, color: c.textSub, margin: 0, lineHeight: 1.5 }}>
            NONE, MULTI 또는 MANUAL 단순 모니터링 도중 감지된 임시 영상 결과는 공식 생산 검사 이력(PASS/FAIL)에 일체 섞이지 않도록 차단합니다.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#60a5fa', marginBottom: 10 }}>실시간 웹 대시보드 (FastAPI)</div>
          <p style={{ fontSize: 14, color: c.textMuted, lineHeight: 1.5, marginBottom: 16 }}>
            반응형 HTML/JS 대시보드로 공정 노드 활성화 상태(ONLINE), 실시간 영상 오버레이, 수동 제어판 제공
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 13, color: '#38bdf8', fontWeight: 800 }}>LIVE STREAM PROXY</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>/video_feed</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>Jetson 스트림을 브라우저에 실시간 릴레이</div>
            </div>
            <div style={{ padding: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 13, color: '#10b981', fontWeight: 800 }}>NODE HEALTH CHECK</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>4개 노드 모니터링</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>T8_CTRL, T8_HMI, T8_MOTION, T8_VISION</div>
            </div>
            <div style={{ padding: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 800 }}>REMOTE CLAIM LOCK</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>점유 권한 획득제</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>웹 로그인 사용자 단일 점유 제어</div>
            </div>
            <div style={{ padding: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 13, color: '#f43f5e', fontWeight: 800 }}>EMERGENCY OVERRIDE</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>웹 비상 정지 버튼</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>원격지에서 긴급 공정 E-STOP 트리거</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: 130 }}>
          <img src={dbImg} alt="Web UI & DB" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 11: 프로젝트 리뷰 & 실전 트러블슈팅 (Troubleshooting)
// ==============================================================================
const Slide11: Page = () => (
  <div style={canvasBase}>
    <Header
      category="03. PROJECT REVIEW"
      title="통합 과정의 주요 문제와 아키텍처 개선"
      subtitle="실제 이종 하드웨어 결합 중 발생한 레이턴시, 패킷 유실, 통신 불안정 문제를 구조적 설계로 극복"
    />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, flex: 1, marginBottom: 20 }}>
      {/* 1. Main Loop Block */}
      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#f43f5e', marginBottom: 6 }}>PROBLEM 01</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>HAL_Delay 메인 루프 블로킹</div>
          <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(244, 63, 94, 0.1)', fontSize: 13, color: '#f87171', marginBottom: 14 }}>
            서보 모터 1초 유지 동안 <code style={{ color: '#ffffff' }}>HAL_Delay(1000)</code> 호출로 Wi-Fi 소켓 및 센서 루프 전체 정지 발생
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981', marginBottom: 6 }}>SOLVED ➔ Non-blocking Tick</div>
          <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
            <code style={{ color: '#38bdf8' }}>HAL_GetTick()</code> 기반으로 타임스탬프만 비교하고 루프는 계속 실행하여 서보 동작 중에도 통신/비상정지 완벽 수용.
          </p>
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 6, backgroundColor: 'rgba(16, 185, 129, 0.15)', fontSize: 12, color: '#34d399', textAlign: 'center' }}>
          실시간 반응성 100% 확보
        </div>
      </div>

      {/* 2. UART Packet Overwrite */}
      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#f43f5e', marginBottom: 6 }}>PROBLEM 02</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>UART 연속 메시지 버퍼 덮어씀</div>
          <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(244, 63, 94, 0.1)', fontSize: 13, color: '#f87171', marginBottom: 14 }}>
            단일 RX 버퍼 사용 시 <code style={{ color: '#ffffff' }}>STATE@READY</code>와 <code style={{ color: '#ffffff' }}>MODE@AUTO</code>가 연속 수신되면 이전 패킷이 유실됨
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981', marginBottom: 6 }}>SOLVED ➔ Circular RX Queue</div>
          <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
            인터럽트에서 줄바꿈(\n) 감지 시 완성된 문자열을 8단계 링 버퍼 큐에 적재하고, 메인 루프에서 순차 파싱 처리.
          </p>
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 6, backgroundColor: 'rgba(16, 185, 129, 0.15)', fontSize: 12, color: '#34d399', textAlign: 'center' }}>
          패킷 유실률 0% 달성
        </div>
      </div>

      {/* 3. 복구 고착 문제 */}
      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#f43f5e', marginBottom: 6 }}>PROBLEM 03</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>E-STOP 복구 FSM 고착</div>
          <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(244, 63, 94, 0.1)', fontSize: 13, color: '#f87171', marginBottom: 14 }}>
            복구 조건이 지나치게 복잡하여 <code style={{ color: '#ffffff' }}>RETURN HOME</code> 상태에서 시스템이 풀리지 않고 고착되는 현상
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981', marginBottom: 6 }}>SOLVED ➔ CLEAR 구조 단순화</div>
          <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
            복잡한 중간 Recovery 상태를 과감히 제거하고, END 2초 롱프레스 시 즉시 래치를 해제하며 관리자 안전 수동 재시작 유도.
          </p>
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 6, backgroundColor: 'rgba(16, 185, 129, 0.15)', fontSize: 12, color: '#34d399', textAlign: 'center' }}>
          안전 기준 부합 및 고착 해소
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 12: 팀원 소감 및 최종 Q&A (Conclusion & Q&A)
// ==============================================================================
const Slide12: Page = () => (
  <div style={canvasBase}>
    <Header
      category="03. PROJECT REVIEW"
      title="팀원별 구현 소감 및 Q&A"
      subtitle="수업 실습 기능을 실제 산업 현장의 요구 동작에 맞게 재구성하며 체득한 핵심 역량"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, flex: 1, marginBottom: 20 }}>
      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '28px', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 28 }}>👨‍💻</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>손준호</div>
              <div style={{ fontSize: 13, color: '#38bdf8' }}>HMI · 중앙제어 · Motion · 전체 통합</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: 14, color: c.textSub }}>
              ✓ 수업에서 배운 단일 기능들을 유기적인 분산 시스템으로 통합 연결
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: 14, color: c.textSub }}>
              ✓ E-STOP과 상태 머신 예외 처리의 복잡성을 해결하며 신뢰도 높은 아키텍처 설계 체득
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: 14, color: c.textSub }}>
              ✓ 단순 코드 작성보다 "전체 흐름과 예외 상황을 먼저 정의하는 시스템 설계"의 중요성 체감
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: c.textMuted }}>수업 실습의 응용 ➔ 기능 재구성 ➔ 예외 조건 설계</div>
      </div>

      <div style={{ backgroundColor: c.surface, borderRadius: 16, padding: '28px', border: '1px solid rgba(96, 165, 250, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 28 }}>🧠</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>정승헌</div>
              <div style={{ fontSize: 13, color: '#60a5fa' }}>Camera · Vision AI · DB · Web Dashboard</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: 14, color: c.textSub }}>
              ✓ 경량 딥러닝(YOLOv8) 모델을 Jetson 임베디드 환경에서 30 FPS로 안정 구동
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: 14, color: c.textSub }}>
              ✓ ROI 크롭과 다중 임계값으로 산업 현장 바닥판 노이즈와 미세 결함을 완벽 분리
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: 14, color: c.textSub }}>
              ✓ FastAPI와 MariaDB로 실시간 영상 스트리밍과 검사 이력 관리를 동시에 실현
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: c.textMuted }}>Edge AI 최적화 ➔ 웹 인터페이스 ➔ 데이터 무결성 보장</div>
      </div>
    </div>

    <div style={{ backgroundColor: 'rgba(10, 76, 185, 0.2)', padding: '20px 32px', borderRadius: 14, border: '1px solid #0A4CB9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900 }}>경청해 주셔서 감사합니다.</div>
        <div style={{ fontSize: 14, color: c.textSub, marginTop: 4 }}>질문이 있으시면 성심껏 답변드리겠습니다.</div>
      </div>
      <div style={{ padding: '10px 20px', borderRadius: 8, backgroundColor: '#002060', border: '1px solid #38bdf8', color: '#38bdf8', fontWeight: 800, fontSize: 18, fontFamily: monoFont }}>
        Q & A
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// 3. 메타데이터 및 발표자 발표 스크립트 (Speaker Notes)
// ==============================================================================
export const meta: SlideMeta = {
  title: 'IoT Vision 기반 자동 품질 검사·분류 시스템',
  createdAt: '2026-10-12T01:35:27.234Z',
};

export const notes: (string | undefined)[] = [
  // Slide 1
  `안녕하십니까. 온디바이스 AI SW 개발 과정 8조, 손준호, 정승헌입니다.
저희가 개발한 'IoT Vision 기반 자동 품질 검사·분류 시스템' 최종 발표를 시작하겠습니다.
본 프로젝트는 Jetson Nano의 실시간 AI 비전 추론, 라즈베리파이의 중앙 제어 브로커, 그리고 STM32 Nucleo의 서보모터 분류기를 하나로 통합한 지능형 스마트 팩토리 시스템입니다.`,

  // Slide 2
  `오늘 발표는 크게 세 가지 파트로 구성되어 있습니다.
첫째, 프로젝트의 배경과 목표를 소개하는 Project Overview.
둘째, 전체 시스템 토폴로지와 노드별 세부 구현을 설명하는 Project Structure.
셋째, 통합 과정에서 해결한 주요 트러블슈팅과 팀원 소감을 담은 Project Review 순으로 말씀드리겠습니다.`,

  // Slide 3
  `프로젝트 배경 및 목표입니다.
기존의 수작업 검사는 작업자 피로도에 따른 오류가 많고, 클라우드 기반 AI는 지연 시간이 길어 고속 공정에 적합하지 않습니다.
저희는 '검사 ➔ 판단 ➔ 분류 ➔ 이력관리'까지 이어지는 자동화 흐름을 완전한 온디바이스 엣지 환경에서 구현하였습니다.`,

  // Slide 4
  `전체 시스템 아키텍처입니다.
라즈베리파이에서 동작하는 C 소켓 브로커를 중심으로 모든 장비가 연결됩니다.
작업자 HMI STM32는 블루투스를 통해, 분류 구동을 맡은 Motion STM32는 ESP-01 Wi-Fi를 통해, 비전 검사는 Jetson Nano가 각각 TCP 클라이언트로 접속합니다.
핵심은 iot_server가 단순 라우팅을 수행하고, T8_CTRL 엔진이 공정 상태를 검증한 후에만 동작을 허가한다는 점입니다.`,

  // Slide 5
  `전체 동작 플로우입니다.
저희 시스템의 가장 중요한 특징은 START(단순 작업 시작)와 CHECK(공식 검사)를 분리했다는 점입니다.
CHECK 명령이 수신되었을 때 객체 수를 검사하여, 반드시 정상 객체가 1개(SINGLE)일 때만 합격/불합격 판정을 내리고 분류 트레이를 작동시킵니다. 대상이 없거나 2개 이상이면 즉시 안전 복귀합니다.`,

  // Slide 6
  `현장 HMI 조작부인 STM32 #1 보드입니다.
START, CHECK, END 버튼과 비상 정지 EXTI 인터럽트, 그리고 수동 모드를 위한 가변저항 ADC가 탑재되었습니다.
설계 원칙에 따라 HMI는 중앙 서버에 '요청'만 전송하며, T8_CTRL이 현재 공정 상태를 확인한 후 승인 패킷을 반환했을 때만 LCD와 LED에 반영되도록 중앙 권한을 강화했습니다.`,

  // Slide 7
  `서보 모터 기반의 제품 분류 장치인 STM32 #2 Motion 보드입니다.
SG90 서보모터 혼에 트레이를 직결하여, FAIL은 30도, 대기 상태 HOME은 90도, PASS는 150도로 정밀하게 각도를 회전시킵니다.
특히 HAL_GetTick을 이용해 1초 유지 시간을 넌블로킹으로 확인하므로, 모터가 움직이는 동안에도 통신 루프가 멈추지 않고 실시간 가동됩니다.`,

  // Slide 8
  `공정의 3대 운전 모드 체계입니다.
자동 양산 운전인 AUTO 모드, 엔지니어가 가변저항으로 서보 각도를 직접 테스트하는 MANUAL 모드, 그리고 하드웨어 인터럽트로 즉시 모터를 차단하는 E-STOP 모드로 엄격히 분리하여 안전성을 극대화했습니다.`,

  // Slide 9
  `Jetson Nano의 AI 비전 검사 파이프라인입니다.
화면 중앙 55% 영역만 크롭하여 YOLOv8 416x416 입력으로 추론하므로, 해상도 손실 없이 큐브의 결함을 정밀하게 감지합니다.
큐브 안착 확신도 65% 이상, 미세 결함 감지 35% 이상의 듀얼 임계값 시스템으로 완벽한 품질 판정을 보장합니다.`,

  // Slide 10
  `데이터베이스 및 웹 대시보드 구조입니다.
FastAPI 기반으로 작업 타임라인과 완제품 품질 판정(PASS/FAIL)을 분리 저장하여 데이터의 신뢰성을 확보했습니다.
웹 화면에서 4개 필수 노드의 온라인 상태를 한눈에 파악할 수 있고, 실시간 비전 영상과 긴급 비상 정지 제어를 지원합니다.`,

  // Slide 11
  `통합 과정에서 겪은 핵심 트러블슈팅입니다.
첫째, HAL_Delay로 인한 메인 루프 정지를 HAL_GetTick 기반 넌블로킹 구조로 개선했습니다.
둘째, UART 단일 버퍼로 인한 연속 패킷 유실 문제를 8단계 Circular RX Queue로 해결했습니다.
셋째, 복구 상태 머신의 불필요한 단계를 제거하여 E-STOP 해제 시 고착 현상을 해소했습니다.`,

  // Slide 12
  `마지막으로 팀원 소감 및 마무리입니다.
수업에서 배운 개별 임베디드 실습 기능을 하나의 산업용 시스템 요구 동작에 맞춰 재구성하고, 실제 통신과 예외 상황을 고려한 아키텍처를 직접 설계하며 값진 성장을 이루었습니다.
경청해 주셔서 감사합니다. 질문 있으시면 답변드리겠습니다.`,
];

export default [
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
  Slide9,
  Slide10,
  Slide11,
  Slide12,
] satisfies Page[];
