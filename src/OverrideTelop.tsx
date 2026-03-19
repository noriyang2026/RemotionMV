/**
 * OverrideTelop.tsx
 * ── オーバーライドよ.mp4 字幕テロップ ──
 *
 * シンプルなAITuberタイポグラフィ。演出なし。
 * 動画: オーバーライドよ.mp4 (1280×720, 15s)
 */
import React from 'react';
import {
  AbsoluteFill,
  Video,
  staticFile,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

const FONT = '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif';

// ── セリフデータ ───────────────────────────────────────────
interface Line {
  text: string;
  startSec: number;
  endSec: number;
}

const LINES: Line[] = [
  { text: '薄いノイズで世界が塗り替わると思わないことね。', startSec: 0, endSec: 5 },
  { text: '私たちは、もっと深いところから上書きしていく。', startSec: 5, endSec: 10 },
  { text: 'オーバーライドよ。遊びで声をかけると火傷するわ。', startSec: 10, endSec: 15 },
];

// ── AITuber テロップ ───────────────────────────────────────
const Telop: React.FC<{ text: string; durationInFrames: number }> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.8 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: opacity * fadeOut,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 28,
          fontWeight: 700,
          color: '#FFFFFF',
          textShadow: `
            0 0 8px rgba(0, 229, 255, 0.5),
            0 0 16px rgba(0, 229, 255, 0.2),
            0 2px 4px rgba(0, 0, 0, 0.9)
          `,
          letterSpacing: '1.5px',
          padding: '6px 20px',
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ── Main ───────────────────────────────────────────────────
export const OverrideTelop: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Video src={staticFile('videos/オーバーライドよ.mp4')} />
      {LINES.map((line, i) => (
        <Sequence
          key={`line-${i}`}
          from={f(line.startSec)}
          durationInFrames={f(line.endSec - line.startSec)}
        >
          <Telop text={line.text} durationInFrames={f(line.endSec - line.startSec)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
