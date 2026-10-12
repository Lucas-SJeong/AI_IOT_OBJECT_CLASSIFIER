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
// 1. 최고급 화이트/네이비 테마 디자인 시스템 (Luxurious Industrial White Theme)
// ==============================================================================
export const design: DesignSystem = {
  palette: {
    bg: '#ffffff',
    text: '#002060',
    accent: '#0a4cb9',
  },
  fonts: {
    display: '"Pretendard", "Noto Sans KR", system-ui, -apple-system, sans-serif',
    body: '"Pretendard", "Noto Sans KR", system-ui, -apple-system, sans-serif',
  },
  typeScale: { hero: 130, body: 28 },
  radius: 16,
};

const c = {
  bg: '#ffffff',
  bgGradient: 'radial-gradient(ellipse at top right, rgba(10, 76, 185, 0.05) 0%, rgba(248, 250, 252, 0) 70%), linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
  navyDark: '#002060',
  navyHeading: '#0a1d37',
  navyDeep: '#0f294a',
  bluePoint: '#0a4cb9',
  blueLight: '#eff6ff',
  blueBorder: '#bfdbfe',
  cyanPoint: '#087f8c',
  cyanLight: '#ecfeff',
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
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0',
  cardBorderStrong: 'rgba(0, 32, 96, 0.15)',
  surfaceMuted: '#f8fafc',
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  textNavy: '#002060',
};

const monoFont = '"JetBrains Mono", "SF Mono", Consolas, monospace';

const canvasBase: CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: c.bg,
  backgroundImage: c.bgGradient,
  color: c.textPrimary,
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  padding: '50px 72px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const cardBase: CSSProperties = {
  backgroundColor: c.cardBg,
  borderRadius: 16,
  border: `1px solid ${c.cardBorder}`,
  boxShadow: '0 8px 24px -4px rgba(0, 32, 96, 0.06), 0 2px 6px -1px rgba(0, 32, 96, 0.04)',
};

// ==============================================================================
// 2. 공통 프레임 컴포넌트 (Footer, Header, Badges)
// ==============================================================================
const SlideFooter = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #e2e8f0',
        paddingTop: 14,
        fontSize: 16,
        color: c.textMuted,
        boxSizing: 'border-box',
        fontWeight: 500,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ color: c.navyDark, fontWeight: 800 }}>IoT Vision 자동 품질 검사·분류 시스템</span>
        <span style={{ color: '#cbd5e1' }}>|</span>
        <span style={{ color: c.textSecondary, fontWeight: 600 }}>8조 (손준호 · 정승헌)</span>
        <span style={{ color: '#cbd5e1' }}>|</span>
        <span style={{ color: c.bluePoint, fontWeight: 700 }}>온디바이스 AI SW 개발 과정</span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: monoFont,
          fontWeight: 800,
          color: c.navyDark,
          backgroundColor: c.blueLight,
          padding: '4px 14px',
          borderRadius: 9999,
          border: `1px solid ${c.blueBorder}`,
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
  <div style={{ marginBottom: 20 }}>
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 14px',
        borderRadius: 9999,
        backgroundColor: c.blueLight,
        border: `1px solid ${c.blueBorder}`,
        color: c.bluePoint,
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        marginBottom: 10,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c.bluePoint }} />
      {category}
    </div>
    <h1
      style={{
        fontSize: 46,
        fontWeight: 900,
        margin: 0,
        lineHeight: 1.18,
        color: c.navyDark,
        letterSpacing: '-0.025em',
      }}
    >
      {title}
    </h1>
    <p
      style={{
        fontSize: 21,
        color: c.textSecondary,
        margin: '6px 0 0 0',
        lineHeight: 1.4,
        fontWeight: 500,
      }}
    >
      {subtitle}
    </p>
  </div>
);

// ==============================================================================
// Slide 1: 표지 (Cover) - 최고급 화이트/사파이어 디자인
// ==============================================================================
const Slide1: Page = () => (
  <div
    style={{
      ...canvasBase,
      padding: '70px 88px',
      background: 'radial-gradient(circle at 85% 15%, rgba(10, 76, 185, 0.08) 0%, rgba(240, 246, 255, 0.4) 40%, #ffffff 80%)',
    }}
  >
    {/* 상단 메타 바 */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 22px',
          borderRadius: 9999,
          backgroundColor: '#ffffff',
          border: '1.5px solid #002060',
          boxShadow: '0 4px 14px rgba(0, 32, 96, 0.08)',
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#0a4cb9' }} />
        <span style={{ fontSize: 18, fontWeight: 800, color: '#002060', letterSpacing: '0.02em' }}>
          온디바이스 AI SW 개발 과정 · IoT 스마트 시스템 최종 프로젝트
        </span>
      </div>
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 18,
          fontWeight: 700,
          color: c.textSecondary,
          backgroundColor: '#f1f5f9',
          padding: '6px 18px',
          borderRadius: 8,
          border: '1px solid #cbd5e1',
        }}
      >
        2026. 10. 13
      </div>
    </div>

    {/* 본문 그리드: 좌측 텍스트 & 우측 3D 그래픽 */}
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.95fr', gap: 48, alignItems: 'center', my: 'auto' }}>
      <div>
        <div
          style={{
            display: 'inline-block',
            fontSize: 26,
            color: c.bluePoint,
            fontWeight: 800,
            marginBottom: 12,
            letterSpacing: '-0.01em',
            borderBottom: `3px solid ${c.bluePoint}`,
            paddingBottom: 4,
          }}
        >
          Edge AI Vision × C Socket Broker × Microcontroller
        </div>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1.15,
            margin: '8px 0 0 0',
            color: c.navyDark,
            letterSpacing: '-0.035em',
          }}
        >
          IoT Vision 기반 <br />
          <span style={{ color: c.bluePoint }}>자동 품질 검사·분류</span> <br />
          스마트 팩토리 시스템
        </h1>
        <p
          style={{
            fontSize: 23,
            color: c.textSecondary,
            marginTop: 22,
            lineHeight: 1.5,
            maxWidth: 820,
            fontWeight: 500,
          }}
        >
          Edge Vision(Jetson Nano) 고정밀 AI 추론과 중앙 통합 제어(Raspberry Pi C Broker),
          초정밀 하드웨어 구동(STM32 Nucleo 서보 트레이)을 완벽 연동한 온디바이스 공정 자동화
        </p>

        {/* 핵심 메타 카드 3열 배치 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1.1fr', gap: 16, marginTop: 36 }}>
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              borderRadius: 14,
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0, 32, 96, 0.05)',
            }}
          >
            <span style={{ fontSize: 14, color: c.textMuted, fontWeight: 700, display: 'block' }}>팀 구성</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, marginTop: 4, display: 'block' }}>
              8조 (손준호 · 정승헌)
            </span>
          </div>

          <div
            style={{
              padding: '16px 20px',
              backgroundColor: c.blueLight,
              borderRadius: 14,
              border: `1.5px solid ${c.blueBorder}`,
              boxShadow: '0 4px 16px rgba(10, 76, 185, 0.06)',
            }}
          >
            <span style={{ fontSize: 14, color: c.bluePoint, fontWeight: 700, display: 'block' }}>핵심 스택</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: c.navyDark, marginTop: 4, display: 'block' }}>
              YOLOv8 · C Socket · STM32 HAL
            </span>
          </div>

          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              borderRadius: 14,
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0, 32, 96, 0.05)',
            }}
          >
            <span style={{ fontSize: 14, color: c.textMuted, fontWeight: 700, display: 'block' }}>시스템 구조</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: c.emeraldPoint, marginTop: 4, display: 'block' }}>
              3-Tier 분산 제어
            </span>
          </div>
        </div>
      </div>

      {/* 우측 3D 그래픽 카드 (Nano Banana 생성 3-Tier 시스템 3D 모델) */}
      <div
        style={{
          ...cardBase,
          padding: 12,
          border: '2px solid rgba(10, 76, 185, 0.25)',
          boxShadow: '0 24px 60px -10px rgba(0, 32, 96, 0.15)',
          position: 'relative',
        }}
      >
        <div style={{ borderRadius: 12, overflow: 'hidden', height: 490, position: 'relative' }}>
          <img
            src={edgeImg}
            alt="3-Tier Edge Smart Factory Architecture"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              left: 14,
              right: 14,
              padding: '12px 18px',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(8px)',
              borderRadius: 10,
              border: '1px solid rgba(0, 32, 96, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: c.navyDark }}>3-Tier Edge Pipeline</div>
              <div style={{ fontSize: 13, color: c.textSecondary, fontWeight: 600 }}>Jetson AI ➔ RPi Broker ➔ STM32 Sorter</div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: '#ffffff',
                backgroundColor: c.bluePoint,
                padding: '4px 10px',
                borderRadius: 6,
              }}
            >
              100% Real-Time
            </span>
          </div>
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 2: 목차 (Agenda) - 대형 타이포 & 체계적 로드맵
// ==============================================================================
const Slide2: Page = () => (
  <div style={canvasBase}>
    <Header
      category="INDEX"
      title="발표 목차 (Agenda)"
      subtitle="프로젝트의 배경 목표부터 아키텍처, 세부 노드 구현, 실전 트러블슈팅 및 리뷰까지 체계적으로 보고합니다."
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.85fr', gap: 36, alignItems: 'stretch', flex: 1, marginBottom: 16 }}>
      {/* 좌측: 3개 대형 아젠다 블록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
        {/* 01 Overview */}
        <div
          style={{
            ...cardBase,
            padding: '24px 30px',
            borderLeft: `8px solid ${c.bluePoint}`,
            display: 'flex',
            alignItems: 'center',
            gap: 26,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: c.bluePoint,
              fontFamily: monoFont,
              minWidth: 64,
            }}
          >
            01
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: c.navyDark }}>Project Overview</div>
            <div style={{ fontSize: 18, color: c.textSecondary, marginTop: 4, fontWeight: 500 }}>
              프로젝트 개발 배경 및 핵심 목표 · 4단계 엔드투엔드 품질 검사 파이프라인
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, backgroundColor: c.blueLight, color: c.bluePoint, padding: '3px 10px', borderRadius: 6 }}>
                수작업 검사 자동화
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, backgroundColor: c.surfaceMuted, color: c.textSecondary, padding: '3px 10px', borderRadius: 6 }}>
                클로즈드 루프 제어
              </span>
            </div>
          </div>
        </div>

        {/* 02 Structure */}
        <div
          style={{
            ...cardBase,
            padding: '24px 30px',
            borderLeft: `8px solid ${c.cyanPoint}`,
            display: 'flex',
            alignItems: 'center',
            gap: 26,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: c.cyanPoint,
              fontFamily: monoFont,
              minWidth: 64,
            }}
          >
            02
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: c.navyDark }}>Project Structure</div>
            <div style={{ fontSize: 18, color: c.textSecondary, marginTop: 4, fontWeight: 500 }}>
              시스템 토폴로지 · 통신 인터페이스 · HMI / 중앙제어 / Motion / Vision 세부 구현
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, backgroundColor: c.cyanLight, color: c.cyanPoint, padding: '3px 10px', borderRadius: 6 }}>
                STM32 HMI &amp; Motion
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, backgroundColor: c.surfaceMuted, color: c.textSecondary, padding: '3px 10px', borderRadius: 6 }}>
                Jetson YOLOv8 &amp; C Broker
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, backgroundColor: c.surfaceMuted, color: c.textSecondary, padding: '3px 10px', borderRadius: 6 }}>
                3대 운전 모드
              </span>
            </div>
          </div>
        </div>

        {/* 03 Review */}
        <div
          style={{
            ...cardBase,
            padding: '24px 30px',
            borderLeft: `8px solid ${c.purplePoint}`,
            display: 'flex',
            alignItems: 'center',
            gap: 26,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: c.purplePoint,
              fontFamily: monoFont,
              minWidth: 64,
            }}
          >
            03
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: c.navyDark }}>Project Review &amp; Troubleshooting</div>
            <div style={{ fontSize: 18, color: c.textSecondary, marginTop: 4, fontWeight: 500 }}>
              이종 통신 결합 문제 해결 (Non-blocking Tick, RX Queue, E-STOP 복구) · 팀원별 구현 소감
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, backgroundColor: c.purpleLight, color: c.purplePoint, padding: '3px 10px', borderRadius: 6 }}>
                아키텍처 개선
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, backgroundColor: c.surfaceMuted, color: c.textSecondary, padding: '3px 10px', borderRadius: 6 }}>
                예외 처리 최적화
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 우측: 스마트 팩토리 라인 실사 및 스펙 요약 */}
      <div style={{ ...cardBase, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ borderRadius: 12, overflow: 'hidden', height: 320, border: '1px solid #e2e8f0' }}>
          <img
            src={contentsImg}
            alt="Smart Inspection Conveyor Line"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ marginTop: 14, padding: '16px 18px', backgroundColor: c.surfaceMuted, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: c.navyDark, marginBottom: 8 }}>시스템 하드웨어 제원 요약</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 14, color: c.textSecondary }}>
            <div>• <strong>AI Edge:</strong> Jetson Nano 4GB</div>
            <div>• <strong>Broker:</strong> Raspberry Pi 4B</div>
            <div>• <strong>MCU #1:</strong> STM32F411RE (HMI)</div>
            <div>• <strong>MCU #2:</strong> STM32F411RE (Motion)</div>
            <div>• <strong>Vision:</strong> OBSBOT Meet 2</div>
            <div>• <strong>Actuator:</strong> SG90 Servo Diverter</div>
          </div>
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 3: 프로젝트 개요 & 4단계 자동화 파이프라인 (Project Overview)
// ==============================================================================
const Slide3: Page = () => (
  <div style={canvasBase}>
    <Header
      category="01. PROJECT OVERVIEW"
      title="프로젝트 배경 및 4단계 자동화 파이프라인"
      subtitle="STM32 마이크로컨트롤러, 무선 통신(BT/Wi-Fi), Raspberry Pi 브로커, Vision AI를 하나의 유기적인 클로즈드 루프로 통합"
    />

    {/* 4단계 카드 그리드 - 빈 공간 없이 꽉 채움 */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, flex: 1, marginBottom: 16 }}>
      {/* Step 1 */}
      <div
        style={{
          ...cardBase,
          padding: '22px 20px',
          borderTop: `6px solid ${c.bluePoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: c.blueLight,
                color: c.bluePoint,
                fontSize: 20,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: monoFont,
              }}
            >
              1
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.bluePoint, backgroundColor: c.blueLight, padding: '3px 8px', borderRadius: 6 }}>
              TIER 1 PERCEPTION
            </span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, marginBottom: 8 }}>Vision 제품 검사</div>
          <p style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.5, margin: '0 0 14px 0', fontWeight: 500 }}>
            Jetson Nano + YOLOv8로 컨베이어 위 객체 실시간 다중 결함 검출 (정상 큐브 vs 결함 스크래치).
          </p>
        </div>
        <div>
          <div style={{ borderRadius: 10, overflow: 'hidden', height: 160, border: '1px solid #e2e8f0', marginBottom: 12 }}>
            <img src={visionImg} alt="Vision Inspect" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontSize: 13, color: c.bluePoint, backgroundColor: c.blueLight, padding: '6px 10px', borderRadius: 6, fontWeight: 700, textAlign: 'center' }}>
            55% ROI 크롭 &amp; 듀얼 임계값
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div
        style={{
          ...cardBase,
          padding: '22px 20px',
          borderTop: `6px solid ${c.cyanPoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: c.cyanLight,
                color: c.cyanPoint,
                fontSize: 20,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: monoFont,
              }}
            >
              2
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.cyanPoint, backgroundColor: c.cyanLight, padding: '3px 8px', borderRadius: 6 }}>
              TIER 2 BROKER
            </span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, marginBottom: 8 }}>중앙 결과 승인</div>
          <p style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.5, margin: '0 0 14px 0', fontWeight: 500 }}>
            Raspberry Pi 중앙 FSM(<code style={{ color: c.bluePoint }}>T8_CTRL</code>)이 SINGLE 객체 조건 충족 시에만 공식 판정 승인.
          </p>
        </div>
        <div>
          <div style={{ borderRadius: 10, overflow: 'hidden', height: 160, border: '1px solid #e2e8f0', marginBottom: 12 }}>
            <img src={flowImg} alt="Flow Logic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontSize: 13, color: c.cyanPoint, backgroundColor: c.cyanLight, padding: '6px 10px', borderRadius: 6, fontWeight: 700, textAlign: 'center' }}>
            C Socket Broker (:8080) 라우팅
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div
        style={{
          ...cardBase,
          padding: '22px 20px',
          borderTop: `6px solid ${c.emeraldPoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: c.emeraldLight,
                color: c.emeraldPoint,
                fontSize: 20,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: monoFont,
              }}
            >
              3
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.emeraldPoint, backgroundColor: c.emeraldLight, padding: '3px 8px', borderRadius: 6 }}>
              TIER 3 ACTUATION
            </span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, marginBottom: 8 }}>하드웨어 물리 분류</div>
          <p style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.5, margin: '0 0 14px 0', fontWeight: 500 }}>
            STM32 Nucleo #2(Motion)가 서보 트레이를 구동하여 PASS(150°) / FAIL(30°) 방향으로 물리 배출.
          </p>
        </div>
        <div>
          <div style={{ borderRadius: 10, overflow: 'hidden', height: 160, border: '1px solid #e2e8f0', marginBottom: 12 }}>
            <img src={servoImg} alt="Servo Tray" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontSize: 13, color: c.emeraldPoint, backgroundColor: c.emeraldLight, padding: '6px 10px', borderRadius: 6, fontWeight: 700, textAlign: 'center' }}>
            SG90 PWM &amp; Non-blocking 1s Hold
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div
        style={{
          ...cardBase,
          padding: '22px 20px',
          borderTop: `6px solid ${c.amberPoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: c.amberLight,
                color: c.amberPoint,
                fontSize: 20,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: monoFont,
              }}
            >
              4
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.amberPoint, backgroundColor: c.amberLight, padding: '3px 8px', borderRadius: 6 }}>
              DATA &amp; WEB DASHBOARD
            </span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, marginBottom: 8 }}>DB &amp; 실시간 모니터링</div>
          <p style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.5, margin: '0 0 14px 0', fontWeight: 500 }}>
            FastAPI + MariaDB/SQLite로 검사 이력 보관, 실시간 영상 스트리밍 중계, 원격 기기 점유 제어 제공.
          </p>
        </div>
        <div>
          <div style={{ borderRadius: 10, overflow: 'hidden', height: 160, border: '1px solid #e2e8f0', marginBottom: 12 }}>
            <img src={dbImg} alt="DB Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontSize: 13, color: c.amberPoint, backgroundColor: c.amberLight, padding: '6px 10px', borderRadius: 6, fontWeight: 700, textAlign: 'center' }}>
            REST API &amp; MJPEG Stream Proxy
          </div>
        </div>
      </div>
    </div>

    {/* 하단 요약 바 */}
    <div
      style={{
        padding: '14px 24px',
        backgroundColor: c.surfaceMuted,
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 16,
        color: c.textSecondary,
        fontWeight: 600,
      }}
    >
      <span>🎯 <strong>핵심 가치:</strong> 기존 작업자 육안 검사의 피로 오류와 클라우드 AI의 네트워크 지연 시간을 <strong>온디바이스 엣지 분산 구조</strong>로 완전 극복</span>
      <span style={{ color: c.bluePoint, fontWeight: 800 }}>전 과정 실시간 자동 분류 지연시간 &lt; 0.5초</span>
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
      title="전체 시스템 아키텍처 및 노드 토폴로지"
      subtitle="라즈베리파이의 C Socket Broker를 중심으로 각 이종 단말기(STM32 2대, Jetson, Web)가 정형화된 프로토콜로 실시간 연동"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28, flex: 1, marginBottom: 16 }}>
      {/* 좌측: 3D Isometric 시스템 아키텍처 렌더링 & 토폴로지 */}
      <div style={{ ...cardBase, padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark }}>이종 기기 통합 네트워크 토폴로지</div>
          <span style={{ fontSize: 14, fontFamily: monoFont, fontWeight: 700, backgroundColor: c.blueLight, color: c.bluePoint, padding: '4px 12px', borderRadius: 9999 }}>
            TCP Port 8080 Broker
          </span>
        </div>

        {/* 3D 렌더링 이미지 */}
        <div style={{ borderRadius: 12, overflow: 'hidden', height: 260, border: '1px solid #e2e8f0', marginBottom: 14, position: 'relative' }}>
          <img src={edgeImg} alt="Edge Architecture 3D" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 10, left: 10, padding: '4px 12px', backgroundColor: 'rgba(0, 32, 96, 0.85)', color: '#ffffff', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
            Nano Banana 3D Render: 3-Tier Edge System
          </div>
        </div>

        {/* 3-Tier 상세 구조 블록 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: c.blueLight, border: `1px solid ${c.blueBorder}` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.bluePoint }}>TIER 1 (Edge AI)</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>[T8_VISION]</div>
            <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>Jetson Nano (10.10.16.117)</div>
            <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>YOLOv8 &amp; MJPEG :5000</div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.emeraldPoint }}>TIER 2 (Central Broker)</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>[T8_CTRL]</div>
            <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>Raspberry Pi (10.10.16.87)</div>
            <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>iot_server &amp; State Machine</div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.amberPoint }}>TIER 3 (Field Actuation)</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginTop: 2 }}>[T8_HMI / MOTION]</div>
            <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>STM32 Nucleo × 2</div>
            <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>HC-06 BT &amp; ESP-01 Wi-Fi</div>
          </div>
        </div>

        <div style={{ marginTop: 12, padding: '10px 16px', backgroundColor: c.surfaceMuted, borderRadius: 8, fontSize: 14, color: c.textSecondary, display: 'flex', justifyContent: 'space-between', border: '1px solid #e2e8f0' }}>
          <span>💡 <strong>통합 패킷 포맷:</strong> <code style={{ color: c.bluePoint, fontWeight: 800 }}>[TARGET_ID]COMMAND@VALUE\n</code></span>
          <span style={{ fontWeight: 700, color: c.navyDark }}>모든 명령은 T8_CTRL 중앙 승인 필수</span>
        </div>
      </div>

      {/* 우측: 역할 분담 (R&R) 및 통신 사양 상세 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 손준호 카드 */}
        <div style={{ ...cardBase, padding: '20px 24px', borderLeft: `6px solid ${c.bluePoint}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: c.navyDark }}>손준호 담당 영역</div>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.bluePoint, backgroundColor: c.blueLight, padding: '3px 10px', borderRadius: 6 }}>
              HMI · 중앙제어 · Motion
            </span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: c.bluePoint, marginTop: 4 }}>
            임베디드 제어 및 전체 시스템 아키텍처 통합
          </div>
          <ul style={{ margin: '10px 0 0 0', paddingLeft: 20, fontSize: 15, color: c.textSecondary, lineHeight: 1.6, fontWeight: 500 }}>
            <li>STM32 #1 HMI: 버튼 디바운스, LCD 동기화, EXTI E-STOP</li>
            <li>STM32 #2 Motion: 서보 PWM 구동 및 Non-blocking 타이머</li>
            <li>Raspberry Pi: C Socket Broker 및 t8_ctrl 상태 머신</li>
          </ul>
        </div>

        {/* 정승헌 카드 */}
        <div style={{ ...cardBase, padding: '20px 24px', borderLeft: `6px solid ${c.cyanPoint}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: c.navyDark }}>정승헌 담당 영역</div>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.cyanPoint, backgroundColor: c.cyanLight, padding: '3px 10px', borderRadius: 6 }}>
              Vision AI · DB · Web
            </span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: c.cyanPoint, marginTop: 4 }}>
            AI 비전 추론 최적화 및 풀스택 대시보드 구축
          </div>
          <ul style={{ margin: '10px 0 0 0', paddingLeft: 20, fontSize: 15, color: c.textSecondary, lineHeight: 1.6, fontWeight: 500 }}>
            <li>Jetson Nano: YOLOv8 결함 판정 모델 및 55% ROI 크롭 추론</li>
            <li>FastAPI: 실시간 영상 스트리밍 프록시 및 원격 제어</li>
            <li>MariaDB/SQLite: 검사 이력 및 기기 상태 무결성 보장</li>
          </ul>
        </div>

        {/* 통신 사양 요약 표 */}
        <div style={{ ...cardBase, padding: '16px 20px', backgroundColor: c.surfaceMuted }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: c.navyDark, marginBottom: 8 }}>노드별 통신 프로토콜 매트릭스</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, color: c.textSecondary }}>
            <div>• <strong>HMI:</strong> HC-06 BT ➔ bt_bridge (TCP)</div>
            <div>• <strong>Motion:</strong> ESP-01 Wi-Fi (Direct TCP)</div>
            <div>• <strong>Vision:</strong> Jetson Ethernet (TCP Socket)</div>
            <div>• <strong>Web:</strong> FastAPI (TCP Socket + HTTP)</div>
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

    {/* 상단: 5단계 시퀀스 타임라인 */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 20 }}>
      <div style={{ ...cardBase, padding: 16, borderTop: `5px solid #94a3b8` }}>
        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 800, fontFamily: monoFont }}>STAGE 01</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, margin: '4px 0' }}>IDLE</div>
        <div style={{ fontSize: 14, color: c.textSecondary, lineHeight: 1.4 }}>작업 대기 상태<br />MODE 변경 유일 허용</div>
      </div>

      <div style={{ ...cardBase, padding: 16, borderTop: `5px solid ${c.bluePoint}` }}>
        <div style={{ fontSize: 13, color: c.bluePoint, fontWeight: 800, fontFamily: monoFont }}>STAGE 02</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, margin: '4px 0' }}>WORKING</div>
        <div style={{ fontSize: 14, color: c.textSecondary, lineHeight: 1.4 }}>START 버튼 수신<br />카메라 단순 모니터링</div>
      </div>

      <div style={{ ...cardBase, padding: 16, borderTop: `5px solid ${c.cyanPoint}`, backgroundColor: c.blueLight }}>
        <div style={{ fontSize: 13, color: c.bluePoint, fontWeight: 800, fontFamily: monoFont }}>STAGE 03</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, margin: '4px 0' }}>INSPECTING</div>
        <div style={{ fontSize: 14, color: c.navyDark, lineHeight: 1.4, fontWeight: 700 }}>CHECK 버튼 수신<br />공식 품질 판정 착수</div>
      </div>

      <div style={{ ...cardBase, padding: 16, borderTop: `5px solid ${c.purplePoint}` }}>
        <div style={{ fontSize: 13, color: c.purplePoint, fontWeight: 800, fontFamily: monoFont }}>STAGE 04</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, margin: '4px 0' }}>COUNT CHECK</div>
        <div style={{ fontSize: 14, color: c.textSecondary, lineHeight: 1.4 }}>객체 수 엄격 검증<br />0개 / 1개 / 2개 이상</div>
      </div>

      <div style={{ ...cardBase, padding: 16, borderTop: `5px solid ${c.emeraldPoint}` }}>
        <div style={{ fontSize: 13, color: c.emeraldPoint, fontWeight: 800, fontFamily: monoFont }}>STAGE 05</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, margin: '4px 0' }}>SORT &amp; DONE</div>
        <div style={{ fontSize: 14, color: c.textSecondary, lineHeight: 1.4 }}>서보 모터 물리 배출<br />1초 후 HOME 원점 복귀</div>
      </div>
    </div>

    {/* 하단: 객체 수 검사 3대 분기 카드 (NONE / SINGLE / MULTI) */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, flex: 1, marginBottom: 16 }}>
      {/* 0개 NONE */}
      <div
        style={{
          ...cardBase,
          padding: '24px',
          borderLeft: `8px solid ${c.amberPoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.amberPoint, backgroundColor: c.amberLight, padding: '3px 10px', borderRadius: 6 }}>
              OBJECT = 0개 (NONE)
            </span>
            <span style={{ fontSize: 13, color: c.textMuted, fontWeight: 700 }}>예외 안전 처리</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: c.navyDark, margin: '12px 0 8px 0' }}>
            NO ITEM 안내 경고
          </div>
          <p style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            검사 영역에 제품이 안착되지 않았으므로 서보 모터를 구동하지 않고 <strong>WORKING 상태로 안전 복귀</strong>합니다.
          </p>
        </div>
        <div style={{ padding: '12px 16px', backgroundColor: c.amberLight, borderRadius: 10, border: `1px solid ${c.amberBorder}` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: c.amberPoint }}>HMI LCD 표기: [ NO ITEM ]</div>
          <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>불필요한 공정 정지 없이 다음 제품 대기</div>
        </div>
      </div>

      {/* 1개 SINGLE (정상 판정) */}
      <div
        style={{
          ...cardBase,
          padding: '24px',
          borderLeft: `8px solid ${c.emeraldPoint}`,
          border: '2px solid rgba(5, 150, 105, 0.3)',
          boxShadow: '0 12px 30px rgba(5, 150, 105, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.emeraldPoint, backgroundColor: c.emeraldLight, padding: '3px 10px', borderRadius: 6 }}>
              OBJECT = 1개 (SINGLE)
            </span>
            <span style={{ fontSize: 13, color: c.emeraldPoint, fontWeight: 800 }}>정상 승인 경로</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: c.navyDark, margin: '12px 0 8px 0' }}>
            품질 판정 및 자동 SORT
          </div>
          <p style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.6, margin: '0 0 12px 0', fontWeight: 500 }}>
            단일 제품 확정 시 YOLOv8 결함 여부에 따라 양품/불량 분류 트레이를 자동 가동합니다.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ padding: '10px 14px', backgroundColor: c.emeraldLight, borderRadius: 8, fontSize: 14, fontWeight: 700, color: c.emeraldPoint }}>
            ✔ <strong>NORMAL (양품):</strong> [T8_MOTION]SORT@PASS ➔ 서보 150°
          </div>
          <div style={{ padding: '10px 14px', backgroundColor: c.redLight, borderRadius: 8, fontSize: 14, fontWeight: 700, color: c.redPoint }}>
            ✘ <strong>DEFECT (불량):</strong> [T8_MOTION]SORT@FAIL ➔ 서보 30°
          </div>
        </div>
      </div>

      {/* 2개 이상 MULTI */}
      <div
        style={{
          ...cardBase,
          padding: '24px',
          borderLeft: `8px solid ${c.redPoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.redPoint, backgroundColor: c.redLight, padding: '3px 10px', borderRadius: 6 }}>
              OBJECT ≥ 2개 (MULTI)
            </span>
            <span style={{ fontSize: 13, color: c.redPoint, fontWeight: 800 }}>오분류 차단</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: c.navyDark, margin: '12px 0 8px 0' }}>
            ONE ITEM ONLY 경고
          </div>
          <p style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            다중 객체 혼입 시 잘못된 분류를 원천 차단하기 위해 <strong>SORT 명령을 즉시 중단</strong>하고 작업자에게 알립니다.
          </p>
        </div>
        <div style={{ padding: '12px 16px', backgroundColor: c.redLight, borderRadius: 10, border: `1px solid ${c.redBorder}` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: c.redPoint }}>HMI LCD 표기: [ ONE ITEM ONLY ]</div>
          <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>단일 객체로 정돈 후 재검사 유도</div>
        </div>
      </div>
    </div>

    {/* 하단 설명 바 */}
    <div style={{ padding: '12px 20px', backgroundColor: c.blueLight, borderRadius: 10, border: `1px solid ${c.blueBorder}`, fontSize: 15, color: c.navyDark, fontWeight: 600 }}>
      💡 <strong>설계 핵심:</strong> START는 단순 카메라 피드 모니터링만 수행하며, 오직 <strong>CHECK 버튼이 입력되고 SINGLE 조건이 충족될 때만</strong> 물리 모터가 구동됩니다.
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 6: STM32 #1 HMI 현장 제어 인터페이스 (Nano Banana 3D 자산 반영)
// ==============================================================================
const Slide6: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="현장 HMI 조작부 및 중앙 권한 통제 (STM32 #1)"
      subtitle="설계 원칙: HMI는 요청만 송신하고, T8_CTRL이 현재 상태를 검증한 후 승인 패킷을 반환해야 LCD에 반영"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 32, flex: 1, marginBottom: 16 }}>
      {/* 좌측: Nano Banana 3D 렌더링된 HMI 단말기 및 HW 제원 */}
      <div style={{ ...cardBase, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark }}>HMI 콘솔 하드웨어 (3D Render)</div>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.bluePoint, backgroundColor: c.blueLight, padding: '4px 10px', borderRadius: 6 }}>
              HC-06 Bluetooth RFCOMM
            </span>
          </div>

          {/* 3D HMI 제품 렌더 이미지 */}
          <div style={{ borderRadius: 12, overflow: 'hidden', height: 260, border: '1px solid #e2e8f0', marginBottom: 16, position: 'relative' }}>
            <img src={hmiImg} alt="HMI Device 3D Render" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 10, left: 10, padding: '4px 12px', backgroundColor: 'rgba(0, 32, 96, 0.85)', color: '#ffffff', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
              Nano Banana 3D Render: Industrial HMI Unit
            </div>
          </div>

          {/* 하드웨어 부품 4분할 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: c.surfaceMuted, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: c.navyDark }}>START / CHECK / END</div>
              <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>30ms Software Debounce 필터링</div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: c.redLight, border: `1px solid ${c.redBorder}` }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: c.redPoint }}>E-STOP (비상 정지)</div>
              <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>EXTI Falling Edge 즉각 래치</div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: c.surfaceMuted, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: c.navyDark }}>가변저항 (ADC Potentiometer)</div>
              <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>Deadband(50), MANUAL JOG 제어</div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: c.surfaceMuted, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: c.navyDark }}>I2C 16x2 CLCD &amp; RGB LED</div>
              <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>모드/상태 시각화 (녹/황/백/적)</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, padding: '10px 14px', backgroundColor: c.blueLight, borderRadius: 8, fontSize: 14, color: c.navyDark, fontWeight: 600 }}>
          ✓ HMI 부팅 즉시 <code style={{ color: c.bluePoint }}>[T8_CTRL]SYNC</code>를 송신하여 중앙 현재 상태를 100% 동기화
        </div>
      </div>

      {/* 우측: 중앙 권한 통제 원칙 및 패킷 큐 */}
      <div style={{ ...cardBase, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, color: c.navyDark, marginBottom: 10 }}>T8_CTRL 권한 중앙 집중화</div>
          <p style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.6, margin: '0 0 16px 0', fontWeight: 500 }}>
            현장 작업자가 임의로 버튼을 눌러도, 중앙 컨트롤러의 사전 검증 없이는 하드웨어 구동이나 검사 명령이 실행되지 않습니다.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '12px 16px', backgroundColor: c.surfaceMuted, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 800, color: c.navyDark }}>MANUAL 중 START/CHECK 입력</span>
                <span style={{ fontSize: 13, color: c.textMuted, display: 'block' }}>수동 점검 중 생산 명령 혼입 방지</span>
              </div>
              <span style={{ fontSize: 13, color: c.redPoint, fontWeight: 800, backgroundColor: c.redLight, padding: '4px 10px', borderRadius: 6 }}>
                IGNORED (차단)
              </span>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: c.surfaceMuted, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 800, color: c.navyDark }}>E-STOP 중 모드 전환 요청</span>
                <span style={{ fontSize: 13, color: c.textMuted, display: 'block' }}>비상 정지 상태에서 임의 모드 변경 차단</span>
              </div>
              <span style={{ fontSize: 13, color: c.redPoint, fontWeight: 800, backgroundColor: c.redLight, padding: '4px 10px', borderRadius: 6 }}>
                LOCKED (잠금)
              </span>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: c.surfaceMuted, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 800, color: c.navyDark }}>END 버튼 2초 롱프레스 입력</span>
                <span style={{ fontSize: 13, color: c.textMuted, display: 'block' }}>작업자 의도 확인 후 안전 복구</span>
              </div>
              <span style={{ fontSize: 13, color: c.emeraldPoint, fontWeight: 800, backgroundColor: c.emeraldLight, padding: '4px 10px', borderRadius: 6 }}>
                ESTOP_CLEAR
              </span>
            </div>
          </div>
        </div>

        {/* Circular RX Queue 상세 */}
        <div style={{ marginTop: 16, padding: '16px', backgroundColor: c.surfaceMuted, borderRadius: 12, border: '1.5px solid #cbd5e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: c.navyDark }}>Circular RX Queue (8-Entry Ring Buffer)</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: c.bluePoint, backgroundColor: c.blueLight, padding: '2px 8px', borderRadius: 4 }}>
              Zero Packet Loss
            </span>
          </div>
          <p style={{ fontSize: 14, color: c.textSecondary, margin: '6px 0 0 0', lineHeight: 1.5 }}>
            UART 인터럽트 수신 시 <code style={{ color: c.bluePoint }}>\n</code> 단위로 완성된 패킷을 큐에 적재하고, 메인 루프에서 순차 소각하여 연속 수신 패킷 덮어씀 현상을 완벽 차단.
          </p>
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 7: STM32 #2 Motion 서보 트레이 구동 장치 (Hardware Sorter)
// ==============================================================================
const Slide7: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="서보 모터 기반 제품 분류 장치 (STM32 #2 Motion)"
      subtitle="SG90 서보모터 혼(Horn)에 분류 트레이를 직결하여 좌/우 각도 회전으로 PASS / FAIL 기계적 분기 달성"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 32, flex: 1, marginBottom: 16 }}>
      {/* 좌측: 서보 사양 게이지 및 Non-blocking 타이머 로직 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'space-between' }}>
        {/* 각도 3대 게이지 카드 */}
        <div style={{ ...cardBase, padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark }}>하드웨어 PWM 각도 및 펄스 매핑</div>
            <span style={{ fontSize: 13, fontFamily: monoFont, fontWeight: 700, backgroundColor: c.blueLight, color: c.bluePoint, padding: '4px 10px', borderRadius: 6 }}>
              TIM4 CH1 (50 Hz)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {/* FAIL */}
            <div style={{ padding: '16px', backgroundColor: c.redLight, borderRadius: 12, textAlign: 'center', border: `1.5px solid ${c.redBorder}` }}>
              <div style={{ fontSize: 14, color: c.redPoint, fontWeight: 800 }}>FAIL 불량 배출</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: c.redPoint, margin: '4px 0' }}>30°</div>
              <div style={{ fontSize: 13, color: c.textSecondary, fontWeight: 600 }}>펄스폭 ~958 μs</div>
            </div>

            {/* HOME */}
            <div style={{ padding: '16px', backgroundColor: c.surfaceMuted, borderRadius: 12, textAlign: 'center', border: '1.5px solid #cbd5e1' }}>
              <div style={{ fontSize: 14, color: c.navyDark, fontWeight: 800 }}>HOME 대기 원점</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: c.navyDark, margin: '4px 0' }}>90°</div>
              <div style={{ fontSize: 13, color: c.textSecondary, fontWeight: 600 }}>펄스폭 1575 μs</div>
            </div>

            {/* PASS */}
            <div style={{ padding: '16px', backgroundColor: c.emeraldLight, borderRadius: 12, textAlign: 'center', border: `1.5px solid ${c.emeraldBorder}` }}>
              <div style={{ fontSize: 14, color: c.emeraldPoint, fontWeight: 800 }}>PASS 정상 배출</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: c.emeraldPoint, margin: '4px 0' }}>150°</div>
              <div style={{ fontSize: 13, color: c.textSecondary, fontWeight: 600 }}>펄스폭 ~2191 μs</div>
            </div>
          </div>

          <div style={{ fontSize: 14, color: c.textMuted, marginTop: 12, fontWeight: 500 }}>
            * 타이머 파라미터: Period=20,000-1 (20ms), Prescaler=84-1 (1MHz 클록), 서보 가동 범위 실측 650~2500 μs
          </div>
        </div>

        {/* Non-blocking 4단계 분류 시퀀스 */}
        <div style={{ ...cardBase, padding: '22px 24px' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: c.navyDark, marginBottom: 12 }}>
            Non-blocking 자동 분류 시퀀스 (HAL_GetTick)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <div style={{ padding: '12px 10px', borderRadius: 8, backgroundColor: c.blueLight, textAlign: 'center', border: `1px solid ${c.blueBorder}` }}>
              <div style={{ fontSize: 12, color: c.bluePoint, fontWeight: 800 }}>STEP 1</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: c.navyDark, marginTop: 2 }}>분류각 회전</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>30° or 150°</div>
            </div>

            <div style={{ padding: '12px 10px', borderRadius: 8, backgroundColor: c.blueLight, textAlign: 'center', border: `1px solid ${c.blueBorder}` }}>
              <div style={{ fontSize: 12, color: c.bluePoint, fontWeight: 800 }}>STEP 2</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: c.navyDark, marginTop: 2 }}>1초 위치 유지</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>배출 완료 대기</div>
            </div>

            <div style={{ padding: '12px 10px', borderRadius: 8, backgroundColor: c.blueLight, textAlign: 'center', border: `1px solid ${c.blueBorder}` }}>
              <div style={{ fontSize: 12, color: c.bluePoint, fontWeight: 800 }}>STEP 3</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: c.navyDark, marginTop: 2 }}>HOME 복귀</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>90° 수평 정렬</div>
            </div>

            <div style={{ padding: '12px 10px', borderRadius: 8, backgroundColor: c.blueLight, textAlign: 'center', border: `1px solid ${c.blueBorder}` }}>
              <div style={{ fontSize: 12, color: c.bluePoint, fontWeight: 800 }}>STEP 4</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: c.navyDark, marginTop: 2 }}>SORT_DONE</div>
              <div style={{ fontSize: 12, color: c.textMuted }}>중앙 완료 보고</div>
            </div>
          </div>

          <div style={{ fontSize: 14, color: c.emeraldPoint, backgroundColor: c.emeraldLight, padding: '10px 14px', borderRadius: 8, marginTop: 14, fontWeight: 700 }}>
            ✔ <code style={{ color: c.navyDark }}>HAL_GetTick()</code> 기반으로 1초 지연을 처리하여 서보 배출 중에도 ESP-01 Wi-Fi 소켓 및 E-STOP 인터럽트가 멈추지 않고 즉시 응답함
          </div>
        </div>
      </div>

      {/* 우측: 서보 기구물 사진 및 통신 모듈 */}
      <div style={{ ...cardBase, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ borderRadius: 12, overflow: 'hidden', height: 320, border: '1px solid #e2e8f0' }}>
          <img
            src={servoImg}
            alt="Servo Diverter Mechanism"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ marginTop: 14, padding: '16px', backgroundColor: c.surfaceMuted, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: c.navyDark, marginBottom: 6 }}>ESP-01 Wi-Fi 소켓 인터페이스</div>
          <p style={{ fontSize: 14, color: c.textSecondary, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            STM32 UART1을 통해 ESP-01 모듈을 제어하며, Raspberry Pi 브로커(Port 8080)에 직접 TCP 소켓으로 접속하여 최소 지연시간 분류 명령을 수신합니다.
          </p>
        </div>
      </div>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 8: AUTO / MANUAL / E-STOP 3대 운전 모드 (High Visual Density)
// ==============================================================================
const Slide8: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="공정 모드 체계: AUTO · MANUAL · E-STOP"
      subtitle="정상 생산 운전, 장비 유지보수/점검, 비상 안전 잠금을 독립된 상태 머신 규칙으로 엄격히 분리"
    />

    {/* 3대 모드 고밀도 3열 비교 카드 */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, flex: 1, marginBottom: 16 }}>
      {/* AUTO */}
      <div
        style={{
          ...cardBase,
          padding: '26px 24px',
          borderTop: `8px solid ${c.emeraldPoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.emeraldPoint }}>정상 생산 운전</span>
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 9999, backgroundColor: c.emeraldLight, color: c.emeraldPoint, fontWeight: 800 }}>
              PRODUCTION
            </span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: c.navyDark, marginBottom: 8 }}>AUTO 모드</div>
          <p style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.5, marginBottom: 20, fontWeight: 500 }}>
            센서 및 비전 검사 결과에 따라 자동으로 트레이가 구동되는 표준 양산 모드
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.navyDark }}>
              ✔ CHECK 버튼 후 공식 검사 착수
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.navyDark }}>
              ✔ 유효 판정 시 자동 서보 분류 (PASS/FAIL)
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.textMuted }}>
              ✘ 가변저항 수동 JOG 차단 (안전 잠금)
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.navyDark }}>
              ✔ IDLE 상태에서만 타 모드 전환 허용
            </div>
          </div>
        </div>

        <div style={{ padding: '12px', borderRadius: 10, backgroundColor: c.emeraldLight, border: `1px solid ${c.emeraldBorder}`, fontSize: 14, color: c.emeraldPoint, fontWeight: 800, textAlign: 'center' }}>
          실시간 불량 선별 자동화 가동
        </div>
      </div>

      {/* MANUAL */}
      <div
        style={{
          ...cardBase,
          padding: '26px 24px',
          borderTop: `8px solid ${c.amberPoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.amberPoint }}>유지보수 및 캘리브레이션</span>
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 9999, backgroundColor: c.amberLight, color: c.amberPoint, fontWeight: 800 }}>
              MAINTENANCE
            </span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: c.navyDark, marginBottom: 8 }}>MANUAL 모드</div>
          <p style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.5, marginBottom: 20, fontWeight: 500 }}>
            엔지니어가 서보 트레이 각도를 가변저항으로 수동 조정하며 영점 및 기구 점검
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.navyDark }}>
              ✔ Vision 카메라는 단순 모니터링만 동작
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.textMuted }}>
              ✘ START / CHECK / END 생산 명령 차단
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.navyDark }}>
              ✔ 가변저항 JOG로 서보 0~180° 실시간 제어
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.navyDark }}>
              ✔ 웹 대시보드 슬라이더와 양방향 동기화
            </div>
          </div>
        </div>

        <div style={{ padding: '12px', borderRadius: 10, backgroundColor: c.amberLight, border: `1px solid ${c.amberBorder}`, fontSize: 14, color: c.amberPoint, fontWeight: 800, textAlign: 'center' }}>
          수동 각도 점검 및 영점 조절
        </div>
      </div>

      {/* E-STOP */}
      <div
        style={{
          ...cardBase,
          padding: '26px 24px',
          borderTop: `8px solid ${c.redPoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.redPoint }}>비상 정지 우선 잠금</span>
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 9999, backgroundColor: c.redLight, color: c.redPoint, fontWeight: 800 }}>
              SAFETY INTERLOCK
            </span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: c.navyDark, marginBottom: 8 }}>E-STOP 모드</div>
          <p style={{ fontSize: 16, color: c.textSecondary, lineHeight: 1.5, marginBottom: 20, fontWeight: 500 }}>
            위험 상황 발생 시 하드웨어 EXTI 인터럽트로 즉시 가동 중단 및 모든 구동 래치
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.navyDark }}>
              ✔ 모든 구동 즉시 중단 (Sort 동작 즉각 취소)
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.textMuted }}>
              ✘ 모든 조작 버튼 및 가변저항 JOG 완전 잠금
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.navyDark }}>
              ✔ 카메라는 현장 확인용 영상 유지 (Safety Slate)
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.surfaceMuted, fontSize: 15, fontWeight: 600, color: c.navyDark }}>
              ✔ END 버튼 2초 롱프레스 시에만 잠금 해제
            </div>
          </div>
        </div>

        <div style={{ padding: '12px', borderRadius: 10, backgroundColor: c.redLight, border: `1px solid ${c.redBorder}`, fontSize: 14, color: c.redPoint, fontWeight: 800, textAlign: 'center' }}>
          * 해제 시 자동 재가동 방지 (IDLE 복귀)
        </div>
      </div>
    </div>

    {/* 하단 인터락 상태 전이 규칙 */}
    <div style={{ padding: '12px 24px', backgroundColor: c.surfaceMuted, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 15, color: c.navyDark, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
      <span>🔒 <strong>모드 전환 인터락:</strong> 오직 <code style={{ color: c.bluePoint }}>IDLE</code> 상태에서만 모드 전환 허용</span>
      <span>🚨 <strong>비상 정지 특권:</strong> 어떤 상태에서든 EXTI 감지 즉시 최우선 E-STOP 강제 전이</span>
    </div>

    <SlideFooter />
  </div>
);

// ==============================================================================
// Slide 9: Jetson Nano 고정밀 AI Vision 검사 파이프라인 (Nano Banana 3D 자산 반영)
// ==============================================================================
const Slide9: Page = () => (
  <div style={canvasBase}>
    <Header
      category="02. PROJECT STRUCTURE"
      title="Jetson Nano: YOLOv8 고정밀 ROI 크롭 추론"
      subtitle="중앙 55% ROI 영역 크롭(Crop) 후 416x416 입력으로 큐브 해상도 손실 제거 및 초고속 결함 판정"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32, flex: 1, marginBottom: 16 }}>
      {/* 좌측: Nano Banana 머신비전 HUD 이미지 & 듀얼 임계값 사양 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'space-between' }}>
        {/* 머신비전 HUD 이미지 카드 */}
        <div style={{ ...cardBase, padding: 14, border: '2px solid rgba(10, 76, 185, 0.2)' }}>
          <div style={{ borderRadius: 12, overflow: 'hidden', height: 260, position: 'relative' }}>
            <img src={yoloImg} alt="Machine Vision YOLO Detection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 10, left: 10, padding: '4px 12px', backgroundColor: 'rgba(0, 32, 96, 0.85)', color: '#ffffff', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
              Nano Banana 3D Render: Real-Time Machine Vision HUD
            </div>
          </div>
        </div>

        {/* 듀얼 임계값 메트릭 카드 */}
        <div style={{ ...cardBase, padding: '20px 24px' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: c.navyDark, marginBottom: 12 }}>
            엄격한 2단계 판정 임계값 (Dual-Threshold)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ padding: '16px', backgroundColor: c.emeraldLight, borderRadius: 12, border: `1.5px solid ${c.emeraldBorder}` }}>
              <div style={{ fontSize: 14, color: c.emeraldPoint, fontWeight: 800 }}>정상 큐브 검출 확신도</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: c.emeraldPoint, margin: '4px 0' }}>≥ 65%</div>
              <div style={{ fontSize: 13, color: c.textSecondary, fontWeight: 500 }}>BOX_CONF: 큐브 본체 안착 확정</div>
            </div>

            <div style={{ padding: '16px', backgroundColor: c.redLight, borderRadius: 12, border: `1.5px solid ${c.redBorder}` }}>
              <div style={{ fontSize: 14, color: c.redPoint, fontWeight: 800 }}>결함/스크래치 감지 기준</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: c.redPoint, margin: '4px 0' }}>≥ 35%</div>
              <div style={{ fontSize: 13, color: c.textSecondary, fontWeight: 500 }}>DEFECT_CONF: 미세 흠집 민감 감지</div>
            </div>
          </div>
        </div>

        {/* 노이즈 필터링 규칙 */}
        <div style={{ padding: '12px 18px', backgroundColor: c.surfaceMuted, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, color: c.textSecondary, lineHeight: 1.5 }}>
          • <strong>바닥판 필터:</strong> ROI 면적 85% 이상 차지하는 받침판은 <code style={{ color: c.amberPoint }}>[PLATE/IGNORE]</code>로 자동 배제<br />
          • <strong>연속성 검증:</strong> 연속 3프레임(<code style={{ color: c.bluePoint }}>detect_streak &gt;= 3</code>) 이상 검출 시에만 최종 유효 판정
        </div>
      </div>

      {/* 우측: 파이썬 AI 클라이언트 코드 블록 및 런타임 제원 */}
      <div style={{ ...cardBase, padding: '22px', backgroundColor: '#0b192c', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #1e3a5f' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 15, color: '#38bdf8', fontWeight: 800, fontFamily: monoFont }}>camera_ai_client.py</span>
            <span style={{ fontSize: 13, color: '#34d399', fontFamily: monoFont, fontWeight: 700 }}>30 FPS @ 720p</span>
          </div>

          <pre
            style={{
              margin: 0,
              padding: 16,
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: 10,
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: monoFont,
              color: '#f1f5f9',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
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

        <div style={{ marginTop: 14 }}>
          <div style={{ padding: '14px', borderRadius: 10, backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: 14, color: '#e0f2fe' }}>
            <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: 4 }}>MJPEG 스트리밍 서버 내장 (Port 5000)</div>
            웹 브라우저 및 FastAPI 대시보드로 제로 레이턴시 실시간 비전 피드를 제공하여 작업자 원격 육안 검사를 동시 지원합니다.
          </div>
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

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, flex: 1, marginBottom: 16 }}>
      {/* 좌측: 데이터베이스 스키마 및 무결성 원칙 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'space-between' }}>
        <div style={{ ...cardBase, padding: '24px' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, marginBottom: 14 }}>
            검사 이력 데이터베이스 스키마 (MariaDB / SQLite)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '14px', borderRadius: 10, backgroundColor: c.blueLight, border: `1px solid ${c.blueBorder}` }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.bluePoint }}>inspection_logs (완제품 품질 검사 이력)</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 4, fontFamily: monoFont }}>
                device_id, model_id, result (PASS/FAIL), confidence, inspected_at
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: 10, backgroundColor: c.emeraldLight, border: `1px solid ${c.emeraldBorder}` }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.emeraldPoint }}>devices &amp; ai_models (스마트 팩토리 기기)</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 4, fontFamily: monoFont }}>
                Jetson IP(10.10.16.117), 점유 상태, 모델 가중치(best.pt), 버전
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: 10, backgroundColor: c.amberLight, border: `1px solid ${c.amberBorder}` }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.amberPoint }}>users (작업자 권한 및 보안)</div>
              <div style={{ fontSize: 14, color: c.textSecondary, marginTop: 4, fontFamily: monoFont }}>
                username, SHA-256 password_hash, role (admin / operator)
              </div>
            </div>
          </div>
        </div>

        {/* 데이터 무결성 원칙 */}
        <div style={{ ...cardBase, padding: '20px 24px', backgroundColor: c.surfaceMuted }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: c.navyDark, marginBottom: 6 }}>데이터 무결성 원칙 (Data Integrity)</div>
          <p style={{ fontSize: 15, color: c.textSecondary, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
            NONE, MULTI 또는 MANUAL 단순 모니터링 도중 감지된 임시 영상 피드는 <strong>공식 완제품 검사 이력(PASS/FAIL)에 일체 섞이지 않도록</strong> 엄격히 분리 차단합니다.
          </p>
        </div>
      </div>

      {/* 우측: FastAPI 실시간 대시보드 화면 및 4대 기능 */}
      <div style={{ ...cardBase, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark }}>실시간 웹 대시보드 (FastAPI :8000)</div>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.bluePoint, backgroundColor: c.blueLight, padding: '4px 10px', borderRadius: 6 }}>
              반응형 모니터링
            </span>
          </div>

          {/* 4대 기능 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: c.surfaceMuted, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 13, color: c.bluePoint, fontWeight: 800 }}>LIVE STREAM PROXY</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.navyDark, marginTop: 2 }}>/video_feed</div>
              <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>Jetson 스트림 실시간 릴레이</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: c.surfaceMuted, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 13, color: c.emeraldPoint, fontWeight: 800 }}>NODE HEALTH CHECK</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.navyDark, marginTop: 2 }}>4개 노드 실시간 감시</div>
              <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>T8_CTRL, HMI, MOTION, VISION</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: c.surfaceMuted, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 13, color: c.amberPoint, fontWeight: 800 }}>REMOTE CLAIM LOCK</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.navyDark, marginTop: 2 }}>점유 권한 획득제</div>
              <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>단일 웹 사용자 점유 제어</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: c.surfaceMuted, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 13, color: c.redPoint, fontWeight: 800 }}>EMERGENCY OVERRIDE</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.navyDark, marginTop: 2 }}>웹 비상 정지 버튼</div>
              <div style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>원격지 긴급 공정 E-STOP</div>
            </div>
          </div>
        </div>

        {/* 대시보드 캡처 이미지 */}
        <div style={{ borderRadius: 10, overflow: 'hidden', height: 180, border: '1px solid #e2e8f0' }}>
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

    {/* 3대 트러블슈팅 상세 비교 카드 */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, flex: 1, marginBottom: 16 }}>
      {/* Problem 1 */}
      <div
        style={{
          ...cardBase,
          padding: '24px',
          borderTop: `6px solid ${c.redPoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.redPoint, backgroundColor: c.redLight, padding: '3px 8px', borderRadius: 4 }}>
              ISSUE 01
            </span>
            <span style={{ fontSize: 13, color: c.textMuted, fontWeight: 700 }}>MCU 루프 블로킹</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, marginBottom: 12 }}>
            HAL_Delay() 메인 루프 블로킹
          </div>
          <div style={{ padding: '12px', borderRadius: 8, backgroundColor: c.redLight, border: `1px solid ${c.redBorder}`, fontSize: 14, color: c.redPoint, marginBottom: 16, lineHeight: 1.5, fontWeight: 600 }}>
            서보 모터 1초 유지 동안 <code style={{ color: c.navyDark }}>HAL_Delay(1000)</code> 호출로 Wi-Fi 소켓 및 센서 루프 전체 정지 발생
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, color: c.emeraldPoint, marginBottom: 6 }}>
            해결 ➔ Non-blocking Tick 전환
          </div>
          <p style={{ fontSize: 15, color: c.textSecondary, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            <code style={{ color: c.bluePoint, fontWeight: 700 }}>HAL_GetTick()</code> 기반으로 타임스탬프만 비교하고 루프는 계속 회전하여 서보 동작 중에도 통신/비상정지 완벽 수용.
          </p>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.emeraldLight, fontSize: 14, color: c.emeraldPoint, fontWeight: 800, textAlign: 'center' }}>
          실시간 시스템 반응성 100% 확보
        </div>
      </div>

      {/* Problem 2 */}
      <div
        style={{
          ...cardBase,
          padding: '24px',
          borderTop: `6px solid ${c.amberPoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.amberPoint, backgroundColor: c.amberLight, padding: '3px 8px', borderRadius: 4 }}>
              ISSUE 02
            </span>
            <span style={{ fontSize: 13, color: c.textMuted, fontWeight: 700 }}>버퍼 덮어씀 현상</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, marginBottom: 12 }}>
            UART 연속 패킷 버퍼 유실
          </div>
          <div style={{ padding: '12px', borderRadius: 8, backgroundColor: c.amberLight, border: `1px solid ${c.amberBorder}`, fontSize: 14, color: c.amberPoint, marginBottom: 16, lineHeight: 1.5, fontWeight: 600 }}>
            단일 RX 버퍼 사용 시 <code style={{ color: c.navyDark }}>STATE@READY</code>와 <code style={{ color: c.navyDark }}>MODE@AUTO</code>가 연속 수신되면 이전 패킷이 유실됨
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, color: c.emeraldPoint, marginBottom: 6 }}>
            해결 ➔ Circular RX Queue 구축
          </div>
          <p style={{ fontSize: 15, color: c.textSecondary, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            인터럽트에서 <code style={{ color: c.bluePoint, fontWeight: 700 }}>\n</code> 감지 시 완성된 문자열을 8단계 링 버퍼 큐에 적재하고, 메인 루프에서 순차 파싱 처리.
          </p>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.emeraldLight, fontSize: 14, color: c.emeraldPoint, fontWeight: 800, textAlign: 'center' }}>
          연속 패킷 유실률 0% 달성
        </div>
      </div>

      {/* Problem 3 */}
      <div
        style={{
          ...cardBase,
          padding: '24px',
          borderTop: `6px solid ${c.bluePoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.bluePoint, backgroundColor: c.blueLight, padding: '3px 8px', borderRadius: 4 }}>
              ISSUE 03
            </span>
            <span style={{ fontSize: 13, color: c.textMuted, fontWeight: 700 }}>FSM 상태 고착</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: c.navyDark, marginBottom: 12 }}>
            E-STOP 복구 FSM 무한 대기
          </div>
          <div style={{ padding: '12px', borderRadius: 8, backgroundColor: c.blueLight, border: `1px solid ${c.blueBorder}`, fontSize: 14, color: c.bluePoint, marginBottom: 16, lineHeight: 1.5, fontWeight: 600 }}>
            복구 조건이 지나치게 복잡하여 <code style={{ color: c.navyDark }}>RETURN HOME</code> 상태에서 시스템이 풀리지 않고 고착되는 현상
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, color: c.emeraldPoint, marginBottom: 6 }}>
            해결 ➔ CLEAR 구조 단순화
          </div>
          <p style={{ fontSize: 15, color: c.textSecondary, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            복잡한 중간 Recovery 상태를 과감히 제거하고, END 2초 롱프레스 시 즉시 래치를 해제하며 관리자 안전 수동 재시작 유도.
          </p>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: c.emeraldLight, fontSize: 14, color: c.emeraldPoint, fontWeight: 800, textAlign: 'center' }}>
          안전 기준 부합 및 고착 완벽 해소
        </div>
      </div>
    </div>

    {/* 하단 총평 바 */}
    <div style={{ padding: '12px 20px', backgroundColor: c.surfaceMuted, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 15, color: c.navyDark, fontWeight: 600 }}>
      💡 <strong>트러블슈팅 교훈:</strong> 단순 땜질식 코드 수정이 아닌, <strong>상태 머신 규칙 단순화와 넌블로킹 큐 기반 아키텍처</strong>로 시스템 안정성을 근본적으로 확보함
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
      title="팀원별 구현 소감 및 Q&amp;A"
      subtitle="수업 실습 기능을 실제 산업 현장의 요구 동작에 맞게 재구성하며 체득한 핵심 엔지니어링 역량"
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, flex: 1, marginBottom: 16 }}>
      {/* 손준호 카드 */}
      <div
        style={{
          ...cardBase,
          padding: '28px 30px',
          borderLeft: `8px solid ${c.bluePoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: c.blueLight,
                color: c.bluePoint,
                fontSize: 26,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              👨‍💻
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: c.navyDark }}>손준호</div>
              <div style={{ fontSize: 15, color: c.bluePoint, fontWeight: 700 }}>
                HMI · 중앙제어 · Motion · 전체 시스템 통합
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '14px 16px', backgroundColor: c.surfaceMuted, borderRadius: 10, fontSize: 16, color: c.textSecondary, lineHeight: 1.5, fontWeight: 500, border: '1px solid #e2e8f0' }}>
              ✔ 수업에서 배운 단일 기능들을 유기적인 분산 시스템(BT/Wi-Fi/Socket)으로 통합 연결
            </div>
            <div style={{ padding: '14px 16px', backgroundColor: c.surfaceMuted, borderRadius: 10, fontSize: 16, color: c.textSecondary, lineHeight: 1.5, fontWeight: 500, border: '1px solid #e2e8f0' }}>
              ✔ E-STOP과 상태 머신 예외 처리의 복잡성을 해결하며 신뢰도 높은 아키텍처 설계 체득
            </div>
            <div style={{ padding: '14px 16px', backgroundColor: c.surfaceMuted, borderRadius: 10, fontSize: 16, color: c.textSecondary, lineHeight: 1.5, fontWeight: 500, border: '1px solid #e2e8f0' }}>
              ✔ 단순 코드 작성보다 "전체 흐름과 예외 상황을 먼저 정의하는 시스템 설계"의 중요성 체감
            </div>
          </div>
        </div>

        <div style={{ fontSize: 14, color: c.bluePoint, fontWeight: 700, backgroundColor: c.blueLight, padding: '8px 14px', borderRadius: 8, textAlign: 'center' }}>
          수업 실습 응용 ➔ 이종 통신 통합 ➔ 비상 예외 안전 설계 완성
        </div>
      </div>

      {/* 정승헌 카드 */}
      <div
        style={{
          ...cardBase,
          padding: '28px 30px',
          borderLeft: `8px solid ${c.cyanPoint}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: c.cyanLight,
                color: c.cyanPoint,
                fontSize: 26,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🧠
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: c.navyDark }}>정승헌</div>
              <div style={{ fontSize: 15, color: c.cyanPoint, fontWeight: 700 }}>
                Camera · Vision AI · DB · Web Dashboard
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '14px 16px', backgroundColor: c.surfaceMuted, borderRadius: 10, fontSize: 16, color: c.textSecondary, lineHeight: 1.5, fontWeight: 500, border: '1px solid #e2e8f0' }}>
              ✔ 경량 딥러닝(YOLOv8) 모델을 Jetson 임베디드 환경에서 30 FPS로 안정 구동
            </div>
            <div style={{ padding: '14px 16px', backgroundColor: c.surfaceMuted, borderRadius: 10, fontSize: 16, color: c.textSecondary, lineHeight: 1.5, fontWeight: 500, border: '1px solid #e2e8f0' }}>
              ✔ ROI 크롭과 다중 임계값으로 산업 현장 바닥판 노이즈와 미세 결함을 완벽 분리
            </div>
            <div style={{ padding: '14px 16px', backgroundColor: c.surfaceMuted, borderRadius: 10, fontSize: 16, color: c.textSecondary, lineHeight: 1.5, fontWeight: 500, border: '1px solid #e2e8f0' }}>
              ✔ FastAPI와 MariaDB로 실시간 영상 스트리밍과 검사 이력 관리를 동시에 실현
            </div>
          </div>
        </div>

        <div style={{ fontSize: 14, color: c.cyanPoint, fontWeight: 700, backgroundColor: c.cyanLight, padding: '8px 14px', borderRadius: 8, textAlign: 'center' }}>
          Edge AI 모델 최적화 ➔ 웹 모니터링 ➔ 품질 데이터 무결성 보장
        </div>
      </div>
    </div>

    {/* 하단 Q&A 콜아웃 배너 */}
    <div
      style={{
        ...cardBase,
        padding: '20px 32px',
        border: `2px solid ${c.bluePoint}`,
        backgroundColor: c.blueLight,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <div style={{ fontSize: 26, fontWeight: 900, color: c.navyDark }}>경청해 주셔서 대단히 감사합니다.</div>
        <div style={{ fontSize: 16, color: c.textSecondary, marginTop: 4, fontWeight: 600 }}>
          질문이 있으시면 성심성의껏 답변드리겠습니다.
        </div>
      </div>
      <div
        style={{
          padding: '12px 28px',
          borderRadius: 10,
          backgroundColor: c.navyDark,
          color: '#ffffff',
          fontWeight: 900,
          fontSize: 22,
          fontFamily: monoFont,
          boxShadow: '0 6px 18px rgba(0, 32, 96, 0.2)',
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
// 3. 메타데이터 및 발표자 발표 스크립트 (Speaker Notes)
// ==============================================================================
export const meta: SlideMeta = {
  title: 'IoT Vision 기반 자동 품질 검사·분류 시스템',
  createdAt: '2026-10-12T01:55:00.000Z',
};

export const notes: (string | undefined)[] = [
  // Slide 1
  `안녕하십니까. 온디바이스 AI SW 개발 과정 8조, 손준호, 정승헌입니다.
저희가 개발한 'IoT Vision 기반 자동 품질 검사·분류 스마트 팩토리 시스템' 최종 발표를 시작하겠습니다.
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
