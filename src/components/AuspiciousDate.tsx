import { useState, useMemo } from 'react'
import './AuspiciousDate.css'

interface AuspiciousDateProps {
  onBack: () => void
}

// 事件类型
type EventType = 'marriage' | 'move' | 'open' | 'travel' | 'sign' | 'ceremony' | 'other'

interface EventTypeOption {
  id: EventType
  name: string
  icon: string
  description: string
}

const eventTypes: EventTypeOption[] = [
  { id: 'marriage', name: '结婚', icon: '💒', description: '选择良辰吉日举办婚礼' },
  { id: 'move', name: '搬家', icon: '🏠', description: '选择吉日乔迁新居' },
  { id: 'open', name: '开业', icon: '🎊', description: '选择吉日开业大吉' },
  { id: 'travel', name: '出行', icon: '✈️', description: '选择吉日出行顺利' },
  { id: 'sign', name: '签约', icon: '📝', description: '选择吉日签约顺利' },
  { id: 'ceremony', name: '仪式', icon: '🎭', description: '选择吉日举办仪式' },
  { id: 'other', name: '其他', icon: '✨', description: '选择吉日进行重要事项' },
]

// 天干地支
const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 时辰对应的时间段
const shichenTimes: { [key: string]: { start: string, end: string, name: string } } = {
  '子': { start: '23:00', end: '00:59', name: '子时' },
  '丑': { start: '01:00', end: '02:59', name: '丑时' },
  '寅': { start: '03:00', end: '04:59', name: '寅时' },
  '卯': { start: '05:00', end: '06:59', name: '卯时' },
  '辰': { start: '07:00', end: '08:59', name: '辰时' },
  '巳': { start: '09:00', end: '10:59', name: '巳时' },
  '午': { start: '11:00', end: '12:59', name: '午时' },
  '未': { start: '13:00', end: '14:59', name: '未时' },
  '申': { start: '15:00', end: '16:59', name: '申时' },
  '酉': { start: '17:00', end: '18:59', name: '酉时' },
  '戌': { start: '19:00', end: '20:59', name: '戌时' },
  '亥': { start: '21:00', end: '22:59', name: '亥时' },
}

// 计算日柱（天干地支）
function calculateDayPillar(date: Date): { gan: string, zhi: string } {
  // 使用1900年1月1日为基准（甲子日）
  const baseDate = new Date(1900, 0, 1)
  const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // 1900年1月1日是甲子日，索引为0
  const ganIndex = daysDiff % 10
  const zhiIndex = daysDiff % 12
  
  return {
    gan: tiangan[ganIndex],
    zhi: dizhi[zhiIndex]
  }
}

// 计算时辰的天干地支
function calculateShichenPillar(date: Date, shichen: string): { gan: string, zhi: string } {
  const dayPillar = calculateDayPillar(date)
  const dayGanIndex = tiangan.indexOf(dayPillar.gan)
  const shichenIndex = dizhi.indexOf(shichen)
  
  // 日上起时法：甲己还生甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
  const shichenGanMap: { [key: number]: string[] } = {
    0: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'], // 甲日、己日
    1: ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'], // 乙日、庚日
    2: ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'], // 丙日、辛日
    3: ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'], // 丁日、壬日
    4: ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], // 戊日、癸日
  }
  
  const ganGroup = dayGanIndex % 5
  const gan = shichenGanMap[ganGroup][shichenIndex]
  
  return {
    gan,
    zhi: shichen
  }
}

// 判断时辰是否吉利
function isAuspiciousShichen(date: Date, shichen: string, eventType: EventType): {
  isGood: boolean
  reason: string
  score: number
} {
  const shichenPillar = calculateShichenPillar(date, shichen)
  const dayPillar = calculateDayPillar(date)
  
  let score = 50 // 基础分
  const reasons: string[] = []
  
  // 时辰与日柱相合（加分）
  const heMap: { [key: string]: string[] } = {
    '子': ['丑'],
    '丑': ['子'],
    '寅': ['亥'],
    '亥': ['寅'],
    '卯': ['戌'],
    '戌': ['卯'],
    '辰': ['酉'],
    '酉': ['辰'],
    '巳': ['申'],
    '申': ['巳'],
    '午': ['未'],
    '未': ['午'],
  }
  
  if (heMap[dayPillar.zhi]?.includes(shichenPillar.zhi)) {
    score += 20
    reasons.push('时辰与日柱相合')
  }
  
  // 避开凶时（子时、午时通常较特殊）
  if (shichen === '子' || shichen === '午') {
    if (eventType === 'marriage' || eventType === 'open') {
      score -= 10
      reasons.push('子午时需谨慎')
    }
  }
  
  // 根据事件类型推荐时辰
  const recommendedShichen: { [key in EventType]: string[] } = {
    'marriage': ['巳', '午', '未', '申'],
    'move': ['辰', '巳', '午', '未'],
    'open': ['巳', '午', '未', '申'],
    'travel': ['寅', '卯', '辰', '巳'],
    'sign': ['巳', '午', '未', '申'],
    'ceremony': ['巳', '午', '未', '申'],
    'other': ['巳', '午', '未', '申'],
  }
  
  if (recommendedShichen[eventType].includes(shichen)) {
    score += 15
    reasons.push(`适合${eventTypes.find(e => e.id === eventType)?.name}`)
  }
  
  // 判断最终结果
  const isGood = score >= 60
  
  return {
    isGood,
    reason: reasons.length > 0 ? reasons.join('、') : '时辰一般',
    score: Math.min(100, Math.max(0, score))
  }
}

// 获取指定日期范围内的吉时
function getAuspiciousShichens(date: Date, eventType: EventType): Array<{
  shichen: string
  time: { start: string, end: string, name: string }
  result: { isGood: boolean, reason: string, score: number }
}> {
  const results = dizhi.map(shichen => {
    const time = shichenTimes[shichen]
    const result = isAuspiciousShichen(date, shichen, eventType)
    return {
      shichen,
      time,
      result
    }
  })
  
  // 按分数排序，优先显示吉时
  return results.sort((a, b) => b.result.score - a.result.score)
}

function AuspiciousDate({ onBack }: AuspiciousDateProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [selectedEventType, setSelectedEventType] = useState<EventType>('marriage')
  
  const dateObj = useMemo(() => new Date(selectedDate), [selectedDate])
  const dayPillar = useMemo(() => calculateDayPillar(dateObj), [dateObj])
  const auspiciousShichens = useMemo(() => 
    getAuspiciousShichens(dateObj, selectedEventType), 
    [dateObj, selectedEventType]
  )
  
  const goodShichens = auspiciousShichens.filter(s => s.result.isGood)
  const bestShichens = goodShichens.slice(0, 3) // 前3个最佳时辰
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }
  
  return (
    <div className="auspicious-date">
      <div className="auspicious-header">
        <button className="back-button" onClick={onBack}>
          ← 返回
        </button>
        <h1>📆 择日吉时</h1>
        <p className="subtitle">选择良辰吉日，趋吉避凶</p>
      </div>
      
      <div className="auspicious-content">
        {/* 事件类型选择 */}
        <div className="event-type-section">
          <h2>选择事件类型</h2>
          <div className="event-type-grid">
            {eventTypes.map(event => (
              <div
                key={event.id}
                className={`event-type-card ${selectedEventType === event.id ? 'active' : ''}`}
                onClick={() => setSelectedEventType(event.id)}
              >
                <div className="event-icon">{event.icon}</div>
                <div className="event-name">{event.name}</div>
                <div className="event-desc">{event.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 日期选择 */}
        <div className="date-selection-section">
          <h2>选择日期</h2>
          <div className="date-input-wrapper">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
            <div className="date-info">
              <p className="date-display">{formatDate(dateObj)}</p>
              <p className="day-pillar">
                日柱：<span className="pillar">{dayPillar.gan}{dayPillar.zhi}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* 最佳吉时推荐 */}
        {bestShichens.length > 0 && (
          <div className="best-shichen-section">
            <h2>🌟 最佳吉时推荐</h2>
            <div className="best-shichen-grid">
              {bestShichens.map((item, index) => (
                <div key={item.shichen} className="best-shichen-card">
                  <div className="rank-badge">第{index + 1}名</div>
                  <div className="shichen-name">{item.time.name}</div>
                  <div className="shichen-time">
                    {item.time.start} - {item.time.end}
                  </div>
                  <div className="shichen-score">
                    <span className="score-value">{item.result.score}</span>
                    <span className="score-label">分</span>
                  </div>
                  <div className="shichen-reason">{item.result.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 所有时辰列表 */}
        <div className="all-shichen-section">
          <h2>📋 全天时辰详情</h2>
          <div className="shichen-list">
            {auspiciousShichens.map(item => (
              <div
                key={item.shichen}
                className={`shichen-item ${item.result.isGood ? 'good' : 'normal'}`}
              >
                <div className="shichen-header">
                  <span className="shichen-name">{item.time.name}</span>
                  <span className="shichen-time-range">
                    {item.time.start} - {item.time.end}
                  </span>
                  <span className={`shichen-badge ${item.result.isGood ? 'good' : 'normal'}`}>
                    {item.result.isGood ? '吉' : '平'}
                  </span>
                </div>
                <div className="shichen-details">
                  <div className="shichen-pillar">
                    时柱：{calculateShichenPillar(dateObj, item.shichen).gan}
                    {calculateShichenPillar(dateObj, item.shichen).zhi}
                  </div>
                  <div className="shichen-score-bar">
                    <div className="score-label">评分：{item.result.score}分</div>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${item.result.score}%` }}
                      />
                    </div>
                  </div>
                  <div className="shichen-reason">{item.result.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 温馨提示 */}
        <div className="tips-section">
          <h3>💡 温馨提示</h3>
          <ul>
            <li>择日吉时仅供参考，重要事项请结合实际情况</li>
            <li>建议选择评分较高的时辰进行重要活动</li>
            <li>不同事件类型适合的时辰可能有所不同</li>
            <li>传统择日法结合了天干地支、五行相生相克等理论</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AuspiciousDate

