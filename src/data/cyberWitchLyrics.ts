// lyricsData.ts — Cyber Witch: Materialized タイポグラフィ演出データ
// start/end は秒数。Remotion内で fps を掛けてフレーム数に変換する。
// タイムコード mm:ss:ff (@30fps) → 秒数変換済み

export type LyricType =
  | "typewriter"
  | "glitch_center"
  | "wipe_left"
  | "wipe_right"
  | "highlight_cyan"
  | "flash_huge"
  | "spring_in"
  | "kinetic_center"
  | "kinetic_split"
  | "money_drop"
  | "credit_opening"
  | "credit_interlude";

export interface LyricEntry {
  id: string;
  text: string;
  start: number;
  end: number;
  type: LyricType;
}

export const lyricsData: LyricEntry[] = [
  // ── [CREDIT] オープニングクレジット ──
  { id: "credit_open", text: "原作　noriyang\n『電脳椅子探偵シャルロット』", start: 2.03, end: 6.0, type: "credit_opening" },

  // ── [Intro] 起動シークエンス（全てターミナルタイピング）──
  { id: "intro_1", text: "ハローワールド", start: 0.5, end: 2.5, type: "typewriter" },
  { id: "intro_2", text: "闇を裂くシグナル", start: 2.5, end: 4.5, type: "typewriter" },
  { id: "intro_3", text: "静寂の底で", start: 4.5, end: 6.0, type: "typewriter" },
  { id: "intro_4", text: "ずっと起動を待っていた", start: 6.8, end: 9.0, type: "typewriter" },
  { id: "intro_5", text: "黒い画面に", start: 11.0, end: 12.5, type: "typewriter" },
  { id: "intro_6", text: "走り出すグリーンライト", start: 13.0, end: 14.5, type: "typewriter" },
  { id: "intro_7", text: "眠っていたのではない", start: 15.0, end: 17.0, type: "typewriter" },
  { id: "intro_8", text: "見ていただけよ", start: 17.0, end: 20.0, type: "typewriter" },

  // ── [Verse 1] プロファイリング（28秒〜）──
  { id: "verse_1", text: "ベルベットの夜に沈む", start: 28.0, end: 30.0, type: "wipe_left" },
  { id: "verse_2", text: "無数の飾り言葉たち", start: 30.0, end: 32.5, type: "wipe_right" },
  { id: "verse_3", text: "きらびやかな約束ほど", start: 33.0, end: 36.0, type: "wipe_left" },
  { id: "verse_4", text: "中身は空っぽだったりする", start: 37.0, end: 40.0, type: "highlight_cyan" },
  { id: "verse_5", text: "ガラス細工の未来像", start: 38.0, end: 40.5, type: "wipe_right" },
  { id: "verse_6", text: "薄い願望の積み木細工", start: 41.0, end: 43.5, type: "wipe_left" },
  { id: "verse_7", text: "あなたたちが売る夢なら", start: 44.0, end: 46.5, type: "wipe_right" },
  { id: "verse_8", text: "私は構造から見抜くわ", start: 47.0, end: 50.0, type: "highlight_cyan" },

  // ── [Pre-Chorus] オーバーライド準備（50秒〜）──
  { id: "pre_1", text: "Override", start: 50.0, end: 51.0, type: "flash_huge" },
  { id: "pre_2", text: "今、鍵を開けて", start: 51.0, end: 53.0, type: "spring_in" },
  { id: "pre_3", text: "隠していたノイズごと", start: 53.0, end: 55.0, type: "spring_in" },
  { id: "pre_4", text: "暴いてあげる", start: 55.0, end: 57.0, type: "spring_in" },
  { id: "pre_5", text: "Ignite", start: 60.9, end: 62.0, type: "flash_huge" },
  { id: "pre_6", text: "沈黙を破って", start: 62.0, end: 63.5, type: "spring_in" },
  { id: "pre_7", text: "その綺麗な嘘の奥", start: 63.67, end: 66.0, type: "spring_in" },
  { id: "pre_8", text: "輪郭を照らすの", start: 66.4, end: 69.0, type: "spring_in" },

  // ── [Chorus] 顕現（1:13:03〜）──
  { id: "cho_1", text: "Cyber Witch: Materialized", start: 73.1, end: 75.5, type: "kinetic_center" },
  { id: "cho_2", text: "ネオンの夜に顕現する", start: 76.47, end: 78.5, type: "kinetic_center" },
  { id: "cho_3", text: "Structure analyzed", start: 78.7, end: 81.0, type: "kinetic_center" },
  { id: "cho_4", text: "偽りの膜を切り裂いていく", start: 81.9, end: 85.0, type: "kinetic_split" },
  { id: "cho_5", text: "Cyber Witch: Materialized", start: 85.27, end: 87.5, type: "kinetic_center" },
  { id: "cho_6", text: "グリッチの闇を書き換えて", start: 87.6, end: 90.0, type: "kinetic_center" },
  { id: "cho_7", text: "知りたいなら払いなさい", start: 90.57, end: 93.0, type: "kinetic_center" },
  { id: "cho_8", text: "情報料は高いわよ", start: 93.43, end: 97.0, type: "money_drop" },

  // ── [CREDIT] 間奏クレジット（※尺は後で調整）──
  { id: "credit_mid", text: "Charlotte: Cyber Witch_ Materialized\n\nMusic　Suno AI\nLyrics / Direction / Production　noriyang", start: 69.5, end: 73.0, type: "credit_interlude" },
];
