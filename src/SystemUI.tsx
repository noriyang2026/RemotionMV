import { useCurrentFrame, interpolate } from 'remotion';
import React from 'react';

export const SystemUI: React.FC<{
    location: string;
    era: string;
}> = ({ location, era }) => {
    const frame = useCurrentFrame();

    // Typing effect opacity control
    const opacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const textStyle: React.CSSProperties = {
        color: '#00ffff',
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: 70, // Increased from 40 (approx 1.75x)
        fontWeight: 'bold',
        textShadow: '4px 4px 8px rgba(0, 0, 0, 0.8), 0 0 15px #00ffff', // Drop shadow + Glow
        opacity,
        position: 'absolute',
        top: 100, // Adjusted top margin
        left: 100, // Adjusted left margin
        textAlign: 'left',
        lineHeight: 1.8, // Increased line height
    };

    return (
        <div style={textStyle}>
            <div style={{ padding: '10px 20px', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '10px', backdropFilter: 'blur(5px)' }}>
                <div><span style={{ fontSize: '1.2em' }}>[LOCATION: {location}]</span></div>
                <div><span style={{ fontSize: '1.0em' }}>[ERA: {era}]</span></div>
            </div>
        </div>
    );
};
