'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ResultsDisplayProps {
  results: any
  onRegenerate: () => void
  onRestart: () => void
}

export function ResultsDisplay({ results, onRegenerate, onRestart }: ResultsDisplayProps) {
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Варианты редизайна
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {results?.designs?.map((design: any, index: number) => (
            <div 
              key={index}
              className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedDesign === index ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedDesign(index)}
            >
              <div className="relative aspect-[16/9] bg-gray-100">
                <Image
                  src={design.imageUrl}
                  alt={`Вариант дизайна ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Вариант {index + 1}: {design.style}
                </h3>
                <p className="text-sm text-gray-600">
                  {design.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onRegenerate}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Перегенерировать
          </button>
          <button
            onClick={onRestart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Новый анализ
          </button>
        </div>
      </div>
    </div>
  )
}