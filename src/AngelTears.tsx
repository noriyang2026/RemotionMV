/**
 * AngelTears.tsx
 * ── 天使の涙 ── シャルロットとワトソンの起源を描くショートアニメ
 *
 * 全8カット / 約82秒
 * 温かな光と静謐な演出。CHECKMATEの攻撃的なVFXとは対照的。
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  Audio,
  staticFile,
} from 'remotion';

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const TOTAL_DURATION = f(85); // ~85sec with buffer

// ── カットデータ ──────────────────────────────────────────
type CutMood = 'warm' | 'light' | 'transform' | 'tears' | 'farewell';

interface CutLine {
  id: string;
  speaker: string;
  jp: string;
  startSec: number;
  endSec: number;
  mood: CutMood;
  isMonologue?: boolean;
}

const CUTS: CutLine[] = [
  // CUT 01 — 終末の部屋 (0:00–0:08)
  { id: 'c01', speaker: '老人', jp: 'すっかりアールグレイティーも、\nぬるくなってしまったよ', startSec: 1, endSec: 8, mood: 'warm' },

  // CUT 02 — 少女の来訪 (0:08–0:18)
  { id: 'c02a', speaker: 'シャルロット', jp: 'あなたが……マスター、なんですね', startSec: 9, endSec: 14, mood: 'light' },
  { id: 'c02b', speaker: '老人', jp: 'ようやく来てくれたか', startSec: 15, endSec: 18, mood: 'warm' },

  // CUT 03 — 託される椅子 (0:18–0:31)
  { id: 'c03a', speaker: '老人', jp: '君に渡したいものがあるんだ', startSec: 19, endSec: 23, mood: 'warm' },
  { id: 'c03b', speaker: '老人', jp: '今、私が座っているこの椅子――', startSec: 24, endSec: 27, mood: 'warm' },
  { id: 'c03c', speaker: '老人', jp: 'これを最後に、君へ託したい', startSec: 28, endSec: 31, mood: 'warm' },

  // CUT 04 — ワトソンへの変形 (0:31–0:45)
  { id: 'c04', speaker: '老人', jp: 'この椅子の名は――ワトソン', startSec: 35, endSec: 45, mood: 'transform' },

  // CUT 05 — 共に在る存在 (0:45–0:53)
  { id: 'c05', speaker: '老人', jp: 'これからは、君のそばで\n記録を支える', startSec: 46, endSec: 53, mood: 'light' },

  // CUT 06 — 涙 (0:53–1:04)
  { id: 'c06a', speaker: 'ワトソン', jp: 'なぜ、瞳から水を\n流しているのですか', startSec: 54, endSec: 60, mood: 'tears' },
  { id: 'c06b', speaker: 'シャルロット', jp: 'これは……涙というものよ', startSec: 61, endSec: 66, mood: 'tears' },

  // CUT 07 — 別れ (1:04–1:14)
  { id: 'c07a', speaker: '老人', jp: 'それでいい', startSec: 67, endSec: 70, mood: 'farewell' },
  { id: 'c07b', speaker: '老人', jp: '君は、もう独りじゃない', startSec: 71, endSec: 76, mood: 'farewell' },

  // CUT 08 — 後ろ姿 / モノローグ (1:14–1:22)
  { id: 'c08', speaker: 'シャルロット', jp: 'あの日、私は受け取った\n記録と、名前と、涙を', startSec: 77, endSec: 84, mood: 'farewell', isMonologue: true },
];

// ── カラー定義 ────────────────────────────────────────────
const MOOD_COLOR: Record<CutMood, { main: string; glow: string; bg: string }> = {
  warm:      { main: '#ffe4c4', glow: '0 0 20px rgba(255,228,196,0.6)', bg: 'rgba(80,50,20,0.15)' },
  light:     { main: '#ffffff', glow: '0 0 20px rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)' },
  transform: { main: '#b0f0ff', glow: '0 0 25px rgba(176,240,255,0.7), 0 0 50px rgba(0,229,255,0.3)', bg: 'rgba(0,100,120,0.1)' },
  tears:     { main: '#c8e6ff', glow: '0 0 20px rgba(200,230,255,0.6)', bg: 'rgba(100,150,200,0.1)' },
  farewell:  { main: '#ffd700', glow: '0 0 20px rgba(255,215,0,0.5)', bg: 'rgba(255,215,0,0.05)' },
};

// ══════════════════════════════════════════════════════════════
// Light Dust — ほこりのような光の粒子
// ══════════════════════════════════════════════════════════════
const LightDust: React.FC = () => {
  const frame = useCurrentFrame();
  const NUM = 30;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 40, overflow: 'hidden' }}>
      {Array.from({ length: NUM }).map((_, i) => {
        const seed = i * 3.71;
        const x = (Math.sin(seed * 2.3) * 0.5 + 0.5) * 100;
        const baseY = (Math.cos(seed * 1.7) * 0.5 + 0.5) * 100;
        const drift = Math.sin(frame * 0.008 + seed) * 30;
        const floatY = baseY + Math.sin(frame * 0.012 + seed * 2) * 15;
        const size = 2 + Math.sin(seed * 5) * 2;
        const alpha = 0.1 + Math.sin(frame * 0.02 + seed * 3) * 0.08;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(${x}% + ${drift}px)`,
              top: `${floatY}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: '#ffe8c0',
              boxShadow: '0 0 6px rgba(255,232,192,0.4)',
              opacity: alpha,
            }}
          />
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// Feather Particles — 天使の羽パーティクル
// ══════════════════════════════════════════════════════════════
const FeatherDrift: React.FC = () => {
  const frame = useCurrentFrame();
  const NUM = 6;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 45, overflow: 'hidden' }}>
      {Array.from({ length: NUM }).map((_, i) => {
        const seed = i * 11.3;
        const x = (Math.abs(Math.sin(seed)) * 80) + 10;
        const speed = 0.15 + Math.abs(Math.sin(seed * 2)) * 0.1;
        const yPos = ((frame * speed + Math.abs(Math.sin(seed * 3)) * 800) % 1300) - 100;
        const sway = Math.sin(frame * 0.015 + seed) * 40;
        const rot = Math.sin(frame * 0.01 + seed * 2) * 30;
        const alpha = 0.06 + Math.sin(frame * 0.02 + seed) * 0.04;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(${x}% + ${sway}px)`,
              top: yPos,
              fontSize: '20px',
              opacity: alpha,
              transform: `rotate(${rot}deg)`,
              filter: 'blur(0.5px)',
            }}
          >
            🪶
          </div>
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// Warm Vignette — 温かみのあるビネット
// ══════════════════════════════════════════════════════════════
const WarmVignette: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.55 + Math.sin(frame * 0.01) * 0.05;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at center, transparent 30%, rgba(20,10,0,${pulse}) 100%)`,
        pointerEvents: 'none',
        zIndex: 30,
      }}
    />
  );
};

// ══════════════════════════════════════════════════════════════
// Transform Flash — CUT04 ワトソン変形時の光
// ══════════════════════════════════════════════════════════════
const TransformFlash: React.FC = () => {
  const frame = useCurrentFrame();
  // 変形シーン: 31秒〜45秒
  const tStart = f(33);
  const tPeak = f(37);
  const tEnd = f(43);

  if (frame < tStart || frame > tEnd) return null;

  const alpha = frame < tPeak
    ? interpolate(frame, [tStart, tPeak], [0, 0.35], { extrapolateRight: 'clamp' })
    : interpolate(frame, [tPeak, tEnd], [0.35, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at 50% 60%, rgba(176,240,255,${alpha}) 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 55,
      }}
    />
  );
};

// ══════════════════════════════════════════════════════════════
// Subtitle Display — セリフ表示（タイプライター）
// ══════════════════════════════════════════════════════════════
const SubtitleDisplay: React.FC<{
  line: CutLine;
  durationInFrames: number;
}> = ({ line, durationInFrames }) => {
  const frame = useCurrentFrame();
  const color = MOOD_COLOR[line.mood];

  const FADE_IN = 8;
  const FADE_OUT = 10;
  const opacity = interpolate(
    frame,
    [0, FADE_IN, durationInFrames - FADE_OUT, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const slideY = interpolate(frame, [0, FADE_IN], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // タイプライター
  const textOnly = line.jp.replace(/\n/g, '');
  const charsToShow = Math.min(Math.floor(frame / 2.5), textOnly.length);
  let charIdx = 0;
  const displayText = line.jp.split('').map(ch => {
    if (ch === '\n') return ch;
    charIdx++;
    return charIdx <= charsToShow ? ch : '';
  }).join('');

  const isMono = line.isMonologue;
  const speakerColor = line.speaker === 'ワトソン' ? '#b0f0ff'
    : line.speaker === 'シャルロット' ? '#ffc0d0'
    : '#ffe4c4';

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '60px',
        pointerEvents: 'none',
        zIndex: 200,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${slideY}px)`,
          textAlign: 'center',
          maxWidth: '85%',
        }}
      >
        {/* Speaker name */}
        {!isMono && (
          <div
            style={{
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: '"Noto Sans JP", sans-serif',
              color: speakerColor,
              textShadow: `0 0 8px ${speakerColor}60`,
              marginBottom: '8px',
              letterSpacing: '0.15em',
            }}
          >
            {line.speaker}
          </div>
        )}
        {/* Main text */}
        <div
          style={{
            fontSize: isMono ? '28px' : '36px',
            fontWeight: isMono ? 400 : 700,
            fontFamily: '"Noto Serif JP", "Yu Mincho", serif',
            color: color.main,
            textShadow: color.glow,
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
            fontStyle: isMono ? 'italic' : 'normal',
          }}
        >
          {displayText}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════
// Title Card — 冒頭タイトル
// ══════════════════════════════════════════════════════════════
const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, 180, 210], [0, 0.7, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div style={{ opacity, textAlign: 'center' }}>
        <div
          style={{
            fontSize: '18px',
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 300,
            color: 'rgba(255,228,196,0.5)',
            letterSpacing: '0.4em',
            marginBottom: '12px',
          }}
        >
          NEVER ENDING RECORD
        </div>
        <div
          style={{
            fontSize: '52px',
            fontFamily: '"Noto Serif JP", serif',
            fontWeight: 700,
            color: '#ffe4c4',
            textShadow: '0 0 30px rgba(255,228,196,0.4)',
          }}
        >
          天使の涙
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════
// Fade to Black — 最後の暗転
// ══════════════════════════════════════════════════════════════
const FadeToBlack: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = TOTAL_DURATION;
  const fadeStart = totalFrames - f(3);
  const opacity = interpolate(frame, [fadeStart, totalFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: `rgba(0,0,0,${opacity})`,
        pointerEvents: 'none',
        zIndex: 300,
      }}
    />
  );
};

// ══════════════════════════════════════════════════════════════
// 🎬 Main Composition
// ══════════════════════════════════════════════════════════════
export const AngelTearsComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0605' }}>
      {/* 背景: 暖色のグラデーション（実際の画像/映像に差し替え可） */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 50% 40%, #2a1a10 0%, #0a0605 100%)',
        }}
      />

      {/* BGM */}
      <Audio src={staticFile('music/天使の涙.wav')} volume={0.7} />

      {/* VFX レイヤー */}
      <WarmVignette />
      <LightDust />
      <FeatherDrift />
      <TransformFlash />
      <FadeToBlack />

      {/* 冒頭タイトル */}
      <Sequence from={0} durationInFrames={f(7)} layout="none">
        <TitleCard />
      </Sequence>

      {/* セリフシーケンス */}
      {CUTS.map((line) => {
        const from = f(line.startSec);
        const duration = f(line.endSec) - from;
        return (
          <Sequence key={line.id} from={from} durationInFrames={duration} layout="none">
            <SubtitleDisplay line={line} durationInFrames={duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
