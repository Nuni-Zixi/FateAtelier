import { DrawnCard } from '../types'
import { ReadingType } from '../types/reading'

export interface ReadingInterpretation {
  summary: string
  past: string
  present: string
  future: string
  advice: string
}

const getTypeSpecificContext = (type: ReadingType, customQuestion?: string): string => {
  switch (type) {
    case 'daily':
      return '今日运势'
    case 'love':
      return '姻缘感情'
    case 'wealth':
      return '钱财财运'
    case 'career':
      return '职场事业'
    case 'health':
      return '健康'
    case 'study':
      return '学业'
    case 'relationship':
      return '人际关系'
    case 'custom':
      return customQuestion || '您的问题'
    default:
      return '综合占卜'
  }
}

export const generateThreeCardReading = (
  cards: DrawnCard[], 
  readingType: ReadingType = 'general',
  customQuestion?: string
): ReadingInterpretation => {
  if (cards.length !== 3) {
    return {
      summary: '需要三张牌才能进行占卜',
      past: '',
      present: '',
      future: '',
      advice: ''
    }
  }

  const [pastCard, presentCard, futureCard] = cards

  // 分析牌的能量
  const pastEnergy = pastCard.isReversed ? '受阻' : '顺畅'
  const presentEnergy = presentCard.isReversed ? '挑战' : '积极'
  const futureEnergy = futureCard.isReversed ? '需要谨慎' : '充满希望'

  // 判断整体趋势
  const reversedCount = cards.filter(c => c.isReversed).length
  const majorCount = cards.filter(c => c.card.type === 'major').length

  let trend = ''
  if (reversedCount === 0) {
    trend = '整体趋势非常积极，所有牌都处于正位，表明你正走在正确的道路上。'
  } else if (reversedCount === 1) {
    trend = '整体趋势良好，但有一个方面需要特别注意和调整。'
  } else if (reversedCount === 2) {
    trend = '当前面临一些挑战，需要更多的努力和调整来改善现状。'
  } else {
    trend = '当前处于一个重要的转折点，需要深入反思和重大改变。'
  }

  const context = getTypeSpecificContext(readingType, customQuestion)
  
  // 根据占卜类型生成不同的总结
  let summary = ''
  if (readingType === 'daily') {
    summary = `关于今日运势，${trend}今天是一个重要的日子，过去的影响正在塑造现在，而现在的选择将决定今天的结果。`
  } else if (readingType === 'love') {
    summary = `关于姻缘感情，${trend}感情关系的发展有其内在的规律，过去的情感经历影响着现在，现在的态度将决定未来的关系走向。`
  } else if (readingType === 'wealth') {
    summary = `关于钱财财运，${trend}财务状况的变化是一个过程，过去的理财方式影响着现在，现在的决策将影响未来的财富积累。`
  } else if (readingType === 'career') {
    summary = `关于职场事业，${trend}事业发展有其阶段性，过去的工作经历塑造了现在，现在的努力将决定未来的职业发展。`
  } else if (readingType === 'health') {
    summary = `关于健康，${trend}身心健康需要持续关注，过去的生活习惯影响着现在，现在的选择将影响未来的健康状况。`
  } else if (readingType === 'study') {
    summary = `关于学业，${trend}学习是一个积累的过程，过去的知识基础影响着现在，现在的努力将决定未来的学习成果。`
  } else if (readingType === 'relationship') {
    summary = `关于人际关系，${trend}人际关系的建立需要时间，过去的交往方式影响着现在，现在的态度将决定未来的人际关系。`
  } else if (readingType === 'custom') {
    summary = `关于"${context}"，${trend}这个问题的发展有其内在的规律，过去的情况影响着现在，现在的选择将决定未来的结果。`
  } else {
    summary = `从过去到未来，你的生命旅程呈现出清晰的脉络。${trend}过去的影响正在塑造现在，而现在的选择将决定未来的走向。`
  }

  // 生成各阶段解读（根据占卜类型调整）
  const past = `过去：${pastCard.card.name}（${pastCard.isReversed ? '逆位' : '正位'}）${pastEnergy}。${pastCard.isReversed ? pastCard.card.meaning.reversed : pastCard.card.meaning.upright}。这段经历为你提供了重要的经验和教训。`

  const present = `现在：${presentCard.card.name}（${presentCard.isReversed ? '逆位' : '正位'}）${presentEnergy}。${presentCard.isReversed ? presentCard.card.meaning.reversed : presentCard.card.meaning.upright}。这是你当前需要关注和处理的重点。`

  const future = `未来：${futureCard.card.name}（${futureCard.isReversed ? '逆位' : '正位'}）${futureEnergy}。${futureCard.isReversed ? futureCard.card.meaning.reversed : futureCard.card.meaning.upright}。这预示着你未来可能面临的情况。`

  // 根据占卜类型生成针对性建议
  let advice = ''
  const baseAdvice = majorCount >= 2 
    ? '你正在经历人生的重要阶段，这些大阿卡纳牌表明这是命运的关键时刻。保持觉知，做出明智的选择。'
    : reversedCount >= 2
    ? '当前需要更多的内省和调整。不要害怕改变，这些挑战是成长的机会。保持耐心，相信自己的能力。'
    : presentCard.isReversed
    ? '现在是你需要特别关注的时刻。虽然面临一些挑战，但通过正确的行动和态度，你可以克服困难。'
    : futureCard.isReversed
    ? '未来需要谨慎规划。虽然可能面临一些挑战，但提前准备和积极应对可以帮助你避免潜在的问题。'
    : '整体趋势积极向上。继续保持当前的方向和努力，未来充满希望。相信自己的直觉，勇敢前行。'

  if (readingType === 'daily') {
    advice = `今日运势建议：${baseAdvice}今天要特别注意当下的选择，它们会影响今天的结果。`
  } else if (readingType === 'love') {
    advice = `感情建议：${baseAdvice}在感情中保持真诚和沟通，理解对方的需求，共同成长。`
  } else if (readingType === 'wealth') {
    advice = `财运建议：${baseAdvice}在财务方面要理性规划，避免冲动消费，稳健投资。`
  } else if (readingType === 'career') {
    advice = `事业建议：${baseAdvice}在职场中保持专业和努力，把握机会，展现自己的价值。`
  } else if (readingType === 'health') {
    advice = `健康建议：${baseAdvice}关注身心健康，保持规律作息，适当运动，注意休息。`
  } else if (readingType === 'study') {
    advice = `学业建议：${baseAdvice}在学习中保持专注和坚持，制定合理计划，循序渐进。`
  } else if (readingType === 'relationship') {
    advice = `人际建议：${baseAdvice}在人际关系中保持真诚和尊重，理解他人，建立良好的沟通。`
  } else if (readingType === 'custom') {
    advice = `关于"${context}"的建议：${baseAdvice}针对这个问题，保持开放的心态，相信自己的判断。`
  } else {
    advice = baseAdvice
  }

  return {
    summary,
    past,
    present,
    future,
    advice
  }
}

