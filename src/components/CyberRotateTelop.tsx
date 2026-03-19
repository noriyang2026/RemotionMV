import React from 'react';
import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    spring,
    useVideoConfig,
} from 'remotion';

const CHAR_ROTATION_DURATION = 12;
const CHAR_STAGGER = 2;

const RotatingChar: React.FC<{
    char: string;
    index: number;
    startFrame: number;
}> = ({ char, index, startFrame }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const relativeFrame = frame - startFrame - index * CHAR_STAGGER;

    // 3D Flip Animation (RotateX: 90 -> 0)
    const rotateX = interpolate(
        relativeFrame,
        [0, CHAR_ROTATION_DURATION],
        [90, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Opacity & Scale
    const opacity = interpolate(
        relativeFrame,
        [0, CHAR_ROTATION_DURATION / 2],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const spr = spring({
        frame: relativeFrame,
        fps,
        config: { stiffness: 120, damping: 14 },
    });

    const scale = interpolate(spr, [0, 1], [0.8, 1]);

    return (
        <span
            style={{
                display: 'inline-block',
                transform: `perspective(500px) rotateX(${rotateX}deg) scale(${scale})`,
                opacity,
                color: '#00FFFF', // Cyber Blue
                textShadow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.4)',
                WebkitTextStroke: '1px #ffffff', // White stroke
                fontSize: '4.5rem',
                fontWeight: 900,
                fontFamily: '"Fira Code", "Source Code Pro", monospace',
                margin: '0 2px',
            }}
        >
            {char}
        </span>
    );
};

export const CyberRotateTelop: React.FC<{
    text: string;
    startFrame: number;
}> = ({ text, startFrame }) => {
    return (
        <AbsoluteFill
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: '15%', // Position at bottom half
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    padding: '2rem 4rem',
                    borderRadius: '1rem',
                    border: '2px solid rgba(0, 255, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}
            >
                {text.split('').map((char, i) => (
                    <RotatingChar
                        key={i}
                        char={char}
                        index={i}
                        startFrame={0} // Relative to Sequence
                    />
                ))}
            </div>
        </AbsoluteFill>
    );
};
