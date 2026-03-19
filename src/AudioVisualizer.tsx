import { Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import React from 'react';

const AUDIO_SRC = staticFile("/assets/蜘蛛ノ糸.wav");

export const AudioVisualizer: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const audioData = useAudioData(AUDIO_SRC);

    if (!audioData) {
        return null;
    }

    // Visualize frequency range (bass/low-mids for "vibration")
    const visualization = visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples: 16, // Low resolution for "blocky" or simple visualization
    });

    // Calculate volume intensity for vibration effect
    // We'll take the average of low frequencies
    const lowFreqs = visualization.slice(0, 4);
    const volume = lowFreqs.reduce((a, b) => a + b, 0) / lowFreqs.length;

    // Scale factor based on volume (0 to 1 typical range)
    // Amplify slightly for visible effect
    const scale = 1 + (volume * 0.2);
    const shake = (Math.random() - 0.5) * volume * 20; // Random shake based on volume

    return (
        <>
            <Audio src={AUDIO_SRC} />
            {/* Visualizer Ring / Effect */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${scale})`,
                width: 800,
                height: 800,
                borderRadius: '50%',
                border: '2px solid rgba(0, 255, 255, 0.3)',
                boxShadow: `0 0 ${volume * 50}px rgba(0, 255, 255, 0.5)`,
                opacity: 0.5,
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Center visual indicator */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${shake}px), calc(-50% + ${shake}px))`, // Shake effect
                width: 10,
                height: 10,
                backgroundColor: '#00ffff',
                borderRadius: '50%',
                boxShadow: `0 0 ${volume * 100}px #00ffff`,
                zIndex: 1
            }} />
        </>
    );
};
