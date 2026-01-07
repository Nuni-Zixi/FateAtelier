import { useState } from 'react'
import { ReadingType, readingTypes } from '../types/reading'
import './ReadingTypeSelector.css'
import { toast } from '../utils/toast'

interface ReadingTypeSelectorProps {
  onSelect: (type: ReadingType, customQuestion?: string) => void
  onCancel: () => void
}

function ReadingTypeSelector({ onSelect, onCancel }: ReadingTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<ReadingType | null>(null)
  const [customQuestion, setCustomQuestion] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleTypeClick = (type: ReadingType) => {
    if (type === 'custom') {
      setShowCustomInput(true)
      setSelectedType('custom')
    } else {
      setSelectedType(type)
      setShowCustomInput(false)
    }
  }

  const handleConfirm = () => {
    if (selectedType) {
      if (selectedType === 'custom' && !customQuestion.trim()) {
        toast.warning('请输入您的问题')
        return
      }
      onSelect(selectedType, selectedType === 'custom' ? customQuestion : undefined)
    }
  }

  return (
    <div 
      className="reading-type-overlay" 
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reading-type-title"
      aria-describedby="reading-type-description"
      style={{ 
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
      }}
    >
      <div className="reading-type-container" onClick={(e) => e.stopPropagation()}>
        <div className="reading-type-header">
          <h2 id="reading-type-title">选择占卜类型</h2>
          <button 
            className="close-type-selector" 
            onClick={onCancel}
            aria-label="关闭选择器"
          >
            ✕
          </button>
        </div>

        <div className="reading-type-grid" role="radiogroup" aria-labelledby="reading-type-title">
          {readingTypes.map((type) => (
            <div
              key={type.id}
              className={`reading-type-card ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => handleTypeClick(type.id)}
              role="radio"
              aria-checked={selectedType === type.id}
              aria-label={`${type.name}: ${type.description}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleTypeClick(type.id)
                }
              }}
            >
              <div className="reading-type-icon" aria-hidden="true">{type.icon}</div>
              <div className="reading-type-name">{type.name}</div>
              <div className="reading-type-desc">{type.description}</div>
            </div>
          ))}
        </div>

        {showCustomInput && (
          <div className="custom-question-input">
            <label htmlFor="custom-question-textarea">请输入您的问题：</label>
            <textarea
              id="custom-question-textarea"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="例如：我最近的工作会顺利吗？"
              rows={3}
              className="custom-question-textarea"
              aria-label="自定义问题输入框"
              aria-required="true"
            />
          </div>
        )}

        <div className="reading-type-actions">
          <button 
            className="cancel-btn" 
            onClick={onCancel}
            aria-label="取消选择"
          >
            取消
          </button>
          <button 
            className="confirm-btn" 
            onClick={handleConfirm}
            disabled={!selectedType || (selectedType === 'custom' && !customQuestion.trim())}
            aria-label="确认并开始占卜"
          >
            开始占卜
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReadingTypeSelector

