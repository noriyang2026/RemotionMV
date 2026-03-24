# Kagee Production Log

## 2026-02-17

### 1. 動画生成の禁止ルール適用 (Video Generation Prohibition)
- **方針変更**: コードによる画像/動画生成（複雑な SVG フィルタやCanvas操作）を避け、事前に用意された素材（assets）を使用する方針に切り替えました。
- **理由**: プレビューの安定性と意図した演出の正確な再現のため。
- **ルール**: 今後、各カットは `public/assets/` 配下の `mp4` または `png` を `staticFile` で読み込む形式を標準とします。

### 2. KageeScene02.tsx の Video 実装完了
- **実装**: `KageeScene02.tsx` を `Image` コンポーネントから `Video` コンポーネントへ書き換え完了。
- **使用素材**: `public/assets/cut02.mp4`
- **設定**:
    - `muted`, `loop`, `playsInline` 属性を追加し、自動再生を確実化。
    - `objectFit: 'cover'` で画面全体に表示。
    - `alignItems: 'flex-end'` と `paddingRight: '10%'` でテロップを右寄せ（顔を避ける配置）に調整。

### 3. 進捗状況
- **Cut 02**: 実装および動作確認完了。
- **Next Step**: Cut 03 以降も同様のアセットベースの手法で実装を進める。
