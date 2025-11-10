import { TarotCard } from '../data/tarotCards'

// 大阿卡纳图标映射
const majorArcanaIcons: Record<number, string> = {
  0: '🎭', // 愚者
  1: '✨', // 魔术师
  2: '🌙', // 女祭司
  3: '👑', // 皇后
  4: '⚔️', // 皇帝
  5: '📿', // 教皇
  6: '💕', // 恋人
  7: '🏇', // 战车
  8: '💪', // 力量
  9: '🔦', // 隐者
  10: '🎡', // 命运之轮
  11: '⚖️', // 正义
  12: '🔄', // 倒吊人
  13: '💀', // 死神
  14: '🕊️', // 节制
  15: '😈', // 恶魔
  16: '🗼', // 塔
  17: '⭐', // 星星
  18: '🌙', // 月亮
  19: '☀️', // 太阳
  20: '📯', // 审判
  21: '🌍', // 世界
}

// 小阿卡纳数字图标
const numberIcons: Record<number, string> = {
  1: 'Ⅰ',
  2: 'Ⅱ',
  3: 'Ⅲ',
  4: 'Ⅳ',
  5: 'Ⅴ',
  6: 'Ⅵ',
  7: 'Ⅶ',
  8: 'Ⅷ',
  9: 'Ⅸ',
  10: 'Ⅹ',
}

// 宫廷牌图标
const courtIcons: Record<string, string> = {
  'Page': '👤',
  'Knight': '🐴',
  'Queen': '👸',
  'King': '🤴',
}

// 花色图标
const suitIcons: Record<string, string> = {
  'wands': '🜃',
  'cups': '🜄',
  'swords': '🜁',
  'pentacles': '🜂',
}

// 花色颜色
const suitColors: Record<string, string> = {
  'wands': '#ffa500',
  'cups': '#4a90e2',
  'swords': '#c0c0c0',
  'pentacles': '#d4af37',
}

export const getCardIcon = (card: TarotCard): string => {
  if (card.type === 'major') {
    return majorArcanaIcons[card.id] || '🔮'
  }
  
  // 小阿卡纳
  if (card.number) {
    return numberIcons[card.number] || '●'
  }
  
  // 宫廷牌
  const nameEn = card.nameEn.toLowerCase()
  if (nameEn.includes('page')) return courtIcons['Page']
  if (nameEn.includes('knight')) return courtIcons['Knight']
  if (nameEn.includes('queen')) return courtIcons['Queen']
  if (nameEn.includes('king')) return courtIcons['King']
  
  return '●'
}

export const getSuitIcon = (suit?: string): string => {
  if (!suit) return ''
  return suitIcons[suit] || ''
}

export const getSuitColor = (suit?: string): string => {
  if (!suit) return '#ff6b9d'
  return suitColors[suit] || '#ff6b9d'
}

// 获取卡片的背景图案
export const getCardPattern = (card: TarotCard): string => {
  if (card.type === 'major') {
    return 'major-pattern'
  }
  
  if (card.suit) {
    return `${card.suit}-pattern`
  }
  
  return 'default-pattern'
}

// 获取卡片的装饰元素
export const getCardDecoration = (card: TarotCard): string => {
  if (card.type === 'major') {
    return '✨'
  }
  
  switch (card.suit) {
    case 'wands':
      return '🔥'
    case 'cups':
      return '💧'
    case 'swords':
      return '⚡'
    case 'pentacles':
      return '💎'
    default:
      return '✨'
  }
}

