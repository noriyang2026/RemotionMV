import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, spring, useVideoConfig } from 'remotion';
import React from 'react';

// Define the Lyrics Data Structure
export type LyricItem = {
    text: string[]; // Array of strings for multi-line support
    startFrame: number;
    durationInFrames: number;
    emphasisDelay?: number; // Optional delay for "Attack" effect (relative to startFrame)
};

interface Props {
    data: LyricItem[];
}

// Extreme POP (Sticker Style) Layout Component
const PopHorizontalLyrics: React.FC<{ text: string[], duration: number }> = ({ text, duration }) => {
    const { width } = useVideoConfig();
    const is720p = width <= 1280;

    return (
        <AbsoluteFill style={{
            zIndex: 1000,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: is720p ? '80px' : '160px',
        }}>
            {text.map((line, i) => (
                <div key={i} style={{
                    margin: is720p ? '8px 0' : '15px 0',
                    maxWidth: '90%',
                    textAlign: 'center'
                }}>
                    <StyledExtremePopText text={line} duration={duration} />
                </div>
            ))}
        </AbsoluteFill>
    );
};

// Character Component for Randomized Tilt and Spring Animation
const PopChar: React.FC<{ char: string, delay: number, duration: number, index: number }> = ({ char, delay, duration, index }) => {
    const frame = useCurrentFrame();
    const { width } = useVideoConfig();
    const is720p = width <= 1280;

    // Responsive sizing
    const fontSize = is720p ? 54 : 85;
    const strokeWidth = is720p ? 8 : 12;
    const charMargin = is720p ? 4 : 8;

    // Spring-based "Pop" animation
    const spr = spring({
        frame: frame - delay,
        fps: 30,
        config: {
            damping: 10,
            stiffness: 100,
            mass: 0.5,
        },
    });

    // Random tilt based on index to create "Sticker" feel
    const tilt = (Math.sin(index * 123) * 15).toFixed(1);

    // Fade out
    const fadeOut = interpolate(frame, [duration - 10, duration], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <span style={{
            display: 'inline-block',
            fontFamily: '"Kaisei Tokumin", "Arial Black", sans-serif',
            fontSize: `${fontSize}px`,
            fontWeight: 900,
            color: '#fff',
            transform: `scale(${spr}) rotate(${tilt}deg)`,
            opacity: fadeOut,
            margin: `0 ${charMargin}px`,
            // STICKER STYLE: Thick Multi-layered Stroke
            filter: `
                drop-shadow(2px 2px 0px #000)
                drop-shadow(-2px -2px 0px #000)
                drop-shadow(5px 5px 0px rgba(0,0,0,0.5))
            `,
            WebkitTextStroke: `${strokeWidth}px #fff`, // Thick White border
            position: 'relative'
        }}>
            {/* Inner Content to keep text color visible over thick stroke */}
            <span style={{
                position: 'absolute',
                inset: 0,
                WebkitTextStroke: '0px',
                color: 'transparent',
                backgroundImage: 'linear-gradient(to bottom, #00EAFF 0%, #00bcff 50%, #007BFF 100%)', // Light Blue (Cyan to Azure) Gradient
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                zIndex: 2
            }}>
                {char}
            </span>
            {char}
        </span>
    );
};

const StyledExtremePopText: React.FC<{ text: string, duration: number }> = ({ text, duration }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap' // Allow wrapping for extremely long lines
        }}>
            {text.split('').map((char, i) => (
                <PopChar key={i} char={char} delay={i * 2} duration={duration} index={i} />
            ))}
        </div>
    );
};

export const LyricsSequence: React.FC<Props> = ({ data }) => {
    return (
        <AbsoluteFill>
            {data.map((lyric, index) => (
                <Sequence key={index} from={lyric.startFrame} durationInFrames={lyric.durationInFrames}>
                    <PopHorizontalLyrics text={lyric.text} duration={lyric.durationInFrames} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
