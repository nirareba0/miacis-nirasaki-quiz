// 館内に貼る A4 縦チラシ「韮崎クイズ」（アフター６）。
//   node print/flyer.mjs → out/flyer.html, out/flyer.pdf, out/flyer.png（300dpi 相当）
// 紙の縁 6mm には何も置かない。
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const out = resolve(root, 'out')
mkdirSync(out, { recursive: true })

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const APP_URL = 'LINE で開く（公式LINE のミアキス クイズ）'

// data.js からクイズ情報と文言を読む
const window = {}; eval(readFileSync(resolve(root, 'docs/data.js'), 'utf8')); const QUIZ = window.QUIZ

// 3問目（ニーラ）を例題として使用
const Q_EX = QUIZ.questions[2]

// 環境変数
const WHEN = process.env.WHEN ?? ''   // 空なら日付の枠を出さない
const HOOK = process.env.HOOK ?? '韮崎のこと、\nどれだけ\n知ってる？'

const svg = f => readFileSync(resolve(here, 'img', f), 'utf8')
  .replace(/<\?xml[^>]*>\s*/, '')
  .replace(/<svg\b/, '<svg width="100%" height="100%"')

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Zen+Kaku+Gothic+New:wght@500;700;900&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 0; }
:root {
  --navy: #1e2088;
  --red: #e8461e;
  --yellow: #ede52e;
  --ink: #15151a;
  --paper: #f6f4ea;
  --dela: "Dela Gothic One", sans-serif;
  --sans: "Zen Kaku Gothic New", "Hiragino Sans", sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--paper); }
body {
  font-family: var(--sans);
  color: var(--ink);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.a4 {
  position: relative;
  width: 210mm;
  height: 297mm;
  padding: 8mm 10mm 7mm;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.org {
  display: flex;
  align-items: center;
  gap: 2.5mm;
  font-weight: 900;
  font-size: 9.5pt;
  line-height: 1.3;
}
.org img { width: 13mm; }
.org small { display: block; font-weight: 700; font-size: 7.5pt; color: #555; }
.after6 { width: 44mm; display: block; }

.hook {
  margin-top: 5mm;
  font-family: var(--dela);
  font-size: 36pt;
  line-height: 1.16;
  white-space: pre-line;
  color: var(--navy);
  letter-spacing: -.01em;
}

.title {
  margin-top: 4mm;
  display: flex;
  align-items: flex-end;
  gap: 3.5mm;
}
.title .tag {
  font-weight: 900;
  font-size: 11pt;
  background: var(--yellow);
  border: 1.2mm solid var(--ink);
  border-radius: 2mm;
  padding: 1.2mm 3.5mm;
  transform: rotate(-2deg);
  white-space: nowrap;
}
.title b {
  font-family: var(--dela);
  font-weight: 400;
  font-size: 31pt;
  line-height: 1.05;
  color: var(--ink);
}

.row {
  display: flex;
  gap: 4.5mm;
  margin-top: 4.5mm;
  align-items: stretch;
}
.card {
  flex: 1;
  background: #fff;
  border: 1.2mm solid var(--ink);
  border-radius: 4mm;
  padding: 3.5mm 4mm;
  box-shadow: 2mm 2mm 0 var(--ink);
  display: flex;
  flex-direction: column;
}
.card .q-badge {
  font-size: 9pt;
  color: var(--red);
  font-weight: 900;
  letter-spacing: .08em;
}
.card .qq {
  font-size: 12.5pt;
  font-weight: 900;
  margin: 1.5mm 0 2.5mm;
  line-height: 1.35;
}
.ex-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2mm;
  margin: 1mm 0 2mm;
}
.ex-opt {
  display: flex;
  align-items: center;
  gap: 1.5mm;
  border: 0.8mm solid var(--ink);
  border-radius: 2.5mm;
  padding: 2mm 2.5mm;
  background: #fff;
  font-weight: 700;
  font-size: 10pt;
  box-shadow: 1mm 1mm 0 var(--ink);
}
.ex-emoji { font-size: 14pt; line-height: 1; }
.ex-txt { line-height: 1.2; }
.card .more {
  margin-top: auto;
  font-size: 8.5pt;
  font-weight: 700;
  color: #444;
  line-height: 1.4;
}

.qr {
  width: 54mm;
  background: var(--red);
  color: #fff;
  border: 1.2mm solid var(--ink);
  border-radius: 4mm;
  padding: 3.5mm;
  text-align: center;
  box-shadow: 2mm 2mm 0 var(--ink);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.qr .box {
  width: 40mm;
  height: 40mm;
  background: #fff;
  border-radius: 2.5mm;
  padding: 2mm;
}
.qr b {
  display: block;
  font-size: 13.5pt;
  font-weight: 900;
  margin-top: 2mm;
}
.qr small {
  display: block;
  font-size: 6.8pt;
  margin-top: 1.2mm;
  white-space: nowrap;
  letter-spacing: -.02em;
  opacity: .95;
}

.prize-band {
  margin-top: 4.5mm;
  background: var(--yellow);
  border: 1.2mm solid var(--ink);
  border-radius: 4mm;
  padding: 3.5mm 4.5mm;
  box-shadow: 2mm 2mm 0 var(--ink);
}
.prize-title {
  display: flex;
  align-items: center;
  gap: 2mm;
  font-weight: 900;
  font-size: 11pt;
}
.prize-tag {
  background: var(--red);
  color: #fff;
  font-size: 8pt;
  padding: 0.8mm 2.2mm;
  border-radius: 1.2mm;
}
.prize-items {
  font-size: 10.5pt;
  font-weight: 800;
  margin-top: 1.5mm;
  display: flex;
  flex-direction: column;
  gap: 1mm;
}
.prize-items div {
  display: flex;
  align-items: center;
  gap: 1.5mm;
}
.prize-rules {
  margin-top: 2mm;
  padding-top: 1.5mm;
  border-top: 0.6mm dashed rgba(21,21,26,0.35);
  font-size: 8pt;
  font-weight: 700;
  color: #333;
}

.promo-band {
  margin-top: 4.5mm;
  background: var(--navy);
  color: #fff;
  border: 1.2mm solid var(--navy);
  border-radius: 4mm;
  padding: 3.5mm 5mm;
  display: flex;
  gap: 4mm;
  align-items: center;
  box-shadow: 2mm 2mm 0 var(--red);
}
.promo-left {
  flex: 1;
}
.promo-lead {
  font-size: 8.5pt;
  color: var(--yellow);
  font-weight: 800;
  margin-bottom: 0.5mm;
}
.promo-title {
  font-family: var(--dela);
  font-size: 16pt;
  color: #fff;
  line-height: 1.2;
}
.promo-date {
  font-size: 10pt;
  font-weight: 900;
  color: var(--yellow);
  margin-top: 1mm;
}
.promo-note {
  font-size: 8pt;
  font-weight: 700;
  line-height: 1.4;
  margin-top: 1mm;
  opacity: .95;
}
.promo-qr {
  width: 25mm;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.promo-qr .box {
  width: 20mm;
  height: 20mm;
  background: #fff;
  border-radius: 1.5mm;
  padding: 1.2mm;
}
.promo-qr small {
  display: block;
  font-size: 6.5pt;
  font-weight: 800;
  margin-top: 1mm;
  color: #fff;
  white-space: nowrap;
}

.when {
  margin-top: 4mm;
  display: flex;
  align-items: center;
  gap: 4mm;
  border: 1.2mm dashed var(--navy);
  border-radius: 3.5mm;
  padding: 2.5mm 4.5mm;
  font-weight: 700;
  font-size: 10pt;
  line-height: 1.45;
}
.when .w {
  font-family: var(--dela);
  font-size: 16pt;
  color: var(--navy);
  white-space: nowrap;
}

.foot {
  margin-top: auto;
  font-size: 7pt;
  color: #444;
  line-height: 1.5;
  border-top: 0.4mm solid #bbb;
  padding-top: 1.8mm;
}
</style>
</head>
<body>
<div class="a4">
  <div class="top">
    <div class="org"><img src="img/miacis-logo.png" alt=""><div>青少年育成プラザ Miacis<small>韮崎市民交流センター NICORI 地下1階</small></div></div>
    <img class="after6" src="img/after6.png" alt="アフター６">
  </div>

  <div class="hook">${esc(HOOK)}</div>

  <div class="title">
    <span class="tag">10問・4択・スマホで</span>
    <b>${esc(QUIZ.title)}</b>
  </div>

  <div class="row">
    <div class="card">
      <div class="q-badge">Q 例　4択で挑戦！</div>
      <div class="qq">${esc(Q_EX.q)}</div>
      <div class="ex-grid">
        ${Q_EX.opts.map(opt => `
          <div class="ex-opt">
            ${opt.e ? `<span class="ex-emoji">${esc(opt.e)}</span>` : ''}
            <span class="ex-txt">${esc(opt.t)}</span>
          </div>
        `).join('')}
      </div>
      <div class="more">正解はアプリで！1問${Math.round((QUIZ.rules.perQuestionMs||10000)/1000)}秒のスピード勝負。<br>正解数と答えた時間でその日の順位が決まります。</div>
    </div>
    <div class="qr">
      <div class="box">${svg('qr-app.svg')}</div>
      <b>ここから挑戦（LINE）</b>
      <small>${APP_URL}</small>
    </div>
  </div>

  <div class="prize-band">
    <div class="prize-title">
      <span class="prize-tag">景品</span>
      <span>参加者全員にプレゼント！</span>
    </div>
    <div class="prize-items">
      ${QUIZ.prizes.map(p => `<div>🎁 ${esc(p)}</div>`).join('')}
    </div>
    <div class="prize-rules">
      <b>順位の決め方：</b>${esc(QUIZ.ranking[0])} ／ ${esc(QUIZ.ranking[1])}
    </div>
  </div>

  <div class="promo-band">
    <div class="promo-left">
      <div class="promo-lead">${esc(QUIZ.promo.lead)}</div>
      <div class="promo-title">${esc(QUIZ.promo.title)}</div>
      <div class="promo-date">${esc(QUIZ.promo.date)} ＠${esc(QUIZ.promo.place)}</div>
      <div class="promo-note">${esc(QUIZ.promo.note)}</div>
    </div>
    <div class="promo-qr">
      <div class="box">${svg('qr-100.svg')}</div>
      <small>100人カイギ</small>
    </div>
  </div>

  ${WHEN ? `<div class="when">
    <span class="w">${esc(WHEN)}</span>
    <span>アフター６で、みんなでやる日。<br>スマホでその場で参加！友だちと一緒に挑戦しよう。</span>
  </div>` : ''}

  <div class="foot">開館 平日 15:00–21:30／土日祝 9:30–21:30／休館 毎週火曜・第3月曜（11/17 は特別に開きます）</div>
</div>
</body>
</html>`

writeFileSync(resolve(out, 'flyer.html'), html.replaceAll('src="img/', `src="${resolve(here, 'img')}/`))
const file = resolve(out, 'flyer.html')
const common = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=8000']
execFileSync(CHROME, [...common, '--no-pdf-header-footer', `--print-to-pdf=${resolve(out, 'flyer.pdf')}`, `file://${file}`], { stdio: 'ignore' })
execFileSync(CHROME, [...common, '--force-device-scale-factor=3.125', '--window-size=794,1123', `--screenshot=${resolve(out, 'flyer.png')}`, `file://${file}`], { stdio: 'ignore' })
console.log('flyer ok')
