import { AbsoluteFill, useCurrentFrame, random, interpolate } from 'remotion';
import React, { useMemo } from 'react';

export const FeatherParticles: React.FC = () => {
    const frame = useCurrentFrame();

    // Generate feathers with depth (Z-index simulation)
    const feathers = useMemo(() => {
        return new Array(50).fill(0).map((_, i) => {
            const seed = i * 42.42;
            const depth = random(seed); // 0 (far) to 1 (near)

            return {
                x: random(seed + 1) * 100, // 0-100%
                delay: random(seed + 2) * 100,
                size: interpolate(depth, [0, 1], [10, 60]), // Near = Big, Far = Small
                rotationSpeed: (random(seed + 3) - 0.5) * 5,
                fallSpeed: interpolate(depth, [0, 1], [1, 6]), // Near = Fast
                blur: interpolate(depth, [0, 0.5, 1], [2, 0, 4]), // Far=Blur, Mid=Sharp, Near=Blur (DOF)
                opacity: interpolate(depth, [0, 1], [0.4, 0.9]),
                depth, // Store for sorting if needed (CSS z-index)
            };
        });
    }, []);

    return (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
            {feathers.map((f, i) => {
                const age = frame - f.delay;
                // Loop simulation: use module to recycle feathers if desired, or just long array
                // For now, let them fall once or loop simple position

                // Infinite falling logic
                // Screen height is approx 100vh. Let's map age to position wrapping
                const yPos = (age * f.fallSpeed) % 120 - 20; // -20% to 120%

                const rotation = age * f.rotationSpeed;
                const sway = Math.sin(age * 0.05) * (f.size / 2); // Bigger feathers sway more

                // Fade in/out at edges
                const edgeOpacity = interpolate(yPos, [-10, 10, 90, 110], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: `${f.x}%`,
                            top: `${yPos}%`,
                            transform: `translate(${sway}px, 0) rotate(${rotation}deg)`,
                            // Apply global opacity + edge fade
                            opacity: f.opacity * edgeOpacity,
                            width: f.size,
                            height: f.size * 2.5,
                            background: '#000', // Solid black silhouette
                            clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 85% 60%, 50% 100%, 15% 60%, 0% 35%, 20% 10%)',
                            filter: `blur(${f.blur}px)`, // Depth of Field
                            zIndex: Math.floor(f.depth * 10) + 10, // Layering
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};
