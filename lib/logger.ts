interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
  context?: any
  error?: any
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 100

  private createEntry(level: LogEntry['level'], message: string, context?: any, error?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : undefined
    }
  }

  info(message: string, context?: any) {
    const entry = this.createEntry('info', message, context)
    this.logs.push(entry)
    this.trimLogs()
    console.log(`[INFO] ${message}`, context || '')
  }

  warn(message: string, context?: any) {
    const entry = this.createEntry('warn', message, context)
    this.logs.push(entry)
    this.trimLogs()
    console.warn(`[WARN] ${message}`, context || '')
  }

  error(message: string, error?: Error, context?: any) {
    const entry = this.createEntry('error', message, context, error)
    this.logs.push(entry)
    this.trimLogs()
    console.error(`[ERROR] ${message}`, error || '', context || '')
    
    // Отправляем критические ошибки в API
    if (typeof window !== 'undefined') {
      this.sendErrorToAPI(entry)
    }
  }

  private trimLogs() {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }

  private async sendErrorToAPI(entry: LogEntry) {
    try {
      await fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      })
    } catch (err) {
      console.error('Failed to send error to API:', err)
    }
  }

  getLogs(level?: LogEntry['level']): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level)
    }
    return this.logs
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = new Logger()