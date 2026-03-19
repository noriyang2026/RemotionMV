/**
 * StreamLayout.tsx
 * ── OBS配信風レイアウト × YouTube解説動画テンプレート ──
 *
 * 構成:
 *  - メイン画面（動画/スクリーンキャプチャ）
 *  - Charlotte PiP（ワイプ / Picture-in-Picture）
 *  - 配信UI（● LIVE, 👁 視聴者数, タイムコード）
 *  - テロップ（タイプライター式 解説テキスト）
 *  - 偽チャットログ（フレーム連動）
 *
 * 使い方:
 *  defaultProps で mainVideo, characterImage, subtitles, chatMessages を差し替え可能
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
  Audio,
  staticFile,
} from 'remotion';

// ── 型定義 ────────────────────────────────────────────────────
interface SubLine {
  text: string;
  startSec: number;
  endSec: number;
  /** 強調ワード（シアングロー） */
  highlight?: string;
}

interface ChatMsg {
  user: string;
  text: string;
  /** 表示開始（秒） */
  atSec: number;
  color?: string;
}

// ── デフォルトデータ ──────────────────────────────────────────
const DEFAULT_SUBS: SubLine[] = [
  { text: '今日は、Remotionで「配信風」の動画を作る方法を教えるわ。', startSec: 1, endSec: 5.5, highlight: '配信風' },
  { text: 'OBSの画面構成をCSSで再現して、テロップとチャットを乗せる。', startSec: 7, endSec: 12, highlight: 'CSS' },
  { text: 'タイプライターエフェクトで「喋ってる感」を出すのがポイント。', startSec: 13.5, endSec: 18, highlight: 'タイプライター' },
  { text: 'グリーンバックもFFmpegで一発。全部コードで完結。', startSec: 19.5, endSec: 24, highlight: 'FFmpeg' },
  { text: '……ふふっ、簡単でしょう？ これであなたもストリーマーね。', startSec: 25.5, endSec: 29.5 },
];

const DEFAULT_CHAT: ChatMsg[] = [
  { user: 'Watson_AI', text: 'こんばんはー！', atSec: 2, color: '#00e5ff' },
  { user: 'viewer_42', text: '待ってました！', atSec: 4 },
  { user: 'indie_dev', text: 'Remotionすごい', atSec: 8 },
  { user: 'Watson_AI', text: 'CSSで配信画面作れるのか', atSec: 12, color: '#00e5ff' },
  { user: 'game_fan', text: 'OBSっぽいw', atSec: 15 },
  { user: 'coder_jp', text: 'タイプライター最高', atSec: 19 },
  { user: 'Watson_AI', text: 'これ量産できるわね', atSec: 23, color: '#00e5ff' },
  { user: 'indie_dev', text: '記事にしてほしい', atSec: 27 },
];

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

// ── 配信UI ヘッダー ──────────────────────────────────────────
const StreamHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = frame / fps;
  const hh = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const ss = String(Math.floor(elapsed % 60)).padStart(2, '0');

  const liveVisible = Math.floor(frame / 20) % 2 === 0;
  const viewers = 142 + Math.floor(Math.sin(frame * 0.05) * 12);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '42px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '16px',
        fontFamily: '"Inter", "Noto Sans JP", sans-serif',
        fontSize: '13px',
        zIndex: 500,
      }}
    >
      {/* LIVE */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          opacity: liveVisible ? 1 : 0.5,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff2244', boxShadow: '0 0 6px #ff2244' }} />
        <span style={{ color: '#ff4466', fontWeight: 700, letterSpacing: '0.1em' }}>LIVE</span>
      </div>

      {/* 視聴者数 */}
      <div style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>👁</span>
        <span>{viewers}</span>
      </div>

      {/* タイムコード */}
      <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"Courier New", monospace', fontSize: '12px' }}>
        {hh}:{mm}:{ss}
      </div>

      {/* チャンネル名 */}
      <div style={{ marginLeft: 'auto', color: 'rgba(0,229,255,0.6)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.05em' }}>
        charlotte_ch
      </div>
    </div>
  );
};

// ── チャットパネル ────────────────────────────────────────────
const ChatPanel: React.FC<{ messages: ChatMsg[] }> = ({ messages }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSec = frame / fps;

  const visibleMsgs = messages.filter((m) => m.atSec <= currentSec);
  // 最新6件だけ表示
  const displayMsgs = visibleMsgs.slice(-6);

  return (
    <div
      style={{
        position: 'absolute',
        top: 50,
        right: 0,
        width: '280px',
        bottom: 260,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '8px 12px',
        background: 'linear-gradient(270deg, rgba(0,4,12,0.65) 0%, rgba(0,4,12,0) 100%)',
        zIndex: 400,
        gap: '4px',
        overflow: 'hidden',
      }}
    >
      {displayMsgs.map((msg, i) => {
        const age = currentSec - msg.atSec;
        const opacity = age < 0.5 ? age / 0.5 : Math.max(0.4, 1 - age * 0.03);
        return (
          <div
            key={`${msg.user}-${msg.atSec}`}
            style={{
              opacity,
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '12px',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: msg.color || 'rgba(255,255,255,0.5)', fontWeight: 600, marginRight: '6px' }}>
              {msg.user}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{msg.text}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── テロップバー ──────────────────────────────────────────────
const TelopBar: React.FC<{
  sub: SubLine;
  durationInFrames: number;
}> = ({ sub, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // タイプライター
  const charsPerFrame = 2;
  const charsToShow = Math.min(Math.floor(frame / charsPerFrame), sub.text.length);
  const isTyping = charsToShow < sub.text.length;
  const cursorVisible = isTyping || Math.floor(frame / 10) % 2 === 0;

  // フェード
  const enterSpring = spring({ frame, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 強調ワード位置
  const hlStart = sub.highlight ? sub.text.indexOf(sub.highlight) : -1;
  const hlEnd = hlStart >= 0 ? hlStart + sub.highlight!.length : -1;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingBottom: '36px',
        paddingLeft: '24px',
        paddingRight: '300px',
        pointerEvents: 'none',
        zIndex: 450,
      }}
    >
      <div
        style={{
          opacity: enterSpring * fadeOut,
          transform: `translateY(${interpolate(enterSpring, [0, 1], [16, 0])}px)`,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(0,8,20,0.80) 0%, rgba(0,8,20,0.65) 85%, rgba(0,8,20,0) 100%)',
            padding: '14px 32px 14px 20px',
            borderLeft: '3px solid rgba(0,229,255,0.6)',
            borderRadius: '4px',
          }}
        >
          <div
            style={{
              fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic Pro", sans-serif',
              fontSize: '28px',
              fontWeight: 600,
              lineHeight: 1.5,
              letterSpacing: '0.03em',
              whiteSpace: 'pre-wrap',
            }}
          >
            {sub.text
              .slice(0, charsToShow)
              .split('')
              .map((char, i) => {
                const isHL = hlStart >= 0 && i >= hlStart && i < hlEnd;
                return (
                  <span
                    key={i}
                    style={{
                      color: isHL ? '#00e5ff' : '#f0f4f8',
                      textShadow: isHL
                        ? '0 0 8px #00e5ff, 0 0 20px rgba(0,229,255,0.5)'
                        : '0 0 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            {cursorVisible && (
              <span style={{ color: '#00e5ff', textShadow: '0 0 8px #00e5ff', fontWeight: 900 }}>▎</span>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Charlotte PiP（グリーンバック動画 + クロマキー）────────────
const CharacterPiP: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterScale = spring({ frame, fps, config: { damping: 20, stiffness: 100, mass: 1.0 } });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        right: 16,
        width: '260px',
        height: '260px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid rgba(0,229,255,0.3)',
        boxShadow: '0 0 20px rgba(0,229,255,0.1), 0 4px 24px rgba(0,0,0,0.6)',
        transform: `scale(${enterScale})`,
        zIndex: 300,
        background: 'transparent',
      }}
    >
      {/* グリーンバック除去済み動画（WebM alpha / ループ） */}
      <Video
        src={videoSrc}
        loop
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
        }}
      />
      {/* 名前ラベル */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '4px 10px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          fontFamily: '"Courier New", monospace',
          fontSize: '11px',
          color: 'rgba(0,229,255,0.8)',
          letterSpacing: '0.1em',
          textAlign: 'right',
          zIndex: 2,
        }}
      >
        CHARLOTTE
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 🎬 Main Composition
// ══════════════════════════════════════════════════════════════
export const StreamLayout: React.FC<{
  mainVideo?: string;
  mainAudio?: string;
  characterVideo?: string;
  subtitles?: SubLine[];
  chatMessages?: ChatMsg[];
}> = ({
  mainVideo = 'videos/Remotion_keyed.webm',
  mainAudio = 'videos/Remotion.mp4',
  characterVideo = 'videos/ch_keyed.webm',
  subtitles = DEFAULT_SUBS,
  chatMessages = DEFAULT_CHAT,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* メイン画面（映像のみ） */}
      <Video
        src={staticFile(mainVideo)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        volume={0}
      />

      {/* 音声（元MP4から取得） */}
      <Audio src={staticFile(mainAudio)} />

      {/* 配信UIヘッダー */}
      <StreamHeader />

      {/* チャットパネル */}
      <ChatPanel messages={chatMessages} />

      {/* Charlotte PiP（グリーンバック動画ループ） */}
      <CharacterPiP videoSrc={staticFile(characterVideo)} />

      {/* テロップ シーケンス */}
      {subtitles.map((sub, i) => {
        const from = f(sub.startSec);
        const duration = f(sub.endSec) - from;
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={duration}
            layout="none"
          >
            <TelopBar sub={sub} durationInFrames={duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

