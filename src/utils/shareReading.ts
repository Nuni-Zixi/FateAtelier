import { ReadingRecord } from '../components/ReadingHistory'
import { toast } from '../utils/toast'

export const shareReading = async (reading: ReadingRecord): Promise<void> => {
  const text = generateShareText(reading)
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: '🔮 塔罗牌占卜结果',
        text: text,
      })
    } catch (err) {
      // 用户取消分享或分享失败，尝试复制到剪贴板
      copyToClipboard(text)
    }
  } else {
    // 不支持原生分享，使用复制到剪贴板
    copyToClipboard(text)
  }
}

const generateShareText = (reading: ReadingRecord): string => {
  const date = new Date(reading.timestamp)
  let text = `🔮 命运工坊 - 塔罗牌占卜\n\n`
  text += `占卜时间: ${date.toLocaleString('zh-CN')}\n`
  text += `占卜类型: ${reading.type === 'single' ? '单牌占卜' : '三牌占卜'}\n\n`

  if (reading.type === 'single') {
    const card = reading.cards[0]
    text += `抽取的牌: ${card.card.name}\n`
    text += `位置: ${card.isReversed ? '逆位' : '正位'}\n`
    text += `牌意: ${card.isReversed ? card.card.meaning.reversed : card.card.meaning.upright}\n`
  } else {
    text += '三牌占卜结果:\n'
    reading.cards.forEach((card, index) => {
      const position = index === 0 ? '过去' : index === 1 ? '现在' : '未来'
      text += `${position}: ${card.card.name} (${card.isReversed ? '逆位' : '正位'})\n`
    })
    if (reading.interpretation) {
      text += `\n整体趋势: ${reading.interpretation.summary}\n`
    }
  }

  text += `\n来自: 命运工坊 🔮`
  return text
}

const copyToClipboard = (text: string): void => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('占卜结果已复制到剪贴板！')
    }).catch(() => {
      fallbackCopy(text)
    })
  } else {
    fallbackCopy(text)
  }
}

const fallbackCopy = (text: string): void => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.select()
  try {
    document.execCommand('copy')
    toast.success('占卜结果已复制到剪贴板！')
  } catch (err) {
    toast.error('复制失败，请手动复制')
  }
  document.body.removeChild(textArea)
}

