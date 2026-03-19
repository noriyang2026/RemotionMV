/**
 * AIHaveShorts.tsx
 * AI HAVE — YouTube Shorts 縦型版 (1080×1920)
 *
 * レイアウト:
 *   上帯 (656px) : シャルロット / 3月末デビュー予定
 *   中央 (608px) : AI_HAVE.mp4 (16:9 → 1080×608)
 *   下帯 (656px) : シングル『AI HAVE』/ いいね・フォロー CTA
 */

import React from "react";
import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
} from "remotion";

const FONT_MONO = '"JetBrains Mono", "Courier New", monospace';
const FONT_SANS = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif';

const CYAN = "#00e5ff";
const MAGENTA = "#ff2d95";

// 縦型サイズ定数
const W = 1080;
const H = 1920;
const VIDEO_H = Math.round(W * 9 / 16); // 607.5 → 608
const BAR_H = Math.round((H - VIDEO_H) / 2); // 656

// ——— フェードイン（全体） ———
const useGlobalFade = (fadeFrames = 30) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, 1, 1, 0],
    { easing: Easing.ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
};

// ——— 上帯コンポーネント ———
const TopBar: React.FC = () => {
  const opacity = useGlobalFade();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: W,
        height: BAR_H,
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        opacity,
        zIndex: 10,
      }}
    >
      {/* キャラ名 */}
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 72,
          fontWeight: 900,
          color: "#fff",
          letterSpacing: "0.15em",
          textShadow: `0 0 40px ${CYAN}88`,
        }}
      >
        シャルロット
      </div>

      {/* デビュー情報 */}
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 40,
          fontWeight: 400,
          color: "rgba(255,255,255,0.8)",
          letterSpacing: "0.18em",
        }}
      >
        3月末デビュー予定
      </div>

      {/* シアンライン */}
      <div
        style={{
          width: 320,
          height: 2,
          backgroundColor: CYAN,
          borderRadius: 1,
          marginTop: 8,
          boxShadow: `0 0 12px ${CYAN}`,
        }}
      />
    </div>
  );
};

// ——— 下帯コンポーネント ———
const BottomBar: React.FC = () => {
  const opacity = useGlobalFade();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: W,
        height: BAR_H,
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        opacity,
        zIndex: 10,
      }}
    >
      {/* マゼンタライン */}
      <div
        style={{
          width: 320,
          height: 2,
          backgroundColor: MAGENTA,
          borderRadius: 1,
          boxShadow: `0 0 12px ${MAGENTA}`,
          marginBottom: 4,
        }}
      />

      {/* シングルタイトル */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 34,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.2em",
            marginBottom: 10,
          }}
        >
          シングル
        </div>
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 64,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "0.12em",
            textShadow: `0 0 30px ${MAGENTA}88`,
          }}
        >
          『AI HAVE』
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 36,
          fontWeight: 700,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.1em",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        良いと思ったら
        <br />
        イイね & フォローお願いします！
      </div>
    </div>
  );
};

// ——— メインコンポーネント ———
export const AIHaveShorts: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>

      {/* 中央：横動画を縦型の中央に配置 */}
      <div
        style={{
          position: "absolute",
          top: BAR_H,
          left: 0,
          width: W,
          height: VIDEO_H,
          overflow: "hidden",
        }}
      >
        <Video
          src={staticFile("videos/AI_HAVE_MV.mp4")}
          style={{ width: W, height: VIDEO_H, objectFit: "cover" }}
          volume={1}
        />
      </div>

      {/* 上帯 */}
      <TopBar />

      {/* 下帯 */}
      <BottomBar />

    </AbsoluteFill>
  );
};
