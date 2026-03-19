import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import React from 'react';

const TEXT = "三千世界の烏を殺し";

export const Lyrics: React.FC = () => {
    const frame = useCurrentFrame();

    // Start animation immediately or after a slight delay
    // Let's assume start at frame 0 for now as per "music start"
    // Animate one character every 5 frames?

    return (
        <AbsoluteFill style={{
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20
        }}>
            <h1 style={{
                fontFamily: '"Zen Mincho", serif', // Assuming a serif font for this aesthetic, or define one
                fontWeight: 'bold',
                fontSize: 120,
                color: '#ff0055', // Pink/Red for contrast
                textShadow: '0 0 20px rgba(255, 0, 85, 0.8)',
                writingMode: 'vertical-rl', // Vertical text for Japanese aesthetic
                letterSpacing: '0.5em',
                height: '80%'
            }}>
                {TEXT.split('').map((char, i) => {
                    const opacity = interpolate(
                        frame,
                        [i * 10, (i * 10) + 10], // Slower reveal: 10 frames per char
                        [0, 1],
                        { extrapolateRight: 'clamp' }
                    );

                    const translateY = interpolate(
                        frame,
                        [i * 10, (i * 10) + 10],
                        [20, 0],
                        { extrapolateRight: 'clamp' }
                    );

                    return (
                        <span key={i} style={{
                            opacity,
                            display: 'inline-block',
                            transform: `translateY(${translateY}px)`
                        }}>
                            {char}
                        </span>
                    );
                })}
            </h1>
        </AbsoluteFill>
    );
};
