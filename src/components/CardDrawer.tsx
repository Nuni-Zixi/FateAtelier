import './CardDrawer.css'

interface CardDrawerProps {
  onDrawCard: () => void
  onDrawThree: () => void
  onReset: () => void
  drawnCount: number
}

function CardDrawer({ onDrawCard, onDrawThree, onReset, drawnCount }: CardDrawerProps) {
  return (
    <div className="card-drawer">
      <div className="drawer-info">
        <p>已抽取: {drawnCount} / 78</p>
      </div>
      
      <div className="drawer-buttons">
        <button className="draw-button primary" onClick={onDrawCard}>
          🎴 抽取一张牌
        </button>
        <button className="draw-button secondary" onClick={onDrawThree}>
          🔮 三牌占卜
        </button>
        {drawnCount > 0 && (
          <button 
            className="draw-button reset" 
            onClick={onReset}
          >
            🔄 重新开始
          </button>
        )}
      </div>

      <div className="drawer-tips">
        <p>💡 提示：点击卡片可以翻转查看正逆位</p>
      </div>
    </div>
  )
}

export default CardDrawer

