import { AbsoluteFill, useCurrentFrame, random } from 'remotion';
import React from 'react';

export const BakumatsuEffects: React.FC = () => {
    const frame = useCurrentFrame();

    // 1. Flash Effect (Simulating sword clash or impact)
    // Trigger every ~100 frames or randomly
    const flashOpacity = Math.random() > 0.98 ? 0.8 : 0;

    // 2. Red Noise / Glitch
    // Overlay red distinct lines or blocks
    const noiseOpacity = random(frame) > 0.9 ? 0.3 : 0;
    const noiseY = random(frame + 1) * 100;

    // 3. "Isshen" (Slash) effect
    // A diagonal white line slashing through
    const isSlashFrame = frame % 150 < 5; // Every 150 frames

    return (
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 20 }}>
            {/* Flash */}
            {flashOpacity > 0 && <div style={{
                position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flashOpacity, mixBlendMode: 'overlay'
            }} />}

            {/* Red Noise */}
            {noiseOpacity > 0 && <div style={{
                position: 'absolute',
                top: `${noiseY}%`,
                left: 0,
                width: '100%',
                height: `${random(frame) * 50}px`,
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                mixBlendMode: 'color-burn',
                zIndex: 25
            }} />}

            {/* Slash */}
            {isSlashFrame && <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '150%',
                height: '2px',
                backgroundColor: '#fff',
                boxShadow: '0 0 10px #fff, 0 0 20px #f00',
                transform: `translate(-50%, -50%) rotate(${45 + random(frame) * 10}deg)`
            }} />}
        </AbsoluteFill>
    );
};
