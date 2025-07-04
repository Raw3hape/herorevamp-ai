'use client'

import { LoadingMessages } from './LoadingMessages'

interface LoadingStateProps {
  stage?: 'analysis' | 'generation'
}

export function LoadingState({ stage = 'analysis' }: LoadingStateProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-12 max-w-2xl w-full shadow-2xl">
        <LoadingMessages stage={stage} />
      </div>
    </div>
  )
}