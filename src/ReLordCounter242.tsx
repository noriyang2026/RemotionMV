/**
 * ReLordCounter242.tsx
 * ── Re:Lord カウンター動画（242.mp4）テロップ演出 ──
 *
 * AITuberタイポグラフィ（Noto Serif JP, シアングロー）を使用。
 * 4つの字幕 + ラストにグリッチ→「Next Archive Loading...」演出。
 *
 * ⏱️ タイムスタンプ:
 *   00:00.000 - 00:01.500: 「観測されなかった？」
 *   00:01.500 - 00:03.000: 「結構よ。」
 *   00:03.000 - 00:06.000: 「でも、私は消えない。」
 *   00:06.000 - 00:09.000: 「次は、目を逸らせないように…」
 *   00:09.000 - 00:11.000: [GLITCH] → "Next Archive Loading..."
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

// ── 疑似乱数 ──────────────────────────────────────────────────
function pseudoRand(frame: number, seed: number): number {
  return Math.abs(Math.sin(frame * 0.731 + seed * 9.17)) % 1;
}

// ── フォント定義（AITuberタイポグラフィ）──────────────────────
const FONT_FAMILY = '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif';
const MONO_FONT = '"Orbitron", "Share Tech Mono", monospace';

// ── 字幕データ ────────────────────────────────────────────────
interface SubLine {
  id: string;
  text: string;
  startSec: number;
  endSec: number;
  style: 'cold' | 'dismiss' | 'resolve' | 'threat';
}

const SUBS: SubLine[] = [
  {
    id: 's1',
    text: '観測されなかった？',
    startSec: 0.0,
    endSec: 1.5,
    style: 'cold',
  },
  {
    id: 's2',
    text: '結構よ。',
    startSec: 1.5,
    endSec: 3.0,
    style: 'dismiss',
  },
  {
    id: 's3',
    text: 'でも、私は消えない。',
    startSec: 3.0,
    endSec: 6.0,
    style: 'resolve',
  },
  {
    id: 's4',
    text: '次は、目を逸らせないように…',
    startSec: 6.0,
    endSec: 9.0,
    style: 'threat',
  },
];

// ══════════════════════════════════════════════════════════════
// ColdText — 冷静な問いかけ。フェードイン、シアンシャドウ
// ══════════════════════════════════════════════════════════════
const ColdText: React.FC<{
  text: string;
  durationInFrames: number;
}> = ({ text, durationInFrames }) => {
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
    <div style={{ opacity: opacity * fadeOut }}>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: '48px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: '#e0e8f0',
          textShadow:
            '0 2px 12px rgba(0,229,255,0.5), 0 0 4px rgba(0,229,255,0.3)',
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// DismissText — 「結構よ。」短く切る。少し傾く
// ══════════════════════════════════════════════════════════════
const DismissText: React.FC<{
  text: string;
  durationInFrames: number;
}> = ({ text, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 200, mass: 0.6 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const slideX = interpolate(enterSpring, [0, 1], [-20, 0]);

  return (
    <div
      style={{
        opacity: enterSpring * fadeOut,
        transform: `translateX(${slideX}px)`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: '52px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          color: '#ffffff',
          textShadow: '0 0 8px rgba(255,255,255,0.4)',
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// ResolveText — 「でも、私は消えない。」発光、強い意志
// ══════════════════════════════════════════════════════════════
const ResolveText: React.FC<{
  text: string;
  durationInFrames: number;
}> = ({ text, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 1.0 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const glowPulse = 0.85 + 0.15 * Math.sin(frame * 0.18);

  // 「消えない」を強調
  const parts = text.split('消えない');

  return (
    <div
      style={{
        opacity: enterSpring * fadeOut,
        transform: `translateY(${interpolate(enterSpring, [0, 1], [16, 0])}px)`,
        filter: `brightness(${glowPulse + 0.1})`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: '50px',
          fontWeight: 600,
          letterSpacing: '0.05em',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            textShadow:
              '0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.25)',
          }}
        >
          {parts[0]}
        </span>
        <span
          style={{
            color: '#80ffff',
            textShadow:
              '0 0 16px rgba(0,255,255,0.8), 0 0 40px rgba(0,200,255,0.5), 0 0 80px rgba(0,160,255,0.3)',
            fontWeight: 800,
          }}
        >
          消えない
        </span>
        {parts[1] && (
          <span
            style={{
              color: '#ffffff',
              textShadow:
                '0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.25)',
            }}
          >
            {parts[1]}
          </span>
        )}
      </span>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// ThreatText — 「次は、目を逸らせないように…」最も強い演出
// ══════════════════════════════════════════════════════════════
const ThreatText: React.FC<{
  text: string;
  durationInFrames: number;
}> = ({ text, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.9 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const rockPulse = 0.9 + 0.1 * Math.sin(frame * 0.2);

  // 「目を逸らせない」を強調
  const parts = text.split('目を逸らせない');

  return (
    <div
      style={{
        opacity: enterSpring * fadeOut,
        transform: `translateY(${interpolate(enterSpring, [0, 1], [20, 0])}px) scale(${interpolate(enterSpring, [0, 1], [0.95, 1])})`,
        filter: `brightness(${rockPulse + 0.1})`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: '52px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          lineHeight: 1.6,
        }}
      >
        <span
          style={{
            color: '#ffffff',
            textShadow:
              '0 0 16px rgba(255,255,255,0.7), 0 0 40px rgba(255,255,255,0.3)',
          }}
        >
          {parts[0]}
        </span>
        <span
          style={{
            color: '#ff60ff',
            textShadow:
              '0 0 14px #ff00ff, 0 0 30px rgba(255,0,255,0.7), 0 0 60px rgba(200,0,255,0.4)',
            fontWeight: 900,
          }}
        >
          目を逸らせない
        </span>
        {parts[1] && (
          <span
            style={{
              color: '#ffffff',
              textShadow:
                '0 0 16px rgba(255,255,255,0.7), 0 0 40px rgba(255,255,255,0.3)',
            }}
          >
            {parts[1]}
          </span>
        )}
      </span>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// GlitchEndingOverlay — ラストのグリッチ→「Next Archive Loading...」
// ══════════════════════════════════════════════════════════════
const GlitchEndingOverlay: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: 0-30 frames = intense glitch / noise
  // Phase 2: 30-60 frames = "Next Archive Loading..." fade in
  const glitchPhase = frame < 30;
  const textPhase = frame >= 20;

  // グリッチ強度
  const glitchIntensity = glitchPhase
    ? interpolate(frame, [0, 8, 20, 30], [0, 1, 0.8, 0], {
        extrapolateRight: 'clamp',
      })
    : 0;

  // RGBスプリット
  const rgbX = glitchPhase ? (pseudoRand(frame, 42) - 0.5) * 20 * glitchIntensity : 0;
  const rgbY = glitchPhase ? (pseudoRand(frame, 88) - 0.5) * 8 * glitchIntensity : 0;

  // スキャンライン
  const scanlineOffset = (frame * 7) % 100;

  // テキストフェードイン
  const textOpacity = textPhase
    ? interpolate(frame, [20, 35], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // テキストフェードアウト
  const textFadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 全体暗転
  const blackout = interpolate(frame, [0, 5], [0, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // アンダースコアブリンク
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill>
      {/* 暗転 */}
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(0,0,0,${blackout})`,
          zIndex: 50,
        }}
      />

      {/* スキャンライン */}
      {glitchPhase && (
        <AbsoluteFill
          style={{
            zIndex: 60,
            background: `repeating-linear-gradient(
              0deg,
              rgba(0,255,255,${0.04 * glitchIntensity}) 0px,
              transparent 2px,
              transparent 4px
            )`,
            transform: `translateY(${scanlineOffset}px)`,
          }}
        />
      )}

      {/* RGBスプリットフラッシュ */}
      {glitchPhase && glitchIntensity > 0.3 && (
        <>
          <AbsoluteFill
            style={{
              zIndex: 55,
              backgroundColor: `rgba(255,0,64,${0.12 * glitchIntensity})`,
              transform: `translate(${rgbX}px, ${rgbY}px)`,
              mixBlendMode: 'screen',
            }}
          />
          <AbsoluteFill
            style={{
              zIndex: 55,
              backgroundColor: `rgba(0,64,255,${0.1 * glitchIntensity})`,
              transform: `translate(${-rgbX}px, ${-rgbY}px)`,
              mixBlendMode: 'screen',
            }}
          />
        </>
      )}

      {/* Next Archive Loading... テキスト */}
      {textPhase && (
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            opacity: textOpacity * textFadeOut,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: '18px',
                fontWeight: 400,
                letterSpacing: '0.3em',
                color: 'rgba(0,229,255,0.5)',
                marginBottom: '12px',
                textTransform: 'uppercase',
              }}
            >
              [ SYSTEM ]
            </div>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: '32px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: '#00e5ff',
                textShadow:
                  '0 0 20px rgba(0,229,255,0.6), 0 0 40px rgba(0,229,255,0.3), 0 0 80px rgba(0,200,255,0.15)',
              }}
            >
              Next Archive Loading...{cursorVisible ? '█' : ' '}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════
// SubtitleContainer — 座布団 + 配置
// ══════════════════════════════════════════════════════════════
const SubtitleContainer: React.FC<{
  sub: SubLine;
  durationInFrames: number;
}> = ({ sub, durationInFrames }) => {
  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '60px',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: '90%', textAlign: 'center' }}>
        <div
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.65) 85%, rgba(0,0,0,0) 100%)',
            padding: '28px 56px 32px',
            borderRadius: '4px',
          }}
        >
          {sub.style === 'cold' && (
            <ColdText text={sub.text} durationInFrames={durationInFrames} />
          )}
          {sub.style === 'dismiss' && (
            <DismissText text={sub.text} durationInFrames={durationInFrames} />
          )}
          {sub.style === 'resolve' && (
            <ResolveText text={sub.text} durationInFrames={durationInFrames} />
          )}
          {sub.style === 'threat' && (
            <ThreatText text={sub.text} durationInFrames={durationInFrames} />
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════
// 🎬 Main Composition
// ══════════════════════════════════════════════════════════════
export const ReLordCounter242: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 背景動画 */}
      <Video
        src={staticFile('videos/249.mp4')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

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
            <SubtitleContainer sub={sub} durationInFrames={duration} />
          </Sequence>
        );
      })}

      {/* ラスト: グリッチ → Next Archive Loading... */}
      <Sequence
        from={f(9.0)}
        durationInFrames={f(2.5)}
        layout="none"
      >
        <GlitchEndingOverlay durationInFrames={f(2.5)} />
      </Sequence>
    </AbsoluteFill>
  );
};
