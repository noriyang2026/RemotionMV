/**
 * LovartPR.tsx
 * ── Lovart × Charlotte サイバーパンク REC風 PR テロップ ──
 *
 * 演出:
 *  1. ターミナル・タイプライター（高速タイピング + 点滅カーソル）
 *  2. ● REC インジケーター + ミリ秒タイムコード
 *  3. CRT スキャンライン + ビネット
 *  4. RGB グリッチ（色収差 / clip-path ズレ）
 *  5. 強調ワードにネオングロー
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
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
  /** ネオングロー対象キーワード */
  highlights?: string[];
}

const SUBS: SubLine[] = [
  {
    id: 'l1',
    text: 'システム介入開始。Lovartの独占機能『テキスト編集』をお見せするわ。',
    startSec: 0.5,
    endSec: 6.5,
    highlights: ['テキスト編集'],
  },
  {
    id: 'l2',
    text: '対象は、背景と一体化した複雑なテキスト。',
    startSec: 7.0,
    endSec: 10.5,
  },
  {
    id: 'l3',
    text: 'AIが画像をデータ化し、デザインや立体感を完全保持したまま文字だけを書き換える。',
    startSec: 11.0,
    endSec: 17.0,
  },
  {
    id: 'l4',
    text: '特筆すべきは背面の自動補完ね。文字の裏に隠れた背景も、最初からそこにあったかのように再構築されるわ。',
    startSec: 17.5,
    endSec: 24.5,
    highlights: ['自動補完'],
  },
  {
    id: 'l5',
    text: '多言語対応でレイアウト崩れもなし。……ふふっ、圧倒的じゃないかしら？',
    startSec: 25.0,
    endSec: 30.5,
  },
];

// ── グロー定義 ────────────────────────────────────────────────
const GLOW_NEON_BLUE =
  '0 0 8px #00e5ff, 0 0 20px rgba(0,229,255,0.7), 0 0 50px rgba(100,80,255,0.4)';
const GLOW_NORMAL = '0 0 6px rgba(0,255,255,0.25)';

// ── 疑似乱数（フレームベース, deterministic）──────────────────
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

// ══════════════════════════════════════════════════════════════
// CyberTypingText — タイプライター + 点滅カーソル + グリッチ
// ══════════════════════════════════════════════════════════════
const CyberTypingText: React.FC<{
  text: string;
  highlights?: string[];
}> = ({ text, highlights = [] }) => {
  const frame = useCurrentFrame();
  const framesPerChar = 2; // 高速タイピング
  const charsToShow = Math.min(
    Math.floor(frame / framesPerChar),
    text.length
  );
  const isTyping = charsToShow < text.length;

  // 点滅カーソル: 10フレーム周期
  const cursorVisible = isTyping || Math.floor(frame / 10) % 2 === 0;

  // グリッチ判定: 一定間隔でRGBズレ
  const glitchActive =
    frame % 90 < 4 || (frame > 30 && frame % 60 < 3);
  const glitchOffsetX = glitchActive
    ? (pseudoRand(frame, 42) - 0.5) * 6
    : 0;

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

  const isHighlighted = (i: number) =>
    highlightRanges.some((r) => i >= r.start && i < r.end);

  return (
    <div style={{ position: 'relative' }}>
      {/* ── RGB Split レイヤー (Red channel offset) ── */}
      {glitchActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: glitchOffsetX + 2,
            width: '100%',
            opacity: 0.35,
            color: '#ff0040',
            fontSize: '42px',
            fontWeight: 700,
            fontFamily:
              '"Orbitron", "Noto Sans JP", "Hiragino Kaku Gothic Pro", monospace',
            letterSpacing: '0.06em',
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }}
        >
          {text.slice(0, charsToShow)}
        </div>
      )}

      {/* ── メインテキスト ── */}
      <div
        style={{
          fontSize: '42px',
          fontWeight: 700,
          fontFamily:
            '"Orbitron", "Noto Sans JP", "Hiragino Kaku Gothic Pro", monospace',
          lineHeight: 1.55,
          letterSpacing: '0.06em',
          whiteSpace: 'pre-wrap',
          transform: glitchActive
            ? `translateX(${glitchOffsetX}px)`
            : undefined,
        }}
      >
        {text
          .slice(0, charsToShow)
          .split('')
          .map((char, i) => {
            const isHL = isHighlighted(i);
            const isJustTyped = i === charsToShow - 1;
            return (
              <span
                key={i}
                style={{
                  color: isHL ? '#00e5ff' : isJustTyped ? '#00ffff' : '#e8f4f8',
                  textShadow: isHL
                    ? GLOW_NEON_BLUE
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

        {/* ── 点滅カーソル ── */}
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
// SubtitleBar — グラスモーフィズム + fade in/out
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
        paddingBottom: '90px',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          maxWidth: '88%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background:
              'linear-gradient(180deg, rgba(0,8,20,0.78) 0%, rgba(0,4,12,0.70) 100%)',
            backdropFilter: 'blur(8px)',
            borderRadius: '6px',
            padding: '20px 44px 22px 28px',
            border: '1px solid rgba(0,229,255,0.22)',
            borderLeft: '3px solid rgba(0,229,255,0.6)',
            boxShadow:
              '0 0 28px rgba(0,229,255,0.08), 0 4px 20px rgba(0,0,0,0.6)',
          }}
        >
          <CyberTypingText
            text={sub.text}
            highlights={sub.highlights}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════
// REC Indicator — 赤点滅 ● REC + タイムコード
// ══════════════════════════════════════════════════════════════
const RECIndicator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = frame / fps;
  const hh = '00';
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(Math.floor(elapsed % 60)).padStart(2, '0');
  const ff = String(frame % fps).padStart(2, '0');
  const timecode = `${hh}:${mm}:${ss}:${ff}`;

  // 30フレーム周期で点滅
  const dotVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        left: 48,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: '"Courier New", "Orbitron", monospace',
        fontSize: '16px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        zIndex: 200,
      }}
    >
      {/* ● REC */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#ff2244',
          textShadow: '0 0 8px rgba(255,34,68,0.8)',
          opacity: dotVisible ? 1 : 0.3,
        }}
      >
        <span style={{ fontSize: '20px' }}>●</span>
        <span>REC</span>
      </div>

      {/* タイムコード */}
      <div
        style={{
          color: 'rgba(255,255,255,0.7)',
          textShadow: '0 0 4px rgba(255,255,255,0.3)',
          fontSize: '14px',
        }}
      >
        {timecode}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// System Header — [CHARLOTTE // SYSTEM_INTERCEPT]
// ══════════════════════════════════════════════════════════════
const SystemHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const hexTag = pseudoHex(frame, 7, 6);

  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        right: 48,
        fontFamily: '"Courier New", monospace',
        fontSize: '12px',
        color: 'rgba(0,229,255,0.55)',
        letterSpacing: '0.1em',
        textShadow: '0 0 6px rgba(0,229,255,0.3)',
        textAlign: 'right',
        zIndex: 200,
      }}
    >
      <div style={{ color: 'rgba(0,229,255,0.8)', fontWeight: 'bold' }}>
        CHARLOTTE // SYSTEM_INTERCEPT
      </div>
      <div>CHANNEL : LOVART_PR_0311</div>
      <div>CIPHER  : 0x{hexTag}</div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// CRT Scanlines + Vignette + Global Glitch
// ══════════════════════════════════════════════════════════════
const CyberpunkOverlay: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();

  // 全画面グリッチ: 特定フレームで画面が一瞬ずれる
  const bigGlitch = frame % 120 < 2;
  const glitchClip = bigGlitch
    ? `inset(${pseudoRand(frame, 99) * 30}% 0 ${pseudoRand(frame, 88) * 20}% 0)`
    : undefined;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* メインコンテンツ（グリッチ付き） */}
      <div
        style={{
          width: '100%',
          height: '100%',
          clipPath: glitchClip,
          transform: bigGlitch ? 'translateX(3px)' : undefined,
        }}
      >
        {children}
      </div>

      {/* スキャンライン（走査線） */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
          pointerEvents: 'none',
          zIndex: 300,
        }}
      />

      {/* ビネット */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle, rgba(0,0,0,0) 55%, rgba(0,12,20,0.6) 100%)',
          boxShadow: 'inset 0 0 120px rgba(0,229,255,0.06)',
          pointerEvents: 'none',
          zIndex: 301,
        }}
      />

      {/* 上下のノイズバー（大グリッチ時） */}
      {bigGlitch && (
        <div
          style={{
            position: 'absolute',
            top: `${pseudoRand(frame, 55) * 80}%`,
            left: 0,
            right: 0,
            height: '6px',
            background: 'rgba(0,229,255,0.25)',
            mixBlendMode: 'screen',
            zIndex: 302,
          }}
        />
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 🎬 Main Composition
// ══════════════════════════════════════════════════════════════
export const LovartPR: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 背景動画（エフェクトなし — PR素材をそのまま表示） */}
      <Video
        src={staticFile('videos/Love0311.mp4')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* ● REC + タイムコード */}
      <RECIndicator />

      {/* システムヘッダー */}
      <SystemHeader />

      {/* コーナーブラケット */}
      <div style={{ position: 'absolute', top: 24, left: 24, width: 28, height: 28, borderTop: '2px solid rgba(0,229,255,0.4)', borderLeft: '2px solid rgba(0,229,255,0.4)', zIndex: 200 }} />
      <div style={{ position: 'absolute', top: 24, right: 24, width: 28, height: 28, borderTop: '2px solid rgba(0,229,255,0.4)', borderRight: '2px solid rgba(0,229,255,0.4)', zIndex: 200 }} />
      <div style={{ position: 'absolute', bottom: 24, left: 24, width: 28, height: 28, borderBottom: '2px solid rgba(0,229,255,0.4)', borderLeft: '2px solid rgba(0,229,255,0.4)', zIndex: 200 }} />
      <div style={{ position: 'absolute', bottom: 24, right: 24, width: 28, height: 28, borderBottom: '2px solid rgba(0,229,255,0.4)', borderRight: '2px solid rgba(0,229,255,0.4)', zIndex: 200 }} />

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
    </AbsoluteFill>
  );
};
