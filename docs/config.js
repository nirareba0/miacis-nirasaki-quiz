// Supabase（ミアキス英単語サバイバルと同じプロジェクト。anon key は公開鍵。アクセス制御は RLS と GRANT）
// DB の表・関数は ~/code/miacis-vocab-battle/supabase/migrations/0039_nirasaki_quiz.sql
window.QUIZ_CONFIG = {
  SUPABASE_URL: 'https://aljlbxvucscmpbcuccin.supabase.co',
  // 公式LINE から開く LIFF の ID（LINE Developers で作る。空なら LINE 連携は無効。入口は ?line=1 付きの URL）
  LIFF_ID: '',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsamxieHZ1Y3NjbXBiY3VjY2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjI3NjgsImV4cCI6MjEwNTg5ODc2OH0.vOztp7iBU5ylXyj6hPtBe7E3WmIrlGMszO5P3-Sb27U',
}
