export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  type: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
  meaning: {
    upright: string;
    reversed: string;
  };
  description: string;
}

export const tarotCards: TarotCard[] = [
  // 大阿卡纳 (Major Arcana) - 22张
  {
    id: 0,
    name: '愚者',
    nameEn: 'The Fool',
    type: 'major',
    meaning: {
      upright: '新的开始、冒险、自由、纯真、自发性',
      reversed: '鲁莽、缺乏计划、幼稚、风险'
    },
    description: '愚者代表新的开始，拥有自由的精神，敢于冒险，但有时也显得天真和缺乏计划。'
  },
  {
    id: 1,
    name: '魔术师',
    nameEn: 'The Magician',
    type: 'major',
    meaning: {
      upright: '意志力、创造力、技能、行动、专注',
      reversed: '缺乏方向、意志薄弱、技能不足'
    },
    description: '魔术师拥有将想法转化为现实的能力，代表行动、创造力和专注的意志。'
  },
  {
    id: 2,
    name: '女祭司',
    nameEn: 'The High Priestess',
    type: 'major',
    meaning: {
      upright: '直觉、潜意识、神秘、内在智慧',
      reversed: '缺乏内在声音、压抑直觉、秘密'
    },
    description: '女祭司代表直觉和内在智慧，连接着潜意识和神秘的知识。'
  },
  {
    id: 3,
    name: '皇后',
    nameEn: 'The Empress',
    type: 'major',
    meaning: {
      upright: '丰饶、母性、自然、创造力、富足',
      reversed: '依赖、缺乏成长、创造力受阻'
    },
    description: '皇后代表丰饶、母性和自然的创造力，象征着富足和成长。'
  },
  {
    id: 4,
    name: '皇帝',
    nameEn: 'The Emperor',
    type: 'major',
    meaning: {
      upright: '权威、结构、控制、稳定、父亲',
      reversed: '专制、僵化、缺乏纪律、控制欲'
    },
    description: '皇帝代表权威、结构和控制，象征着稳定和秩序。'
  },
  {
    id: 5,
    name: '教皇',
    nameEn: 'The Hierophant',
    type: 'major',
    meaning: {
      upright: '传统、精神指导、学习、仪式',
      reversed: '反传统、个人信仰、非传统方法'
    },
    description: '教皇代表传统和精神指导，象征着学习和遵循既定的道路。'
  },
  {
    id: 6,
    name: '恋人',
    nameEn: 'The Lovers',
    type: 'major',
    meaning: {
      upright: '爱情、和谐、关系、选择、价值观',
      reversed: '不平衡、价值观冲突、糟糕的选择'
    },
    description: '恋人代表爱情和和谐的关系，也象征着重要的选择和价值观。'
  },
  {
    id: 7,
    name: '战车',
    nameEn: 'The Chariot',
    type: 'major',
    meaning: {
      upright: '控制、意志力、胜利、决心',
      reversed: '缺乏控制、方向不明、失败'
    },
    description: '战车代表通过意志力和决心取得胜利，象征着控制和成功。'
  },
  {
    id: 8,
    name: '力量',
    nameEn: 'Strength',
    type: 'major',
    meaning: {
      upright: '内在力量、耐心、控制、同情',
      reversed: '软弱、内在冲突、缺乏自信'
    },
    description: '力量代表内在的力量和耐心，通过温柔和同情来克服困难。'
  },
  {
    id: 9,
    name: '隐者',
    nameEn: 'The Hermit',
    type: 'major',
    meaning: {
      upright: '内省、寻找、指导、孤独',
      reversed: '孤立、迷失、缺乏方向'
    },
    description: '隐者代表内省和寻找内在真理，象征着精神上的指导。'
  },
  {
    id: 10,
    name: '命运之轮',
    nameEn: 'Wheel of Fortune',
    type: 'major',
    meaning: {
      upright: '变化、周期、命运、转折点',
      reversed: '坏运气、缺乏控制、阻力'
    },
    description: '命运之轮代表生活的变化和周期，象征着命运的转折点。'
  },
  {
    id: 11,
    name: '正义',
    nameEn: 'Justice',
    type: 'major',
    meaning: {
      upright: '正义、公平、真相、责任',
      reversed: '不公正、缺乏责任、不公平'
    },
    description: '正义代表公平和真相，象征着责任和平衡。'
  },
  {
    id: 12,
    name: '倒吊人',
    nameEn: 'The Hanged Man',
    type: 'major',
    meaning: {
      upright: '暂停、牺牲、等待、新视角',
      reversed: '拖延、抗拒、不必要的牺牲'
    },
    description: '倒吊人代表暂停和牺牲，通过不同的视角来看待问题。'
  },
  {
    id: 13,
    name: '死神',
    nameEn: 'Death',
    type: 'major',
    meaning: {
      upright: '结束、转变、过渡、放手',
      reversed: '抗拒变化、停滞、拖延'
    },
    description: '死神代表结束和转变，象征着必要的过渡和放手。'
  },
  {
    id: 14,
    name: '节制',
    nameEn: 'Temperance',
    type: 'major',
    meaning: {
      upright: '平衡、适度、耐心、目的',
      reversed: '不平衡、过度、缺乏长期愿景'
    },
    description: '节制代表平衡和适度，通过耐心和目的来调和不同的力量。'
  },
  {
    id: 15,
    name: '恶魔',
    nameEn: 'The Devil',
    type: 'major',
    meaning: {
      upright: '束缚、成瘾、物质主义、限制',
      reversed: '释放、独立、摆脱束缚'
    },
    description: '恶魔代表束缚和成瘾，象征着物质主义和自我限制。'
  },
  {
    id: 16,
    name: '塔',
    nameEn: 'The Tower',
    type: 'major',
    meaning: {
      upright: '突然变化、启示、破坏、解放',
      reversed: '避免灾难、抗拒变化、内在动荡'
    },
    description: '塔代表突然的变化和启示，通过破坏来带来解放。'
  },
  {
    id: 17,
    name: '星星',
    nameEn: 'The Star',
    type: 'major',
    meaning: {
      upright: '希望、信仰、目的、更新',
      reversed: '缺乏信仰、绝望、断开连接'
    },
    description: '星星代表希望和信仰，象征着目的和精神的更新。'
  },
  {
    id: 18,
    name: '月亮',
    nameEn: 'The Moon',
    type: 'major',
    meaning: {
      upright: '幻觉、恐惧、焦虑、潜意识',
      reversed: '释放恐惧、压抑、内在混乱'
    },
    description: '月亮代表幻觉和恐惧，连接着潜意识和未知的领域。'
  },
  {
    id: 19,
    name: '太阳',
    nameEn: 'The Sun',
    type: 'major',
    meaning: {
      upright: '快乐、成功、庆祝、积极',
      reversed: '过度乐观、缺乏成功、内在阴影'
    },
    description: '太阳代表快乐和成功，象征着庆祝和积极的生活态度。'
  },
  {
    id: 20,
    name: '审判',
    nameEn: 'Judgement',
    type: 'major',
    meaning: {
      upright: '反思、评估、觉醒、宽恕',
      reversed: '缺乏自我意识、自我怀疑、拒绝自我评估'
    },
    description: '审判代表反思和评估，象征着觉醒和宽恕。'
  },
  {
    id: 21,
    name: '世界',
    nameEn: 'The World',
    type: 'major',
    meaning: {
      upright: '完成、成就、实现、旅行',
      reversed: '缺乏完成、停滞、未实现的目标'
    },
    description: '世界代表完成和成就，象征着目标的实现和圆满。'
  },
  // 小阿卡纳 - 权杖 (Wands)
  ...Array.from({ length: 14 }, (_, i) => {
    const numbers = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
    const names = ['权杖王牌', '权杖二', '权杖三', '权杖四', '权杖五', '权杖六', '权杖七', '权杖八', '权杖九', '权杖十', '权杖侍从', '权杖骑士', '权杖皇后', '权杖国王'];
    const meanings = [
      { upright: '新项目、灵感、潜力、机会', reversed: '缺乏方向、延迟、缺乏灵感' },
      { upright: '计划、未来规划、等待', reversed: '缺乏计划、恐惧、缺乏方向' },
      { upright: '探索、扩张、领导力', reversed: '缺乏方向、延迟、限制' },
      { upright: '庆祝、和谐、关系、社区', reversed: '缺乏和谐、过渡、不完整' },
      { upright: '冲突、竞争、分歧', reversed: '避免冲突、竞争、分歧' },
      { upright: '胜利、成功、公众认可', reversed: '缺乏认可、失败、自我怀疑' },
      { upright: '挑战、竞争、坚持', reversed: '放弃、缺乏自信、压倒' },
      { upright: '快速行动、移动、进展', reversed: '速度、延迟、耐心' },
      { upright: '弹性、持久、最后努力', reversed: '疲惫、放弃、过度防御' },
      { upright: '负担、责任、努力', reversed: '过度承诺、缺乏方向、负担' },
      { upright: '探索、热情、自由精神', reversed: '缺乏方向、拖延、缺乏热情' },
      { upright: '行动、冒险、冲动', reversed: '愤怒、冲动、缺乏方向' },
      { upright: '勇气、自信、独立', reversed: '自私、鲁莽、缺乏纪律' },
      { upright: '自然领导者、远见、企业家', reversed: '过度控制、缺乏方向、不灵活' }
    ];
    return {
      id: 22 + i,
      name: names[i],
      nameEn: `Wands ${numbers[i]}`,
      type: 'minor' as const,
      suit: 'wands' as const,
      number: i < 10 ? i + 1 : undefined,
      meaning: meanings[i],
      description: `权杖${i < 10 ? i + 1 : ['侍从', '骑士', '皇后', '国王'][i - 10]}代表行动、创造力和热情。`
    };
  }),
  // 小阿卡纳 - 圣杯 (Cups)
  ...Array.from({ length: 14 }, (_, i) => {
    const numbers = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
    const names = ['圣杯王牌', '圣杯二', '圣杯三', '圣杯四', '圣杯五', '圣杯六', '圣杯七', '圣杯八', '圣杯九', '圣杯十', '圣杯侍从', '圣杯骑士', '圣杯皇后', '圣杯国王'];
    const meanings = [
      { upright: '新感觉、精神体验、直觉', reversed: '情感不稳定、缺乏联系、失去直觉' },
      { upright: '统一、伙伴关系、吸引力', reversed: '不平衡、破裂、缺乏和谐' },
      { upright: '友谊、社区、快乐', reversed: '过度放纵、流言蜚语、三方关系' },
      { upright: '冥想、沉思、重新评估', reversed: '沉思、错过机会、不满足' },
      { upright: '损失、遗憾、失望', reversed: '接受、宽恕、前进' },
      { upright: '重新审视、怀旧、记忆', reversed: '生活在过去、抓住记忆、前进' },
      { upright: '选择、寻找目的、幻想', reversed: '缺乏目的、分散、选择困难' },
      { upright: '离开、放弃、寻找深度', reversed: '避免承诺、恐惧、徘徊' },
      { upright: '满足、情感满足、愿望实现', reversed: '缺乏满足、贪婪、物质主义' },
      { upright: '情感完成、和谐、对齐', reversed: '分离、缺乏和谐、不完整' },
      { upright: '情感消息、直觉、创造力', reversed: '情感不稳定、缺乏创造力、压抑' },
      { upright: '跟随心、理想主义、浪漫', reversed: '理想主义、不切实际、情绪化' },
      { upright: '同情、关怀、直觉', reversed: '内在空虚、情绪化、依赖' },
      { upright: '情感平衡、同情、外交', reversed: '情绪化、操纵、冷漠' }
    ];
    return {
      id: 36 + i,
      name: names[i],
      nameEn: `Cups ${numbers[i]}`,
      type: 'minor' as const,
      suit: 'cups' as const,
      number: i < 10 ? i + 1 : undefined,
      meaning: meanings[i],
      description: `圣杯${i < 10 ? i + 1 : ['侍从', '骑士', '皇后', '国王'][i - 10]}代表情感、直觉和关系。`
    };
  }),
  // 小阿卡纳 - 宝剑 (Swords)
  ...Array.from({ length: 14 }, (_, i) => {
    const numbers = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
    const names = ['宝剑王牌', '宝剑二', '宝剑三', '宝剑四', '宝剑五', '宝剑六', '宝剑七', '宝剑八', '宝剑九', '宝剑十', '宝剑侍从', '宝剑骑士', '宝剑皇后', '宝剑国王'];
    const meanings = [
      { upright: '新想法、清晰、突破', reversed: '混乱、缺乏清晰、突破' },
      { upright: '困难选择、僵局、平衡', reversed: '选择困难、没有方向、混乱' },
      { upright: '心碎、情感痛苦、悲伤', reversed: '恢复、释放痛苦、向前看' },
      { upright: '休息、恢复、冥想', reversed: '休息、疲惫、重新进入世界' },
      { upright: '不道德、损失、失败', reversed: '恢复、接受、学习' },
      { upright: '过渡、离开、移动', reversed: '卡住、无法前进、逃避' },
      { upright: '欺骗、策略、计划', reversed: '欺骗、缺乏计划、不诚实' },
      { upright: '限制、自我限制、束缚', reversed: '新视角、释放、自由' },
      { upright: '焦虑、担忧、恐惧', reversed: '内在动荡、深度恐惧、抑郁' },
      { upright: '背叛、损失、危机', reversed: '恢复、再生、释放' },
      { upright: '新想法、好奇心、沟通', reversed: '缺乏方向、混乱、沟通不良' },
      { upright: '行动、冲动、缺乏方向', reversed: '缺乏方向、不成熟、计划不周' },
      { upright: '清晰的思想、直接沟通、诚实', reversed: '过度思考、冷酷、不敏感' },
      { upright: '心理清晰、真理、权威', reversed: '操纵、残酷、不诚实' }
    ];
    return {
      id: 50 + i,
      name: names[i],
      nameEn: `Swords ${numbers[i]}`,
      type: 'minor' as const,
      suit: 'swords' as const,
      number: i < 10 ? i + 1 : undefined,
      meaning: meanings[i],
      description: `宝剑${i < 10 ? i + 1 : ['侍从', '骑士', '皇后', '国王'][i - 10]}代表思想、沟通和冲突。`
    };
  }),
  // 小阿卡纳 - 星币 (Pentacles)
  ...Array.from({ length: 14 }, (_, i) => {
    const numbers = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
    const names = ['星币王牌', '星币二', '星币三', '星币四', '星币五', '星币六', '星币七', '星币八', '星币九', '星币十', '星币侍从', '星币骑士', '星币皇后', '星币国王'];
    const meanings = [
      { upright: '新机会、资源、富足', reversed: '错失机会、缺乏计划、不稳定' },
      { upright: '平衡、优先事项、时间管理', reversed: '不平衡、优先事项、组织不良' },
      { upright: '团队合作、协作、学习', reversed: '缺乏团队合作、不协调、缺乏学习' },
      { upright: '控制、安全、保守', reversed: '控制、不安全、吝啬' },
      { upright: '需要、贫困、不安全感', reversed: '恢复、慈善、精神贫困' },
      { upright: '给予、接受、分享财富', reversed: '自私、不平衡、权力游戏' },
      { upright: '评估、反思、计算', reversed: '缺乏进步、拖延、缺乏奖励' },
      { upright: '技能、质量、努力', reversed: '缺乏质量、缺乏动力、不完美' },
      { upright: '奖励、奢侈、自给自足', reversed: '自我价值、过度放纵、缺乏纪律' },
      { upright: '财富、安全、家庭', reversed: '财务失败、缺乏稳定性、家庭冲突' },
      { upright: '新机会、想法、灵感', reversed: '缺乏方向、缺乏承诺、优先事项' },
      { upright: '努力、生产力、例行公事', reversed: '缺乏目标、懒惰、缺乏纪律' },
      { upright: '实用性、安全感、物质世界', reversed: '自我价值、物质主义、不安全' },
      { upright: '财务安全、控制、领导', reversed: '财务不安全感、缺乏控制、贪婪' }
    ];
    return {
      id: 64 + i,
      name: names[i],
      nameEn: `Pentacles ${numbers[i]}`,
      type: 'minor' as const,
      suit: 'pentacles' as const,
      number: i < 10 ? i + 1 : undefined,
      meaning: meanings[i],
      description: `星币${i < 10 ? i + 1 : ['侍从', '骑士', '皇后', '国王'][i - 10]}代表物质、工作和资源。`
    };
  })
];

