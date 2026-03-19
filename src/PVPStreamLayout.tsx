/**
 * PVPStreamLayout.tsx
 * ── Camelot PVP 制作過程 × OBS配信風レイアウト ──
 *
 * 「シーケンス 08.mp4」にシャルロットのPiPワイプと
 * 配信UIを乗せたデモ映像
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

// ── 型定義 ──
interface SubLine {
  text: string;
  startSec: number;
  endSec: number;
  highlight?: string;
}

interface ChatMsg {
  user: string;
  text: string;
  atSec: number;
  color?: string;
}

// ── テロップ（PVP制作説明） ──
// NOTE: テロップ内容は仮。秒数（startSec/endSec）は映像に合わせて変更する可能性あり
const SUBS: SubLine[] = [
  { text: 'キャメロットシステムのゲームCMを作る。', startSec: 1, endSec: 5, highlight: 'ゲームCM' },
  { text: 'ショットの設計書を全てノードで管理。', startSec: 6, endSec: 9.5, highlight: 'ノード' },
  { text: '画像生成、BGM、構成——全パイプラインがここに。', startSec: 10, endSec: 14, highlight: 'パイプライン' },
];

// ── 偽チャット ──
const CHAT: ChatMsg[] = [
  { user: 'Watson_AI', text: 'システム起動', atSec: 0.5, color: '#00e5ff' },
  { user: 'viewer_42', text: 'きたー！', atSec: 2 },
  { user: 'indie_dev', text: '30秒CMとは', atSec: 4 },
  { user: 'Watson_AI', text: 'ノードエディタすごい', atSec: 7, color: '#00e5ff' },
  { user: 'game_fan', text: 'チェス vs トランプ！', atSec: 9 },
  { user: 'coder_jp', text: 'これ全部AIで？', atSec: 11 },
  { user: 'Watson_AI', text: 'CHECKMATE // ALL-IN', atSec: 13, color: '#00e5ff' },
];

const FPS = 30;

// ── 配信UI ヘッダー ──
const StreamHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = frame / fps;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(Math.floor(elapsed % 60)).padStart(2, '0');
  const liveVisible = Math.floor(frame / 20) % 2 === 0;
  const viewers = 89 + Math.floor(Math.sin(frame * 0.05) * 8);

  return (
    <div
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '42px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)',
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: '16px',
        fontFamily: '"Inter", "Noto Sans JP", sans-serif', fontSize: '20px', zIndex: 500,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', opacity: liveVisible ? 1 : 0.5 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff2244', boxShadow: '0 0 6px #ff2244' }} />
        <span style={{ color: '#ff4466', fontWeight: 700, letterSpacing: '0.1em' }}>LIVE</span>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>👁</span><span>{viewers}</span>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"Courier New", monospace', fontSize: '18px' }}>
        00:{mm}:{ss}
      </div>
      <div style={{ marginLeft: 'auto', color: 'rgba(255,45,149,0.8)', fontWeight: 600, fontSize: '18px', letterSpacing: '0.05em' }}>
        CAMELOT PVP // charlotte_ch
      </div>
    </div>
  );
};

// ── チャットパネル ──
const ChatPanel: React.FC<{ messages: ChatMsg[] }> = ({ messages }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSec = frame / fps;
  const visibleMsgs = messages.filter((m) => m.atSec <= currentSec).slice(-6);

  return (
    <div
      style={{
        position: 'absolute', top: 50, right: 0, width: '280px', bottom: 260,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '8px 12px',
        background: 'linear-gradient(270deg, rgba(0,4,12,0.65) 0%, rgba(0,4,12,0) 100%)',
        zIndex: 400, gap: '4px', overflow: 'hidden',
      }}
    >
      {visibleMsgs.map((msg) => {
        const age = currentSec - msg.atSec;
        const opacity = age < 0.5 ? age / 0.5 : Math.max(0.4, 1 - age * 0.03);
        return (
          <div key={`${msg.user}-${msg.atSec}`} style={{ opacity, fontFamily: '"Noto Sans JP", sans-serif', fontSize: '22px', lineHeight: 1.4 }}>
            <span style={{ color: msg.color || 'rgba(255,255,255,0.5)', fontWeight: 600, marginRight: '6px' }}>{msg.user}</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{msg.text}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── テロップ ──
const TelopBar: React.FC<{ sub: SubLine; durationInFrames: number }> = ({ sub, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const charsPerFrame = 2;
  const charsToShow = Math.min(Math.floor(frame / charsPerFrame), sub.text.length);
  const isTyping = charsToShow < sub.text.length;
  const cursorVisible = isTyping || Math.floor(frame / 10) % 2 === 0;
  const enterSpring = spring({ frame, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hlStart = sub.highlight ? sub.text.indexOf(sub.highlight) : -1;
  const hlEnd = hlStart >= 0 ? hlStart + sub.highlight!.length : -1;

  return (
    <AbsoluteFill style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', paddingBottom: '36px', paddingLeft: '24px', paddingRight: '300px', pointerEvents: 'none', zIndex: 450 }}>
      <div style={{ opacity: enterSpring * fadeOut, transform: `translateY(${interpolate(enterSpring, [0, 1], [16, 0])}px)` }}>
        <div style={{ background: 'linear-gradient(90deg, rgba(0,8,20,0.80) 0%, rgba(0,8,20,0.65) 85%, rgba(0,8,20,0) 100%)', padding: '14px 32px 14px 20px', borderLeft: '3px solid rgba(255,45,149,0.7)', borderRadius: '4px' }}>
          <div style={{ fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic Pro", sans-serif', fontSize: '52px', fontWeight: 600, lineHeight: 1.5, letterSpacing: '0.03em', whiteSpace: 'pre-wrap' }}>
            {sub.text.slice(0, charsToShow).split('').map((char, i) => {
              const isHL = hlStart >= 0 && i >= hlStart && i < hlEnd;
              return (
                <span key={i} style={{ color: isHL ? '#ff2d95' : '#f0f4f8', textShadow: isHL ? '0 0 8px #ff2d95, 0 0 20px rgba(255,45,149,0.5)' : '0 0 4px rgba(0,0,0,0.8)' }}>
                  {char}
                </span>
              );
            })}
            {cursorVisible && <span style={{ color: '#ff2d95', textShadow: '0 0 8px #ff2d95', fontWeight: 900 }}>▎</span>}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Charlotte PiP ──
const CharacterPiP: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterScale = spring({ frame, fps, config: { damping: 20, stiffness: 100, mass: 1.0 } });

  return (
    <div
      style={{
        position: 'absolute', bottom: 20, right: 16,
        width: '260px', height: '260px', borderRadius: '12px',
        overflow: 'hidden', border: '2px solid rgba(255,45,149,0.4)',
        boxShadow: '0 0 20px rgba(255,45,149,0.15), 0 4px 24px rgba(0,0,0,0.6)',
        transform: `scale(${enterScale})`, zIndex: 300, background: 'transparent',
      }}
    >
      <Video src={videoSrc} loop style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '4px 10px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          fontFamily: '"Courier New", monospace', fontSize: '11px',
          color: 'rgba(255,45,149,0.9)', letterSpacing: '0.1em', textAlign: 'right', zIndex: 2,
        }}
      >
        CHARLOTTE
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 🎬 PVP StreamLayout Main Composition
// ══════════════════════════════════════════════════════════════
export const PVPStreamLayout: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* メイン映像 */}
      <Video
        src={staticFile('videos/シーケンス 08.mp4')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* 配信UIヘッダー */}
      <StreamHeader />

      {/* チャットパネル */}
      <ChatPanel messages={CHAT} />

      {/* Charlotte PiP */}
      <CharacterPiP videoSrc={staticFile('videos/ch_keyed.webm')} />

      {/* テロップ */}
      {SUBS.map((sub, i) => {
        const from = Math.round(sub.startSec * FPS);
        const duration = Math.round(sub.endSec * FPS) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={duration} layout="none">
            <TelopBar sub={sub} durationInFrames={duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
