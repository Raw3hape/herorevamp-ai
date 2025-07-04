import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export async function getBrowser() {
  if (process.env.NODE_ENV === 'development') {
    // Для локальной разработки используем обычный Chrome
    return puppeteer.launch({
      headless: true,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Путь для macOS
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
  } else {
    // Для production (Vercel) используем @sparticuz/chromium
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    })
  }
}