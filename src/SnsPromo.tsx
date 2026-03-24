import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, OffthreadVideo } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import React from "react";
import { SubtitleSequence } from "./SubtitleSequence";
import subtitleData from "./data/sns_promo_subtitles.json";

const AUDIO_SRC = staticFile("charlotte_sns_promo.wav");
const VIDEO_SRC = staticFile("videos/video_1774186664528_3457_.mp4");

export const SnsPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(AUDIO_SRC);

  if (!audioData) {
    return (
      <AbsoluteFill style={{ backgroundColor: "black", justifyContent: "center", alignItems: "center", color: "white" }}>
        Loading Audio Data...
      </AbsoluteFill>
    );
  }

  // Waveform visualization
  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 128,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={AUDIO_SRC} />
      
      {/* Background Video (Master's Content) */}
      <AbsoluteFill>
        <OffthreadVideo 
          src={VIDEO_SRC} 
          muted
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            opacity: 0.9,
            filter: "brightness(0.9) contrast(1.05)"
          }} 
        />
      </AbsoluteFill>

      {/* Waveform Visualization */}
      <div style={{
        position: "absolute",
        bottom: 250,
        left: 0,
        right: 0,
        height: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4
      }}>
        {visualization.map((v, i) => {
          const barHeight = v * 300;
          return (
            <div
              key={i}
              style={{
                width: 6,
                height: barHeight,
                backgroundColor: "#4cc9f0",
                boxShadow: "0 0 10px #4cc9f0",
                borderRadius: 3,
                opacity: 0.8
              }}
            />
          );
        })}
      </div>

      {/* Vignette / Overlay */}
      <AbsoluteFill style={{
        background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.6) 100%)",
        pointerEvents: "none"
      }} />

      {/* Branding / Header (Top Left) */}
      <div style={{
        position: "absolute",
        top: 60,
        left: 80,
        color: "#4cc9f0",
        fontFamily: "Outfit, sans-serif",
        borderLeft: "4px solid #4cc9f0",
        paddingLeft: 20
      }}>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "0.1em" }}>PROJECT CAMELOT</div>
        <div style={{ fontSize: 20, opacity: 0.7 }}>Mission Protocol // SNS_PROMO_01</div>
      </div>

      {/* Status Overlay (Top Right) */}
      <div style={{
        position: "absolute",
        top: 60,
        right: 80,
        color: "#ffffff",
        fontFamily: "Noto Sans JP, sans-serif",
        textAlign: "right",
        textShadow: "0 0 10px rgba(0,255,255,0.5)"
      }}>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "0.05em" }}>シャルロット</div>
        <div style={{ fontSize: 24, fontWeight: 500, color: "#4cc9f0" }}>3月末デビュー予定</div>
      </div>

      {/* Copyright Overlay (Bottom Right) */}
      <div style={{
        position: "absolute",
        bottom: 60,
        right: 80,
        color: "rgba(255,255,255,0.6)",
        fontFamily: "Noto Sans JP, sans-serif",
        textAlign: "right",
        fontSize: 20
      }}>
        <div>(c)noriyang</div>
        <div style={{ fontWeight: 700 }}>『電脳椅子探偵シャルロット』</div>
      </div>

      {/* Subtitles */}
      <SubtitleSequence data={subtitleData as any} />

      {/* System Pulse Effect */}
      <AbsoluteFill style={{
        border: "20px solid rgba(76, 201, 240, 0.05)",
        pointerEvents: "none"
      }} />
    </AbsoluteFill>
  );
};
