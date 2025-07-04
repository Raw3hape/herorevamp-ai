'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface PinterestPin {
  id: string
  imageUrl: string
  title: string
  description: string
}

interface PinterestReferencesProps {
  onSelect: (pins: PinterestPin[]) => void
  industry?: string
  style?: string
}

// Временные моковые данные (замените на реальный API)
const mockPins: PinterestPin[] = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    title: 'Минималистичный дизайн',
    description: 'Чистый современный интерфейс'
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    title: 'Яркий градиент',
    description: 'Смелые цвета и формы'
  },
  {
    id: '3',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    title: 'Корпоративный стиль',
    description: 'Профессиональный вид'
  },
  {
    id: '4',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    title: 'Технологичный дизайн',
    description: 'Футуристичный подход'
  },
  {
    id: '5',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    title: 'Органический стиль',
    description: 'Природные формы'
  },
  {
    id: '6',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    title: 'Элегантный дизайн',
    description: 'Премиальный вид'
  }
]

export function PinterestReferences({ onSelect, industry, style }: PinterestReferencesProps) {
  const [selectedPins, setSelectedPins] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const togglePin = (pinId: string) => {
    if (selectedPins.includes(pinId)) {
      setSelectedPins(selectedPins.filter(id => id !== pinId))
    } else if (selectedPins.length < 3) {
      setSelectedPins([...selectedPins, pinId])
    }
  }

  const handleSearch = async () => {
    setIsSearching(true)
    // TODO: Интегрировать реальный Pinterest API
    setTimeout(() => {
      setIsSearching(false)
    }, 1000)
  }

  const handleContinue = () => {
    const selected = mockPins.filter(pin => selectedPins.includes(pin.id))
    onSelect(selected)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          📌 Выберите референсы из Pinterest
        </h3>
        <p className="text-gray-600">
          Выберите до 3 дизайнов, которые вам нравятся. AI учтет их при создании вашего редизайна.
        </p>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Например: ${industry || 'modern'} website design`}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50"
          >
            {isSearching ? 'Ищем...' : 'Искать в Pinterest'}
          </button>
        </div>
      </div>

      {/* Сетка пинов */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {mockPins.map((pin, index) => (
          <motion.div
            key={pin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => togglePin(pin.id)}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
              selectedPins.includes(pin.id)
                ? 'ring-4 ring-red-500 transform scale-105'
                : 'hover:transform hover:scale-105'
            }`}
          >
            <div className="relative aspect-[4/3] bg-gray-100">
              <Image
                src={pin.imageUrl}
                alt={pin.title}
                fill
                className="object-cover"
              />
              {selectedPins.includes(pin.id) && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                  <div className="bg-white rounded-full p-2">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 bg-white">
              <h4 className="font-medium text-gray-900 text-sm">{pin.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{pin.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Автоподбор */}
      <div className="mb-6 p-4 bg-red-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-medium">💡 Совет:</span> AI автоматически подобрал эти пины на основе анализа вашего сайта.
          Вы можете выбрать понравившиеся или найти другие через поиск.
        </p>
      </div>

      {/* Кнопки действий */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedPins([])}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200"
        >
          Пропустить референсы
        </button>
        <button
          onClick={handleContinue}
          disabled={selectedPins.length === 0}
          className={`flex-1 px-6 py-3 font-medium rounded-lg transition duration-200 ${
            selectedPins.length > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedPins.length === 0
            ? 'Выберите хотя бы один референс'
            : `Продолжить с ${selectedPins.length} референс${selectedPins.length === 1 ? 'ом' : 'ами'}`
          }
        </button>
      </div>
    </div>
  )
}