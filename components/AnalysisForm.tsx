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
      const urlObject = new URL(url)
      
      // Проверяем, что это http или https
      if (!['http:', 'https:'].includes(urlObject.protocol)) {
        setError('Используйте http:// или https://')
        return
      }
      
      // Проверяем наличие домена
      if (!urlObject.hostname || urlObject.hostname.length < 3) {
        setError('Укажите корректный домен')
        return
      }
      
      onAnalyze(url)
    } catch {
      setError('Введите корректный URL сайта')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="glass rounded-2xl p-1">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError('')
              }}
              placeholder="https://example.com"
              className="w-full px-6 py-5 text-lg bg-white rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-600/20 transition-all"
              autoComplete="url"
              spellCheck="false"
            />
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full md:w-auto mx-auto block px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Начать анализ
        </button>
      </form>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8 mt-16 text-center">
        <div className="glass rounded-2xl p-6">
          <div className="text-4xl font-bold mb-2 text-gradient">60<span className="text-gray-500 text-3xl">s</span></div>
          <div className="text-sm text-gray-600 font-medium">Время генерации</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-4xl font-bold mb-2 text-gradient">2<span className="text-gray-500 text-3xl">x</span></div>
          <div className="text-sm text-gray-600 font-medium">Варианты дизайна</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-4xl font-bold mb-2 text-gradient">100<span className="text-gray-500 text-3xl">%</span></div>
          <div className="text-sm text-gray-600 font-medium">AI-качество</div>
        </div>
      </div>
    </div>
  )
}