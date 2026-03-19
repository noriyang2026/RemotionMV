import { AbsoluteFill } from 'remotion';
import { SystemUI } from './SystemUI';
import { Scanlines } from './Scanlines';
import { ProgressBar } from './ProgressBar';
import { AudioVisualizer } from './AudioVisualizer';
import { Lyrics } from './Lyrics';

// Import JSON directly for static rendering (reliable for MP4 generation)
import briefingData from '../public/briefing_data.json';

export const Briefing: React.FC = () => {
    // For now we use the imported data directly.
    const data = briefingData;

    // Extract date/time for ERA, assume LOCATION is fixed or from another source
    // data.date format: "2026年02月16日 (月) 08:30"
    const era = data.date ? data.date.split(' ')[0] : 'UNKNOWN ERA';
    const location = "SENDAI"; // Hardcoded for now as requested

    // Default project status if missing in JSON
    // @ts-ignore
    const projectStatus = data.project_status || 42;

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* Audio & Visualization */}
            <AudioVisualizer />

            {/* Background Layers */}
            <Scanlines />

            {/* Lyrics Layer (Top Z) */}
            <Lyrics />

            {/* Main UI */}
            <SystemUI location={location} era={era} />

            {/* Task list display with refined styles */}
            <div style={{
                position: 'absolute',
                top: 400, // Moved down to avoid overlapping with large headers
                left: 100, // Aligned with SystemUI
                width: 1700, // Constraint width for wrapping
                color: 'white',
                fontFamily: '"Courier New", Courier, monospace',
                whiteSpace: 'pre-wrap',
                opacity: 0.9, // Increased opacity
                fontSize: 50, // USER REQUEST: 40px-50px
                fontWeight: 'bold', // USER REQUEST: Bold for Japanese
                lineHeight: 1.6, // USER REQUEST: Wider line height
                wordBreak: 'break-all', // USER REQUEST: Prevent overflow
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)' // Added shadow for contrast
            }}>
                <h3 style={{ color: '#00ffff', fontSize: 60, marginBottom: 20 }}>最優先任務:</h3>
                {data.top_3_tasks && data.top_3_tasks.map((t: any, i: number) => (
                    <div key={i} style={{ marginBottom: 30 }}>
                        <span style={{ color: '#ffff00' }}>{i + 1}. {t.title}</span><br />
                        <span style={{ fontSize: 40, color: '#dddddd' }}>{t.detail}</span>
                    </div>
                ))}
            </div>

            {/* Interactive Elements */}
            <ProgressBar progress={projectStatus} label="現在の進捗状況 [RECORD BREAKERS]" />

        </AbsoluteFill>
    );
};
