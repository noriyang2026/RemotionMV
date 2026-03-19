import React from 'react';
import { AbsoluteFill, Video, staticFile } from 'remotion';
import { ReLordPrologueSubs } from './components/ReLordPrologueSubs';
import subtitleData from './data/relord_prologue_subs.json';

export const ReLordPrologue: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* relord_prologue.mp4 — Re:Lord序章映像（リベンジ1.mp4のコピー） */}
            <Video
                src={staticFile('videos/relord_prologue.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* 字幕レイヤー */}
            <ReLordPrologueSubs data={subtitleData as any} />
        </AbsoluteFill>
    );
};
