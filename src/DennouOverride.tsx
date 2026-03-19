import React from 'react';
import { AbsoluteFill, Video, Audio, staticFile, Sequence } from 'remotion';
import { CyberImpactTelop } from './components/CyberImpactTelop';
import { InformationViolence } from './components/InformationViolence';
import { RecordingUI } from './components/RecordingUI';
import syncData from './data/dennou_override.json';

const FLASH_KEYWORDS = ['再起動', '証明', '起動', 'オーバーライド', 'ハッキング', '突破', '最深部', 'SYSTEM', 'SUCCESS', 'ALIVE'];

export const DennouOverride: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* 1. Video Layer */}
            <Video
                src={staticFile("videos/電脳オーバーライド！_完成.mp4")}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* 2. Information Violence (Background Logs) */}
            <InformationViolence />

            {/* 3. Audio */}
            <Audio src={staticFile("music/電脳オーバーライド！.wav")} />

            {/* 4. Lyrics & Flash Logic */}
            {syncData.map((item) => {
                const startFrame = Math.round(item.start * 30);
                const endFrame = Math.round(item.end * 30);
                const isImportant = FLASH_KEYWORDS.some(kw => item.text.includes(kw));

                return (
                    <React.Fragment key={item.id}>
                        <Sequence
                            from={startFrame}
                            durationInFrames={endFrame - startFrame}
                        >
                            <CyberImpactTelop text={item.text} isImportant={isImportant} />
                        </Sequence>
                    </React.Fragment>
                );
            })}

            {/* 5. Recording UI Layer (Always on top) */}
            <RecordingUI />
        </AbsoluteFill>
    );
};
