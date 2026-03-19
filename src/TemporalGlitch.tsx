import React from 'react';
import { AbsoluteFill } from 'remotion';

export const TemporalGlitch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Probability of a glitch occurring in this frame
    const isGlitching = Math.random() > 0.85;

    if (!isGlitching) {
        return <AbsoluteFill>{children}</AbsoluteFill>;
    }

    // Generate random vertical slices and horizontal offsets
    const slices = 12;
    const glitchElements = Array.from({ length: slices }).map((_, i) => {
        const offset = (Math.random() - 0.5) * 80; // Shift pixels
        const rgbOffset = (Math.random() - 0.5) * 10; // Chromatic aberration
        const h = 100 / slices;
        const top = i * h;

        return (
            <div
                key={i}
                style={{
                    position: 'absolute',
                    top: `${top}%`,
                    left: 0,
                    width: '100%',
                    height: `${h}%`,
                    overflow: 'hidden',
                    transform: `translateX(${offset}px)`,
                    filter: `contrast(150%) brightness(120%)`,
                }}
            >
                {/* Red channel */}
                <div style={{
                    transform: `translateX(${-offset + rgbOffset}px) translateY(${-top}%)`,
                    width: '100%',
                    height: `${100 * slices}%`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    mixBlendMode: 'lighten',
                    filter: 'drop-shadow(0 0 0 red)'
                }}>
                    <div style={{ color: '#ff0000' }}>{children}</div>
                </div>
                {/* Blue channel */}
                <div style={{
                    transform: `translateX(${-offset - rgbOffset}px) translateY(${-top}%)`,
                    width: '100%',
                    height: `${100 * slices}%`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    mixBlendMode: 'lighten',
                    filter: 'drop-shadow(0 0 0 blue)'
                }}>
                    <div style={{ color: '#0000ff' }}>{children}</div>
                </div>
                {/* Main/Green channel */}
                <div style={{
                    transform: `translateX(${-offset}px) translateY(${-top}%)`,
                    width: '100%',
                    height: `${100 * slices}%`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    mixBlendMode: 'lighten'
                }}>
                    {children}
                </div>
            </div>
        );
    });

    return <AbsoluteFill>{glitchElements}</AbsoluteFill>;
};
