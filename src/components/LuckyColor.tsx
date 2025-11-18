import { useMemo, useState, useEffect } from 'react'
import './LuckyColor.css'

interface LuckyColorProps {
  onBack?: () => void
}

interface ColorInfo {
  name: string
  hex: string
  rgb: string
  meaning: string
  suggestions: string[]
  compatibleColors: string[]
  element: string
  energy: string
  psychology?: string
  culture?: string
  energyLevel?: number
  timeSlots?: { time: string; color: string; hex: string }[]
}

// 幸运色数据库
const colorDatabase: Record<string, ColorInfo> = {
  red: {
    name: '红色',
    hex: '#FF4444',
    rgb: '255, 68, 68',
    meaning: '热情、活力、勇气',
    suggestions: ['适合重要会议和决策', '增强自信和行动力', '提升人际关系', '激发创造力'],
    compatibleColors: ['金色', '白色', '黑色'],
    element: '火',
    energy: '积极向上',
    psychology: '红色能刺激肾上腺素分泌，提高心率和血压，增强自信和勇气。在心理学中，红色代表力量、激情和决心。',
    culture: '在中国文化中，红色象征吉祥、喜庆和好运。在西方，红色代表爱情和激情。',
    energyLevel: 95,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深红', hex: '#CC0000' },
      { time: '上午 (9-12点)', color: '正红', hex: '#FF4444' },
      { time: '下午 (12-18点)', color: '亮红', hex: '#FF6666' },
      { time: '晚上 (18-24点)', color: '暗红', hex: '#AA0000' }
    ]
  },
  orange: {
    name: '橙色',
    hex: '#FF8844',
    rgb: '255, 136, 68',
    meaning: '创造力、乐观、社交',
    suggestions: ['适合创意工作', '促进团队合作', '带来好心情', '增强沟通能力'],
    compatibleColors: ['黄色', '红色', '棕色'],
    element: '火',
    energy: '温暖活跃',
    psychology: '橙色结合了红色的活力和黄色的快乐，能激发创造力和社交欲望，促进乐观情绪。',
    culture: '橙色在印度教中代表神圣和纯净，在西方文化中象征秋天和收获。',
    energyLevel: 85,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深橙', hex: '#CC6600' },
      { time: '上午 (9-12点)', color: '正橙', hex: '#FF8844' },
      { time: '下午 (12-18点)', color: '亮橙', hex: '#FFAA66' },
      { time: '晚上 (18-24点)', color: '暗橙', hex: '#AA5500' }
    ]
  },
  yellow: {
    name: '黄色',
    hex: '#FFD700',
    rgb: '255, 215, 0',
    meaning: '智慧、财富、快乐',
    suggestions: ['适合学习和思考', '吸引财运', '提升专注力', '增强记忆力'],
    compatibleColors: ['金色', '橙色', '绿色'],
    element: '土',
    energy: '明亮开朗',
    psychology: '黄色能刺激大脑的创造性思维，提高注意力和记忆力，带来快乐和乐观的情绪。',
    culture: '在中国，黄色是帝王的颜色，象征权力和尊贵。在佛教中，黄色代表智慧和觉悟。',
    energyLevel: 90,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '金黄', hex: '#FFCC00' },
      { time: '上午 (9-12点)', color: '正黄', hex: '#FFD700' },
      { time: '下午 (12-18点)', color: '亮黄', hex: '#FFEE00' },
      { time: '晚上 (18-24点)', color: '暗黄', hex: '#CCAA00' }
    ]
  },
  green: {
    name: '绿色',
    hex: '#44CC88',
    rgb: '68, 204, 136',
    meaning: '成长、平衡、健康',
    suggestions: ['适合新开始', '促进身心健康', '带来平静', '缓解压力'],
    compatibleColors: ['蓝色', '黄色', '白色'],
    element: '木',
    energy: '生机勃勃',
    psychology: '绿色能降低眼压，缓解视觉疲劳，带来平静和放松的感觉，有助于恢复精力。',
    culture: '绿色在伊斯兰教中代表天堂，在西方文化中象征自然和环保，在中国代表生命和希望。',
    energyLevel: 75,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深绿', hex: '#00AA55' },
      { time: '上午 (9-12点)', color: '正绿', hex: '#44CC88' },
      { time: '下午 (12-18点)', color: '亮绿', hex: '#66EEAA' },
      { time: '晚上 (18-24点)', color: '暗绿', hex: '#008844' }
    ]
  },
  blue: {
    name: '蓝色',
    hex: '#4488FF',
    rgb: '68, 136, 255',
    meaning: '冷静、信任、智慧',
    suggestions: ['适合重要沟通', '提升专注力', '带来安全感', '促进深度思考'],
    compatibleColors: ['白色', '银色', '绿色'],
    element: '水',
    energy: '宁静深远',
    psychology: '蓝色能降低心率和血压，带来平静和安全感，有助于提高专注力和逻辑思维。',
    culture: '蓝色在基督教中代表天堂和神圣，在商业中象征信任和稳定，在中国文化中代表智慧和冷静。',
    energyLevel: 70,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深蓝', hex: '#0066CC' },
      { time: '上午 (9-12点)', color: '正蓝', hex: '#4488FF' },
      { time: '下午 (12-18点)', color: '亮蓝', hex: '#66AAFF' },
      { time: '晚上 (18-24点)', color: '暗蓝', hex: '#0044AA' }
    ]
  },
  purple: {
    name: '紫色',
    hex: '#8844CC',
    rgb: '136, 68, 204',
    meaning: '神秘、灵感、直觉',
    suggestions: ['适合艺术创作', '增强直觉力', '提升灵性', '激发想象力'],
    compatibleColors: ['粉色', '银色', '白色'],
    element: '火',
    energy: '神秘优雅',
    psychology: '紫色能激发右脑的创造力和直觉，促进灵性和冥想，有助于艺术创作和深度思考。',
    culture: '紫色在历史上是贵族的颜色，象征权力和神秘。在西方，紫色代表灵性和智慧。',
    energyLevel: 80,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深紫', hex: '#6600AA' },
      { time: '上午 (9-12点)', color: '正紫', hex: '#8844CC' },
      { time: '下午 (12-18点)', color: '亮紫', hex: '#AA66EE' },
      { time: '晚上 (18-24点)', color: '暗紫', hex: '#550088' }
    ]
  },
  pink: {
    name: '粉色',
    hex: '#FF88CC',
    rgb: '255, 136, 204',
    meaning: '温柔、爱情、浪漫',
    suggestions: ['适合约会和社交', '增进感情', '带来好心情', '缓解紧张情绪'],
    compatibleColors: ['白色', '紫色', '红色'],
    element: '火',
    energy: '温柔浪漫',
    psychology: '粉色能降低攻击性，带来温柔和关爱的感觉，有助于缓解压力和焦虑，促进情感交流。',
    culture: '粉色在西方文化中代表女性、爱情和浪漫，在日本文化中象征樱花和春天。',
    energyLevel: 65,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深粉', hex: '#CC66AA' },
      { time: '上午 (9-12点)', color: '正粉', hex: '#FF88CC' },
      { time: '下午 (12-18点)', color: '亮粉', hex: '#FFAAEE' },
      { time: '晚上 (18-24点)', color: '暗粉', hex: '#AA4488' }
    ]
  },
  gold: {
    name: '金色',
    hex: '#FFD700',
    rgb: '255, 215, 0',
    meaning: '财富、成功、尊贵',
    suggestions: ['适合重要场合', '吸引财运', '提升地位', '增强自信'],
    compatibleColors: ['红色', '黑色', '白色'],
    element: '金',
    energy: '尊贵华丽',
    psychology: '金色能激发对成功和财富的渴望，增强自信和自尊，带来积极向上的能量。',
    culture: '金色在几乎所有文化中都代表财富、权力和神圣，是帝王和贵族的象征。',
    energyLevel: 95,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深金', hex: '#CCAA00' },
      { time: '上午 (9-12点)', color: '正金', hex: '#FFD700' },
      { time: '下午 (12-18点)', color: '亮金', hex: '#FFEE44' },
      { time: '晚上 (18-24点)', color: '暗金', hex: '#AA8800' }
    ]
  },
  silver: {
    name: '银色',
    hex: '#C0C0C0',
    rgb: '192, 192, 192',
    meaning: '现代、科技、未来',
    suggestions: ['适合创新项目', '提升科技感', '带来新思维', '增强逻辑分析'],
    compatibleColors: ['蓝色', '白色', '黑色'],
    element: '金',
    energy: '现代前卫',
    psychology: '银色能带来冷静和理性的思考，促进创新和科技感，有助于逻辑分析和决策。',
    culture: '银色在现代文化中代表科技、未来和现代感，在传统中象征月亮和神秘。',
    energyLevel: 75,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深银', hex: '#999999' },
      { time: '上午 (9-12点)', color: '正银', hex: '#C0C0C0' },
      { time: '下午 (12-18点)', color: '亮银', hex: '#E0E0E0' },
      { time: '晚上 (18-24点)', color: '暗银', hex: '#808080' }
    ]
  },
  white: {
    name: '白色',
    hex: '#FFFFFF',
    rgb: '255, 255, 255',
    meaning: '纯净、简洁、新开始',
    suggestions: ['适合新计划', '带来清晰思路', '净化能量', '提升专注力'],
    compatibleColors: ['所有颜色'],
    element: '金',
    energy: '纯净简洁',
    psychology: '白色能带来平静和清晰，有助于整理思绪，促进新的开始和净化能量。',
    culture: '白色在西方文化中代表纯洁和婚礼，在东方文化中象征哀悼和尊重，在医疗中代表清洁。',
    energyLevel: 60,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '纯白', hex: '#FFFFFF' },
      { time: '上午 (9-12点)', color: '亮白', hex: '#FFFFFF' },
      { time: '下午 (12-18点)', color: '暖白', hex: '#FFFEF5' },
      { time: '晚上 (18-24点)', color: '柔白', hex: '#F5F5F5' }
    ]
  },
  black: {
    name: '黑色',
    hex: '#222222',
    rgb: '34, 34, 34',
    meaning: '力量、神秘、保护',
    suggestions: ['适合重要决策', '增强意志力', '提供保护', '提升专注力'],
    compatibleColors: ['金色', '红色', '白色'],
    element: '水',
    energy: '深沉有力',
    psychology: '黑色能带来安全感和保护感，增强意志力和决心，有助于深度思考和决策。',
    culture: '黑色在西方文化中代表优雅和正式，在东方文化中象征智慧和深度，在时尚中代表经典。',
    energyLevel: 90,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深黑', hex: '#000000' },
      { time: '上午 (9-12点)', color: '正黑', hex: '#222222' },
      { time: '下午 (12-18点)', color: '灰黑', hex: '#333333' },
      { time: '晚上 (18-24点)', color: '纯黑', hex: '#111111' }
    ]
  },
  brown: {
    name: '棕色',
    hex: '#8B4513',
    rgb: '139, 69, 19',
    meaning: '稳定、可靠、踏实',
    suggestions: ['适合长期规划', '带来安全感', '增强稳定性', '促进耐心'],
    compatibleColors: ['橙色', '黄色', '绿色'],
    element: '土',
    energy: '稳重踏实',
    psychology: '棕色能带来稳定和安全感，促进耐心和持久力，有助于长期规划和执行。',
    culture: '棕色在自然中代表大地和树木，在文化中象征稳定、可靠和传统。',
    energyLevel: 70,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深棕', hex: '#5C2E0A' },
      { time: '上午 (9-12点)', color: '正棕', hex: '#8B4513' },
      { time: '下午 (12-18点)', color: '亮棕', hex: '#A0522D' },
      { time: '晚上 (18-24点)', color: '暗棕', hex: '#654321' }
    ]
  },
  teal: {
    name: '青色',
    hex: '#20B2AA',
    rgb: '32, 178, 170',
    meaning: '清新、平衡、沟通',
    suggestions: ['适合沟通交流', '带来平衡感', '提升表达能力', '促进和谐'],
    compatibleColors: ['白色', '蓝色', '绿色'],
    element: '水',
    energy: '清新平衡',
    psychology: '青色结合了蓝色的冷静和绿色的生机，能带来平衡和和谐，促进沟通和理解。',
    culture: '青色在东方文化中代表青春和活力，在西方文化中象征清新和现代感。',
    energyLevel: 75,
    timeSlots: [
      { time: '早晨 (6-9点)', color: '深青', hex: '#008B8B' },
      { time: '上午 (9-12点)', color: '正青', hex: '#20B2AA' },
      { time: '下午 (12-18点)', color: '亮青', hex: '#40D4CC' },
      { time: '晚上 (18-24点)', color: '暗青', hex: '#006B6B' }
    ]
  }
}

// 根据日期生成幸运色
function generateLuckyColor(date: Date): ColorInfo {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // 基于日期计算一个稳定的随机数
  const seed = year * 10000 + month * 100 + day
  const colors = Object.keys(colorDatabase)
  const colorIndex = seed % colors.length
  
  return colorDatabase[colors[colorIndex]]
}

// 获取今日的辅助色（与主色搭配）
function getSecondaryColor(mainColor: ColorInfo): ColorInfo {
  const compatible = mainColor.compatibleColors
  if (compatible.length === 0 || compatible[0] === '所有颜色') {
    // 如果兼容所有颜色，选择一个对比色
    const contrastColors = ['white', 'black', 'silver']
    const seed = new Date().getDate()
    const selected = contrastColors[seed % contrastColors.length]
    return colorDatabase[selected] || mainColor
  }
  
  // 从兼容色中选择一个
  const seed = new Date().getDate() + 7
  const selectedName = compatible[seed % compatible.length]
  const found = Object.values(colorDatabase).find(c => c.name === selectedName)
  return found || mainColor
}

function LuckyColor({ onBack: _onBack }: LuckyColorProps) {
  const today = new Date()
  const luckyColor = useMemo(() => generateLuckyColor(today), [])
  const secondaryColor = useMemo(() => getSecondaryColor(luckyColor), [luckyColor])
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [currentTimeSlot, setCurrentTimeSlot] = useState<string>('')
  
  // 获取当前时段
  useEffect(() => {
    const hour = today.getHours()
    if (hour >= 6 && hour < 9) {
      setCurrentTimeSlot('早晨 (6-9点)')
    } else if (hour >= 9 && hour < 12) {
      setCurrentTimeSlot('上午 (9-12点)')
    } else if (hour >= 12 && hour < 18) {
      setCurrentTimeSlot('下午 (12-18点)')
    } else {
      setCurrentTimeSlot('晚上 (18-24点)')
    }
  }, [today])
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const weekday = weekdays[date.getDay()]
    return `${year}年${month}月${day}日 星期${weekday}`
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedHex(type)
      setTimeout(() => setCopiedHex(null), 2000)
    } catch (err) {
      alert('复制失败，请手动复制')
    }
  }

  const shareColor = async () => {
    const shareText = `🎨 今日幸运色：${luckyColor.name}\n颜色代码：${luckyColor.hex}\n含义：${luckyColor.meaning}\n能量：${luckyColor.energy}\n\n来自：命运工坊 🔮`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🎨 每日幸运色',
          text: shareText,
        })
      } catch (err) {
        copyToClipboard(shareText, 'share')
      }
    } else {
      copyToClipboard(shareText, 'share')
    }
  }

  const getCurrentTimeColor = () => {
    if (!luckyColor.timeSlots) return luckyColor.hex
    const slot = luckyColor.timeSlots.find(s => s.time === currentTimeSlot)
    return slot ? slot.hex : luckyColor.hex
  }

  return (
    <div className="lucky-color">
      <div className="lucky-color-header">
        <h2>🎨 每日幸运色</h2>
      </div>

      <div className="lucky-color-date">
        {formatDate(today)}
      </div>

      <div className="color-display-section">
        <div className="main-color-card">
          <div 
            className="color-swatch main-swatch"
            style={{ backgroundColor: getCurrentTimeColor() }}
          >
            <div className="color-overlay">
              <div className="color-name">{luckyColor.name}</div>
              <div className="color-hex-container">
                <span className="color-hex">{luckyColor.hex}</span>
                <button 
                  className="copy-hex-btn"
                  onClick={() => copyToClipboard(luckyColor.hex, 'hex')}
                  title="复制颜色代码"
                >
                  {copiedHex === 'hex' ? '✓' : '📋'}
                </button>
              </div>
              {luckyColor.energyLevel && (
                <div className="energy-level">
                  <span className="energy-label">能量值：</span>
                  <div className="energy-bar">
                    <div 
                      className="energy-fill"
                      style={{ width: `${luckyColor.energyLevel}%` }}
                    />
                  </div>
                  <span className="energy-value">{luckyColor.energyLevel}</span>
                </div>
              )}
            </div>
          </div>
          <div className="color-info">
            <h3>今日主色</h3>
            <p className="color-meaning">{luckyColor.meaning}</p>
            <div className="color-meta">
              <span className="color-element">五行：{luckyColor.element}</span>
              <span className="color-energy">能量：{luckyColor.energy}</span>
            </div>
            <button 
              className="toggle-details-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? '收起详情' : '查看详情'}
            </button>
          </div>
        </div>

        <div className="secondary-color-card">
          <div 
            className="color-swatch secondary-swatch"
            style={{ backgroundColor: secondaryColor.hex }}
          >
            <div className="color-overlay">
              <div className="color-name">{secondaryColor.name}</div>
              <div className="color-hex">{secondaryColor.hex}</div>
            </div>
          </div>
          <div className="color-info">
            <h3>搭配色</h3>
            <p className="color-meaning">{secondaryColor.meaning}</p>
          </div>
        </div>
      </div>

      <div className="color-suggestions">
        <h3>✨ 今日建议</h3>
        <ul className="suggestions-list">
          {luckyColor.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>

      <div className="color-usage">
        <h3>💡 使用建议</h3>
        <div className="usage-grid">
          <div className="usage-item">
            <div className="usage-icon">👔</div>
            <div className="usage-text">穿搭</div>
            <div className="usage-desc">选择含有{luckyColor.name}元素的服饰</div>
          </div>
          <div className="usage-item">
            <div className="usage-icon">🏠</div>
            <div className="usage-text">环境</div>
            <div className="usage-desc">在环境中点缀{luckyColor.name}装饰</div>
          </div>
          <div className="usage-item">
            <div className="usage-icon">📱</div>
            <div className="usage-text">配饰</div>
            <div className="usage-desc">佩戴{luckyColor.name}色的小物件</div>
          </div>
          <div className="usage-item">
            <div className="usage-icon">🎨</div>
            <div className="usage-text">搭配</div>
            <div className="usage-desc">与{secondaryColor.name}搭配使用效果更佳</div>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="color-details">
          {luckyColor.psychology && (
            <div className="detail-section">
              <h3>🧠 心理学意义</h3>
              <p>{luckyColor.psychology}</p>
            </div>
          )}
          {luckyColor.culture && (
            <div className="detail-section">
              <h3>🌍 文化背景</h3>
              <p>{luckyColor.culture}</p>
            </div>
          )}
        </div>
      )}

      {luckyColor.timeSlots && luckyColor.timeSlots.length > 0 && (
        <div className="time-slots-section">
          <h3>⏰ 时段幸运色</h3>
          <div className="time-slots-grid">
            {luckyColor.timeSlots.map((slot, index) => (
              <div 
                key={index} 
                className={`time-slot-item ${slot.time === currentTimeSlot ? 'active' : ''}`}
              >
                <div 
                  className="time-slot-color"
                  style={{ backgroundColor: slot.hex }}
                />
                <div className="time-slot-info">
                  <div className="time-slot-time">{slot.time}</div>
                  <div className="time-slot-name">{slot.color}</div>
                  <div className="time-slot-hex">{slot.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="color-compatibility">
        <h3>🌈 配色方案</h3>
        <div className="compatible-colors">
          {luckyColor.compatibleColors.map((color, index) => {
            const colorInfo = Object.values(colorDatabase).find(c => c.name === color)
            if (!colorInfo) return null
            return (
              <div key={index} className="compatible-color-item">
                <div 
                  className="compatible-swatch"
                  style={{ backgroundColor: colorInfo.hex }}
                />
                <span>{color}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="color-actions">
        <button className="share-btn" onClick={shareColor}>
          📤 分享幸运色
        </button>
      </div>
    </div>
  )
}

export default LuckyColor

