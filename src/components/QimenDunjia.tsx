import { useState, useMemo } from 'react'
import './QimenDunjia.css'

interface QimenDunjiaProps {
  onBack?: () => void
}

// 八门
const bamen = ['休门', '死门', '伤门', '杜门', '', '开门', '惊门', '生门', '景门']
const bamenNames = ['休', '死', '伤', '杜', '', '开', '惊', '生', '景']
const bamenMeanings: { [key: string]: { meaning: string; auspicious: boolean; description: string } } = {
  '休门': { meaning: '休息、休养', auspicious: true, description: '主休息、休养、安闲，适合静养、调整' },
  '生门': { meaning: '生长、生机', auspicious: true, description: '主生长、生机、希望，适合创业、发展' },
  '开门': { meaning: '开放、通达', auspicious: true, description: '主开放、通达、顺利，适合开始新事物' },
  '景门': { meaning: '光明、美景', auspicious: true, description: '主光明、美景、文化，适合学习、展示' },
  '死门': { meaning: '死亡、终结', auspicious: false, description: '主死亡、终结、闭塞，不宜行动' },
  '惊门': { meaning: '惊恐、不安', auspicious: false, description: '主惊恐、不安、变动，需谨慎' },
  '伤门': { meaning: '伤害、损失', auspicious: false, description: '主伤害、损失、争斗，需避免冲突' },
  '杜门': { meaning: '阻塞、封闭', auspicious: false, description: '主阻塞、封闭、隐藏，宜保守' }
}

// 九星
const jiuxing = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英']
const jiuxingNames = ['蓬', '芮', '冲', '辅', '禽', '心', '柱', '任', '英']
const jiuxingMeanings: { [key: string]: { meaning: string; auspicious: boolean; description: string } } = {
  '天蓬': { meaning: '大盗之星', auspicious: false, description: '主盗贼、破败，需防小人' },
  '天芮': { meaning: '病符之星', auspicious: false, description: '主疾病、问题，需注意健康' },
  '天冲': { meaning: '雷震之星', auspicious: true, description: '主雷震、行动，适合快速行动' },
  '天辅': { meaning: '文曲之星', auspicious: true, description: '主文曲、智慧，适合学习、教育' },
  '天禽': { meaning: '中正之星', auspicious: true, description: '主中正、稳定，适合决策' },
  '天心': { meaning: '天医之星', auspicious: true, description: '主天医、治疗，适合求医、养生' },
  '天柱': { meaning: '破军之星', auspicious: false, description: '主破军、破坏，需谨慎' },
  '天任': { meaning: '左辅之星', auspicious: true, description: '主左辅、帮助，适合合作' },
  '天英': { meaning: '右弼之星', auspicious: true, description: '主右弼、光明，适合展示' }
}

// 八神
const bashen = ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天']
const bashenNames = ['符', '蛇', '阴', '合', '虎', '武', '地', '天']
const bashenMeanings: { [key: string]: { meaning: string; auspicious: boolean; description: string } } = {
  '值符': { meaning: '领导、权威', auspicious: true, description: '主领导、权威，代表最高能量' },
  '腾蛇': { meaning: '虚诈、变化', auspicious: false, description: '主虚诈、变化，需防欺骗' },
  '太阴': { meaning: '阴柔、隐藏', auspicious: true, description: '主阴柔、隐藏，适合暗中行动' },
  '六合': { meaning: '和合、合作', auspicious: true, description: '主和合、合作，适合合作、婚姻' },
  '白虎': { meaning: '凶险、争斗', auspicious: false, description: '主凶险、争斗，需避免冲突' },
  '玄武': { meaning: '盗贼、小人', auspicious: false, description: '主盗贼、小人，需防小人' },
  '九地': { meaning: '稳定、保守', auspicious: true, description: '主稳定、保守，适合守成' },
  '九天': { meaning: '高远、发展', auspicious: true, description: '主高远、发展，适合开拓' }
}

// 方位
const directions = ['东', '东南', '南', '西南', '中', '西', '西北', '北', '东北']
const directionAngles: { [key: string]: number } = {
  '东': 90, '东南': 135, '南': 180, '西南': 225,
  '中': 0, '西': 270, '西北': 315, '北': 0, '东北': 45
}

// 九宫格位置（从左上到右下）
const palacePositions = [
  { row: 0, col: 0, name: '巽宫', direction: '东南' },
  { row: 0, col: 1, name: '离宫', direction: '南' },
  { row: 0, col: 2, name: '坤宫', direction: '西南' },
  { row: 1, col: 0, name: '震宫', direction: '东' },
  { row: 1, col: 1, name: '中宫', direction: '中' },
  { row: 1, col: 2, name: '兑宫', direction: '西' },
  { row: 2, col: 0, name: '艮宫', direction: '东北' },
  { row: 2, col: 1, name: '坎宫', direction: '北' },
  { row: 2, col: 2, name: '乾宫', direction: '西北' }
]

// 计算时干支
function calculateShiGanZhi(year: number, month: number, day: number, hour: number): string {
  const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  
  // 简化计算：使用日期和时辰的组合
  const dateValue = year * 10000 + month * 100 + day
  const hourIndex = Math.floor(hour / 2) % 12
  
  const ganIndex = (dateValue % 10 + hourIndex) % 10
  const zhiIndex = hourIndex
  
  return tiangan[ganIndex] + dizhi[zhiIndex]
}

// 计算奇门遁甲盘
function calculateQimenPan(
  year: number,
  month: number,
  day: number,
  hour: number,
  direction: string
): {
  palaces: Array<{
    name: string
    direction: string
    bamen: string
    jiuxing: string
    bashen: string
    auspicious: boolean
    score: number
  }>
  overallAnalysis: string
  directionAnalysis: string
  timeAnalysis: string
} {
  const shiGanZhi = calculateShiGanZhi(year, month, day, hour)
  
  // 基于时间和方位的确定性计算
  const seed = year * 1000000 + month * 10000 + day * 100 + hour
  const directionIndex = directions.indexOf(direction)
  
  // 计算八门位置（简化算法）
  const bamenStart = (seed % 8 + directionIndex) % 8
  const bamenPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
    if (i === 4) return '' // 中宫无门
    const bamenIdx = (bamenStart + i) % 8
    return bamen[bamenIdx]
  })
  
  // 计算九星位置
  const jiuxingStart = (seed * 3 % 9 + directionIndex) % 9
  const jiuxingPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
    const jiuxingIdx = (jiuxingStart + i) % 9
    return jiuxing[jiuxingIdx]
  })
  
  // 计算八神位置（八神循环，中宫用值符）
  const bashenStart = (seed * 5 % 8 + directionIndex) % 8
  const bashenPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
    if (i === 4) return '值符' // 中宫用值符
    const bashenIdx = (bashenStart + i) % 8
    return bashen[bashenIdx]
  })
  
  // 生成九宫格数据
  const palaces = palacePositions.map((pos, index) => {
    const bamenName = bamenPositions[index]
    const jiuxingName = jiuxingPositions[index]
    const bashenName = bashenPositions[index]
    
    // 计算吉凶分数
    let score = 50 // 基础分
    if (bamenName && bamenMeanings[bamenName]) {
      score += bamenMeanings[bamenName].auspicious ? 15 : -15
    }
    if (jiuxingMeanings[jiuxingName]) {
      score += jiuxingMeanings[jiuxingName].auspicious ? 15 : -15
    }
    if (bashenMeanings[bashenName]) {
      score += bashenMeanings[bashenName].auspicious ? 10 : -10
    }
    
    // 如果是指定方位，额外加分
    if (pos.direction === direction) {
      score += 20
    }
    
    const auspicious = score >= 60
    
    return {
      name: pos.name,
      direction: pos.direction,
      bamen: bamenName,
      jiuxing: jiuxingName,
      bashen: bashenName,
      auspicious,
      score: Math.max(0, Math.min(100, score))
    }
  })
  
  // 分析指定方位
  const targetPalace = palaces.find(p => p.direction === direction) || palaces[4]
  const directionAnalysis = targetPalace.auspicious
    ? `${direction}方位为吉，${targetPalace.bamen ? `遇${targetPalace.bamen}，` : ''}${targetPalace.jiuxing}临，${targetPalace.bashen}护，适合${direction}方行动。`
    : `${direction}方位为凶，${targetPalace.bamen ? `遇${targetPalace.bamen}，` : ''}${targetPalace.jiuxing}临，${targetPalace.bashen}现，不宜${direction}方行动。`
  
  // 时间分析
  const timeAnalysis = `时干支：${shiGanZhi}。此时${targetPalace.auspicious ? '吉' : '凶'}，${targetPalace.bamen ? `${targetPalace.bamen}主${bamenMeanings[targetPalace.bamen]?.meaning}，` : ''}${targetPalace.jiuxing}主${jiuxingMeanings[targetPalace.jiuxing]?.meaning}，${targetPalace.bashen}主${bashenMeanings[targetPalace.bashen]?.meaning}。`
  
  // 整体分析
  const auspiciousCount = palaces.filter(p => p.auspicious).length
  const overallAnalysis = `当前盘面：${auspiciousCount}宫为吉，${9 - auspiciousCount}宫为凶。${targetPalace.auspicious ? '整体趋势向好' : '整体趋势需谨慎'}，建议${targetPalace.auspicious ? '把握时机' : '保守行事'}。`
  
  return {
    palaces,
    overallAnalysis,
    directionAnalysis,
    timeAnalysis
  }
}

function QimenDunjia({ onBack: _onBack }: QimenDunjiaProps) {
  const today = new Date()
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1)
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [selectedHour, setSelectedHour] = useState(today.getHours())
  const [selectedDirection, setSelectedDirection] = useState('东')
  
  const result = useMemo(() => {
    return calculateQimenPan(selectedYear, selectedMonth, selectedDay, selectedHour, selectedDirection)
  }, [selectedYear, selectedMonth, selectedDay, selectedHour, selectedDirection])
  
  const resetToNow = () => {
    const now = new Date()
    setSelectedYear(now.getFullYear())
    setSelectedMonth(now.getMonth() + 1)
    setSelectedDay(now.getDate())
    setSelectedHour(now.getHours())
  }
  
  return (
    <div className="qimen-dunjia">
      <div className="qimen-header">
        <h1>🔮 奇门遁甲</h1>
        <p className="qimen-subtitle">传统预测术，分析吉凶方位和时间</p>
      </div>
      
      <div className="qimen-content">
        {/* 时间选择 */}
        <div className="time-selector">
          <h3>📅 选择时间</h3>
          <div className="time-inputs">
            <div className="time-input-group">
              <label>年</label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value) || 2024)}
                min="1900"
                max="2100"
              />
            </div>
            <div className="time-input-group">
              <label>月</label>
              <input
                type="number"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value) || 1)}
                min="1"
                max="12"
              />
            </div>
            <div className="time-input-group">
              <label>日</label>
              <input
                type="number"
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value) || 1)}
                min="1"
                max="31"
              />
            </div>
            <div className="time-input-group">
              <label>时</label>
              <input
                type="number"
                value={selectedHour}
                onChange={(e) => setSelectedHour(parseInt(e.target.value) || 0)}
                min="0"
                max="23"
              />
            </div>
            <button className="reset-btn" onClick={resetToNow}>
              ⏰ 当前时间
            </button>
          </div>
        </div>
        
        {/* 方位选择 */}
        <div className="direction-selector">
          <h3>🧭 选择方位</h3>
          <div className="direction-buttons">
            {directions.filter(d => d !== '中').map(dir => (
              <button
                key={dir}
                className={`direction-btn ${selectedDirection === dir ? 'active' : ''}`}
                onClick={() => setSelectedDirection(dir)}
                style={{
                  transform: `rotate(${directionAngles[dir]}deg)`,
                  transformOrigin: 'center'
                }}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>
        
        {/* 九宫格盘 */}
        <div className="qimen-pan">
          <h3>📊 奇门遁甲盘</h3>
          <div className="jiugong-grid">
            {result.palaces.map((palace, index) => (
              <div
                key={index}
                className={`palace-cell ${palace.auspicious ? 'auspicious' : 'inauspicious'} ${palace.direction === selectedDirection ? 'selected' : ''}`}
              >
                <div className="palace-header">
                  <div className="palace-name">{palace.name}</div>
                  <div className="palace-direction">{palace.direction}</div>
                </div>
                <div className="palace-content">
                  {palace.bamen && (
                    <div className="palace-item bamen">
                      <span className="item-label">门：</span>
                      <span className={`item-value ${bamenMeanings[palace.bamen]?.auspicious ? 'auspicious' : 'inauspicious'}`}>
                        {bamenNames[bamen.indexOf(palace.bamen)]}
                      </span>
                    </div>
                  )}
                  <div className="palace-item jiuxing">
                    <span className="item-label">星：</span>
                    <span className={`item-value ${jiuxingMeanings[palace.jiuxing]?.auspicious ? 'auspicious' : 'inauspicious'}`}>
                      {jiuxingNames[jiuxing.indexOf(palace.jiuxing)]}
                    </span>
                  </div>
                  <div className="palace-item bashen">
                    <span className="item-label">神：</span>
                    <span className={`item-value ${bashenMeanings[palace.bashen]?.auspicious ? 'auspicious' : 'inauspicious'}`}>
                      {bashenNames[bashen.indexOf(palace.bashen)]}
                    </span>
                  </div>
                </div>
                <div className="palace-score">
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{ width: `${palace.score}%` }}
                    />
                  </div>
                  <span className="score-text">{palace.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 分析结果 */}
        <div className="qimen-analysis">
          <div className="analysis-section">
            <h3>📋 整体分析</h3>
            <p>{result.overallAnalysis}</p>
          </div>
          
          <div className="analysis-section">
            <h3>🧭 方位分析</h3>
            <p>{result.directionAnalysis}</p>
            {result.palaces.find(p => p.direction === selectedDirection) && (
              <div className="direction-detail">
                {(() => {
                  const palace = result.palaces.find(p => p.direction === selectedDirection)!
                  return (
                    <>
                      {palace.bamen && bamenMeanings[palace.bamen] && (
                        <div className="detail-item">
                          <strong>{palace.bamen}：</strong>
                          {bamenMeanings[palace.bamen].description}
                        </div>
                      )}
                      {jiuxingMeanings[palace.jiuxing] && (
                        <div className="detail-item">
                          <strong>{palace.jiuxing}：</strong>
                          {jiuxingMeanings[palace.jiuxing].description}
                        </div>
                      )}
                      {bashenMeanings[palace.bashen] && (
                        <div className="detail-item">
                          <strong>{palace.bashen}：</strong>
                          {bashenMeanings[palace.bashen].description}
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}
          </div>
          
          <div className="analysis-section">
            <h3>⏰ 时间分析</h3>
            <p>{result.timeAnalysis}</p>
          </div>
          
          {/* 吉凶方位建议 */}
          <div className="analysis-section">
            <h3>💡 方位建议</h3>
            <div className="direction-suggestions">
              <div className="suggestion-group">
                <h4>✅ 吉方位</h4>
                <div className="suggestion-list">
                  {result.palaces
                    .filter(p => p.auspicious && p.direction !== '中')
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map(p => (
                      <div key={p.direction} className="suggestion-item auspicious">
                        <span className="suggestion-direction">{p.direction}</span>
                        <span className="suggestion-score">吉分：{p.score}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="suggestion-group">
                <h4>❌ 凶方位</h4>
                <div className="suggestion-list">
                  {result.palaces
                    .filter(p => !p.auspicious && p.direction !== '中')
                    .sort((a, b) => a.score - b.score)
                    .slice(0, 3)
                    .map(p => (
                      <div key={p.direction} className="suggestion-item inauspicious">
                        <span className="suggestion-direction">{p.direction}</span>
                        <span className="suggestion-score">凶分：{p.score}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QimenDunjia

