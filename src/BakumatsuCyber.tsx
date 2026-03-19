import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ObservationHUD } from './ObservationHUD';
import { TemporalGlitch } from './TemporalGlitch';

export const BakumatsuCyber: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#050507' }}>
            {/* Background Layer: AI generated Kyoto footage */}
            <AbsoluteFill>
                <img
                    src="/bakumatsu_bg.png"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.6) contrast(1.2)'
                    }}
                />
            </AbsoluteFill>

            {/* Glitch Layer */}
            <TemporalGlitch>
                <AbsoluteFill>
                    {/* Inner content that will glitch */}
                    {/* For now, just a placeholder image/texture could go here */}
                </AbsoluteFill>
            </TemporalGlitch>

            {/* HUD Layer (Always on top, unaffected by glitch or slightly synced) */}
            <ObservationHUD />
        </AbsoluteFill>
    );
};
