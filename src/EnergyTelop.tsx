import React from 'react';
import { AbsoluteFill, Video, Sequence, useCurrentFrame, staticFile, spring, interpolate, useVideoConfig } from 'remotion';
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily } = loadFont();

const TypingText: React.FC<{ 
    text: string; 
    color?: string; 
    fontSize?: number; 
    delay?: number;
    fontFamily?: string;
    style?: React.CSSProperties;
}> = ({ text, color = '#00f2ff', fontSize = 32, delay = 0, style }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const adjustedFrame = Math.max(0, frame - delay);
    // typing speed: 3 chars per second approx (adjust as needed)
    const charsToShow = Math.floor(adjustedFrame / 1.5);
    const slicedText = text.slice(0, charsToShow);
    const isDone = charsToShow >= text.length;

    // Cursor blink
    const cursorOpacity = !isDone || Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

    return (
        <div style={{
            color,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize,
            lineHeight: 1.2,
            ...style
        }}>
            <span>{slicedText}</span>
            <span style={{ 
                opacity: cursorOpacity, 
                backgroundColor: color, 
                marginLeft: 4,
                display: 'inline-block',
                width: fontSize * 0.6,
                height: 4,
                verticalAlign: 'middle'
            }} />
        </div>
    );
};

const EmotionalCopy: React.FC<{ text: string }> = ({ text }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    
    // spring for the container entrance
    const spr = spring({
        frame,
        fps,
        config: {
            stiffness: 100,
        }
    });

    // typing effect: faster than system log for "emotional" feel
    const charsToShow = Math.floor(frame / 1.0); // 1 frame per char
    const slicedText = text.slice(0, charsToShow);

    const opacity = interpolate(spr, [0, 1], [0, 1]);
    const x = interpolate(spr, [0, 1], [30, 0]);

    return (
        <div style={{
            opacity,
            transform: `translateX(${x}px)`,
            color: 'white',
            fontSize: 44,
            fontWeight: 'bold',
            textAlign: 'right',
            marginRight: 80,
            textShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
            borderRight: '12px solid #00f2ff',
            paddingRight: 25,
            lineHeight: 1.4,
            fontFamily: 'sans-serif' // Standard sans for emotional parts
        }}>
            {slicedText}
        </div>
    );
};

export const EnergyTelop: React.FC = () => {
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <Video src={staticFile('videos/エネルギー.mp4')} />

            {/* --- 1. VITAL SECTION (RIGHT - MOVED HIGHER TO AVOID CLIPPING) --- */}
            <div style={{
                position: 'absolute',
                bottom: 120, // Moved up significantly from 40
                right: 60,   // Moved from 40 to 60
                width: 640,
                display: 'flex',
                flexDirection: 'column',
                gap: 15,
                zIndex: 30
            }}>
                {/* 0:00〜0:05 */}
                <Sequence from={0} durationInFrames={fps * 5}>
                    <TypingText text="SYSTEM: CAMELOT VITAL MONITOR v1.3.1 ACTIVE" fontSize={24} style={{ textAlign: 'right' }} />
                    <TypingText text="STATUS: OPTIMAL / COGNITIVE LOAD: NORMAL" fontSize={24} delay={fps * 1.5} style={{ textAlign: 'right' }} />
                </Sequence>

                {/* 0:08〜0:15 / Popups */}
                <Sequence from={fps * 8} durationInFrames={fps * 7}>
                    <TypingText 
                        text="[ MP RECHARGE: +30 / GLUCOSE SPIKE PREDICTION: HIGH ]" 
                        color="#ffb300" 
                        fontSize={20} 
                        style={{ backgroundColor: 'rgba(255, 179, 0, 0.1)', padding: '4px 8px', textAlign: 'right' }}
                    />
                    <div style={{ height: 10 }} />
                    <TypingText 
                        text="[ ADENOSINE BLOCK: ACTIVE / CAFFEINE DURATION: 4h ]" 
                        color="#ffb300" 
                        fontSize={20} 
                        delay={fps * 2}
                        style={{ backgroundColor: 'rgba(255, 179, 0, 0.1)', padding: '4px 8px', textAlign: 'right' }}
                    />
                </Sequence>

                {/* 0:20〜End Summary */}
                <Sequence from={fps * 20}>
                    <TypingText text="PREDICTION: NEXT CRASH IN 120min" color="#00f2ff" fontSize={24} style={{ textAlign: 'right' }} />
                    <TypingText text="SUGGESTION: STRATEGIC NAP RECOMMENDED" color="#ffb300" fontSize={24} delay={fps * 1} style={{ textAlign: 'right' }} />
                </Sequence>
            </div>

            {/* --- 2. MAIN VISUAL (CENTER-RIGHT - MOVED FURTHER DOWN/RIGHT) --- */}
            <div style={{
                position: 'absolute',
                top: '80%', // Moved from 65% to 80%
                right: 0,
                transform: 'translateY(-50%)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 40
            }}>
                {/* 0:02〜 */}
                <Sequence from={fps * 2} durationInFrames={fps * 8}>
                    <EmotionalCopy text="「1日16時間、AIの深淵に潜るための『装備』」" />
                </Sequence>

                {/* 0:12〜 */}
                <Sequence from={fps * 12} durationInFrames={fps * 8}>
                    <EmotionalCopy text="「脳内リソースを可視化し、限界を超えて共創する」" />
                </Sequence>

                {/* 0:20〜 */}
                <Sequence from={fps * 20}>
                    <EmotionalCopy text="「AIはツールではない。共に生きるための『環境』だ。」" />
                </Sequence>
            </div>

            {/* --- 3. PROMOTION SECTION (TOP CENTER - PREVENT CLIPPING) --- */}
            <Sequence from={fps * 1}>
                <div style={{
                    position: 'absolute',
                    top: 60,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 100
                }}>
                    <TypingText 
                        text="シャルロット　3月末デビュー予定" 
                        color="white" 
                        fontSize={42} 
                        style={{ fontWeight: 'bold', whiteSpace: 'nowrap', textAlign: 'center', textShadow: '0 0 20px rgba(0,0,0,0.8)' }}
                    />
                    <TypingText 
                        text="スポンサー募集中！" 
                        color="#ffb300" 
                        fontSize={32} 
                        delay={fps * 1.5}
                        style={{ fontWeight: 'bold', whiteSpace: 'nowrap', textAlign: 'center', textShadow: '0 0 15px rgba(0,0,0,0.8)' }}
                    />
                </div>
            </Sequence>

            {/* Scanlines / HUD Aesthetic */}
            <AbsoluteFill style={{
                pointerEvents: 'none',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)',
                backgroundSize: '100% 4px',
                opacity: 0.1
            }} />
        </AbsoluteFill>
    );
};
