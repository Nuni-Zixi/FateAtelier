import { DrawnCard } from '../types'
import { generateThreeCardReading } from '../utils/readingInterpretation'
import './ReadingHistory.css'

interface ReadingHistoryProps {
  readings: ReadingRecord[]
  onViewReading: (reading: ReadingRecord) => void
  onDeleteReading: (id: string) => void
}

export interface ReadingRecord {
  id: string
  type: 'single' | 'three'
  cards: DrawnCard[]
  timestamp: number
  interpretation?: ReturnType<typeof generateThreeCardReading>
}

function ReadingHistory({ readings, onViewReading, onDeleteReading }: ReadingHistoryProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (readings.length === 0) {
    return (
      <div className="reading-history empty">
        <p>暂无占卜记录</p>
      </div>
    )
  }

  return (
    <div className="reading-history">
      <h3>📜 占卜历史</h3>
      <div className="history-list">
        {readings.map((reading) => (
          <div key={reading.id} className="history-item">
            <div className="history-header">
              <div className="history-info">
                <span className="history-type">
                  {reading.type === 'single' ? '🎴 单牌' : '🔮 三牌占卜'}
                </span>
                <span className="history-date">{formatDate(reading.timestamp)}</span>
              </div>
              <div className="history-actions">
                <button 
                  className="view-btn"
                  onClick={() => onViewReading(reading)}
                >
                  查看
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => onDeleteReading(reading.id)}
                >
                  删除
                </button>
              </div>
            </div>
            {reading.type === 'three' && reading.interpretation && (
              <div className="history-preview">
                <p className="preview-text">{reading.interpretation.summary}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReadingHistory

