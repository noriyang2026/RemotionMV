/**
 * PVPCM.tsx
 * ── Camelot PVP 30秒 CM — JSON駆動コンポジション ──
 *
 * pvp_config.json を読み込み、32ショットを Sequence で連結。
 * トランジション（cut/fade/slide/zoom）をフレーム単位で実行。
 * BGM: CHECKMATE_ALL-IN.wav
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  Video,
  Img,
  Audio,
  staticFile,
} from 'remotion';
import pvpConfig from './data/pvp_config.json';

// ── 型定義 ──
interface ShotConfig {
  shotId: string;
  set: string;
  section: string;
  durationSec: number;
  durationFrames: number;
  transition: 'cut' | 'fade' | 'slide' | 'zoom';
  description: string;
  hasV2: boolean;
  v2url: string | null;
  v1url: string | null;
}

// ── トランジション定数 ──
const TRANS_FRAMES = {
  fade: 12,
  slide: 9,
  zoom: 9,
  cut: 0,
};

// ── ショットスライド ──
const ShotSlide: React.FC<{
  shot: ShotConfig;
  durationInFrames: number;
}> = ({ shot, durationInFrames }) => {
  const frame = useCurrentFrame();
  const transType = shot.transition || 'cut';
  const transFrames = TRANS_FRAMES[transType];

  // --- Transition In ---
  let opacity = 1;
  let translateX = 0;
  let scale = 1;

  if (transType === 'fade' && transFrames > 0) {
    opacity = interpolate(frame, [0, transFrames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (transType === 'slide' && transFrames > 0) {
    translateX = interpolate(frame, [0, transFrames], [100, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    opacity = interpolate(frame, [0, 3], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (transType === 'zoom' && transFrames > 0) {
    scale = interpolate(frame, [0, transFrames], [1.3, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    opacity = interpolate(frame, [0, transFrames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  // --- Fade Out (last 6 frames) ---
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const combinedOpacity = opacity * fadeOut;

  // --- Ken Burns (subtle slow zoom for still images) ---
  const isVideo = shot.hasV2 && shot.v2url;
  const kenBurns = isVideo
    ? 1
    : interpolate(frame, [0, durationInFrames], [1, 1.08], {
        extrapolateRight: 'clamp',
      });

  const mediaSrc = isVideo
    ? staticFile(shot.v2url!)
    : staticFile(shot.v1url || '');

  return (
    <AbsoluteFill
      style={{
        opacity: combinedOpacity,
        transform: `translateX(${translateX}%) scale(${scale})`,
        backgroundColor: '#000',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {isVideo ? (
          <Video
            src={mediaSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${scale > 1 ? 1 : 1})`,
            }}
          />
        ) : (
          <Img
            src={mediaSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${kenBurns})`,
              transformOrigin: 'center center',
            }}
          />
        )}
      </div>

      {/* ── Shot ID Indicator (subtle) ── */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          fontFamily: '"Courier New", monospace',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.1em',
          zIndex: 10,
        }}
      >
        {shot.shotId}
      </div>
    </AbsoluteFill>
  );
};

// ── セクションタイトルオーバーレイ ──
const SectionTitle: React.FC<{
  title: string;
  durationInFrames: number;
}> = ({ title, durationInFrames }) => {
  const frame = useCurrentFrame();
  const enterOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const slideUp = interpolate(frame, [0, 15], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: enterOpacity * exitOpacity,
        transform: `translateY(${slideUp}px)`,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '10px 36px',
          background: 'rgba(0,0,0,0.65)',
          borderLeft: '3px solid rgba(0,229,255,0.7)',
          borderRight: '3px solid rgba(255,45,149,0.7)',
          fontFamily: '"Noto Sans JP", "Inter", sans-serif',
          fontSize: '28px',
          fontWeight: 700,
          color: '#f0f4f8',
          letterSpacing: '0.08em',
          textShadow: '0 0 12px rgba(0,229,255,0.4)',
        }}
      >
        {title}
      </div>
    </div>
  );
};

// ── セクションタイトルマップ ──
const SECTION_TITLES: Record<string, string> = {
  A1: 'Checkmate or all-in',
  A2: '敷かれた理はもう揺るがない',
  A3: '赤と黒が笑ってる',
  A4: '理性と悪夢の開戦',
  B1: 'White or red',
  B2: 'CHECKMATE // ALL-IN',
  B3: 'この世界ごと奪い合え',
  B4: 'さあ、ゲームを始めましょう',
};

// ══════════════════════════════════════════════════════════════
// 🎬 PVPCM Main Composition
// ══════════════════════════════════════════════════════════════
export const PVPCM: React.FC = () => {
  const shots = pvpConfig.shots as ShotConfig[];

  // Compute cumulative start frames
  let currentFrame = 0;
  const shotEntries = shots.map((shot) => {
    const entry = { shot, startFrame: currentFrame };
    currentFrame += shot.durationFrames;
    return entry;
  });

  // Compute section start/end for titles
  const sectionMap: Record<
    string,
    { startFrame: number; endFrame: number }
  > = {};
  shotEntries.forEach(({ shot, startFrame }) => {
    const sec = shot.section;
    if (!sectionMap[sec]) {
      sectionMap[sec] = {
        startFrame,
        endFrame: startFrame + shot.durationFrames,
      };
    } else {
      sectionMap[sec].endFrame = startFrame + shot.durationFrames;
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* BGM */}
      <Audio src={staticFile('music/CHECKMATE_ALL-IN.wav')} volume={0.85} />

      {/* ── Shots ── */}
      {shotEntries.map(({ shot, startFrame }) => (
        <Sequence
          key={shot.shotId}
          from={startFrame}
          durationInFrames={shot.durationFrames}
          layout="none"
        >
          <ShotSlide shot={shot} durationInFrames={shot.durationFrames} />
        </Sequence>
      ))}

      {/* ── Section Titles (first shot of each section) ── */}
      {Object.entries(sectionMap).map(([section, { startFrame, endFrame }]) => {
        const title = SECTION_TITLES[section];
        if (!title) return null;
        // Show title for first 2 seconds of section
        const titleDur = Math.min(60, endFrame - startFrame);
        return (
          <Sequence
            key={`title-${section}`}
            from={startFrame}
            durationInFrames={titleDur}
            layout="none"
          >
            <SectionTitle title={title} durationInFrames={titleDur} />
          </Sequence>
        );
      })}

      {/* ── Vignette overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
          zIndex: 30,
        }}
      />
    </AbsoluteFill>
  );
};
