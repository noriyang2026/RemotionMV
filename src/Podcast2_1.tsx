import { AbsoluteFill, Audio, staticFile, useVideoConfig } from 'remotion';
import React from 'react';
import { SubtitleSequence, SubtitleItem } from './SubtitleSequence';
import rawData from './data/podcast2_1.json';
import { PodcastVisualizer } from './components/PodcastVisualizer';

const AUDIO_SRC = staticFile("/music/podcast2_1.mp3");
const IMAGE_SRC = staticFile("/podcast2_img_v2.png");

export const Podcast2_1: React.FC = () => {
    const { fps } = useVideoConfig();
    
    // Map the JSON data to the SubtitleItem type expected by SubtitleSequence
    const subtitleData: SubtitleItem[] = rawData.map((item, i) => ({
        id: `sub-${i}`,
        jpText: item.text,
        enText: "", // Master prefers JP only for this series
        startFrame: Math.round(item.start * fps),
        durationInFrames: Math.round(item.duration * fps),
    }));

    return (
        <AbsoluteFill style={{ backgroundColor: '#111' }}>
            {/* Background Image with better visibility */}
            <AbsoluteFill>
                <img 
                    src={IMAGE_SRC} 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: 'center 35%',
                        opacity: 0.8,
                        filter: 'contrast(1.1)'
                    }} 
                />
            </AbsoluteFill>
            
            {/* Softer ambient vignette */}
            <AbsoluteFill style={{
                background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.5) 100%)',
                pointerEvents: 'none'
            }} />
            
            {/* Audio & Waveform */}
            <Audio src={AUDIO_SRC} />
            
            {/* Center-aligned Powered Visualizer */}
            <AbsoluteFill style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                opacity: 0.6
            }}>
                <div style={{ width: '800px', height: '300px' }}>
                    <PodcastVisualizer audioSrc={AUDIO_SRC} />
                </div>
            </AbsoluteFill>
            
            {/* Subtitles (SubtitleSequence handles absolute positioning) */}
            <SubtitleSequence data={subtitleData} />
            
            {/* Decorative Cyberpunk Border */}
            <AbsoluteFill style={{
                border: '1px solid rgba(0, 255, 255, 0.2)',
                top: 40, bottom: 40, left: 40, right: 40,
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', top: 20, left: 60, color: '#00ffff',
                fontFamily: 'monospace', fontSize: '14px', letterSpacing: '0.2em'
            }}>
                EPISODE 02: REPLICATED ECHO // 複製された残響
            </div>

            {/* Bottom Left High-Visibility Credits */}
            <div style={{
                position: 'absolute', bottom: 50, left: 60, color: '#ffffff',
                fontFamily: '"Noto Sans JP", sans-serif', fontSize: '24px', fontWeight: 900,
                letterSpacing: '0.05em', textShadow: '0 0 10px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,1)'
            }}>
                (c) noriyang 『電脳椅子探偵シャルロット』
            </div>

            {/* Top Right Branding */}
            <div style={{ 
              position: 'absolute', top: 60, right: 80, color: 'white', textAlign: 'right',
              fontFamily: '"Noto Sans JP", sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '0.1em' }}>シャルロット</div>
              <div style={{ fontSize: 22, fontWeight: 500, opacity: 0.9, marginTop: '4px', color: '#e0e0e0' }}>
                ３月末デビュー予定！
              </div>
            </div>
        </AbsoluteFill>
    );
};
