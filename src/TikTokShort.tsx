import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    Audio,
    Img,
    Video,
    staticFile,
    Sequence,
    random,
    Easing,
} from "remotion";
import tiktokDataRaw from "./data/tiktok_script.json";

interface Subtitle {
    from: number;
    to: number;
    text: string;
}

interface Beat {
    beat: string;
    script: string;
    visual: string;
    image_prompt: string;
}

interface TikTokData {
    title: string;
    theme: string;
    preset: string;
    music_file: string;
    hashtags: string[];
    beats: Beat[];
    subtitles: Subtitle[];
    generated_at: string;
    video_scenes?: number[];
}

const data = tiktokDataRaw as TikTokData;

// ─── VFX Components ───────────────────────────────────

function GlitchOverlay() {
    const frame = useCurrentFrame();
    const noise = random(frame) > 0.96 ? 0.3 : 0;
    const flicker = random(frame + 1) > 0.98 ? 0.1 : 0;

    if (noise === 0 && flicker === 0) return null;

    return (
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'white',
                opacity: flicker,
                mixBlendMode: 'overlay'
            }} />
            <div style={{
                position: 'absolute',
                top: `${random(frame + 2) * 100}%`,
                left: 0,
                width: '100%',
                height: `${random(frame + 3) * 4}px`,
                backgroundColor: 'rgba(0, 255, 255, 0.4)',
                mixBlendMode: 'screen',
            }} />
        </AbsoluteFill>
    );
}

// ─── Video Background Component ──────────────────────
function VideoBackground({ src }: { src: string }) {
    return (
        <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#020208" }}>
            <Video
                src={src}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.7) contrast(1.1)",
                }}
                muted
                loop
                onError={(e) => console.error(`Failed to load video: ${src}`, e)}
            />
            {/* Cinematic Vignette */}
            <AbsoluteFill style={{
                background: "radial-gradient(circle, transparent 30%, rgba(0,0,0,0.6) 100%)",
                boxShadow: "inset 0 0 100px rgba(0,0,0,0.8)"
            }} />
        </AbsoluteFill>
    );
}

// ─── Ken Burns Image Component ───────────────────────
function KenBurnsImage({ src, index }: { src: string; index: number }) {
    const frame = useCurrentFrame();

    // Smooth zoom per scene
    const scale = interpolate(frame, [0, 400], [1, 1.15], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
    });

    // Slow cinematic pan
    const transX = interpolate(frame, [0, 400], [index % 2 === 0 ? -20 : 20, 0]);
    const transY = interpolate(frame, [0, 400], [index % 2 === 0 ? 0 : -10, 5]);

    return (
        <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#020208" }}>
            <Img
                src={src}
                style={{
                    width: "110%", // Oversize for pan/shake
                    height: "110%",
                    left: "-5%",
                    top: "-5%",
                    objectFit: "cover",
                    transform: `scale(${scale}) translate(${transX}px, ${transY}px)`,
                    filter: "brightness(0.7) contrast(1.15) saturate(1.1)",
                }}
                onError={(e) => console.error(`Failed to load image: ${src}`, e)}
            />
            <AbsoluteFill style={{
                background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.7) 100%)",
            }} />
        </AbsoluteFill>
    );
}

// ─── Subtitle Component ───────────────────────────────
function SubtitleLayer({ subtitles }: { subtitles: Subtitle[] }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentSecond = frame / fps;

    const current = subtitles.find(
        (s) => currentSecond >= s.from && currentSecond < s.to
    );

    if (!current) return null;

    const elapsed = currentSecond - current.from;
    const duration = current.to - current.from;

    // Enhanced animations
    const entryProgress = interpolate(elapsed, [0, 0.25], [0, 1], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.back(1.5)),
    });

    const exitProgress = interpolate(elapsed, [duration - 0.25, duration], [1, 0], {
        extrapolateLeft: "clamp",
        easing: Easing.in(Easing.quad),
    });

    const opacity = Math.min(entryProgress, exitProgress);
    const scale = 0.95 + (entryProgress * 0.05);
    const blur = (1 - entryProgress) * 10;

    return (
        <div
            style={{
                position: "absolute",
                bottom: 240,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                padding: "0 40px",
                opacity,
                filter: `blur(${blur}px)`,
                transform: `scale(${scale}) translateY(${(1 - entryProgress) * 20}px)`,
                zIndex: 1000,
            }}
        >
            <div style={{
                position: 'relative',
                display: 'inline-block',
                background: "rgba(0,0,10,0.85)",
                padding: "20px 40px",
                backdropFilter: "blur(16px)",
                border: "2px solid rgba(0, 243, 255, 0.4)",
                boxShadow: "0 0 30px rgba(0, 243, 255, 0.2), inset 0 0 20px rgba(0, 243, 255, 0.1)",
                transform: "skewX(-5deg)",
            }}>
                {/* Cyber Corner Decals */}
                <div style={{ position: 'absolute', top: -5, left: -5, width: 15, height: 15, borderTop: '3px solid #00f3ff', borderLeft: '3px solid #00f3ff' }} />
                <div style={{ position: 'absolute', bottom: -5, right: -5, width: 15, height: 15, borderBottom: '3px solid #00f3ff', borderRight: '3px solid #00f3ff' }} />

                <span
                    style={{
                        fontFamily: "'Exo 2', sans-serif",
                        fontSize: 64,
                        fontWeight: 900,
                        color: "#fff",
                        textShadow: "0 0 15px rgba(0, 243, 255, 0.8)",
                        letterSpacing: "0.05em",
                        lineHeight: 1.1,
                        display: "block",
                        transform: "skewX(5deg)", // Counter-skew text
                    }}
                >
                    {current.text}
                </span>
            </div>
        </div>
    );
}

// ─── Header Badge ─────────────────────────────────────
function HeaderBadge() {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

    return (
        <div
            style={{
                position: "absolute",
                top: 80,
                left: 60,
                opacity,
                zIndex: 500,
            }}
        >
            <div style={{ borderLeft: "4px solid #00f3ff", paddingLeft: 12 }}>
                <div style={{ fontSize: 14, color: "#00f3ff", fontWeight: "bold", fontFamily: "monospace", letterSpacing: 4 }}>
                    MISSION ID: {data.generated_at.split('T')[0].replace(/-/g, '')}
                </div>
                <div style={{ fontSize: 28, color: "white", fontWeight: "900", fontFamily: "'Exo 2'", textTransform: "uppercase", marginTop: 8 }}>
                    {data.title}
                </div>
            </div>
        </div>
    );
}

// ─── HUD Datastream ───────────────────────────────────
function Datastream() {
    const frame = useCurrentFrame();
    const scroll = (frame * 2) % 400;

    return (
        <div style={{
            position: 'absolute',
            right: 40,
            top: 250,
            width: 150,
            height: 300,
            fontFamily: 'monospace',
            fontSize: 10,
            color: 'rgba(0, 243, 255, 0.3)',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 100
        }}>
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} style={{ transform: `translateY(-${scroll}px)` }}>
                    {Math.random().toString(36).substring(7).toUpperCase()} 0x{Math.floor(Math.random() * 255).toString(16)}
                </div>
            ))}
        </div>
    );
}

// ─── Main TikTok Composition ──────────────────────────
export const TikTokShort: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // ─── Global Shakes ──────────────────────────────────
    // Idle Breath
    const idleX = Math.sin(frame / 15) * 1.5;
    const idleY = Math.cos(frame / 20) * 1.5;

    // Transition Impact
    const isImpact = data.subtitles.some(s => {
        const entryFrame = s.from * fps;
        return frame >= entryFrame && frame < entryFrame + 8;
    });
    const impactAmt = isImpact ? (random(frame) - 0.5) * 20 : 0;

    // Timing logic for 4 static scenes
    const timings = [
        { start: 0, duration: 5 * fps },
        { start: 5 * fps, duration: 35 * fps },
        { start: 40 * fps, duration: 15 * fps },
        { start: 55 * fps, duration: 4.9 * fps },
    ];

    return (
        <AbsoluteFill style={{
            backgroundColor: "#000",
            overflow: "hidden",
            transform: `translate(${idleX + impactAmt}px, ${idleY + impactAmt}px) scale(1.02)`
        }}>
            {/* Audio Layer */}
            <Audio
                src={staticFile(`music/${data.music_file}`)}
                volume={0.8}
                onError={(e) => console.error(`Audio failed to load: ${data.music_file}`, e)}
            />

            {/* Background Layer */}
            {timings.map((t, i) => {
                // Determine if we have a video file for this scene from the generated JSON
                const useVideo = data.video_scenes?.includes(i);

                return (
                    <Sequence key={i} from={t.start} durationInFrames={t.duration}>
                        {useVideo ? (
                            <VideoBackground src={staticFile(`videos/scene_${i}.mp4`)} />
                        ) : (
                            <KenBurnsImage
                                src={staticFile(`images/scene_${i}.png`)}
                                index={i}
                            />
                        )}
                    </Sequence>
                );
            })}

            {/* VFX Base Layers */}
            <AbsoluteFill style={{
                boxShadow: "inset 0 0 300px rgba(0,0,0,0.9)",
                pointerEvents: "none",
                zIndex: 10
            }} />

            <GlitchOverlay />

            <AbsoluteFill style={{
                backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.08) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.01), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.01))",
                backgroundSize: "100% 4px, 3px 100%",
                pointerEvents: "none",
                mixBlendMode: "overlay",
                opacity: 0.5,
                zIndex: 150
            }} />

            {/* UI Layers */}
            <HeaderBadge />
            <Datastream />
            <SubtitleLayer subtitles={data.subtitles} />

            {/* Progress Bar (Mission Load) */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: 4,
                width: `${(frame / (60 * fps)) * 100}%`,
                background: 'linear-gradient(90deg, #00f3ff, #ff00ff)',
                boxShadow: '0 0 10px #00f3ff',
                zIndex: 600
            }} />

            {/* Footer */}
            <div style={{
                position: "absolute",
                bottom: 80,
                left: 60,
                fontSize: 22,
                color: "rgba(0, 243, 255, 0.6)",
                fontFamily: "monospace",
                letterSpacing: "0.4em",
                zIndex: 50,
                textTransform: "uppercase"
            }}>
                {data.hashtags.join(" / ")}
            </div>

            {/* Grain Texture */}
            <AbsoluteFill style={{
                backgroundImage: `url(${staticFile('noise.png')})`,
                opacity: 0.03,
                pointerEvents: "none",
                zIndex: 200
            }} />
        </AbsoluteFill>
    );
};
