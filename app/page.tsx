'use client'

import { useState, useEffect } from 'react'
import { AnalysisForm } from '@/components/AnalysisForm'
import { StyleSelector } from '@/components/StyleSelector'
import { ResultsDisplay } from '@/components/ResultsDisplay'
import { LoadingState } from '@/components/LoadingState'
import { logger } from '@/lib/logger'

export default function Home() {
  const [step, setStep] = useState<'input' | 'styles' | 'results'>('input')
  const [url, setUrl] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState<'analysis' | 'generation'>('analysis')

  const handleAnalyze = async (inputUrl: string) => {
    setUrl(inputUrl)
    setLoading(true)
    setLoadingStage('analysis')
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl })
      })
      
      const data = await response.json()
      setAnalysis(data)
      setStep('styles')
    } catch (error) {
      logger.error('Ошибка анализа сайта', error as Error, { url: inputUrl })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    setLoadingStage('generation')
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          analysis, 
          styles: selectedStyles 
        })
      })
      
      const data = await response.json()
      setResults(data)
      setStep('results')
    } catch (error) {
      logger.error('Ошибка генерации дизайна', error as Error, { url, styles: selectedStyles })
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = () => {
    setStep('input')
    setUrl('')
    setAnalysis(null)
    setSelectedStyles([])
    setResults(null)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xl">↑</span>
            </div>
            <span className="text-xl font-light tracking-wider">HeroRevamp</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-400 hover:text-white transition">Примеры</a>
            <a href="#" className="text-gray-400 hover:text-white transition">API</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Контакты</a>
          </nav>
        </header>

        {/* Hero Section */}
        {step === 'input' && (
          <div className="min-h-[80vh] flex flex-col justify-center items-center text-center">
            <h1 className="text-6xl md:text-8xl font-light mb-6 tracking-tight">
              Редизайн<br/>
              <span className="text-gray-400">за 60 секунд</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl">
              AI анализирует ваш сайт и создает современный дизайн hero-секции. 
              Просто. Быстро. Качественно.
            </p>
          </div>
        )}

        {loading && <LoadingState stage={loadingStage} />}

        {!loading && (
          <>
            {step === 'input' && (
              <AnalysisForm onAnalyze={handleAnalyze} />
            )}

            {step === 'styles' && (
              <StyleSelector 
                analysis={analysis}
                selectedStyles={selectedStyles}
                onStylesChange={setSelectedStyles}
                onGenerate={handleGenerate}
                onBack={() => setStep('input')}
              />
            )}

            {step === 'results' && (
              <ResultsDisplay 
                results={results}
                onRegenerate={handleGenerate}
                onRestart={handleRestart}
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}