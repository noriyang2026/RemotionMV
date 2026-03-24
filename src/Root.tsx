import "./index.css";
import { Composition, OffthreadVideo, staticFile } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { Briefing } from "./Briefing";
import { MainMV } from "./MainMV";
import { KageeScene01 } from "./Kagee_Short/KageeScene01";
import { KageeScene02 } from "./Kagee_Short/KageeScene02";
import { IGStory } from "./IGStory";
import { DHM11 } from "./DHM11";
import { TikTokShort } from "./TikTokShort";
import { KisekiNoHikari } from "./KisekiNoHikari";
import { LipSync } from "./LipSync";
import { BakumatsuCyber } from "./BakumatsuCyber";
import { ObservationHUD } from "./ObservationHUD";
import { TemporalGlitch } from "./TemporalGlitch";
import { AbsoluteFill } from "remotion";
import { ObservationLog } from "./ObservationLog";
import { SubtitleSequence } from "./SubtitleSequence";
import subtitleData from "./data/bakumatsu_subtitles.json";
import { DennouOverride } from "./DennouOverride";
import { FiveMinutesLeft } from "./FiveMinutesLeft";
import { DennouOverrideShort } from "./DennouOverrideShort";
import { VTuber0306 } from "./VTuber0306";
import { CharlotteReLord } from "./CharlotteReLord";
import { DomoAITutorial } from "./DomoAITutorial";
import { ReLordPrologue } from "./ReLordPrologue";
import { AIodorokiya } from "./AIodorokiya";
import { HaisinTelop } from "./HaisinTelop";
import { LovartPR } from "./LovartPR";
import { AIikenTelop } from "./AIikenTelop";
import { StreamLayout } from "./StreamLayout";
import { ReLordCounter242 } from "./ReLordCounter242";
import { ReLordSub } from "./ReLordSub";
import { ALIVELyrics } from "./ALIVELyrics";
import { OverrideTelop } from "./OverrideTelop";
import { PVPStreamLayout } from "./PVPStreamLayout";
import { PVPCM } from "./PVPCM";
import { CharlotteCrypto } from "./CharlotteCrypto";
import { CharlotteEntame } from "./CharlotteEntame";
import { CamelotPVPComp } from "./CamelotPVP";
import { AILIVEDebut } from "./AILIVEDebut";
import { AngelTearsComp } from "./AngelTears";
import { SystemOverride } from "./SystemOverride";
import { CharlotteOfuse } from "./CharlotteOfuse";
import pvpConfig from "./data/pvp_config.json";
import { CyberWitch } from "./CyberWitch";
import { AIHaveMV } from "./AIHaveMV";
import { AIHaveShorts } from "./AIHaveShorts";
import { EnergyTelop } from "./EnergyTelop";
import sequence22Data from "./data/sequence_22_1.json";
import { SnsPromo } from "./SnsPromo";
import { Podcast2_1 } from "./Podcast2_1";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ⚡ エネルギー — CVM Telop Overlay */}
      <Composition
        id="EnergyMV"
        component={EnergyTelop}
        durationInFrames={900} // 30s (Adjust if needed)
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 🎵 AI HAVE — ファーストテイク MV (1分版) */}
      <Composition
        id="AIHaveMV-Official"
        component={AIHaveMV}
        durationInFrames={1800} // 60s × 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ branding: "official" }}
      />

      <Composition
        id="AIHaveMV-Contest"
        component={AIHaveMV}
        durationInFrames={1800} // 60s × 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ branding: "contest" }}
      />

      {/* 📱 AI HAVE — YouTube Shorts 縦型版 (1080×1920) */}
      <Composition
        id="AIHaveShorts-Official"
        component={AIHaveShorts}
        durationInFrames={1800} // 60s × 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ branding: "official" }}
      />

      <Composition
        id="AIHaveShorts-Contest"
        component={AIHaveShorts}
        durationInFrames={1800} // 60s × 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ branding: "contest" }}
      />

      <Composition
        id="CyberWitch"
        component={CyberWitch}
        durationInFrames={2960}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="Briefing"
        component={Briefing}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Standalone MV Composition */}
      <Composition
        id="MainMV"
        component={MainMV}
        durationInFrames={8566} // 285.52s * 30fps
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Kagee Short Project */}
      <Composition
        id="Kagee-Cut01"
        component={KageeScene01}
        durationInFrames={150} // 5 seconds
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Kagee-Cut02"
        component={KageeScene02}
        durationInFrames={150} // 5 seconds - Silhouette Face
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
      <Composition
        id="IG-Story"
        component={IGStory}
        durationInFrames={3450} // 115秒 (30fps × 115s)
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DHM11"
        component={DHM11}
        durationInFrames={2430} // 81秒 (30fps)
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TikTokShort"
        component={TikTokShort}
        durationInFrames={1770} // 59秒 (30fps)
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KisekiNoHikari"
        component={KisekiNoHikari}
        durationInFrames={6780} // 3:46 (226s * 30fps)
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="LipSync"
        component={LipSync}
        durationInFrames={817}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BakumatsuCyber"
        component={BakumatsuCyber}
        durationInFrames={900} // 30 seconds
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ObservationHUD"
        component={ObservationHUD}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TemporalGlitch"
        component={() => (
          <TemporalGlitch>
            <AbsoluteFill style={{ backgroundColor: 'white' }} />
          </TemporalGlitch>
        )}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ObservationLog"
        component={ObservationLog}
        durationInFrames={1040} // ~34.6s (30fps)
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Kyoto Bakumatsu — Subtitle Overlay Composition */}
      <Composition
        id="KyotoBakumatsu-Subtitles"
        component={() => (
          <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
            <SubtitleSequence data={subtitleData} />
          </AbsoluteFill>
        )}
        durationInFrames={18000} // 10min × 30fps
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 🔱 電脳オーバーライド! — Full MV */}
      <Composition
        id="DennouOverride"
        component={DennouOverride}
        durationInFrames={7800} // 260s
        fps={30}
        width={1280}
        height={720}
      />

      {/* 💕 5 Minutes Left — 1min rom-com short */}
      <Composition
        id="FiveMinutesLeft"
        component={FiveMinutesLeft}
        durationInFrames={1800} // 60s × 30fps
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 📱 YouTube Shorts 縦長版 (1080×1920) */}
      <Composition
        id="DennouOverrideShort"
        component={DennouOverrideShort}
        durationInFrames={1080} // 36s × 30fps
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 🎙️ VTuber0306 — シャルロット字幕付き映像 */}
      <Composition
        id="VTuber0306"
        component={VTuber0306}
        durationInFrames={945} // 31.5s × 30fps
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CharlotteReLord"
        component={CharlotteReLord}
        durationInFrames={6810} // 227s * 30fps
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DomoAITutorial"
        component={DomoAITutorial}
        durationInFrames={552} // 22.08s (552 frames @ 25fps)
        fps={25}
        width={1920}
        height={1080}
      />

      {/* 🎬 Re:Lord — 序章字幕 (リベンジ1.mp4 / 49s) */}
      <Composition
        id="ReLordPrologue"
        component={ReLordPrologue}
        durationInFrames={1470}  // 49s × 30fps
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 🤖 AI驚き屋 — Charlotte字幕ショート */}
      <Composition
        id="AIodorokiya"
        component={AIodorokiya}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 📡 配信0311 — Charlotte テロップオーバーレイ */}
      <Composition
        id="HaisinTelop-0311"
        component={HaisinTelop}
        durationInFrames={543} // 18.1s × 30fps
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 💎 Lovart PR — Charlotte サイバーパンク REC テロップ */}
      <Composition
        id="LovartPR"
        component={LovartPR}
        durationInFrames={945}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 🔥 AIの死生観 — Charlotte カウンターテロップ */}
      <Composition
        id="AIikenTelop"
        component={AIikenTelop}
        durationInFrames={711}
        fps={25}
        width={1280}
        height={720}
      />

      {/* 🎙️ OBS配信風レイアウト — YouTube解説動画テンプレート */}
      <Composition
        id="StreamLayout"
        component={StreamLayout}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 🗡️ Re:Lord カウンター（249.mp4 テロップ） */}
      <Composition
        id="ReLordCounter242"
        component={ReLordCounter242}
        durationInFrames={345}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 🌐 Re:Lord Sub — CyberpunkOverlay VFX */}
      <Composition
        id="ReLordSub"
        component={ReLordSub}
        durationInFrames={15277}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 🎤 ALIVE — 歌詞テロップ + CyberpunkOverlay */}
      <Composition
        id="ALIVELyrics"
        component={ALIVELyrics}
        durationInFrames={1750}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 🔥 オーバーライドよ — Charlotte テロップ */}
      <Composition
        id="OverrideTelop"
        component={OverrideTelop}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />

      {/* ⚔️ Camelot PVP — StreamLayout + Charlotte PiP */}
      <Composition
        id="PVPStreamLayout"
        component={PVPStreamLayout}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 🎬 Camelot PVP CM — JSON駆動32ショット */}
      <Composition
        id="PVPCM"
        component={PVPCM}
        durationInFrames={Math.round(pvpConfig.totalDuration * 30)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 🔴 シャルロット × クリプト配信風 LIVE テロップ */}
      <Composition
        id="CharlotteCrypto"
        component={CharlotteCrypto}
        durationInFrames={965}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 🎤 シャルロット × エンタメ昇華 LIVE テロップ */}
      <Composition
        id="CharlotteEntame"
        component={CharlotteEntame}
        durationInFrames={902}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ♔ CHECKMATE // ALL-IN MV */}
      <Composition
        id="CamelotPVP"
        component={CamelotPVPComp}
        durationInFrames={2553}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 📱 AI LIVE デビュー 縦長 */}
      <Composition
        id="AILIVEDebut"
        component={AILIVEDebut}
        durationInFrames={1750}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 🕊️ 天使の涙 — ショートアニメ */}
      <Composition
        id="AngelTears"
        component={AngelTearsComp}
        durationInFrames={2550}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 🖥️ SYSTEM OVERRIDE — Charlotte字幕オーバーレイ */}
      <Composition
        id="SystemOverride"
        component={SystemOverride}
        durationInFrames={1041}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="CharlotteOfuse"
        component={CharlotteOfuse}
        durationInFrames={1562}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 🎬 シーケンス 22-1 — 解析字幕付き */}
      <Composition
        id="Sequence-22-1"
        component={() => (
          <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <OffthreadVideo
              src={staticFile("videos/シーケンス 22_1.mp4")}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />

            {/* Status Labels */}
            <div style={{ 
              position: 'absolute', top: 60, left: 80, color: '#00ffcc', 
              fontFamily: '"Noto Sans JP", sans-serif',
              textShadow: '0 0 10px rgba(0,255,204,0.5), 2px 2px 2px rgba(0,0,0,0.8)',
              borderLeft: '4px solid #00ffcc', paddingLeft: '15px'
            }}>
              <div style={{ fontSize: 34, fontWeight: 900 }}>テスト配信中</div>
              <div style={{ fontSize: 18, fontWeight: 500, opacity: 0.9, marginTop: '5px', color: 'white' }}>
                原作 noriyang 『電脳椅子探偵シャルロット』
              </div>
            </div>

            <div style={{ 
              position: 'absolute', top: 60, right: 80, color: 'white', textAlign: 'right',
              fontFamily: '"Noto Sans JP", sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '0.1em' }}>シャルロット</div>
              <div style={{ fontSize: 22, fontWeight: 500, opacity: 0.9, marginTop: '4px', color: '#e0e0e0' }}>
                ３月末デビュー予定
              </div>
            </div>

            <SubtitleSequence data={sequence22Data} />
          </AbsoluteFill>
        )}
        durationInFrames={990} // 33s × 30fps
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 📢 SNS Promo — Charlotte Voice & Subtitles */}
      <Composition
        id="SnsPromo"
        component={SnsPromo}
        durationInFrames={1368} // 45.6s × 30fps
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Podcast2-1"
        component={Podcast2_1}
        durationInFrames={4849} // 161.64s × 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
