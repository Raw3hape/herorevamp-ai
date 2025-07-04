'use client'

import { LoadingMessages } from './LoadingMessages'

interface LoadingStateProps {
  stage?: 'analysis' | 'generation'
}

export function LoadingState({ stage = 'analysis' }: LoadingStateProps) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-w-2xl w-full p-8">
        <div className="glass rounded-3xl p-12">
          <LoadingMessages stage={stage} />
        </div>
      </div>
    </div>
  )
}