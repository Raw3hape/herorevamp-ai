'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface ResultsDisplayProps {
  results: any
  onRegenerate: () => void
  onRestart: () => void
}

export function ResultsDisplay({ results, onRegenerate, onRestart }: ResultsDisplayProps) {
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null)

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-gradient mb-12">
        Ваши варианты
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {results?.designs?.map((design: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="group"
          >
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={design.imageUrl}
                alt={`Вариант дизайна ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {/* Overlay with download button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-center pb-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadImage(design.imageUrl, `herorevamp-design-${index + 1}.png`)
                  }}
                  className="px-6 py-3 bg-white/90 backdrop-blur text-gray-900 font-semibold rounded-xl hover:bg-white transition-all flex items-center space-x-2 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Скачать</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                Вариант {index + 1}
              </h3>
              <p className="text-gray-600">
                {design.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center space-x-6">
        <button
          onClick={onRegenerate}
          className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:shadow-md transition-all"
        >
          Перегенерировать
        </button>
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Новый анализ
        </button>
      </div>
    </div>
  )
}