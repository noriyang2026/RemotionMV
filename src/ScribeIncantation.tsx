import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    Sequence,
    Audio,
    OffthreadVideo,
    staticFile,
    spring,
    useVideoConfig,
} from "remotion";
import React, { useMemo } from "react";

// ── カラーパレット ──────────────────────────────────────
const C = {
    bg: "#020408",
    bgDeep: "#010205",
    text: "#7eb8d4",
    textBright: "#c8e8ff",
    green: "#00ff9f",
    cyan: "#00e5ff",
    cyanDim: "#007a99",
    red: "#ff2255",
    amber: "#ffaa00",
    purple: "#b060ff",
    dim: "#1a2a3a",
    dimMid: "#2a3f55",
    white: "#e8f4ff",
    gridLine: "rgba(0,180,255,0.07)",
};

const mono: React.CSSProperties = {
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    letterSpacing: "0.06em",
};

// ── ユーティリティ ──────────────────────────────────────

function typeLen(frame: number, startFrame: number, text: string, cps = 2.2) {
    const elapsed = Math.max(0, frame - startFrame);
    return Math.min(text.length, Math.floor(elapsed * cps));
}

function easeOut(t: number) {
    return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

function noise(frame: number, seed: number) {
    return Math.abs(Math.sin(frame * 0.7 + seed * 13.7)) % 1;
}

// ════════════════════════════════════════════════════════
// 共通コンポーネント
// ════════════════════════════════════════════════════════

const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => (
    <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 4px)",
        opacity,
    }} />
);

const CyberGrid: React.FC<{ frame: number; speed?: number }> = ({ frame, speed = 0.4 }) => {
    const offset = (frame * speed) % 80;
    return (
        <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(${C.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            backgroundPosition: `0px ${offset}px`,
        }} />
    );
};

const GlowLine: React.FC<{ y: number; color?: string; opacity?: number }> = ({
    y, color = C.cyan, opacity = 0.6,
}) => (
    <div style={{
        position: "absolute", left: 0, right: 0, top: y, height: 1,
        background: color,
        boxShadow: `0 0 8px ${color}, 0 0 20px ${color}40`,
        opacity,
    }} />
);

const HUDCorners: React.FC<{ frame: number }> = ({ frame }) => {
    const blink = Math.floor(frame / 20) % 2 === 0;
    return (
        <>
            <div style={{ position: "absolute", top: 20, left: 20, ...mono, fontSize: 13, color: C.cyanDim }}>
                <div>CAMELOT v2.1.0 / SCRIBE ENGINE</div>
                <div style={{ color: blink ? C.green : C.cyanDim }}>■ SYSTEM: ONLINE</div>
            </div>
            <div style={{ position: "absolute", top: 20, right: 20, ...mono, fontSize: 13, color: C.cyanDim, textAlign: "right" }}>
                <div>2026.02.21 — {String(Math.floor(frame / 30)).padStart(2, "0")}s</div>
                <div>MEM: {(2048 + frame * 7) % 8192}MB / CPU: {(30 + (frame % 40))}%</div>
            </div>
            <div style={{ position: "absolute", bottom: 16, left: 20, ...mono, fontSize: 12, color: C.dim }}>
                WATSON / noriyang0911 / AUTHORIZED
            </div>
            <div style={{ position: "absolute", bottom: 16, right: 20, ...mono, fontSize: 12, color: C.dim }}>
                FRAME:{String(frame).padStart(4, "0")} / 0900
            </div>
        </>
    );
};

const Cursor: React.FC = () => {
    const frame = useCurrentFrame();
    const on = Math.floor(frame / 13) % 2 === 0;
    return <span style={{ opacity: on ? 1 : 0, color: C.green, textShadow: `0 0 8px ${C.green}` }}>█</span>;
};

const GlitchFragment: React.FC<{ frame: number; seed: number }> = ({ frame, seed }) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const isGlitch = noise(frame, seed) > 0.82;
    if (!isGlitch) return null;
    const char = chars[Math.floor(noise(frame + 1, seed * 2) * chars.length)];
    const x = noise(frame, seed * 3) * 1900;
    const y = noise(frame, seed * 4) * 1050;
    return (
        <div style={{
            position: "absolute", left: x, top: y,
            ...mono, fontSize: 11, color: C.cyan, opacity: 0.3,
            pointerEvents: "none",
        }}>
            {char}
        </div>
    );
};

const DigitalNoise: React.FC<{ frame: number; intensity?: number }> = ({ frame, intensity = 1 }) => (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: Math.round(12 * intensity) }, (_, i) => (
            <GlitchFragment key={i} frame={frame} seed={i + 1} />
        ))}
    </div>
);

const CutFlash: React.FC<{ duration?: number }> = ({ duration = 6 }) => {
    const frame = useCurrentFrame();
    const op = interpolate(frame, [0, duration], [0.9, 0], { extrapolateRight: "clamp" });
    return <div style={{ position: "absolute", inset: 0, background: "#ffffff", opacity: op, pointerEvents: "none" }} />;
};

// ════════════════════════════════════════════════════════
// GlitchVideo — 単一OffthreadVideo + CSSオーバーレイのみ
// ════════════════════════════════════════════════════════

/**
 * 攻殻機動隊OP風グリッチ動画コンポーネント
 * ⚠️ OffthreadVideoは必ず1インスタンスのみ使用
 * グリッチはCSS filter(drop-shadow) + オーバーレイdivで実現
 */
const GlitchVideo: React.FC<{ frame: number; width: number; height: number }> = ({
    frame, width, height,
}) => {
    // グリッチ強度（一定間隔でスパイク）
    const isGlitch = noise(frame, 7) > 0.78 || Math.abs(Math.sin(frame * 0.18)) > 0.94;
    const gi = isGlitch ? 1.0 : 0.0;

    // RGBスプリット量（px）— drop-shadowで赤と青のズレを模擬
    const rShift = gi * (noise(frame, 11) * 12 + 3);
    const bShift = gi * (noise(frame, 23) * 12 + 3);

    // フリッカー輝度
    const flicker = isGlitch ? 0.7 + noise(frame, 41) * 0.4 : 0.85;

    // CSSフィルター（1ビデオに全部まとめる）
    // drop-shadow(赤オフセット) + drop-shadow(青オフセット) でRGBスプリット
    const videoFilter = isGlitch
        ? `grayscale(0.8) sepia(0.2) brightness(${flicker}) contrast(1.2) drop-shadow(${rShift}px 0px 0px rgba(255,30,80,0.85)) drop-shadow(-${bShift}px 0px 0px rgba(0,200,255,0.85))`
        : `grayscale(0.75) sepia(0.2) brightness(0.82) contrast(1.1)`;

    // 水平スライスグリッチ（透明なdivをXシフト — 映像コピーなし、上オーバーレイ）
    const slices = isGlitch
        ? Array.from({ length: 3 }, (_, i) => ({
            yPct: noise(frame, i * 31 + 100) * 70 + 10,
            hPx: Math.round(noise(frame, i * 31 + 200) * 14 + 4),
            xShift: (noise(frame, i * 31 + 300) - 0.5) * 30,
            opacity: 0.3 + noise(frame, i * 31 + 400) * 0.5,
        }))
        : [];

    // ブロックノイズ（単色div）
    const blocks = isGlitch
        ? Array.from({ length: 4 }, (_, i) => ({
            x: Math.round(noise(frame, i * 53 + 500) * width * 0.8),
            y: Math.round(noise(frame, i * 53 + 600) * height * 0.8),
            w: Math.round(noise(frame, i * 53 + 700) * 90 + 8),
            h: Math.round(noise(frame, i * 53 + 800) * 16 + 4),
            color: ["rgba(255,30,80,0.7)", "rgba(0,220,255,0.7)", "rgba(255,255,255,0.5)", "rgba(0,255,120,0.6)"][i % 4],
        }))
        : [];

    return (
        <div style={{ position: "relative", width, height, overflow: "hidden", background: "#000" }}>

            {/* ── 動画（1インスタンスのみ） ── */}
            <OffthreadVideo
                src={staticFile("videos/shutfullslot.mp4")}
                muted
                style={{
                    position: "absolute",
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    filter: videoFilter,
                    // グリッチ時にわずかにX歪み
                    transform: isGlitch ? `translateX(${(noise(frame, 99) - 0.5) * 6}px)` : "none",
                }}
            />

            {/* ── スライスグリッチオーバーレイ（白と黒の帯でラインを強調） ── */}
            {slices.map((s, i) => (
                <div key={i} style={{
                    position: "absolute",
                    left: 0, right: 0,
                    top: `${s.yPct}%`,
                    height: s.hPx,
                    background: i % 2 === 0 ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.4)",
                    transform: `translateX(${s.xShift}px)`,
                    pointerEvents: "none",
                }} />
            ))}

            {/* ── ブロックノイズ ── */}
            {blocks.map((b, i) => (
                <div key={i} style={{
                    position: "absolute",
                    left: b.x, top: b.y,
                    width: b.w, height: b.h,
                    background: b.color,
                    mixBlendMode: "overlay",
                    pointerEvents: "none",
                }} />
            ))}

            {/* ── CRTスキャンライン ── */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 3px)",
            }} />

            {/* ── RECラベル ── */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                padding: "8px 10px 5px",
                ...mono, fontSize: 12, color: "rgba(0,220,255,0.65)",
            }}>
                ■ REC — CAMELOT / shutfullslot
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════
// CUT 1: 起動 (0-5s = 0-150f)
// ════════════════════════════════════════════════════════

const bootLines = [
    { t: "> Initialize module: Antigravity", color: C.green, sf: 15 },
    { t: "> Bypass Model Limits............. [SUCCESS]", color: C.cyan, sf: 55 },
    { t: "> Execute Scribe_Mode.py", color: C.textBright, sf: 100 },
    { t: "> Loading knowledge base...", color: C.amber, sf: 128 },
];

const CUT1: React.FC = () => {
    const frame = useCurrentFrame();
    const flashOp = interpolate(frame, [120, 123, 128, 148], [0, 1, 0.4, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const fadeIn = easeOut(frame / 25);

    return (
        <AbsoluteFill style={{ background: C.bg, opacity: fadeIn }}>
            <CyberGrid frame={frame} speed={0.3} />
            <Scanlines />
            <DigitalNoise frame={frame} intensity={1} />

            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)", width: 980,
            }}>
                <div style={{
                    ...mono, fontSize: 14, color: C.cyanDim,
                    borderBottom: `1px solid ${C.dimMid}`,
                    paddingBottom: 8, marginBottom: 20,
                    display: "flex", justifyContent: "space-between",
                }}>
                    <span>╔══ CAMELOT TERMINAL v2.1.0 ══╗</span>
                    <span>[ sys@WATSON ~ ]</span>
                </div>

                {bootLines.map((l, i) => {
                    const len = typeLen(frame, l.sf, l.t);
                    if (frame < l.sf) return null;
                    return (
                        <div key={i} style={{
                            ...mono, fontSize: 26, lineHeight: 2.1,
                            color: l.color, textShadow: `0 0 12px ${l.color}80`,
                        }}>
                            {l.t.slice(0, len)}
                            {len < l.t.length && <Cursor />}
                        </div>
                    );
                })}
            </div>

            <HUDCorners frame={frame} />
            <GlowLine y={58} />
            <GlowLine y={1022} />

            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(160,220,255,0.98) 0%, rgba(80,160,240,0.8) 100%)",
                opacity: flashOp, pointerEvents: "none",
            }} />
        </AbsoluteFill>
    );
};

// ════════════════════════════════════════════════════════
// CUT 2: AVALON接続 (5-15s = 0-300f)
// ════════════════════════════════════════════════════════

const avalonLogs = [
    { t: "[AVALON] Connecting to Knowledge Vault...", c: C.cyan },
    { t: "[AVALON] Auth: noriyang0911 — PASS ✓", c: C.green },
    { t: "[AVALON] Fetching modules...", c: C.cyan },
    { t: "  ▸ 三幕構成.md ........................ [OK]", c: C.text },
    { t: "  ▸ セーブザキャット_ビートシート15.json . [OK]", c: C.text },
    { t: "  ▸ ダン・ハーモンのストーリーサークル ..... [OK]", c: C.text },
    { t: "  ▸ キャラクターアーク_マスターシート ...... [OK]", c: C.text },
    { t: "  ▸ note投稿フォーマット_v3.0.md .......... [OK]", c: C.text },
    { t: "  ▸ ScribeMode_Config.yaml ............... [OK]", c: C.text },
    { t: "[AVALON] Integrity check: 100% — No corruption", c: C.cyan },
    { t: "[SCRIBE] Model: Gemini 2.0 Flash / 128K ctx", c: C.purple },
    { t: "[SCRIBE] Style: noriyang — DevLog hardcore", c: C.purple },
    { t: "[SCRIBE] Forbidden keyword filter: ACTIVATED ⚠", c: C.amber },
    { t: "[SCRIBE] Output buffer: READY", c: C.green },
];

const CUT2: React.FC = () => {
    const frame = useCurrentFrame();
    const visibleLines = Math.min(avalonLogs.length, Math.floor(frame / 18) + 1);
    const pct = Math.min(100, (frame / 290) * 100);

    const nodes = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
        x: (i * 137.5 + 60) % 1920,
        y: (i * 97.3 + 90) % 1080,
        r: 2 + (i % 5),
        phase: i * 0.4,
    })), []);

    return (
        <AbsoluteFill style={{ background: C.bgDeep }}>
            <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
                <defs>
                    <filter id="glow2">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                {nodes.map((n, i) => {
                    const pulse = 0.15 + 0.1 * Math.sin(frame * 0.06 + n.phase);
                    const next = nodes[(i + 9) % nodes.length];
                    const dist = Math.hypot(next.x - n.x, next.y - n.y);
                    return (
                        <g key={i} filter="url(#glow2)">
                            <circle cx={n.x} cy={n.y} r={n.r} fill={C.cyan} opacity={pulse} />
                            {dist < 500 && <line x1={n.x} y1={n.y} x2={next.x} y2={next.y} stroke={C.cyan} strokeWidth={0.6} opacity={0.12} />}
                        </g>
                    );
                })}
            </svg>

            <Scanlines opacity={0.05} />
            <DigitalNoise frame={frame} intensity={0.5} />
            <CutFlash />

            <div style={{
                position: "absolute", top: 100, left: 100, right: 100, bottom: 100,
                background: "rgba(1,4,10,0.78)",
                border: `1px solid ${C.dimMid}`,
                borderRadius: 2, padding: "30px 44px",
            }}>
                <div style={{
                    ...mono, fontSize: 16, color: C.cyanDim,
                    borderBottom: `1px solid ${C.dimMid}`,
                    paddingBottom: 10, marginBottom: 18,
                    display: "flex", justifyContent: "space-between",
                }}>
                    <span>╔══ AVALON Knowledge Repository — Live Stream ══╗</span>
                    <span style={{ color: C.green }}>ENCRYPTED</span>
                </div>

                {avalonLogs.slice(0, visibleLines).map((l, i) => (
                    <div key={i} style={{
                        ...mono, fontSize: 21, lineHeight: 2.0, color: l.c,
                        opacity: i < visibleLines - 1 ? 0.8 : 1,
                        textShadow: i === visibleLines - 1 ? `0 0 8px ${l.c}60` : "none",
                    }}>
                        {l.t}
                    </div>
                ))}
                {visibleLines < avalonLogs.length && <Cursor />}
            </div>

            <div style={{ position: "absolute", bottom: 36, left: 100, right: 100 }}>
                <div style={{ ...mono, fontSize: 14, color: C.cyanDim, marginBottom: 6 }}>
                    [AVALON] Loading: {pct.toFixed(1)}%
                </div>
                <div style={{ height: 3, background: C.dim, borderRadius: 2 }}>
                    <div style={{
                        height: "100%", width: `${pct}%`,
                        background: `linear-gradient(90deg, ${C.cyan}, ${C.green})`,
                        boxShadow: `0 0 10px ${C.cyan}`,
                        borderRadius: 2,
                    }} />
                </div>
            </div>

            <HUDCorners frame={frame} />
            <GlowLine y={58} />
            <GlowLine y={1022} />
        </AbsoluteFill>
    );
};

// ════════════════════════════════════════════════════════
// CUT 3: AIフィルタリング (15-25s = 0-300f)
// ════════════════════════════════════════════════════════

type WordPair = { src: string; dst: string };
const FILTER_WORDS: WordPair[] = [
    { src: "ネオンの海", dst: "DATA_STREAM [0x4E]" },
    { src: "微かに潮の香り", dst: "NOISE_LVL: 0.3dB" },
    { src: "叙情", dst: "EMOTION_VAR±0" },
];

const TEXT_CHUNKS = [
    { t: "DevLog #007 | ドリルに", poem: false },
    { t: "ネオンの海", poem: true },
    { t: "の向こうで、キャメロットが起動した。\n\n本日の構築報告：LoopFlow v0.3 完成。\nシステムが記事を書く。\nScribeの出力を確認する——", poem: false },
    { t: "微かに潮の香り", poem: true },
    { t: "が混入。即時除去。\nフィルター処理中：", poem: false },
    { t: "叙情", poem: true },
    { t: " → 排除完了。\n\n効率：94.7%\nノイズ除去：完了\nシステムは動いている。それだけが事実だ。", poem: false },
];

function buildOutput(frame: number): React.ReactNode[] {
    const total = Math.floor(frame * 3.2);
    let count = 0;
    const result: React.ReactNode[] = [];

    for (let i = 0; i < TEXT_CHUNKS.length; i++) {
        const chunk = TEXT_CHUNKS[i];
        if (count >= total) break;
        const avail = Math.min(chunk.t.length, total - count);
        count += avail;

        if (chunk.poem && avail >= chunk.t.length) {
            const pair = FILTER_WORDS.find(w => w.src === chunk.t);
            result.push(
                <span key={i}>
                    <span style={{ color: C.red, textDecoration: "line-through", textShadow: `0 0 6px ${C.red}` }}>{chunk.t}</span>
                    <span style={{ color: C.amber, fontSize: "0.78em" }}> [REDACT → {pair?.dst ?? "???"}]</span>
                </span>
            );
        } else if (chunk.poem) {
            result.push(<span key={i} style={{ color: C.red, textShadow: `0 0 6px ${C.red}80` }}>{chunk.t.slice(0, avail)}</span>);
        } else {
            result.push(<span key={i} style={{ color: C.text }}>{chunk.t.slice(0, avail)}</span>);
        }
    }
    return result;
}

const CUT3: React.FC = () => {
    const frame = useCurrentFrame();
    const outputNodes = buildOutput(frame);
    const isGlitchFrame = frame > 55 && frame < 80;
    const glitchOffset = isGlitchFrame ? (noise(frame, 99) - 0.5) * 12 : 0;

    return (
        <AbsoluteFill style={{ background: C.bg }}>
            <CyberGrid frame={frame} speed={0.6} />
            <Scanlines />
            <DigitalNoise frame={frame} intensity={1.5} />
            <CutFlash />

            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                background: "rgba(0,8,20,0.96)",
                borderBottom: `1px solid ${C.dimMid}`,
                padding: "12px 40px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                ...mono, fontSize: 14,
            }}>
                <span style={{ color: C.cyanDim }}>[SCRIBE] AI Output Monitor — LIVE</span>
                <span style={{ color: C.red, textShadow: `0 0 8px ${C.red}` }}>⚠ FILTER ACTIVE — 叙情ブロッカー v2.0</span>
                <span style={{ color: C.cyanDim }}>Token: {Math.min(99999, frame * 311).toLocaleString()} / 128K</span>
            </div>

            <div style={{
                position: "absolute", top: 62, left: 60, right: 60, bottom: 60,
                background: "rgba(0,3,12,0.65)",
                border: `1px solid ${C.dimMid}`,
                borderRadius: 3, padding: "28px 40px",
                ...mono, fontSize: 23, lineHeight: 1.95, color: C.text,
                overflowY: "hidden", whiteSpace: "pre-wrap",
                transform: `translateX(${glitchOffset}px)`,
            }}>
                {outputNodes}
                <Cursor />
            </div>

            <HUDCorners frame={frame} />
            <GlowLine y={58} />
            <GlowLine y={1022} />
        </AbsoluteFill>
    );
};

// ════════════════════════════════════════════════════════
// CUT 4: 出力完了 (25-30s = 0-150f)
// ════════════════════════════════════════════════════════

const FINAL_LINES = [
    { t: "> Generation complete. [12,847 chars]", c: C.green, sf: 8 },
    { t: "> Paywall: inserted at line 26 ✓", c: C.cyan, sf: 38 },
    { t: "> Draft saved: note.com/noriyang0911", c: C.text, sf: 65 },
    { t: "> Status: DRAFT SAVED ✓", c: C.green, sf: 95 },
    { t: "> Awaiting next command..._", c: C.dimMid, sf: 128 },
];

const PREVIEW_TEXT = `DevLog #007 | ドリルに魂が宿るまで
────────────────────────────────
2026.02.21 — Project Camelot Build Log

本日時点、Camelot Systemが記録した実測値：
効率：94.7% | ノイズ：除去済み

════ このラインより先を有料にする ════

[FILTER] 感情変数は排除された。
データのみが語る。システムは動いている。`;

const CHARLOTTE_LINE = "「卿、出力完了です。熱いアールグレイでも淹れましょうか」";

const CUT4: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const previewSpring = spring({ frame: frame - 28, fps, config: { damping: 14, stiffness: 90 } });
    const charlotteLen = typeLen(frame, 90, CHARLOTTE_LINE, 1.6);

    return (
        <AbsoluteFill style={{ background: C.bg }}>
            <CyberGrid frame={frame} speed={0.2} />
            <Scanlines />
            <DigitalNoise frame={frame} intensity={0.8} />
            <CutFlash />

            <div style={{
                position: "absolute", top: "50%", left: 60,
                transform: "translateY(-50%)", width: 740,
            }}>
                {FINAL_LINES.map((l, i) => {
                    if (frame < l.sf) return null;
                    const len = typeLen(frame, l.sf, l.t);
                    return (
                        <div key={i} style={{
                            ...mono, fontSize: 22, lineHeight: 2.3,
                            color: l.c, textShadow: `0 0 10px ${l.c}70`,
                        }}>
                            {l.t.slice(0, len)}
                            {len < l.t.length && <Cursor />}
                        </div>
                    );
                })}

                {frame >= 88 && (
                    <div style={{
                        marginTop: 36, ...mono, fontSize: 19, color: C.amber,
                        borderLeft: `3px solid ${C.amber}`,
                        paddingLeft: 18, textShadow: `0 0 10px ${C.amber}60`,
                    }}>
                        <span style={{ color: C.cyanDim, fontSize: 14 }}>[CHARLOTTE / VOICE] </span>
                        <br />
                        {CHARLOTTE_LINE.slice(0, charlotteLen)}
                        {charlotteLen < CHARLOTTE_LINE.length && <Cursor />}
                    </div>
                )}
            </div>

            <div style={{
                position: "absolute", top: "50%", right: 50,
                transform: `translate(0, -50%) scale(${previewSpring})`,
                opacity: previewSpring, width: 680,
                background: "rgba(0,6,18,0.88)",
                border: `1px solid ${C.cyanDim}`,
                borderRadius: 5, padding: "26px 30px",
                boxShadow: `0 0 30px ${C.cyan}20, inset 0 0 40px rgba(0,20,60,0.5)`,
            }}>
                <div style={{
                    ...mono, fontSize: 12, color: C.cyanDim, marginBottom: 12,
                    borderBottom: `1px solid ${C.dimMid}`, paddingBottom: 8,
                    display: "flex", justifyContent: "space-between",
                }}>
                    <span>preview — note.com/noriyang0911</span>
                    <span style={{ color: C.amber }}>DRAFT</span>
                </div>
                {PREVIEW_TEXT.split("\n").map((line, i) => {
                    const isPaywall = line.includes("このラインより先を有料にする");
                    const isFilter = line.startsWith("[FILTER]");
                    const isSep = line.startsWith("────");
                    return (
                        <div key={i} style={{
                            ...mono, fontSize: 14.5, lineHeight: 1.9,
                            color: isPaywall ? "#000" : isFilter ? C.amber : isSep ? C.dimMid : C.text,
                            background: isPaywall ? C.white : "transparent",
                            padding: isPaywall ? "4px 10px" : "0",
                            textAlign: isPaywall ? "center" : "left",
                            fontWeight: isPaywall ? "bold" : "normal",
                            borderRadius: isPaywall ? 2 : 0,
                        }}>
                            {line || "\u00a0"}
                        </div>
                    );
                })}
            </div>

            <HUDCorners frame={frame} />
            <GlowLine y={58} />
            <GlowLine y={1022} />
        </AbsoluteFill>
    );
};

// ════════════════════════════════════════════════════════
// メインコンポーネント
// ════════════════════════════════════════════════════════

export const ScribeIncantation: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ background: C.bg }}>

            {/* ── 右下インセット動画（攻殻機動隊OP風グリッチ / 単一インスタンス） ── */}
            <div style={{
                position: "absolute", bottom: 48, right: 48,
                width: 540, height: 304, zIndex: 10, borderRadius: 3,
                boxShadow: "0 0 0 1px rgba(0,200,255,0.3), 0 0 30px rgba(0,150,255,0.15), 0 0 60px rgba(0,0,0,0.9)",
            }}>
                <GlitchVideo frame={frame} width={540} height={304} />
            </div>

            {/* ── BGM（動画とは別のWAVファイル） ── */}
            <Audio
                src={staticFile("music/shutfullslot.wav")}
                startFrom={0}
                volume={0.8}
            />

            {/* CUT 1: 起動 0-5s */}
            <Sequence from={0} durationInFrames={150}>
                <CUT1 />
            </Sequence>

            {/* CUT 2: AVALON接続 5-15s */}
            <Sequence from={150} durationInFrames={300}>
                <CUT2 />
            </Sequence>

            {/* CUT 3: フィルタリング 15-25s */}
            <Sequence from={450} durationInFrames={300}>
                <CUT3 />
            </Sequence>

            {/* CUT 4: 完了 25-30s */}
            <Sequence from={750} durationInFrames={150}>
                <CUT4 />
            </Sequence>
        </AbsoluteFill>
    );
};
