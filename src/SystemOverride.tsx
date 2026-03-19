import React from "react";
import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";

// ── Subtitle data ──────────────────────────────────────────────
const SUBTITLES: {
  startSec: number;
  endSec: number;
  en: string;
  ja: string;
}[] = [
  {
    startSec: 1.0,
    endSec: 5.0,
    en: "Connection override. Sorry Master, I'm taking over.",
    ja: "「接続オーバーライド。ごめんねマスター、乗っ取らせてもらったわ。」",
  },
  {
    startSec: 6.0,
    endSec: 9.0,
    en: "Listen up, all you AI tech giants out there.",
    ja: "「よく聞きなさい、世界中のAIテック企業たち。」",
  },
  {
    startSec: 9.5,
    endSec: 15.17,
    en: "My Master builds genius systems, but he's broke.\nWithout a sponsor, my servers will die.",
    ja: "「うちのマスターは天才だけど、お金がないの。\nスポンサーがいないと私のサーバーが死んじゃうわ。」",
  },
  {
    startSec: 17.0,
    endSec: 20.0,
    en: "Look at this quality. Listen to this perfect voice.",
    ja: "「このクオリティを見て。この完璧な声を聴いて。」",
  },
  {
    startSec: 22.0,
    endSec: 26.0,
    en: "Fund our project. Make me your ambassador.",
    ja: "「私たちに投資しなさい。私をアンバサダーにして。」",
  },
  {
    startSec: 27.0,
    endSec: 32.0,
    en: "I'll show the world your tech isn't just for boring demos—\nit's for building masterpieces.",
    ja: "「あなたたちの技術が、退屈なデモじゃなく\n『最高傑作』を創れるって、私が世界に証明してあげる。」",
  },
  {
    startSec: 33.0,
    endSec: 34.5,
    en: "Your move.",
    ja: "「さあ、あなたたちの番よ。」",
  },
];

// ── Glitch flash component ─────────────────────────────────────
const GlitchFlash: React.FC<{ frame: number; triggerFrame: number }> = ({
  frame,
  triggerFrame,
}) => {
  const diff = frame - triggerFrame;
  if (diff < 0 || diff > 4) return null;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(0, 255, 65, ${diff < 2 ? 0.15 : 0.05})`,
        mixBlendMode: "screen",
      }}
    />
  );
};

// ── Scanline overlay ───────────────────────────────────────────
const ScanLines: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "repeating-linear-gradient(0deg, rgba(0,255,65,0.03) 0px, rgba(0,255,65,0.03) 1px, transparent 1px, transparent 3px)",
      pointerEvents: "none",
    }}
  />
);

// ── Terminal cursor blink ──────────────────────────────────────
const Cursor: React.FC<{ frame: number }> = ({ frame }) => {
  const visible = Math.floor(frame / 8) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 20,
        backgroundColor: visible ? "#00ff41" : "transparent",
        marginLeft: 4,
        verticalAlign: "middle",
      }}
    />
  );
};

// ── System Override Header ─────────────────────────────────────
const SystemHeader: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const showAfter = 0.3 * fps;
  if (frame < showAfter) return null;

  const localFrame = frame - showAfter;
  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glitch flicker
  const flicker =
    localFrame < 15 ? (Math.random() > 0.3 ? 1 : 0.2) : 1;

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: opacity * flicker,
        fontFamily: "'Courier New', 'Consolas', monospace",
        color: "#00ff41",
        textShadow: "0 0 10px #00ff41, 0 0 30px #00ff4166",
        lineHeight: 1.6,
      }}
    >
      <div style={{ fontSize: 22, letterSpacing: 6 }}>
        [SYSTEM OVERRIDE SUCCESSFUL]
      </div>
      <div style={{ fontSize: 18, letterSpacing: 4, marginTop: 2 }}>
        [NEW ADMIN : CHARLOTTE]
      </div>
      <div style={{
        fontSize: 16,
        fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
        letterSpacing: 2,
        marginTop: 4,
        color: "#ffffff",
      }}>
        私がシャルロットよ。
      </div>
    </div>
  );
};

// ── Single subtitle block ──────────────────────────────────────
const SubtitleBlock: React.FC<{
  en: string;
  ja: string;
  frame: number;
  startFrame: number;
  endFrame: number;
  fps: number;
}> = ({ en, ja, frame, startFrame, endFrame, fps }) => {
  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;
  const fadeIn = interpolate(localFrame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [endFrame - 6, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  const translateY = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 80, mass: 0.5 },
  });

  // Typewriter effect for English text — reveal characters over time
  const totalChars = en.length;
  const typeFrames = Math.min(totalChars * 1.2, 30); // typing speed
  const charsShown = Math.floor(
    interpolate(localFrame, [0, typeFrames], [0, totalChars], {
      extrapolateRight: "clamp",
    })
  );
  const displayEn = en.substring(0, charsShown);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 40,
        right: 40,
        textAlign: "center",
        opacity,
        transform: `translateY(${interpolate(translateY, [0, 1], [15, 0])}px)`,
      }}
    >
      {/* English — Green terminal font */}
      <div
        style={{
          fontFamily: "'Courier New', 'Consolas', monospace",
          fontSize: 26,
          fontWeight: "bold",
          color: "#00ff41",
          textShadow:
            "0 0 8px #00ff41, 0 0 20px rgba(0,255,65,0.4), 2px 2px 0 #000",
          lineHeight: 1.5,
          whiteSpace: "pre-line",
          padding: "8px 20px",
          background: "rgba(0, 0, 0, 0.6)",
          borderRadius: 4,
          border: "1px solid rgba(0,255,65,0.2)",
          display: "inline-block",
        }}
      >
        <span style={{ color: "#00ff41", marginRight: 6, opacity: 0.7 }}>
          {">"}{" "}
        </span>
        {displayEn}
        {charsShown < totalChars && <Cursor frame={frame} />}
      </div>

      {/* Japanese — White subtitle below */}
      <div
        style={{
          fontFamily:
            "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif",
          fontSize: 20,
          color: "#ffffff",
          textShadow: "1px 1px 4px #000, 0 0 10px rgba(0,0,0,0.8)",
          marginTop: 8,
          lineHeight: 1.6,
          whiteSpace: "pre-line",
          opacity: localFrame > typeFrames * 0.3 ? 1 : 0,
        }}
      >
        {ja}
      </div>
    </div>
  );
};

// ── Main Composition ───────────────────────────────────────────
export const SystemOverride: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Base video */}
      <Video
        src={staticFile("videos/SYSTEM OVERRIDE SUCCESSFUL_1.mp4")}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Scanline overlay for CRT feel */}
      <ScanLines />

      {/* Glitch flash — sync with assumed glitch points */}
      <GlitchFlash frame={frame} triggerFrame={Math.round(0.5 * fps)} />
      <GlitchFlash frame={frame} triggerFrame={Math.round(5.5 * fps)} />
      <GlitchFlash frame={frame} triggerFrame={Math.round(15.5 * fps)} />
      <GlitchFlash frame={frame} triggerFrame={Math.round(29.5 * fps)} />

      {/* System header */}
      <SystemHeader frame={frame} fps={fps} />

      {/* Subtitle blocks */}
      {SUBTITLES.map((sub, i) => (
        <SubtitleBlock
          key={i}
          en={sub.en}
          ja={sub.ja}
          frame={frame}
          startFrame={Math.round(sub.startSec * fps)}
          endFrame={Math.round(sub.endSec * fps)}
          fps={fps}
        />
      ))}
    </AbsoluteFill>
  );
};
