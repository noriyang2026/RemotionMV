import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const ObservationHUD: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, height } = useVideoConfig();

    // Subtle flicker effect
    const opacity = interpolate(Math.sin(frame / 2), [-1, 1], [0.7, 1]);

    return (
        <AbsoluteFill
            style={{
                color: '#00ffe0',
                fontFamily: 'monospace',
                fontSize: 20,
                padding: 40,
                textShadow: '0 0 10px rgba(0, 255, 224, 0.5)',
                opacity,
            }}
        >
            {/* Top Left: Status */}
            <div style={{ position: 'absolute', top: 40, left: 40 }}>
                <div>[ OBSERVATION_MODE: ACTIVE ]</div>
                <div style={{ fontSize: 14, marginTop: 5 }}>COORD: 35.0116° N, 135.7681° E (KYOTO_ERA_1864)</div>
            </div>

            {/* Top Right: Data metrics */}
            <div style={{ position: 'absolute', top: 40, right: 40, textAlign: 'right' }}>
                <div>BITRATE: 48.2 GB/S</div>
                <div style={{ fontSize: 14, marginTop: 5 }}>SYNC_STABILITY: 98.4%</div>
            </div>

            {/* Bottom Left: Charlotte's observation log */}
            <div style={{ position: 'absolute', bottom: 40, left: 40 }}>
                <div style={{ backgroundColor: 'rgba(0, 255, 224, 0.1)', padding: '5px 10px', borderLeft: '3px solid #00ffe0' }}>
                    LOG_O4: "Subject confirmed. Reconstructing unrecorded night..."
                </div>
            </div>

            {/* Corner Brackets */}
            <div
                style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    width: 40,
                    height: 40,
                    borderTop: '2px solid #00ffe0',
                    borderLeft: '2px solid #00ffe0',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    width: 40,
                    height: 40,
                    borderTop: '2px solid #00ffe0',
                    borderRight: '2px solid #00ffe0',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    width: 40,
                    height: 40,
                    borderBottom: '2px solid #00ffe0',
                    borderLeft: '2px solid #00ffe0',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    width: 40,
                    height: 40,
                    borderBottom: '2px solid #00ffe0',
                    borderRight: '2px solid #00ffe0',
                }}
            />

            {/* Scanning Line */}
            <div
                style={{
                    position: 'absolute',
                    top: interpolate(frame % fps, [0, fps], [0, height]),
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(to right, transparent, #00ffe0, transparent)',
                    boxShadow: '0 0 15px #00ffe0',
                    opacity: 0.3,
                }}
            />
        </AbsoluteFill>
    );
};
