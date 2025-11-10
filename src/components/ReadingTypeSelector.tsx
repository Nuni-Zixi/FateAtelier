import { useState } from 'react'
import { ReadingType, readingTypes } from '../types/reading'
import './ReadingTypeSelector.css'

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
        alert('请输入您的问题')
        return
      }
      onSelect(selectedType, selectedType === 'custom' ? customQuestion : undefined)
    }
  }

  return (
    <div 
      className="reading-type-overlay" 
      onClick={onCancel}
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
          <h2>选择占卜类型</h2>
          <button className="close-type-selector" onClick={onCancel}>✕</button>
        </div>

        <div className="reading-type-grid">
          {readingTypes.map((type) => (
            <div
              key={type.id}
              className={`reading-type-card ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => handleTypeClick(type.id)}
            >
              <div className="reading-type-icon">{type.icon}</div>
              <div className="reading-type-name">{type.name}</div>
              <div className="reading-type-desc">{type.description}</div>
            </div>
          ))}
        </div>

        {showCustomInput && (
          <div className="custom-question-input">
            <label>请输入您的问题：</label>
            <textarea
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="例如：我最近的工作会顺利吗？"
              rows={3}
              className="custom-question-textarea"
            />
          </div>
        )}

        <div className="reading-type-actions">
          <button className="cancel-btn" onClick={onCancel}>取消</button>
          <button 
            className="confirm-btn" 
            onClick={handleConfirm}
            disabled={!selectedType || (selectedType === 'custom' && !customQuestion.trim())}
          >
            开始占卜
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReadingTypeSelector

