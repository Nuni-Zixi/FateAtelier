import { useMemo, useState } from 'react'
import './Horoscope.css'

type Period = 'today' | 'week' | 'month'

const zodiacSigns = [
  { id: 'aries', name: '白羊座', icon: '♈' },
  { id: 'taurus', name: '金牛座', icon: '♉' },
  { id: 'gemini', name: '双子座', icon: '♊' },
  { id: 'cancer', name: '巨蟹座', icon: '♋' },
  { id: 'leo', name: '狮子座', icon: '♌' },
  { id: 'virgo', name: '处女座', icon: '♍' },
  { id: 'libra', name: '天秤座', icon: '♎' },
  { id: 'scorpio', name: '天蝎座', icon: '♏' },
  { id: 'sagittarius', name: '射手座', icon: '♐' },
  { id: 'capricorn', name: '摩羯座', icon: '♑' },
  { id: 'aquarius', name: '水瓶座', icon: '♒' },
  { id: 'pisces', name: '双鱼座', icon: '♓' }
]

// 轻量本地运势生成（无AI、无网络）：按日期+星座的可复现伪随机
function mulberry32(seed: number) {
  let t = seed + 0x6D2B79F5
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function getSeed(date: Date, signIndex: number, period: Period) {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const base = period === 'today' ? (y * 10000 + m * 100 + d) : period === 'week' ? (y * 100 + getWeekNumber(date)) : (y * 100 + m)
  return base * 31 + signIndex * 97
}

function getWeekNumber(date: Date) {
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = temp.getUTCDay() || 7
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1))
  return Math.ceil((((temp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

const luckyColors = ['蓝色', '金色', '绿色', '银色', '紫色', '红色', '白色', '黑色', '橙色', '青色']
const luckyItems = ['星形吊坠', '天然水晶', '精油香氛', '手账本', '幸运硬币', '羽毛笔', '丝巾', '手链', '耳饰', '胸针']
// 预留：可扩展不同维度标签

function pick<T>(rand: () => number, list: T[]) {
  return list[Math.floor(rand() * list.length)]
}

function genScore(rand: () => number) {
  return 60 + Math.floor(rand() * 41) // 60-100
}

function genAdvice(rand: () => number) {
  const pieces = [
    '把注意力放在当下的小目标上会更有效率。',
    '与其纠结不确定，不如先行动起来。',
    '适合整理与复盘，总结能带来灵感。',
    '保持耐心，好的结果需要一点时间。',
    '与可信赖的人沟通，会有关键启发。',
    '保持节奏，不必和他人比较。',
    '多赞美自己，信心会带来好运。',
    '保持作息，精力是今天的核心竞争力。'
  ]
  return pick(rand, pieces)
}

function genAspectText(rand: () => number, aspect: string) {
  const templates = [
    `${aspect}方面起伏不大，稳中有进；适合按计划推进。`,
    `${aspect}方面有新机会出现，抓住节奏就能更顺利。`,
    `${aspect}方面建议先做减法，精简后会清晰不少。`,
    `${aspect}方面不要急于求成，过程比结果更重要。`,
    `${aspect}方面适合沟通协调，别独自承受压力。`,
    `${aspect}方面有一点小挑战，但也藏着惊喜与成长。`
  ]
  return pick(rand, templates)
}

function genHoroscope(seed: number) {
  const rand = mulberry32(seed)
  const overall = genScore(rand)
  const love = genScore(rand)
  const career = genScore(rand)
  const wealth = genScore(rand)
  const health = genScore(rand)
  const study = genScore(rand)
  const color = pick(rand, luckyColors)
  const item = pick(rand, luckyItems)
  const summary = genAspectText(rand, '整体')
  const advice = genAdvice(rand)
  const details = [
    { key: '爱情', value: love, text: genAspectText(rand, '爱情') },
    { key: '事业', value: career, text: genAspectText(rand, '事业') },
    { key: '财富', value: wealth, text: genAspectText(rand, '财富') },
    { key: '健康', value: health, text: genAspectText(rand, '健康') },
    { key: '学业', value: study, text: genAspectText(rand, '学业') }
  ]
  return { overall, summary, advice, color, item, details }
}

interface HoroscopeProps {
  onBack?: () => void
}

function Horoscope({ onBack }: HoroscopeProps) {
  const [period, setPeriod] = useState<Period>('today')
  const [signIndex, setSignIndex] = useState<number>(0)

  const today = new Date()

  const result = useMemo(() => {
    const seed = getSeed(today, signIndex, period)
    return genHoroscope(seed)
  }, [today, signIndex, period])

  const sign = zodiacSigns[signIndex]

  return (
    <div className="horoscope">
      <div className="horoscope-header">
        <h2>{sign.icon} {sign.name} · 星座运势</h2>
        {onBack && (
          <button className="back-btn" onClick={onBack}>← 返回</button>
        )}
      </div>

      <div className="horoscope-controls">
        <div className="signs-scroll">
          {zodiacSigns.map((z, idx) => (
            <button
              key={z.id}
              className={`sign-chip ${idx === signIndex ? 'active' : ''}`}
              onClick={() => setSignIndex(idx)}
              title={z.name}
            >
              <span className="sign-icon">{z.icon}</span>
              <span className="sign-name">{z.name}</span>
            </button>
          ))}
        </div>

        <div className="period-toggle">
          <button className={period === 'today' ? 'active' : ''} onClick={() => setPeriod('today')}>今日</button>
          <button className={period === 'week' ? 'active' : ''} onClick={() => setPeriod('week')}>本周</button>
          <button className={period === 'month' ? 'active' : ''} onClick={() => setPeriod('month')}>本月</button>
        </div>
      </div>

      <div className="horoscope-cards">
        <div className="score-card">
          <div className="score">{result.overall}</div>
          <div className="label">综合指数</div>
        </div>
        <div className="info-card">
          <div className="info-row"><span>幸运颜色</span><b>{result.color}</b></div>
          <div className="info-row"><span>幸运物品</span><b>{result.item}</b></div>
        </div>
      </div>

      <div className="summary-card">
        <h3>整体概览</h3>
        <p>{result.summary}</p>
      </div>

      <div className="details-grid">
        {result.details.map(d => (
          <div key={d.key} className="detail-card">
            <div className="detail-header">
              <span className="detail-key">{d.key}</span>
              <span className="detail-score">{d.value}</span>
            </div>
            <p className="detail-text">{d.text}</p>
          </div>
        ))}
      </div>

      <div className="advice-card">
        <h3>今日建议</h3>
        <p>{result.advice}</p>
      </div>
    </div>
  )
}

export default Horoscope


