import { DrawnCard } from '../types'

export interface ReadingInterpretation {
  summary: string
  past: string
  present: string
  future: string
  advice: string
}

export const generateThreeCardReading = (cards: DrawnCard[]): ReadingInterpretation => {
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

  // 生成综合总结
  const summary = `从过去到未来，你的生命旅程呈现出清晰的脉络。${trend}过去的影响正在塑造现在，而现在的选择将决定未来的走向。`

  // 生成各阶段解读
  const past = `过去：${pastCard.card.name}（${pastCard.isReversed ? '逆位' : '正位'}）${pastEnergy}。${pastCard.isReversed ? pastCard.card.meaning.reversed : pastCard.card.meaning.upright}。这段经历为你提供了重要的经验和教训。`

  const present = `现在：${presentCard.card.name}（${presentCard.isReversed ? '逆位' : '正位'}）${presentEnergy}。${presentCard.isReversed ? presentCard.card.meaning.reversed : presentCard.card.meaning.upright}。这是你当前需要关注和处理的重点。`

  const future = `未来：${futureCard.card.name}（${futureCard.isReversed ? '逆位' : '正位'}）${futureEnergy}。${futureCard.isReversed ? futureCard.card.meaning.reversed : futureCard.card.meaning.upright}。这预示着你未来可能面临的情况。`

  // 生成建议
  let advice = ''
  if (majorCount >= 2) {
    advice = '你正在经历人生的重要阶段，这些大阿卡纳牌表明这是命运的关键时刻。保持觉知，做出明智的选择。'
  } else if (reversedCount >= 2) {
    advice = '当前需要更多的内省和调整。不要害怕改变，这些挑战是成长的机会。保持耐心，相信自己的能力。'
  } else if (presentCard.isReversed) {
    advice = '现在是你需要特别关注的时刻。虽然面临一些挑战，但通过正确的行动和态度，你可以克服困难。'
  } else if (futureCard.isReversed) {
    advice = '未来需要谨慎规划。虽然可能面临一些挑战，但提前准备和积极应对可以帮助你避免潜在的问题。'
  } else {
    advice = '整体趋势积极向上。继续保持当前的方向和努力，未来充满希望。相信自己的直觉，勇敢前行。'
  }

  return {
    summary,
    past,
    present,
    future,
    advice
  }
}

