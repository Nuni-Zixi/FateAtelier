import { useState, useEffect, useRef } from 'react'
import './WeatherEffect.css'

export type WeatherType = 'none' | 'snow' | 'sun' | 'rain' | 'cloudy'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  rotation?: number
  rotationSpeed?: number
}

interface ClickEffect {
  id: number
  x: number
  y: number
  type: 'sparkle' | 'text' | 'particle'
  text?: string
}

interface WeatherEffectProps {
  weatherType: WeatherType
  intensity?: 'light' | 'medium' | 'heavy'
}

const SURPRISE_MESSAGES: { [key in WeatherType]: string[] } = {
  none: [],
  snow: [
    '❄️ 雪花飘飘',
    '✨ 许个愿吧',
    '🌟 好运降临',
    '💫 心想事成',
    '🎁 惊喜礼物',
    '🎄 圣诞快乐',
    '🎊 新年快乐',
  ],
  sun: [
    '☀️ 阳光明媚',
    '🌈 彩虹出现',
    '⭐ 愿望成真',
    '🌻 充满希望',
    '🌞 心情愉悦',
    '☀️ 正能量满满',
    '✨ 闪闪发光',
  ],
  rain: [
    '🌧️ 雨过天晴',
    '💧 滋润万物',
    '☔ 带把雨伞',
    '🌦️ 雨后彩虹',
    '💦 清新空气',
    '🌊 水润如新',
    '🌧️ 洗涤心灵',
  ],
  cloudy: [
    '☁️ 云淡风轻',
    '🌤️ 悠闲自在',
    '☁️ 思绪万千',
    '🌥️ 宁静致远',
    '☁️ 心平气和',
    '🌫️ 朦胧之美',
    '☁️ 云卷云舒',
  ],
}

function WeatherEffect({ weatherType, intensity = 'medium' }: WeatherEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  // 根据强度和天气类型设置粒子数量
  const getParticleCount = () => {
    if (weatherType === 'none') return 0
    
    const baseCount: { [key: string]: { [key: string]: number } } = {
      light: { snow: 30, rain: 40, sun: 20, cloudy: 15 },
      medium: { snow: 50, rain: 60, sun: 30, cloudy: 20 },
      heavy: { snow: 80, rain: 100, sun: 50, cloudy: 30 },
    }
    return baseCount[intensity]?.[weatherType] || 0
  }

  // 初始化粒子
  useEffect(() => {
    if (weatherType === 'none') {
      setParticles([])
      return
    }

    const count = getParticleCount()
    const newParticles: Particle[] = []

    for (let i = 0; i < count; i++) {
      if (weatherType === 'snow') {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * -100,
          size: Math.random() * 12 + 8,
          speed: Math.random() * 0.5 + 0.2,
          opacity: Math.random() * 0.5 + 0.5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 0.5,
        })
      } else if (weatherType === 'rain') {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * -100,
          size: Math.random() * 0.3 + 0.2, // 0.2-0.5px，更小的水滴宽度
          speed: Math.random() * 0.6 + 0.4, // 0.4-1.0px/frame
          opacity: Math.random() * 0.3 + 0.5, // 0.5-0.8，半透明
        })
      } else if (weatherType === 'sun') {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 4,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.4 + 0.6,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 1,
        })
      } else if (weatherType === 'cloudy') {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 80 + 60,
          speed: Math.random() * 0.2 + 0.05,
          opacity: Math.random() * 0.3 + 0.4,
        })
      }
    }

    setParticles(newParticles)
  }, [weatherType, intensity])

  // 动画循环
  useEffect(() => {
    if (weatherType === 'none' || particles.length === 0) return

    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      const frameTime = Math.min(deltaTime, 16.67)

      setParticles((prev) =>
        prev.map((particle) => {
          const speedPerMs = particle.speed / 16.67
          const distance = speedPerMs * frameTime

          let newY = particle.y
          let newX = particle.x

          if (weatherType === 'snow') {
            newY = particle.y + distance
            newX = particle.x + Math.sin(particle.y * 0.01) * 0.3

            if (newY > 100) {
              newY = -10
              newX = Math.random() * 100
            }

            const rotationPerMs = (particle.rotationSpeed || 0) / 16.67
            const rotationDelta = rotationPerMs * frameTime

            return {
              ...particle,
              x: newX,
              y: newY,
              rotation: (particle.rotation || 0) + rotationDelta,
            }
          } else if (weatherType === 'rain') {
            // 雨滴直接垂直下落，不左右摆动
            newY = particle.y + distance

            if (newY > 100) {
              newY = -10
              newX = Math.random() * 100
            } else {
              newX = particle.x // 保持x坐标不变
            }

            return {
              ...particle,
              x: newX,
              y: newY,
            }
          } else if (weatherType === 'sun') {
            // 阳光粒子在固定位置闪烁
            const time = currentTime / 1000
            const newOpacity = Math.sin(time * 2 + particle.id) * 0.3 + 0.7
            const rotationPerMs = (particle.rotationSpeed || 0) / 16.67
            const rotationDelta = rotationPerMs * frameTime

            return {
              ...particle,
              opacity: newOpacity,
              rotation: (particle.rotation || 0) + rotationDelta,
            }
          } else if (weatherType === 'cloudy') {
            newX = particle.x + distance

            if (newX > 110) {
              newX = -10
              particle.y = Math.random() * 100
            }

            return {
              ...particle,
              x: newX,
            }
          }

          return particle
        })
      )

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [weatherType, particles.length])

  // 处理点击
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (weatherType === 'none') return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const effectId = Date.now()
    const messages = SURPRISE_MESSAGES[weatherType]
    const message = messages[Math.floor(Math.random() * messages.length)]

    const newEffects: ClickEffect[] = []

    // 粒子爆炸
    for (let i = 0; i < 12; i++) {
      newEffects.push({
        id: effectId + i,
        x,
        y,
        type: 'particle',
      })
    }

    // 文字提示
    newEffects.push({
      id: effectId + 100,
      x,
      y,
      type: 'text',
      text: message,
    })

    // 闪烁效果
    for (let i = 0; i < 6; i++) {
      newEffects.push({
        id: effectId + 200 + i,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        type: 'sparkle',
      })
    }

    setClickEffects((prev) => [...prev, ...newEffects])

    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id < effectId))
    }, 2000)
  }

  if (weatherType === 'none') return null

  return (
    <div
      ref={containerRef}
      className={`weather-effect-container weather-${weatherType}`}
      onClick={handleClick}
    >
      {/* 雪花 */}
      {weatherType === 'snow' &&
        particles.map((particle) => (
          <div
            key={particle.id}
            className="weather-particle snow-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}px`,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%) rotate(${particle.rotation || 0}deg)`,
            }}
          >
            ❄️
          </div>
        ))}

      {/* 雨滴 */}
      {weatherType === 'rain' &&
        particles.map((particle) => (
          <div
            key={particle.id}
            className="weather-particle rain-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`, // 正方形，通过border-radius和旋转形成水滴形状
              opacity: particle.opacity,
            }}
          />
        ))}

      {/* 阳光 */}
      {weatherType === 'sun' && (
        <>
          <div className="sun-glow" />
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="weather-particle sun-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                fontSize: `${particle.size}px`,
                opacity: particle.opacity,
                transform: `translate(-50%, -50%) rotate(${particle.rotation || 0}deg)`,
              }}
            >
              ✨
            </div>
          ))}
        </>
      )}

      {/* 云朵 */}
      {weatherType === 'cloudy' &&
        particles.map((particle) => (
          <div
            key={particle.id}
            className="weather-particle cloud-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size * 0.6}px`,
              opacity: particle.opacity,
            }}
          >
            ☁️
          </div>
        ))}

      {/* 点击效果 */}
      {clickEffects.map((effect) => {
        if (effect.type === 'particle') {
          const angle = (Math.random() * 360 * Math.PI) / 180
          const distance = 30 + Math.random() * 40
          const offsetX = Math.cos(angle) * distance
          const offsetY = Math.sin(angle) * distance

          return (
            <div
              key={effect.id}
              className="click-particle"
              style={{
                left: `${effect.x}%`,
                top: `${effect.y}%`,
                '--offset-x': `${offsetX}px`,
                '--offset-y': `${offsetY}px`,
              } as React.CSSProperties}
            />
          )
        }

        if (effect.type === 'sparkle') {
          return (
            <div
              key={effect.id}
              className="click-sparkle"
              style={{
                left: `${effect.x}%`,
                top: `${effect.y}%`,
              }}
            >
              ✨
            </div>
          )
        }

        if (effect.type === 'text') {
          return (
            <div
              key={effect.id}
              className="click-text"
              style={{
                left: `${effect.x}%`,
                top: `${effect.y}%`,
              }}
            >
              {effect.text}
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default WeatherEffect

