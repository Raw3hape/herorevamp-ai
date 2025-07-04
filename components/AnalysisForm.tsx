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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Введите URL сайта для анализа
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError('')
              }}
              placeholder="https://example.com"
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Анализировать сайт
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Как это работает:</h3>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Мы сделаем скриншоты вашего сайта</li>
            <li>AI проанализирует дизайн и контент</li>
            <li>Вы выберете стиль для нового дизайна</li>
            <li>Получите 2 современных варианта редизайна</li>
          </ol>
        </div>
      </div>
    </div>
  )
}