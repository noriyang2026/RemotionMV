import React from 'react';
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    random,
} from 'remotion';
import { loadFont as loadOrbitron } from '@remotion/google-fonts/Orbitron';
import { loadFont as loadNotoSerifJP } from '@remotion/google-fonts/NotoSerifJP';
import { loadFont as loadShareTech } from '@remotion/google-fonts/ShareTechMono';

const { fontFamily: orbitron } = loadOrbitron();
const { fontFamily: notoSerifJP } = loadNotoSerifJP();
const { fontFamily: shareTech } = loadShareTech();

// ── 字幕データ型 ──────────────────────────────────────────
interface SubtitleItem {
    id: number;
    text: string;
    start: number;
    end: number;
    phase: 'modern' | 'log';
    opacity_override?: number;
}

// ── タイプライター演出（モダンフェーズ用） ───────────────
const TypewriterText: React.FC<{
    text: string;
    frame: number;
    startFrame: number;
    fps: number;
    color: string;
    fontFamily: string;
    fontSize: number;
    fontWeight?: number;
    accentColor?: string;
}> = ({ text, frame, startFrame, fps, color, fontFamily, fontSize, fontWeight = 700, accentColor }) => {
    const chars = Array.from(text);
    const relativeFrame = frame - startFrame;
    // 1文字あたり 3フレーム（30fps = 0.1秒/文字）
    const FRAMES_PER_CHAR = 3;
    const visibleCount = Math.min(chars.length, Math.floor(relativeFrame / FRAMES_PER_CHAR));
    // カーソル点滅（8フレーム周期）
    const showCursor = relativeFrame >= 0 && frame % 16 < 8;
    const commonStyle: React.CSSProperties = {
        fontFamily,
        fontSize,
        fontWeight,
        textShadow: `0 0 12px rgba(0,255,65,0.5), 0 2px 20px rgba(0,0,0,0.95)`,
    };
    return (
        <span>
            {chars.slice(0, visibleCount).map((char, i) => {
                const isAccentChar = accentColor && ['！', '。', '、', '？', '…', '・'].includes(char);
                return (
                    <span
                        key={i}
                        style={{
                            ...commonStyle,
                            display: 'inline-block',
                            color: isAccentChar ? accentColor : color,
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                );
            })}
            {/* 点滅カーソル */}
            {showCursor && visibleCount < chars.length && (
                <span style={{
                    ...commonStyle,
                    display: 'inline-block',
                    color: accentColor ?? '#00ff41',
                    opacity: 0.9,
                    marginLeft: 2,
                }}>
                    █
                </span>
            )}
        </span>
    );
};

// ── レーザーカット演出（ログフェーズ＝歌詞用） ────────────
const LaserCutText: React.FC<{
    text: string;
    frame: number;
    startFrame: number;
    fps: number;
    color: string;
    fontFamily: string;
    fontSize: number;
    fontWeight?: number;
    glowColor?: string;
}> = ({ text, frame, startFrame, fps, color, fontFamily, fontSize, fontWeight = 700, glowColor }) => {
    const chars = Array.from(text);
    const relFrame = frame - startFrame;
    // 1文字あたり2フレームでカット（30fps = 0.067秒/文字）
    const FRAMES_PER_CHAR = 2;

    return (
        <span style={{ position: 'relative', display: 'inline-block' }}>
            {chars.map((char, i) => {
                const charCutFrame = i * FRAMES_PER_CHAR;
                // シャープな0/1切り替え（レーザーカット感）
                const isRevealed = relFrame >= charCutFrame;
                // カット直後の2フレームだけフラッシュ
                const isFlashing = relFrame >= charCutFrame && relFrame < charCutFrame + 3;
                // レーザーヘッド位置（現在カット中の文字）
                const isLaserHead = relFrame >= charCutFrame && relFrame < charCutFrame + FRAMES_PER_CHAR;

                return (
                    <span
                        key={i}
                        style={{
                            display: 'inline-block',
                            position: 'relative',
                            fontFamily,
                            fontSize,
                            fontWeight,
                            color: isRevealed ? color : 'transparent',
                            textShadow: isRevealed
                                ? isFlashing
                                    ? `0 0 24px ${glowColor ?? '#00ffff'}, 0 0 48px ${glowColor ?? '#00ffff'}, 0 0 6px #ffffff`
                                    : `0 0 14px ${glowColor ?? '#00e5cc'}, 0 0 40px ${glowColor ?? '#00e5cc'}66`
                                : 'none',
                            filter: isFlashing ? 'brightness(1.6)' : 'none',
                            willChange: 'color, text-shadow, filter',
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                        {/* レーザーライン — カット位置に縦の光線 */}
                        {isLaserHead && (
                            <span
                                style={{
                                    position: 'absolute',
                                    right: -1,
                                    top: '-15%',
                                    width: 2,
                                    height: '130%',
                                    background: 'linear-gradient(180deg, transparent 0%, #00ffff 20%, #ffffff 50%, #00ffff 80%, transparent 100%)',
                                    boxShadow: '0 0 8px 2px rgba(0,255,255,0.8), 0 0 20px 4px rgba(0,255,255,0.4)',
                                    pointerEvents: 'none',
                                    zIndex: 10,
                                }}
                            />
                        )}
                    </span>
                );
            })}
        </span>
    );
};

// ── HUD 点滅（ログ接続後） ─────────────────────────────────
const HudOverride: React.FC<{ frame: number }> = ({ frame }) => {
    const blinkOpacity = frame % 18 < 9 ? 0.42 : 0;
    return (
        <div
            style={{
                position: 'absolute',
                bottom: 268,
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#00ffcc',
                fontFamily: shareTech,
                fontSize: 13,
                letterSpacing: '0.22em',
                opacity: blinkOpacity,
                userSelect: 'none',
                whiteSpace: 'nowrap',
            }}
        >
            SYSTEM: LOG_OVERRIDE_ACTIVE
        </div>
    );
};

// ── サイバーパンク デジタルグリッチオーバーレイ ────────────
const GlitchOverlay: React.FC<{ frame: number }> = ({ frame }) => {
    // RGB 分離量（時々スパイク）
    const rgbShift = random(frame * 0.3) > 0.85
        ? random(frame) * 16
        : random(frame * 0.7) * 3;
    const isHardGlitch = random(frame * 1.7) > 0.92;

    // 走査線ノイズ帯の Y 位置
    const scanY1 = (frame * 7.3) % 100;
    const scanY2 = (frame * 13.1 + 40) % 100;

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 150 }}>

            {/* RGB 分離 — シアン */}
            <div style={{
                position: 'absolute', inset: 0,
                transform: `translateX(-${rgbShift}px)`,
                opacity: 0.4,
                background: 'linear-gradient(transparent 0%, rgba(0,242,255,0.05) 50%, transparent 100%)',
                mixBlendMode: 'screen',
            }} />

            {/* RGB 分離 — マゼンタ */}
            <div style={{
                position: 'absolute', inset: 0,
                transform: `translateX(${rgbShift}px)`,
                opacity: 0.4,
                background: 'linear-gradient(transparent 0%, rgba(255,0,180,0.05) 50%, transparent 100%)',
                mixBlendMode: 'screen',
            }} />

            {/* 走査線ノイズ帯 #1 */}
            <div style={{
                position: 'absolute',
                top: `${scanY1}%`,
                left: 0, right: 0,
                height: `${random(frame * 2) * 2 + 1}%`,
                background: 'rgba(0,255,200,0.07)',
                mixBlendMode: 'screen',
            }} />

            {/* 走査線ノイズ帯 #2 */}
            <div style={{
                position: 'absolute',
                top: `${scanY2}%`,
                left: 0, right: 0,
                height: `${random(frame * 3) * 1.5 + 0.5}%`,
                background: 'rgba(255,50,200,0.06)',
                mixBlendMode: 'screen',
            }} />

            {/* ハードグリッチフラッシュ（低頻度） */}
            {isHardGlitch && (
                <div style={{
                    position: 'absolute',
                    top: `${random(frame * 5) * 70 + 10}%`,
                    left: `${random(frame * 6) * 30}%`,
                    right: `${random(frame * 7) * 30}%`,
                    height: `${random(frame * 8) * 3 + 0.5}%`,
                    background: random(frame * 9) > 0.5
                        ? 'rgba(0,255,200,0.28)'
                        : 'rgba(255,0,130,0.22)',
                    mixBlendMode: 'screen',
                }} />
            )}

            {/* 常時スキャンライン */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.09) 3px, rgba(0,0,0,0.09) 4px)',
            }} />
        </div>
    );
};

// ── メインコンポーネント ──────────────────────────────────
interface Props {
    data: SubtitleItem[];
}

export const ReLordPrologueSubs: React.FC<Props> = ({ data }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTime = frame / fps;

    const current = data.find(
        (item) => currentTime >= item.start && currentTime <= item.end
    );

    const isLogPhase = currentTime >= 24.0;

    // ── フェーズ別スタイル ─────────────────────────────────
    const isModern = !current || current.phase === 'modern';

    // モダン: Orbitron 白 × 緑アクセント（AI VTuber ターミナル）
    // ログ:   Noto Serif JP 900 シアングロー（太字明朝）
    const fontFamily = isModern ? orbitron : notoSerifJP;
    const fontSize = isModern ? 56 : 68;
    const fontWeight = isModern ? 700 : 900;
    const letterSpacing = isModern ? '0.08em' : '0.04em';
    const color = isModern ? '#ffffff' : '#7fffd4';
    const glowColor = isModern ? undefined : '#00e5cc';
    const accentColor = isModern ? '#00ff41' : undefined;

    const baseOpacity = current?.opacity_override ?? 1.0;

    const entranceSpring = current
        ? spring({
            frame: frame - current.start * fps,
            fps,
            config: { damping: 12, stiffness: 180 },
        })
        : 0;

    const exitOpacity = current
        ? interpolate(
            currentTime,
            [current.end - 0.3, current.end],
            [1, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
        : 0;

    const finalOpacity = entranceSpring * exitOpacity * baseOpacity;

    return (
        <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>

            {/* 24秒以降: サイバーパンクグリッチオーバーレイ */}
            {isLogPhase && <GlitchOverlay frame={frame} />}

            {/* HUD 点滅 */}
            {isLogPhase && <HudOverride frame={frame} />}

            {/* 字幕エリア（下部中央） */}
            {current && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 100,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        zIndex: 200,
                        opacity: finalOpacity,
                        padding: '0 120px',
                    }}
                >
                    {/* 背景グラデーション */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: -16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '85%',
                            height: current.phase === 'log' ? 120 : 100,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0) 100%)',
                            borderRadius: 4,
                            zIndex: 0,
                        }}
                    />

                    {/* テキスト — モダン: タイプライター / ログ: Spring */}
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', letterSpacing }}>
                        {isModern ? (
                            <TypewriterText
                                text={current.text}
                                frame={frame}
                                startFrame={current.start * fps}
                                fps={fps}
                                color={color}
                                fontFamily={fontFamily}
                                fontSize={fontSize}
                                fontWeight={fontWeight}
                                accentColor={accentColor}
                            />
                        ) : (
                            <LaserCutText
                                text={current.text}
                                frame={frame}
                                startFrame={current.start * fps}
                                fps={fps}
                                color={color}
                                fontFamily={fontFamily}
                                fontSize={fontSize}
                                fontWeight={fontWeight}
                                glowColor={glowColor}
                            />
                        )}
                    </div>

                </div>
            )}
        </AbsoluteFill>
    );
};
