/**
 * CRTOverlay.tsx
 * 画面全体に乗せるCRT走査線＋色収差エフェクト
 * AbsoluteFillで重ねるだけで使える
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface CRTOverlayProps {
    /** 0-1: 色収差の強さ（0=なし、1=最大） */
    aberrationIntensity?: number;
    /** 走査線の透明度 */
    scanlineOpacity?: number;
}

export const CRTOverlay: React.FC<CRTOverlayProps> = ({
    aberrationIntensity = 0.5,
    scanlineOpacity = 0.08,
}) => {
    const frame = useCurrentFrame();

    // 走査線Y位置（フレームごとにスクロール）
    const scanY = (frame * 2) % 100;

    // 色収差：フレームに応じてランダム揺れ
    // Remotionでは Math.random は使えないので sin/cos で擬似ランダム
    const noise = Math.sin(frame * 0.37) * Math.cos(frame * 0.19);
    const rgbShiftX = aberrationIntensity * (2 + noise * 3);
    const rgbShiftY = aberrationIntensity * noise * 1.5;

    return (
        <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>

            {/* ── 走査線（横縞） ── */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `repeating-linear-gradient(
                    0deg,
                    rgba(0, 0, 0, ${scanlineOpacity}) 0px,
                    rgba(0, 0, 0, ${scanlineOpacity}) 1px,
                    transparent 1px,
                    transparent 3px
                )`,
            }} />

            {/* ── 動くスキャン光 ── */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(180deg,
                    transparent ${scanY - 1}%,
                    rgba(100, 255, 220, 0.04) ${scanY}%,
                    transparent ${scanY + 1}%
                )`,
            }} />

            {/* ── 色収差：赤チャンネル（左ズレ） ── */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at center,
                    transparent 60%,
                    rgba(255, 0, 50, 0.12) 100%
                )`,
                transform: `translate(${-rgbShiftX}px, ${-rgbShiftY}px)`,
                mixBlendMode: 'screen',
            }} />

            {/* ── 色収差：青チャンネル（右ズレ） ── */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at center,
                    transparent 60%,
                    rgba(0, 80, 255, 0.12) 100%
                )`,
                transform: `translate(${rgbShiftX}px, ${rgbShiftY}px)`,
                mixBlendMode: 'screen',
            }} />

            {/* ── 画面端ビネット ── */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at center,
                    transparent 55%,
                    rgba(0, 0, 10, 0.6) 100%
                )`,
            }} />

        </AbsoluteFill>
    );
};
