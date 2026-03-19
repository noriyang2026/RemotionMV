import { AbsoluteFill, staticFile, useCurrentFrame, interpolate, random } from 'remotion';
import React from 'react';
import { InkSplash } from './InkSplash';
import { BakumatsuEffects } from './BakumatsuEffects';
import { FeatherParticles } from './FeatherParticles';
import { LyricsSequence } from './LyricsSequence';

export const MainMV: React.FC = () => {
    const frame = useCurrentFrame();

    // ─── Camera Motion ──────────────────────────────────
    // Subtle Slow Zoom
    const cameraScale = interpolate(frame, [0, 9000], [1, 1.15]);

    // Impact Shake (Synchronized with Intro Attack at frame 345)
    const isImpact = frame >= 345 && frame < 360;
    const impactShake = isImpact ? (random(frame) - 0.5) * 30 : 0;

    // Persistent Breath Shake
    const idleShakeX = Math.sin(frame / 20) * 2;
    const idleShakeY = Math.cos(frame / 25) * 2;

    return (
        <AbsoluteFill style={{ backgroundColor: '#00FF00', overflow: 'hidden' }}>
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%)',
                zIndex: 50,
                pointerEvents: 'none'
            }} />

            <div style={{
                width: '100%',
                height: '100%',
                transform: `scale(${cameraScale}) translate(${idleShakeX + impactShake}px, ${idleShakeY + impactShake}px)`,
            }}>
                {/* 1. Background Depth / Splashes */}
                <InkSplash />

                {/* 2. Bakumatsu Effects (Glitches/Noise) */}
                <BakumatsuEffects />

                {/* 3. Feathers (Foreground/Midground) */}
                <FeatherParticles />

                {/* 4. Lyrics Sequence (Top Layer) */}
                <LyricsSequence />
            </div>
        </AbsoluteFill>
    );
};
