import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import OpenAI from 'openai'
import { getBrowser } from '@/lib/puppeteer'
import { logger } from '@/lib/logger'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    logger.info('Начат анализ сайта', { url })
    
    // Запускаем браузер
    const browser = await getBrowser()
    const page = await browser.newPage()
    
    // Устанавливаем viewport для десктопа
    await page.setViewport({ width: 1920, height: 1080 })
    
    // Переходим на сайт
    await page.goto(url, { waitUntil: 'networkidle0' })
    
    // Делаем скриншот всей страницы
    const fullPageScreenshot = await page.screenshot({ 
      fullPage: false,
      type: 'png' 
    })
    
    // Получаем HTML страницы
    const html = await page.content()
    
    // Парсим текстовый контент
    const $ = cheerio.load(html)
    const textContent = {
      title: $('title').text(),
      metaDescription: $('meta[name="description"]').attr('content') || '',
      headings: $('h1, h2, h3').map((_, el) => $(el).text()).get(),
      paragraphs: $('p').map((_, el) => $(el).text()).get().slice(0, 10),
    }
    
    // Делаем скриншот hero-секции (верхняя часть)
    const heroScreenshot = await page.screenshot({
      clip: { x: 0, y: 0, width: 1920, height: 800 },
      type: 'png'
    })
    
    await browser.close()
    
    // Анализируем с помощью GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Проанализируй дизайн и контент этого сайта. 
              Текстовый контент: ${JSON.stringify(textContent)}
              
              Опиши:
              1. О чем этот сайт/бизнес
              2. Текущий стиль дизайна и его проблемы
              3. Целевую аудиторию
              4. Ключевые элементы бренда, которые стоит сохранить
              5. Рекомендации по улучшению
              
              Ответ должен быть на русском языке.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${fullPageScreenshot.toString('base64')}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    })
    
    return NextResponse.json({
      summary: response.choices[0].message.content,
      textContent,
      heroScreenshot: heroScreenshot.toString('base64'),
      fullPageScreenshot: fullPageScreenshot.toString('base64')
    })
    
  } catch (error) {
    logger.error('Ошибка анализа сайта', error as Error, { url: request.url })
    return NextResponse.json(
      { error: 'Ошибка при анализе сайта' },
      { status: 500 }
    )
  }
}