import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface SyncItem {
    id: number;
    text: string;
    start: number;
    end: number;
}

export const SimpleCyberTelop: React.FC<{ data: SyncItem[] }> = ({ data }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTime = frame / fps;

    const currentPhrase = (data || []).find(item => currentTime >= item.start && currentTime <= item.end);

    if (!currentPhrase) return null;

    const relativeFrame = frame - (currentPhrase.start * fps);

    // Typing speed: 1.5 frames per character
    const charsToShow = Math.floor(relativeFrame / 1.5);
    const slicedText = currentPhrase.text.slice(0, charsToShow);
    const isDone = charsToShow >= currentPhrase.text.length;

    // Fade in/out
    const opacity = interpolate(
        currentTime,
        [currentPhrase.start, currentPhrase.start + 0.2, currentPhrase.end - 0.2, currentPhrase.end],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: '10%',
            pointerEvents: 'none',
        }}>
            <div style={{
                opacity,
                color: '#00FFFF', // Cyber Blue
                fontFamily: '"Fira Code", "Source Code Pro", "Courier New", monospace',
                fontWeight: 500,
                fontSize: 52,
                textAlign: 'center',
                textShadow: '0 0 12px rgba(0, 255, 255, 0.8), 0 0 25px rgba(0, 255, 255, 0.4)',
                backgroundColor: 'rgba(0,0,0,0.85)',
                padding: '12px 30px',
                border: '1px solid rgba(0, 255, 255, 0.4)',
                display: 'inline-block',
                maxWidth: '85%',
                letterSpacing: '0.05em',
            }}>
                <span>{slicedText}</span>
                <span style={{
                    opacity: isDone ? (Math.floor(frame / 15) % 2 === 0 ? 1 : 0) : 1,
                    marginLeft: 8,
                    display: 'inline-block',
                    width: 18,
                    height: '0.85em',
                    backgroundColor: '#00FFFF',
                    verticalAlign: 'baseline',
                    boxShadow: '0 0 10px #00FFFF',
                }} />
            </div>
        </AbsoluteFill>
    );
};
