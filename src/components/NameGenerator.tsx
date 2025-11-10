import { useState } from 'react'
import './NameGenerator.css'

interface NameGeneratorProps {
  onBack: () => void
}

function NameGenerator({ onBack }: NameGeneratorProps) {
  const [surname, setSurname] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [preferences, setPreferences] = useState<string[]>([])
  const [nameLength, setNameLength] = useState<'any' | '2' | '3' | '4'>('any')
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const preferenceOptions = [
    '文雅', '活泼', '沉稳', '清新', '古典', '现代', '诗意', '简洁',
    '大气', '温柔', '阳光', '智慧', '勇敢', '优雅', '自然', '富贵', '健康'
  ]

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    )
  }

  const generateNames = () => {
    if (!surname.trim()) {
      alert('请输入姓氏')
      return
    }

    setIsGenerating(true)
    
    // 模拟生成过程
    setTimeout(() => {
      const names = generateNameList(surname, gender, birthDate, birthTime, preferences, nameLength)
      setGeneratedNames(names)
      setIsGenerating(false)
    }, 1000)
  }

  // 天干地支
  const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  
  // 天干对应的五行
  const tianganWuxing: { [key: string]: string } = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
  }
  
  // 地支对应的五行
  const dizhiWuxing: { [key: string]: string } = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
    '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
  }
  
  // 计算生辰八字
  const calculateBazi = (birthDate: string, birthTime: string): string[] => {
    if (!birthDate) return []
    
    const date = new Date(birthDate)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    
    // 计算年柱（简化版，实际需要根据立春分界）
    const yearGan = tiangan[(year - 4) % 10]
    const yearZhi = dizhi[(year - 4) % 12]
    
    // 计算月柱（简化版，实际需要根据节气）
    const monthGan = tiangan[((year % 5 === 0 ? 2 : year % 5) * 2 + month - 1) % 10]
    const monthZhi = dizhi[(month + 1) % 12]
    
    // 计算日柱（简化版，实际需要复杂的公式）
    const baseDate = new Date(1900, 0, 1)
    const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
    const dayGan = tiangan[(daysDiff + 6) % 10]
    const dayZhi = dizhi[(daysDiff + 8) % 12]
    
    // 计算时柱
    let hour = 0
    if (birthTime) {
      const [h] = birthTime.split(':').map(Number)
      hour = h || 0
    } else {
      hour = 12 // 默认中午
    }
    const hourIndex = Math.floor((hour + 1) / 2) % 12
    const dayGanIndex = tiangan.indexOf(dayGan)
    const hourGan = tiangan[(dayGanIndex * 2 + hourIndex) % 10]
    const hourZhi = dizhi[hourIndex]
    
    return [yearGan + yearZhi, monthGan + monthZhi, dayGan + dayZhi, hourGan + hourZhi]
  }
  
  // 分析五行
  const analyzeWuxing = (bazi: string[]): { [key: string]: number } => {
    const wuxingCount: { [key: string]: number } = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
    
    if (bazi.length === 0) return wuxingCount
    
    bazi.forEach(pillar => {
      if (pillar.length >= 2) {
        const gan = pillar[0]
        const zhi = pillar[1]
        if (tianganWuxing[gan]) wuxingCount[tianganWuxing[gan]]++
        if (dizhiWuxing[zhi]) wuxingCount[dizhiWuxing[zhi]]++
      }
    })
    
    return wuxingCount
  }
  
  // 字符到五行的映射（常用字）
  const charToWuxing: { [key: string]: string } = {
    // 金
    '金': '金', '银': '金', '钢': '金', '铁': '金', '锋': '金', '锐': '金', '剑': '金', '刀': '金',
    '刚': '金', '强': '金', '坚': '金', '利': '金', '铭': '金', '钟': '金',
    '锦': '金', '钱': '金', '财': '金', '富': '金', '贵': '金', '鑫': '金', '钧': '金', '钊': '金',
    // 木
    '木': '木', '林': '木', '森': '木', '树': '木', '花': '木', '草': '木', '竹': '木', '梅': '木',
    '兰': '木', '菊': '木', '莲': '木', '荷': '木', '桃': '木', '李': '木', '杏': '木', '梨': '木',
    '樱': '木', '桂': '木', '桐': '木', '柳': '木', '松': '木', '柏': '木', '杨': '木', '枫': '木',
    '杰': '木', '栋': '木', '梁': '木', '材': '木', '彬': '木', '荣': '木', '华': '木',
    // 水
    '水': '水', '海': '水', '江': '水', '河': '水', '湖': '水', '泉': '水', '溪': '水', '流': '水',
    '波': '水', '涛': '水', '浪': '水', '潮': '水', '雨': '水', '雪': '水', '冰': '水', '霜': '水',
    '露': '水', '雾': '水', '云': '水', '风': '水', '涵': '水', '润': '水', '泽': '水', '清': '水',
    '洁': '水', '净': '水', '浩': '水', '瀚': '水', '洋': '水', '渊': '水', '深': '水', '浅': '水',
    // 火
    '火': '火', '炎': '火', '焰': '火', '烈': '火', '热': '火', '光': '火', '明': '火', '亮': '火',
    '辉': '火', '煌': '火', '灿': '火', '烂': '火', '阳': '火', '日': '火', '星': '火', '月': '火',
    '晨': '火', '晓': '火', '旭': '火', '曦': '火', '晴': '火', '暖': '火', '照': '火', '耀': '火',
    '智': '火', '慧': '火', '聪': '火', '敏': '火', '灵': '火', '心': '火', '思': '火', '念': '火',
    // 土
    '土': '土', '地': '土', '山': '土', '峰': '土', '岭': '土', '岩': '土', '石': '土', '城': '土',
    '壁': '土', '固': '土', '稳': '土', '安': '土', '宁': '土', '静': '土', '定': '土',
    '厚': '土', '实': '土', '诚': '土', '信': '土', '德': '土', '义': '土', '仁': '土', '善': '土',
    '宇': '土', '堂': '土', '基': '土', '础': '土', '培': '土', '育': '土', '养': '土', '成': '土'
  }
  
  // 获取字符的五行（如果没有映射，返回null）
  const getCharWuxing = (char: string): string | null => {
    return charToWuxing[char] || null
  }

  const generateNameList = (
    surname: string,
    gender: string,
    birthDate: string,
    birthTime: string,
    preferences: string[],
    length: 'any' | '2' | '3' | '4'
  ): string[] => {
    // 计算生辰八字并分析五行
    const bazi = calculateBazi(birthDate, birthTime)
    const wuxingCount = analyzeWuxing(bazi)
    
    // 找出缺失或较少的五行
    const wuxingValues = Object.values(wuxingCount)
    const avgCount = wuxingValues.reduce((a, b) => a + b, 0) / 5
    
    // 需要补充的五行（数量少于平均值的）
    const neededWuxing: string[] = []
    Object.entries(wuxingCount).forEach(([wuxing, count]) => {
      if (count < avgCount) {
        neededWuxing.push(wuxing)
      }
    })
    
    // 不再使用固定的名字库，改为一个字一个字随机组合生成
    // 单个字库（用于随机组合生成）
    const maleChars = [
      '浩', '轩', '佑', '杰', '博', '强', '明', '辉', '昊', '涵',
      '宇', '文', '渊', '天', '远', '墨', '彬', '恒', '涛', '伟',
      '豪', '超', '翔', '龙', '鹏', '安', '峰', '瑞', '凯', '勇',
      '健', '军', '赐', '成', '阳', '德', '诚', '华', '清', '秀',
      '康', '泽', '启', '宏', '辰', '睿', '智', '信', '仁', '义',
      '毅', '刚', '正', '直', '方', '圆', '和', '平', '乐', '福',
      '祥', '吉', '利', '顺', '通', '达', '进', '步', '升', '高',
      '兴', '旺', '发', '财', '富', '贵', '荣', '华', '昌', '盛',
      '光', '亮', '新', '鲜', '美', '好', '优', '良', '佳', '妙',
      '奇', '特', '异', '常', '非', '凡', '出', '众', '超', '群',
      '卓', '越', '杰', '出', '优', '秀', '精', '英', '才', '华',
      '学', '识', '见', '闻', '知', '识', '智', '慧', '聪', '明',
      '敏', '捷', '快', '速', '灵', '活', '机', '动', '变', '化',
      '创', '新', '改', '革', '开', '拓', '进', '取', '奋', '斗',
      '努', '力', '勤', '奋', '刻', '苦', '专', '注', '认', '真',
      '负', '责', '担', '当', '承', '诺', '守', '信', '诚', '实',
      '真', '诚', '善', '良', '友', '爱', '和', '睦', '团', '结',
      '合', '作', '协', '调', '配', '合', '支', '持', '帮', '助',
      '关', '爱', '照', '顾', '体', '贴', '温', '柔', '细', '心',
      '周', '到', '完', '美', '全', '面', '深', '刻', '透', '彻'
    ]

    const femaleChars = [
      '雨', '涵', '怡', '思', '诗', '馨', '瑶', '萱', '语', '嫣',
      '桐', '悦', '琪', '欣', '晴', '妍', '颖', '雅', '儿', '婷',
      '柔', '梦', '菲', '晨', '静', '宁', '和', '平', '美', '丽',
      '慧', '敏', '灵', '雪', '月', '星', '花', '兰', '梅', '竹',
      '菊', '莲', '荷', '桂', '桃', '梨', '樱', '杏', '李', '橙',
      '柠', '柚', '桔', '彩', '光', '亮', '清', '净', '洁', '纯',
      '真', '诚', '实', '信', '忠', '义', '仁', '德', '礼', '智',
      '勇', '强', '健', '康', '安', '全', '完', '整', '齐', '一',
      '统', '合', '和', '睦', '团', '结', '友', '爱', '关', '怀',
      '体', '贴', '温', '柔', '细', '心', '周', '到', '完', '美',
      '优', '雅', '高', '贵', '典', '雅', '端', '庄', '大', '方',
      '文', '静', '秀', '气', '清', '新', '自', '然', '纯', '真',
      '可', '爱', '活', '泼', '开', '朗', '乐', '观', '积', '极',
      '向', '上', '进', '取', '努', '力', '勤', '奋', '刻', '苦',
      '专', '注', '认', '真', '负', '责', '担', '当', '承', '诺',
      '守', '信', '诚', '实', '真', '诚', '善', '良', '友', '爱',
      '和', '睦', '团', '结', '合', '作', '协', '调', '配', '合',
      '支', '持', '帮', '助', '关', '爱', '照', '顾', '体', '贴',
      '温', '柔', '细', '心', '周', '到', '完', '美', '全', '面',
      '深', '刻', '透', '彻', '精', '细', '微', '妙', '巧', '妙',
      '奇', '特', '异', '常', '非', '凡', '出', '众', '超', '群',
      '卓', '越', '杰', '出', '优', '秀', '精', '英', '才', '华',
      '学', '识', '见', '闻', '知', '识', '智', '慧', '聪', '明',
      '敏', '捷', '快', '速', '灵', '活', '机', '动', '变', '化',
      '创', '新', '改', '革', '开', '拓', '进', '取', '奋', '斗',
      '努', '力', '勤', '奋', '刻', '苦', '专', '注', '认', '真',
      '负', '责', '担', '当', '承', '诺', '守', '信', '诚', '实',
      '真', '诚', '善', '良', '友', '爱', '和', '睦', '团', '结',
      '合', '作', '协', '调', '配', '合', '支', '持', '帮', '助',
      '关', '爱', '照', '顾', '体', '贴', '温', '柔', '细', '心',
      '周', '到', '完', '美', '全', '面', '深', '刻', '透', '彻'
    ]

    const neutralChars = [
      '文', '静', '远', '雅', '源', '心', '齐', '慧', '明', '清',
      '安', '秀', '诚', '德', '华', '思', '博', '宁', '和', '平',
      '康', '乐', '福', '祥', '瑞', '吉', '利', '顺', '通', '达',
      '进', '步', '升', '高', '兴', '旺', '发', '财', '富', '贵',
      '荣', '华', '昌', '盛', '光', '亮', '新', '鲜', '美', '好',
      '优', '良', '佳', '妙', '奇', '特', '异', '常', '非', '凡',
      '出', '众', '超', '群', '卓', '越', '杰', '出', '优', '秀',
      '精', '英', '才', '华', '学', '识', '见', '闻', '知', '识',
      '智', '慧', '聪', '明', '敏', '捷', '快', '速', '灵', '活',
      '机', '动', '变', '化', '创', '新', '改', '革', '开', '拓',
      '进', '取', '奋', '斗', '努', '力', '勤', '奋', '刻', '苦',
      '专', '注', '认', '真', '负', '责', '担', '当', '承', '诺',
      '守', '信', '诚', '实', '真', '诚', '善', '良', '友', '爱',
      '和', '睦', '团', '结', '合', '作', '协', '调', '配', '合',
      '支', '持', '帮', '助', '关', '爱', '照', '顾', '体', '贴',
      '温', '柔', '细', '心', '周', '到', '完', '美', '全', '面',
      '深', '刻', '透', '彻', '精', '细', '微', '妙', '巧', '妙'
    ]

    // 计算姓氏长度
    const surnameLength = surname.length
    
    // 根据性别选择字符库（用于随机组合）
    let charPool: string[] = []
    
    if (gender === 'male') {
      charPool = maleChars
    } else if (gender === 'female') {
      charPool = femaleChars
    } else {
      charPool = [...maleChars, ...femaleChars, ...neutralChars]
    }
    
    // 如果选择了偏好，优先选择符合偏好的字符
    if (preferences.length > 0) {
      const preferenceMap: { [key: string]: string[] } = {
        '文雅': ['文', '雅', '诗', '涵', '静', '慧', '清', '秀'],
        '活泼': ['欣', '悦', '乐', '欢', '笑', '阳', '明', '亮'],
        '沉稳': ['志', '远', '博', '文', '德', '诚', '安', '宁'],
        '清新': ['雨', '晴', '桐', '欣', '柔', '雅', '清', '新'],
        '古典': ['诗', '涵', '文', '雅', '墨', '轩', '博', '远'],
        '现代': ['可', '欣', '悦', '乐', '阳', '明', '亮', '新'],
        '诗意': ['诗', '雨', '涵', '雅', '墨', '文', '心', '语'],
        '简洁': ['文', '明', '静', '安', '乐', '欣', '雅', '清'],
        '大气': ['天', '宇', '浩', '瀚', '宏', '伟', '博', '远'],
        '温柔': ['柔', '婉', '温', '和', '静', '宁', '雅', '馨'],
        '阳光': ['阳', '光', '明', '亮', '晨', '曦', '旭', '辉'],
        '智慧': ['智', '慧', '睿', '聪', '明', '敏', '思', '学'],
        '勇敢': ['勇', '强', '刚', '毅', '坚', '韧', '豪', '杰'],
        '优雅': ['优', '雅', '贵', '典', '端', '庄', '淑', '娴'],
        '自然': ['山', '水', '林', '森', '花', '草', '竹', '梅'],
        '富贵': ['富', '贵', '荣', '华', '昌', '盛', '兴', '旺'],
        '健康': ['健', '康', '安', '全', '强', '壮', '福', '寿']
      }

      const preferredChars: string[] = []
      preferences.forEach(pref => {
        if (preferenceMap[pref]) {
          preferredChars.push(...preferenceMap[pref])
        }
      })

      if (preferredChars.length > 0) {
        // 优先使用偏好字符，但保留一些其他字符以保证多样性
        const preferredPool = charPool.filter(char => preferredChars.includes(char))
        const otherPool = charPool.filter(char => !preferredChars.includes(char))
        // 70% 偏好字符，30% 其他字符
        charPool = [
          ...preferredPool,
          ...otherPool.slice(0, Math.floor(otherPool.length * 0.3))
        ]
        if (charPool.length === 0) {
          charPool = preferredChars
        }
      }
    }
    
    // 根据生辰八字调整字符优先级
    if (neededWuxing.length > 0 && birthDate) {
      // 将字符库按五行分类
      const wuxingChars: { [key: string]: string[] } = {
        '金': [], '木': [], '水': [], '火': [], '土': []
      }
      
      charPool.forEach(char => {
        const wuxing = getCharWuxing(char)
        if (wuxing && wuxingChars[wuxing]) {
          wuxingChars[wuxing].push(char)
        }
      })
      
      // 优先使用需要补充的五行字符
      const priorityChars: string[] = []
      neededWuxing.forEach(wuxing => {
        priorityChars.push(...wuxingChars[wuxing])
      })
      
      // 其他字符
      const otherChars = charPool.filter(char => {
        const wuxing = getCharWuxing(char)
        return !wuxing || !neededWuxing.includes(wuxing)
      })
      
      // 重新组合：60% 需要补充的五行字符，40% 其他字符
      if (priorityChars.length > 0) {
        charPool = [
          ...priorityChars,
          ...otherChars.slice(0, Math.floor(otherChars.length * 0.4))
        ]
      }
    }

    // 根据选择的名字长度和姓氏长度生成（一个字一个字随机组合）
    const selectedNames: string[] = []
    const nameCount = 10
    const usedNames = new Set<string>() // 用于去重
    
    // 计算名字部分的长度：总长度 - 姓氏长度 = 名字部分长度
    const getNamePartLength = (totalLength: number): number => {
      return totalLength - surnameLength
    }
    
    // 从字符库中随机选择字符组合生成名字
    const generateRandomName = (charCount: number): string => {
      const shuffled = [...charPool].sort(() => Math.random() - 0.5)
      let name = ''
      const usedChars = new Set<string>() // 避免同一名字中重复字符
      
      for (let i = 0; i < charCount && i < shuffled.length; i++) {
        // 尝试找到一个未使用的字符
        let attempts = 0
        let char = shuffled[i]
        while (usedChars.has(char) && attempts < shuffled.length) {
          const nextIndex = (i + attempts + 1) % shuffled.length
          char = shuffled[nextIndex]
          attempts++
        }
        if (!usedChars.has(char)) {
          name += char
          usedChars.add(char)
        }
      }
      return name
    }
    
    if (length === 'any') {
      // 任意长度：根据姓氏长度动态分配
      if (surnameLength === 1) {
        // 单姓：30% 2字（1字名），40% 3字（2字名），20% 4字（3字名），10% 自定义
        const count2 = Math.floor(nameCount * 0.3)
        const count3 = Math.floor(nameCount * 0.4)
        const count4 = Math.floor(nameCount * 0.2)
        const customCount = nameCount - count2 - count3 - count4

        // 生成2字名字（1字名）
        for (let i = 0; i < count2; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(1)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 生成3字名字（2字名）
        for (let i = 0; i < count3; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(2)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 生成4字名字（3字名）
        for (let i = 0; i < count4; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(3)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 自定义组合（1-3个字随机）
        for (let i = 0; i < customCount; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            const charCount = Math.floor(Math.random() * 3) + 1 // 1-3个字
            name = generateRandomName(charCount)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }
      } else {
        // 复姓：30% 3字（1字名），40% 4字（2字名），20% 5字（3字名），10% 自定义
        const count3 = Math.floor(nameCount * 0.3)
        const count4 = Math.floor(nameCount * 0.4)
        const count5 = Math.floor(nameCount * 0.2)
        const customCount = nameCount - count3 - count4 - count5

        // 生成3字名字（1字名）
        for (let i = 0; i < count3; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(1)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 生成4字名字（2字名）
        for (let i = 0; i < count4; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(2)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 生成5字名字（3字名）
        for (let i = 0; i < count5; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            name = generateRandomName(3)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }

        // 自定义组合（1-3个字随机）
        for (let i = 0; i < customCount; i++) {
          let attempts = 0
          let name = ''
          while (attempts < 50) {
            const charCount = Math.floor(Math.random() * 3) + 1 // 1-3个字
            name = generateRandomName(charCount)
            const fullName = surname + name
            if (!usedNames.has(fullName)) {
              selectedNames.push(fullName)
              usedNames.add(fullName)
              break
            }
            attempts++
          }
        }
      }

      // 如果名字不够，继续生成直到达到数量
      while (selectedNames.length < nameCount) {
        let attempts = 0
        let name = ''
        const charCount = surnameLength === 1 
          ? Math.floor(Math.random() * 3) + 1 // 1-3个字
          : Math.floor(Math.random() * 3) + 1 // 1-3个字
        while (attempts < 50) {
          name = generateRandomName(charCount)
          const fullName = surname + name
          if (!usedNames.has(fullName)) {
            selectedNames.push(fullName)
            usedNames.add(fullName)
            break
          }
          attempts++
        }
        if (attempts >= 50) break // 避免无限循环
      }
    } else {
      // 指定长度
      const totalLength = parseInt(length)
      const namePartLength = getNamePartLength(totalLength)
      
      if (namePartLength <= 0) {
        // 如果姓氏长度已经达到或超过总长度，只返回姓氏
        return [surname]
      }
      
      // 根据名字部分长度，一个字一个字随机组合
      for (let i = 0; i < nameCount; i++) {
        let attempts = 0
        let name = ''
        while (attempts < 50) {
          name = generateRandomName(namePartLength)
          const fullName = surname + name
          if (!usedNames.has(fullName)) {
            selectedNames.push(fullName)
            usedNames.add(fullName)
            break
          }
          attempts++
        }
        if (attempts >= 50) break // 避免无限循环
      }
    }

    // 打乱顺序并去重
    const uniqueNames = Array.from(new Set(selectedNames))
    return uniqueNames.sort(() => Math.random() - 0.5).slice(0, nameCount)
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      alert(`已复制：${name}`)
    }).catch(() => {
      alert('复制失败，请手动复制')
    })
  }

  return (
    <div className="name-generator-page">
      <div className="name-generator-header">
        <button className="back-button" onClick={onBack}>
          ← 返回
        </button>
        <h1>✨ 智能取名</h1>
        <p className="subtitle">根据您的信息，为您推荐合适的名字</p>
      </div>

      <div className={`name-generator-content ${generatedNames.length > 0 ? 'has-results' : ''}`}>
        <div className="input-section">
          <div className="input-group">
            <label>姓氏 *</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="请输入姓氏"
              className="name-input"
              maxLength={5}
            />
          </div>

          <div className="input-group">
            <label>性别</label>
            <div className="gender-buttons">
              <button
                className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender('male')}
              >
                👦 男
              </button>
              <button
                className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}
              >
                👧 女
              </button>
              <button
                className={`gender-btn ${gender === '' ? 'active' : ''}`}
                onClick={() => setGender('')}
              >
                🌈 不限
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>出生日期（可选）</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="name-input"
            />
          </div>

          <div className="input-group">
            <label>出生时间（可选）</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="name-input"
            />
          </div>

          <div className="input-group">
            <label>名字长度</label>
            <div className="length-buttons">
              <button
                className={`length-btn ${nameLength === 'any' ? 'active' : ''}`}
                onClick={() => setNameLength('any')}
              >
                任意
              </button>
              {surname.length <= 1 && (
                <button
                  className={`length-btn ${nameLength === '2' ? 'active' : ''}`}
                  onClick={() => setNameLength('2')}
                >
                  两个字
                </button>
              )}
              <button
                className={`length-btn ${nameLength === '3' ? 'active' : ''}`}
                onClick={() => setNameLength('3')}
                disabled={surname.length > 1 && nameLength === '2'}
              >
                三个字
              </button>
              <button
                className={`length-btn ${nameLength === '4' ? 'active' : ''}`}
                onClick={() => setNameLength('4')}
              >
                四个字
              </button>
            </div>
            {surname.length > 1 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                复姓从三个字开始
              </p>
            )}
          </div>

          <div className="input-group">
            <label>个人偏好（可多选）</label>
            <div className="preference-tags">
              {preferenceOptions.map(pref => (
                <button
                  key={pref}
                  className={`preference-tag ${preferences.includes(pref) ? 'active' : ''}`}
                  onClick={() => togglePreference(pref)}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <button
            className="generate-btn"
            onClick={generateNames}
            disabled={!surname.trim() || isGenerating}
          >
            {isGenerating ? '生成中...' : '✨ 开始生成名字'}
          </button>
        </div>

        {generatedNames.length > 0 && (
          <div className="results-section">
            <h2>为您推荐的名字</h2>
            <div className="names-grid">
              {generatedNames.map((name, index) => (
                <div key={index} className="name-card">
                  <div className="name-text">{name}</div>
                  <button
                    className="copy-btn"
                    onClick={() => copyName(name)}
                    title="复制"
                  >
                    📋
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NameGenerator

