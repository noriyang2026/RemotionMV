/**
 * CamelotPVP.tsx
 * ── CHECKMATE // ALL-IN ── チェス × トランプ MV テロップ + VFX
 *
 * White（理）: シアンブルーの光のグリッド、パルスノイズ
 * Red（狂気）: 赤黒のノイズ、ピクセルソート崩壊、カードパーティクル
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
  Video,
  Audio,
  staticFile,
} from 'remotion';

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

// ── 歌詞データ ────────────────────────────────────────────────
type Side = 'white' | 'red' | 'clash';

interface LyricLine {
  id: string;
  jp: string;
  en: string;
  startSec: number;
  endSec: number;
  side: Side;
}

const LYRICS: LyricLine[] = [
  // Intro
  { id: 'i1', jp: 'Grid on.', en: '', startSec: 0, endSec: 3, side: 'white' },
  { id: 'i2', jp: 'Cards fall.', en: '', startSec: 3, endSec: 5, side: 'red' },
  { id: 'i3', jp: 'Checkmate or all-in.', en: '', startSec: 5, endSec: 10, side: 'clash' },

  // Verse 1
  { id: 'v1a', jp: '盤上に走る　光のライン', en: 'Lines of light race across the board', startSec: 22, endSec: 25, side: 'white' },
  { id: 'v1b', jp: '敷かれた理は　もう揺るがない', en: 'The established logic stands firm', startSec: 25, endSec: 28.5, side: 'white' },
  { id: 'v1c', jp: 'けれど空から降る狂気', en: 'Yet madness rains from the sky', startSec: 28.5, endSec: 31, side: 'red' },
  { id: 'v1d', jp: '赤と黒が笑ってる', en: 'Red and black are laughing', startSec: 31, endSec: 34, side: 'red' },

  // Verse 2
  { id: 'v2a', jp: '静かなルールを裂くみたいに', en: 'As if tearing through the silent rules', startSec: 34, endSec: 37, side: 'red' },
  { id: 'v2b', jp: 'カードの刃が夜を切る', en: 'The card\'s edge cuts the night', startSec: 37, endSec: 39, side: 'red' },
  { id: 'v2c', jp: 'これは遊戯じゃ終わらない', en: 'This is no longer a game', startSec: 39, endSec: 42, side: 'clash' },
  { id: 'v2d', jp: '理性と悪夢の開戦', en: 'A declaration of war: Reason vs. Nightmare', startSec: 42, endSec: 45, side: 'clash' },

  // Pre-Chorus
  { id: 'pc1', jp: 'Who will fall?\nWho will win?', en: '', startSec: 45, endSec: 47, side: 'clash' },
  { id: 'pc2', jp: '運命ごとベットして', en: 'Betting even fate itself', startSec: 47, endSec: 50, side: 'red' },
  { id: 'pc3', jp: 'White or red\nMind or risk', en: '', startSec: 50, endSec: 53, side: 'clash' },
  { id: 'pc4', jp: '今、全部が試される', en: 'Now, everything is being tested', startSec: 53, endSec: 58, side: 'clash' },

  // Chorus
  { id: 'c1', jp: 'CHECKMATE // ALL-IN\n詰ませるか　賭け切るか', en: 'Checkmate them, or bet it all', startSec: 58, endSec: 65, side: 'clash' },
  { id: 'c2', jp: 'CHECKMATE // ALL-IN\nこの世界ごと奪い合え', en: 'Battle for the entire world', startSec: 65, endSec: 70, side: 'clash' },
  { id: 'c3', jp: '盤上の理か　狂気のカードか', en: 'Logic on the board? Or the card of madness?', startSec: 70, endSec: 72, side: 'clash' },
  { id: 'c4', jp: '最後に笑うのは誰？', en: 'Who will have the final laugh?', startSec: 72, endSec: 75, side: 'clash' },
  { id: 'c5', jp: 'CHECKMATE // ALL-IN\nさあ、ゲームを始めましょう', en: 'Now, let the game begin', startSec: 75, endSec: 85, side: 'clash' },
];

// ── ユーティリティ ─────────────────────────────────────────────
function pseudoRand(frame: number, seed: number): number {
  return Math.abs(Math.sin(frame * 0.731 + seed * 9.17)) % 1;
}

// ── カラー定義（輝度UP・白寄り）──────────────────────────────────
const COLOR = {
  white: { main: '#b0f0ff', glow: '0 0 14px #b0f0ff, 0 0 35px rgba(176,240,255,0.7)', sub: 'rgba(176,240,255,0.7)' },
  red: { main: '#ff3d5a', glow: '0 0 14px #ff3d5a, 0 0 35px rgba(255,61,90,0.7)', sub: 'rgba(255,61,90,0.7)' },
  clash: { main: '#ffc0d0', glow: '0 0 14px #ffc0d0, 0 0 25px rgba(176,240,255,0.4), 0 0 35px rgba(255,61,90,0.4)', sub: 'rgba(255,192,208,0.7)' },
};

// ══════════════════════════════════════════════════════════════
// Chess Grid Overlay — パルスするシアングリッド
// ══════════════════════════════════════════════════════════════
const ChessGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.04 + Math.sin(frame * 0.025) * 0.02;
  const scrollY = (frame * 0.25) % 80;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(180,220,255,${pulse}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(180,220,255,${pulse}) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        backgroundPosition: `0 ${scrollY}px`,
        pointerEvents: 'none',
        zIndex: 50,
        mixBlendMode: 'screen' as const,
      }}
    />
  );
};

// ══════════════════════════════════════════════════════════════
// Card Particles — 降り注ぐトランプカード
// ══════════════════════════════════════════════════════════════
const CARD_SUITS = ['♠', '♥', '♦', '♣'];
const NUM_CARDS = 12;

const CardParticles: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 60, overflow: 'hidden' }}>
      {Array.from({ length: NUM_CARDS }).map((_, i) => {
        const seed = i * 7.13;
        const x = pseudoRand(0, seed) * 100; // % position
        const speed = 0.3 + pseudoRand(0, seed + 1) * 0.5;
        const yPos = ((frame * speed + pseudoRand(0, seed + 2) * 500) % 1200) - 100;
        const rotation = frame * (0.3 + pseudoRand(0, seed + 3) * 0.5) * (i % 2 === 0 ? 1 : -1);
        const suit = CARD_SUITS[i % 4];
        const isRed = suit === '♥' || suit === '♦';
        const opacity = 0.08 + pseudoRand(frame * 0.005, seed + 4) * 0.12;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: yPos,
              fontSize: '28px',
              color: isRed ? '#ff1744' : '#e0e0e0',
              textShadow: isRed ? '0 0 8px rgba(255,23,68,0.5)' : '0 0 8px rgba(255,255,255,0.3)',
              opacity,
              transform: `rotate(${rotation}deg)`,
              fontFamily: '"Courier New", monospace',
              fontWeight: 700,
            }}
          >
            {suit}
          </div>
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// Glitch Scanline — ピクセルソート風グリッチ
// ══════════════════════════════════════════════════════════════
const GlitchScanline: React.FC = () => {
  const frame = useCurrentFrame();
  const active = frame % 120 < 2;

  if (!active) return null;

  const y = pseudoRand(frame, 99) * 80 + 10;
  const height = 2 + pseudoRand(frame, 88) * 6;
  const isRed = pseudoRand(frame, 77) > 0.5;

  return (
    <div
      style={{
        position: 'absolute',
        top: `${y}%`,
        left: 0,
        right: 0,
        height: `${height}px`,
        background: isRed
          ? 'linear-gradient(90deg, rgba(255,23,68,0.4) 0%, rgba(255,23,68,0) 30%, rgba(255,23,68,0.3) 70%, rgba(255,23,68,0) 100%)'
          : 'linear-gradient(90deg, rgba(0,229,255,0.3) 0%, rgba(0,229,255,0) 30%, rgba(0,229,255,0.3) 70%, rgba(0,229,255,0) 100%)',
        mixBlendMode: 'screen' as const,
        pointerEvents: 'none',
        zIndex: 70,
      }}
    />
  );
};

// ══════════════════════════════════════════════════════════════
// CRT + Vignette Overlay
// ══════════════════════════════════════════════════════════════
const CRTOverlay: React.FC = () => (
  <>
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
      pointerEvents: 'none', zIndex: 300,
    }} />
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)',
      pointerEvents: 'none', zIndex: 301,
    }} />
  </>
);

// ══════════════════════════════════════════════════════════════
// Lyric Display — バイリンガル字幕（タイプライター付き）
// ══════════════════════════════════════════════════════════════
const LyricDisplay: React.FC<{
  line: LyricLine;
  durationInFrames: number;
}> = ({ line, durationInFrames }) => {
  const frame = useCurrentFrame();
  const color = COLOR[line.side];

  // フェードイン/アウト
  const FADE_IN = 6;
  const FADE_OUT = 8;
  const opacity = interpolate(
    frame,
    [0, FADE_IN, durationInFrames - FADE_OUT, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const slideY = interpolate(frame, [0, FADE_IN], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // タイプライター
  const framesPerChar = line.jp.length > 20 ? 1.5 : 2;
  const charsToShow = Math.min(Math.floor(frame / framesPerChar), line.jp.length);

  // isTitle check (for CHECKMATE lines)
  const isTitle = line.jp.includes('CHECKMATE') || line.jp === 'Grid on.' || line.jp === 'Cards fall.' || line.jp.includes('Checkmate or');

  // グリッチ
  const glitchActive = frame % 150 < 2;
  const glitchX = glitchActive ? (pseudoRand(frame, 42) - 0.5) * 2 : 0;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '70px',
        pointerEvents: 'none',
        zIndex: 200,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${slideY}px) translateX(${glitchX}px)`,
          textAlign: 'center',
          maxWidth: '90%',
        }}
      >
        {/* 日本語メイン */}
        <div
          style={{
            fontSize: isTitle ? '56px' : '40px',
            fontWeight: 900,
            fontFamily: isTitle
              ? '"Orbitron", "Inter", sans-serif'
              : '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif',
            letterSpacing: isTitle ? '0.12em' : '0.05em',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            color: color.main,
            textShadow: color.glow,
          }}
        >
          {line.jp.slice(0, charsToShow)}
          {charsToShow < line.jp.length && (
            <span
              style={{
                color: color.main,
                textShadow: color.glow,
                fontWeight: 900,
                opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
              }}
            >
              █
            </span>
          )}
        </div>

        {/* 英語サブ */}
        {line.en && (
          <div
            style={{
              fontSize: '28px',
              fontWeight: 400,
              fontFamily: '"Inter", "Courier New", sans-serif',
              letterSpacing: '0.06em',
              color: color.sub,
              marginTop: '10px',
              opacity: interpolate(frame, [FADE_IN + 5, FADE_IN + 15], [0, 0.8], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            [{line.en}]
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════
// Corner Brackets
// ══════════════════════════════════════════════════════════════
const CornerBrackets: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.03) * 0.15 + 0.3;
  const b = `2px solid rgba(0,229,255,${pulse})`;
  const s = (pos: object, borders: object): React.CSSProperties => ({
    position: 'absolute', width: 40, height: 40, ...pos, ...borders, zIndex: 200,
  });
  return (
    <>
      <div style={s({ top: 16, left: 16 }, { borderTop: b, borderLeft: b })} />
      <div style={s({ top: 16, right: 16 }, { borderTop: b, borderRight: b })} />
      <div style={s({ bottom: 16, left: 16 }, { borderBottom: b, borderLeft: b })} />
      <div style={s({ bottom: 16, right: 16 }, { borderBottom: b, borderRight: b })} />
    </>
  );
};

// ══════════════════════════════════════════════════════════════
// Title Badge — CHECKMATE // ALL-IN 上部表示
// ══════════════════════════════════════════════════════════════
const TitleBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = frame > 15;
  const pulse = Math.floor(frame / 30) % 2 === 0;

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 500,
        opacity: pulse ? 0.9 : 0.5,
      }}
    >
      <div
        style={{
          fontFamily: '"Orbitron", "Inter", sans-serif',
          fontSize: '14px',
          fontWeight: 800,
          letterSpacing: '0.2em',
          color: '#00e5ff',
          textShadow: '0 0 10px rgba(0,229,255,0.6)',
        }}
      >
        ♔ CHECKMATE
      </div>
      <div
        style={{
          width: '2px',
          height: '16px',
          background: 'rgba(255,255,255,0.3)',
        }}
      />
      <div
        style={{
          fontFamily: '"Orbitron", "Inter", sans-serif',
          fontSize: '14px',
          fontWeight: 800,
          letterSpacing: '0.2em',
          color: '#ff1744',
          textShadow: '0 0 10px rgba(255,23,68,0.6)',
        }}
      >
        ALL-IN ♠
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 🎬 Main Composition
// ══════════════════════════════════════════════════════════════
export const CamelotPVPComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 背景動画 */}
      <Video
        src={staticFile('videos/CamelotPVP.mp4')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* VFX レイヤー */}
      <ChessGrid />
      <CardParticles />
      <GlitchScanline />
      <CRTOverlay />
      <CornerBrackets />
      <TitleBadge />

      {/* 字幕シーケンス */}
      {LYRICS.map((line) => {
        const from = f(line.startSec);
        const duration = f(line.endSec) - from;
        return (
          <Sequence key={line.id} from={from} durationInFrames={duration} layout="none">
            <LyricDisplay line={line} durationInFrames={duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
