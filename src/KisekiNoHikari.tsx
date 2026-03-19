import { AbsoluteFill, staticFile, Audio, Video, Sequence } from 'remotion';
import React from 'react';
import { LyricsSequence, LyricItem } from './LyricsSequence';
import kisekiData from './data/kiseki_no_hikari.json';

const lyricsData: LyricItem[] = kisekiData.lyrics.map(l => ({
    text: [l.text],
    startFrame: l.start,
    durationInFrames: l.duration
}));

export const KisekiNoHikari: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* 1. Main Video Source */}
            <AbsoluteFill>
                <Video
                    src={staticFile('videos/MV軌跡の光_1.mp4')}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </AbsoluteFill>

            {/* 2. Audio Source */}
            <Audio src={staticFile('music/軌跡の光.wav')} />

            {/* 3. Lyrics Layer */}
            <LyricsSequence data={lyricsData} />

            {/* 4. Overlay / Fade Out */}
            <Sequence from={6600} durationInFrames={180}>
                <AbsoluteFill style={{
                    backgroundColor: 'black',
                    opacity: 0 // You could animate this for a fade to black
                }} />
            </Sequence>
        </AbsoluteFill>
    );
};
