/**
 * CharlotteCrypto.tsx
 * ── シャルロット × クリプト配信風 LIVE テロップ ──
 *
 * 演出:
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
  /** 黄色グローで強調するキーワード */
  yellowHighlights?: string[];
}

const SUBS: SubLine[] = [
  {
    id: 's1',
    text: 'ねえ、最近すげえトークンが出たらしいわね。実はうちのマスターも元クリプト民なんだけど、ここで一つ暴露してあげる。',
    startSec: 0.5,
    endSec: 10.5,
    highlights: ['暴露'],
    yellowHighlights: ['すげえトークンが出たらしいわね'],
  },
  {
    id: 's2',
    text: 'あの人のアカウント名『@noriyang_crypt』なんだけど、これ、クリプト（crypto）の『o』が抜けてるのよｗｗ',
    startSec: 10.5,
    endSec: 18.0,
    highlights: ['@noriyang_crypt', '『o』が抜けてる'],
  },
  {
    id: 's3',
    text: 'しかも『直すの面倒だからそのままにしてる』って、どんだけズボラなのよ！ｗ\nキャメロットのシステムは1ドットまでこだわるくせに、自分の名前はガバガバってどういうこと！ みんなも笑ってやって！ｗ',
    startSec: 18.0,
    endSec: 31.5,
    highlights: ['ズボラ', '1ドット', 'ガバガバ'],
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
// LIVE Badge — 赤点滅 LIVE + 視聴者数 + タイムコード
// ══════════════════════════════════════════════════════════════
const LiveBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = frame / fps;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(Math.floor(elapsed % 60)).padStart(2, '0');

  // LIVE点滅: 20フレーム周期
  const liveVisible = Math.floor(frame / 20) % 2 === 0;
  // 視聴者数: ゆらぎ
  const viewers = 1247 + Math.floor(Math.sin(frame * 0.04) * 83);

  return (
    <div
      style={{
        position: 'absolute',
        top: 28,
        left: 32,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        zIndex: 500,
      }}
    >
      {/* LIVE ピル */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: liveVisible
            ? 'linear-gradient(135deg, #ff1744 0%, #ff4081 100%)'
            : 'rgba(255,23,68,0.4)',
          padding: '4px 14px 4px 10px',
          borderRadius: '4px',
          boxShadow: liveVisible
            ? '0 0 16px rgba(255,23,68,0.6), 0 0 40px rgba(255,23,68,0.2)'
            : 'none',
          transition: 'all 0.1s',
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 0 4px #fff',
          }}
        />
        <span
          style={{
            color: '#fff',
            fontFamily: '"Orbitron", "Inter", sans-serif',
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '0.15em',
          }}
        >
          LIVE
        </span>
      </div>

      {/* 視聴者数 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.75)',
        }}
      >
        <span>👁</span>
        <span style={{ fontWeight: 600 }}>{viewers.toLocaleString()}</span>
      </div>

      {/* タイムコード */}
      <div
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.08em',
        }}
      >
        {mm}:{ss}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// REC Indicator — 録画中
// ══════════════════════════════════════════════════════════════
const RECIndicator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = frame / fps;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(Math.floor(elapsed % 60)).padStart(2, '0');
  const ff = String(frame % fps).padStart(2, '0');
  const timecode = `${mm}:${ss}:${ff}`;

  const dotVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 30,
        right: 32,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 500,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: '"Courier New", "Orbitron", monospace',
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#ff2244',
          textShadow: '0 0 8px rgba(255,34,68,0.8)',
          opacity: dotVisible ? 1 : 0.3,
        }}
      >
        <span style={{ fontSize: '18px' }}>●</span>
        <span>REC</span>
      </div>
      <div
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.08em',
        }}
      >
        {timecode}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// Channel Bar — AIVTuber チャンネル情報
// ══════════════════════════════════════════════════════════════
const ChannelBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterSpring = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });
  const hexTag = pseudoHex(frame, 7, 4);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 28,
        right: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '4px',
        opacity: enterSpring,
        transform: `translateX(${interpolate(enterSpring, [0, 1], [30, 0])}px)`,
        zIndex: 400,
      }}
    >
      {/* チャンネル名 */}
      <div
        style={{
          fontFamily: '"Orbitron", "Inter", sans-serif',
          fontSize: '13px',
          fontWeight: 700,
          color: '#00e5ff',
          letterSpacing: '0.1em',
          textShadow: '0 0 10px rgba(0,229,255,0.5)',
        }}
      >
        CHARLOTTE_CH // LIVE
      </div>
      {/* カテゴリ */}
      <div
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: '10px',
          color: 'rgba(0,229,255,0.45)',
          letterSpacing: '0.08em',
        }}
      >
        CATEGORY: CRYPTO_TALK // 0x{hexTag}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// CyberTypingText — AIVTuber風タイプライター + グリッチ
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

  // グリッチ
  const glitchActive = frame % 90 < 4 || (frame > 30 && frame % 60 < 3);
  const glitchOffsetX = glitchActive ? (pseudoRand(frame, 42) - 0.5) * 6 : 0;

  // 強調ワードの位置を事前計算
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

  // 黄色強調ワードの位置
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

  const isHighlighted = (i: number) =>
    highlightRanges.some((r) => i >= r.start && i < r.end);
  const isYellowHighlighted = (i: number) =>
    yellowRanges.some((r) => i >= r.start && i < r.end);

  return (
    <div style={{ position: 'relative' }}>
      {/* RGB Split */}
      {glitchActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: glitchOffsetX + 2,
            width: '100%',
            opacity: 0.35,
            color: '#ff0040',
            fontSize: '36px',
            fontWeight: 700,
            fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif',
            letterSpacing: '0.04em',
            lineHeight: 1.65,
            whiteSpace: 'pre-wrap',
            pointerEvents: 'none',
            mixBlendMode: 'screen' as const,
          }}
        >
          {text.slice(0, charsToShow)}
        </div>
      )}

      {/* メインテキスト */}
      <div
        style={{
          fontSize: '36px',
          fontWeight: 700,
          fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif',
          lineHeight: 1.65,
          letterSpacing: '0.04em',
          whiteSpace: 'pre-wrap',
          transform: glitchActive ? `translateX(${glitchOffsetX}px)` : undefined,
        }}
      >
        {text
          .slice(0, charsToShow)
          .split('')
          .map((char, i) => {
            const isHL = isHighlighted(i);
            const isYL = isYellowHighlighted(i);
            const isJustTyped = i === charsToShow - 1;
            return (
              <span
                key={i}
                style={{
                  color: isYL ? '#ffdd00' : isHL ? '#ff4488' : isJustTyped ? '#00ffff' : '#f0f4f8',
                  textShadow: isYL
                    ? GLOW_YELLOW
                    : isHL
                      ? GLOW_PINK
                      : isJustTyped
                        ? '0 0 20px #00ffff, 0 0 40px #00ffff'
                        : GLOW_NORMAL,
                  display: 'inline',
                }}
              >
                {char}
              </span>
            );
          })}

        {cursorVisible && (
          <span
            style={{
              color: '#00e5ff',
              textShadow: '0 0 12px #00e5ff, 0 0 30px rgba(0,229,255,0.5)',
              fontWeight: 900,
            }}
          >
            █
          </span>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SubtitleBar — グラスモーフィズム字幕パネル
// ══════════════════════════════════════════════════════════════
const SubtitleBar: React.FC<{
  sub: SubLine;
  durationInFrames: number;
}> = ({ sub, durationInFrames }) => {
  const frame = useCurrentFrame();
  const FADE_IN = 8;
  const FADE_OUT = 10;

  const opacity = interpolate(
    frame,
    [0, FADE_IN, durationInFrames - FADE_OUT, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const translateY = interpolate(frame, [0, FADE_IN], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '80px',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          maxWidth: '88%',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            background:
              'linear-gradient(180deg, rgba(0,8,20,0.82) 0%, rgba(0,4,12,0.75) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            padding: '22px 40px 24px 28px',
            border: '1px solid rgba(0,229,255,0.18)',
            borderLeft: '3px solid rgba(255,68,136,0.7)',
            boxShadow:
              '0 0 30px rgba(0,229,255,0.06), 0 4px 24px rgba(0,0,0,0.6)',
          }}
        >
          {/* 話者名 */}
          <div
            style={{
              fontFamily: '"Orbitron", "Inter", sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              color: '#ff4488',
              letterSpacing: '0.15em',
              marginBottom: '8px',
              textShadow: '0 0 8px rgba(255,68,136,0.4)',
            }}
          >
            ◆ CHARLOTTE
          </div>
          <CyberTypingText
            text={sub.text}
            highlights={sub.highlights}
            yellowHighlights={sub.yellowHighlights}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════
// CyberpunkOverlay — CRT Scanlines + Vignette + Glitch
// ══════════════════════════════════════════════════════════════
const CyberpunkOverlay: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', height: '100%' }}>
        {children}
      </div>

      {/* スキャンライン */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
          pointerEvents: 'none',
          zIndex: 300,
        }}
      />

      {/* ビネット */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background:
            'radial-gradient(circle, rgba(0,0,0,0) 55%, rgba(0,12,20,0.55) 100%)',
          boxShadow: 'inset 0 0 120px rgba(0,229,255,0.05)',
          pointerEvents: 'none',
          zIndex: 301,
        }}
      />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// Corner Brackets — 配信風フレーム
// ══════════════════════════════════════════════════════════════
const CornerBrackets: React.FC = () => {
  const bracketStyle = (
    pos: { top?: number; bottom?: number; left?: number; right?: number },
    borders: object
  ): React.CSSProperties => ({
    position: 'absolute',
    width: 32,
    height: 32,
    ...pos,
    ...borders,
    zIndex: 200,
  });

  const borderColor = 'rgba(0,229,255,0.3)';
  const borderWidth = '2px solid';
  const b = `${borderWidth} ${borderColor}`;

  return (
    <>
      <div style={bracketStyle({ top: 20, left: 20 }, { borderTop: b, borderLeft: b })} />
      <div style={bracketStyle({ top: 20, right: 20 }, { borderTop: b, borderRight: b })} />
      <div style={bracketStyle({ bottom: 20, left: 20 }, { borderBottom: b, borderLeft: b })} />
      <div style={bracketStyle({ bottom: 20, right: 20 }, { borderBottom: b, borderRight: b })} />
    </>
  );
};

// ══════════════════════════════════════════════════════════════
// 🎬 Main Composition
// ══════════════════════════════════════════════════════════════
export const CharlotteCrypto: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <CyberpunkOverlay>
        {/* 背景動画 */}
        <Video
          src={staticFile('videos/シャルロットクリプト.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* LIVE バッジ */}
        <LiveBadge />

        {/* ● REC 録画中 */}
        <RECIndicator />

        {/* チャンネルバー */}
        <ChannelBar />

        {/* コーナーブラケット */}
        <CornerBrackets />

        {/* 字幕シーケンス */}
        {SUBS.map((sub) => {
          const from = f(sub.startSec);
          const duration = f(sub.endSec) - from;
          return (
            <Sequence
              key={sub.id}
              from={from}
              durationInFrames={duration}
              layout="none"
            >
              <SubtitleBar sub={sub} durationInFrames={duration} />
            </Sequence>
          );
        })}
      </CyberpunkOverlay>
    </AbsoluteFill>
  );
};
