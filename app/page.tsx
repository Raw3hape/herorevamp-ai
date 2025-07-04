'use client'

import { useState, useEffect } from 'react'
import { AnalysisForm } from '@/components/AnalysisForm'
import { StyleSelector } from '@/components/StyleSelector'
import { ResultsDisplay } from '@/components/ResultsDisplay'
import { LoadingState } from '@/components/LoadingState'
import { ParticlesBackground } from '@/components/ParticlesBackground'
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
    <main className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Animated gradient background */}
      <div className="fixed inset-0 gradient-animate opacity-10 z-0" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">↑</span>
            </div>
            <span className="text-2xl font-semibold text-gradient">HeroRevamp</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition font-medium">Примеры</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition font-medium">API</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition font-medium">Контакты</a>
          </nav>
        </header>

        {/* Hero Section */}
        {step === 'input' && (
          <div className="min-h-[70vh] flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              <span className="text-gradient">Редизайн</span><br/>
              <span className="text-gray-700">за 60 секунд</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
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