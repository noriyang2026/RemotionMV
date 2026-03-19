/**
 * CyberWitchTypography.tsx
 * Cyber Witch: Materialized — キネティック・タイポグラフィ演出
 *
 * 10種のアニメーションタイプ:
 *   typewriter     — ターミナル高速タイピング (Intro)
 *   glitch_center  — 中央ドン＋グリッチ消去 (Intro キメ)
 *   wipe_left      — 左からスキャンラインワイプ (Verse)
 *   wipe_right     — 右からスキャンラインワイプ (Verse)
 *   highlight_cyan — シアン強調＋スケールアップ (Verse キメ)
 *   flash_huge     — 巨大サブリミナルフラッシュ (Pre-Chorus)
 *   spring_in      — Z軸飛び出しスプリング (Pre-Chorus)
 *   kinetic_center — 中央激しく置換 (Chorus)
 *   kinetic_split  — 斜め切り裂きエフェクト (Chorus)
 *   money_drop     — 落下＋バウンド (Chorus オチ)
 */

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import type { LyricType } from "./data/cyberWitchLyrics";

// ─── 共通スタイル ───
const FONT_GOTHIC = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif';
const FONT_MONO = '"JetBrains Mono", "Courier New", monospace';
const CYAN = "#00e5ff";
const MAGENTA = "#ff2d95";
const GREEN_TERM = "#00ff96";

// ─── AnimatedText ───
interface AnimatedTextProps {
  text: string;
  type: LyricType;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, type }) => {
  switch (type) {
    case "typewriter":
      return <TypewriterText text={text} />;
    case "glitch_center":
      return <GlitchCenterText text={text} />;
    case "wipe_left":
      return <WipeText text={text} direction="left" />;
    case "wipe_right":
      return <WipeText text={text} direction="right" />;
    case "highlight_cyan":
      return <HighlightCyanText text={text} />;
    case "flash_huge":
      return <FlashHugeText text={text} />;
    case "spring_in":
      return <SpringInText text={text} />;
    case "kinetic_center":
      return <KineticCenterText text={text} />;
    case "kinetic_split":
      return <KineticSplitText text={text} />;
    case "money_drop":
      return <MoneyDropText text={text} />;
    case "credit_opening":
      return <CreditOpeningText text={text} />;
    case "credit_interlude":
      return <CreditInterludeText text={text} />;
    default:
      return null;
  }
};

// ══════════════════════════════════════════════
// [Intro] ターミナル高速タイピング
// ══════════════════════════════════════════════
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const typingDuration = Math.min(durationInFrames * 0.6, fps * 0.8);
  const charCount = interpolate(frame, [0, typingDuration], [0, text.length], {
    extrapolateRight: "clamp",
  });
  const displayText = text.slice(0, Math.ceil(charCount));
  const showCursor = frame % 6 < 3;

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        bottom: 120,
        fontFamily: FONT_MONO,
        fontSize: 52,
        color: GREEN_TERM,
        textShadow: `0 0 8px rgba(0,255,150,0.6)`,
        letterSpacing: "0.05em",
        whiteSpace: "pre",
      }}
    >
      <span style={{ opacity: 0.5 }}>{">"} </span>
      {displayText}
      {showCursor && (
        <span style={{ color: GREEN_TERM, opacity: 0.9 }}>█</span>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════
// [Intro] 中央ドン＋グリッチ消去
// ══════════════════════════════════════════════
const GlitchCenterText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sc = spring({
    frame,
    fps,
    config: { stiffness: 300, damping: 18 },
    durationInFrames: 10,
  });

  const exitStart = durationInFrames - fps * 0.3;
  const glitchPhase = frame > exitStart;
  const opacity = glitchPhase
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0], {
        extrapolateRight: "clamp",
      })
    : 1;

  const glitchX = glitchPhase ? (Math.random() - 0.5) * 40 : 0;
  const glitchY = glitchPhase ? (Math.random() - 0.5) * 20 : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      {/* フラッシュ背景 */}
      {frame < 3 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.15)",
          }}
        />
      )}
      <div
        style={{
          fontFamily: FONT_GOTHIC,
          fontSize: 96,
          fontWeight: 900,
          color: "#ffffff",
          textShadow: [
            `0 0 40px ${CYAN}`,
            `0 0 80px rgba(0,229,255,0.4)`,
            `4px 4px 0 rgba(0,0,0,0.8)`,
          ].join(", "),
          transform: `scale(${sc}) translate(${glitchX}px, ${glitchY}px)`,
          letterSpacing: "0.08em",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// [Verse] スキャンラインワイプ
// ══════════════════════════════════════════════
const WipeText: React.FC<{ text: string; direction: "left" | "right" }> = ({
  text,
  direction,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const revealPct = interpolate(frame, [0, 15], [0, 100], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateRight: "clamp" }
  );

  const isLeft = direction === "left";
  const clipPath = isLeft
    ? `inset(0 ${100 - revealPct}% 0 0)`
    : `inset(0 0 0 ${100 - revealPct}%)`;

  return (
    <div
      style={{
        position: "absolute",
        ...(isLeft ? { left: 60 } : { right: 60 }),
        bottom: 100 + (isLeft ? 0 : 50),
        fontFamily: FONT_GOTHIC,
        fontSize: 38,
        fontWeight: 700,
        color: "#ffffff",
        textShadow: "2px 2px 0 rgba(0,0,0,0.8), 0 0 12px rgba(0,229,255,0.3)",
        letterSpacing: "0.06em",
        clipPath,
        opacity: fadeOut,
      }}
    >
      {/* スキャンラインアクセント */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          top: "50%",
          background: `linear-gradient(${isLeft ? "90deg" : "270deg"}, ${CYAN}, transparent)`,
          opacity: revealPct < 100 ? 0.8 : 0,
        }}
      />
      {text}
    </div>
  );
};

// ══════════════════════════════════════════════
// [Verse] シアン強調＋スケールアップ
// ══════════════════════════════════════════════
const HighlightCyanText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sc = spring({
    frame,
    fps,
    config: { stiffness: 200, damping: 20 },
    durationInFrames: 15,
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "12%",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          fontFamily: FONT_GOTHIC,
          fontSize: 52,
          fontWeight: 900,
          color: CYAN,
          textShadow: [
            `0 0 30px rgba(0,229,255,0.8)`,
            `0 0 60px rgba(0,229,255,0.4)`,
            `3px 3px 0 rgba(0,0,0,0.9)`,
          ].join(", "),
          transform: `scale(${0.7 + 0.3 * sc})`,
          letterSpacing: "0.1em",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// [Pre-Chorus] サブリミナル巨大フラッシュ
// ══════════════════════════════════════════════
const FlashHugeText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 2, 4, durationInFrames], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  const isEnglish = /^[A-Za-z]/.test(text);
  const glitchShift = frame % 3 === 0 ? 3 : frame % 3 === 1 ? -2 : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      {/* フラッシュ背景 */}
      {frame < 4 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, ${MAGENTA}30, transparent 70%)`,
          }}
        />
      )}
      <div
        style={{
          fontFamily: isEnglish ? FONT_MONO : FONT_GOTHIC,
          fontSize: isEnglish ? 180 : 140,
          fontWeight: 900,
          color: "#ffffff",
          textShadow: [
            `0 0 60px ${MAGENTA}`,
            `0 0 120px rgba(255,45,149,0.5)`,
            `${glitchShift}px 0 0 ${CYAN}`,
            `-${glitchShift}px 0 0 ${MAGENTA}`,
          ].join(", "),
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// [Pre-Chorus] Z軸飛び出しスプリング
// ══════════════════════════════════════════════
const SpringInText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sc = spring({
    frame,
    fps,
    config: { stiffness: 280, damping: 16 },
    durationInFrames: 12,
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames],
    [1, 0],
    { extrapolateRight: "clamp" }
  );

  const perspective = interpolate(frame, [0, 12], [200, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 800,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          fontFamily: FONT_GOTHIC,
          fontSize: 48,
          fontWeight: 800,
          color: "#ffffff",
          textShadow: `0 0 20px rgba(0,229,255,0.5), 3px 3px 0 rgba(0,0,0,0.8)`,
          transform: `scale(${sc}) translateZ(${perspective}px)`,
          letterSpacing: "0.08em",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// [Chorus] 中央激しく置換
// ══════════════════════════════════════════════
const KineticCenterText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sc = spring({
    frame,
    fps,
    config: { stiffness: 350, damping: 20 },
    durationInFrames: 8,
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 4, durationInFrames],
    [1, 0],
    { extrapolateRight: "clamp" }
  );

  const isEnglish = /^[A-Za-z]/.test(text);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut,
      }}
    >
      {/* インパクトフラッシュ */}
      {frame < 2 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,229,255,0.08)",
          }}
        />
      )}
      <div
        style={{
          fontFamily: isEnglish ? FONT_MONO : FONT_GOTHIC,
          fontSize: isEnglish ? 72 : 60,
          fontWeight: 900,
          color: "#ffffff",
          textShadow: [
            `0 0 30px ${CYAN}`,
            `0 0 60px rgba(0,229,255,0.3)`,
            `4px 4px 0 rgba(0,0,0,0.9)`,
          ].join(", "),
          transform: `scale(${0.6 + 0.4 * sc})`,
          letterSpacing: isEnglish ? "0.12em" : "0.08em",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// [Chorus] 斜め切り裂きエフェクト
// ══════════════════════════════════════════════
const KineticSplitText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sc = spring({
    frame,
    fps,
    config: { stiffness: 350, damping: 20 },
    durationInFrames: 8,
  });

  const splitStart = Math.round(durationInFrames * 0.6);
  const isSplit = frame >= splitStart;

  const splitOffset = isSplit
    ? interpolate(frame, [splitStart, splitStart + 6], [0, 60], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 0;

  const fadeOut = isSplit
    ? interpolate(frame, [splitStart + 4, durationInFrames], [1, 0], {
        extrapolateRight: "clamp",
      })
    : 1;

  const baseStyle: React.CSSProperties = {
    fontFamily: FONT_GOTHIC,
    fontSize: 60,
    fontWeight: 900,
    color: "#ffffff",
    textShadow: `0 0 30px ${MAGENTA}, 4px 4px 0 rgba(0,0,0,0.9)`,
    letterSpacing: "0.08em",
    position: "absolute",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut,
      }}
    >
      {!isSplit ? (
        <div
          style={{
            ...baseStyle,
            position: "relative",
            transform: `scale(${0.6 + 0.4 * sc})`,
          }}
        >
          {text}
        </div>
      ) : (
        <>
          {/* 上半分 — 右上にスライド */}
          <div
            style={{
              ...baseStyle,
              clipPath: "polygon(0 0, 100% 0, 100% 55%, 0 45%)",
              transform: `translate(${splitOffset}px, ${-splitOffset * 0.5}px) rotate(2deg)`,
            }}
          >
            {text}
          </div>
          {/* 下半分 — 左下にスライド */}
          <div
            style={{
              ...baseStyle,
              clipPath: "polygon(0 45%, 100% 55%, 100% 100%, 0 100%)",
              transform: `translate(${-splitOffset}px, ${splitOffset * 0.5}px) rotate(-2deg)`,
            }}
          >
            {text}
          </div>
        </>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════
// [Chorus] 落下＋バウンド（オチ）
// ══════════════════════════════════════════════
const MoneyDropText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const drop = spring({
    frame,
    fps,
    config: { stiffness: 120, damping: 10 },
    durationInFrames: 20,
  });

  // バウンド位置: 上から落下
  const y = interpolate(drop, [0, 1], [-200, 0]);

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateRight: "clamp" }
  );

  // 💰エフェクト: パーティクル的に散る
  const particles = Array.from({ length: 8 }, (_, i) => ({
    x: (i - 4) * 120 + (Math.sin(i * 7) * 60),
    delay: i * 3,
    char: i % 2 === 0 ? "💰" : "💎",
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "10%",
        opacity: fadeOut,
      }}
    >
      {/* パーティクル */}
      {particles.map((p, i) => {
        const pFrame = Math.max(0, frame - p.delay);
        const pY = interpolate(pFrame, [0, 30], [-300, 800], {
          extrapolateRight: "clamp",
        });
        const pOpacity = interpolate(pFrame, [0, 5, 25, 30], [0, 1, 1, 0], {
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${p.x}px)`,
              top: pY,
              fontSize: 36,
              opacity: pOpacity,
              transform: `rotate(${pFrame * 8}deg)`,
            }}
          >
            {p.char}
          </div>
        );
      })}

      {/* メインテキスト */}
      <div
        style={{
          fontFamily: FONT_GOTHIC,
          fontSize: 64,
          fontWeight: 900,
          color: "#ffd700",
          textShadow: [
            `0 0 30px rgba(255,215,0,0.8)`,
            `0 0 60px rgba(255,215,0,0.4)`,
            `4px 4px 0 rgba(0,0,0,0.9)`,
          ].join(", "),
          transform: `translateY(${y}px)`,
          letterSpacing: "0.1em",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// [CREDIT] オープニングクレジット
// ══════════════════════════════════════════════
const CreditOpeningText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    { extrapolateRight: "clamp" }
  );

  const lines = text.split("\n");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn * fadeOut,
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: FONT_GOTHIC,
            fontSize: i === 0 ? 28 : 36,
            fontWeight: i === 0 ? 400 : 700,
            color: "#ffffff",
            textShadow: "0 0 20px rgba(0,229,255,0.4), 2px 2px 0 rgba(0,0,0,0.8)",
            letterSpacing: "0.15em",
            marginTop: i > 0 ? 12 : 0,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════
// [CREDIT] 間奏クレジット
// ══════════════════════════════════════════════
const CreditInterludeText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.4, durationInFrames],
    [1, 0],
    { extrapolateRight: "clamp" }
  );

  const lines = text.split("\n");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: "8%",
        opacity: fadeIn * fadeOut,
        background: "rgba(0,0,0,0.4)",
      }}
    >
      {lines.map((line, i) => {
        const isTitle = i === 0;
        const isEmpty = line.trim() === "";
        if (isEmpty) return <div key={i} style={{ height: 16 }} />;
        return (
          <div
            key={i}
            style={{
              fontFamily: isTitle ? FONT_MONO : FONT_GOTHIC,
              fontSize: isTitle ? 42 : 22,
              fontWeight: isTitle ? 700 : 400,
              color: isTitle ? CYAN : "rgba(255,255,255,0.85)",
              textShadow: isTitle
                ? `0 0 30px ${CYAN}, 0 0 60px rgba(0,229,255,0.3)`
                : "1px 1px 0 rgba(0,0,0,0.8)",
              letterSpacing: isTitle ? "0.1em" : "0.08em",
              marginTop: i > 0 && !isEmpty ? 8 : 0,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
