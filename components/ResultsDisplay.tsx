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
      <h2 className="text-4xl font-light mb-12">
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
            <div className="relative aspect-[16/9] bg-gray-900 rounded-sm overflow-hidden">
              <Image
                src={design.imageUrl}
                alt={`Вариант дизайна ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {/* Overlay with download button */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadImage(design.imageUrl, `herorevamp-design-${index + 1}.png`)
                  }}
                  className="px-6 py-3 bg-white text-black font-medium rounded-sm hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Скачать</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium text-white text-lg mb-2">
                Вариант {index + 1}
              </h3>
              <p className="text-gray-400">
                {design.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center space-x-6">
        <button
          onClick={onRegenerate}
          className="px-8 py-3 border border-gray-700 text-white font-medium rounded-sm hover:border-gray-500 transition-colors"
        >
          Перегенерировать
        </button>
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-white text-black font-medium rounded-sm hover:bg-gray-200 transition-colors"
        >
          Новый анализ
        </button>
      </div>
    </div>
  )
}