#!/usr/bin/env bash
# 韮崎クイズの順位 DB（0039）だけを本番の Supabase に入れる（repo の pull はしない）。2026-10-28
# 入れたあと migration の履歴にも 0039 を記録し、あとで db push しても二重に入らないようにする
set -euo pipefail
cd ~/code/miacis-vocab-battle
CLI=(npx --yes supabase@2.117.0)
"${CLI[@]}" link --project-ref aljlbxvucscmpbcuccin >/dev/null
"${CLI[@]}" db query --linked -f supabase/migrations/0039_nirasaki_quiz.sql
"${CLI[@]}" migration repair --status applied 0039
echo "完了: タブレットで https://nirareba0.github.io/miacis-nirasaki-quiz/?kiosk=1 を開いて1回遊び、ランキングに出れば OK"
