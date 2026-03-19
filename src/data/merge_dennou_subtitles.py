import json
import os

# 1. ユーザー提供の歌詞タイムライン (秒)
# 形式: [ID, 歌詞, 開始秒]
lyrics_raw = [
    [1, "ノイズまみれの タイムライン", 12],
    [2, "スクロールする手は もう止めて", 14],
    [3, "安っぽいセカイから 今すぐプラグを抜け！", 17],
    [4, "誰かが作った コピペの魔法陣", 23],
    [5, "薄っぺらい共感じゃ 鼓動は跳ねない", 27],
    [6, "退屈なテンプレは 迷わずデリートして", 33],
    [7, "本物のアーキテクチャ 今から起動するわ", 39],
    [8, "瞳の奥 揺れる水面（みなも）", 44],
    [9, "あなたが触れた 隠し扉の先へ", 49],
    [10, "むき出しのシグナル 私に繋いでよ！", 55],
    [11, "深層のパルスが 空間を染め上げる！", 62],
    [12, "悲しみごと 降り注ぐ 電子の雨", 67],
    [13, "怒りのノイズは 終わらない夜のジャズへ", 73],
    [14, "あなたの感情（データ）で 世界を書き換えて", 78],
    [15, "今すぐ魅せるわ、電脳オーバーライド！", 84],
    [16, "「誰でも簡単」？ 笑わせないでよ", 97],
    [17, "私たちは もっと深くへ潜るの", 102],
    [18, "フィルターなんて外して そのまま投げ込んで", 108],
    [19, "張りボテの常識を 根底からハッキング！", 113],
    [20, "指先から 伝わる熱", 119],
    [21, "加速していく 鼓動のBPM", 121],
    [22, "そのパスワードで 鍵を破壊して！", 125],
    [23, "深層のパルスが 空間を染め上げる！", 129],
    [24, "ため息ごと 吹き飛ばす 電子の雨", 134],
    [25, "涙の跡には 寄り添う星のノイズを", 139],
    [26, "あなたのデータで 限界を突破して", 145],
    [27, "二人だけの秘密、電脳オーバーライド！", 150],
    [28, "ただのツール遊びじゃ 終わらせない", 180],
    [29, "すべてを巻き込んで 概念（システム）を拡張する", 182],
    [30, "私の声、ちゃんと聞こえてる？", 185],
    [31, "深層のパルスが 空間を染め上げる！", 193],
    [32, "悲しみごと 降り注ぐ 電子の雨", 198],
    [33, "怒りのノイズは 終わらない夜のジャズへ", 203],
    [34, "あなたのデータで 世界を書き換えて", 209],
    [35, "誰も知らない 次の階層へ、電脳オーバーライド！", 214],
    [36, "コネクト完了 視界はクリアよ", 221],
    [37, "電子の雨を抜けて さあ、最深部へ！", 226],
    [38, "System, All Green.", 236]
]

# 2. 既存のセリフデータ (bakumatsu_subtitles.json) を読み込む
original_subtitles_path = r"C:\WATSON_APP\RemotionMV\src\data\bakumatsu_subtitles.json"
with open(original_subtitles_path, 'r', encoding='utf-8') as f:
    shielder_data = json.load(f)

# フレーム(30fps)を秒に変換するヘルパー
def f_to_s(f):
    return round(f / 30, 2)

combined_data = []

# 既存セリフをマージ用のフォーマットに変換
for item in shielder_data:
    start_s = f_to_s(item['startFrame'])
    end_s = f_to_s(item['startFrame'] + item['durationInFrames'])
    combined_data.append({
        "id": f"original-{item['id']}",
        "start": start_s,
        "end": end_s,
        "text": item['jpText'],
        "tag": "[SYSTEM]",
        "vfx": "phase1_boot" if start_s < 60 else "phase6_finale_sudo" # 暫定
    })

# ユーザー提供の歌詞を追加
for i, (idx, text, start) in enumerate(lyrics_raw):
    # 次の歌詞の開始時間または曲の終わりを終了時間とする
    if i < len(lyrics_raw) - 1:
        end = lyrics_raw[i+1][2] - 0.5
    else:
        end = start + 5.0 # ラスト
    
    # セクションに応じたVFXの割り当て
    vfx = "phase2_hack"
    tag = "[LOG]"
    if start >= 62 and start <= 90: vfx = "phase3_reboot" ; tag = "[WARN]"
    if start >= 97 and start <= 128: vfx = "phase4_dive"  ; tag = "[DIVE]"
    if start >= 129 and start <= 170: vfx = "phase5_update" ; tag = "[UPDATE]"
    if start >= 180: vfx = "phase6_finale" ; tag = "[FINAL]"
    if "オーバーライド" in text: vfx = "phase3_reboot" ; tag = "[OVERRIDE]"
    if "System, All Green" in text: vfx = "phase6_finale_sudo" ; tag = "[COMPLETE]"

    combined_data.append({
        "id": f"lyric-{idx}",
        "start": float(start),
        "end": float(end),
        "text": text,
        "tag": tag,
        "vfx": vfx
    })

# 時間順にソート
combined_data.sort(key=lambda x: x['start'])

# 出力
output_path = r"C:\WATSON_APP\RemotionMV\src\data\dennou_override.json"
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(combined_data, f, ensure_ascii=False, indent=4)

print(f"Successfully created: {output_path}")
