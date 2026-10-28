#!/usr/bin/env bash
# 韮崎クイズ: LINE 版とアプリ版の順位を1つにする関数（0040）を本番に入れる。2026-10-28
set -euo pipefail
cd ~/code/miacis-vocab-battle
CLI=(npx --yes supabase@2.117.0)
"${CLI[@]}" link --project-ref aljlbxvucscmpbcuccin >/dev/null
"${CLI[@]}" db query --linked -f supabase/migrations/0040_nirasaki_quiz_merge.sql
"${CLI[@]}" migration repair --status applied 0040
echo "完了"
