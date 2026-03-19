/**
 * DennouOverrideShort.tsx
 * YouTube Shorts 縦長版 (1080 × 1920 / 9:16)
 *
 * レイアウト:
 *   ┌────────────────────┐ ← 1080px wide
 *   │  ▲  TOP CARD       │ 656px
 *   │  ▼                 │
 *   ├────────────────────┤
 *   │  横動画（センター）  │ 608px  (= 1080 × 9/16)
 *   ├────────────────────┤
 *   │  ▲  BOTTOM CARD    │ 656px
 *   │  ▼                 │
 *   └────────────────────┘
 */

import React from 'react';
import {
    AbsoluteFill,
    Video,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    staticFile,
} from 'remotion';

// ──────────────────────────────────────────────
// 定数
// ──────────────────────────────────────────────
const CANVAS_W = 1080;
const CANVAS_H = 1920;

// 横動画を1080px幅に収めたときの高さ
const VIDEO_W = 1080;
const VIDEO_H = Math.round(1080 * (9 / 16)); // 607.5 → 608px

const VIDEO_TOP = Math.round((CANVAS_H - VIDEO_H) / 2); // 約656px
const VIDEO_SRC = staticFile('dennou_override_v2_cyber.mp4');

// ──────────────────────────────────────────────
// TOP エリア: デビュー告知
// ──────────────────────────────────────────────
const TopCard: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const sc = spring({ frame, fps, config: { stiffness: 180, damping: 22 }, durationInFrames: 20 });
    const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
    const scanY = (frame * 1.5) % 100;

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: CANVAS_W,
            height: VIDEO_TOP,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            opacity,
            overflow: 'hidden',
        }}>
            {/* 動くスキャンライン（アクセント） */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: `linear-gradient(180deg, transparent ${scanY - 1}%, rgba(0,255,200,0.04) ${scanY}%, transparent ${scanY + 1}%)`,
            }} />

            {/* SYSTEM ラベル */}
            <div style={{
                fontFamily: '"Courier New", monospace',
                fontSize: 20,
                color: 'rgba(0,255,180,0.8)',
                letterSpacing: '0.25em',
                textShadow: '0 0 8px rgba(0,255,180,0.5)',
            }}>▶ CAMELOT :: PRESENTS</div>

            {/* キャラ名 */}
            <div style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: 88,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.08em',
                textAlign: 'center',
                textShadow: [
                    '0 0 30px rgba(0,200,255,0.9)',
                    '0 0 80px rgba(0,100,255,0.5)',
                    '3px 3px 0 rgba(0,0,0,0.8)',
                ].join(', '),
                transform: `scale(${0.85 + 0.15 * sc})`,
            }}>
                シャルロット
            </div>

            {/* サブタイトル */}
            <div style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: 36,
                fontWeight: 700,
                color: '#00eeff',
                letterSpacing: '0.12em',
                textShadow: '0 0 12px rgba(0,200,255,0.7)',
            }}>AI VTuber — デビュー予定</div>

            {/* 区切りライン */}
            <div style={{
                width: 720,
                height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.8), transparent)',
                marginTop: 8,
                boxShadow: '0 0 12px rgba(0,200,255,0.4)',
            }} />

            {/* 一言コメント */}
            <div style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: 30,
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.06em',
                textAlign: 'center',
                maxWidth: 860,
            }}>
                AI VTuberとして近日デビュー予定！
            </div>
            <div style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: 28,
                color: 'rgba(200,220,255,0.7)',
                letterSpacing: '0.04em',
            }}>
                チャンネル登録、よろしくお願いします🙏
            </div>
        </div>
    );
};

// ──────────────────────────────────────────────
// BOTTOM エリア: 楽曲情報＋ハッシュタグ
// ──────────────────────────────────────────────
const BottomCard: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div style={{
            position: 'absolute',
            top: VIDEO_TOP + VIDEO_H, left: 0,
            width: CANVAS_W,
            height: VIDEO_TOP,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            opacity,
        }}>
            {/* 上区切りライン */}
            <div style={{
                width: 720, height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.8), transparent)',
                boxShadow: '0 0 12px rgba(0,200,255,0.4)',
                marginBottom: 8,
            }} />

            {/* 楽曲タイトル */}
            <div style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: 52,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.1em',
                textShadow: '0 0 20px rgba(0,200,255,0.8), 2px 2px 0 rgba(0,0,0,0.8)',
            }}>電脳オーバーライド！</div>

            <div style={{
                fontFamily: '"Courier New", monospace',
                fontSize: 22,
                color: 'rgba(0,255,180,0.7)',
                letterSpacing: '0.2em',
            }}>by Charlotte × WATSON System</div>

            {/* ハッシュタグ */}
            <div style={{
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: 26,
                color: 'rgba(100,200,255,0.8)',
                letterSpacing: '0.05em',
                textAlign: 'center',
                maxWidth: 900,
                lineHeight: 1.8,
            }}>
                {'#AIVTuber #シャルロット #Charlotte\n#電脳オーバーライド #VTuberデビュー #AI音楽'}
            </div>
        </div>
    );
};

// ──────────────────────────────────────────────
// メインコンポジション
// ──────────────────────────────────────────────
export const DennouOverrideShort: React.FC = () => (
    <AbsoluteFill style={{
        backgroundColor: '#000005',
        width: CANVAS_W,
        height: CANVAS_H,
    }}>
        {/* グローバルスキャンライン（薄め） */}
        <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `repeating-linear-gradient(0deg,
                rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px,
                transparent 1px, transparent 3px)`,
            zIndex: 10,
        }} />

        {/* センター動画 */}
        <div style={{
            position: 'absolute',
            top: VIDEO_TOP,
            left: 0,
            width: VIDEO_W,
            height: VIDEO_H,
        }}>
            <Video
                src={VIDEO_SRC}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>

        {/* 動画上下の境界グロー */}
        <div style={{
            position: 'absolute', top: VIDEO_TOP - 4,
            left: 0, right: 0, height: 4,
            background: 'rgba(0,200,255,0.5)',
            boxShadow: '0 0 20px rgba(0,200,255,0.5)',
            zIndex: 5,
        }} />
        <div style={{
            position: 'absolute', top: VIDEO_TOP + VIDEO_H,
            left: 0, right: 0, height: 4,
            background: 'rgba(0,200,255,0.5)',
            boxShadow: '0 0 20px rgba(0,200,255,0.5)',
            zIndex: 5,
        }} />

        {/* TOP / BOTTOM カード */}
        <TopCard />
        <BottomCard />
    </AbsoluteFill>
);
