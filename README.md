# 韮崎クイズ（アフター６）

韮崎市の中高生の居場所「青少年育成プラザ Miacis」の毎日イベント「アフター６」で実施する韮崎クイズ（10問・4択）。
スマホから参加でき、正解数と回答時間で順位を競います。

- 公開URL: https://nirareba0.github.io/miacis-nirasaki-quiz/

---

## 使い方

### 1. ビルド（チラシPDF/PNG ＋ 画面キャプチャ）

```bash
node build.mjs
```

`out/` ディレクトリに以下のファイルが生成されます:
- `out/flyer.pdf` / `out/flyer.png`（A4チラシ・300dpi相当）
- `out/app-*.png`（スマホ幅の画面プレビュー6種）

### 2. チラシ単体の生成

```bash
node print/flyer.mjs
```

環境変数で日付や煽り文言を差し替えられます:
```bash
WHEN="11.4（水）18:00〜" node print/flyer.mjs
```

### 3. 問題・文言の編集

- 問題・ルール・景品・100人カイギ案内の変更: **`docs/data.js`**
- Supabase 接続設定: `docs/config.js`

### 4. 画面 URL オプション

- 通常画面: `docs/index.html`
- 受付用画面（手入力）: `docs/index.html?staff=1`
- デモ画面（ネットワーク接続なしで表示確認・ビルド用）:
  - `?demo=start`: スタート画面
  - `?demo=q`: 第1問（タイマー停止）
  - `?demo=feedback`: 第1問正解直後の解説表示
  - `?demo=result`: 結果画面見本（正解7・1分23.2秒・3位/9人）
  - `?demo=ranking`: ランキング見本
  - `?demo=staff`: 受付画面見本
