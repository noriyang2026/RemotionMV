import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, random } from 'remotion';

const ROWS = 25; // Reduced from 40 to decrease rendering load
const HEX_CHARS = '0123456789ABCDEF';
const LOG_MESSAGES = [
    'AUTH_BYPASS::SUCCESS',
    'KERNEL_DUMP::PROCEEDING',
    'SYS_CALL::ERR_X042',
    'MEMORY_LEAK::DETECTED',
    'SOCKET_OPEN::PORT_8080',
    'TRACE_ROUTE::TARGET_HIDDEN',
    'OVERRIDE::ACTIVE',
    'DECRYPT_PHASE::78%',
    'SYNC_RATE::CRITICAL',
    'BUFFER_OVERFLOW::INIT',
];

const LogLine: React.FC<{
    y: number;
    seed: number;
    speed: number;
}> = ({ y, seed, speed }) => {
    const frame = useCurrentFrame();
    const offset = (frame * speed + seed * 1000) % 2000;

    // Pre-calculate content to avoid per-frame overhead
    const content = useMemo(() => {
        let str = '';
        for (let i = 0; i < 15; i++) {
            if (random(seed + i) > 0.8) {
                str += ` [${LOG_MESSAGES[Math.floor(random(seed + i + 1) * LOG_MESSAGES.length)]}] `;
            } else {
                str += HEX_CHARS[Math.floor(random(seed + i + 2) * 16)];
                str += HEX_CHARS[Math.floor(random(seed + i + 3) * 16)];
                str += ' ';
            }
        }
        return str;
    }, [seed]);

    return (
        <div
            style={{
                position: 'absolute',
                top: y,
                left: -offset,
                whiteSpace: 'nowrap',
                fontFamily: 'monospace',
                fontSize: '10px',
                color: 'rgba(0, 243, 255, 0.04)', // Slightly lower opacity
                letterSpacing: '2px',
                pointerEvents: 'none',
                willChange: 'transform', // Opt-in for GPU acceleration if available
            }}
        >
            {content} {content} {content}
        </div>
    );
};

export const InformationViolence: React.FC = () => {
    return (
        <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'transparent' }}>
            {Array.from({ length: ROWS }).map((_, i) => (
                <LogLine
                    key={i}
                    y={(i * (1080 / ROWS))}
                    seed={i}
                    speed={2 + random(i) * 5}
                />
            ))}
        </AbsoluteFill>
    );
};
