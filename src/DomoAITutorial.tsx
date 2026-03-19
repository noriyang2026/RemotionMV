import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    Sequence,
    Video,
    staticFile,
} from 'remotion';
import React from 'react';

// ============================================================
// VTuber Typelog Data Type
// ============================================================
type TypelogEntry = {
    startFrame: number;
    endFrame: number;
    text: string;
};

// ============================================================
// Cyber Typing Text — per-character glow effect
// ============================================================
const CyberTypingText: React.FC<{ text: string }> = ({ text }) => {
    const frame = useCurrentFrame();

    const framesPerChar = 3;
    const charsToShow = Math.floor(frame / framesPerChar);

    return (
        <div
            style={{
                fontSize: '48px',
                fontWeight: 'bold',
                fontFamily: '"Noto Sans JP", monospace',
                textAlign: 'center',
                width: '100%',
                maxWidth: '90%',
                margin: '0 auto',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
                letterSpacing: '0.04em',
            }}
        >
            {text.split('').map((char, index) => {
                if (index >= charsToShow) return null;

                const isJustTyped = index === charsToShow - 1;

                return (
                    <span
                        key={index}
                        style={{
                            color: isJustTyped ? '#00ffff' : '#ffffff',
                            textShadow: isJustTyped
                                ? '0 0 20px #00ffff, 0 0 40px #00ffff'
                                : '0 0 10px rgba(0, 255, 255, 0.4)',
                        }}
                    >
                        {char}
                    </span>
                );
            })}
        </div>
    );
};

// ============================================================
// Single Typelog Line — wrapper with fade & background bar
// ============================================================
const TypelogLine: React.FC<{
    text: string;
    durationInFrames: number;
}> = ({ text, durationInFrames }) => {
    const frame = useCurrentFrame();
    const FADE_IN = 6;
    const FADE_OUT = 8;

    const opacity = interpolate(
        frame,
        [0, FADE_IN, durationInFrames - FADE_OUT, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const translateY = interpolate(
        frame,
        [0, FADE_IN],
        [14, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: '80px',
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    opacity,
                    transform: `translateY(${translateY}px)`,
                    maxWidth: '82%',
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(6px)',
                        borderRadius: '12px',
                        padding: '18px 40px',
                        border: '1px solid rgba(0, 255, 255, 0.15)',
                        boxShadow:
                            '0 0 24px rgba(0, 255, 255, 0.08), 0 4px 16px rgba(0,0,0,0.5)',
                    }}
                >
                    <CyberTypingText text={text} />
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// Cyberpunk CRT Effect — scanlines + vignette
// ============================================================
const CyberpunkCRTEffect: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {children}

            {/* CRT scanlines */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                backgroundSize: '100% 4px',
                pointerEvents: 'none',
                zIndex: 9998,
            }} />

            {/* Vignette + cyan edge glow */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,20,30,0.6) 100%)',
                boxShadow: 'inset 0 0 100px rgba(0, 255, 255, 0.1)',
                pointerEvents: 'none',
                zIndex: 9999,
            }} />
        </div>
    );
};

// ============================================================
// DomoAITutorial Composition — Video + CRT + Typelog
// ============================================================
export const DomoAITutorial: React.FC = () => {
    const subtitles: TypelogEntry[] = require('./data/domoai_tutorial_subtitles.json');

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <CyberpunkCRTEffect>
                {/* Video */}
                <Video
                    src={staticFile('videos/video_1773041550197_5507_.mp4')}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Typelog overlay */}
                {subtitles.map((entry, i) => {
                    const duration = entry.endFrame - entry.startFrame;
                    return (
                        <Sequence
                            key={`sub-${i}`}
                            from={entry.startFrame}
                            durationInFrames={duration}
                            layout="none"
                        >
                            <TypelogLine text={entry.text} durationInFrames={duration} />
                        </Sequence>
                    );
                })}
            </CyberpunkCRTEffect>
        </AbsoluteFill>
    );
};
