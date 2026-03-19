import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    interpolate,
    staticFile,
    Img,
} from 'remotion';
import { SubtitleSequence } from './SubtitleSequence';
import subtitleData from './data/five_minutes_left.json';

// ─── SHOT 画像リスト ─────────────────────────────────────────────
// CapCutで使う画像をpublic/five_minutes_left/ に配置してください
const SHOTS = [
    { id: 'shot1', file: 'fml/shot1_cafe_girl_waiting.png', start: 0, dur: 270 }, // 0:00-0:09
    { id: 'shot2', file: 'fml/shot2_boy_running_silhouette.png', start: 270, dur: 180 }, // 0:09-0:15
    { id: 'shot3', file: 'fml/shot3_boy_arrives_breathless.png', start: 450, dur: 150 }, // 0:15-0:20
    { id: 'shot4', file: 'fml/shot4_girl_tsundere_reaction.png', start: 600, dur: 270 }, // 0:20-0:29
    { id: 'shot5', file: 'fml/shot5_boy_apologizes.png', start: 870, dur: 540 }, // 0:29-0:47
    { id: 'shot6', file: 'fml/shot6_girl_smiles_finally.png', start: 1410, dur: 180 }, // 0:47-0:53
    { id: 'shot7', file: 'fml/shot7_couple_walking_together.png', start: 1620, dur: 180 }, // 0:54-1:00
];

// ─── 1枚SHOTコンポーネント ──────────────────────────────────────
const ShotFrame: React.FC<{ file: string; durationInFrames: number }> = ({ file, durationInFrames }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(
        frame,
        [0, 8, durationInFrames - 10, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    // Ken Burns: ゆっくりズームイン
    const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.06], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ opacity }}>
            <Img
                src={staticFile(file)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${scale})`,
                }}
            />
        </AbsoluteFill>
    );
};

// ─── メインコンポジション ────────────────────────────────────────
export const FiveMinutesLeft: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>

        {/* SHOT シーケンス */}
        {SHOTS.map((shot) => (
            <Sequence key={shot.id} from={shot.start} durationInFrames={shot.dur}>
                <ShotFrame file={shot.file} durationInFrames={shot.dur} />
            </Sequence>
        ))}

        {/* 字幕オーバーレイ */}
        <SubtitleSequence data={subtitleData} />

    </AbsoluteFill>
);
