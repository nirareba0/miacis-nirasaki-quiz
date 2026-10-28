// 全体ビルドスクリプト
//   node build.mjs
// ① print/flyer.mjs を実行してチラシ (PDF / PNG) を生成
// ② docs/index.html の各デモ画面 (390px幅) を headless Chrome でスクリーンショット撮影
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync } from 'node:fs'

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, 'out')
mkdirSync(out, { recursive: true })

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const htmlFile = resolve(here, 'docs/index.html')

// ① チラシを生成
console.log('Building flyer...')
execFileSync(process.execPath, [resolve(here, 'print/flyer.mjs')], { stdio: 'inherit' })

// ② アプリのスマホ幅スクリーンショットを撮影
const demos = ['start', 'q', 'feedback', 'result', 'review', 'ranking', 'staff']
const common = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--window-size=390,1400',
  '--force-device-scale-factor=2',
  '--virtual-time-budget=3000'
]

console.log('Capturing app screenshots...')
for (const demo of demos) {
  const url = `file://${htmlFile}?demo=${demo}`
  const target = resolve(out, `app-${demo}.png`)
  execFileSync(CHROME, [...common, `--screenshot=${target}`, url], { stdio: 'ignore' })
  console.log(`  app-${demo}.png ok`)
}

console.log('ok')
