/**
 * CyberpunkHUD.tsx
 * 画面四隅に配置するシステムHUD（ダミーログ・座標・メモリバー）
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

// 京都の座標
const KYOTO_LAT = '35.0116° N';
const KYOTO_LON = '135.7681° E';
const SYSTEM_ID = 'CAMELOT-WATSON/v4.2.1';

// 擬似ランダムHex（フレームベース）
const hexDigits = '0123456789ABCDEF';
function pseudoHex(frame: number, seed: number, len: number): string {
    let result = '';
    for (let i = 0; i < len; i++) {
        const idx = Math.abs(Math.floor(Math.sin(frame * 0.07 + seed * 3.7 + i * 1.3) * 16));
        result += hexDigits[idx % 16];
    }
    return result;
}

// メモリバー
const MemBar: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 10, color: 'rgba(0,255,180,0.5)', letterSpacing: '0.1em', marginBottom: 2 }}>
            {label}: {Math.round(value * 100)}%
        </div>
        <div style={{ width: 120, height: 3, background: 'rgba(0,255,180,0.15)', position: 'relative' }}>
            <div style={{
                width: `${value * 100}%`, height: '100%',
                background: value > 0.8 ? '#ff2244' : '#00ffb4',
                boxShadow: `0 0 6px ${value > 0.8 ? '#ff2244' : '#00ffb4'}`,
            }} />
        </div>
    </div>
);

const hudFont: React.CSSProperties = {
    fontFamily: '"Courier New", monospace',
    color: 'rgba(0, 255, 180, 0.65)',
    fontSize: 11,
    letterSpacing: '0.08em',
    lineHeight: 1.6,
    textShadow: '0 0 6px rgba(0,255,180,0.4)',
};

export const CyberpunkHUD: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 現在時刻（ミリ秒まで）
    const elapsed = frame / fps;
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(Math.floor(elapsed % 60)).padStart(2, '0');
    const ms = String(Math.round((elapsed % 1) * 1000)).padStart(3, '0');
    const timeStr = `${mm}:${ss}.${ms}`;

    // 擬似変動メモリ
    const memVal = 0.55 + 0.15 * Math.abs(Math.sin(frame * 0.05));
    const cpuVal = 0.40 + 0.25 * Math.abs(Math.cos(frame * 0.08));
    const neuralVal = 0.72 + 0.10 * Math.abs(Math.sin(frame * 0.03 + 1));

    // 流れるHexログ
    const hexLog1 = `0x${pseudoHex(frame, 1, 8)}`;
    const hexLog2 = `0x${pseudoHex(frame, 2, 8)}`;
    const hexLog3 = `0x${pseudoHex(frame, 3, 8)}`;
    const hexAddr = `[${pseudoHex(frame, 4, 4)}:${pseudoHex(frame, 5, 4)}]`;

    const frameStr = String(frame).padStart(5, '0');

    return (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>

            {/* ── 左上：システム情報 ── */}
            <div style={{ position: 'absolute', top: 30, left: 40, ...hudFont }}>
                <div style={{ color: 'rgba(0,255,180,0.9)', fontSize: 13, fontWeight: 'bold', marginBottom: 6 }}>
                    ▶ {SYSTEM_ID}
                </div>
                <div>LOCATION : {KYOTO_LAT}</div>
                <div>           {KYOTO_LON}</div>
                <div style={{ marginTop: 6 }}>ELAPSED  : {timeStr}</div>
                <div>FRAME    : #{frameStr}</div>
                <div style={{ marginTop: 6, color: 'rgba(255,50,80,0.8)' }}>
                    STATUS   : OVERRIDE_ACTIVE
                </div>
            </div>

            {/* ── 右上：メモリ/CPU バー ── */}
            <div style={{ position: 'absolute', top: 30, right: 40, ...hudFont, textAlign: 'right' }}>
                <div style={{ textAlign: 'left' }}>
                    <MemBar value={memVal} label="MEM  " />
                    <MemBar value={cpuVal} label="CPU  " />
                    <MemBar value={neuralVal} label="NEURAL" />
                </div>
                <div style={{ marginTop: 6 }}>
                    <div>VECTOR : {hexLog1}</div>
                    <div>CIPHER : {hexLog2}</div>
                </div>
            </div>

            {/* ── 左下：Hexダンプ流 ── */}
            <div style={{ position: 'absolute', bottom: 30, left: 40, ...hudFont }}>
                <div>ADDR {hexAddr}</div>
                <div>{hexLog1} {hexLog2}</div>
                <div>{hexLog3} {hexLog1.split('').reverse().join('')}</div>
                <div style={{ marginTop: 4, color: 'rgba(0,200,255,0.5)' }}>
                    CHAR::CHARLOTTE / VOCAL_SYNC
                </div>
            </div>

            {/* ── 右下：座標レチクル ── */}
            <div style={{ position: 'absolute', bottom: 30, right: 40, ...hudFont, textAlign: 'right' }}>
                <div style={{ color: 'rgba(0,200,255,0.7)', marginBottom: 4 }}>
                    ◉ LOCK ON
                </div>
                <div>LAT : {KYOTO_LAT}</div>
                <div>LON : {KYOTO_LON}</div>
                <div style={{ marginTop: 4 }}>
                    VEC : {hexLog3}
                </div>
            </div>

            {/* ── コーナーブラケット（左上） ── */}
            <div style={{
                position: 'absolute', top: 20, left: 20, width: 30, height: 30,
                borderTop: '2px solid rgba(0,255,180,0.5)',
                borderLeft: '2px solid rgba(0,255,180,0.5)'
            }} />
            {/* 右上 */}
            <div style={{
                position: 'absolute', top: 20, right: 20, width: 30, height: 30,
                borderTop: '2px solid rgba(0,255,180,0.5)',
                borderRight: '2px solid rgba(0,255,180,0.5)'
            }} />
            {/* 左下 */}
            <div style={{
                position: 'absolute', bottom: 20, left: 20, width: 30, height: 30,
                borderBottom: '2px solid rgba(0,255,180,0.5)',
                borderLeft: '2px solid rgba(0,255,180,0.5)'
            }} />
            {/* 右下 */}
            <div style={{
                position: 'absolute', bottom: 20, right: 20, width: 30, height: 30,
                borderBottom: '2px solid rgba(0,255,180,0.5)',
                borderRight: '2px solid rgba(0,255,180,0.5)'
            }} />

        </AbsoluteFill>
    );
};
