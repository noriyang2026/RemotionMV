import { AbsoluteFill } from 'remotion';
import React from 'react';

export const Scanlines: React.FC = () => {
    return (
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 10 }}>
            <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
                backgroundSize: '100% 4px',
                opacity: 0.6
            }} />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)' // Vignette
            }} />
        </AbsoluteFill>
    );
};
