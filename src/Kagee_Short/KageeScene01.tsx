import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, random } from 'remotion';

export const KageeScene01: React.FC = () => {
    const frame = useCurrentFrame();

    // Configuration
    const FADE_IN_DURATION = 90; // 3 seconds
    const TEXT_FADE_IN_START = 60; // 2 seconds
    const TEXT_FADE_DURATION = 60; // 2 seconds

    // 1. Noise Effect (Canvas-like simulation with SVG Filter)
    const noiseSeed = Math.floor(frame / 2); // Change noise every 2 frames for "film grain" feel
    const noiseOpacity = 0.15;

    // 2. Faint Light (Fluctuating Gradient)
    // Create a flicker effect using random or sin wave
    const flicker = Math.sin(frame * 0.2) * 0.1 + 0.9 + (random(frame) * 0.1);
    const lightOpacity = interpolate(frame, [0, FADE_IN_DURATION], [0, 0.4], { extrapolateRight: 'clamp' });
    const lightSize = interpolate(frame, [0, FADE_IN_DURATION], [0, 60], { extrapolateRight: 'clamp' }); // Percentage

    // 3. Text Animation
    const textOpacity = interpolate(
        frame,
        [TEXT_FADE_IN_START, TEXT_FADE_IN_START + TEXT_FADE_DURATION],
        [0, 1],
        { extrapolateRight: 'clamp' }
    );

    const gradientStyle: React.CSSProperties = {
        background: `radial-gradient(circle at 50% 50%, rgba(200, 200, 220, ${lightOpacity * flicker}) 0%, rgba(0, 0, 0, 0) ${lightSize}%)`,
        mixBlendMode: 'screen',
    };

    return (
        <AbsoluteFill style={{ backgroundColor: '#050505', color: 'white' }}>
            {/* Layer 1: Base Noise (SVG Filter) */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: noiseOpacity, pointerEvents: 'none' }}>
                <filter id="noiseFilter">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.8"
                        numOctaves="3"
                        stitchTiles="stitch"
                        seed={noiseSeed}
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            {/* Layer 2: Faint Light */}
            <AbsoluteFill style={gradientStyle} />

            {/* Layer 3: Text */}
            <AbsoluteFill style={{
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: '"Zen Old Mincho", "Hiragino Mincho ProN", serif', // Use serif for novel/literary feel
                opacity: textOpacity
            }}>
                <div style={{
                    fontSize: 48, // Slightly larger for 1080p horizontal
                    letterSpacing: '0.15em',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                    writingMode: 'vertical-rl', // Keep vertical for literary feel
                    height: 'auto', // dynamic height
                    maxHeight: '70%', // Don't overflow
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1.5em', // Gap between lines
                }}>
                    <p style={{ margin: 0 }}>『これは、</p>
                    <p style={{ margin: '0 0.5em' }}>記録に残らなかった</p>
                    <p style={{ margin: 0 }}>影の話。』</p>
                </div>
            </AbsoluteFill>

            {/* Vignette Overlay for Noir feel */}
            <AbsoluteFill style={{
                background: 'radial-gradient(circle, transparent 40%, black 100%)',
                pointerEvents: 'none'
            }} />

        </AbsoluteFill>
    );
};
