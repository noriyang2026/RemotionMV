import React from 'react';
import { AbsoluteFill, Video, useCurrentFrame, staticFile } from 'remotion';
import subtitles from './data/dhm11_subtitles.json';

const FONT_FAMILY = 'monospace';

export const DHM11: React.FC = () => {
    const frame = useCurrentFrame();
    const fps = 30;

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <Video
                src={staticFile('/videos/DHM#11.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />

            {/* Subtitle Overlay */}
            <AbsoluteFill style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 200,
            }}>
                {subtitles.map((sub, i) => {
                    const startFrame = sub.start * fps;
                    const endFrame = sub.end * fps;
                    const active = frame >= startFrame && frame < endFrame;

                    if (!active) return null;

                    return (
                        <div key={i} style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#00ffff',
                            padding: '10px 40px',
                            fontSize: 70,
                            fontFamily: FONT_FAMILY,
                            fontWeight: 'bold',
                            borderLeft: '10px solid #00ffff',
                            textShadow: '0 0 10px #00ffff',
                            textAlign: 'center',
                            maxWidth: '80%',
                            letterSpacing: '0.1em',
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                        }}>
                            {sub.text}
                        </div>
                    );
                })}
            </AbsoluteFill>

            {/* System UI Element */}
            <div style={{
                position: 'absolute',
                top: 50,
                left: 50,
                color: '#00ffff',
                fontFamily: FONT_FAMILY,
                fontSize: 30,
                fontWeight: 'bold',
                opacity: 0.8,
                borderLeft: '4px solid #00ffff',
                paddingLeft: 20
            }}>
                [ LOG: DHM #11 ]<br />
                TYPE: DECRYPTION_SUBTITLES<br />
                STATUS: ENCAPSULATING...
            </div>
        </AbsoluteFill>
    );
};
