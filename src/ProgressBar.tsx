import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export const ProgressBar: React.FC<{ progress: number, label: string }> = ({ progress, label }) => {
    const frame = useCurrentFrame();

    // Animate width from 0 to progress
    const width = interpolate(frame, [10, 60], [0, progress], {
        extrapolateRight: 'clamp',
    });

    return (
        <div style={{
            position: 'absolute',
            bottom: 50,
            right: 50,
            width: 500,
            color: '#00ffff',
            fontFamily: '"Courier New", Courier, monospace',
            fontWeight: 'bold'
        }}>
            <div style={{ marginBottom: 10, fontSize: 30, textShadow: '0 0 5px #00ffff' }}>
                {label} &gt;&gt; {Math.round(width)}%
            </div>
            <div style={{
                width: '100%',
                height: 20,
                backgroundColor: 'rgba(0, 255, 255, 0.2)',
                border: '1px solid #00ffff'
            }}>
                <div style={{
                    width: `${width}%`,
                    height: '100%',
                    backgroundColor: '#00ffff',
                    boxShadow: '0 0 10px #00ffff'
                }} />
            </div>
        </div>
    );
};
