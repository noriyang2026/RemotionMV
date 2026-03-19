import { AbsoluteFill, useCurrentFrame, interpolate, random } from 'remotion';
import React from 'react';

export const InkSplash: React.FC = () => {
    const frame = useCurrentFrame();

    // Create multiple splashes - Increased to 8 for more density
    const splashes = new Array(8).fill(0).map((_, i) => {
        const seed = i * 123.45;
        const delay = i * 15; // Staggered splashes

        // Random position (Safe Area 15% - 85%)
        const left = random(seed) * 70 + 15;
        const top = random(seed + 1) * 70 + 15;

        // Dynamic Scale with a slight "Impact" bounce
        const scale = interpolate(
            frame - delay,
            [0, 5, 20, 60],
            [0, 1.8, 1.5, 1.8],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        // Rotation for biological/organic variety
        const rotation = interpolate(
            frame - delay,
            [0, 60],
            [random(seed + 2) * 360, (random(seed + 2) * 360) + 45],
            { extrapolateLeft: 'clamp' }
        );

        const opacity = interpolate(
            frame - delay,
            [0, 10, 80, 110],
            [0, 0.9, 0.8, 0], // Fade in then slow fade out
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        // Jitter for the "Living Ink" look
        const jitterX = Math.sin(frame / 2 + seed) * 3;
        const jitterY = Math.cos(frame / 2 + seed) * 3;

        if (frame < delay) return null;

        return (
            <div key={i} style={{
                position: 'absolute',
                left: `${left}%`,
                top: `${top}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale}) translate(${jitterX}px, ${jitterY}px)`,
                opacity,
                filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.4))'
            }}>
                <svg width="600" height="600" viewBox="0 0 200 200">
                    <defs>
                        <filter id={`ink-spread-${i}`}>
                            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed={seed} result="noise" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale={interpolate(frame - delay, [0, 30], [20, 50], { extrapolateRight: 'clamp' })} />
                            <feGaussianBlur stdDeviation="1.5" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="1.5" />
                            </feComponentTransfer>
                        </filter>
                    </defs>
                    <g filter={`url(#ink-spread-${i})`}>
                        <circle
                            cx="100"
                            cy="100"
                            r={random(seed + 3) * 20 + 40}
                            fill={i % 2 === 0 ? "#000000" : "#1a0000"} // Slight dark red variation
                        />
                    </g>
                </svg>
            </div>
        );
    });

    return (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
            {splashes}
        </AbsoluteFill>
    );
};
