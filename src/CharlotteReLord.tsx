import React from 'react';
import { AbsoluteFill, Audio, Video, staticFile } from 'remotion';
import { AILogTelop } from './components/AILogTelop';

// Import sync data
import syncData from './data/charlotte_relord.json';

export const CharlotteReLord: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <Video
                src={staticFile("videos/zankyou.mp4")}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Audio src={staticFile("music/charlotte_relord.wav")} />
            <AILogTelop data={syncData} />
        </AbsoluteFill>
    );
};
