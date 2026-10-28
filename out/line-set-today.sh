#!/usr/bin/env bash
# LINE 版（Miacis クイズ）に「韮崎クイズ」を入れる（問題10問・クイズ・市章の画像）。2026-10-28
set -euo pipefail
cd ~/code/miacis-nirasaki-quiz
CLI=(npx --yes supabase@2.117.0)
"${CLI[@]}" link --project-ref aljlbxvucscmpbcuccin >/dev/null
echo "== 市章の画像を置く（失敗したら管理画面で付ける）=="
"${CLI[@]}" storage cp --linked --experimental docs/img/emblem-quiz.png ss:///quiz-images/2026-10-28/emblem-quiz.png \
  || echo "!! 画像は管理画面 → 問題ストック → 市章の問題 → 画像を選ぶ → docs/img/emblem-quiz.png で付けてください"
echo "== 問題とクイズを作る =="
"${CLI[@]}" db query --linked -f out/line-set-today.sql
echo "完了: 公式LINE からミアキス クイズを開くと「韮崎クイズ」が受付中で出ます（締め切り 21:30）"
