'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingMessage {
  text: string
  emoji: string
}

const loadingMessages: LoadingMessage[] = [
  { text: "Анализируем пиксели вашего сайта...", emoji: "🔍" },
  { text: "Консультируемся с AI-дизайнером...", emoji: "🤖" },
  { text: "Изучаем последние тренды Dribbble...", emoji: "🎨" },
  { text: "Миксуем цвета как профессиональный бариста...", emoji: "☕" },
  { text: "Применяем золотое сечение...", emoji: "📐" },
  { text: "Добавляем щепотку креатива...", emoji: "✨" },
  { text: "Полируем пиксели до блеска...", emoji: "💎" },
  { text: "Почти готово! AI рисует последние штрихи...", emoji: "🖌️" }
]

const designTips = [
  {
    title: "Знаете ли вы?",
    text: "60% пользователей судят о надежности компании по дизайну сайта",
    icon: "💡"
  },
  {
    title: "Совет дизайнера:",
    text: "Белое пространство - ваш друг. Не бойтесь 'пустоты' в дизайне",
    icon: "🎯"
  },
  {
    title: "Тренд 2024:",
    text: "Градиенты возвращаются! Но теперь они более subtle и элегантные",
    icon: "🌈"
  },
  {
    title: "UX-правило:",
    text: "Пользователь должен понять, что делает ваш продукт за 5 секунд",
    icon: "⏱️"
  },
  {
    title: "Психология цвета:",
    text: "Синий вызывает доверие, зеленый - рост, оранжевый - действие",
    icon: "🎨"
  }
]

export function LoadingMessages({ stage }: { stage: 'analysis' | 'generation' }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [tipIndex, setTipIndex] = useState(Math.floor(Math.random() * designTips.length))
  const [progressComplete, setProgressComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const currentMessage = loadingMessages[messageIndex]
  const currentTip = designTips[tipIndex]

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Анимированная иконка */}
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-6xl"
        >
          {stage === 'analysis' ? '🔍' : '🎨'}
        </motion.div>
        
        {/* Орбитальные точки */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500 rounded-full"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, 30 * Math.cos(i * 120 * Math.PI / 180), 0],
              y: [0, 30 * Math.sin(i * 120 * Math.PI / 180), 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Забавные сообщения */}
      <AnimatePresence mode="wait">
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xl font-medium text-gray-800">
            <span className="mr-2">{currentMessage.emoji}</span>
            {currentMessage.text}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Прогресс бар */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
          animate={{
            width: ["0%", "100%"],
          }}
          transition={{
            duration: 30,
            ease: "linear"
          }}
          onAnimationComplete={() => setProgressComplete(true)}
        />
      </div>
      
      {/* Сообщение после завершения */}
      {progressComplete && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 mt-3 font-medium"
        >
          Еще несколько секунд, финализируем результат...
        </motion.p>
      )}

      {/* Образовательный контент */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="max-w-md p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100"
      >
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{currentTip.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">{currentTip.title}</h3>
            <p className="text-sm text-gray-600">{currentTip.text}</p>
          </div>
        </div>
      </motion.div>

    </div>
  )
}