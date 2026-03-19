import React from 'react';
import { AbsoluteFill, Video, Sequence, useCurrentFrame, staticFile } from 'remotion';
import { TemporalGlitch } from './TemporalGlitch';
import { ObservationHUD } from './ObservationHUD';

const TypingTelop: React.FC<{ text: string }> = ({ text }) => {
    const frame = useCurrentFrame();

    // typing speed: 1.5 frames per character
    const charsToShow = Math.floor(frame / 1.5);
    const slicedText = text.slice(0, charsToShow);
    const isDone = charsToShow >= text.length;

    return (
        <AbsoluteFill style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 50,
        }}>
            {/* Removed TemporalGlitch to eliminate block noise for better readability */}
            <div style={{
                color: '#00FFFF', // Cyber Blue
                fontFamily: '"Fira Code", "Source Code Pro", "Courier New", monospace',
                fontWeight: 500,
                fontSize: 48,
                textAlign: 'center',
                textShadow: '0 0 12px rgba(0, 255, 255, 0.9), 0 0 25px rgba(0, 255, 255, 0.4)', // Enhanced Glow
                backgroundColor: 'rgba(0,0,0,0.85)',
                padding: '12px 25px',
                border: '1px solid rgba(0, 255, 255, 0.4)',
                display: 'inline-block',
                minHeight: '1.2em', // Prevent layout shift during typing
            }}>
                <span>{slicedText}</span>
                <span style={{
                    opacity: isDone ? (Math.floor(frame / 15) % 2 === 0 ? 1 : 0) : 1,
                    marginLeft: 6,
                    display: 'inline-block',
                    width: 15,
                    height: '0.9em',
                    backgroundColor: '#00FFFF',
                    verticalAlign: 'baseline',
                    boxShadow: '0 0 10px #00FFFF',
                }} />
            </div>
        </AbsoluteFill>
    );
};

export const ObservationLog: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <Video src={staticFile('recording_test.mp4')} />

            <ObservationHUD />

            {/* (0:00〜0:05) 冒頭 */}
            <Sequence from={0} durationInFrames={60}>
                <TypingTelop text="AIは、もうツールではない。" />
            </Sequence>
            <Sequence from={75} durationInFrames={75}>
                <TypingTelop text="IPに命を宿す『自律機構（システム）』だ。" />
            </Sequence>

            {/* (0:05〜0:11) キャラクター紹介 */}
            <Sequence from={170} durationInFrames={80}>
                <TypingTelop text="魂（Lore）なき出力は、ただのノイズに消える。" />
            </Sequence>
            <Sequence from={265} durationInFrames={85}>
                <TypingTelop text="必要なのは、全てを統御する『ショーランナー』の覚悟。" />
            </Sequence>

            {/* (0:12〜0:22) アカシック・レコード */}
            <Sequence from={370} durationInFrames={80}>
                <TypingTelop text="演出の解体。コードの自律生成。" />
            </Sequence>
            <Sequence from={470} durationInFrames={80}>
                <TypingTelop text="私の専属エージェント（AI）たちは、" />
            </Sequence>
            <Sequence from={570} durationInFrames={150}>
                <TypingTelop text="私が寝ている間も、世界を観測し続けている。" />
            </Sequence>

            {/* (0:27〜0:33) 円卓 */}
            <Sequence from={820} durationInFrames={85}>
                <TypingTelop text="数多のツールを束ねる、独自の生成パイプライン" />
            </Sequence>
            <Sequence from={915} durationInFrames={85}>
                <TypingTelop text="【電脳記録都市 キャメロット】" />
            </Sequence>

            {/* (0:33〜0:35) ラスト */}
            <Sequence from={1010} durationInFrames={35}>
                <TypingTelop text="準備は整った。" />
            </Sequence>
            <Sequence from={1050} durationInFrames={40}>
                <TypingTelop text="円卓で、本物だけを待つ。" />
            </Sequence>

            {/* Scanning/Flicker Overlay */}
            <AbsoluteFill style={{
                pointerEvents: 'none',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
                backgroundSize: '100% 4px, 3px 100%',
                opacity: 0.2
            }} />
        </AbsoluteFill>
    );
};
