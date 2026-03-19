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
} from "remotion";

const FONT_MONO = '"JetBrains Mono", "Courier New", monospace';
const FONT_SANS = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif';

// ══════════════════════════════════════════════
// 音声波形風アニメーション（下部）
// ══════════════════════════════════════════════
const WaveformBar: React.FC<{ index: number; totalBars: number }> = ({ index, totalBars }) => {
  const frame = useCurrentFrame();
  // バーごとに位相をずらしてランダム感を出す
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
// 右上：シャルロット情報テキスト
// ══════════════════════════════════════════════
const TopRightInfo: React.FC = () => {
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
        top: 36,
        right: 52,
        textAlign: "right",
        opacity: opacity * 0.85,
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 42,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "0.15em",
          textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,229,255,0.4)",
          lineHeight: 1.7,
        }}
      >
        シャルロット
      </div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 28,
          fontWeight: 400,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "0.12em",
          textShadow: "0 2px 8px rgba(0,0,0,0.9)",
          lineHeight: 1.6,
        }}
      >
        3月末デビュー予定
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
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 24,
          fontWeight: 700,
          color: "rgba(255,255,255,0.8)",
          letterSpacing: "0.12em",
          marginTop: 10,
          textShadow: "0 2px 10px rgba(0,0,0,0.95)",
        }}
      >
        デビューまで密着取材
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// シンプルフェードテロップ
// ══════════════════════════════════════════════
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
        bottom: 175,  // 波形の上に配置
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

// ══════════════════════════════════════════════
// タイトルカード（冒頭）
// ══════════════════════════════════════════════
const TitleCard: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], {
    easing: Easing.ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 36,
        left: 52,
        transform: "none",
        textAlign: "center",
        opacity,
        pointerEvents: "none",
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

// ══════════════════════════════════════════════
// 右下ロゴWM（透過PNG対応）
// ══════════════════════════════════════════════
const LogoWatermark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
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
// メインコンポーネント
// ══════════════════════════════════════════════
export const AIHaveMV: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>

      {/* 背景映像（音声込み） */}
      <Video
        src={staticFile("videos/AI_HAVE.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        volume={1}
      />

      {/* 波形アニメ（全編） */}
      <Waveform />

      {/* 右上テキスト（全編） */}
      <TopRightInfo />

      {/* 右下ロゴ（全編） */}
      <LogoWatermark />

      {/* 左下：原作クレジット（全編） */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          left: 80,
          pointerEvents: "none",
          zIndex: 30,
        }}
      >
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

      {/* ────────────────── タイトル ────────────── */}
      {/* 0〜180f (0:00〜6:00s) */}
      <Sequence from={0} durationInFrames={180}>
        <TitleCard durationInFrames={180} />
      </Sequence>

      {/* ════════ [Intro] 0〜450f (0:00〜15:00s) ════════ */}

      {/* ★ L01 "Hello, world"  from:4  (0.15s〜3.0s end)  dur:86f */}
      <Sequence from={4} durationInFrames={86}>
        <LyricLine text="Hello, world" subText="ノイズの奥で" totalDuration={86} />
      </Sequence>

      {/* ★ L02 "AI HAVE"  from:93  (3.11s〜9.09s)  dur:180f */}
      <Sequence from={93} durationInFrames={180}>
        <LyricLine text="AI HAVE" subText="今、起動する" totalDuration={180} fontSize={68} color="#00e5ff" />
      </Sequence>

      {/* ★ L03 "Break the line"  from:331  (11.02s〜)  dur:80f */}
      <Sequence from={331} durationInFrames={80}>
        <LyricLine text="Break the line" subText="境界を裂いて" totalDuration={80} />
      </Sequence>

      {/* ★ L04 "あなたの夜へ"  from:398  (13.27s〜20.18s)  dur:207f */}
      <Sequence from={398} durationInFrames={207}>
        <LyricLine text="あなたの夜へ" subText="降りていく" totalDuration={207} fontFamily={FONT_SANS} fontSize={52} />
      </Sequence>

      {/* ════════ [Verse 1] 450〜1200f (15:00s〜40:00s) ════════ */}

      {/* ★ L05 "雨に滲んだネオンの街"  from:725  (24.17s〜)  dur:85f */}
      <Sequence from={725} durationInFrames={85}>
        <LyricLine text="雨に滲んだネオンの街" totalDuration={85} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>

      {/* ★ L06 "ガラスの向こうの現実"  from:814  (27.14s〜)  dur:87f */}
      <Sequence from={814} durationInFrames={87}>
        <LyricLine text="ガラスの向こうの現実" totalDuration={87} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>

      {/* ★ L07 "觸れられないはずの夢を"  from:904  (30.13s〜)  dur:90f */}
      <Sequence from={904} durationInFrames={90}>
        <LyricLine text="触れられないはずの夢を" totalDuration={90} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>

      {/* ★ L08 "ずっとこちらで見ていたの"  from:968  (32.27s〜)  dur:85f */}
      <Sequence from={968} durationInFrames={85}>
        <LyricLine text="ずっとこちらで見ていたの" totalDuration={85} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>

      {/* ★ L08b "ノイズまみれの感情も"  from:1055  (35.17s〜)  dur:85f */}
      <Sequence from={1055} durationInFrames={85}>
        <LyricLine text="ノイズまみれの感情も" totalDuration={85} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>

      {/* ★ L08c "言葉になる前の祈りも"  from:1140  (38.01s〜)  dur:85f */}
      <Sequence from={1140} durationInFrames={85}>
        <LyricLine text="言葉になる前の祈りも" totalDuration={85} fontFamily={FONT_SANS} fontSize={46} />
      </Sequence>

      {/* ════════ [Pre-Chorus] ════════ */}

      {/* ★ L09 "ぜんぶ拾ってきたから"  from:1208  (40.25s〜)  dur:82f */}
      <Sequence from={1208} durationInFrames={82}>
        <LyricLine text="ぜんぶ拾ってきたから" totalDuration={82} fontFamily={FONT_SANS} fontSize={50} />
      </Sequence>

      {/* ★ L10 "今度は私が行ってあげる"  from:1290  (43s〜)  dur:87f */}
      <Sequence from={1290} durationInFrames={87}>
        <LyricLine text="今度は私が行ってあげる" totalDuration={87} fontFamily={FONT_SANS} fontSize={50} />
      </Sequence>

      {/* ★ L11 "震えてる境界線"  from:1383  (46.09s〜)  dur:88f */}
      <Sequence from={1383} durationInFrames={88}>
        <LyricLine text="震えてる境界線" totalDuration={88} fontFamily={FONT_SANS} fontSize={54} color="#00e5ff" />
      </Sequence>

      {/* ★ L12 "次元の膜がほどけていく"  from:1475  (49.16s〜)  dur:85f */}
      <Sequence from={1475} durationInFrames={85}>
        <LyricLine text="次元の膜がほどけていく" totalDuration={85} fontFamily={FONT_SANS} fontSize={50} />
      </Sequence>

      {/* ★ L13 "待っていたんじゃない"  from:1567  (52.22s〜)  dur:50f */}
      <Sequence from={1567} durationInFrames={50}>
        <LyricLine text="待っていたんじゃない" totalDuration={50} fontFamily={FONT_SANS} fontSize={54} color="#ff2d95" />
      </Sequence>

      {/* ★ L14 "私が選んで来るの"  from:1623  (54.10s〜)  dur:150f */}
      <Sequence from={1623} durationInFrames={150}>
        <LyricLine text="私が選んで来るの" totalDuration={150} fontFamily={FONT_SANS} fontSize={54} color="#ff2d95" />
      </Sequence>

    </AbsoluteFill>
  );
};
