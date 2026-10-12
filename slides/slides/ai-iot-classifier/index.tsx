import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

// ==============================================================================
// 1. Design System & Theme Configuration
// ==============================================================================
export const design: DesignSystem = {
  palette: {
    bg: '#080d1a',
    text: '#f1f5f9',
    accent: '#38bdf8',
  },
  fonts: {
    display: '"Geist Variable", Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"Geist Variable", Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 130, body: 28 },
  radius: 16,
};

const c = {
  bg: '#080d1a',
  surface: '#0f172a',
  card: '#131e36',
  cardHover: '#182747',
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.14)',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  accent: '#38bdf8',
  accentGlow: 'rgba(56, 189, 248, 0.15)',
  emerald: '#10b981',
  emeraldGlow: 'rgba(16, 185, 129, 0.15)',
  amber: '#f59e0b',
  rose: '#f43f5e',
  roseGlow: 'rgba(244, 63, 94, 0.15)',
  purple: '#a855f7',
  indigo: '#6366f1',
};

const fontMono = '"Geist Mono", "JetBrains Mono", Consolas, monospace';

// Common Canvas & Layout Containers
const canvasBase: CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: c.bg,
  color: c.text,
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  padding: '80px 100px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

// Reusable UI Components
const Header = ({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle: string;
}) => (
  <div style={{ marginBottom: 36 }}>
    {badge && (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 16px',
          borderRadius: 9999,
          backgroundColor: c.accentGlow,
          border: `1px solid ${c.accent}`,
          color: c.accent,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c.accent }} />
        {badge}
      </div>
    )}
    <h1
      style={{
        fontSize: 54,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        margin: 0,
        lineHeight: 1.15,
        color: c.text,
      }}
    >
      {title}
    </h1>
    <p
      style={{
        fontSize: 24,
        color: c.textMuted,
        margin: '10px 0 0 0',
        lineHeight: 1.4,
        maxWidth: 1400,
      }}
    >
      {subtitle}
    </p>
  </div>
);

const Card = ({
  children,
  style,
  glowColor,
}: {
  children: ReactNode;
  style?: CSSProperties;
  glowColor?: string;
}) => (
  <div
    style={{
      backgroundColor: c.card,
      borderRadius: 18,
      border: `1px solid ${glowColor || c.border}`,
      padding: '30px 34px',
      boxShadow: glowColor
        ? `0 12px 30px -10px ${glowColor}`
        : '0 10px 30px -12px rgba(0, 0, 0, 0.5)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    {children}
  </div>
);

const Footer = ({ current, total }: { current: number; total: number }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `1px solid ${c.border}`,
      paddingTop: 18,
      fontSize: 16,
      color: c.textDim,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <span style={{ color: c.textMuted, fontWeight: 600 }}>AI IoT Smart Factory</span>
      <span>•</span>
      <span>Raspberry Pi & Jetson Nano & STM32 Nucleo</span>
      <span>•</span>
      <span style={{ fontFamily: fontMono, color: c.accent }}>github.com/Lucas-SJeong</span>
    </div>
    <div style={{ fontWeight: 600, fontFamily: fontMono, color: c.textMuted }}>
      {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </div>
  </div>
);

// ==============================================================================
// Slide 1: Cover Page
// ==============================================================================
const Slide1Cover: Page = () => {
  return (
    <div
      style={{
        ...canvasBase,
        padding: '90px 110px',
        justifyContent: 'space-between',
        background: `radial-gradient(circle at 85% 20%, rgba(56, 189, 248, 0.12) 0%, transparent 50%),
                     radial-gradient(circle at 15% 85%, rgba(99, 102, 241, 0.10) 0%, transparent 50%),
                     ${c.bg}`,
      }}
    >
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 20px',
            borderRadius: 9999,
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: `1px solid rgba(56, 189, 248, 0.3)`,
            color: c.accent,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.06em',
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c.accent }} />
          SMART FACTORY AUTOMATION & EDGE AI
        </div>
        <div style={{ fontFamily: fontMono, fontSize: 18, color: c.textMuted }}>
          REPOSITORY: <span style={{ color: c.text }}>AI_IOT_OBJECT_CLASSIFIER</span>
        </div>
      </div>

      {/* Main Title Hero */}
      <div style={{ margin: '30px 0' }}>
        <h1
          style={{
            fontSize: 82,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            margin: '0 0 24px 0',
            color: c.text,
          }}
        >
          Edge AI Object Classifier <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            & Automated Sorting System
          </span>
        </h1>
        <p style={{ fontSize: 28, color: c.textMuted, maxWidth: 1350, lineHeight: 1.5, margin: 0 }}>
          A distributed cyber-physical architecture integrating <strong>Jetson Nano</strong> for real-time
          YOLOv8 defect inference, <strong>Raspberry Pi</strong> for high-throughput socket routing,
          and <strong>STM32 Nucleo</strong> for deterministic conveyor actuation.
        </p>
      </div>

      {/* Hardware Node Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
        <Card style={{ padding: '22px 26px', border: `1px solid rgba(56, 189, 248, 0.3)` }}>
          <div style={{ fontSize: 15, color: c.accent, fontWeight: 700, letterSpacing: '0.05em' }}>
            EDGE PERCEPTION
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>Jetson Nano</div>
          <div style={{ fontSize: 16, color: c.textMuted, marginTop: 4 }}>
            YOLOv8 Multi-Defect AI + MJPEG Streaming
          </div>
        </Card>

        <Card style={{ padding: '22px 26px', border: `1px solid rgba(168, 85, 247, 0.3)` }}>
          <div style={{ fontSize: 15, color: c.purple, fontWeight: 700, letterSpacing: '0.05em' }}>
            ORCHESTRATION & BROKER
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>Raspberry Pi</div>
          <div style={{ fontSize: 16, color: c.textMuted, marginTop: 4 }}>
            Multi-threaded TCP Broker & State Machine
          </div>
        </Card>

        <Card style={{ padding: '22px 26px', border: `1px solid rgba(16, 185, 129, 0.3)` }}>
          <div style={{ fontSize: 15, color: c.emerald, fontWeight: 700, letterSpacing: '0.05em' }}>
            PHYSICAL ACTUATION
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>STM32 Nucleo</div>
          <div style={{ fontSize: 16, color: c.textMuted, marginTop: 4 }}>
            Motor Driver, Sensor Sync & Servo Sorter
          </div>
        </Card>

        <Card style={{ padding: '22px 26px', border: `1px solid rgba(245, 158, 11, 0.3)` }}>
          <div style={{ fontSize: 15, color: c.amber, fontWeight: 700, letterSpacing: '0.05em' }}>
            OPERATOR DASHBOARD
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>FastAPI Web UI</div>
          <div style={{ fontSize: 16, color: c.textMuted, marginTop: 4 }}>
            Real-Time Telemetry & RBAC Security
          </div>
        </Card>
      </div>

      <Footer current={1} total={8} />
    </div>
  );
};

// ==============================================================================
// Slide 2: Problem Statement & System Objectives
// ==============================================================================
const Slide2Overview: Page = () => {
  return (
    <div style={canvasBase}>
      <Header
        badge="SYSTEM VALUE & CHALLENGE"
        title="Industrial Defect Detection & Sorting Challenges"
        subtitle="Bridging the gap between millisecond physical conveyor speeds and high-accuracy deep learning inference."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, flex: 1, marginBottom: 24 }}>
        <Card style={{ borderColor: 'rgba(244, 63, 94, 0.3)', backgroundColor: '#131828' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: c.roseGlow,
                color: c.rose,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 900,
              }}
            >
              ✕
            </span>
            <h3 style={{ fontSize: 28, margin: 0, fontWeight: 800, color: c.rose }}>
              Traditional Factory Bottlenecks
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              {
                title: 'Manual Visual Inspection',
                desc: 'Slow, prone to operator fatigue, and unable to keep pace with modern high-speed conveyor belts.',
              },
              {
                title: 'Cloud Latency & Privacy Risks',
                desc: 'Streaming high-resolution camera feeds to cloud servers introduces unacceptable latency (>300ms) and bandwidth costs.',
              },
              {
                title: 'Tightly Coupled Monoliths',
                desc: 'Combining vision algorithms and motor control into one hardware board leads to lockups and non-deterministic timing.',
              },
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '14px 18px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: c.text }}>{item.title}</div>
                <div style={{ fontSize: 16, color: c.textMuted, marginTop: 4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ borderColor: 'rgba(16, 185, 129, 0.3)', backgroundColor: '#0f202a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: c.emeraldGlow,
                color: c.emerald,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 900,
              }}
            >
              ✓
            </span>
            <h3 style={{ fontSize: 28, margin: 0, fontWeight: 800, color: c.emerald }}>
              Our Edge AI-Driven Solution
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              {
                title: 'Local Edge Inference (<35ms)',
                desc: 'Jetson Nano runs an optimized YOLOv8 model locally at 30 FPS, judging defect status before the object reaches the sorting arm.',
              },
              {
                title: 'Microsecond TCP Socket Routing',
                desc: 'Raspberry Pi runs a lightweight C broker coordinating vision, state control, and motor nodes with non-blocking sockets.',
              },
              {
                title: 'Decoupled Deterministic Actuation',
                desc: 'STM32 Nucleo hardware dedicated exclusively to physical sensors, timing gates, and diverter servo actuation.',
              },
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '14px 18px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: c.text }}>{item.title}</div>
                <div style={{ fontSize: 16, color: c.textMuted, marginTop: 4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Footer current={2} total={8} />
    </div>
  );
};

// ==============================================================================
// Slide 3: Three-Tier System Architecture
// ==============================================================================
const Slide3Architecture: Page = () => {
  return (
    <div style={canvasBase}>
      <Header
        badge="DISTRIBUTED HARDWARE ARCHITECTURE"
        title="Three-Tier Edge & Controller Topology"
        subtitle="Decoupled physical layers ensuring sub-millisecond reaction times and high modularity."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26, flex: 1, marginBottom: 24 }}>
        {/* Tier 1: Jetson Nano */}
        <Card style={{ borderTop: `4px solid ${c.accent}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.accent, letterSpacing: '0.05em' }}>
              TIER 1 • PERCEPTION
            </span>
            <span style={{ fontFamily: fontMono, fontSize: 14, color: c.textDim }}>10.10.16.117</span>
          </div>
          <h2 style={{ fontSize: 32, margin: '0 0 10px 0', fontWeight: 800 }}>Jetson Nano</h2>
          <div style={{ fontSize: 16, color: c.textMuted, marginBottom: 20 }}>
            Dedicated deep learning computer running PyTorch / Ultralytics on CUDA cores.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.accent }}>OBSBOT Meet 2 (USB)</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>1280x720 V4L2 capture (/dev/video1)</div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.emerald }}>YOLOv8 Engine (best.pt)</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>Normal Cube vs Defect Detection</div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.indigo }}>Stream Server (:5000)</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>MJPEG HTTP stream for web dashboard</div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.text }}>Node Tag: [T8_VISION]</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>TCP client sending classification tokens</div>
            </div>
          </div>
        </Card>

        {/* Tier 2: Raspberry Pi */}
        <Card style={{ borderTop: `4px solid ${c.purple}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.purple, letterSpacing: '0.05em' }}>
              TIER 2 • ORCHESTRATION
            </span>
            <span style={{ fontFamily: fontMono, fontSize: 14, color: c.textDim }}>10.10.16.87</span>
          </div>
          <h2 style={{ fontSize: 32, margin: '0 0 10px 0', fontWeight: 800 }}>Raspberry Pi</h2>
          <div style={{ fontSize: 16, color: c.textMuted, marginBottom: 20 }}>
            Central coordination host running high-concurrency C socket broker and web services.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.purple }}>TCP Broker (:8080)</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>broker_server.c multi-client router</div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.amber }}>State Controller (t8_ctrl)</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>AUTO / MANUAL / ESTOP state machine</div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.accent }}>Web Dashboard (:8000)</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>FastAPI web server & SQLite storage</div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.text }}>Bluetooth Bridge (bt_bridge)</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>Wireless peripheral telemetry relay</div>
            </div>
          </div>
        </Card>

        {/* Tier 3: STM32 Nucleo */}
        <Card style={{ borderTop: `4px solid ${c.emerald}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.emerald, letterSpacing: '0.05em' }}>
              TIER 3 • ACTUATION
            </span>
            <span style={{ fontFamily: fontMono, fontSize: 14, color: c.textDim }}>UART / GPIO</span>
          </div>
          <h2 style={{ fontSize: 32, margin: '0 0 10px 0', fontWeight: 800 }}>STM32 Nucleo</h2>
          <div style={{ fontSize: 16, color: c.textMuted, marginBottom: 20 }}>
            Real-time ARM Cortex-M microcontroller driving motors, sensors, and safety interlocks.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.emerald }}>Conveyor Motor Drive</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>PWM speed regulation & forward motion</div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.rose }}>Sorting Diverter Gate</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>Servo/solenoid ejects defective items</div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.amber }}>Photoelectric Arrival Sensor</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>Interrupt triggers camera capture</div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.text }}>Hardware E-Stop Line</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>Hardware cut-off for instant motor halt</div>
            </div>
          </div>
        </Card>
      </div>

      <Footer current={3} total={8} />
    </div>
  );
};

// ==============================================================================
// Slide 4: Jetson Nano Edge AI Pipeline
// ==============================================================================
const Slide4JetsonAI: Page = () => {
  return (
    <div style={canvasBase}>
      <Header
        badge="TIER 1 • EDGE COMPUTER VISION"
        title="Jetson Nano: YOLOv8 AI Vision Pipeline"
        subtitle="Deep learning inference at the edge with dual-threshold confidence evaluation."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 32, flex: 1, marginBottom: 24 }}>
        {/* Left Column: AI Logic */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <h3 style={{ fontSize: 24, margin: '0 0 16px 0', fontWeight: 800, color: c.accent }}>
              Dual-Threshold Inference Architecture
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 16, backgroundColor: 'rgba(56, 189, 248, 0.08)', borderRadius: 12, border: `1px solid rgba(56, 189, 248, 0.2)` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.accent }}>BOX_CONF_THRESHOLD</div>
                <div style={{ fontSize: 36, fontWeight: 900, marginTop: 4, color: c.text }}>≥ 0.65</div>
                <div style={{ fontSize: 14, color: c.textMuted, marginTop: 4 }}>
                  Normal Cube Acceptance: High confidence confirms genuine workpiece arrival.
                </div>
              </div>

              <div style={{ padding: 16, backgroundColor: 'rgba(244, 63, 94, 0.08)', borderRadius: 12, border: `1px solid rgba(244, 63, 94, 0.2)` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.rose }}>DEFECT_CONF_THRESHOLD</div>
                <div style={{ fontSize: 36, fontWeight: 900, marginTop: 4, color: c.rose }}>≥ 0.35</div>
                <div style={{ fontSize: 14, color: c.textMuted, marginTop: 4 }}>
                  Defect Sensitive Trigger: Captures scratch, crack, or color deformity anomalies.
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: 22, margin: '0 0 12px 0', fontWeight: 800 }}>
              Live HTTP MJPEG Streaming
            </h3>
            <p style={{ fontSize: 16, color: c.textMuted, margin: '0 0 14px 0', lineHeight: 1.5 }}>
              The Jetson Nano hosts a concurrent <code>ThreadingHTTPServer</code> at port <code>5000</code>.
              OpenCV draws bounding boxes, defect labels, and confidence bars onto each frame, feeding the web dashboard without intermediate cloud servers.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: 14, fontFamily: fontMono }}>
                ENDPOINT: <span style={{ color: c.accent }}>/video_feed</span>
              </div>
              <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: 14, fontFamily: fontMono }}>
                FPS: <span style={{ color: c.emerald }}>30 FPS @ 720p</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Code Snippet & Decision */}
        <Card style={{ backgroundColor: '#0c1222', borderColor: c.borderLight }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: c.accent, fontFamily: fontMono }}>
              camera_ai_client.py
            </span>
            <span style={{ fontSize: 13, color: c.textDim, fontFamily: fontMono }}>Jetson Nano Client</span>
          </div>

          <pre
            style={{
              fontFamily: fontMono,
              fontSize: 14,
              lineHeight: 1.5,
              color: '#e2e8f0',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: 18,
              borderRadius: 10,
              overflow: 'hidden',
              margin: 0,
              flex: 1,
            }}
          >
            {`# YOLOv8 Model Inference
results = yolo_model.predict(
    source=frame,
    conf=PREDICT_CONF_CUTOFF, # 0.25
    verbose=False
)

# Sorting Classification Logic
has_defect = any(
    box.conf >= DEFECT_CONF_THRESHOLD
    for box in defect_boxes
)

if has_defect:
    decision = "SORT:DEFECT"
    send_to_broker("[T8_VISION] SORT:DEFECT")
else:
    decision = "SORT:NORMAL"
    send_to_broker("[T8_VISION] SORT:NORMAL")`}
          </pre>

          <div
            style={{
              marginTop: 16,
              padding: '12px 16px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 8,
              border: `1px solid rgba(16, 185, 129, 0.3)`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ color: c.emerald, fontSize: 18, fontWeight: 800 }}>⚡</span>
            <span style={{ fontSize: 14, color: c.text }}>
              Dispatches classification commands over persistent TCP socket to Raspberry Pi in &lt; 2ms.
            </span>
          </div>
        </Card>
      </div>

      <Footer current={4} total={8} />
    </div>
  );
};

// ==============================================================================
// Slide 5: Raspberry Pi IoT Broker & Controller
// ==============================================================================
const Slide5RaspberryPi: Page = () => {
  return (
    <div style={canvasBase}>
      <Header
        badge="TIER 2 • ORCHESTRATION & BROKER"
        title="Raspberry Pi: Central Socket Broker & Coordinator"
        subtitle="POSIX multi-threaded C broker multiplexing real-time commands across industrial nodes."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, flex: 1, marginBottom: 24 }}>
        {/* Component 1: TCP Broker */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 800, color: c.accent, letterSpacing: '0.05em' }}>
            HIGH-CONCURRENCY ROUTER
          </div>
          <h3 style={{ fontSize: 26, margin: '6px 0 14px 0', fontWeight: 800 }}>
            broker_server.c
          </h3>
          <p style={{ fontSize: 16, color: c.textMuted, lineHeight: 1.5, margin: '0 0 18px 0' }}>
            Multi-threaded TCP server listening on port <code>8080</code>. Maintains persistent socket
            sessions with all subsystems.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {[
              { node: '[T8_VISION]', role: 'Jetson Nano Camera AI' },
              { node: '[T8_CTRL]', role: 'Smart Factory State Machine' },
              { node: '[T8_MOTION]', role: 'STM32 Motor/Sensor Board' },
              { node: '[T8_HMI]', role: 'Web Dashboard Management' },
            ].map((n, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontFamily: fontMono, fontSize: 14, fontWeight: 700, color: c.accent }}>
                  {n.node}
                </span>
                <span style={{ fontSize: 13, color: c.textMuted }}>{n.role}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Component 2: State Machine */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 800, color: c.purple, letterSpacing: '0.05em' }}>
            STATE COORDINATION
          </div>
          <h3 style={{ fontSize: 26, margin: '6px 0 14px 0', fontWeight: 800 }}>
            t8_ctrl.c Engine
          </h3>
          <p style={{ fontSize: 16, color: c.textMuted, lineHeight: 1.5, margin: '0 0 18px 0' }}>
            Implements the industrial factory state machine governing operations, safety interlocks, and defect routing.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: 8, border: `1px solid rgba(16, 185, 129, 0.2)` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.emerald }}>AUTO MODE</div>
              <div style={{ fontSize: 13, color: c.textMuted, marginTop: 2 }}>
                Continuous conveyor feed with automatic AI sorting trigger.
              </div>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(245, 158, 11, 0.08)', borderRadius: 8, border: `1px solid rgba(245, 158, 11, 0.2)` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.amber }}>MANUAL MODE</div>
              <div style={{ fontSize: 13, color: c.textMuted, marginTop: 2 }}>
                Operator controls conveyor step, camera capture, and flipper test.
              </div>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(244, 63, 94, 0.08)', borderRadius: 8, border: `1px solid rgba(244, 63, 94, 0.2)` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.rose }}>EMERGENCY STOP (ESTOP)</div>
              <div style={{ fontSize: 13, color: c.textMuted, marginTop: 2 }}>
                Zero-delay broadcast halting all motion across all nodes.
              </div>
            </div>
          </div>
        </Card>

        {/* Component 3: Database & Web Dashboard */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 800, color: c.indigo, letterSpacing: '0.05em' }}>
            PERSISTENCE & API
          </div>
          <h3 style={{ fontSize: 26, margin: '6px 0 14px 0', fontWeight: 800 }}>
            web_server.py
          </h3>
          <p style={{ fontSize: 16, color: c.textMuted, lineHeight: 1.5, margin: '0 0 18px 0' }}>
            FastAPI server providing RESTful endpoints, streaming proxy, and audit logging into SQLite.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.text }}>Role-Based Access (RBAC)</div>
              <div style={{ fontSize: 13, color: c.textMuted }}>Admin vs Operator authentication (factory_users.db)</div>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.accent }}>Inspection History Logs</div>
              <div style={{ fontSize: 13, color: c.textMuted }}>Records defect classifications, timestamp, and confidence</div>
            </div>

            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.purple }}>Jetson Stream Proxy</div>
              <div style={{ fontSize: 14, color: c.textMuted }}>Transparently relays Jetson Nano video into HTML5 browser</div>
            </div>
          </div>
        </Card>
      </div>

      <Footer current={5} total={8} />
    </div>
  );
};

// ==============================================================================
// Slide 6: STM32 Nucleo Physical Sorting Mechanism
// ==============================================================================
const Slide6STM32Actuation: Page = () => {
  return (
    <div style={canvasBase}>
      <Header
        badge="TIER 3 • PHYSICAL ACTUATION"
        title="STM32 Nucleo: Motor Drive & Sorting Gate"
        subtitle="Executing deterministic hardware control based on edge AI classification commands."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, flex: 1, marginBottom: 24 }}>
        {[
          {
            step: '01',
            title: 'Object Arrival Sensing',
            color: c.accent,
            desc: 'Photoelectric/optical sensor detects incoming workpiece at the inspection entrance. Triggers interrupt to prepare camera capture.',
            badge: 'SENSOR INTERRUPT',
          },
          {
            step: '02',
            title: 'AI Inspection Trigger',
            color: c.purple,
            desc: 'Object arrives at the calibrated optical zone. Jetson Nano grabs 720p frame and runs YOLOv8 defect inference in <35ms.',
            badge: 'EDGE VISION',
          },
          {
            step: '03',
            title: 'Broker Command Dispatch',
            color: c.indigo,
            desc: 'Raspberry Pi broker receives SORT decision and routes actuation signal directly to the STM32 Nucleo over UART/SPI.',
            badge: 'PACKET ROUTING',
          },
          {
            step: '04',
            title: 'Diverter Gate Actuation',
            color: c.emerald,
            desc: 'STM32 actuates sorting servo gate: NORMAL parts continue to output bin; DEFECT parts are kicked into the reject tray.',
            badge: 'PHYSICAL SORTING',
          },
        ].map((item, idx) => (
          <Card key={idx} style={{ borderTop: `4px solid ${item.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: item.color, fontFamily: fontMono }}>
                {item.step}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: item.color,
                  letterSpacing: '0.05em',
                }}
              >
                {item.badge}
              </span>
            </div>
            <h3 style={{ fontSize: 24, margin: '0 0 12px 0', fontWeight: 800 }}>{item.title}</h3>
            <p style={{ fontSize: 16, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
          </Card>
        ))}
      </div>

      {/* Sorting Logic Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          padding: '20px 28px',
          borderRadius: 14,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${c.border}`,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: c.emerald }} />
          <div>
            <span style={{ fontWeight: 800, color: c.emerald, fontSize: 18 }}>NORMAL CUBE: </span>
            <span style={{ fontSize: 16, color: c.textMuted }}>
              Conveyor runs continuously forward. Actuator stays in neutral position.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: c.rose }} />
          <div>
            <span style={{ fontWeight: 800, color: c.rose, fontSize: 18 }}>DEFECT DETECTED: </span>
            <span style={{ fontSize: 16, color: c.textMuted }}>
              Servo gate extends at arrival timestamp to divert defective workpiece into quarantine.
            </span>
          </div>
        </div>
      </div>

      <Footer current={6} total={8} />
    </div>
  );
};

// ==============================================================================
// Slide 7: End-to-End Signal & Data Flow
// ==============================================================================
const Slide7SequenceFlow: Page = () => {
  return (
    <div style={canvasBase}>
      <Header
        badge="END-TO-END DATA FLOW"
        title="Complete Data Flow & Protocol Sequence"
        subtitle="Synchronous and asynchronous message exchange between nodes during an inspection cycle."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, marginBottom: 20 }}>
        {[
          {
            source: 'STM32 Nucleo [T8_MOTION]',
            target: 'Raspberry Pi Broker [T8_CTRL]',
            action: 'Photo-sensor trigger: SENSOR:ITEM_ARRIVED',
            type: 'EVENT',
            color: c.accent,
          },
          {
            source: 'Raspberry Pi Broker [T8_CTRL]',
            target: 'Jetson Nano [T8_VISION]',
            action: 'Vision inspection trigger command: SNAP:INSPECT',
            type: 'REQUEST',
            color: c.purple,
          },
          {
            source: 'Jetson Nano (YOLOv8)',
            target: 'Internal CUDA Inference',
            action: 'Inference on 720p frame: calculates Box & Defect confidences in ~30ms',
            type: 'AI INFERENCE',
            color: c.indigo,
          },
          {
            source: 'Jetson Nano [T8_VISION]',
            target: 'Raspberry Pi Broker [T8_CTRL]',
            action: 'Classification result: [T8_VISION] SORT:DEFECT (or SORT:NORMAL)',
            type: 'PAYLOAD',
            color: c.amber,
          },
          {
            source: 'Raspberry Pi Broker [T8_CTRL]',
            target: 'STM32 Nucleo [T8_MOTION]',
            action: 'Actuation command: ACTUATE:SORT_GATE:DEFECT',
            type: 'ACTUATION',
            color: c.rose,
          },
          {
            source: 'Raspberry Pi Web Server',
            target: 'FastAPI Dashboard & DB',
            action: 'Updates UI telemetry, appends record to factory_history.log & SQLite DB',
            type: 'TELEMETRY',
            color: c.emerald,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '240px 240px 1fr 140px',
              alignItems: 'center',
              padding: '16px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 12,
              border: `1px solid ${c.border}`,
              gap: 20,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: c.text }}>{item.source}</div>
            <div style={{ fontSize: 16, color: c.textMuted }}>➔ {item.target}</div>
            <div style={{ fontFamily: fontMono, fontSize: 15, color: c.text }}>{item.action}</div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: fontMono,
                  padding: '4px 10px',
                  borderRadius: 6,
                  backgroundColor: `${item.color}22`,
                  border: `1px solid ${item.color}55`,
                  color: item.color,
                }}
              >
                {item.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Footer current={7} total={8} />
    </div>
  );
};

// ==============================================================================
// Slide 8: Summary & Key Achievements
// ==============================================================================
const Slide8Summary: Page = () => {
  return (
    <div
      style={{
        ...canvasBase,
        background: `radial-gradient(circle at 50% 10%, rgba(56, 189, 248, 0.1) 0%, transparent 60%), ${c.bg}`,
      }}
    >
      <Header
        badge="CONCLUSION & PROJECT SUMMARY"
        title="Summary & Technological Achievements"
        subtitle="A modular, production-ready blueprint for distributed Edge AI industrial automation."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, flex: 1, marginBottom: 24 }}>
        <Card style={{ borderTop: `4px solid ${c.accent}` }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: c.accent, marginBottom: 8 }}>&lt; 35ms</div>
          <h3 style={{ fontSize: 22, margin: '0 0 10px 0', fontWeight: 800 }}>Real-Time Inference</h3>
          <p style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
            Optimized YOLOv8 pipeline on Jetson Nano delivers high-speed defect discrimination without cloud dependency.
          </p>
        </Card>

        <Card style={{ borderTop: `4px solid ${c.purple}` }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: c.purple, marginBottom: 8 }}>100%</div>
          <h3 style={{ fontSize: 22, margin: '0 0 10px 0', fontWeight: 800 }}>Decoupled Modules</h3>
          <p style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
            Vision, brokerage, and motor actuation run on isolated specialized hardware, eliminating concurrency stalls.
          </p>
        </Card>

        <Card style={{ borderTop: `4px solid ${c.emerald}` }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: c.emerald, marginBottom: 8 }}>3-Tier</div>
          <h3 style={{ fontSize: 22, margin: '0 0 10px 0', fontWeight: 800 }}>Failsafe Reliability</h3>
          <p style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
            Integrated hardware E-Stop and state machine fault tolerance protect machinery and human operators.
          </p>
        </Card>

        <Card style={{ borderTop: `4px solid ${c.amber}` }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: c.amber, marginBottom: 8 }}>Full Stack</div>
          <h3 style={{ fontSize: 22, margin: '0 0 10px 0', fontWeight: 800 }}>Web Telemetry</h3>
          <p style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>
            Modern FastAPI web interface with live video streaming, RBAC authentication, and audit history.
          </p>
        </Card>
      </div>

      {/* GitHub Callout Footer Box */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: c.card,
          borderRadius: 14,
          border: `1px solid ${c.border}`,
          padding: '20px 32px',
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: c.text }}>
            Open Source Repository Available on GitHub
          </div>
          <div style={{ fontSize: 15, color: c.textMuted, marginTop: 4 }}>
            Source code, C broker, FastAPI server, YOLO model weights, and STM32 integration.
          </div>
        </div>
        <div
          style={{
            padding: '12px 24px',
            borderRadius: 10,
            backgroundColor: c.accentGlow,
            border: `1px solid ${c.accent}`,
            color: c.accent,
            fontFamily: fontMono,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          github.com/Lucas-SJeong/AI_IOT_OBJECT_CLASSIFIER
        </div>
      </div>

      <Footer current={8} total={8} />
    </div>
  );
};

// ==============================================================================
// Metadata & Presenter Speaker Notes
// ==============================================================================
export const meta: SlideMeta = {
  title: 'AI IoT Object Classifier & Smart Factory',
  createdAt: '2026-10-12T00:56:01.851Z',
};

export const notes: (string | undefined)[] = [
  // Slide 1
  `Welcome everyone. Today I'm presenting our AI IoT Object Classifier and Smart Factory Sorting System.
This project integrates edge deep learning on Nvidia Jetson Nano, real-time message routing on Raspberry Pi, and deterministic motor actuation on the STM32 Nucleo board.`,

  // Slide 2
  `In modern manufacturing, manual visual inspection is error-prone, while cloud AI introduces unacceptable latency.
Our approach uses a three-tier edge setup: Jetson Nano detects defects locally in under 35 milliseconds, while Raspberry Pi and STM32 handle microsecond command coordination and sorting.`,

  // Slide 3
  `Here is the architectural topology:
Tier 1 is Perception on Jetson Nano with OBSBOT Meet 2 camera.
Tier 2 is Orchestration on Raspberry Pi with a C socket broker and FastAPI dashboard.
Tier 3 is Physical Actuation on STM32 Nucleo, controlling conveyor belts, photoelectric arrival sensors, and the diverter arm.`,

  // Slide 4
  `Looking into Jetson Nano's vision pipeline:
We employ dual confidence thresholds: 65% for workpiece presence and 35% for defect sensitivity.
It also hosts a concurrent MJPEG streaming server at port 5000 and dispatches classification tokens over a TCP socket.`,

  // Slide 5
  `On Raspberry Pi, we built a POSIX multi-threaded C broker on port 8080.
It dynamically routes packets between vision, motion, and HMI nodes.
The t8_ctrl engine maintains operational modes like AUTO, MANUAL, and instantaneous E-STOP safety halt.`,

  // Slide 6
  `On the physical level, STM32 Nucleo handles the conveyor motor and the sorting gate.
When a normal cube passes, the gate stays neutral. When a defect is flagged by Jetson Nano, STM32 extends the servo diverter to quarantine the bad part into the reject tray.`,

  // Slide 7
  `This sequence diagram illustrates the lifecycle of a single workpiece:
Arrival detection, vision trigger, YOLOv8 inference, broker routing, STM32 gate actuation, and finally telemetry logging in SQLite.`,

  // Slide 8
  `To summarize, this project demonstrates sub-35ms edge inference, 100% modular separation of concerns, and industrial-grade safety with full web telemetry.
Thank you! The entire codebase is open-sourced on GitHub under Lucas-SJeong/AI_IOT_OBJECT_CLASSIFIER.`,
];

export default [
  Slide1Cover,
  Slide2Overview,
  Slide3Architecture,
  Slide4JetsonAI,
  Slide5RaspberryPi,
  Slide6STM32Actuation,
  Slide7SequenceFlow,
  Slide8Summary,
] satisfies Page[];
