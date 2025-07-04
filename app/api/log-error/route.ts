import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const logEntry = await request.json()
    
    // В production можно отправлять в Sentry, LogRocket, etc.
    console.error('[CLIENT ERROR]', {
      ...logEntry,
      serverTime: new Date().toISOString()
    })
    
    // Можно сохранять в базу данных для анализа
    // await saveToDatabase(logEntry)
    
    return NextResponse.json({ status: 'logged' })
  } catch (error) {
    console.error('Failed to log error:', error)
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    )
  }
}