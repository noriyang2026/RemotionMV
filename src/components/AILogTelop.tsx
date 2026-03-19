import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, random, Easing } from 'remotion';
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadRajdhani } from "@remotion/google-fonts/Rajdhani";
import { loadFont as loadOxanium } from "@remotion/google-fonts/Oxanium";
import { loadFont as loadShareTech } from "@remotion/google-fonts/ShareTechMono";

const { fontFamily: orbitron } = loadFont();
const { fontFamily: rajdhani } = loadRajdhani();
const { fontFamily: oxanium } = loadOxanium();
const { fontFamily: shareTech } = loadShareTech();

// --- Glitch Decoding Logic (inherited from DennouOverride) ---
const GLITCH_CHARS = '░▒▓█▄▀■□▪▫◆◇○●★☆※†‡§∞αβγδεζ∫∑∏√∞≡≠≈';

const pseudoRandChar = (frame: number, charIdx: number): string => {
    const idx = Math.abs(Math.floor(
        Math.sin(frame * 1.3 + charIdx * 7.9) * GLITCH_CHARS.length
    )) % GLITCH_CHARS.length;
    return GLITCH_CHARS[idx];
};

const DecodeText: React.FC<{ text: string; frame: number; startFrame: number; decodeDuration: number; color: string; isGlitchy: boolean }> = ({ text, frame, startFrame, decodeDuration, color, isGlitchy }) => {
    const relativeFrame = frame - startFrame;
    const chars = Array.from(text);

    return (
        <span>
            {chars.map((char, i) => {
                const decodeAt = Math.floor((i / chars.length) * decodeDuration);
                const isDecoded = relativeFrame >= decodeAt;

                if (!isGlitchy && !isDecoded) return null; // Standard hidden

                return (
                    <span
                        key={i}
                        style={{
                            display: 'inline-block',
                            color: isDecoded ? color : (isGlitchy ? 'rgba(0,255,180,0.7)' : 'transparent'),
                            textShadow: isDecoded && relativeFrame - decodeAt < 4
                                ? `0 0 20px ${color}, 0 0 40px ${color}`
                                : 'none',
                        }}
                    >
                        {isDecoded ? char : (isGlitchy ? pseudoRandChar(frame, i) : '')}
                    </span>
                );
            })}
        </span>
    );
};

interface SyncItem {
    id: number;
    text: string;
    start: number;
    end: number;
    tag?: string;
    vfx: string;
}

export const AILogTelop: React.FC<{ data: SyncItem[] }> = ({ data }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const currentTime = frame / fps;

    const currentPhrase = (data || []).find(item => currentTime >= item.start && currentTime <= item.end);

    // --- Core State & Easing ---
    const t = currentPhrase ? (currentTime - currentPhrase.start) : 0;
    const progress = currentPhrase ? Math.min(1, t / 0.4) : 0;
    const entrance = currentPhrase ? spring({
        frame: frame - (currentPhrase.start * fps),
        fps,
        config: { damping: 12, stiffness: 200 }
    }) : 0;

    // --- Dynamic Styles & Effects based on Phase ---
    const vfx = currentPhrase?.vfx || "default";

    // 1. HUD & Common Overlays
    const cornerFlicker = random(frame) > 0.95 ? 0.4 : 1;
    const globalGlitch = random(frame) > 0.98;

    // 2. Base Style Tokens
    let mainColor = "#00f2ff";
    let activeFont = rajdhani;
    let fontSize = 72;
    let fontWeight: number | string = 700;
    let opacity = entrance;
    let letterSpacing = "0.05em";
    let textAlign: "center" | "left" = "center";
    let textTransform: "uppercase" | "none" = "uppercase";

    let containerStyle: React.CSSProperties = {};
    let textStyle: React.CSSProperties = {};
    let backgroundEffect: React.ReactNode = null;
    let foregroundEffect: React.ReactNode = null;

    let useDecodeTyping = true;
    let decodeDuration = 20; // frames

    // --- Phase Logic ---

    // Phase 1: Boot (22-39s)
    if (vfx === "phase1_boot") {
        activeFont = shareTech;
        mainColor = random(frame) > 0.99 ? "#ffb300" : "#00ff41";
        fontSize = 52;
        textAlign = "left";
        containerStyle.left = "12%";
        decodeDuration = 30;
        backgroundEffect = (
            <div style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.5, color: mainColor, fontSize: 16, fontFamily: shareTech }}>
                <div style={{ borderLeft: `2px solid ${mainColor}`, paddingLeft: 10 }}>
                    DECODING_MEMORY_BLOCK_0x{Math.floor(random(frame) * 0xFFFF).toString(16)}... [OK]<br />
                    RESTORING_CHARLOTTE_LOGS... {Math.min(100, Math.floor(progress * 100))}%<br />
                    SYST_ANALYSIS: {random(frame) > 0.5 ? "SUCCESS" : "WAITING..."}
                </div>
            </div>
        );
    }

    // Phase 2: Hack (40-54s)
    if (vfx.includes("phase2_hack")) {
        activeFont = oxanium;
        mainColor = "#FF003C"; // Cyber Red
        decodeDuration = 10;
        const moshTrigger = random(frame) > 0.8;
        if (moshTrigger) {
            textStyle.clipPath = `inset(${random(frame) * 15}% ${random(frame + 1) * 15}% ${random(frame + 2) * 15}% ${random(frame + 3) * 15}%)`;
            textStyle.transform = `translateX(${(random(frame + 4) - 0.5) * 150}px) scaleY(${random(frame) * 3})`;
        }
        foregroundEffect = random(frame) > 0.92 ? (
            <AbsoluteFill style={{ backgroundColor: 'rgba(255, 0, 60, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ color: '#FF003C', fontSize: 120, fontWeight: 900, border: '15px solid #FF003C', padding: '30px 70px', backgroundColor: 'black', fontFamily: orbitron, transform: `skewX(-15deg)` }}>
                    DENNOU_OVERRIDE // 電脳介入
                </div>
            </AbsoluteFill>
        ) : null;
    }

    // Phase 3: Reboot (55-85s)
    if (vfx.includes("phase3_reboot")) {
        activeFont = orbitron;
        mainColor = "#00f2ff";
        fontSize = 110;
        fontWeight = 900;
        letterSpacing = "0.25em";
        decodeDuration = 15;
        textStyle.textShadow = `8px 0 0 rgba(255,0,242,0.8), -8px 0 0 rgba(0,242,255,0.8)`;
        containerStyle.transform = `scale(${interpolate(entrance, [0, 1], [0.3, 1], { easing: Easing.out(Easing.exp) })}) skewX(-10deg)`;

        const bsodTrigger = currentTime >= 73 && currentTime < 73.15;
        if (bsodTrigger) {
            foregroundEffect = (
                <AbsoluteFill style={{ backgroundColor: '#0000AA', color: 'white', padding: '120px', fontFamily: shareTech, zIndex: 2000 }}>
                    <div style={{ fontSize: 50, marginBottom: 40 }}>:(</div>
                    <div style={{ fontSize: 36, lineHeight: 1.4 }}>Your system ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</div>
                    <div style={{ marginTop: 80, fontSize: 24 }}>0% complete</div>
                    <div style={{ position: 'absolute', bottom: 100, fontSize: 18 }}>Stop Code: PHASE_SHIFT_VOID_ERROR</div>
                </AbsoluteFill>
            );
        }
    }

    // Phase 4: Dive (86-113s)
    if (vfx.includes("phase4_dive")) {
        activeFont = rajdhani;
        mainColor = "#0bc";
        fontSize = 50;
        fontWeight = 400;
        textTransform = "none";
        letterSpacing = "0.5em";
        decodeDuration = 25;

        backgroundEffect = (
            <div style={{ position: 'absolute', inset: 0, opacity: 0.2, overflow: 'hidden' }}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${i * 5}%`,
                        top: `${(frame * (3 + random(i) * 4)) % 120 - 10}%`,
                        color: mainColor,
                        fontSize: 14,
                        fontFamily: shareTech,
                        letterSpacing: 2
                    }}>
                        {getHexRain(30, frame + i)}
                    </div>
                ))}
            </div>
        );

        if (vfx === "phase4_dive_out") {
            const shrink = interpolate(t, [2.5, 3], [1, 0], { extrapolateRight: 'clamp' });
            containerStyle.transform = `scale(${shrink}) rotate(${progress * 5}deg)`;
            if (currentTime > 112.85) opacity = 0;
        }
    }

    // Phase 5: Update (114-144s)
    if (vfx.includes("phase5_update")) {
        activeFont = oxanium;
        mainColor = "#00f2ff";
        fontSize = 120;
        fontWeight = 900;
        decodeDuration = 12;
        textStyle.textShadow = `0 0 40px rgba(0,242,255,0.7)`;

        foregroundEffect = (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {/* Target Scope Crosshair */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 500, height: 500, transform: 'translate(-50%, -50%)', border: '2px solid rgba(0,242,255,0.2)', borderRadius: '50%' }}>
                    <div style={{ position: 'absolute', top: '-10px', left: '50%', width: 2, height: 40, backgroundColor: '#00f2ff' }} />
                    <div style={{ position: 'absolute', bottom: '-10px', left: '50%', width: 2, height: 40, backgroundColor: '#00f2ff' }} />
                    <div style={{ position: 'absolute', left: '-10px', top: '50%', width: 40, height: 2, backgroundColor: '#00f2ff' }} />
                    <div style={{ position: 'absolute', right: '-10px', top: '50%', width: 40, height: 2, backgroundColor: '#00f2ff' }} />
                </div>

                {/* HUD Grid */}
                <div style={{ position: 'absolute', inset: '10%', border: '1px solid rgba(0,242,255,0.1)', background: 'radial-gradient(rgba(0,242,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                {/* Animated Bars */}
                <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, alignItems: 'flex-end', height: 200 }}>
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} style={{
                            width: 10,
                            height: interpolate(random(frame + i), [0, 1], [10, 180]),
                            backgroundColor: mainColor,
                            opacity: 0.4
                        }} />
                    ))}
                </div>
            </div>
        );
    }

    // Phase 6: Finale (145-175s)
    if (vfx.includes("phase6_finale")) {
        activeFont = orbitron;
        mainColor = "#fff";
        fontSize = 84;
        fontWeight = 900;
        decodeDuration = 40;
        textStyle.textShadow = vfx.includes("clear") ? `0 0 20px rgba(255,255,255,0.8)` : "none";
        opacity = vfx.includes("clear") ? 1 : entrance;

        if (vfx === "phase6_finale_sudo") {
            const sudoProgress = interpolate(t, [3.5, 4.5], [0, 1], { extrapolateRight: 'clamp' });
            const sudoText = "sudo reboot --force";
            useDecodeTyping = false;
            backgroundEffect = (
                <div style={{ position: 'absolute', bottom: '25%', left: '15%', color: '#00ff41', fontFamily: shareTech, fontSize: 32, opacity: sudoProgress }}>
                    <span style={{ color: '#fff', opacity: 0.6 }}>[ROOT@CHARLOTTE] ~# </span>
                    {sudoText.substring(0, Math.floor(interpolate(t, [3.6, 4.4], [0, sudoText.length], { extrapolateLeft: 'clamp' })))}
                    <span style={{ opacity: frame % 12 < 6 ? 1 : 0, backgroundColor: '#00ff41', width: 14, display: 'inline-block' }}>&nbsp;</span>
                </div>
            );
            if (currentTime > 177.8) opacity = 0;
        }
    }

    // --- Final Rendering ---
    let displayText: React.ReactNode = null;
    if (currentPhrase) {
        const tagText = currentPhrase.tag ? `${currentPhrase.tag} ` : "";
        const rawText = currentPhrase.text;
        const fullText = (vfx.includes("phase1") || vfx.includes("finale")) ? (tagText + rawText) : (tagText + rawText.toUpperCase());

        if (useDecodeTyping) {
            displayText = <DecodeText
                text={fullText}
                frame={frame}
                startFrame={currentPhrase.start * fps}
                decodeDuration={decodeDuration}
                color={mainColor}
                isGlitchy={vfx.includes("hack") || vfx.includes("boot") || vfx.includes("reboot")}
            />;
        } else {
            const charCount = Math.floor(interpolate(t, [0, 0.4], [0, fullText.length], { extrapolateRight: 'clamp' }));
            displayText = fullText.substring(0, charCount);
        }
    }

    return (
        <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
            {/* Global Cyber Layers */}
            <div style={{ position: 'absolute', inset: 0, opacity: cornerFlicker * 0.8, zIndex: 1100 }}>
                {/* HUD Corners (L-brackets) */}
                <div style={{ position: 'absolute', top: 40, left: 40, width: 60, height: 60, borderTop: '4px solid #00f2ff', borderLeft: '4px solid #00f2ff' }} />
                <div style={{ position: 'absolute', top: 40, right: 40, width: 60, height: 60, borderTop: '4px solid #00f2ff', borderRight: '4px solid #00f2ff' }} />
                <div style={{ position: 'absolute', bottom: 40, left: 40, width: 60, height: 60, borderBottom: '4px solid #00f2ff', borderLeft: '4px solid #00f2ff' }} />
                <div style={{ position: 'absolute', bottom: 40, right: 40, width: 60, height: 60, borderBottom: '4px solid #00f2ff', borderRight: '4px solid #00f2ff' }} />

                {/* Vignette */}
                <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 200px rgba(0,0,0,0.8)' }} />
            </div>

            {/* Scanlines & Digital Grain */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.15, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 1200 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)', backgroundSize: '100% 4px' }} />
            </div>

            {backgroundEffect}

            {currentPhrase && (
                <div style={{
                    position: 'absolute',
                    bottom: 180,
                    width: '100%',
                    display: 'flex',
                    justifyContent: textAlign === "center" ? 'center' : 'flex-start',
                    zIndex: 160,
                    opacity: opacity,
                    filter: globalGlitch ? `url(#noise)` : 'none',
                    ...containerStyle
                }}>
                    <div style={{
                        fontSize,
                        fontWeight,
                        color: mainColor,
                        fontFamily: activeFont,
                        letterSpacing,
                        textTransform,
                        position: 'relative',
                        transform: globalGlitch ? `translateX(${(random(frame) - 0.5) * 50}px)` : 'none',
                        ...textStyle
                    }}>
                        {/* Glow Layer */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%',
                            color: mainColor, opacity: 0.5, filter: 'blur(12px)',
                            zIndex: -1
                        }}>{displayText}</div>

                        {displayText}

                        {(vfx.includes("boot") || vfx.includes("sudo")) && (
                            <span style={{
                                display: 'inline-block', width: 15, height: fontSize * 0.8,
                                backgroundColor: mainColor, marginLeft: 15,
                                verticalAlign: 'middle', opacity: frame % 10 < 5 ? 1 : 0,
                                boxShadow: `0 0 15px ${mainColor}`
                            }} />
                        )}
                    </div>
                </div>
            )}

            {foregroundEffect}
        </AbsoluteFill>
    );
};

// ヘルパー：16進数
const getHexRain = (len: number, seed: number) => {
    const chars = "10ABCDEF";
    let res = "";
    for (let i = 0; i < len; i++) {
        res += chars[Math.floor(random(seed + i) * chars.length)];
    }
    return res;
};
