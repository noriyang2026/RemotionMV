import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

const HUD_COLOR = '#00F3FF'; // Neon Blue
const REC_COLOR = '#FF003C'; // Cyber Red

export const RecordingUI: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const timeCode = () => {
        const totalSeconds = Math.floor(frame / fps);
        const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        const ms = Math.floor((frame % fps) / fps * 100).toString().padStart(2, '0');
        return `${mins}:${secs}:${ms}`;
    };

    return (
        <AbsoluteFill style={{ color: HUD_COLOR, padding: '40px', fontFamily: '"Fira Code", monospace', pointerEvents: 'none' }}>
            {/* Top Left: LIVE + REC dot */}
            <div style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: REC_COLOR, borderRadius: '50%', opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.3 }} />
                <div style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '4px' }}>LIVE</div>
            </div>

            {/* Top Right: SYNC / CAMERA Info */}
            <div style={{ position: 'absolute', top: '40px', right: '40px', textAlign: 'right' }}>
                <div style={{ fontSize: '18px', opacity: 0.8 }}>SYNC: 98.4%</div>
                <div style={{ fontSize: '18px', opacity: 0.8 }}>CAM_01 // WIDE</div>
            </div>

            {/* Bottom Left: Timecode */}
            <div style={{ position: 'absolute', bottom: '40px', left: '40px' }}>
                <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '5px' }}>TC</div>
                <div style={{ fontSize: '32px' }}>{timeCode()}</div>
            </div>

            {/* Bottom Right: Frame Count */}
            <div style={{ position: 'absolute', bottom: '40px', right: '40px', textAlign: 'right' }}>
                <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '5px' }}>FRAME</div>
                <div style={{ fontSize: '32px' }}>{frame.toString().padStart(6, '0')}</div>
            </div>

            {/* Corner Brackets */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', width: '40px', height: '40px', borderLeft: `2px solid ${HUD_COLOR}`, borderTop: `2px solid ${HUD_COLOR}` }} />
            <div style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRight: `2px solid ${HUD_COLOR}`, borderTop: `2px solid ${HUD_COLOR}` }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '40px', height: '40px', borderLeft: `2px solid ${HUD_COLOR}`, borderBottom: `2px solid ${HUD_COLOR}` }} />
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '40px', height: '40px', borderRight: `2px solid ${HUD_COLOR}`, borderBottom: `2px solid ${HUD_COLOR}` }} />
        </AbsoluteFill>
    );
};
