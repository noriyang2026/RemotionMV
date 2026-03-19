/**
 * CyberpunkOverlay.tsx
 * ── 電脳空間エフェクト・ラッパーコンポーネント ──
 *
 * <CyberpunkOverlay> で既存の <Sequence>/<Video> を囲むだけで
 * サイバーパンク VFX が適用される汎用コンポーネント。
 *
 * Features:
 *   1. Chromatic Aberration（RGBズレ）
 *   2. CRTスキャンライン（走査線）
 *   3. Digital Glitch（ブロックノイズ）
 *   4. Random Flicker（明滅）
 *   5. Phase切り替え（現在 vs 過去）
 *
 * Usage:
 *   <CyberpunkOverlay phase="present" intensity={0.7}>
 *     <Video src={staticFile('videos/ReLord_Sub.mp4')} ... />
 *   </CyberpunkOverlay>
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

// ── 疑似乱数（Remotionではdeterministicでないといけない）────
function hash(frame: number, seed: number): number {
  return Math.abs(Math.sin(frame * 0.7531 + seed * 13.17) * 43758.5453) % 1;
}

// ══════════════════════════════════════════════════════════════
// Props
// ══════════════════════════════════════════════════════════════
interface CyberpunkOverlayProps {
  children: React.ReactNode;
  /** エフェクト全体の強度 0-1 */
  intensity?: number;
  /** "present" = シアン + 鋭い / "past" = アンバー + ノイジー */
  phase?: 'present' | 'past';
  /** グリッチを発生させるフレーム配列 (ex: [120, 240, 360]) */
  glitchFrames?: number[];
  /** グリッチの持続フレーム数 */
  glitchDuration?: number;
  /** エフェクトを開始するフレーム */
  startFrame?: number;
  /** エフェクトを終了するフレーム (省略で最後まで) */
  endFrame?: number;
  /** 四隅にデジタルHUDテキストを表示 */
  showCornerHUD?: boolean;
}

// ══════════════════════════════════════════════════════════════
// Phase-based color palettes
// ══════════════════════════════════════════════════════════════
const PALETTE = {
  present: {
    primary: [0, 229, 255],     // シアン
    secondary: [255, 0, 100],   // マゼンタ
    scanline: [0, 255, 200],
    glow: 'rgba(0, 229, 255, 0.04)',
    vignette: 'rgba(0, 10, 20, 0.65)',
  },
  past: {
    primary: [255, 160, 40],    // アンバー
    secondary: [100, 0, 255],   // パープル
    scanline: [255, 200, 100],
    glow: 'rgba(255, 160, 40, 0.03)',
    vignette: 'rgba(20, 10, 0, 0.70)',
  },
};

// ══════════════════════════════════════════════════════════════
// Chromatic Aberration Layer
// ══════════════════════════════════════════════════════════════
const ChromaticAberration: React.FC<{
  frame: number;
  intensity: number;
  palette: typeof PALETTE.present;
}> = ({ frame, intensity, palette }) => {
  const noise1 = Math.sin(frame * 0.37) * Math.cos(frame * 0.19);
  const noise2 = Math.cos(frame * 0.53) * Math.sin(frame * 0.31);
  const shiftX = intensity * (2.5 + noise1 * 4);
  const shiftY = intensity * noise2 * 2;

  const [pr, pg, pb] = palette.primary;
  const [sr, sg, sb] = palette.secondary;

  return (
    <>
      {/* Red/Primary channel shift */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center,
            transparent 50%,
            rgba(${pr},${pg},${pb}, ${0.08 * intensity}) 100%)`,
          transform: `translate(${-shiftX}px, ${-shiftY}px)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      {/* Cyan/Secondary channel shift */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center,
            transparent 50%,
            rgba(${sr},${sg},${sb}, ${0.06 * intensity}) 100%)`,
          transform: `translate(${shiftX}px, ${shiftY}px)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      {/* Edge RGB split (constant subtle) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: `inset ${shiftX * 0.5}px 0 ${30 * intensity}px rgba(${pr},${pg},${pb},${0.06 * intensity}),
                      inset ${-shiftX * 0.5}px 0 ${30 * intensity}px rgba(${sr},${sg},${sb},${0.06 * intensity})`,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

// ══════════════════════════════════════════════════════════════
// CRT Scanlines
// ══════════════════════════════════════════════════════════════
const CRTScanlines: React.FC<{
  frame: number;
  intensity: number;
  palette: typeof PALETTE.present;
}> = ({ frame, intensity, palette }) => {
  const scanY = (frame * 1.7) % 100;
  const [sr, sg, sb] = palette.scanline;

  return (
    <>
      {/* Static scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            rgba(0,0,0,${0.06 * intensity}) 0px,
            rgba(0,0,0,${0.06 * intensity}) 1px,
            transparent 1px,
            transparent 3px
          )`,
          pointerEvents: 'none',
        }}
      />
      {/* Moving scan beam */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg,
            transparent ${scanY - 2}%,
            rgba(${sr},${sg},${sb}, ${0.035 * intensity}) ${scanY}%,
            transparent ${scanY + 2}%
          )`,
          pointerEvents: 'none',
        }}
      />
      {/* Secondary scan beam (slower) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg,
            transparent ${((frame * 0.8) % 100) - 1}%,
            rgba(${sr},${sg},${sb}, ${0.02 * intensity}) ${(frame * 0.8) % 100}%,
            transparent ${((frame * 0.8) % 100) + 1}%
          )`,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

// ══════════════════════════════════════════════════════════════
// Digital Glitch (Block Noise)
// ══════════════════════════════════════════════════════════════
const DigitalGlitch: React.FC<{
  frame: number;
  intensity: number;
  glitchFrames: number[];
  glitchDuration: number;
  palette: typeof PALETTE.present;
}> = ({ frame, intensity, glitchFrames, glitchDuration, palette }) => {
  // Check if current frame is within any glitch window
  let glitchProgress = -1;
  for (const gf of glitchFrames) {
    if (frame >= gf && frame < gf + glitchDuration) {
      glitchProgress = (frame - gf) / glitchDuration;
      break;
    }
  }

  if (glitchProgress < 0) return null;

  // Glitch intensity peaks at center
  const glitchPower =
    interpolate(glitchProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]) * intensity;

  const [pr, pg, pb] = palette.primary;

  // Generate 3-5 glitch slices
  const slices = [];
  const sliceCount = 3 + Math.floor(hash(frame, 99) * 3);
  for (let i = 0; i < sliceCount; i++) {
    const y = hash(frame, i * 7) * 100;
    const h = hash(frame, i * 13 + 3) * 8 + 1;
    const dx = (hash(frame, i * 17 + 5) - 0.5) * 60 * glitchPower;
    const opacity = hash(frame, i * 23 + 11) * 0.3 * glitchPower;

    slices.push(
      <div
        key={`glitch-${i}`}
        style={{
          position: 'absolute',
          top: `${y}%`,
          left: 0,
          right: 0,
          height: `${h}%`,
          transform: `translateX(${dx}px) skewX(${(hash(frame, i * 31) - 0.5) * 8 * glitchPower}deg)`,
          background: `rgba(${pr},${pg},${pb}, ${opacity})`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <>
      {slices}
      {/* Flash on glitch */}
      {glitchPower > 0.6 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(255,255,255,${0.04 * glitchPower})`,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
};

// ══════════════════════════════════════════════════════════════
// Vignette & Glow
// ══════════════════════════════════════════════════════════════
const Vignette: React.FC<{
  intensity: number;
  palette: typeof PALETTE.present;
}> = ({ intensity, palette }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(ellipse at center,
        transparent 45%,
        ${palette.vignette} 100%)`,
      opacity: 0.5 + intensity * 0.5,
      pointerEvents: 'none',
    }}
  />
);

// ══════════════════════════════════════════════════════════════
// Corner HUD — 四隅のデジタルテキスト
// ══════════════════════════════════════════════════════════════
const CORNER_FONT = '"Share Tech Mono", "Courier New", monospace';

const CornerHUD: React.FC<{
  frame: number;
  intensity: number;
  palette: typeof PALETTE.present;
  phase: 'present' | 'past';
}> = ({ frame, intensity, palette, phase }) => {
  const [pr, pg, pb] = palette.primary;
  const color = `rgba(${pr},${pg},${pb}, ${0.5 * intensity})`;
  const dimColor = `rgba(${pr},${pg},${pb}, ${0.25 * intensity})`;
  const fontSize = 10;

  // Dynamic data
  const hex = (frame * 7919 + 0xA3F).toString(16).toUpperCase().padStart(6, '0');
  const nodeId = `NODE-${String(Math.floor(hash(frame, 42) * 999)).padStart(3, '0')}`;
  const sig = `SIG:0x${hex.slice(0, 4)}`;
  const freq = (220 + Math.sin(frame * 0.1) * 80).toFixed(1);
  const lat = (35.6762 + Math.sin(frame * 0.02) * 0.001).toFixed(4);
  const lng = (139.6503 + Math.cos(frame * 0.015) * 0.001).toFixed(4);
  const mem = (64 + hash(frame, 88) * 32).toFixed(0);
  const sync = hash(frame, 55) > 0.1 ? 'SYNC' : 'LOST';

  const base: React.CSSProperties = {
    position: 'absolute',
    fontFamily: CORNER_FONT,
    fontSize,
    lineHeight: '14px',
    letterSpacing: '0.5px',
    color,
    pointerEvents: 'none',
    textShadow: `0 0 4px ${dimColor}`,
    whiteSpace: 'pre',
  };

  return (
    <>
      {/* Top-Left */}
      <div style={{ ...base, top: 12, left: 14 }}>
        {`ARCHIV.SYS v3.7.1\n${nodeId} :: ${sig}\nFREQ ${freq}Hz`}
      </div>
      {/* Top-Right */}
      <div style={{ ...base, top: 12, right: 14, textAlign: 'right' }}>
        {`FRAME ${String(frame).padStart(5, '0')}\n${sync} ▪ MEM ${mem}%\n${lat}N ${lng}E`}
      </div>
      {/* Bottom-Left */}
      <div style={{ ...base, bottom: 12, left: 14 }}>
        {`RENDER::${phase === 'present' ? 'REALTIME' : 'PLAYBACK'}\n0x${hex}`}
      </div>
      {/* Bottom-Right */}
      <div style={{ ...base, bottom: 12, right: 14, textAlign: 'right' }}>
        {`Charlotte Re:Lord\nECHO LOG ▪ ACTIVE`}
      </div>
    </>
  );
};

// ══════════════════════════════════════════════════════════════
// 🎬 Main Component
// ══════════════════════════════════════════════════════════════
export const CyberpunkOverlay: React.FC<CyberpunkOverlayProps> = ({
  children,
  intensity = 0.6,
  phase = 'present',
  glitchFrames = [],
  glitchDuration = 6,
  startFrame = 0,
  endFrame,
  showCornerHUD = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const end = endFrame ?? durationInFrames;

  // Effect activation
  const isActive = frame >= startFrame && frame < end;
  const activeIntensity = isActive
    ? interpolate(
        frame,
        [startFrame, startFrame + 10, end - 10, end],
        [0, intensity, intensity, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  // Flicker: deterministic pseudo-random brightness
  const flicker = isActive
    ? 0.85 + hash(frame, 777) * 0.15
    : 1;

  const palette = PALETTE[phase];

  return (
    <AbsoluteFill>
      {/* Children with flicker applied */}
      <AbsoluteFill style={{ opacity: flicker }}>
        {children}
      </AbsoluteFill>

      {/* VFX layers (only when active) */}
      {activeIntensity > 0 && (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <ChromaticAberration
            frame={frame}
            intensity={activeIntensity}
            palette={palette}
          />
          <CRTScanlines
            frame={frame}
            intensity={activeIntensity}
            palette={palette}
          />
          <DigitalGlitch
            frame={frame}
            intensity={activeIntensity}
            glitchFrames={glitchFrames}
            glitchDuration={glitchDuration}
            palette={palette}
          />
          <Vignette intensity={activeIntensity} palette={palette} />

          {/* Corner HUD */}
          {showCornerHUD && (
            <CornerHUD
              frame={frame}
              intensity={activeIntensity}
              palette={palette}
              phase={phase}
            />
          )}

          {/* Phase-specific ambient glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: palette.glow,
              mixBlendMode: phase === 'present' ? 'screen' : 'overlay',
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
