# AGENTS.md — miacis-nirasaki-quiz の実装規約

韮崎市の中高生の居場所「青少年育成プラザ Miacis」の毎日イベント「アフター６」でやる、韮崎に関する4択クイズ（10問）。
スマホで答えると、正解数と合計時間でその日の順位が出る。参加者はお菓子、1位は購買部のチケット。
結果画面とチラシで 韮崎100人カイギ Vol.6（11/17）を案内する。
仕様の正本は AIOS 側 `core/projects/miacis/specs/after6-nirasaki-quiz-20261028.md`。このファイルは実装の規約だけ。

## 構成

| 場所 | 中身 |
|---|---|
| `docs/index.html` | スマホ版の画面（依存なし・1ファイル）。GitHub Pages は `main` の `docs/` を配信 → https://nirareba0.github.io/miacis-nirasaki-quiz/ |
| `docs/data.js` | 問題・文言・ルール（`window.QUIZ`）。**問題を直すのはここだけ** |
| `docs/config.js` | Supabase の URL と anon key（`window.QUIZ_CONFIG`。公開鍵） |
| `docs/img/` | 問題の画像（任意。`opts[].img` で指す） |
| `print/flyer.mjs` → `out/flyer.pdf` `out/flyer.png` | 館内に貼る A4 チラシ。headless Chrome で書き出す |
| `print/img/` | ロゴ・アフター６の絵・QR（`qr-app.svg` = アプリ、`qr-100.svg` = 100人カイギ） |
| `build.mjs` | チラシと、スマホ幅の画面の PNG（`out/app-*.png`）をまとめて出す |
| DB | ミアキス英単語サバイバルと同じ Supabase。表と関数は `~/code/miacis-vocab-battle/supabase/migrations/0039_nirasaki_quiz.sql`（このリポジトリには置かない） |

## 守ること

- **個人情報を持たない。** 保存するのはニックネーム・正解数・合計時間・答えた選択肢・端末ID（乱数）だけ。本名・学校名・学年は集めない。画面で「本名はやめよう」と言う
- 画面はビルドなし。素の HTML/CSS/JS（ES2020 まで）。`supabase-js` は使わず `fetch` で REST（`/rest/v1/rpc/...`・`/rest/v1/nirasaki_quiz_ranking`）を叩く（ヘッダ `apikey` と `Authorization: Bearer <anon key>`）
- Supabase に届かないときも遊べる。結果は localStorage に残し、画面に「受付でこの画面を見せてね」と出す
- **LINE から入る道**: `?line=1` 付きの URL を LIFF の endpoint にする（`docs/config.js` の `LIFF_ID`。空なら無効）。LINE の表示名をニックネームに入れておき（変えてよい）、端末IDは LINE の userId の SHA-256 から作る（userId そのものは保存しない）。順位はタブレット・スマホと同じ表に入る
- 答えたあとの解説は `rules.feedbackMs`（4秒。「つぎへ」で早く進める）。答えが分かる写真は `whyImg` に置き、解説と「答えあわせ」画面だけで見せる
- 順位に入るのは端末ごとに1回目だけ（DB 側の view がそう作ってある）。2回目以降は「練習」と表示する。**館内のタブレットで順番に遊ぶときは `?kiosk=1`**（1回ごとに別の端末ID・「次の人へ」で名前を消す・ネットに届かないときはその端末の記録で順位を出す）
- 選択肢は毎回シャッフルする。正解は `data.js` の `a`（元の並びの番号）
- 文字は日本語。中高生向けに短く。色とタイル（枠3px・影4px）は `~/code/miacis-yaritai/docs/index.html` と同じ系統（紺 #1e2088・赤 #e8461e・黄 #ede52e・紙 #f6f4ea）
- チラシは紙の縁 6mm に何も置かない。日付は仮（環境変数 `WHEN` で差し替え）
- git commit / git push は AI がしない（本人がやる）
- 指示にないファイルを編集しない。`node_modules` を作らない
