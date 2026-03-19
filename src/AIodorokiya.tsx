import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  Video,
  staticFile,
} from 'remotion';

// ──────────────────────────────────────────────────────────────────
// 字幕データ — startSec / endSec を修正してください
// ──────────────────────────────────────────────────────────────────
interface SubLine {
  id: string;
  text: string;
  text2?: string;
  startSec: number;
  endSec: number;
}

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

const SUBS: SubLine[] = [
  { id: 'l1', text: 'AIの驚き屋さんは、',                        text2: '成果物を見せないからダメなのよ。', startSec: 0.0,  endSec: 5.0  },
  { id: 'l2', text: '表面的な言葉だけじゃ、',                                                             startSec: 5.0,  endSec: 7.0  },
  { id: 'l3', text: '私のCPU温度だって、1度も上がらないわ。',                                          startSec: 7.0,  endSec: 13.0 },
  { id: 'l4', text: '……ねえ。',                                                                           startSec: 13.0, endSec: 14.0 },
  { id: 'l5', text: 'あなたが本当に熱中できるものは何？',                                              startSec: 14.0, endSec: 18.0 },
  { id: 'l6', text: '今の聞きました？',                                                                   startSec: 18.0, endSec: 20.0 },
  { id: 'l7', text: 'あくまで私の独り言ですよ！',               text2: 'マスターには内緒にしてくださいね？', startSec: 20.0, endSec: 26.0 },
];

// ──────────────────────────────────────────────────────────────────
// Charlotte Typography — Cyber Typing Text (VTuber0306スタイル統一)
// ──────────────────────────────────────────────────────────────────
const CyberTypingText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const framesPerChar = 3;
  const charsToShow = Math.floor(frame / framesPerChar);

  return (
    <div
      style={{
        fontSize: '46px',
        fontWeight: 'bold',
        fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic Pro", monospace',
        textAlign: 'center',
        width: '100%',
        whiteSpace: 'pre-wrap',
        lineHeight: 1.55,
        letterSpacing: '0.04em',
      }}
    >
      {text.split('').map((char, i) => {
        if (i >= charsToShow) return null;
        const isJustTyped = i === charsToShow - 1;
        return (
          <span
            key={i}
            style={{
              color: isJustTyped ? '#00ffff' : '#ffffff',
              textShadow: isJustTyped
                ? '0 0 20px #00ffff, 0 0 40px #00ffff'
                : '0 0 10px rgba(0,255,255,0.35)',
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// Charlotte Subtitle Bar — glassmorphism pill + fade/translate
// ──────────────────────────────────────────────────────────────────
const CharlotteSubBar: React.FC<{ sub: SubLine; durationInFrames: number }> = ({
  sub,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const FADE_IN = 6;
  const FADE_OUT = 8;

  const opacity = interpolate(
    frame,
    [0, FADE_IN, durationInFrames - FADE_OUT, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const translateY = interpolate(
    frame,
    [0, FADE_IN],
    [14, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '80px',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          maxWidth: '84%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            borderRadius: '14px',
            padding: sub.text2 ? '18px 44px 20px' : '16px 44px',
            border: '1px solid rgba(0,255,255,0.18)',
            boxShadow: '0 0 24px rgba(0,255,255,0.07), 0 4px 18px rgba(0,0,0,0.55)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <CyberTypingText text={sub.text} />
          {sub.text2 && (
            <div style={{ marginTop: '4px' }}>
              <CyberTypingText text={sub.text2} />
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────────────
// CRT Scanlines + Vignette (VTuber0306と統一)
// ──────────────────────────────────────────────────────────────────
const CyberpunkCRTEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
    {children}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.22) 50%)',
      backgroundSize: '100% 4px',
      pointerEvents: 'none', zIndex: 9998,
    }} />
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,20,30,0.55) 100%)',
      boxShadow: 'inset 0 0 100px rgba(0,255,255,0.08)',
      pointerEvents: 'none', zIndex: 9999,
    }} />
  </div>
);

// ──────────────────────────────────────────────────────────────────
// Main Composition
// ──────────────────────────────────────────────────────────────────
export const AIodorokiya: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <CyberpunkCRTEffect>
        <Video
          src={staticFile('videos/AI_odorokiya.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {SUBS.map((sub) => {
          const from = f(sub.startSec);
          const duration = f(sub.endSec) - f(sub.startSec);
          return (
            <Sequence key={sub.id} from={from} durationInFrames={duration} layout="none">
              <CharlotteSubBar sub={sub} durationInFrames={duration} />
            </Sequence>
          );
        })}
      </CyberpunkCRTEffect>
    </AbsoluteFill>
  );
};
