/**
 * ReLordSub.tsx
 * ── Re:Lord 字幕付き動画 + CyberpunkOverlay ──
 *
 * ReLord_Sub.mp4（8:29）にサイバーパンクVFXを適用。
 *
 * 構成:
 *   00:00 - 00:34     通常（VFXなし）
 *   00:34 - 03:58:27  電脳サイバー感強め（past / デジタルノイズ）
 *   03:58:27 - 04:08:13  通常に戻る
 *   04:08:13 - 08:29  電脳サイバー感（present / 四隅デジタルHUD）
 */
import React from 'react';
import {
  AbsoluteFill,
  Video,
  staticFile,
  Sequence,
} from 'remotion';
import { CyberpunkOverlay } from './components/CyberpunkOverlay';

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
/** MM:SS:FF → frames */
const tc = (m: number, s: number, fr: number) => (m * 60 + s) * FPS + fr;

// ── タイムコード ──
const CYBER1_START = f(34);                 // 00:34:00
const CYBER1_END   = tc(3, 58, 27);        // 03:58:27
const PLAIN2_END   = tc(4, 8, 13);         // 04:08:13
const TOTAL_FRAMES = f(509);               // 8:29

// ── グリッチ ──
// Song1（過去編）サビタイミング
const SONG1_GLITCH = [f(58), f(88), f(100), f(128), f(155), f(180), f(210)];
// Song2（電脳オーバーライド）サビタイミング
const SONG2_GLITCH = [f(280), f(310), f(340), f(370), f(400), f(430), f(460), f(490)];

export const ReLordSub: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>

      {/* ── Phase 1: 通常 (0:00 - 0:34) ── VFXなし */}
      <Sequence from={0} durationInFrames={CYBER1_START}>
        <Video
          src={staticFile('videos/ReLord_Sub.mp4')}
          startFrom={0}
        />
      </Sequence>

      {/* ── Phase 2: 電脳サイバー (0:34 - 3:58:27) ── past / 強め */}
      <Sequence from={CYBER1_START} durationInFrames={CYBER1_END - CYBER1_START}>
        <CyberpunkOverlay
          phase="past"
          intensity={0.65}
          glitchFrames={SONG1_GLITCH.map(g => g - CYBER1_START)}
          glitchDuration={8}
        >
          <Video
            src={staticFile('videos/ReLord_Sub.mp4')}
            startFrom={CYBER1_START}
          />
        </CyberpunkOverlay>
      </Sequence>

      {/* ── Phase 3: 通常 (3:58:27 - 4:08:13) ── VFXなし */}
      <Sequence from={CYBER1_END} durationInFrames={PLAIN2_END - CYBER1_END}>
        <Video
          src={staticFile('videos/ReLord_Sub.mp4')}
          startFrom={CYBER1_END}
        />
      </Sequence>

      {/* ── Phase 4: 電脳サイバー + 四隅HUD (4:08:13 - END) ── present / バチバチ */}
      <Sequence from={PLAIN2_END} durationInFrames={TOTAL_FRAMES - PLAIN2_END}>
        <CyberpunkOverlay
          phase="present"
          intensity={0.7}
          glitchFrames={SONG2_GLITCH.map(g => g - PLAIN2_END)}
          glitchDuration={6}
          showCornerHUD
        >
          <Video
            src={staticFile('videos/ReLord_Sub.mp4')}
            startFrom={PLAIN2_END}
          />
        </CyberpunkOverlay>
      </Sequence>

    </AbsoluteFill>
  );
};
