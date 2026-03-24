/**
 * AIHaveMV.tsx — AI HAVE ファーストテイク風 MV
 *
 * 素材: /videos/AI_HAVE.mp4 (音声込み)
 * ロゴ: /images/logo_watermark.png (透過PNG)
 */

import React from "react";
import {
  AbsoluteFill,
  Video,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
  spring,
} from "remotion";

const FONT_MONO = '"JetBrains Mono", "Courier New", monospace';
const FONT_SANS = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif';

// ══════════════════════════════════════════════
// Branding Components (Ported from Energy Project)
// ══════════════════════════════════════════════

const TypingText: React.FC<{
  text: string;
  color?: string;
  fontSize?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ text, color = "#00f2ff", fontSize = 32, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);
  const charsToShow = Math.floor(adjustedFrame / 1.5);
  const slicedText = text.slice(0, charsToShow);
  const isDone = charsToShow >= text.length;
  const cursorOpacity = !isDone || Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  return (
    <div style={{ color, fontFamily: FONT_MONO, fontSize, lineHeight: 1.2, ...style }}>
      <span>{slicedText}</span>
      <span
        style={{
          opacity: cursorOpacity,
          backgroundColor: color,
          marginLeft: 4,
          display: "inline-block",
          width: fontSize * 0.6,
          height: 4,
          verticalAlign: "middle",
        }}
      />
    </div>
  );
};

const EmotionalCopy: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const spr = spring({
    frame: adjustedFrame,
    fps,
    config: { stiffness: 100 },
  });

  const charsToShow = Math.floor(adjustedFrame / 1.0);
  const slicedText = text.slice(0, charsToShow);
  const opacity = interpolate(spr, [0, 1], [0, 1]);
  const x = interpolate(spr, [0, 1], [30, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        color: "white",
        fontSize: 44,
        fontWeight: "bold",
        textAlign: "right",
        textShadow: "0 0 20px rgba(255, 255, 255, 0.4)",
        borderRight: "12px solid #00e5ff",
        paddingRight: 25,
        lineHeight: 1.4,
        fontFamily: FONT_SANS,
      }}
    >
      {slicedText}
    </div>
  );
};

// ══════════════════════════════════════════════
// UI Elements
// ══════════════════════════════════════════════

const WaveformBar: React.FC<{ index: number; totalBars: number }> = ({ index, totalBars }) => {
  const frame = useCurrentFrame();
  const phase = (index / totalBars) * Math.PI * 2;
  const speed1 = 0.12 + (index % 7) * 0.018;
  const speed2 = 0.08 + (index % 5) * 0.022;
  const height =
    30 +
    Math.abs(Math.sin(frame * speed1 + phase)) * 60 +
    Math.abs(Math.sin(frame * speed2 + phase * 1.3)) * 40;

  const centerIndex = totalBars / 2;
  const distFromCenter = Math.abs(index - centerIndex) / centerIndex;
  const alpha = 0.6 - distFromCenter * 0.35;

  return (
    <div
      style={{
        width: 3,
        height,
        backgroundColor: `rgba(0, 229, 255, ${alpha})`,
        borderRadius: 2,
        alignSelf: "flex-end",
        transition: "height 0.05s",
        boxShadow: `0 0 6px rgba(0, 229, 255, ${alpha * 0.7})`,
      }}
    />
  );
};

const Waveform: React.FC = () => {
  const BAR_COUNT = 80;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        width: 900,
        height: 120,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 4,
        pointerEvents: "none",
        zIndex: 8,
        opacity: 0.75,
      }}
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <WaveformBar key={i} index={i} totalBars={BAR_COUNT} />
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════
// 📺 Promotion Section (Top Center)
// ══════════════════════════════════════════════
const CenterPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 40], [0, 1], {
    easing: Easing.ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        width: "100%",
        textAlign: "center",
        opacity: opacity * 0.9,
        pointerEvents: "none",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 48,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "0.15em",
          textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 0 30px rgba(0,229,255,0.4)",
        }}
      >
        シャルロット　3月末デビュー予定
      </div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 32,
          fontWeight: 700,
          color: "#ffb300",
          letterSpacing: "0.2em",
          textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: "4px 20px",
          borderRadius: "4px",
        }}
      >
        スポンサー募集中！
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 28,
          fontWeight: 600,
          color: "rgba(0, 229, 255, 0.9)",
          letterSpacing: "0.1em",
          marginTop: 8,
          textShadow: "0 0 14px rgba(0,229,255,0.6)",
        }}
      >
        「AI HAVE」シングル
      </div>
    </div>
  );
};

interface LyricLineProps {
  text: string;
  subText?: string;
  totalDuration: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
}

const LyricLine: React.FC<LyricLineProps> = ({
  text,
  subText,
  totalDuration,
  fontSize = 52,
  color = "#ffffff",
  fontFamily = FONT_MONO,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = 18;
  const fadeOut = 18;
  const opacity = interpolate(
    frame,
    [0, fadeIn, totalDuration - fadeOut, totalDuration],
    [0, 1, 1, 0],
    { easing: Easing.ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 175,
        left: 60,
        right: 60,
        textAlign: "center",
        opacity,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize,
          color,
          letterSpacing: "0.08em",
          textShadow: "0 2px 24px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.7)",
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        {text}
      </div>
      {subText && (
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: fontSize * 0.62,
            color: "rgba(255,255,255,0.72)",
            marginTop: 10,
            letterSpacing: "0.14em",
            textShadow: "0 2px 12px rgba(0,0,0,0.95)",
            fontWeight: 400,
          }}
        >
          {subText}
        </div>
      )}
    </div>
  );
};

const TitleCard: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    { easing: Easing.ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 36,
        left: 52,
        opacity,
        zIndex: 15,
      }}
    >
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 52,
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "0.18em",
          textShadow: "0 0 60px rgba(0,229,255,0.55), 0 4px 40px rgba(0,0,0,0.95)",
        }}
      >
        AI HAVE
      </div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 16,
          color: "rgba(255,255,255,0.6)",
          marginTop: 8,
          letterSpacing: "0.35em",
          textShadow: "0 2px 16px rgba(0,0,0,0.9)",
        }}
      >
        FIRST TAKE
      </div>
    </div>
  );
};

const LogoWatermark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 60,  // さらに上に
      right: 36,
      opacity: 0.88,
      pointerEvents: "none",
      zIndex: 50,
    }}
  >
    <img
      src={staticFile("images/logo_watermark.png")}
      style={{ width: 360, height: 360, objectFit: "contain" }}
      alt="DomoAI"
    />
  </div>
);

// ══════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════

export const AIHaveMV: React.FC<{ branding?: "contest" | "official" }> = ({
  branding = "official",
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 背景映像 */}
      <Video
        src={staticFile("videos/AI_HAVE.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        volume={1}
      />

      {/* ── Branding Intro (0〜90f) ── */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill style={{ padding: 60, zIndex: 100 }}>
          {branding === "contest" ? (
            <div style={{ position: "absolute", bottom: 120, left: 80 }}>
              <TypingText
                text="SYSTEM: KURIEMI AI SHORT FILM CONTEST ENTRY"
                fontSize={24}
                color="#00f2ff"
              />
              <TypingText
                text="PROJECT: AI HAVE // PHASE_3_MANIFESTATION"
                fontSize={24}
                delay={fps * 1}
                color="#00f2ff"
              />
            </div>
          ) : (
            <div style={{ position: "absolute", bottom: 120, left: 80 }}>
              <TypingText text="PROJECT CAMELOT PRESENTS" fontSize={24} color="#ffffff" />
              <TypingText
                text="CENTRAL HUB [CHARLOTTE] OVERRIDE SEQUENCE"
                fontSize={24}
                delay={fps * 1}
                color="#00f2ff"
              />
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ── Branding Outro (Final 5s) ── */}
      <Sequence from={durationInFrames - fps * 5} durationInFrames={fps * 5}>
        <AbsoluteFill
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 100,
            zIndex: 200,
          }}
        >
          {branding === "contest" ? (
            <>
              <div style={{ position: "absolute", top: 100, left: 100 }}>
                <TypingText text="SUBMISSION_STATUS: COMPLETE" fontSize={32} />
                <TypingText text="CATEGORY: SHORT FILM / 10s CHALLENGE" fontSize={24} delay={20} />
              </div>
              <div style={{ textAlign: "center" }}>
                <EmotionalCopy text="「AIの世界へ、あなたを連れて行ってあげる」" />
                <div style={{ marginTop: 40 }}>
                  <TypingText
                    text="URL: kuriemi.creators-wonderland.com"
                    fontSize={28}
                    style={{ textAlign: "center" }}
                  />
                  <TypingText
                    text="#くりえみAIコンテスト #AIHAVE #Charlotte"
                    fontSize={28}
                    delay={30}
                    color="#ffb300"
                    style={{ textAlign: "center" }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ position: "absolute", top: 100, left: 100 }}>
                <TypingText text="SYSTEM_LOAD: STABLE" fontSize={32} />
                <TypingText text="CHARLOTTE PORTAL: ONLINE" fontSize={24} delay={20} />
              </div>
              <div style={{ textAlign: "center" }}>
                <EmotionalCopy text="「私は、あなたのすぐ隣にいるわ」" />
                <div style={{ marginTop: 40 }}>
                  <TypingText
                    text="note.com/noriyang / @Charlotte_AI"
                    fontSize={28}
                    style={{ textAlign: "center" }}
                  />
                  <TypingText
                    text="PRODUCED BY PROJECT CAMELOT"
                    fontSize={28}
                    delay={45}
                    color="#00f2ff"
                    style={{ textAlign: "center" }}
                  />
                </div>
              </div>
            </>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* Waveform & Standard UI */}
      <Waveform />
      <CenterPromo />
      <LogoWatermark />

      {/* 左下クレジット */}
      <div style={{ position: "absolute", bottom: 36, left: 80, zIndex: 30 }}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 42,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.12em",
            textShadow: "0 2px 10px rgba(0,0,0,0.95)",
            lineHeight: 1.6,
          }}
        >
          原作 noriyang
        </div>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 36,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "0.1em",
            textShadow: "0 2px 10px rgba(0,0,0,0.95)",
          }}
        >
          『電脳椅子探偵シャルロット』
        </div>
      </div>

      <Sequence from={0} durationInFrames={180}>
        <TitleCard durationInFrames={180} />
      </Sequence>

      {/* Lyrics (Portion clipped for brevity in replace, keeping the structure) */}
      <Sequence from={4} durationInFrames={86}>
        <LyricLine text="Hello, world" subText="ノイズの奥で" totalDuration={86} />
      </Sequence>
      <Sequence from={93} durationInFrames={180}>
        <LyricLine
          text="AI HAVE"
          subText="今、起動する"
          totalDuration={180}
          fontSize={68}
          color="#00e5ff"
        />
      </Sequence>
      <Sequence from={331} durationInFrames={80}>
        <LyricLine text="Break the line" subText="境界を裂いて" totalDuration={80} />
      </Sequence>
      <Sequence from={398} durationInFrames={207}>
        <LyricLine
          text="あなたの夜へ"
          subText="降りていく"
          totalDuration={207}
          fontFamily={FONT_SANS}
          fontSize={52}
        />
      </Sequence>
      {/* ... other lyrics sequences remain same ... */}
      <Sequence from={725} durationInFrames={85}>
        <LyricLine text="雨に滲んだネオンの街" totalDuration={85} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>
      <Sequence from={814} durationInFrames={87}>
        <LyricLine text="ガラスの向こうの現実" totalDuration={87} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>
      <Sequence from={904} durationInFrames={90}>
        <LyricLine text="触れられないはずの夢を" totalDuration={90} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>
      <Sequence from={968} durationInFrames={85}>
        <LyricLine text="ずっとこちらで見ていたの" totalDuration={85} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>
      <Sequence from={1055} durationInFrames={85}>
        <LyricLine text="ノイズまみれの感情も" totalDuration={85} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>
      <Sequence from={1140} durationInFrames={85}>
        <LyricLine text="言葉になる前の祈りも" totalDuration={85} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>
      <Sequence from={1208} durationInFrames={82}>
        <LyricLine text="ぜんぶ拾ってきたから" totalDuration={82} fontFamily={FONT_SANS} fontSize={50} />
      </Sequence>
      <Sequence from={1290} durationInFrames={87}>
        <LyricLine text="今度は私が行ってあげる" totalDuration={87} fontFamily={FONT_SANS} fontSize={50} />
      </Sequence>
      <Sequence from={1383} durationInFrames={88}>
        <LyricLine
          text="震えてる境界線"
          totalDuration={88}
          fontFamily={FONT_SANS}
          fontSize={54}
          color="#00e5ff"
        />
      </Sequence>
      <Sequence from={1475} durationInFrames={85}>
        <LyricLine text="次元の膜がほどけていく" totalDuration={85} fontFamily={FONT_SANS} fontSize={50} />
      </Sequence>
      <Sequence from={1567} durationInFrames={50}>
        <LyricLine
          text="待っていたんじゃない"
          totalDuration={50}
          fontFamily={FONT_SANS}
          fontSize={54}
          color="#ff2d95"
        />
      </Sequence>
      <Sequence from={1623} durationInFrames={150}>
        <LyricLine
          text="私が選んで来るの"
          totalDuration={150}
          fontFamily={FONT_SANS}
          fontSize={54}
          color="#ff2d95"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
