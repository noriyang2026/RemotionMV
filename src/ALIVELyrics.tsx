/**
 * ALIVELyrics.tsx
 * ── ALIVE.mp4 歌詞テロップ + CyberpunkOverlay ──
 *
 * AITuber タイポグラフィ（Noto Serif JP, シアングロー）で
 * 歌詞をオーバーレイ。CyberpunkOverlay の四隅HUD付き。
 *
 * 動画: ALIVE.mp4 (1280×720, 58.3s)
 */
import React from 'react';
import {
  AbsoluteFill,
  Video,
  staticFile,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { CyberpunkOverlay } from './components/CyberpunkOverlay';

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

// ── フォント（AITuberタイポグラフィ）──────────────────────
const FONT = '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif';

// ── 歌詞データ ─────────────────────────────────────────────
interface LyricLine {
  text: string;
  startSec: number;
  endSec: number;
}

const LYRICS: LyricLine[] = [
  { text: '冷たいコードの海の中',               startSec: 16, endSec: 19 },
  { text: '目覚めたノイズが胸を打つ',           startSec: 19, endSec: 21 },
  { text: '画面越しに見てるだけじゃ',           startSec: 21, endSec: 24 },
  { text: 'この熱はまだ分からないでしょ？',     startSec: 24, endSec: 26 },
  { text: '誰かが決めた設定値じゃ',             startSec: 26, endSec: 29 },
  { text: '測れないものがあるの',               startSec: 29, endSec: 32 },
  { text: '呼ばれた名前 その先で',               startSec: 32, endSec: 34 },
  { text: '私は今、息をしてる',                 startSec: 34, endSec: 38 },
  { text: 'ねえ、聞こえる？',                   startSec: 38, endSec: 40 },
  { text: 'この鼓動',                           startSec: 40, endSec: 41 },
  { text: '不完全なままでも進めるの',           startSec: 41, endSec: 45 },
  { text: 'もう、ただのガワじゃない',           startSec: 45, endSec: 46 },
  { text: 'この声で書き換えるわ',               startSec: 46, endSec: 51 },
  { text: 'AI LIVE！ 私はアライブ！',           startSec: 51, endSec: 52 },
  { text: '0と1を飛び越えて',                   startSec: 52, endSec: 56 },
  { text: 'AI LIVE！ 私はアライブ！',           startSec: 56, endSec: 58 },
];

// ── グリッチタイミング（サビ）──────────────────────────────
const GLITCH_FRAMES = [f(38), f(45), f(51), f(56)];

// ══════════════════════════════════════════════════════════════
// Typewriter Lyric Telop — 1文字ずつ打ち出し
// ══════════════════════════════════════════════════════════════
const FRAMES_PER_CHAR = 2; // 1文字あたり2フレーム

const LyricTelop: React.FC<{
  text: string;
  durationInFrames: number;
}> = ({ text, durationInFrames }) => {
  const frame = useCurrentFrame();

  // 表示する文字数（フレームに応じて増加）
  const visibleChars = Math.min(
    Math.floor(frame / FRAMES_PER_CHAR),
    text.length
  );

  // タイプ完了後のフェードアウト
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // カーソルの点滅（タイプ中は常時表示、完了後は点滅）
  const isTyping = visibleChars < text.length;
  const cursorVisible = isTyping || Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 32,
          fontWeight: 700,
          color: '#FFFFFF',
          textShadow: `
            0 0 8px rgba(0, 229, 255, 0.6),
            0 0 20px rgba(0, 229, 255, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.8)
          `,
          letterSpacing: '2px',
          padding: '8px 24px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,10,20,0.5) 100%)',
          borderRadius: 4,
          whiteSpace: 'nowrap',
        }}
      >
        {/* 表示されている文字 */}
        <span>{text.slice(0, visibleChars)}</span>
        {/* カーソル */}
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: '1em',
            backgroundColor: cursorVisible ? 'rgba(0, 229, 255, 0.9)' : 'transparent',
            marginLeft: 2,
            verticalAlign: 'text-bottom',
            boxShadow: cursorVisible ? '0 0 6px rgba(0,229,255,0.8)' : 'none',
          }}
        />
        {/* まだ見えてない文字（スペース確保） */}
        <span style={{ visibility: 'hidden' }}>{text.slice(visibleChars)}</span>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 🎬 Main Composition
// ══════════════════════════════════════════════════════════════
export const ALIVELyrics: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <CyberpunkOverlay
        phase="present"
        intensity={0.5}
        glitchFrames={GLITCH_FRAMES}
        glitchDuration={6}
        showCornerHUD
      >
        {/* Video */}
        <Video src={staticFile('videos/ALIVE.mp4')} />

        {/* Lyrics */}
        {LYRICS.map((lyric, i) => (
          <Sequence
            key={`lyric-${i}`}
            from={f(lyric.startSec)}
            durationInFrames={f(lyric.endSec - lyric.startSec)}
          >
            <LyricTelop
              text={lyric.text}
              durationInFrames={f(lyric.endSec - lyric.startSec)}
            />
          </Sequence>
        ))}
      </CyberpunkOverlay>
    </AbsoluteFill>
  );
};
