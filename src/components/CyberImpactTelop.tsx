import React from 'react';
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    random,
} from 'remotion';

const GlitchChar: React.FC<{
    char: string;
    index: number;
    startFrame: number;
    color: string;
}> = ({ char, index, startFrame, color }) => {
    const frame = useCurrentFrame();
    const { fps: _fps } = useVideoConfig();

    const relativeFrame = frame - startFrame;
    const revealFrame = index * 0.5;

    if (relativeFrame < revealFrame) return null;

    // Pre-calculate jitter to avoid redundant random calls
    const jitterFactor = random(frame + index);
    const jitterX = (jitterFactor - 0.5) * 4;
    const jitterY = (random(frame + index + 1) - 0.5) * 4;

    return (
        <span style={{ position: 'relative', display: 'inline-block' }}>
            {/* 1. Underlying Light Green Layer (STABLE Base) */}
            <span
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 6,
                    color: '#00FF00',
                    opacity: 0.8,
                    zIndex: -2,
                    textShadow: '0 0 8px #00FF00',
                    transform: 'scale(1.01)',
                    filter: 'blur(0.5px)',
                    whiteSpace: 'pre',
                }}
            >
                {char}
            </span>

            {/* 2. RGB Split Layers (Simplified) */}
            <span
                style={{
                    position: 'absolute',
                    left: jitterX - 3,
                    top: jitterY,
                    color: '#FF003C',
                    opacity: 0.6,
                    zIndex: -1,
                    whiteSpace: 'pre',
                }}
            >
                {char}
            </span>
            <span
                style={{
                    position: 'absolute',
                    left: jitterX + 3,
                    top: jitterY,
                    color: '#00F3FF',
                    opacity: 0.6,
                    zIndex: -1,
                    whiteSpace: 'pre',
                }}
            >
                {char}
            </span>

            {/* 3. Main Layer */}
            <span
                style={{
                    position: 'relative',
                    left: jitterX,
                    top: jitterY,
                    color: color,
                    textShadow: '0 0 6px rgba(255, 255, 255, 0.7)',
                    whiteSpace: 'pre',
                    willChange: 'transform',
                }}
            >
                {char}
            </span>
        </span>
    );
};

export const CyberImpactTelop: React.FC<{
    text: string;
    isImportant?: boolean;
}> = ({ text, isImportant = false }) => {
    // const frame = useCurrentFrame();

    // Base color: Pure White, or Red/Blue for emphasis
    const mainColor = isImportant ? '#FF003C' : '#FFFFFF';

    return (
        <AbsoluteFill
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: '5%',
            }}
        >
            <div
                style={{
                    fontSize: isImportant ? '6rem' : '4.5rem',
                    fontWeight: 900,
                    fontFamily: '"Fira Code", monospace',
                    textAlign: 'center',
                    maxWidth: '90%',
                    lineHeight: 1.2,
                }}
            >
                {text.split('').map((char, i) => (
                    <GlitchChar
                        key={i}
                        char={char}
                        index={i}
                        startFrame={0}
                        color={mainColor}
                    />
                ))}
            </div>
        </AbsoluteFill>
    );
};
