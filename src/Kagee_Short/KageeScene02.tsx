import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Video, staticFile, random } from 'remotion';

export const KageeScene02: React.FC = () => {
    const frame = useCurrentFrame();

    // Configuration
    const LIGHT_FLICKER_SPEED = 0.5;
    const flicker = Math.sin(frame * LIGHT_FLICKER_SPEED) * 0.05 + 0.15 + (random(frame) * 0.02);
    const textOpacity = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>
            {/* Background Light */}
            <AbsoluteFill style={{
                background: `radial-gradient(circle at 50% 60%, rgba(200, 200, 220, ${flicker}) 0%, rgba(0, 0, 0, 0) 70%)`
            }} />

            {/* Silhouette - Video Version */}
            <AbsoluteFill style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Video
                    src={staticFile("assets/cut02.mp4")}
                    muted
                    loop
                    // @ts-ignore
                    playsInline // Ensure mobile playback
                    onError={(e) => console.error("Video load error:", e)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover', // Fill the screen
                        // filter: 'brightness(0)', 
                    }}
                />
            </AbsoluteFill>

            {/* Text Overlay */}
            <AbsoluteFill style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end', // Align text to the left side (in vertical-rl) to avoid face on right
                paddingRight: '10%', // Add spacing from the character/center
                fontFamily: '"Zen Old Mincho", "Hiragino Mincho ProN", serif',
                color: 'white',
                opacity: textOpacity,
                fontSize: '40px',
                writingMode: 'vertical-rl', // 画像に合わせて縦書きにする場合
                letterSpacing: '0.2em'
            }}>
                <div>「この世界では、顔は見えない。」</div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
