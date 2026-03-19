import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    Sequence,
} from 'remotion';
import React from 'react';

// ============================================================
// Subtitle Data Type
// ============================================================
export type SubtitleItem = {
    id: string;
    jpText: string;    // Japanese original (displayed above)
    enText: string;    // English subtitle (displayed below, larger)
    startFrame: number;
    durationInFrames: number;
};

interface SubtitleSequenceProps {
    data: SubtitleItem[];
}

// ============================================================
// Single Subtitle Bar Component
// ============================================================
const SubtitleBar: React.FC<{
    jpText: string;
    enText: string;
    durationInFrames: number;
}> = ({ jpText, enText, durationInFrames }) => {
    const frame = useCurrentFrame();
    const FADE_DURATION = 8; // frames for fade in/out

    const opacity = interpolate(
        frame,
        [0, FADE_DURATION, durationInFrames - FADE_DURATION, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const translateY = interpolate(
        frame,
        [0, FADE_DURATION],
        [10, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: '72px',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    opacity,
                    transform: `translateY(${translateY}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    maxWidth: '85%',
                    textAlign: 'center',
                }}
            >
                {/* Japanese text — smaller, secondary */}
                <span
                    style={{
                        fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic Pro", sans-serif',
                        fontSize: '28px',
                        fontWeight: 500,
                        color: '#e8e8e8',
                        textShadow: `
              -1px -1px 0 #000,
               1px -1px 0 #000,
              -1px  1px 0 #000,
               1px  1px 0 #000,
               0px  2px 4px rgba(0,0,0,0.8)
            `,
                        letterSpacing: '0.05em',
                        lineHeight: 1.4,
                    }}
                >
                    {jpText}
                </span>

                {/* English text — main subtitle */}
                <span
                    style={{
                        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                        fontSize: '38px',
                        fontWeight: 700,
                        color: '#ffffff',
                        textShadow: `
              -2px -2px 0 #000,
               2px -2px 0 #000,
              -2px  2px 0 #000,
               2px  2px 0 #000,
               0px  3px 8px rgba(0,0,0,0.9)
            `,
                        letterSpacing: '0.02em',
                        lineHeight: 1.3,
                    }}
                >
                    {enText}
                </span>
            </div>
        </AbsoluteFill>
    );
};

// ============================================================
// Subtitle Sequence — renders all subtitles as Sequences
// ============================================================
export const SubtitleSequence: React.FC<SubtitleSequenceProps> = ({ data }) => {
    return (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
            {data.map((item) => (
                <Sequence
                    key={item.id}
                    from={item.startFrame}
                    durationInFrames={item.durationInFrames}
                    layout="none"
                >
                    <SubtitleBar
                        jpText={item.jpText}
                        enText={item.enText}
                        durationInFrames={item.durationInFrames}
                    />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
