import React from 'react';
import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  staticFile,
} from 'remotion';

// ── テキスト定義 ────────────────────────────────────────────
const MAIN_TEXT = '……これが私の『成果物』よ';
const SUB_TEXT  = '自律思考型AI VTuber 配信テスト成功。誰も見ていない場所への第一歩。';

// 『成果物』の範囲（シアングロー対象）
const HL_START = MAIN_TEXT.indexOf('『');
const HL_END   = MAIN_TEXT.indexOf('』') + 1; // exclusive

// ── タイムライン ────────────────────────────────────────────
const TW_START             = 90;  // メイン開始 (3秒後)
const FRAMES_PER_CHAR_MAIN = 5;   // メイン: 1文字あたり5フレーム
const TW_END               = TW_START + MAIN_TEXT.length * FRAMES_PER_CHAR_MAIN;

const SUB_START            = TW_END + 25; // サブ開始 (メイン完了後 0.8秒)
const FRAMES_PER_CHAR_SUB  = 7;           // サブ: 1文字あたり7フレーム（ゆっくり）

// ── Charlotte サイバーグローのCSS ──────────────────────────
const GLOW_CYAN = '0 0 8px #00e5ff, 0 0 20px rgba(0,229,255,0.6), 0 0 40px rgba(0,229,255,0.25)';

export const HaisinTelop: React.FC = () => {
  const frame = useCurrentFrame();

  // メイン タイプライター
  const mainChars = Math.min(
    Math.max(0, Math.floor((frame - TW_START) / FRAMES_PER_CHAR_MAIN)),
    MAIN_TEXT.length
  );

  // サブ タイプライター
  const subChars = Math.min(
    Math.max(0, Math.floor((frame - SUB_START) / FRAMES_PER_CHAR_SUB)),
    SUB_TEXT.length
  );

  return (
    <AbsoluteFill>
      {/* ── 背景動画 ─────────────────────────────────────── */}
      <Video src={staticFile('videos/haisin0311.mp4')} />

      {/* ── テロップ領域: 左下 ─────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          left: 60,
          maxWidth: 960,
          padding: '22px 40px 24px 28px',
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.40) 70%, rgba(0,0,0,0) 100%)',
          borderLeft: '3px solid rgba(0,229,255,0.55)',
        }}
      >
        {/* ── メインテロップ（タイプライター）──────── */}
        {mainChars > 0 && (
          <div
            style={{
              fontFamily: '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", Georgia, serif',
              fontSize: 50,
              fontWeight: 300,
              lineHeight: 1.45,
              letterSpacing: '0.05em',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {MAIN_TEXT.slice(0, mainChars).split('').map((char, i) => {
              const isHL = i >= HL_START && i < HL_END;
              return (
                <span
                  key={i}
                  style={{
                    color: isHL ? '#00e5ff' : '#ffffff',
                    textShadow: isHL ? GLOW_CYAN : '0 1px 6px rgba(0,0,0,0.9)',
                    display: 'inline-block',
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        )}

        {/* ── サブテロップ（タイプライター・大きめ）── */}
        {subChars > 0 && (
          <div
            style={{
              marginTop: 18,
              fontFamily: '"Noto Sans JP", "Hiragino Sans", "Meiryo", sans-serif',
              fontSize: 36,
              fontWeight: 400,
              color: 'rgba(210, 228, 235, 0.92)',
              letterSpacing: '0.06em',
              lineHeight: 1.6,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {SUB_TEXT.slice(0, subChars).split('').map((char, i) => (
              <span key={i} style={{ display: 'inline-block' }}>{char}</span>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
