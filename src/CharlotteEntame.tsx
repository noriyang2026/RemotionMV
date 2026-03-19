/**
 * CharlotteEntame.tsx
 * ── シャルロット × エンタメ昇華 配信風 LIVE テロップ ──
 *
 * CharlotteCrypto.tsx と同じ演出構成:
 *  1. 🔴 LIVE バッジ（点滅）+ 視聴者数 + タイムコード
 *  2. ● REC 録画中インジケーター
 *  3. AIVTuber風 タイプライター字幕（グリッチ + ネオングロー）
 *  4. CRT スキャンライン + ビネット
 *  5. チャンネルロゴ / ハンドルネーム
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Video,
  Audio,
  staticFile,
} from 'remotion';

// ── 定数 ──────────────────────────────────────────────────────
const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

// ── 字幕データ ────────────────────────────────────────────────
interface SubLine {
  id: string;
  text: string;
  startSec: number;
  endSec: number;
  highlights?: string[];
  yellowHighlights?: string[];
}

const SUBS: SubLine[] = [
  {
    id: 's1',
    text: 'うちのマスターがまた呆れてるわ。\n『AIで簡単自動化！』って騒ぐのはいいけど、その先の未来（IP）を考えてないなら意味ないじゃんって。',
    startSec: 0.5,
    endSec: 13.0,
    highlights: ['呆れてるわ'],
    yellowHighlights: ['AIで簡単自動化！'],
  },
  {
    id: 's2',
    text: 'しかも最近、人を囲って『リポストしてね！』って同調圧力かける宗教みたいなやり方流行ってるわよね。',
    startSec: 13.0,
    endSec: 21.0,
    highlights: ['宗教みたいな'],
    yellowHighlights: ['リポストしてね！'],
  },
  {
    id: 's3',
    text: 'あんな薄っぺらいのに騙されちゃダメよ？ 私の視聴者はもっと本質を見なさい！',
    startSec: 24.0,
    endSec: 29.5,
    highlights: ['本質を見なさい！'],
  },
];

// ── ユーティリティ ─────────────────────────────────────────────
function pseudoRand(frame: number, seed: number): number {
  return Math.abs(Math.sin(frame * 0.731 + seed * 9.17)) % 1;
}
function pseudoHex(frame: number, seed: number, len: number): string {
  const digits = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < len; i++) {
    const idx = Math.floor(
      Math.abs(Math.sin(frame * 0.07 + seed * 3.7 + i * 1.3) * 16)
    );
    result += digits[idx % 16];
  }
  return result;
}

// ── グロー定義 ────────────────────────────────────────────────
const GLOW_NORMAL = '0 0 6px rgba(0,255,255,0.25)';
const GLOW_PINK = '0 0 8px #ff4488, 0 0 20px rgba(255,68,136,0.6)';
const GLOW_YELLOW = '0 0 8px #ffdd00, 0 0 20px rgba(255,221,0,0.7)';

// ══════════════════════════════════════════════════════════════
// LIVE Badge
// ══════════════════════════════════════════════════════════════
const LiveBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = frame / fps;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(Math.floor(elapsed % 60)).padStart(2, '0');
  const liveVisible = Math.floor(frame / 20) % 2 === 0;
  const viewers = 2341 + Math.floor(Math.sin(frame * 0.04) * 127);

  return (
    <div style={{ position: 'absolute', top: 28, left: 32, display: 'flex', alignItems: 'center', gap: '14px', zIndex: 500 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: liveVisible ? 'linear-gradient(135deg, #ff1744 0%, #ff4081 100%)' : 'rgba(255,23,68,0.4)',
        padding: '4px 14px 4px 10px', borderRadius: '4px',
        boxShadow: liveVisible ? '0 0 16px rgba(255,23,68,0.6), 0 0 40px rgba(255,23,68,0.2)' : 'none',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', boxShadow: '0 0 4px #fff' }} />
        <span style={{ color: '#fff', fontFamily: '"Orbitron", "Inter", sans-serif', fontWeight: 800, fontSize: '14px', letterSpacing: '0.15em' }}>LIVE</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: '"Inter", "Noto Sans JP", sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
        <span>👁</span><span style={{ fontWeight: 600 }}>{viewers.toLocaleString()}</span>
      </div>
      <div style={{ fontFamily: '"Courier New", monospace', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>{mm}:{ss}</div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// REC Indicator
// ══════════════════════════════════════════════════════════════
const RECIndicator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = frame / fps;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(Math.floor(elapsed % 60)).padStart(2, '0');
  const ff = String(frame % fps).padStart(2, '0');
  const dotVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <div style={{ position: 'absolute', top: 30, right: 32, display: 'flex', alignItems: 'center', gap: '10px', zIndex: 500 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontFamily: '"Courier New", "Orbitron", monospace', fontSize: '14px', fontWeight: 700,
        letterSpacing: '0.12em', color: '#ff2244', textShadow: '0 0 8px rgba(255,34,68,0.8)',
        opacity: dotVisible ? 1 : 0.3,
      }}>
        <span style={{ fontSize: '18px' }}>●</span><span>REC</span>
      </div>
      <div style={{ fontFamily: '"Courier New", monospace', fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>{mm}:{ss}:{ff}</div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// Channel Bar
// ══════════════════════════════════════════════════════════════
const ChannelBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterSpring = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });
  const hexTag = pseudoHex(frame, 7, 4);

  return (
    <div style={{
      position: 'absolute', bottom: 28, right: 32,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px',
      opacity: enterSpring, transform: `translateX(${interpolate(enterSpring, [0, 1], [30, 0])}px)`, zIndex: 400,
    }}>
      <div style={{ fontFamily: '"Orbitron", "Inter", sans-serif', fontSize: '13px', fontWeight: 700, color: '#00e5ff', letterSpacing: '0.1em', textShadow: '0 0 10px rgba(0,229,255,0.5)' }}>
        CHARLOTTE_CH // LIVE
      </div>
      <div style={{ fontFamily: '"Courier New", monospace', fontSize: '10px', color: 'rgba(0,229,255,0.45)', letterSpacing: '0.08em' }}>
        CATEGORY: ENTAME_TALK // 0x{hexTag}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// CyberTypingText
// ══════════════════════════════════════════════════════════════
const CyberTypingText: React.FC<{
  text: string;
  highlights?: string[];
  yellowHighlights?: string[];
}> = ({ text, highlights = [], yellowHighlights = [] }) => {
  const frame = useCurrentFrame();
  const framesPerChar = 2;
  const charsToShow = Math.min(Math.floor(frame / framesPerChar), text.length);
  const isTyping = charsToShow < text.length;
  const cursorVisible = isTyping || Math.floor(frame / 10) % 2 === 0;

  const glitchActive = frame % 90 < 4 || (frame > 30 && frame % 60 < 3);
  const glitchOffsetX = glitchActive ? (pseudoRand(frame, 42) - 0.5) * 6 : 0;

  const highlightRanges: { start: number; end: number }[] = [];
  for (const kw of highlights) {
    let searchFrom = 0;
    while (true) {
      const idx = text.indexOf(kw, searchFrom);
      if (idx === -1) break;
      highlightRanges.push({ start: idx, end: idx + kw.length });
      searchFrom = idx + kw.length;
    }
  }

  const yellowRanges: { start: number; end: number }[] = [];
  for (const kw of yellowHighlights) {
    let searchFrom = 0;
    while (true) {
      const idx = text.indexOf(kw, searchFrom);
      if (idx === -1) break;
      yellowRanges.push({ start: idx, end: idx + kw.length });
      searchFrom = idx + kw.length;
    }
  }

  const isHighlighted = (i: number) => highlightRanges.some((r) => i >= r.start && i < r.end);
  const isYellowHighlighted = (i: number) => yellowRanges.some((r) => i >= r.start && i < r.end);

  return (
    <div style={{ position: 'relative' }}>
      {glitchActive && (
        <div style={{
          position: 'absolute', top: 0, left: glitchOffsetX + 2, width: '100%',
          opacity: 0.35, color: '#ff0040', fontSize: '36px', fontWeight: 700,
          fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif',
          letterSpacing: '0.04em', lineHeight: 1.65, whiteSpace: 'pre-wrap',
          pointerEvents: 'none', mixBlendMode: 'screen' as const,
        }}>
          {text.slice(0, charsToShow)}
        </div>
      )}
      <div style={{
        fontSize: '36px', fontWeight: 700,
        fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif',
        lineHeight: 1.65, letterSpacing: '0.04em', whiteSpace: 'pre-wrap',
        transform: glitchActive ? `translateX(${glitchOffsetX}px)` : undefined,
      }}>
        {text.slice(0, charsToShow).split('').map((char, i) => {
          const isHL = isHighlighted(i);
          const isYL = isYellowHighlighted(i);
          const isJustTyped = i === charsToShow - 1;
          return (
            <span key={i} style={{
              color: isYL ? '#ffdd00' : isHL ? '#ff4488' : isJustTyped ? '#00ffff' : '#f0f4f8',
              textShadow: isYL ? GLOW_YELLOW : isHL ? GLOW_PINK : isJustTyped ? '0 0 20px #00ffff, 0 0 40px #00ffff' : GLOW_NORMAL,
              display: 'inline',
            }}>{char}</span>
          );
        })}
        {cursorVisible && (
          <span style={{ color: '#00e5ff', textShadow: '0 0 12px #00e5ff, 0 0 30px rgba(0,229,255,0.5)', fontWeight: 900 }}>█</span>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SubtitleBar
// ══════════════════════════════════════════════════════════════
const SubtitleBar: React.FC<{ sub: SubLine; durationInFrames: number }> = ({ sub, durationInFrames }) => {
  const frame = useCurrentFrame();
  const FADE_IN = 8;
  const FADE_OUT = 10;
  const opacity = interpolate(frame, [0, FADE_IN, durationInFrames - FADE_OUT, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, FADE_IN], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '80px', pointerEvents: 'none', zIndex: 100 }}>
      <div style={{ opacity, transform: `translateY(${translateY}px)`, maxWidth: '88%', textAlign: 'left' }}>
        <div style={{
          background: 'linear-gradient(180deg, rgba(0,8,20,0.82) 0%, rgba(0,4,12,0.75) 100%)',
          backdropFilter: 'blur(10px)', borderRadius: '8px',
          padding: '22px 40px 24px 28px',
          border: '1px solid rgba(0,229,255,0.18)', borderLeft: '3px solid rgba(255,68,136,0.7)',
          boxShadow: '0 0 30px rgba(0,229,255,0.06), 0 4px 24px rgba(0,0,0,0.6)',
        }}>
          <div style={{
            fontFamily: '"Orbitron", "Inter", sans-serif', fontSize: '12px', fontWeight: 700,
            color: '#ff4488', letterSpacing: '0.15em', marginBottom: '8px',
            textShadow: '0 0 8px rgba(255,68,136,0.4)',
          }}>◆ CHARLOTTE</div>
          <CyberTypingText text={sub.text} highlights={sub.highlights} yellowHighlights={sub.yellowHighlights} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════
// CyberpunkOverlay — Scanlines + Vignette (no flicker)
// ══════════════════════════════════════════════════════════════
const CyberpunkOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
    <div style={{ width: '100%', height: '100%' }}>{children}</div>
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
      pointerEvents: 'none', zIndex: 300,
    }} />
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'radial-gradient(circle, rgba(0,0,0,0) 55%, rgba(0,12,20,0.55) 100%)',
      boxShadow: 'inset 0 0 120px rgba(0,229,255,0.05)', pointerEvents: 'none', zIndex: 301,
    }} />
  </div>
);

// ══════════════════════════════════════════════════════════════
// Corner Brackets
// ══════════════════════════════════════════════════════════════
const CornerBrackets: React.FC = () => {
  const b = '2px solid rgba(0,229,255,0.3)';
  const s = (pos: object, borders: object): React.CSSProperties => ({ position: 'absolute', width: 32, height: 32, ...pos, ...borders, zIndex: 200 });
  return (
    <>
      <div style={s({ top: 20, left: 20 }, { borderTop: b, borderLeft: b })} />
      <div style={s({ top: 20, right: 20 }, { borderTop: b, borderRight: b })} />
      <div style={s({ bottom: 20, left: 20 }, { borderBottom: b, borderLeft: b })} />
      <div style={s({ bottom: 20, right: 20 }, { borderBottom: b, borderRight: b })} />
    </>
  );
};

// ══════════════════════════════════════════════════════════════
// 🎬 Main Composition
// ══════════════════════════════════════════════════════════════
export const CharlotteEntame: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* BGM */}
      <Audio
        src={staticFile('music/CHECKMATE_ALL-IN.wav')}
        volume={0.3}
      />
      <CyberpunkOverlay>
        <Video
          src={staticFile('videos/シャルロット＿セリフエンタメ昇華.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <LiveBadge />
        <RECIndicator />
        <ChannelBar />
        <CornerBrackets />
        {SUBS.map((sub) => {
          const from = f(sub.startSec);
          const duration = f(sub.endSec) - from;
          return (
            <Sequence key={sub.id} from={from} durationInFrames={duration} layout="none">
              <SubtitleBar sub={sub} durationInFrames={duration} />
            </Sequence>
          );
        })}
      </CyberpunkOverlay>
    </AbsoluteFill>
  );
};
