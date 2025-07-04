'use client'

import { useState } from 'react'

interface AnalysisFormProps {
  onAnalyze: (url: string) => void
}

export function AnalysisForm({ onAnalyze }: AnalysisFormProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      setError('Введите URL сайта')
      return
    }

    try {
      new URL(url)
      onAnalyze(url)
    } catch {
      setError('Введите корректный URL')
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setError('')
            }}
            placeholder="https://example.com"
            className="w-full px-6 py-4 text-xl bg-transparent border border-gray-700 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full md:w-auto mx-auto block px-16 py-4 bg-white text-black font-medium text-lg rounded-sm hover:bg-gray-200 transition-colors"
        >
          Начать анализ
        </button>
      </form>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8 mt-24 text-center">
        <div>
          <div className="text-4xl font-light mb-2">60<span className="text-gray-400">s</span></div>
          <div className="text-sm text-gray-400">Время генерации</div>
        </div>
        <div>
          <div className="text-4xl font-light mb-2">2<span className="text-gray-400">x</span></div>
          <div className="text-sm text-gray-400">Варианты дизайна</div>
        </div>
        <div>
          <div className="text-4xl font-light mb-2">100<span className="text-gray-400">%</span></div>
          <div className="text-sm text-gray-400">AI-качество</div>
        </div>
      </div>
    </div>
  )
}