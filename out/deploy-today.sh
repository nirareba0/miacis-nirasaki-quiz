#!/usr/bin/env bash
# 韮崎クイズ（LINE 不要・タブレット用）を今日使えるようにする 2 手。2026-10-28
# 1) GitHub Pages に出す（URL: https://nirareba0.github.io/miacis-nirasaki-quiz/?kiosk=1）
# 2) 順位の DB（0039）を本番の Supabase に入れる（英単語サバイバルの repo を最新にしてから）
set -euo pipefail
echo "== 1/2 GitHub =="
cd ~/code/miacis-nirasaki-quiz
git add -A && git commit -q -m "韮崎クイズ（アフター６・LINE 不要・タブレットモード）" || true
gh repo create nirareba0/miacis-nirasaki-quiz --public --source . --remote origin --push
gh api -X POST repos/nirareba0/miacis-nirasaki-quiz/pages -f "source[branch]=main" -f "source[path]=/docs" >/dev/null || true
echo "Pages: https://nirareba0.github.io/miacis-nirasaki-quiz/?kiosk=1 （出るまで 1〜3 分）"
echo "== 2/2 DB =="
cd ~/code/miacis-vocab-battle
git stash push -q -m "flyer.mjs の手元の変更（2026-10-28 退避）" -- print/flyer.mjs || true
git pull -q --ff-only origin main
npx --yes supabase@2.117.0 link --project-ref aljlbxvucscmpbcuccin >/dev/null
echo "-- 入る migration（0039 だけのはず）:"
npx --yes supabase@2.117.0 db push --dry-run 2>&1 | tail -5
npx --yes supabase@2.117.0 db push --yes
echo "完了。タブレットで https://nirareba0.github.io/miacis-nirasaki-quiz/?kiosk=1 を開く"
