/**
 * CyberWitch.tsx
 * Cyber Witch: Materialized — メインコンポジション
 *
 * 動画の上にタイポグラフィをオーバーレイする構成:
 *   1. 背景動画 (Cyber Witch_ Materialized.mp4)
 *   2. スキャンライン（うっすら走査線）
 *   3. LyricsOverlay（逐次 Sequence で歌詞を配置）
 */

import React from "react";
import {
  AbsoluteFill,
  Video,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { lyricsData } from "./data/cyberWitchLyrics";
import { AnimatedText } from "./CyberWitchTypography";

const VIDEO_SRC = staticFile("videos/Cyber Witch_ Materialized.mp4");

// ─── スキャンラインオーバーレイ ───
const Scanlines: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `repeating-linear-gradient(
        0deg,
        rgba(0,0,0,0.04) 0px,
        rgba(0,0,0,0.04) 1px,
        transparent 1px,
        transparent 3px
      )`,
      zIndex: 5,
    }}
  />
);

// ─── ビネット（四隅暗く） ───
const Vignette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
      zIndex: 4,
    }}
  />
);

// ─── 歌詞オーバーレイ ───
const LyricsOverlay: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
      {lyricsData.map((lyric) => {
        const startFrame = Math.round(lyric.start * fps);
        const durationInFrames = Math.round((lyric.end - lyric.start) * fps);

        return (
          <Sequence
            key={lyric.id}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <AnimatedText text={lyric.text} type={lyric.type} />
          </Sequence>
        );
      })}
    </div>
  );
};

// ─── メインコンポジション ───
export const CyberWitch: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000000" }}>
    {/* 背景動画 */}
    <Video
      src={VIDEO_SRC}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />

    {/* エフェクトレイヤー */}
    <Vignette />
    <Scanlines />

    {/* タイポグラフィオーバーレイ */}
    <LyricsOverlay />
  </AbsoluteFill>
);
