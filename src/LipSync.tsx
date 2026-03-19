import { AbsoluteFill, Video, staticFile, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import React from 'react';
import settings from './data/lipsync_settings.json';

const subtitles = settings.subtitles;

const SubtitleItem: React.FC<{ text: string, duration: number }> = ({ text, duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(
        frame,
        [0, 10, duration - 10, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const scale = spring({
        frame,
        fps,
        config: { damping: 12 },
    });

    return (
        <div style={{
            position: 'absolute',
            bottom: 150,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity,
            transform: `scale(${interpolate(scale, [0, 1], [0.95, 1])})`,
        }}>
            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '20px 60px',
                borderRadius: '10px',
                border: '2px solid #00f3ff',
                boxShadow: '0 0 20px rgba(0, 243, 255, 0.3)',
                backdropFilter: 'blur(10px)',
            }}>
                <span style={{
                    color: 'white',
                    fontSize: 48,
                    fontWeight: 'bold',
                    fontFamily: '"Kaisei Tokumin", serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    letterSpacing: '0.05em',
                }}>
                    {text}
                </span>
            </div>
        </div>
    );
};

export const LipSync: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <Video
                src={staticFile('videos/口パク動画.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {subtitles.map((s, i) => (
                <Sequence key={i} from={s.from} durationInFrames={s.to - s.from}>
                    <SubtitleItem text={s.text} duration={s.to - s.from} />
                </Sequence>
            ))}

            {/* Subtle Overlay Effects */}
            <AbsoluteFill style={{
                pointerEvents: 'none',
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
                background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.3) 100%)',
            }} />
        </AbsoluteFill>
    );
};
