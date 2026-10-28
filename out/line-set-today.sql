-- LINE 版（Miacis クイズ）に「韮崎クイズ」を作る。2026-10-28。問題の正本は miacis-nirasaki-quiz/docs/data.js
-- 問題10問をストックに入れ、クイズ（10秒・受付中・今日 21:30 締め切り・1位 購買部のチケット・最後のお知らせ＝100人カイギ）を作って並べる
with src(pos, body, choices, answer, image_path) as (
  values
    (0, '韮崎市の人口は、だいたい何人？（2026年10月1日）', array['約1万7千人', '約2万7千人', '約3万7千人', '約4万7千人'], 1, null),
    (1, '「韮崎（にらさき）」という名前の由来といわれているのは？', array['七里岩の先が、ニラの葉みたいにとがっているから', 'ニラ畑だらけだったから', '川がニラの形に曲がっているから', '「韮」という名字のお殿さまがいたから'], 0, null),
    (2, '韮崎市のイメージキャラクター「ニーラ」は、何の生きもの？', array['カエル', '鳥', 'ネコ', 'カメ'], 0, null),
    (3, '韮崎市出身の大村智（おおむら さとし）さんが 2015年に受賞したのは、ノーベル何賞？', array['ノーベル生理学・医学賞', 'ノーベル化学賞', 'ノーベル物理学賞', 'ノーベル平和賞'], 0, null),
    (4, '韮崎高校サッカー部の出身で、元サッカー日本代表の人は？', array['中田 英寿', '本田 圭佑', '三浦 知良', '長友 佑都'], 0, null),
    (5, '韮崎市の市章（エンブレム）は、どれ？', array['A', 'B', 'C', 'D'], 1, '2026-10-28/emblem-quiz.png'),
    (6, 'ミアキスがある韮崎駅前の建物。ニコリになる前（直前）は、何だった？', array['ショッピングセンター「ルネス」', 'イトーヨーカ堂', 'イオン', '韮崎市役所'], 0, null),
    (7, 'その建物の、いまの正式な名前は？', array['SASAKI NICORI（ササキニコリ）', 'NICORI（ニコリ）', 'NIYARI（ニヤリ）', 'NIKKORI（ニッコリ）'], 0, null),
    (8, '韮崎市の「市の花」は？', array['レンゲツツジ', 'ヒマワリ', 'バラ', 'コスモス'], 0, null),
    (9, '韮崎のまん中を走る台地「七里岩」をつくった火山は？', array['八ヶ岳', '富士山', '浅間山', '桜島'], 0, null)
),
q as (
  insert into public.quiz_questions (body, choices, answer, tag, image_path)
  select body, choices, answer, '韮崎', image_path from src order by pos
  returning id, body
),
z as (
  insert into public.quiz_sets (title, time_limit_sec, prize, status, opened_at, closes_at, end_title, end_body, end_link_url)
  values ('韮崎クイズ', 10, '購買部のチケット', 'open', now(), timestamptz '2026-10-28 21:30+09',
          '韮崎のこと、もっと知りたくなった？ 韮崎100人カイギ Vol.6', '11.17（火）19:00〜21:00 ミアキス（ニコリ地下1階）。韮崎の大人5人が10分ずつ話す夜。中高生 無料・当日参加OK・開場 18:45・聞くだけでOK', 'https://100ninkaigi.com/area/nirasaki')
  returning id
)
insert into public.quiz_set_items (set_id, question_id, position)
select z.id, q.id, src.pos from z, q join src on src.body = q.body;
