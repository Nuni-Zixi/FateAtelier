import { useState, useMemo } from 'react'
import './NumberEnergy.css'

interface NumberEnergyProps {
  onBack: () => void
}

// 数字类型
type NumberType = 'phone' | 'plate' | 'id' | 'other'

interface NumberTypeOption {
  id: NumberType
  name: string
  icon: string
  description: string
  placeholder: string
}

const numberTypes: NumberTypeOption[] = [
  { id: 'phone', name: '手机号', icon: '📱', description: '分析手机号码的能量', placeholder: '请输入11位手机号' },
  { id: 'plate', name: '车牌号', icon: '🚗', description: '分析车牌号码的能量', placeholder: '请输入车牌号（如：京A12345）' },
  { id: 'id', name: '身份证号', icon: '🆔', description: '分析身份证号码的能量', placeholder: '请输入18位身份证号' },
  { id: 'other', name: '其他数字', icon: '🔢', description: '分析任意数字的能量', placeholder: '请输入数字' },
]

// 数字能量含义（扩展版）
interface NumberMeaning {
  meaning: string
  energy: 'positive' | 'neutral' | 'negative'
  wuxing?: string  // 五行
  direction?: string  // 方位
  color?: string  // 对应颜色
  personality?: string  // 性格特征
  career?: string  // 职业建议
  health?: string  // 健康提示
  relationship?: string  // 人际关系
  wealth?: string  // 财运
  detail?: string  // 详细解释
}

const numberMeanings: { [key: string]: NumberMeaning } = {
  '0': { 
    meaning: '无限、圆满、起点', 
    energy: 'neutral',
    wuxing: '土',
    direction: '中',
    color: '白色',
    personality: '包容、开放、无限可能',
    career: '适合创新领域、自由职业',
    health: '注意循环系统',
    relationship: '善于包容，人际关系和谐',
    wealth: '财运平稳，需要主动创造',
    detail: '0代表无限和起点，象征新的开始和无限可能。在数字能量中，0具有放大其他数字能量的作用。'
  },
  '1': { 
    meaning: '独立、领导、创新', 
    energy: 'positive',
    wuxing: '水',
    direction: '北',
    color: '黑色、深蓝',
    personality: '独立自主、有领导力、创新思维',
    career: '适合管理、创业、科技领域',
    health: '注意肾脏和泌尿系统',
    relationship: '独立性强，需要个人空间',
    wealth: '财运佳，适合投资和创业',
    detail: '1是数字之首，代表独立、领导力和创新精神。拥有1能量的人通常具有强烈的自我意识和领导才能。'
  },
  '2': { 
    meaning: '合作、平衡、和谐', 
    energy: 'positive',
    wuxing: '土',
    direction: '西南',
    color: '黄色、橙色',
    personality: '温和、合作、善于平衡',
    career: '适合合作、协调、服务行业',
    health: '注意脾胃和消化系统',
    relationship: '善于合作，人际关系和谐',
    wealth: '财运平稳，适合合作投资',
    detail: '2代表合作与平衡，象征和谐与配合。拥有2能量的人通常善于合作，能够平衡各方关系。'
  },
  '3': { 
    meaning: '创意、表达、社交', 
    energy: 'positive',
    wuxing: '火',
    direction: '东',
    color: '红色、紫色',
    personality: '创意丰富、表达力强、社交活跃',
    career: '适合艺术、传媒、创意行业',
    health: '注意心脏和血液循环',
    relationship: '社交活跃，人际关系广泛',
    wealth: '财运波动，适合创意变现',
    detail: '3代表创意与表达，象征社交与活力。拥有3能量的人通常创意丰富，表达能力强，社交活跃。'
  },
  '4': { 
    meaning: '稳定、务实、秩序', 
    energy: 'neutral',
    wuxing: '木',
    direction: '东南',
    color: '绿色',
    personality: '稳重、务实、注重秩序',
    career: '适合建筑、工程、管理',
    health: '注意肝胆和神经系统',
    relationship: '稳定可靠，但可能过于保守',
    wealth: '财运稳定，适合稳健投资',
    detail: '4代表稳定与秩序，象征务实与可靠。虽然在某些文化中被视为不吉利，但4也代表稳定和坚实的基础。'
  },
  '5': { 
    meaning: '自由、变化、冒险', 
    energy: 'neutral',
    wuxing: '土',
    direction: '中',
    color: '黄色、棕色',
    personality: '自由、变化、喜欢冒险',
    career: '适合销售、旅游、自由职业',
    health: '注意脾胃和消化系统',
    relationship: '自由随性，需要个人空间',
    wealth: '财运变化大，需要灵活应对',
    detail: '5代表自由与变化，象征冒险与探索。拥有5能量的人通常喜欢自由，适应能力强，但需要保持稳定。'
  },
  '6': { 
    meaning: '责任、关爱、家庭', 
    energy: 'positive',
    wuxing: '金',
    direction: '西北',
    color: '金色、白色',
    personality: '负责任、关爱他人、重视家庭',
    career: '适合教育、医疗、服务行业',
    health: '注意呼吸系统和皮肤',
    relationship: '重视家庭，人际关系和谐',
    wealth: '财运稳定，适合长期投资',
    detail: '6代表责任与关爱，象征家庭与和谐。拥有6能量的人通常负责任，关爱他人，重视家庭关系。'
  },
  '7': { 
    meaning: '智慧、神秘、内省', 
    energy: 'positive',
    wuxing: '金',
    direction: '西',
    color: '银色、白色',
    personality: '智慧、神秘、喜欢内省',
    career: '适合研究、分析、咨询',
    health: '注意呼吸系统和皮肤',
    relationship: '深度思考，人际关系需要理解',
    wealth: '财运平稳，适合知识变现',
    detail: '7代表智慧与神秘，象征内省与深度。拥有7能量的人通常智慧超群，喜欢深度思考，具有神秘感。'
  },
  '8': { 
    meaning: '财富、权力、成功', 
    energy: 'positive',
    wuxing: '土',
    direction: '东北',
    color: '金色、黄色',
    personality: '追求成功、有权力欲、务实',
    career: '适合商业、金融、管理',
    health: '注意脾胃和消化系统',
    relationship: '重视事业，人际关系以利益为主',
    wealth: '财运极佳，适合投资和创业',
    detail: '8代表财富与成功，象征权力与成就。拥有8能量的人通常追求成功，有强烈的权力欲和财富欲。'
  },
  '9': { 
    meaning: '完成、智慧、博爱', 
    energy: 'positive',
    wuxing: '火',
    direction: '南',
    color: '红色、紫色',
    personality: '智慧、博爱、追求完美',
    career: '适合教育、慈善、领导',
    health: '注意心脏和血液循环',
    relationship: '博爱无私，人际关系广泛',
    wealth: '财运良好，适合慈善和投资',
    detail: '9代表完成与智慧，象征博爱与圆满。拥有9能量的人通常智慧超群，具有博爱精神，追求完美。'
  },
}

// 数字组合含义（扩展版）
interface CombinationInfo {
  meaning: string
  energy: 'positive' | 'neutral' | 'negative'
  detail?: string
  suggestion?: string
}

const combinationMeanings: { [key: string]: CombinationInfo } = {
  '11': { 
    meaning: '双一：领导力强，独立自主', 
    energy: 'positive',
    detail: '双1组合代表极强的领导力和独立性，适合创业和管理。',
    suggestion: '适合担任领导职务，发挥独立创新能力。'
  },
  '22': { 
    meaning: '双二：合作共赢，和谐平衡', 
    energy: 'positive',
    detail: '双2组合代表极强的合作能力和平衡感，适合团队合作。',
    suggestion: '适合合作项目，发挥协调和平衡能力。'
  },
  '33': { 
    meaning: '双三：创意无限，表达力强', 
    energy: 'positive',
    detail: '双3组合代表极强的创意和表达能力，适合艺术创作。',
    suggestion: '适合创意工作，发挥表达和社交能力。'
  },
  '44': { 
    meaning: '双四：稳定可靠，务实踏实', 
    energy: 'neutral',
    detail: '双4组合代表极强的稳定性和务实性，适合基础建设。',
    suggestion: '适合稳健发展，注重基础和秩序。'
  },
  '55': { 
    meaning: '双五：变化多端，自由灵活', 
    energy: 'neutral',
    detail: '双5组合代表极强的变化和适应能力，需要保持稳定。',
    suggestion: '适合灵活应对，但需要建立稳定的基础。'
  },
  '66': { 
    meaning: '双六：责任重大，关爱他人', 
    energy: 'positive',
    detail: '双6组合代表极强的责任感和关爱精神，适合服务他人。',
    suggestion: '适合服务行业，发挥责任和关爱能力。'
  },
  '77': { 
    meaning: '双七：智慧超群，神秘深邃', 
    energy: 'positive',
    detail: '双7组合代表极强的智慧和深度思考能力，适合研究分析。',
    suggestion: '适合研究领域，发挥智慧和深度思考能力。'
  },
  '88': { 
    meaning: '双八：财富丰盈，权力显赫', 
    energy: 'positive',
    detail: '双8组合代表极强的财富和权力能量，适合商业投资。',
    suggestion: '适合商业投资，发挥财富和权力优势。'
  },
  '99': { 
    meaning: '双九：智慧圆满，博爱无私', 
    energy: 'positive',
    detail: '双9组合代表极强的智慧和博爱精神，适合教育和慈善。',
    suggestion: '适合教育和慈善，发挥智慧和博爱精神。'
  },
  '123': { 
    meaning: '顺子：步步高升，顺利发展', 
    energy: 'positive',
    detail: '123顺子代表循序渐进，步步高升，发展顺利。',
    suggestion: '适合稳步发展，循序渐进，不可急于求成。'
  },
  '321': { 
    meaning: '倒顺：回归本源，重新开始', 
    energy: 'neutral',
    detail: '321倒顺代表回归本源，重新开始，需要反思和调整。',
    suggestion: '适合反思过去，重新规划，寻找新的方向。'
  },
  '888': { 
    meaning: '三连八：财富三倍，大富大贵', 
    energy: 'positive',
    detail: '三连8代表极强的财富能量，大富大贵的象征。',
    suggestion: '适合大额投资，发挥财富优势，但需注意平衡。'
  },
  '666': { 
    meaning: '三连六：责任三倍，关爱无限', 
    energy: 'positive',
    detail: '三连6代表极强的责任和关爱能量，适合服务他人。',
    suggestion: '适合服务行业，发挥责任和关爱能力，但需注意自我。'
  },
  '999': { 
    meaning: '三连九：智慧三倍，圆满成功', 
    energy: 'positive',
    detail: '三连9代表极强的智慧和圆满能量，适合教育和领导。',
    suggestion: '适合教育和领导，发挥智慧和博爱精神，追求圆满。'
  },
  '108': { 
    meaning: '一零八：圆满成功，功德圆满', 
    energy: 'positive',
    detail: '108在佛教中代表圆满，象征功德圆满和成功。',
    suggestion: '适合追求圆满和成功，注重积累和功德。'
  },
  '168': { 
    meaning: '一路发：一路发财，持续成功', 
    energy: 'positive',
    detail: '168谐音"一路发"，代表持续的成功和财富。',
    suggestion: '适合持续投资，保持成功势头，一路发展。'
  },
  '520': { 
    meaning: '我爱你：情感和谐，关系美满', 
    energy: 'positive',
    detail: '520谐音"我爱你"，代表情感和谐和关系美满。',
    suggestion: '适合情感关系，注重沟通和和谐，表达爱意。'
  },
}

// 计算数字总和
function calculateSum(numbers: string): number {
  return numbers.split('').reduce((sum, char) => {
    const num = parseInt(char)
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
}

// 计算数字总和直到个位数
function reduceToSingleDigit(num: number): number {
  while (num >= 10) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  }
  return num
}

// 分析数字能量
function analyzeNumberEnergy(input: string, type: NumberType) {
  // 提取数字
  const numbers = input.replace(/\D/g, '')
  
  if (numbers.length === 0) {
    return null
  }

  // 数字统计
  const digitCount: { [key: string]: number } = {}
  numbers.split('').forEach(digit => {
    digitCount[digit] = (digitCount[digit] || 0) + 1
  })

  // 计算总和
  const sum = calculateSum(numbers)
  const finalDigit = reduceToSingleDigit(sum)

  // 分析数字组合（返回详细信息）
  const combinations: Array<{ combo: string; info: CombinationInfo }> = []
  for (let i = 0; i < numbers.length - 1; i++) {
    const twoDigit = numbers.substring(i, i + 2)
    if (combinationMeanings[twoDigit]) {
      combinations.push({ combo: twoDigit, info: combinationMeanings[twoDigit] })
    }
    if (i < numbers.length - 2) {
      const threeDigit = numbers.substring(i, i + 3)
      if (combinationMeanings[threeDigit]) {
        combinations.push({ combo: threeDigit, info: combinationMeanings[threeDigit] })
      }
    }
  }
  // 去重
  const uniqueCombinations = Array.from(
    new Map(combinations.map(item => [item.combo, item])).values()
  )

  // 计算能量评分（0-100）
  let score = 50 // 基础分

  // 根据最终数字调整
  if (finalDigit === 1 || finalDigit === 6 || finalDigit === 8) score += 15
  else if (finalDigit === 2 || finalDigit === 3 || finalDigit === 7 || finalDigit === 9) score += 10
  else if (finalDigit === 4) score -= 5
  else if (finalDigit === 5) score += 5

  // 根据数字组合调整
  score += uniqueCombinations.length * 5
  // 根据组合能量调整
  uniqueCombinations.forEach(({ info }) => {
    if (info.energy === 'positive') score += 3
    else if (info.energy === 'negative') score -= 2
  })

  // 根据数字含义调整
  const positiveCount = Object.keys(digitCount).filter(d => numberMeanings[d]?.energy === 'positive').length
  const negativeCount = Object.keys(digitCount).filter(d => numberMeanings[d]?.energy === 'negative').length
  score += positiveCount * 3
  score -= negativeCount * 2

  // 根据类型调整
  if (type === 'phone' && numbers.length === 11) score += 5
  else if (type === 'id' && numbers.length === 18) score += 5
  else if (type === 'plate' && numbers.length >= 5) score += 5

  // 限制在 0-100 之间
  score = Math.max(0, Math.min(100, score))

  // 判断等级
  let level: 'excellent' | 'good' | 'average' | 'poor'
  let levelText: string
  let levelColor: string

  if (score >= 80) {
    level = 'excellent'
    levelText = '极佳'
    levelColor = '#4ade80'
  } else if (score >= 60) {
    level = 'good'
    levelText = '良好'
    levelColor = '#60a5fa'
  } else if (score >= 40) {
    level = 'average'
    levelText = '一般'
    levelColor = '#fbbf24'
  } else {
    level = 'poor'
    levelText = '较差'
    levelColor = '#f87171'
  }

  // 生成建议
  const suggestions: string[] = []
  
  if (score < 60) {
    suggestions.push('建议选择包含更多吉利数字（1、6、8、9）的组合')
    suggestions.push('避免过多使用数字4，可考虑用其他数字替代')
  }
  
  if (uniqueCombinations.length === 0) {
    suggestions.push('可以尝试选择包含特殊数字组合的号码')
  } else {
    // 添加组合建议
    uniqueCombinations.forEach(({ info }) => {
      if (info.suggestion) {
        suggestions.push(info.suggestion)
      }
    })
  }
  
  if (finalDigit === 4) {
    suggestions.push('最终数字为4，建议调整以改善整体能量')
  }
  
  if (positiveCount < 3) {
    suggestions.push('增加吉利数字的使用频率，提升整体能量')
  }

  if (suggestions.length === 0) {
    suggestions.push('当前数字能量良好，继续保持')
  }

  // 获取最终数字的详细信息
  const finalDigitInfo = numberMeanings[finalDigit.toString()]

  return {
    numbers,
    digitCount,
    sum,
    finalDigit,
    finalDigitInfo,
    combinations: uniqueCombinations,
    score,
    level,
    levelText,
    levelColor,
    suggestions,
  }
}

function NumberEnergy({ onBack }: NumberEnergyProps) {
  const [input, setInput] = useState('')
  const [selectedType, setSelectedType] = useState<NumberType>('phone')
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({})
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const analysis = useMemo(() => {
    if (!input.trim()) return null
    return analyzeNumberEnergy(input, selectedType)
  }, [input, selectedType])

  const selectedTypeInfo = numberTypes.find(t => t.id === selectedType)

  const toggleDetail = (key: string) => {
    setShowDetails(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      alert('复制失败，请手动复制')
    }
  }

  const shareAnalysis = async () => {
    if (!analysis) return
    
    const shareText = `🔢 数字能量分析\n\n数字：${analysis.numbers}\n类型：${selectedTypeInfo?.name}\n能量评分：${analysis.score}/100 (${analysis.levelText})\n最终数字：${analysis.finalDigit}\n\n来自：命运工坊 🔮`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🔢 数字能量分析',
          text: shareText,
        })
      } catch (err) {
        copyToClipboard(shareText)
      }
    } else {
      copyToClipboard(shareText)
    }
  }

  return (
    <div className="number-energy">
      <button className="back-button" onClick={onBack}>
        ← 返回
      </button>

      <div className="number-energy-header">
        <h1>🔢 数字能量</h1>
        <p className="subtitle">分析数字的能量，解读数字背后的含义</p>
      </div>

      <div className="number-energy-content">
        {/* 数字类型选择 */}
        <div className="number-type-section">
          <h2>选择数字类型</h2>
          <div className="number-type-grid">
            {numberTypes.map(type => (
              <div
                key={type.id}
                className={`number-type-card ${selectedType === type.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedType(type.id)
                  setInput('')
                }}
              >
                <div className="type-icon">{type.icon}</div>
                <div className="type-name">{type.name}</div>
                <div className="type-desc">{type.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 输入区域 */}
        <div className="input-section">
          <h2>输入数字</h2>
          <div className="input-wrapper">
            <input
              type="text"
              className="number-input"
              placeholder={selectedTypeInfo?.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={selectedType === 'phone' ? 11 : selectedType === 'id' ? 18 : 50}
            />
            {input && (
              <button className="clear-button" onClick={() => setInput('')}>
                ✕
              </button>
            )}
          </div>
          {selectedType === 'phone' && input.length > 0 && input.length !== 11 && (
            <p className="input-hint">请输入11位手机号</p>
          )}
          {selectedType === 'id' && input.length > 0 && input.length !== 18 && (
            <p className="input-hint">请输入18位身份证号</p>
          )}
        </div>

        {/* 分析结果 */}
        {analysis && (
          <div className="analysis-section">
            <h2>能量分析</h2>

            {/* 总体评分 */}
            <div className="score-card">
              <div className="score-header">
                <span className="score-label">能量评分</span>
                <span className="score-level" style={{ color: analysis.levelColor }}>
                  {analysis.levelText}
                </span>
              </div>
              <div className="score-value">
                <span className="score-number">{analysis.score}</span>
                <span className="score-total">/ 100</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${analysis.score}%`,
                    backgroundColor: analysis.levelColor,
                  }}
                />
              </div>
            </div>

            {/* 数字信息 */}
            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">提取的数字</div>
                <div className="info-value">{analysis.numbers}</div>
              </div>
              <div className="info-card">
                <div className="info-label">数字总和</div>
                <div className="info-value">{analysis.sum}</div>
              </div>
              <div className="info-card">
                <div className="info-label">最终数字</div>
                <div className="info-value highlight">{analysis.finalDigit}</div>
              </div>
            </div>

            {/* 数字统计 */}
            <div className="digit-statistics">
              <h3>数字统计</h3>
              <div className="digit-grid">
                {Object.entries(analysis.digitCount)
                  .sort((a, b) => b[1] - a[1])
                  .map(([digit, count]) => {
                    const meaning = numberMeanings[digit]
                    return (
                      <div key={digit} className="digit-item">
                        <div className="digit-number">{digit}</div>
                        <div className="digit-count">出现 {count} 次</div>
                        {meaning && (
                          <div className={`digit-meaning ${meaning.energy}`}>
                            {meaning.meaning}
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* 数字组合 */}
            {analysis.combinations.length > 0 && (
              <div className="combinations-section">
                <h3>特殊组合</h3>
                <div className="combinations-list">
                  {analysis.combinations.map(({ combo, info }, index) => (
                    <div key={index} className={`combination-item ${info.energy}`}>
                      <div className="combination-header">
                        <span className="combination-number">{combo}</span>
                        <span className="combination-meaning">{info.meaning}</span>
                        <button 
                          className="toggle-detail-btn"
                          onClick={() => toggleDetail(`combo-${index}`)}
                        >
                          {showDetails[`combo-${index}`] ? '收起' : '详情'}
                        </button>
                      </div>
                      {showDetails[`combo-${index}`] && (
                        <div className="combination-detail">
                          {info.detail && <p className="detail-text">{info.detail}</p>}
                          {info.suggestion && (
                            <p className="detail-suggestion">💡 {info.suggestion}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 最终数字详细解读 */}
            {analysis.finalDigitInfo && (
              <div className="final-digit-section">
                <h3>最终数字 {analysis.finalDigit} 详细解读</h3>
                <div className="final-digit-card">
                  <div className="final-digit-header">
                    <div className="final-digit-number">{analysis.finalDigit}</div>
                    <div className="final-digit-basic">
                      <div className="final-digit-meaning">{analysis.finalDigitInfo.meaning}</div>
                      <div className="final-digit-meta">
                        {analysis.finalDigitInfo.wuxing && (
                          <span className="meta-item">五行：{analysis.finalDigitInfo.wuxing}</span>
                        )}
                        {analysis.finalDigitInfo.direction && (
                          <span className="meta-item">方位：{analysis.finalDigitInfo.direction}</span>
                        )}
                        {analysis.finalDigitInfo.color && (
                          <span className="meta-item">颜色：{analysis.finalDigitInfo.color}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {showDetails['final-digit'] ? (
                    <div className="final-digit-details">
                      {analysis.finalDigitInfo.detail && (
                        <p className="detail-text">{analysis.finalDigitInfo.detail}</p>
                      )}
                      <div className="detail-grid">
                        {analysis.finalDigitInfo.personality && (
                          <div className="detail-item">
                            <span className="detail-label">性格：</span>
                            <span className="detail-value">{analysis.finalDigitInfo.personality}</span>
                          </div>
                        )}
                        {analysis.finalDigitInfo.career && (
                          <div className="detail-item">
                            <span className="detail-label">职业：</span>
                            <span className="detail-value">{analysis.finalDigitInfo.career}</span>
                          </div>
                        )}
                        {analysis.finalDigitInfo.health && (
                          <div className="detail-item">
                            <span className="detail-label">健康：</span>
                            <span className="detail-value">{analysis.finalDigitInfo.health}</span>
                          </div>
                        )}
                        {analysis.finalDigitInfo.relationship && (
                          <div className="detail-item">
                            <span className="detail-label">人际：</span>
                            <span className="detail-value">{analysis.finalDigitInfo.relationship}</span>
                          </div>
                        )}
                        {analysis.finalDigitInfo.wealth && (
                          <div className="detail-item">
                            <span className="detail-label">财运：</span>
                            <span className="detail-value">{analysis.finalDigitInfo.wealth}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                  <button 
                    className="toggle-detail-btn"
                    onClick={() => toggleDetail('final-digit')}
                  >
                    {showDetails['final-digit'] ? '收起详情' : '查看详情'}
                  </button>
                </div>
              </div>
            )}

            {/* 数字含义 */}
            <div className="meanings-section">
              <h3>数字含义</h3>
              <div className="meanings-grid">
                {Array.from(new Set(analysis.numbers.split(''))).map(digit => {
                  const meaning = numberMeanings[digit]
                  if (!meaning) return null
                  return (
                    <div 
                      key={digit} 
                      className={`meaning-item ${meaning.energy}`}
                      onClick={() => toggleDetail(`digit-${digit}`)}
                    >
                      <div className="meaning-digit">{digit}</div>
                      <div className="meaning-text">{meaning.meaning}</div>
                      {showDetails[`digit-${digit}`] && (
                        <div className="meaning-detail">
                          {meaning.detail && <p>{meaning.detail}</p>}
                          <div className="meaning-meta">
                            {meaning.wuxing && <span>五行：{meaning.wuxing}</span>}
                            {meaning.direction && <span>方位：{meaning.direction}</span>}
                            {meaning.color && <span>颜色：{meaning.color}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 建议 */}
            <div className="suggestions-section">
              <h3>💡 建议</h3>
              <ul className="suggestions-list">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>

            {/* 操作按钮 */}
            <div className="action-buttons">
              <button className="share-btn" onClick={shareAnalysis}>
                <span>📤</span>
                <span>分享分析结果</span>
              </button>
              <button 
                className="share-btn1" 
                onClick={() => copyToClipboard(analysis.numbers)}
              >
                <span>{copiedText === analysis.numbers ? '✓' : '📋'}</span>
                <span>{copiedText === analysis.numbers ? '已复制' : '复制数字'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 提示信息 */}
        {!analysis && input && (
          <div className="empty-state">
            <p>请输入有效的数字进行分析</p>
          </div>
        )}

        {!input && (
          <div className="empty-state">
            <p>👆 请在上方输入数字开始分析</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NumberEnergy

