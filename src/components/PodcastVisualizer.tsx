import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import React from 'react';

interface PodcastVisualizerProps {
    audioSrc: string;
}

export const PodcastVisualizer: React.FC<PodcastVisualizerProps> = ({ audioSrc }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const audioData = useAudioData(audioSrc);

    if (!audioData) {
        return null;
    }

    const visualization = visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples: 128, // Higher detail
    });

    return (
        <AbsoluteFill style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', // Center vertically
            pointerEvents: 'none' 
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center', // Center bars vertically
                gap: '2px',
                height: '300px'
            }}>
                {visualization.map((v, i) => (
                    <div key={i} style={{
                        width: '4px',
                        height: `${Math.max(2, v * 500)}px`, // More intense scaling
                        backgroundColor: '#00ffff',
                        boxShadow: `0 0 ${v * 20}px #00ffff`,
                        borderRadius: '2px',
                        opacity: 0.7 + (v * 0.3)
                    }} />
                ))}
            </div>
        </AbsoluteFill>
    );
};
