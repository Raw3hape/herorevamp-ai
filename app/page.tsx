'use client'

import { useState } from 'react'
import { AnalysisForm } from '@/components/AnalysisForm'
import { StyleSelector } from '@/components/StyleSelector'
import { ResultsDisplay } from '@/components/ResultsDisplay'
import { LoadingState } from '@/components/LoadingState'
import { PinterestReferences } from '@/components/PinterestReferences'

export default function Home() {
  const [step, setStep] = useState<'input' | 'pinterest' | 'styles' | 'results'>('input')
  const [url, setUrl] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedPins, setSelectedPins] = useState<any[]>([])
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
      setStep('pinterest')
    } catch (error) {
      console.error('Ошибка анализа:', error)
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
          styles: selectedStyles,
          pinterestReferences: selectedPins 
        })
      })
      
      const data = await response.json()
      setResults(data)
      setStep('results')
    } catch (error) {
      console.error('Ошибка генерации:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = () => {
    setStep('input')
    setUrl('')
    setAnalysis(null)
    setSelectedStyles([])
    setSelectedPins([])
    setResults(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            HeroRevamp AI
          </h1>
          <p className="text-xl text-gray-600">
            Мгновенный AI-редизайн hero-секций устаревших сайтов
          </p>
        </div>

        {loading && <LoadingState stage={loadingStage} />}

        {!loading && (
          <>
            {step === 'input' && (
              <AnalysisForm onAnalyze={handleAnalyze} />
            )}

            {step === 'pinterest' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <PinterestReferences
                    onSelect={(pins) => {
                      setSelectedPins(pins)
                      setStep('styles')
                    }}
                    industry={analysis?.industry}
                    style={analysis?.recommendedStyle}
                  />
                </div>
              </div>
            )}

            {step === 'styles' && (
              <StyleSelector 
                analysis={analysis}
                selectedStyles={selectedStyles}
                onStylesChange={setSelectedStyles}
                onGenerate={handleGenerate}
                onBack={() => setStep('pinterest')}
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