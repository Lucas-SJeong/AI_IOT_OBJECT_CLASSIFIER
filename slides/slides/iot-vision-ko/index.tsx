import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties } from 'react';

// 슬라이드 내 포함된 고해상도 그래픽 자산 (원본 PPT 추출본 + Nano Banana 3D 생성본)
import coverImg from './assets/cover-line.png';
import contentsImg from './assets/contents-line.png';
import visionImg from './assets/vision-inspect.png';
import dbImg from './assets/db-dashboard.png';
import servoImg from './assets/servo-tray.png';
import flowImg from './assets/flow-overview.png';
import hmiImg from './assets/hmi-device.jpg';
import yoloImg from './assets/yolo-detection.jpg';
import edgeImg from './assets/edge-architecture.jpg';

// ==============================================================================
// 1. 고밀도 무공백 하이테크 디자인 시스템 (Zero-Whitespace High Contrast Theme)
// ==============================================================================
export const design: DesignSystem = {
  palette: {
    bg: '#edf2f7',
    text: '#002060',
    accent: '#0a4cb9',
  },
  fonts: {
    display: '"Pretendard", "Noto Sans KR", system-ui, -apple-system, sans-serif',
    body: '"Pretendard", "Noto Sans KR", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 130, body: 28 },
  radius: 10,
};

const c = {
  bgCanvas: '#edf2f7',
  cardBg: '#ffffff',
  surfaceSub: '#f8fafc',
  surfaceHighlight: '#f1f5f9',
  borderStrong: '#cbd5e1',
  borderDark: '#002060',
  borderLight: '#e2e8f0',
  navyDark: '#002060',
  navyDeep: '#0b192c',
  bluePoint: '#0a4cb9',
  blueLight: '#eff6ff',
  blueBorder: '#bfdbfe',
  cyanPoint: '#087f8c',
  cyanLight: '#ecfeff',
  cyanBorder: '#a5f3fc',
  emeraldPoint: '#059669',
  emeraldLight: '#ecfdf5',
  emeraldBorder: '#a7f3d0',
  redPoint: '#dc2626',
  redLight: '#fef2f2',
  redBorder: '#fecaca',
  amberPoint: '#d97706',
  amberLight: '#fffbeb',
  amberBorder: '#fde68a',
  purplePoint: '#7c3aed',
  purpleLight: '#f5f3ff',
  purpleBorder: '#ddd6fe',
  textPrimary: '#0f172a',
  textSecondary: '#1e293b',
  textMuted: '#475569',
};

const monoFont = '"JetBrains Mono", "SF Mono", Consolas, monospace';

// 캔버스 기본 규격: 1920x1080 꽉 채우는 초슬림 패딩(20px 32px)으로 여백 전면 제거
const canvasBase: CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: c.bgCanvas,
  backgroundImage: 'radial-gradient(ellipse at 50% 0%, #e2e8f0 0%, #edf2f7 100%)',
  color: c.textPrimary,
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  padding: '20px 32px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

// 카드 베이스: 뚜렷한 2px 외곽선과 섀도우로 컴포넌트 경계 확립
const cardBase: CSSProperties = {
  backgroundColor: c.cardBg,
  borderRadius: 10,
  border: `2px solid ${c.borderStrong}`,
  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
  boxSizing: 'border-box',
};

// ==============================================================================
// 2. 공통 프레임 컴포넌트 (Footer, Header, CardTitleBar)
// ==============================================================================
const SlideFooter = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `2px solid ${c.borderStrong}`,
        paddingTop: 8,
        fontSize: 16,
        color: c.textSecondary,
        boxSizing: 'border-box',
        fontWeight: 700,
        marginTop: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ color: c.navyDark, fontWeight: 900 }}>IoT Vision 자동 품질 검사·분류 시스템</span>
        <span style={{ color: '#94a3b8' }}>|</span>
        <span style={{ color: c.textSecondary, fontWeight: 800 }}>8조 (손준호 · 정승헌)</span>
        <span style={{ color: '#94a3b8' }}>|</span>
        <span style={{ color: c.bluePoint, fontWeight: 900 }}>온디바이스 AI SW 개발 과정</span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: monoFont,
          fontWeight: 900,
          color: c.navyDark,
          backgroundColor: '#ffffff',
          padding: '3px 14px',
          borderRadius: 6,
          border: `2px solid ${c.borderStrong}`,
        }}
      >
        <span style={{ color: c.bluePoint }}>PAGE</span>
        <span>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
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
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 12px',
          borderRadius: 4,
          backgroundColor: c.navyDark,
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 900,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {category}
      </div>
      <h1
        style={{
          fontSize: 44,
          fontWeight: 900,
          margin: 0,
          lineHeight: 1.15,
          color: c.navyDark,
          letterSpacing: '-0.025em',
        }}
      >
        {title}
      </h1>
    </div>
    <p
      style={{
        fontSize: 22,
        color: c.textSecondary,
        margin: '4px 0 0 0',
        lineHeight: 1.35,
        fontWeight: 700,
      }}
    >
      {subtitle}
    </p>
  </div>
);

// 카드 상단 헤더 바
const CardTitleBar = ({
  title,
  badge,
  color = c.navyDark,
  bgColor = '#ffffff',
}: {
  title: string;
  badge?: string;
  color?: string;
  bgColor?: string;
}) => (
  <div
    style={{
      padding: '8px 16px',
      backgroundColor: bgColor,
      borderBottom: `2px solid ${c.borderStrong}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    }}
  >
    <div style={{ fontSize: 20, fontWeight: 900, color }}>{title}</div>
    {badge && (
      <span
        style={{
          fontSize: 13,
          fontWeight: 900,
          color: '#ffffff',
          backgroundColor: color,
          padding: '2px 8px',
          borderRadius: 4,
          fontFamily: monoFont,
        }}
      >
        {badge}
      </span>
    )}
  </div>
);

// ==============================================================================
// Slide 1: 표지 (Cover) - 화면을 빈틈없이 꽉 채우는 대형 타이포 & 3D 렌더링
// ==============================================================================
const Slide1: Page = () => (
  <div style={canvasBase}>
    {/* 상단 메타 바 */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 18px',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        border: `2px solid ${c.borderStrong}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: c.bluePoint }} />
        <span style={{ fontSize: 18, fontWeight: 900, color: c.navyDark }}>
          온디바이스 AI SW 개발 과정 · IoT 스마트 시스템 최종 프로젝트 발표
        </span>
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 17, fontWeight: 900, color: c.bluePoint }}>
        2026. 10. 13 | TEAM 08 (손준호 · 정승헌)
      </div>
    </div>

    {/* 메인 2열 그리드: 빈 공간 없이 상하좌우 완전 밀착 */}
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.95fr', gap: 24, alignItems: 'stretch', flex: 1, my: 10 }}>
      {/* 좌측 메인 정보 블록 */}
      <div style={{ ...cardBase, padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div
            style={{
              display: 'inline-block',
              fontSize: 22,
              color: c.bluePoint,
              fontWeight: 900,
              backgroundColor: c.blueLight,
              padding: '4px 14px',
              borderRadius: 6,
              border: `2px solid ${c.blueBorder}`,
              marginBottom: 10,
            }}
          >
            Tier 1 AI Vision × Tier 2 C Socket Broker × Tier 3 STM32 Sorter
          </div>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 1.12,
              margin: '6px 0 0 0',
              color: c.navyDark,
              letterSpacing: '-0.035em',
            }}
          >
            IoT Vision 기반 <br />
            <span style={{ color: c.bluePoint }}>자동 품질 검사·분류</span> <br />
            스마트 팩토리 시스템
          </h1>
          <div
            style={{
              marginTop: 16,
              padding: '16px 20px',
              backgroundColor: c.surfaceSub,
              borderRadius: 8,
              border: `2px solid ${c.borderStrong}`,
            }}
          >
            <p style={{ fontSize: 22, color: c.textSecondary, margin: 0, lineHeight: 1.45, fontWeight: 700 }}>
              Edge Vision(Jetson Nano) 고정밀 AI 추론과 중앙 통합 제어(Raspberry Pi C Broker),
              초정밀 구동(STM32 Nucleo 서보 트레이)을 연동한 100% 온디바이스 공정 자동화
            </p>
          </div>
        </div>

        {/* 핵심 메타 카드 3분할 & 기능 뱃지 4개 */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1.1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ padding: '14px', backgroundColor: c.surfaceSub, borderRadius: 8, border: `2px solid ${c.borderStrong}` }}>
              <span style={{ fontSize: 14, color: c.textMuted, fontWeight: 800, display: 'block' }}>팀 구성</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, marginTop: 4, display: 'block' }}>
                8조 (손준호 · 정승헌)
              </span>
            </div>

            <div style={{ padding: '14px', backgroundColor: c.blueLight, borderRadius: 8, border: `2px solid ${c.blueBorder}` }}>
              <span style={{ fontSize: 14, color: c.bluePoint, fontWeight: 800, display: 'block' }}>핵심 기술 스택</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: c.navyDark, marginTop: 4, display: 'block' }}>
                YOLOv8 · C Socket · STM32 HAL
              </span>
            </div>

            <div style={{ padding: '14px', backgroundColor: c.emeraldLight, borderRadius: 8, border: `2px solid ${c.emeraldBorder}` }}>
              <span style={{ fontSize: 14, color: c.emeraldPoint, fontWeight: 800, display: 'block' }}>시스템 구조</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: c.emeraldPoint, marginTop: 4, display: 'block' }}>
                3-Tier 클로즈드루프
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            <div style={{ padding: '8px', backgroundColor: '#ffffff', borderRadius: 6, border: `1.5px solid ${c.borderStrong}`, textAlign: 'center', fontSize: 14, fontWeight: 800, color: c.navyDark }}>
              ✔ 실시간 30 FPS 추론
            </div>
            <div style={{ padding: '8px', backgroundColor: '#ffffff', borderRadius: 6, border: `1.5px solid ${c.borderStrong}`, textAlign: 'center', fontSize: 14, fontWeight: 800, color: c.navyDark }}>
              ✔ C 소켓 멀티플렉싱
            </div>
            <div style={{ padding: '8px', backgroundColor: '#ffffff', borderRadius: 6, border: `1.5px solid ${c.borderStrong}`, textAlign: 'center', fontSize: 14, fontWeight: 800, color: c.navyDark }}>
              ✔ SG90 정밀 서보 기구
            </div>
            <div style={{ padding: '8px', backgroundColor: '#ffffff', borderRadius: 6, border: `1.5px solid ${c.borderStrong}`, textAlign: 'center', fontSize: 14, fontWeight: 800, color: c.navyDark }}>
              ✔ MariaDB &amp; FastAPI
            </div>
          </div>
        </div>
      </div>

      {/* 우측 3D 그래픽 카드 (Nano Banana 3D 렌더링) */}
      <div style={{ ...cardBase, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ borderRadius: 8, overflow: 'hidden', height: 490, border: `2px solid ${c.borderStrong}`, position: 'relative' }}>
          <img
            src={edgeImg}
            alt="3-Tier Edge Smart Factory Architecture"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              right: 10,
              padding: '12px 18px',
              backgroundColor: 'rgba(0, 32, 96, 0.94)',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#ffffff',
            }}
          >
            <div>
              <div style={{ fontSize: 19, fontWeight: 900 }}>3-Tier Edge Smart Factory Architecture</div>
              <div style={{ fontSize: 14, color: '#93c5fd', fontWeight: 700 }}>Jetson Nano AI ➔ RPi Broker ➔ STM32 Sorter</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 900, backgroundColor: c.bluePoint, padding: '4px 12px', borderRadius: 4 }}>
              REAL-TIME
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 10 }}>
          <div style={{ padding: '12px', backgroundColor: c.surfaceSub, borderRadius: 6, border: `2px solid ${c.borderStrong}`, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: c.textMuted, fontWeight: 800 }}>AI 비전 추론 속도</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>30 FPS / 720p</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: c.surfaceSub, borderRadius: 6, border: `2px solid ${c.borderStrong}`, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: c.textMuted, fontWeight: 800 }}>중앙 통신 주기</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>&lt; 50 ms</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: c.surfaceSub, borderRadius: 6, border: `2px solid ${c.borderStrong}`, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: c.textMuted, fontWeight: 800 }}>서보 분류 정확도</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: c.emeraldPoint, marginTop: 2 }}>100% 정밀 분기</div>
          </div>
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 2: 목차 (Agenda) - 대형 카드 & HW/SW 상세 표로 꽉 채운 화면
// ==============================================================================
const Slide2: Page = () => (
  <div style={canvasBase}>
    <Header
      category="INDEX"
      title="발표 목차 (Agenda)"
      subtitle="프로젝트의 배경 목표부터 아키텍처, 4대 노드 상호작용 다이어그램, 트러블슈팅 리뷰까지 체계적으로 보고합니다."
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.85fr', gap: 20, alignItems: 'stretch', flex: 1 }}>
      {/* 좌측: 4대 아젠다 블록 (대형 폰트로 꽉 채움) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'space-between' }}>
        <div style={{ ...cardBase, padding: '20px 24px', borderLeft: `10px solid ${c.bluePoint}`, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: c.bluePoint, fontFamily: monoFont, minWidth: 60 }}>01</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: c.navyDark }}>Project Overview</div>
            <div style={{ fontSize: 20, color: c.textSecondary, marginTop: 4, fontWeight: 700 }}>
              프로젝트 개발 배경 및 핵심 목표 · 4단계 엔드투엔드 품질 검사 파이프라인
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 800, backgroundColor: c.blueLight, color: c.bluePoint, padding: '3px 10px', borderRadius: 4 }}>수작업 검사 자동화</span>
              <span style={{ fontSize: 14, fontWeight: 800, backgroundColor: c.surfaceSub, color: c.textSecondary, padding: '3px 10px', borderRadius: 4, border: `1px solid ${c.borderStrong}` }}>클로즈드 루프 제어</span>
            </div>
          </div>
        </div>

        <div style={{ ...cardBase, padding: '20px 24px', borderLeft: `10px solid ${c.cyanPoint}`, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: c.cyanPoint, fontFamily: monoFont, minWidth: 60 }}>02</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: c.navyDark }}>Project Structure &amp; Node Details</div>
            <div style={{ fontSize: 20, color: c.textSecondary, marginTop: 4, fontWeight: 700 }}>
              3-Tier 시스템 토폴로지 · HMI/Motion 세부 구현 · 3대 운전 모드 · YOLOv8 AI · DB 대시보드
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 800, backgroundColor: c.cyanLight, color: c.cyanPoint, padding: '3px 10px', borderRadius: 4 }}>STM32 Nucleo × 2</span>
              <span style={{ fontSize: 14, fontWeight: 800, backgroundColor: c.surfaceSub, color: c.textSecondary, padding: '3px 10px', borderRadius: 4, border: `1px solid ${c.borderStrong}` }}>C Socket Broker</span>
              <span style={{ fontSize: 14, fontWeight: 800, backgroundColor: c.surfaceSub, color: c.textSecondary, padding: '3px 10px', borderRadius: 4, border: `1px solid ${c.borderStrong}` }}>AUTO/MANUAL/E-STOP</span>
            </div>
          </div>
        </div>

        <div style={{ ...cardBase, padding: '20px 24px', borderLeft: `10px solid ${c.emeraldPoint}`, backgroundColor: c.emeraldLight, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: c.emeraldPoint, fontFamily: monoFont, minWidth: 60 }}>03</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: c.navyDark }}>System Interaction &amp; Data Flow (★ 핵심)</div>
            <div style={{ fontSize: 20, color: c.textSecondary, marginTop: 4, fontWeight: 700 }}>
              Server ↔ Jetson ↔ STM32 ↔ DB 실시간 상호작용 시퀀스 및 4계층 통신 라이프사이클 다이어그램
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 900, backgroundColor: c.emeraldPoint, color: '#ffffff', padding: '3px 10px', borderRadius: 4 }}>7단계 패킷 시퀀스</span>
              <span style={{ fontSize: 14, fontWeight: 800, backgroundColor: '#ffffff', color: c.emeraldPoint, padding: '3px 10px', borderRadius: 4, border: `1px solid ${c.emeraldBorder}` }}>4계층 데이터 파이프라인</span>
            </div>
          </div>
        </div>

        <div style={{ ...cardBase, padding: '20px 24px', borderLeft: `10px solid ${c.purplePoint}`, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: c.purplePoint, fontFamily: monoFont, minWidth: 60 }}>04</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: c.navyDark }}>Project Review &amp; Troubleshooting</div>
            <div style={{ fontSize: 20, color: c.textSecondary, marginTop: 4, fontWeight: 700 }}>
              이종 통신 결합 문제 해결 (HAL_GetTick, 8단계 RX Queue, E-STOP 복구) · 팀원별 구현 소감
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 800, backgroundColor: c.purpleLight, color: c.purplePoint, padding: '3px 10px', borderRadius: 4 }}>아키텍처 개선</span>
              <span style={{ fontSize: 14, fontWeight: 800, backgroundColor: c.surfaceSub, color: c.textSecondary, padding: '3px 10px', borderRadius: 4, border: `1px solid ${c.borderStrong}` }}>예외 처리 최적화</span>
            </div>
          </div>
        </div>
      </div>

      {/* 우측: 컨베이어 실사 및 하드웨어/소프트웨어 전체 스펙 테이블 */}
      <div style={{ ...cardBase, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ borderRadius: 8, overflow: 'hidden', height: 320, border: `2px solid ${c.borderStrong}` }}>
          <img src={contentsImg} alt="Smart Inspection Line" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ marginTop: 10, padding: '16px', backgroundColor: c.surfaceSub, borderRadius: 8, border: `2px solid ${c.borderStrong}`, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: c.navyDark, marginBottom: 8, borderBottom: `2px solid ${c.borderStrong}`, paddingBottom: 6 }}>
            시스템 하드웨어 &amp; 소프트웨어 규격표
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 17, color: c.textSecondary, fontWeight: 700 }}>
            <div>• <strong>AI Edge:</strong> Jetson Nano 4GB</div>
            <div>• <strong>Broker:</strong> Raspberry Pi 4B</div>
            <div>• <strong>MCU #1:</strong> STM32F411RE (HMI)</div>
            <div>• <strong>MCU #2:</strong> STM32F411RE (Motion)</div>
            <div>• <strong>Camera:</strong> OBSBOT Meet 2</div>
            <div>• <strong>Servo:</strong> SG90 50Hz PWM</div>
            <div>• <strong>Network:</strong> BT, Wi-Fi, Ethernet</div>
            <div>• <strong>Database:</strong> MariaDB / SQLite</div>
          </div>
          <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: c.blueLight, borderRadius: 6, fontSize: 14, color: c.bluePoint, fontWeight: 800, textAlign: 'center' }}>
            전체 시스템 100% 온디바이스 단독 구동 보장
          </div>
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 3: 프로젝트 개요 & 4단계 자동화 파이프라인 (대형 이미지 & 스펙 채움)
// ==============================================================================
const Slide3: Page = () => (
  <div style={canvasBase}>
    <Header
      category="01. PROJECT OVERVIEW"
      title="프로젝트 배경 및 4단계 자동화 파이프라인"
      subtitle="STM32 마이크로컨트롤러, 무선 통신(BT/Wi-Fi), Raspberry Pi 브로커, Vision AI를 하나의 유기적인 클로즈드 루프로 통합"
    />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, flex: 1, alignItems: 'stretch' }}>
      {/* Stage 1 */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardTitleBar title="1. Vision 제품 검사" badge="TIER 1" color={c.bluePoint} bgColor={c.blueLight} />
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 19, color: c.textSecondary, lineHeight: 1.45, margin: 0, fontWeight: 700 }}>
            Jetson Nano + YOLOv8로 컨베이어 위 객체 실시간 다중 결함 검출 (정상 큐브 vs 결함 스크래치).
          </p>
          <div style={{ borderRadius: 8, overflow: 'hidden', height: 250, border: `2px solid ${c.borderStrong}`, my: 10 }}>
            <img src={visionImg} alt="Vision Inspect" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: '12px', backgroundColor: c.blueLight, borderRadius: 6, fontSize: 16, color: c.bluePoint, fontWeight: 900, textAlign: 'center', border: `1.5px solid ${c.blueBorder}` }}>
            55% ROI 크롭 &amp; 듀얼 임계값 판정
          </div>
        </div>
      </div>

      {/* Stage 2 */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardTitleBar title="2. 중앙 결과 승인" badge="TIER 2" color={c.cyanPoint} bgColor={c.cyanLight} />
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 19, color: c.textSecondary, lineHeight: 1.45, margin: 0, fontWeight: 700 }}>
            Raspberry Pi 중앙 FSM(<code style={{ color: c.bluePoint }}>T8_CTRL</code>)이 SINGLE 객체 조건 충족 시에만 공식 판정 승인.
          </p>
          <div style={{ borderRadius: 8, overflow: 'hidden', height: 250, border: `2px solid ${c.borderStrong}`, my: 10 }}>
            <img src={flowImg} alt="Flow Logic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: '12px', backgroundColor: c.cyanLight, borderRadius: 6, fontSize: 16, color: c.cyanPoint, fontWeight: 900, textAlign: 'center', border: `1.5px solid ${c.cyanBorder}` }}>
            C Socket Broker (:8080) 라우팅
          </div>
        </div>
      </div>

      {/* Stage 3 */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardTitleBar title="3. 하드웨어 물리 분류" badge="TIER 3" color={c.emeraldPoint} bgColor={c.emeraldLight} />
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 19, color: c.textSecondary, lineHeight: 1.45, margin: 0, fontWeight: 700 }}>
            STM32 Nucleo #2(Motion)가 서보 트레이를 구동하여 PASS(150°) / FAIL(30°) 방향으로 물리 배출.
          </p>
          <div style={{ borderRadius: 8, overflow: 'hidden', height: 250, border: `2px solid ${c.borderStrong}`, my: 10 }}>
            <img src={servoImg} alt="Servo Tray" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: '12px', backgroundColor: c.emeraldLight, borderRadius: 6, fontSize: 16, color: c.emeraldPoint, fontWeight: 900, textAlign: 'center', border: `1.5px solid ${c.emeraldBorder}` }}>
            SG90 PWM &amp; Non-blocking 1s Hold
          </div>
        </div>
      </div>

      {/* Stage 4 */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardTitleBar title="4. DB &amp; 웹 대시보드" badge="TIER 4" color={c.amberPoint} bgColor={c.amberLight} />
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 19, color: c.textSecondary, lineHeight: 1.45, margin: 0, fontWeight: 700 }}>
            FastAPI + MariaDB/SQLite로 검사 이력 보관, 실시간 영상 스트리밍 중계, 원격 기기 점유 제어 제공.
          </p>
          <div style={{ borderRadius: 8, overflow: 'hidden', height: 250, border: `2px solid ${c.borderStrong}`, my: 10 }}>
            <img src={dbImg} alt="DB Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: '12px', backgroundColor: c.amberLight, borderRadius: 6, fontSize: 16, color: c.amberPoint, fontWeight: 900, textAlign: 'center', border: `1.5px solid ${c.amberBorder}` }}>
            REST API &amp; MJPEG Stream Proxy
          </div>
        </div>
      </div>
    </div>

    {/* 하단 요약 바 */}
    <div
      style={{
        marginTop: 10,
        padding: '14px 22px',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        border: `2px solid ${c.borderStrong}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 18,
        color: c.textSecondary,
        fontWeight: 800,
      }}
    >
      <span>🎯 <strong>핵심 가치:</strong> 기존 작업자 육안 검사의 피로 오류와 클라우드 AI의 네트워크 지연 시간을 <strong>온디바이스 엣지 분산 구조</strong>로 완전 극복</span>
      <span style={{ color: c.bluePoint, fontWeight: 900, fontSize: 20 }}>전체 공정 분류 지연시간 &lt; 0.5초</span>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 4: 시스템 아키텍처 및 노드 토폴로지
// ==============================================================================
const Slide4: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="전체 시스템 아키텍처 및 노드 토폴로지"
      subtitle="라즈베리파이의 C Socket Broker를 중심으로 각 이종 단말기(STM32 2대, Jetson, Web)가 정형화된 프로토콜로 실시간 연동"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, flex: 1, alignItems: 'stretch' }}>
      {/* 좌측: 3D 토폴로지 및 3-Tier 블록 */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardTitleBar title="이종 기기 통합 네트워크 토폴로지" badge="PORT 8080 C BROKER" />
        <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ borderRadius: 8, overflow: 'hidden', height: 310, border: `2px solid ${c.borderStrong}`, position: 'relative' }}>
            <img src={edgeImg} alt="Edge Architecture 3D" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 8, left: 8, padding: '6px 14px', backgroundColor: 'rgba(0, 32, 96, 0.92)', color: '#ffffff', borderRadius: 4, fontSize: 14, fontWeight: 800 }}>
              Nano Banana 3D Render: 3-Tier Edge System
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
            <div style={{ padding: '14px', borderRadius: 8, backgroundColor: c.blueLight, border: `2px solid ${c.blueBorder}` }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: c.bluePoint }}>TIER 1 (AI EDGE)</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>[T8_VISION]</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 2, fontWeight: 700 }}>Jetson (10.10.16.117)</div>
              <div style={{ fontSize: 13, color: c.textMuted, marginTop: 2 }}>YOLOv8 &amp; MJPEG :5000</div>
            </div>

            <div style={{ padding: '14px', borderRadius: 8, backgroundColor: c.emeraldLight, border: `2px solid ${c.emeraldBorder}` }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: c.emeraldPoint }}>TIER 2 (BROKER)</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>[T8_CTRL]</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 2, fontWeight: 700 }}>RPi (10.10.16.87)</div>
              <div style={{ fontSize: 13, color: c.textMuted, marginTop: 2 }}>C Broker &amp; FSM Engine</div>
            </div>

            <div style={{ padding: '14px', borderRadius: 8, backgroundColor: c.amberLight, border: `2px solid ${c.amberBorder}` }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: c.amberPoint }}>TIER 3 (ACTUATION)</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>[T8_HMI/MOTION]</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 2, fontWeight: 700 }}>STM32 Nucleo × 2</div>
              <div style={{ fontSize: 13, color: c.textMuted, marginTop: 2 }}>BT &amp; ESP-01 Wi-Fi</div>
            </div>
          </div>

          <div style={{ marginTop: 10, padding: '12px 16px', backgroundColor: c.surfaceSub, borderRadius: 8, border: `2px solid ${c.borderStrong}`, fontSize: 16, color: c.textSecondary, display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
            <span>💡 <strong>패킷 형식:</strong> <code style={{ color: c.bluePoint, fontWeight: 900 }}>[TARGET_ID]COMMAND@VALUE\n</code></span>
            <span style={{ color: c.navyDark, fontWeight: 900 }}>모든 통신은 T8_CTRL 중앙 승인 필수</span>
          </div>
        </div>
      </div>

      {/* 우측: R&R 및 통신 매트릭스 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ ...cardBase, padding: '18px 22px', borderLeft: `8px solid ${c.bluePoint}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark }}>손준호 담당 영역</div>
            <span style={{ fontSize: 14, fontWeight: 900, color: c.bluePoint, backgroundColor: c.blueLight, padding: '3px 10px', borderRadius: 4 }}>
              HMI · 중앙제어 · Motion
            </span>
          </div>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, fontSize: 17, color: c.textSecondary, lineHeight: 1.5, fontWeight: 700 }}>
            <li>STM32 #1 HMI: 30ms 디바운스, LCD 동기화, EXTI E-STOP</li>
            <li>STM32 #2 Motion: 서보 PWM 구동 및 Non-blocking 타이머</li>
            <li>Raspberry Pi: C Socket Broker 및 t8_ctrl 상태 머신</li>
          </ul>
        </div>

        <div style={{ ...cardBase, padding: '18px 22px', borderLeft: `8px solid ${c.cyanPoint}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark }}>정승헌 담당 영역</div>
            <span style={{ fontSize: 14, fontWeight: 900, color: c.cyanPoint, backgroundColor: c.cyanLight, padding: '3px 10px', borderRadius: 4 }}>
              Vision AI · DB · Web
            </span>
          </div>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, fontSize: 17, color: c.textSecondary, lineHeight: 1.5, fontWeight: 700 }}>
            <li>Jetson Nano: YOLOv8 결함 판정 모델 및 55% ROI 크롭 추론</li>
            <li>FastAPI: 실시간 영상 스트리밍 프록시 및 원격 제어</li>
            <li>MariaDB/SQLite: 검사 이력 및 기기 상태 무결성 보장</li>
          </ul>
        </div>

        <div style={{ ...cardBase, padding: '16px 20px', backgroundColor: c.surfaceSub, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: c.navyDark, marginBottom: 8, borderBottom: `2px solid ${c.borderStrong}`, paddingBottom: 4 }}>
            노드별 통신 프로토콜 매트릭스
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 16, color: c.textSecondary, fontWeight: 700 }}>
            <div>• <strong>HMI:</strong> HC-06 BT ➔ bt_bridge (TCP)</div>
            <div>• <strong>Motion:</strong> ESP-01 Wi-Fi (Direct TCP)</div>
            <div>• <strong>Vision:</strong> Jetson Ethernet (TCP Socket)</div>
            <div>• <strong>Web:</strong> FastAPI (TCP Socket + HTTP)</div>
          </div>
          <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: 6, fontSize: 14, color: c.navyDark, fontWeight: 800, border: `1.5px solid ${c.borderStrong}`, textAlign: 'center' }}>
            중앙 브로커 기반 단일 포트(:8080) 멀티플렉싱 구조
          </div>
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

    {/* 상단 5단계 타임라인 (대형 폰트로 꽉 채움) */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 12 }}>
      <div style={{ ...cardBase, padding: 14, borderTop: '6px solid #94a3b8' }}>
        <div style={{ fontSize: 14, color: '#64748b', fontWeight: 900, fontFamily: monoFont }}>STAGE 01</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, margin: '4px 0' }}>IDLE</div>
        <div style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.35, fontWeight: 700 }}>대기 상태<br />MODE 변경 유일 허용</div>
      </div>

      <div style={{ ...cardBase, padding: 14, borderTop: `6px solid ${c.bluePoint}` }}>
        <div style={{ fontSize: 14, color: c.bluePoint, fontWeight: 900, fontFamily: monoFont }}>STAGE 02</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, margin: '4px 0' }}>WORKING</div>
        <div style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.35, fontWeight: 700 }}>START 수신<br />카메라 단순 모니터링</div>
      </div>

      <div style={{ ...cardBase, padding: 14, borderTop: `6px solid ${c.cyanPoint}`, backgroundColor: c.blueLight }}>
        <div style={{ fontSize: 14, color: c.bluePoint, fontWeight: 900, fontFamily: monoFont }}>STAGE 03</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, margin: '4px 0' }}>INSPECTING</div>
        <div style={{ fontSize: 16, color: c.navyDark, lineHeight: 1.35, fontWeight: 900 }}>CHECK 버튼 수신<br />공식 검사 착수</div>
      </div>

      <div style={{ ...cardBase, padding: 14, borderTop: `6px solid ${c.purplePoint}` }}>
        <div style={{ fontSize: 14, color: c.purplePoint, fontWeight: 900, fontFamily: monoFont }}>STAGE 04</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, margin: '4px 0' }}>COUNT CHECK</div>
        <div style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.35, fontWeight: 700 }}>객체 수 엄격 검증<br />0 / 1 / 2개 이상</div>
      </div>

      <div style={{ ...cardBase, padding: 14, borderTop: `6px solid ${c.emeraldPoint}` }}>
        <div style={{ fontSize: 14, color: c.emeraldPoint, fontWeight: 900, fontFamily: monoFont }}>STAGE 05</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, margin: '4px 0' }}>SORT &amp; DONE</div>
        <div style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.35, fontWeight: 700 }}>서보모터 물리 배출<br />1초 후 복귀 완료</div>
      </div>
    </div>

    {/* 하단 3대 분기 카드 (대형 카드) */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, flex: 1 }}>
      {/* NONE */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: `10px solid ${c.amberPoint}` }}>
        <CardTitleBar title="OBJECT = 0개 (NONE)" badge="예외 안전 처리" color={c.amberPoint} bgColor={c.amberLight} />
        <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: c.navyDark, marginBottom: 10 }}>NO ITEM 안내 경고</div>
            <p style={{ fontSize: 19, color: c.textSecondary, lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
              검사 영역에 제품이 안착되지 않았으므로 서보 모터를 구동하지 않고 <strong>WORKING 상태로 안전 복귀</strong>합니다.
            </p>
          </div>
          <div style={{ padding: '16px', backgroundColor: c.amberLight, borderRadius: 8, border: `2px solid ${c.amberBorder}`, marginTop: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: c.amberPoint }}>HMI LCD 표기: [ NO ITEM ]</div>
            <div style={{ fontSize: 16, color: c.textSecondary, marginTop: 4, fontWeight: 700 }}>불필요한 공정 정지 없이 다음 제품 대기</div>
          </div>
        </div>
      </div>

      {/* SINGLE */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: `10px solid ${c.emeraldPoint}` }}>
        <CardTitleBar title="OBJECT = 1개 (SINGLE)" badge="정상 승인 경로" color={c.emeraldPoint} bgColor={c.emeraldLight} />
        <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: c.navyDark, marginBottom: 10 }}>품질 판정 및 자동 SORT</div>
            <p style={{ fontSize: 19, color: c.textSecondary, lineHeight: 1.5, margin: '0 0 10px 0', fontWeight: 700 }}>
              단일 제품 확정 시 YOLOv8 결함 여부에 따라 양품/불량 분류 트레이를 자동 가동합니다.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ padding: '12px 14px', backgroundColor: c.emeraldLight, borderRadius: 6, fontSize: 17, fontWeight: 900, color: c.emeraldPoint, border: `1.5px solid ${c.emeraldBorder}` }}>
              ✔ <strong>NORMAL:</strong> [T8_MOTION]SORT@PASS ➔ 서보 150°
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: c.redLight, borderRadius: 6, fontSize: 17, fontWeight: 900, color: c.redPoint, border: `1.5px solid ${c.redBorder}` }}>
              ✘ <strong>DEFECT:</strong> [T8_MOTION]SORT@FAIL ➔ 서보 30°
            </div>
          </div>
        </div>
      </div>

      {/* MULTI */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: `10px solid ${c.redPoint}` }}>
        <CardTitleBar title="OBJECT ≥ 2개 (MULTI)" badge="오분류 차단" color={c.redPoint} bgColor={c.redLight} />
        <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: c.navyDark, marginBottom: 10 }}>ONE ITEM ONLY 경고</div>
            <p style={{ fontSize: 19, color: c.textSecondary, lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
              다중 객체 혼입 시 잘못된 분류를 원천 차단하기 위해 <strong>SORT 명령을 즉시 중단</strong>하고 작업자에게 알립니다.
            </p>
          </div>
          <div style={{ padding: '16px', backgroundColor: c.redLight, borderRadius: 8, border: `2px solid ${c.redBorder}`, marginTop: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: c.redPoint }}>HMI LCD 표기: [ ONE ITEM ONLY ]</div>
            <div style={{ fontSize: 16, color: c.textSecondary, marginTop: 4, fontWeight: 700 }}>단일 객체로 정돈 후 재검사 유도</div>
          </div>
        </div>
      </div>
    </div>

    <div style={{ marginTop: 10, padding: '12px 20px', backgroundColor: '#ffffff', borderRadius: 8, border: `2px solid ${c.borderStrong}`, fontSize: 17, color: c.navyDark, fontWeight: 800 }}>
      💡 <strong>설계 핵심:</strong> START는 단순 카메라 피드 모니터링만 수행하며, 오직 <strong>CHECK 버튼이 입력되고 SINGLE 조건이 충족될 때만</strong> 물리 모터가 구동됩니다.
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 6: STM32 #1 HMI 현장 제어 인터페이스 (8단계 큐 다이어그램 포함)
// ==============================================================================
const Slide6: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="현장 HMI 조작부 및 중앙 권한 통제 (STM32 #1)"
      subtitle="설계 원칙: HMI는 요청만 송신하고, T8_CTRL이 현재 상태를 검증한 후 승인 패킷을 반환해야 LCD에 반영"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 20, flex: 1 }}>
      {/* 좌측: 3D HMI 이미지 및 하드웨어 제원 */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardTitleBar title="HMI 콘솔 하드웨어 제원 (3D Render)" badge="HC-06 BLUETOOTH" />
        <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ borderRadius: 8, overflow: 'hidden', height: 310, border: `2px solid ${c.borderStrong}`, position: 'relative' }}>
            <img src={hmiImg} alt="HMI Device 3D Render" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 8, left: 8, padding: '6px 14px', backgroundColor: 'rgba(0, 32, 96, 0.92)', color: '#ffffff', borderRadius: 4, fontSize: 14, fontWeight: 800 }}>
              Nano Banana 3D Render: Industrial HMI Console
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <div style={{ padding: '14px', borderRadius: 8, backgroundColor: c.surfaceSub, border: `2px solid ${c.borderStrong}` }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>START / CHECK / END</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 2, fontWeight: 700 }}>30ms Software Debounce 필터</div>
            </div>
            <div style={{ padding: '14px', borderRadius: 8, backgroundColor: c.redLight, border: `2px solid ${c.redBorder}` }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.redPoint }}>E-STOP (비상 정지)</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 2, fontWeight: 700 }}>EXTI Falling Edge 즉각 래치</div>
            </div>
            <div style={{ padding: '14px', borderRadius: 8, backgroundColor: c.surfaceSub, border: `2px solid ${c.borderStrong}` }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>가변저항 (ADC 10k)</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 2, fontWeight: 700 }}>Deadband(50), MANUAL JOG 제어</div>
            </div>
            <div style={{ padding: '14px', borderRadius: 8, backgroundColor: c.surfaceSub, border: `2px solid ${c.borderStrong}` }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>I2C 16x2 CLCD &amp; RGB</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 2, fontWeight: 700 }}>모드/상태 시각화 (녹/황/백/적)</div>
            </div>
          </div>

          <div style={{ marginTop: 10, padding: '10px 14px', backgroundColor: c.blueLight, borderRadius: 6, fontSize: 15, color: c.navyDark, fontWeight: 800 }}>
            ✓ HMI 부팅 즉시 <code style={{ color: c.bluePoint }}>[T8_CTRL]SYNC</code>를 송신하여 중앙 현재 상태를 100% 동기화
          </div>
        </div>
      </div>

      {/* 우측: 중앙 권한 통제 및 8단계 링 버퍼 시각화 다이어그램 */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardTitleBar title="T8_CTRL 권한 중앙 집중화 &amp; Circular RX Queue" badge="SAFETY INTERLOCK" />
        <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 18, color: c.textSecondary, lineHeight: 1.5, margin: '0 0 12px 0', fontWeight: 700 }}>
              현장 작업자가 임의로 버튼을 눌러도, 중앙 컨트롤러의 사전 검증 없이는 하드웨어 구동이나 검사 명령이 실행되지 않습니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '12px 16px', backgroundColor: c.surfaceSub, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `2px solid ${c.borderStrong}` }}>
                <div>
                  <span style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>MANUAL 중 START/CHECK 입력</span>
                  <span style={{ fontSize: 14, color: c.textMuted, display: 'block', fontWeight: 700 }}>수동 점검 중 생산 명령 혼입 방지</span>
                </div>
                <span style={{ fontSize: 14, color: c.redPoint, fontWeight: 900, backgroundColor: c.redLight, padding: '4px 10px', borderRadius: 4 }}>
                  IGNORED (차단)
                </span>
              </div>

              <div style={{ padding: '12px 16px', backgroundColor: c.surfaceSub, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `2px solid ${c.borderStrong}` }}>
                <div>
                  <span style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>E-STOP 중 모드 전환 요청</span>
                  <span style={{ fontSize: 14, color: c.textMuted, display: 'block', fontWeight: 700 }}>비상 정지 상태에서 임의 모드 변경 차단</span>
                </div>
                <span style={{ fontSize: 14, color: c.redPoint, fontWeight: 900, backgroundColor: c.redLight, padding: '4px 10px', borderRadius: 4 }}>
                  LOCKED (잠금)
                </span>
              </div>

              <div style={{ padding: '12px 16px', backgroundColor: c.surfaceSub, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `2px solid ${c.borderStrong}` }}>
                <div>
                  <span style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>END 버튼 2초 롱프레스 입력</span>
                  <span style={{ fontSize: 14, color: c.textMuted, display: 'block', fontWeight: 700 }}>작업자 의도 확인 후 안전 복구</span>
                </div>
                <span style={{ fontSize: 14, color: c.emeraldPoint, fontWeight: 900, backgroundColor: c.emeraldLight, padding: '4px 10px', borderRadius: 4 }}>
                  ESTOP_CLEAR
                </span>
              </div>
            </div>
          </div>

          {/* 8-Entry Circular Queue 시각화 다이어그램 (빈 공간 완전 해소) */}
          <div style={{ marginTop: 14, padding: '16px', backgroundColor: c.surfaceHighlight, borderRadius: 8, border: `2px solid ${c.borderStrong}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: c.navyDark }}>Circular RX Queue (8단계 링 버퍼 시각화)</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: c.bluePoint, backgroundColor: c.blueLight, padding: '3px 8px', borderRadius: 4 }}>
                ZERO PACKET LOSS
              </span>
            </div>
            {/* 8개 슬롯 그래픽 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6, margin: '8px 0' }}>
              <div style={{ padding: '8px 4px', backgroundColor: c.blueLight, border: `1.5px solid ${c.bluePoint}`, borderRadius: 4, textAlign: 'center', fontSize: 12, fontWeight: 900, color: c.bluePoint }}>[0] STATE</div>
              <div style={{ padding: '8px 4px', backgroundColor: c.blueLight, border: `1.5px solid ${c.bluePoint}`, borderRadius: 4, textAlign: 'center', fontSize: 12, fontWeight: 900, color: c.bluePoint }}>[1] MODE</div>
              <div style={{ padding: '8px 4px', backgroundColor: c.blueLight, border: `1.5px solid ${c.bluePoint}`, borderRadius: 4, textAlign: 'center', fontSize: 12, fontWeight: 900, color: c.bluePoint }}>[2] RES</div>
              <div style={{ padding: '8px 4px', backgroundColor: '#ffffff', border: `1px solid ${c.borderStrong}`, borderRadius: 4, textAlign: 'center', fontSize: 12, color: c.textMuted }}>[3] EMPTY</div>
              <div style={{ padding: '8px 4px', backgroundColor: '#ffffff', border: `1px solid ${c.borderStrong}`, borderRadius: 4, textAlign: 'center', fontSize: 12, color: c.textMuted }}>[4] EMPTY</div>
              <div style={{ padding: '8px 4px', backgroundColor: '#ffffff', border: `1px solid ${c.borderStrong}`, borderRadius: 4, textAlign: 'center', fontSize: 12, color: c.textMuted }}>[5] EMPTY</div>
              <div style={{ padding: '8px 4px', backgroundColor: '#ffffff', border: `1px solid ${c.borderStrong}`, borderRadius: 4, textAlign: 'center', fontSize: 12, color: c.textMuted }}>[6] EMPTY</div>
              <div style={{ padding: '8px 4px', backgroundColor: '#ffffff', border: `1px solid ${c.borderStrong}`, borderRadius: 4, textAlign: 'center', fontSize: 12, color: c.textMuted }}>[7] EMPTY</div>
            </div>
            <p style={{ fontSize: 15, color: c.textSecondary, margin: '6px 0 0 0', lineHeight: 1.45, fontWeight: 700 }}>
              UART 인터럽트 수신 시 <code style={{ color: c.bluePoint }}>\n</code> 단위 완성 패킷을 큐에 적재하고 메인 루프에서 순차 소각하여 연속 수신 패킷 덮어씀 현상을 원천 방지.
            </p>
          </div>
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

    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 20, flex: 1, alignItems: 'stretch' }}>
      {/* 좌측 각도 게이지 & 넌블로킹 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'space-between' }}>
        <div style={{ ...cardBase, padding: '18px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark }}>하드웨어 PWM 각도 및 펄스 매핑</div>
            <span style={{ fontSize: 14, fontFamily: monoFont, fontWeight: 900, backgroundColor: c.blueLight, color: c.bluePoint, padding: '4px 10px', borderRadius: 4 }}>
              TIM4 CH1 (50 Hz)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ padding: '16px', backgroundColor: c.redLight, borderRadius: 8, textAlign: 'center', border: `2px solid ${c.redBorder}` }}>
              <div style={{ fontSize: 15, color: c.redPoint, fontWeight: 900 }}>FAIL 불량 배출</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: c.redPoint, margin: '2px 0' }}>30°</div>
              <div style={{ fontSize: 14, color: c.textSecondary, fontWeight: 800 }}>펄스폭 ~958 μs</div>
            </div>

            <div style={{ padding: '16px', backgroundColor: c.surfaceSub, borderRadius: 8, textAlign: 'center', border: `2px solid ${c.borderStrong}` }}>
              <div style={{ fontSize: 15, color: c.navyDark, fontWeight: 900 }}>HOME 대기 원점</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: c.navyDark, margin: '2px 0' }}>90°</div>
              <div style={{ fontSize: 14, color: c.textSecondary, fontWeight: 800 }}>펄스폭 1575 μs</div>
            </div>

            <div style={{ padding: '16px', backgroundColor: c.emeraldLight, borderRadius: 8, textAlign: 'center', border: `2px solid ${c.emeraldBorder}` }}>
              <div style={{ fontSize: 15, color: c.emeraldPoint, fontWeight: 900 }}>PASS 정상 배출</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: c.emeraldPoint, margin: '2px 0' }}>150°</div>
              <div style={{ fontSize: 14, color: c.textSecondary, fontWeight: 800 }}>펄스폭 ~2191 μs</div>
            </div>
          </div>

          <div style={{ fontSize: 15, color: c.textMuted, marginTop: 10, fontWeight: 700 }}>
            * SG90 파라미터: Period=20,000-1 (20ms), Prescaler=84-1 (1MHz 클록), 가동 범위 실측 650~2500 μs
          </div>
        </div>

        <div style={{ ...cardBase, padding: '18px 22px' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, marginBottom: 10 }}>
            Non-blocking 4단계 자동 분류 시퀀스 (HAL_GetTick)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <div style={{ padding: '12px 10px', borderRadius: 6, backgroundColor: c.blueLight, textAlign: 'center', border: `1.5px solid ${c.blueBorder}` }}>
              <div style={{ fontSize: 12, color: c.bluePoint, fontWeight: 900 }}>STEP 1</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>분류각 회전</div>
              <div style={{ fontSize: 13, color: c.textMuted, fontWeight: 700 }}>30° or 150°</div>
            </div>

            <div style={{ padding: '12px 10px', borderRadius: 6, backgroundColor: c.blueLight, textAlign: 'center', border: `1.5px solid ${c.blueBorder}` }}>
              <div style={{ fontSize: 12, color: c.bluePoint, fontWeight: 900 }}>STEP 2</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>1초 위치 유지</div>
              <div style={{ fontSize: 13, color: c.textMuted, fontWeight: 700 }}>배출 대기</div>
            </div>

            <div style={{ padding: '12px 10px', borderRadius: 6, backgroundColor: c.blueLight, textAlign: 'center', border: `1.5px solid ${c.blueBorder}` }}>
              <div style={{ fontSize: 12, color: c.bluePoint, fontWeight: 900 }}>STEP 3</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>HOME 복귀</div>
              <div style={{ fontSize: 13, color: c.textMuted, fontWeight: 700 }}>90° 수평 정렬</div>
            </div>

            <div style={{ padding: '12px 10px', borderRadius: 6, backgroundColor: c.blueLight, textAlign: 'center', border: `1.5px solid ${c.blueBorder}` }}>
              <div style={{ fontSize: 12, color: c.bluePoint, fontWeight: 900 }}>STEP 4</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>SORT_DONE</div>
              <div style={{ fontSize: 13, color: c.textMuted, fontWeight: 700 }}>중앙 완료 보고</div>
            </div>
          </div>

          <div style={{ fontSize: 15, color: c.emeraldPoint, backgroundColor: c.emeraldLight, padding: '10px 14px', borderRadius: 6, marginTop: 12, fontWeight: 900, border: `1.5px solid ${c.emeraldBorder}` }}>
            ✔ <code style={{ color: c.navyDark }}>HAL_GetTick()</code> 기반으로 1초 지연을 처리하여 서보 배출 중에도 ESP-01 Wi-Fi 소켓 및 E-STOP 인터럽트가 즉시 반응함
          </div>
        </div>
      </div>

      {/* 우측: 서보 기구물 사진 및 통신 모듈 */}
      <div style={{ ...cardBase, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ borderRadius: 8, overflow: 'hidden', height: 340, border: `2px solid ${c.borderStrong}` }}>
          <img src={servoImg} alt="Servo Diverter Mechanism" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ marginTop: 10, padding: '16px', backgroundColor: c.surfaceSub, borderRadius: 8, border: `2px solid ${c.borderStrong}`, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: c.navyDark, marginBottom: 4 }}>ESP-01 Wi-Fi 소켓 인터페이스</div>
          <p style={{ fontSize: 16, color: c.textSecondary, margin: 0, lineHeight: 1.5, fontWeight: 700 }}>
            STM32 UART1을 통해 ESP-01 모듈을 제어하며, Raspberry Pi 브로커(Port 8080)에 직접 TCP 소켓으로 접속하여 최소 지연시간 분류 명령을 수신합니다.
          </p>
          <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: c.emeraldLight, borderRadius: 6, fontSize: 14, color: c.emeraldPoint, fontWeight: 900, textAlign: 'center' }}>
            TCP Keep-Alive 및 자동 재연결 로직 탑재
          </div>
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 8: AUTO / MANUAL / E-STOP 3대 운전 모드 (대형 3열 카드)
// ==============================================================================
const Slide8: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="공정 모드 체계: AUTO · MANUAL · E-STOP"
      subtitle="정상 생산 운전, 장비 유지보수/점검, 비상 안전 잠금을 독립된 상태 머신 규칙으로 엄격히 분리"
    />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, flex: 1, alignItems: 'stretch' }}>
      {/* AUTO */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `10px solid ${c.emeraldPoint}` }}>
        <CardTitleBar title="AUTO 모드 (양산 운전)" badge="PRODUCTION" color={c.emeraldPoint} bgColor={c.emeraldLight} />
        <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: c.navyDark, marginBottom: 6 }}>AUTO</div>
            <p style={{ fontSize: 18, color: c.textSecondary, lineHeight: 1.45, marginBottom: 14, fontWeight: 700 }}>
              센서 및 비전 검사 결과에 따라 자동으로 트레이가 구동되는 표준 양산 모드
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.navyDark, border: `1.5px solid ${c.borderStrong}` }}>
                ✔ CHECK 버튼 후 공식 검사 착수
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.navyDark, border: `1.5px solid ${c.borderStrong}` }}>
                ✔ 유효 판정 시 자동 서보 분류 (PASS/FAIL)
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.textMuted, border: `1.5px solid ${c.borderStrong}` }}>
                ✘ 가변저항 수동 JOG 차단 (안전 잠금)
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.navyDark, border: `1.5px solid ${c.borderStrong}` }}>
                ✔ IDLE 상태에서만 타 모드 전환 허용
              </div>
            </div>
          </div>
          <div style={{ padding: '14px', borderRadius: 8, backgroundColor: c.emeraldLight, border: `2px solid ${c.emeraldBorder}`, fontSize: 16, color: c.emeraldPoint, fontWeight: 900, textAlign: 'center', marginTop: 12 }}>
            실시간 불량 선별 자동화 가동
          </div>
        </div>
      </div>

      {/* MANUAL */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `10px solid ${c.amberPoint}` }}>
        <CardTitleBar title="MANUAL 모드 (유지보수)" badge="MAINTENANCE" color={c.amberPoint} bgColor={c.amberLight} />
        <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: c.navyDark, marginBottom: 6 }}>MANUAL</div>
            <p style={{ fontSize: 18, color: c.textSecondary, lineHeight: 1.45, marginBottom: 14, fontWeight: 700 }}>
              엔지니어가 서보 트레이 각도를 가변저항으로 수동 조정하며 영점 및 기구 점검
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.navyDark, border: `1.5px solid ${c.borderStrong}` }}>
                ✔ Vision 카메라는 단순 모니터링만 동작
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.textMuted, border: `1.5px solid ${c.borderStrong}` }}>
                ✘ START / CHECK / END 생산 명령 차단
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.navyDark, border: `1.5px solid ${c.borderStrong}` }}>
                ✔ 가변저항 JOG로 서보 0~180° 실시간 제어
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.navyDark, border: `1.5px solid ${c.borderStrong}` }}>
                ✔ 웹 대시보드 슬라이더와 양방향 동기화
              </div>
            </div>
          </div>
          <div style={{ padding: '14px', borderRadius: 8, backgroundColor: c.amberLight, border: `2px solid ${c.amberBorder}`, fontSize: 16, color: c.amberPoint, fontWeight: 900, textAlign: 'center', marginTop: 12 }}>
            수동 각도 점검 및 영점 조절
          </div>
        </div>
      </div>

      {/* E-STOP */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `10px solid ${c.redPoint}` }}>
        <CardTitleBar title="E-STOP 모드 (비상 정지)" badge="INTERLOCK" color={c.redPoint} bgColor={c.redLight} />
        <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: c.navyDark, marginBottom: 6 }}>E-STOP</div>
            <p style={{ fontSize: 18, color: c.textSecondary, lineHeight: 1.45, marginBottom: 14, fontWeight: 700 }}>
              위험 상황 발생 시 하드웨어 EXTI 인터럽트로 즉시 가동 중단 및 모든 구동 래치
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.navyDark, border: `1.5px solid ${c.borderStrong}` }}>
                ✔ 모든 구동 즉시 중단 (Sort 동작 즉각 취소)
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.textMuted, border: `1.5px solid ${c.borderStrong}` }}>
                ✘ 모든 조작 버튼 및 가변저항 JOG 완전 잠금
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.navyDark, border: `1.5px solid ${c.borderStrong}` }}>
                ✔ 카메라는 현장 확인용 영상 유지 (Safety Slate)
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 6, backgroundColor: c.surfaceSub, fontSize: 16, fontWeight: 800, color: c.navyDark, border: `1.5px solid ${c.borderStrong}` }}>
                ✔ END 버튼 2초 롱프레스 시에만 잠금 해제
              </div>
            </div>
          </div>
          <div style={{ padding: '14px', borderRadius: 8, backgroundColor: c.redLight, border: `2px solid ${c.redBorder}`, fontSize: 16, color: c.redPoint, fontWeight: 900, textAlign: 'center', marginTop: 12 }}>
            * 해제 시 자동 재가동 방지 (IDLE 복귀)
          </div>
        </div>
      </div>
    </div>

    <div style={{ marginTop: 10, padding: '12px 20px', backgroundColor: '#ffffff', borderRadius: 8, border: `2px solid ${c.borderStrong}`, fontSize: 16, color: c.navyDark, fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
      <span>🔒 <strong>모드 전환 인터락:</strong> 오직 <code style={{ color: c.bluePoint }}>IDLE</code> 상태에서만 모드 전환 허용</span>
      <span>🚨 <strong>비상 정지 특권:</strong> 어떤 상태에서든 EXTI 감지 즉시 최우선 E-STOP 강제 전이</span>
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
      subtitle="중앙 55% ROI 영역 크롭(Crop) 후 416x416 입력으로 큐브 해상도 손실 제거 및 초고속 결함 판정"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, flex: 1, alignItems: 'stretch' }}>
      {/* 좌측: HUD 이미지 및 대형 임계값 메트릭 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'space-between' }}>
        <div style={{ ...cardBase, padding: 12 }}>
          <div style={{ borderRadius: 8, overflow: 'hidden', height: 320, border: `2px solid ${c.borderStrong}`, position: 'relative' }}>
            <img src={yoloImg} alt="Machine Vision YOLO Detection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 8, left: 8, padding: '6px 14px', backgroundColor: 'rgba(0, 32, 96, 0.92)', color: '#ffffff', borderRadius: 4, fontSize: 14, fontWeight: 800 }}>
              Nano Banana 3D Render: Real-Time Machine Vision HUD
            </div>
          </div>
        </div>

        <div style={{ ...cardBase, padding: '18px 22px' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, marginBottom: 10 }}>
            엄격한 2단계 판정 임계값 (Dual-Threshold)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ padding: '16px', backgroundColor: c.emeraldLight, borderRadius: 8, border: `2px solid ${c.emeraldBorder}` }}>
              <div style={{ fontSize: 15, color: c.emeraldPoint, fontWeight: 900 }}>정상 큐브 검출 확신도</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: c.emeraldPoint, margin: '2px 0' }}>≥ 65%</div>
              <div style={{ fontSize: 14, color: c.textSecondary, fontWeight: 700 }}>BOX_CONF: 큐브 본체 안착 확정</div>
            </div>

            <div style={{ padding: '16px', backgroundColor: c.redLight, borderRadius: 8, border: `2px solid ${c.redBorder}` }}>
              <div style={{ fontSize: 15, color: c.redPoint, fontWeight: 900 }}>결함/스크래치 감지 기준</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: c.redPoint, margin: '2px 0' }}>≥ 35%</div>
              <div style={{ fontSize: 14, color: c.textSecondary, fontWeight: 700 }}>DEFECT_CONF: 미세 흠집 민감 감지</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 18px', backgroundColor: '#ffffff', borderRadius: 8, border: `2px solid ${c.borderStrong}`, fontSize: 16, color: c.textSecondary, lineHeight: 1.5, fontWeight: 700 }}>
          • <strong>바닥판 필터:</strong> ROI 면적 85% 이상 차지하는 받침판은 <code style={{ color: c.amberPoint }}>[PLATE/IGNORE]</code>로 자동 배제<br />
          • <strong>연속성 검증:</strong> 연속 3프레임(<code style={{ color: c.bluePoint }}>detect_streak &gt;= 3</code>) 이상 검출 시에만 최종 유효 판정
        </div>
      </div>

      {/* 우측: 파이썬 코드 블록 및 엣지 런타임 */}
      <div style={{ ...cardBase, padding: 18, backgroundColor: '#0b192c', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid #1e3a5f' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 16, color: '#38bdf8', fontWeight: 900, fontFamily: monoFont }}>camera_ai_client.py</span>
            <span style={{ fontSize: 14, color: '#34d399', fontFamily: monoFont, fontWeight: 800 }}>30 FPS @ 720p</span>
          </div>

          <pre
            style={{
              margin: 0,
              padding: 16,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 8,
              fontSize: 15,
              lineHeight: 1.55,
              fontFamily: monoFont,
              color: '#f1f5f9',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
{`# 1. 고정밀 중앙 55% ROI 크롭
roi_crop = frame[roi_y1:roi_y2, roi_x1:roi_x2]

# 2. YOLOv8 경량 추론 실행
results = yolo_model.predict(
    source=roi_crop,
    imgsz=416,
    conf=0.25,
    device=0
)

# 3. 단일 객체 검증 및 품질 판정
if valid_objects_count == 1:
    if has_defect:
        send_result("DEFECT")  # FAIL 30°
    else:
        send_result("NORMAL")  # PASS 150°`}
          </pre>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ padding: '16px', borderRadius: 8, backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: 16, color: '#e0f2fe', lineHeight: 1.5, fontWeight: 600 }}>
            <div style={{ fontWeight: 900, color: '#38bdf8', marginBottom: 6, fontSize: 18 }}>MJPEG 스트리밍 서버 내장 (Port 5000)</div>
            웹 브라우저 및 FastAPI 대시보드로 제로 레이턴시 실시간 비전 피드를 제공하여 작업자 원격 육안 검사를 동시 지원합니다.
          </div>
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 10: DB 및 Web Dashboard: 작업 Cycle과 제품 판정 분리
// ==============================================================================
const Slide10: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="DB 및 Web Dashboard: 작업 Cycle과 제품 판정 분리"
      subtitle="작업 공정 진행(Timeline)과 실제 완제품 품질(PASS/FAIL)을 분리 저장하여 신뢰도 높은 통계 구축"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1, alignItems: 'stretch' }}>
      {/* 좌측: DB 스키마 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'space-between' }}>
        <div style={{ ...cardBase, padding: '22px' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, marginBottom: 14 }}>
            검사 이력 데이터베이스 스키마 (MariaDB / SQLite)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '16px', borderRadius: 8, backgroundColor: c.blueLight, border: `2px solid ${c.blueBorder}` }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: c.bluePoint }}>inspection_logs (완제품 품질 검사 이력)</div>
              <div style={{ fontSize: 15, color: c.textSecondary, marginTop: 4, fontFamily: monoFont, fontWeight: 700 }}>
                device_id, model_id, result (PASS/FAIL), confidence, inspected_at
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: 8, backgroundColor: c.emeraldLight, border: `2px solid ${c.emeraldBorder}` }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: c.emeraldPoint }}>devices &amp; ai_models (스마트 팩토리 기기)</div>
              <div style={{ fontSize: 15, color: c.textSecondary, marginTop: 4, fontFamily: monoFont, fontWeight: 700 }}>
                Jetson IP(10.10.16.117), 점유 상태, 모델 가중치(best.pt), 버전
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: 8, backgroundColor: c.amberLight, border: `2px solid ${c.amberBorder}` }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: c.amberPoint }}>users (작업자 권한 및 보안)</div>
              <div style={{ fontSize: 15, color: c.textSecondary, marginTop: 4, fontFamily: monoFont, fontWeight: 700 }}>
                username, SHA-256 password_hash, role (admin / operator)
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...cardBase, padding: '18px 22px', backgroundColor: c.surfaceSub }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: c.navyDark, marginBottom: 6 }}>데이터 무결성 원칙 (Data Integrity)</div>
          <p style={{ fontSize: 17, color: c.textSecondary, margin: 0, lineHeight: 1.5, fontWeight: 700 }}>
            NONE, MULTI 또는 MANUAL 단순 모니터링 도중 감지된 임시 영상 피드는 <strong>공식 완제품 검사 이력(PASS/FAIL)에 일체 섞이지 않도록</strong> 엄격히 분리 차단합니다.
          </p>
        </div>
      </div>

      {/* 우측: 대시보드 4대 기능 & 이미지 */}
      <div style={{ ...cardBase, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark }}>실시간 웹 대시보드 (FastAPI :8000)</div>
            <span style={{ fontSize: 14, fontWeight: 900, color: c.bluePoint, backgroundColor: c.blueLight, padding: '4px 10px', borderRadius: 4 }}>
              반응형 모니터링
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: c.surfaceSub, border: `2px solid ${c.borderStrong}` }}>
              <div style={{ fontSize: 13, color: c.bluePoint, fontWeight: 900 }}>LIVE STREAM PROXY</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>/video_feed</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 1, fontWeight: 700 }}>Jetson 스트림 실시간 릴레이</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: c.surfaceSub, border: `2px solid ${c.borderStrong}` }}>
              <div style={{ fontSize: 13, color: c.emeraldPoint, fontWeight: 900 }}>NODE HEALTH CHECK</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>4개 노드 실시간 감시</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 1, fontWeight: 700 }}>T8_CTRL, HMI, MOTION, VISION</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: c.surfaceSub, border: `2px solid ${c.borderStrong}` }}>
              <div style={{ fontSize: 13, color: c.amberPoint, fontWeight: 900 }}>REMOTE CLAIM LOCK</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>점유 권한 획득제</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 1, fontWeight: 700 }}>단일 웹 사용자 점유 제어</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: c.surfaceSub, border: `2px solid ${c.borderStrong}` }}>
              <div style={{ fontSize: 13, color: c.redPoint, fontWeight: 900 }}>EMERGENCY OVERRIDE</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>웹 비상 정지 버튼</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 1, fontWeight: 700 }}>원격지 긴급 공정 E-STOP</div>
            </div>
          </div>
        </div>

        <div style={{ borderRadius: 8, overflow: 'hidden', height: 260, border: `2px solid ${c.borderStrong}` }}>
          <img src={dbImg} alt="Web UI & DB" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 11: 4대 노드 실시간 상호작용 시퀀스 다이어그램 (화면 완전 채움)
// ==============================================================================
const Slide11: Page = () => (
  <div style={canvasBase}>
    <Header
      category="03. SYSTEM INTERACTION"
      title="4대 노드(Server · Jetson · STM32 · DB) 실시간 상호작용 시퀀스"
      subtitle="작업자 버튼 입력부터 AI 판정, 서보 모터 물리 배출, DB 영속화까지의 엔드투엔드 메시지 흐름"
    />

    {/* 상단 5대 노드 헤더 바 */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 10 }}>
      <div style={{ padding: '10px', borderRadius: 8, backgroundColor: c.navyDark, color: '#ffffff', textAlign: 'center', border: `2px solid ${c.borderDark}` }}>
        <div style={{ fontSize: 13, color: '#93c5fd', fontWeight: 900 }}>NODE 1 (HMI)</div>
        <div style={{ fontSize: 19, fontWeight: 900, marginTop: 2 }}>[T8_HMI] STM32 #1</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', marginTop: 1, fontWeight: 700 }}>HC-06 Bluetooth</div>
      </div>

      <div style={{ padding: '10px', borderRadius: 8, backgroundColor: c.bluePoint, color: '#ffffff', textAlign: 'center', border: `2px solid ${c.bluePoint}` }}>
        <div style={{ fontSize: 13, color: '#bae6fd', fontWeight: 900 }}>NODE 2 (CENTRAL)</div>
        <div style={{ fontSize: 19, fontWeight: 900, marginTop: 2 }}>[T8_CTRL] RPi Broker</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', marginTop: 1, fontWeight: 700 }}>Port 8080 C FSM Engine</div>
      </div>

      <div style={{ padding: '10px', borderRadius: 8, backgroundColor: c.purplePoint, color: '#ffffff', textAlign: 'center', border: `2px solid ${c.purplePoint}` }}>
        <div style={{ fontSize: 13, color: '#e9d5ff', fontWeight: 900 }}>NODE 3 (AI VISION)</div>
        <div style={{ fontSize: 19, fontWeight: 900, marginTop: 2 }}>[T8_VISION] Jetson</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', marginTop: 1, fontWeight: 700 }}>YOLOv8 &amp; TCP Socket</div>
      </div>

      <div style={{ padding: '10px', borderRadius: 8, backgroundColor: c.emeraldPoint, color: '#ffffff', textAlign: 'center', border: `2px solid ${c.emeraldPoint}` }}>
        <div style={{ fontSize: 13, color: '#bbf7d0', fontWeight: 900 }}>NODE 4 (MOTION)</div>
        <div style={{ fontSize: 19, fontWeight: 900, marginTop: 2 }}>[T8_MOTION] STM32 #2</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', marginTop: 1, fontWeight: 700 }}>ESP-01 Wi-Fi TCP</div>
      </div>

      <div style={{ padding: '10px', borderRadius: 8, backgroundColor: c.amberPoint, color: '#ffffff', textAlign: 'center', border: `2px solid ${c.amberPoint}` }}>
        <div style={{ fontSize: 13, color: '#fef08a', fontWeight: 900 }}>NODE 5 (STORAGE &amp; UI)</div>
        <div style={{ fontSize: 19, fontWeight: 900, marginTop: 2 }}>MariaDB &amp; FastAPI</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', marginTop: 1, fontWeight: 700 }}>Port 8000 Web UI</div>
      </div>
    </div>

    {/* 7단계 순차 상호작용 스윔레인 박스 (각 행 높이 대폭 확장) */}
    <div style={{ ...cardBase, padding: '14px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, justifyContent: 'space-between' }}>
        {/* Step 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1.4fr 1.9fr 1.2fr', gap: 14, alignItems: 'center', padding: '10px 16px', backgroundColor: c.surfaceSub, borderRadius: 6, border: `2px solid ${c.borderStrong}` }}>
          <span style={{ fontSize: 14, fontWeight: 900, backgroundColor: c.navyDark, color: '#ffffff', padding: '4px 10px', borderRadius: 4, textAlign: 'center' }}>STEP 01</span>
          <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>HMI ➔ Server [BT]</div>
          <div style={{ fontFamily: monoFont, fontSize: 16, color: c.bluePoint, fontWeight: 900 }}>[T8_CTRL]CHECK@0</div>
          <div style={{ fontSize: 16, color: c.textSecondary, fontWeight: 800 }}>현장 작업자가 CHECK 버튼 입력 (공식 검사 요청)</div>
        </div>

        {/* Step 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1.4fr 1.9fr 1.2fr', gap: 14, alignItems: 'center', padding: '10px 16px', backgroundColor: c.blueLight, borderRadius: 6, border: `2px solid ${c.blueBorder}` }}>
          <span style={{ fontSize: 14, fontWeight: 900, backgroundColor: c.bluePoint, color: '#ffffff', padding: '4px 10px', borderRadius: 4, textAlign: 'center' }}>STEP 02</span>
          <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>Server ➔ Jetson [TCP]</div>
          <div style={{ fontFamily: monoFont, fontSize: 16, color: c.bluePoint, fontWeight: 900 }}>[T8_VISION]INSPECT@START</div>
          <div style={{ fontSize: 16, color: c.textSecondary, fontWeight: 800 }}>T8_CTRL이 WORKING 상태 확인 후 AI 검사 지시</div>
        </div>

        {/* Step 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1.4fr 1.9fr 1.2fr', gap: 14, alignItems: 'center', padding: '10px 16px', backgroundColor: c.purpleLight, borderRadius: 6, border: `2px solid ${c.purpleBorder}` }}>
          <span style={{ fontSize: 14, fontWeight: 900, backgroundColor: c.purplePoint, color: '#ffffff', padding: '4px 10px', borderRadius: 4, textAlign: 'center' }}>STEP 03</span>
          <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>Jetson ➔ Server [TCP]</div>
          <div style={{ fontFamily: monoFont, fontSize: 16, color: c.purplePoint, fontWeight: 900 }}>[T8_CTRL]RESULT@SINGLE_NORMAL</div>
          <div style={{ fontSize: 16, color: c.textSecondary, fontWeight: 800 }}>YOLOv8 ROI 크롭 추론: 단일 양품 판정 결과 회신</div>
        </div>

        {/* Step 4 */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1.4fr 1.9fr 1.2fr', gap: 14, alignItems: 'center', padding: '10px 16px', backgroundColor: c.emeraldLight, borderRadius: 6, border: `2px solid ${c.emeraldBorder}` }}>
          <span style={{ fontSize: 14, fontWeight: 900, backgroundColor: c.emeraldPoint, color: '#ffffff', padding: '4px 10px', borderRadius: 4, textAlign: 'center' }}>STEP 04</span>
          <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>Server ➔ Motion [Wi-Fi]</div>
          <div style={{ fontFamily: monoFont, fontSize: 16, color: c.emeraldPoint, fontWeight: 900 }}>[T8_MOTION]SORT@PASS</div>
          <div style={{ fontSize: 16, color: c.textSecondary, fontWeight: 800 }}>ESP-01 소켓으로 서보모터 150° 배출 구동 명령</div>
        </div>

        {/* Step 5 */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1.4fr 1.9fr 1.2fr', gap: 14, alignItems: 'center', padding: '10px 16px', backgroundColor: c.surfaceSub, borderRadius: 6, border: `2px solid ${c.borderStrong}` }}>
          <span style={{ fontSize: 14, fontWeight: 900, backgroundColor: c.navyDark, color: '#ffffff', padding: '4px 10px', borderRadius: 4, textAlign: 'center' }}>STEP 05</span>
          <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>Server ➔ HMI [BT]</div>
          <div style={{ fontFamily: monoFont, fontSize: 16, color: c.navyDark, fontWeight: 900 }}>[T8_HMI]RESULT@PASS</div>
          <div style={{ fontSize: 16, color: c.textSecondary, fontWeight: 800 }}>HMI CLCD에 'RESULT: PASS' 출력 및 녹색 LED 점등</div>
        </div>

        {/* Step 6 */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1.4fr 1.9fr 1.2fr', gap: 14, alignItems: 'center', padding: '10px 16px', backgroundColor: c.amberLight, borderRadius: 6, border: `2px solid ${c.amberBorder}` }}>
          <span style={{ fontSize: 14, fontWeight: 900, backgroundColor: c.amberPoint, color: '#ffffff', padding: '4px 10px', borderRadius: 4, textAlign: 'center' }}>STEP 06</span>
          <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>Server ➔ DB/Web [TCP]</div>
          <div style={{ fontFamily: monoFont, fontSize: 16, color: c.amberPoint, fontWeight: 900 }}>INSERT INTO inspection_logs (PASS)</div>
          <div style={{ fontSize: 16, color: c.textSecondary, fontWeight: 800 }}>MariaDB 품질 이력 영속화 및 웹 대시보드 실시간 반영</div>
        </div>

        {/* Step 7 */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1.4fr 1.9fr 1.2fr', gap: 14, alignItems: 'center', padding: '10px 16px', backgroundColor: c.emeraldLight, borderRadius: 6, border: `2px solid ${c.emeraldBorder}` }}>
          <span style={{ fontSize: 14, fontWeight: 900, backgroundColor: c.emeraldPoint, color: '#ffffff', padding: '4px 10px', borderRadius: 4, textAlign: 'center' }}>STEP 07</span>
          <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark }}>Motion ➔ Server [Wi-Fi]</div>
          <div style={{ fontFamily: monoFont, fontSize: 16, color: c.emeraldPoint, fontWeight: 900 }}>[T8_CTRL]SORT_DONE@0</div>
          <div style={{ fontSize: 16, color: c.textSecondary, fontWeight: 800 }}>1초 유지 후 90° 원점 복귀 완료 보고 ➔ WORKING 복귀</div>
        </div>
      </div>

      {/* 하단 예외 분기 박스 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 10 }}>
        <div style={{ padding: '8px 12px', backgroundColor: c.amberLight, borderRadius: 6, border: `2px solid ${c.amberBorder}`, fontSize: 14, color: c.textSecondary, fontWeight: 700 }}>
          <strong>결과가 NONE인 경우:</strong> STEP 4~6 생략 ➔ HMI에 <code>NO ITEM</code> 표시 후 즉시 복귀
        </div>
        <div style={{ padding: '8px 12px', backgroundColor: c.redLight, borderRadius: 6, border: `2px solid ${c.redBorder}`, fontSize: 14, color: c.textSecondary, fontWeight: 700 }}>
          <strong>결과가 MULTI인 경우:</strong> 분류 차단 ➔ HMI에 <code>ONE ITEM ONLY</code> 표시 후 작업자 알림
        </div>
        <div style={{ padding: '8px 12px', backgroundColor: c.redLight, borderRadius: 6, border: `2px solid ${c.redBorder}`, fontSize: 14, color: c.textSecondary, fontWeight: 700 }}>
          <strong>DEFECT (불량)인 경우:</strong> STEP 4에서 <code>SORT@FAIL (30°)</code> 배출 및 DB에 결함 기록
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 12: 데이터 라이프사이클 및 상호작용 아키텍처 다이어그램
// ==============================================================================
const Slide12: Page = () => (
  <div style={canvasBase}>
    <Header
      category="03. SYSTEM INTERACTION"
      title="데이터 라이프사이클 및 상호작용 아키텍처 다이어그램"
      subtitle="제어 패킷 버스, 비전 스트리밍 파이프라인, DB 무결성 영속화의 3계층 상호작용 분리 메커니즘"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, flex: 1, alignItems: 'stretch' }}>
      {/* 좌측: 4계층 통신 파이프라인 아키텍처 (대형 카드들) */}
      <div style={{ ...cardBase, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, marginBottom: 12 }}>
          계층별 통신 흐름 및 데이터 동기화 파이프라인
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'space-between' }}>
          {/* Layer 1: 제어 패킷 버스 */}
          <div style={{ padding: '16px 18px', borderRadius: 8, backgroundColor: c.blueLight, border: `2.5px solid ${c.blueBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: c.bluePoint }}>LAYER 1 : 제어 패킷 버스 (C Socket Broker :8080)</span>
              <span style={{ fontSize: 13, fontWeight: 900, backgroundColor: c.bluePoint, color: '#ffffff', padding: '2px 8px', borderRadius: 4 }}>TCP CONTROL</span>
            </div>
            <p style={{ fontSize: 16, color: c.textSecondary, margin: '6px 0 0 0', lineHeight: 1.45, fontWeight: 700 }}>
              모든 기기는 Broker에 클라이언트로 접속. T8_CTRL 중앙 상태 머신이 요청의 유효성을 검증한 후 대상 노드로만 타깃 라우팅 수행.
            </p>
          </div>

          {/* Layer 2: 실시간 영상 스트리밍 */}
          <div style={{ padding: '16px 18px', borderRadius: 8, backgroundColor: c.purpleLight, border: `2.5px solid ${c.purpleBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: c.purplePoint }}>LAYER 2 : 비전 스트리밍 파이프라인 (MJPEG Proxy)</span>
              <span style={{ fontSize: 13, fontWeight: 900, backgroundColor: c.purplePoint, color: '#ffffff', padding: '2px 8px', borderRadius: 4 }}>HTTP MJPEG</span>
            </div>
            <p style={{ fontSize: 16, color: c.textSecondary, margin: '6px 0 0 0', lineHeight: 1.45, fontWeight: 700 }}>
              Jetson Nano 웹캠 피드(:5000) ➔ FastAPI 스트리밍 프록시(:8000/video_feed) ➔ 브라우저 Canvas. 제어 패킷과 분리되어 네트워크 병목 제로.
            </p>
          </div>

          {/* Layer 3: DB 영속화 */}
          <div style={{ padding: '16px 18px', borderRadius: 8, backgroundColor: c.amberLight, border: `2.5px solid ${c.amberBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: c.amberPoint }}>LAYER 3 : 품질 이력 영속화 (MariaDB / SQLite)</span>
              <span style={{ fontSize: 13, fontWeight: 900, backgroundColor: c.amberPoint, color: '#ffffff', padding: '2px 8px', borderRadius: 4 }}>DATABASE</span>
            </div>
            <p style={{ fontSize: 16, color: c.textSecondary, margin: '6px 0 0 0', lineHeight: 1.45, fontWeight: 700 }}>
              임시 모니터링 피드는 배제하고, 공식 검사(CHECK) 승인된 SINGLE 객체 결과만 <code>inspection_logs</code> 테이블에 정확히 기록.
            </p>
          </div>

          {/* Layer 4: 비상 정지 인터락 */}
          <div style={{ padding: '16px 18px', borderRadius: 8, backgroundColor: c.redLight, border: `2.5px solid ${c.redBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: c.redPoint }}>LAYER 4 : 비상 안전 인터락 (EXTI Broadcast)</span>
              <span style={{ fontSize: 13, fontWeight: 900, backgroundColor: c.redPoint, color: '#ffffff', padding: '2px 8px', borderRadius: 4 }}>EXTI INTERRUPT</span>
            </div>
            <p style={{ fontSize: 16, color: c.textSecondary, margin: '6px 0 0 0', lineHeight: 1.45, fontWeight: 700 }}>
              하드웨어 EXTI 인터럽트 감지 즉시 브로커가 모든 연결 노드에 <code>[TARGET]ESTOP@1</code> 브로드캐스트하여 모터 및 센서 즉각 셧다운.
            </p>
          </div>
        </div>
      </div>

      {/* 우측: 상호작용 규칙 매트릭스 표 */}
      <div style={{ ...cardBase, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, marginBottom: 12 }}>
          노드 간 상호작용 프로토콜 매트릭스
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'space-between' }}>
          <div style={{ padding: '12px 14px', backgroundColor: c.surfaceSub, borderRadius: 8, border: `2px solid ${c.borderStrong}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: c.navyDark }}>
              <span>Server ↔ Jetson Nano</span>
              <span style={{ color: c.bluePoint }}>TCP Socket :8080</span>
            </div>
            <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 4, fontWeight: 700 }}>
              • 송신: <code>[T8_VISION]INSPECT@START</code><br />
              • 수신: <code>[T8_CTRL]RESULT@SINGLE_NORMAL / SINGLE_DEFECT</code>
            </div>
          </div>

          <div style={{ padding: '12px 14px', backgroundColor: c.surfaceSub, borderRadius: 8, border: `2px solid ${c.borderStrong}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: c.navyDark }}>
              <span>Server ↔ STM32 #1 HMI</span>
              <span style={{ color: c.bluePoint }}>HC-06 BT RFCOMM</span>
            </div>
            <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 4, fontWeight: 700 }}>
              • 수신: <code>[T8_CTRL]START</code>, <code>CHECK</code>, <code>END</code>, <code>SYNC</code><br />
              • 송신: <code>[T8_HMI]STATE@WORKING</code>, <code>RESULT@PASS</code>, <code>ESTOP</code>
            </div>
          </div>

          <div style={{ padding: '12px 14px', backgroundColor: c.surfaceSub, borderRadius: 8, border: `2px solid ${c.borderStrong}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: c.navyDark }}>
              <span>Server ↔ STM32 #2 Motion</span>
              <span style={{ color: c.emeraldPoint }}>ESP-01 Wi-Fi TCP</span>
            </div>
            <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 4, fontWeight: 700 }}>
              • 송신: <code>[T8_MOTION]SORT@PASS (150°)</code>, <code>SORT@FAIL (30°)</code><br />
              • 수신: <code>[T8_CTRL]SORT_DONE@0</code> (홈 원점 복귀 완료)
            </div>
          </div>

          <div style={{ padding: '12px 14px', backgroundColor: c.surfaceSub, borderRadius: 8, border: `2px solid ${c.borderStrong}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: c.navyDark }}>
              <span>Server ↔ DB &amp; Web</span>
              <span style={{ color: c.amberPoint }}>REST &amp; SQLite/MariaDB</span>
            </div>
            <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 4, fontWeight: 700 }}>
              • DB 이력 저장: <code>INSERT INTO inspection_logs</code><br />
              • Web 제어: <code>/api/v1/control/start</code>, <code>claim</code>, <code>estop</code>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, padding: '10px 14px', backgroundColor: c.blueLight, borderRadius: 6, fontSize: 14, color: c.navyDark, fontWeight: 800, textAlign: 'center' }}>
          ✓ 각 통신 인터페이스가 완전히 분리되어 한쪽의 지연이 타 노드로 전이되지 않음
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 13: 프로젝트 리뷰 & 실전 트러블슈팅
// ==============================================================================
const Slide13: Page = () => (
  <div style={canvasBase}>
    <Header
      category="04. PROJECT REVIEW"
      title="통합 과정의 주요 문제와 아키텍처 개선"
      subtitle="실제 이종 하드웨어 결합 중 발생한 레이턴시, 패킷 유실, 통신 불안정 문제를 구조적 설계로 극복"
    />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, flex: 1, alignItems: 'stretch' }}>
      {/* Problem 1 */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `10px solid ${c.redPoint}` }}>
        <CardTitleBar title="ISSUE 01 : 루프 블로킹" badge="HAL_Delay" color={c.redPoint} bgColor={c.redLight} />
        <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, marginBottom: 10 }}>HAL_Delay() 메인 루프 정지</div>
            <div style={{ padding: '14px 16px', borderRadius: 6, backgroundColor: c.redLight, border: `2px solid ${c.redBorder}`, fontSize: 16, color: c.redPoint, marginBottom: 14, lineHeight: 1.45, fontWeight: 800 }}>
              서보 모터 1초 유지 동안 <code>HAL_Delay(1000)</code> 호출로 Wi-Fi 소켓 및 센서 루프 전체 정지 발생
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: c.emeraldPoint, marginBottom: 6 }}>
              해결 ➔ Non-blocking Tick 전환
            </div>
            <p style={{ fontSize: 17, color: c.textSecondary, lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
              <code>HAL_GetTick()</code> 기반으로 타임스탬프만 비교하고 루프는 계속 회전하여 서보 동작 중에도 통신/비상정지 완벽 수용.
            </p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 6, backgroundColor: c.emeraldLight, fontSize: 16, color: c.emeraldPoint, fontWeight: 900, textAlign: 'center', marginTop: 12 }}>
            실시간 반응성 100% 확보
          </div>
        </div>
      </div>

      {/* Problem 2 */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `10px solid ${c.amberPoint}` }}>
        <CardTitleBar title="ISSUE 02 : 버퍼 덮어씀" badge="UART OVERWRITE" color={c.amberPoint} bgColor={c.amberLight} />
        <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, marginBottom: 10 }}>UART 연속 패킷 버퍼 유실</div>
            <div style={{ padding: '14px 16px', borderRadius: 6, backgroundColor: c.amberLight, border: `2px solid ${c.amberBorder}`, fontSize: 16, color: c.amberPoint, marginBottom: 14, lineHeight: 1.45, fontWeight: 800 }}>
              단일 RX 버퍼 사용 시 <code>STATE@READY</code>와 <code>MODE@AUTO</code>가 연속 수신되면 이전 패킷이 유실됨
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: c.emeraldPoint, marginBottom: 6 }}>
              해결 ➔ Circular RX Queue 구축
            </div>
            <p style={{ fontSize: 17, color: c.textSecondary, lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
              인터럽트에서 <code>\n</code> 감지 시 완성 문자열을 8단계 링 버퍼 큐에 적재하고, 메인 루프에서 순차 파싱 처리.
            </p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 6, backgroundColor: c.emeraldLight, fontSize: 16, color: c.emeraldPoint, fontWeight: 900, textAlign: 'center', marginTop: 12 }}>
            연속 패킷 유실률 0% 달성
          </div>
        </div>
      </div>

      {/* Problem 3 */}
      <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `10px solid ${c.bluePoint}` }}>
        <CardTitleBar title="ISSUE 03 : 상태 고착" badge="E-STOP RECOVERY" color={c.bluePoint} bgColor={c.blueLight} />
        <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, marginBottom: 10 }}>E-STOP 복구 FSM 무한 대기</div>
            <div style={{ padding: '14px 16px', borderRadius: 6, backgroundColor: c.blueLight, border: `2px solid ${c.blueBorder}`, fontSize: 16, color: c.bluePoint, marginBottom: 14, lineHeight: 1.45, fontWeight: 800 }}>
              복구 조건이 지나치게 복잡하여 <code>RETURN HOME</code> 상태에서 시스템이 풀리지 않고 고착되는 현상
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: c.emeraldPoint, marginBottom: 6 }}>
              해결 ➔ CLEAR 구조 단순화
            </div>
            <p style={{ fontSize: 17, color: c.textSecondary, lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
              복잡한 중간 Recovery 상태를 과감히 제거하고, END 2초 롱프레스 시 즉시 래치를 해제하며 관리자 안전 수동 재시작 유도.
            </p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 6, backgroundColor: c.emeraldLight, fontSize: 16, color: c.emeraldPoint, fontWeight: 900, textAlign: 'center', marginTop: 12 }}>
            안전 기준 부합 및 고착 해소
          </div>
        </div>
      </div>
    </div>

    <div style={{ marginTop: 10, padding: '12px 20px', backgroundColor: '#ffffff', borderRadius: 8, border: `2px solid ${c.borderStrong}`, fontSize: 17, color: c.navyDark, fontWeight: 800 }}>
      💡 <strong>트러블슈팅 교훈:</strong> 단순 땜질식 코드 수정이 아닌, <strong>상태 머신 규칙 단순화와 넌블로킹 큐 기반 아키텍처</strong>로 시스템 안정성을 근본적으로 확보함
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 14: 팀원 소감 및 최종 Q&A
// ==============================================================================
const Slide14: Page = () => (
  <div style={canvasBase}>
    <Header
      category="04. PROJECT REVIEW"
      title="팀원별 구현 소감 및 Q&amp;A"
      subtitle="수업 실습 기능을 실제 산업 현장의 요구 동작에 맞게 재구성하며 체득한 핵심 엔지니어링 역량"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1, alignItems: 'stretch' }}>
      {/* 손준호 카드 */}
      <div style={{ ...cardBase, padding: '26px 28px', borderLeft: `10px solid ${c.bluePoint}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: c.blueLight, color: c.bluePoint, fontSize: 28, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              👨‍💻
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: c.navyDark }}>손준호</div>
              <div style={{ fontSize: 17, color: c.bluePoint, fontWeight: 800 }}>
                HMI · 중앙제어 · Motion · 전체 시스템 통합
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '16px 18px', backgroundColor: c.surfaceSub, borderRadius: 8, fontSize: 18, color: c.textSecondary, lineHeight: 1.5, fontWeight: 700, border: `2px solid ${c.borderStrong}` }}>
              ✔ 수업에서 배운 단일 기능들을 유기적인 분산 시스템(BT/Wi-Fi/Socket)으로 통합 연결
            </div>
            <div style={{ padding: '16px 18px', backgroundColor: c.surfaceSub, borderRadius: 8, fontSize: 18, color: c.textSecondary, lineHeight: 1.5, fontWeight: 700, border: `2px solid ${c.borderStrong}` }}>
              ✔ E-STOP과 상태 머신 예외 처리의 복잡성을 해결하며 신뢰도 높은 아키텍처 설계 체득
            </div>
            <div style={{ padding: '16px 18px', backgroundColor: c.surfaceSub, borderRadius: 8, fontSize: 18, color: c.textSecondary, lineHeight: 1.5, fontWeight: 700, border: `2px solid ${c.borderStrong}` }}>
              ✔ 단순 코드 작성보다 "전체 흐름과 예외 상황을 먼저 정의하는 시스템 설계"의 중요성 체감
            </div>
          </div>
        </div>

        <div style={{ fontSize: 16, color: c.bluePoint, fontWeight: 900, backgroundColor: c.blueLight, padding: '12px 16px', borderRadius: 6, textAlign: 'center', marginTop: 14 }}>
          수업 실습 응용 ➔ 이종 통신 통합 ➔ 비상 예외 안전 설계 완성
        </div>
      </div>

      {/* 정승헌 카드 */}
      <div style={{ ...cardBase, padding: '26px 28px', borderLeft: `10px solid ${c.cyanPoint}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: c.cyanLight, color: c.cyanPoint, fontSize: 28, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              🧠
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: c.navyDark }}>정승헌</div>
              <div style={{ fontSize: 17, color: c.cyanPoint, fontWeight: 800 }}>
                Camera · Vision AI · DB · Web Dashboard
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '16px 18px', backgroundColor: c.surfaceSub, borderRadius: 8, fontSize: 18, color: c.textSecondary, lineHeight: 1.5, fontWeight: 700, border: `2px solid ${c.borderStrong}` }}>
              ✔ 경량 딥러닝(YOLOv8) 모델을 Jetson 임베디드 환경에서 30 FPS로 안정 구동
            </div>
            <div style={{ padding: '16px 18px', backgroundColor: c.surfaceSub, borderRadius: 8, fontSize: 18, color: c.textSecondary, lineHeight: 1.5, fontWeight: 700, border: `2px solid ${c.borderStrong}` }}>
              ✔ ROI 크롭과 다중 임계값으로 산업 현장 바닥판 노이즈와 미세 결함을 완벽 분리
            </div>
            <div style={{ padding: '16px 18px', backgroundColor: c.surfaceSub, borderRadius: 8, fontSize: 18, color: c.textSecondary, lineHeight: 1.5, fontWeight: 700, border: `2px solid ${c.borderStrong}` }}>
              ✔ FastAPI와 MariaDB로 실시간 영상 스트리밍과 검사 이력 관리를 동시에 실현
            </div>
          </div>
        </div>

        <div style={{ fontSize: 16, color: c.cyanPoint, fontWeight: 900, backgroundColor: c.cyanLight, padding: '12px 16px', borderRadius: 6, textAlign: 'center', marginTop: 14 }}>
          Edge AI 모델 최적화 ➔ 웹 모니터링 ➔ 품질 데이터 무결성 보장
        </div>
      </div>
    </div>

    {/* 하단 대형 Q&A 콜아웃 배너 */}
    <div
      style={{
        ...cardBase,
        padding: '20px 32px',
        border: `3px solid ${c.navyDark}`,
        backgroundColor: c.navyDark,
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
      }}
    >
      <div>
        <div style={{ fontSize: 28, fontWeight: 900 }}>경청해 주셔서 대단히 감사합니다.</div>
        <div style={{ fontSize: 18, color: '#93c5fd', marginTop: 2, fontWeight: 700 }}>
          질문이 있으시면 성심성의껏 답변드리겠습니다.
        </div>
      </div>
      <div
        style={{
          padding: '12px 32px',
          borderRadius: 8,
          backgroundColor: c.bluePoint,
          color: '#ffffff',
          fontWeight: 900,
          fontSize: 24,
          fontFamily: monoFont,
          letterSpacing: '0.05em',
        }}
      >
        Q &amp; A
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// 3. 메타데이터 및 발표자 발표 스크립트 (Speaker Notes for 14 Slides)
// ==============================================================================
export const meta: SlideMeta = {
  title: 'IoT Vision 기반 자동 품질 검사·분류 시스템',
  createdAt: '2026-10-12T02:18:00.000Z',
};

export const notes: (string | undefined)[] = [
  // Slide 1
  `안녕하십니까. 온디바이스 AI SW 개발 과정 8조, 손준호, 정승헌입니다.
저희가 개발한 'IoT Vision 기반 자동 품질 검사·분류 스마트 팩토리 시스템' 최종 발표를 시작하겠습니다.
본 프로젝트는 Jetson Nano의 실시간 AI 비전 추론, 라즈베리파이의 중앙 제어 브로커, 그리고 STM32 Nucleo의 서보모터 분류기를 하나로 통합한 지능형 스마트 팩토리 시스템입니다.`,

  // Slide 2
  `오늘 발표는 크게 네 가지 파트로 구성되어 있습니다.
첫째, 프로젝트의 배경과 목표를 소개하는 Project Overview.
둘째, 전체 시스템 토폴로지와 노드별 세부 구현을 설명하는 Project Structure.
셋째, 서버, 젯슨, STM32, DB 간 실시간 패킷 상호작용과 4계층 통신 파이프라인을 다룬 System Interaction.
넷째, 통합 과정에서 해결한 주요 트러블슈팅과 팀원 소감을 담은 Project Review 순으로 말씀드리겠습니다.`,

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
  `여기서 시스템 후반부의 가장 핵심인 4대 노드 실시간 상호작용 시퀀스를 설명드리겠습니다.
작업자가 HMI에서 CHECK 버튼을 누르면, 패킷이 블루투스를 거쳐 중앙 C 브로커로 전달됩니다.
브로커는 Jetson에 즉시 INSPECT@START를 명령하고, Jetson은 YOLOv8 추론 후 RESULT@SINGLE_NORMAL을 반환합니다.
중앙 FSM은 이를 확인하고 Motion STM32에 SORT@PASS(150도)를 전송함과 동시에 HMI CLCD에 결과를 표시하고 MariaDB에 공식 품질 이력을 인서트합니다.
서보모터가 1초 후 원점으로 복귀하고 SORT_DONE을 보고하면 한 사이클이 완결됩니다.`,

  // Slide 12
  `다음은 4계층 통신 파이프라인과 데이터 라이프사이클 아키텍처입니다.
저희 시스템은 제어 패킷 버스, 비전 스트리밍, DB 영속화, 비상 인터락의 4개 레이어가 독립적으로 분리되어 동작합니다.
영상 스트리밍이 병목을 겪더라도 제어 소켓은 지연 없이 통신하며, 단순 모니터링 프레임은 버리고 공식 검사 결과만 DB에 저장하여 데이터 무결성을 보장합니다.`,

  // Slide 13
  `통합 과정에서 겪은 핵심 트러블슈팅입니다.
첫째, HAL_Delay로 인한 메인 루프 정지를 HAL_GetTick 기반 넌블로킹 구조로 개선했습니다.
둘째, UART 단일 버퍼로 인한 연속 패킷 유실 문제를 8단계 Circular RX Queue로 해결했습니다.
셋째, 복구 상태 머신의 불필요한 단계를 제거하여 E-STOP 해제 시 고착 현상을 해소했습니다.`,

  // Slide 14
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
  Slide13,
  Slide14,
] satisfies Page[];
