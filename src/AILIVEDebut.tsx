/**
 * AILIVEDebut.tsx
 * ── YouTube Shorts 縦長フォーマット ──
 * 1080×1920 / 動画センター / 上下黒帯に宣伝テキスト
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Video,
  staticFile,
} from 'remotion';

const FPS = 30;

// ── 宣伝テキスト上部 ──────────────────────────────────────────
const TopPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = 0.85 + Math.sin(frame * 0.04) * 0.15;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '656px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '40px',
        opacity: fadeIn,
        zIndex: 100,
      }}
    >
      {/* AI LIVE ロゴ */}
      <div
        style={{
          fontFamily: '"Orbitron", "Inter", sans-serif',
          fontSize: '42px',
          fontWeight: 900,
          letterSpacing: '0.15em',
          color: '#00e5ff',
          textShadow: '0 0 20px rgba(0,229,255,0.6), 0 0 40px rgba(0,229,255,0.3)',
          opacity: pulse,
          marginBottom: '12px',
        }}
      >
        『AI LIVE! アライブ』
      </div>

      {/* サブテキスト */}
      <div
        style={{
          fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif',
          fontSize: '26px',
          fontWeight: 700,
          color: '#ff80ab',
          textShadow: '0 0 12px rgba(255,128,171,0.5)',
          letterSpacing: '0.08em',
        }}
      >
        🔔 シャルロット 3月末デビュー予定！
      </div>
    </div>
  );
};

// ── 宣伝テキスト下部 ──────────────────────────────────────────
const BottomPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [15, 40], [0, 1], { extrapolateRight: 'clamp' });
  const bounce = Math.sin(frame * 0.06) * 3;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '656px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '40px',
        gap: '16px',
        opacity: fadeIn,
        zIndex: 100,
      }}
    >
      {/* CTA テキスト */}
      <div
        style={{
          fontFamily: '"Zen Kaku Gothic New", "Noto Sans JP", sans-serif',
          fontSize: '24px',
          fontWeight: 700,
          color: '#f0f4f8',
          textShadow: '0 0 8px rgba(255,255,255,0.3)',
          letterSpacing: '0.06em',
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        良ければ、イイね👍とフォローお願いします！
      </div>

      {/* チャンネル名 */}
      <div
        style={{
          fontFamily: '"Orbitron", "Inter", sans-serif',
          fontSize: '18px',
          fontWeight: 600,
          color: 'rgba(0,229,255,0.7)',
          letterSpacing: '0.12em',
          textShadow: '0 0 8px rgba(0,229,255,0.3)',
          transform: `translateY(${bounce}px)`,
        }}
      >
        ▶ CHARLOTTE_CH
      </div>
    </div>
  );
};

// ── フレーム装飾 ──────────────────────────────────────────────
const FrameDecor: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.03) * 0.2 + 0.4;
  const border = `1px solid rgba(0,229,255,${pulse})`;

  return (
    <>
      {/* 動画領域のフレーム線 */}
      <div
        style={{
          position: 'absolute',
          top: 656,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, rgba(0,229,255,${pulse}) 30%, rgba(0,229,255,${pulse}) 70%, transparent 100%)`,
          zIndex: 50,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 656,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, rgba(0,229,255,${pulse}) 30%, rgba(0,229,255,${pulse}) 70%, transparent 100%)`,
          zIndex: 50,
        }}
      />
    </>
  );
};

// ══════════════════════════════════════════════════════════════
// 🎬 Main Composition — 1080×1920 縦長
// ══════════════════════════════════════════════════════════════
export const AILIVEDebut: React.FC = () => {
  // 動画エリア: 1080×608 (16:9) centered in 1080×1920
  // 上下の余白: (1920 - 608) / 2 = 656px each → 黒帯
  // ただし350pxはテキスト、残りは余白

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 動画 — センター配置 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          height: '608px',
          overflow: 'hidden',
        }}
      >
        <Video
          src={staticFile('videos/AILIVE_デビュー.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* 上部宣伝 */}
      <TopPromo />

      {/* 下部宣伝 */}
      <BottomPromo />

      {/* フレーム装飾 */}
      <FrameDecor />
    </AbsoluteFill>
  );
};
