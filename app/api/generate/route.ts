import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { logger } from '@/lib/logger'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const STYLE_PROMPTS = {
  minimalist: 'минималистичный дизайн с большим количеством пространства, чистые линии, монохромная палитра',
  bold: 'яркий и смелый дизайн с насыщенными цветами, крупной типографикой, динамичными элементами',
  corporate: 'корпоративный профессиональный стиль, вызывающий доверие, с четкой структурой',
  playful: 'игривый дружелюбный дизайн с закругленными формами, яркими акцентами, анимациями',
  elegant: 'элегантный премиальный дизайн с изысканной типографикой, сдержанной палитрой',
  tech: 'технологичный футуристичный стиль с градиентами, геометрическими формами, современный',
  organic: 'органический дизайн с природными формами, мягкими цветами, естественными текстурами',
  retro: 'ретро-современный стиль, сочетающий винтажные элементы с современным подходом'
}

export async function POST(request: Request) {
  try {
    const { url, analysis, styles } = await request.json()
    logger.info('Начата генерация дизайна', { url, styles })
    
    // Формируем стилевые предпочтения
    const styleDescriptions = styles.length > 0 
      ? styles.map((s: string) => STYLE_PROMPTS[s as keyof typeof STYLE_PROMPTS]).join(', ')
      : 'современный трендовый дизайн по выбору AI'
    
    // Генерируем промпты для DALL-E
    const promptResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Ты эксперт по созданию промптов для DALL-E 3 для генерации дизайна hero-секций веб-сайтов. 
          Создавай детальные промпты, которые включают:
          - Точное описание композиции и расположения элементов
          - Цветовую схему
          - Типографику и стиль текста
          - Визуальные элементы и графику
          - Общее настроение и атмосферу
          
          Важно: промпт должен быть на английском языке.`
        },
        {
          role: "user",
          content: `На основе анализа сайта создай 2 разных промпта для генерации современного редизайна hero-секции.
          
          Анализ сайта: ${analysis.summary}
          Стилевые предпочтения: ${styleDescriptions}
          
          Каждый промпт должен предлагать уникальный подход к дизайну, сохраняя при этом суть бренда.
          
          Формат ответа:
          PROMPT1: [промпт на английском]
          PROMPT2: [промпт на английском]`
        }
      ],
      max_tokens: 1000
    })
    
    const prompts = promptResponse.choices[0].message.content?.match(/PROMPT\d: (.+)/g)?.map(p => p.replace(/PROMPT\d: /, '')) || []
    
    // Генерируем изображения
    const designs = await Promise.all(prompts.slice(0, 2).map(async (prompt, index) => {
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Modern website hero section design: ${prompt}. High quality web design mockup, UI/UX design, professional, clean, no text overlays`,
        size: "1792x1024",
        quality: "hd",
        n: 1,
      })
      
      return {
        imageUrl: imageResponse.data?.[0]?.url || '',
        style: styles[index] || 'AI-выбор',
        description: `Вариант ${index + 1} с учетом выбранных стилевых предпочтений`,
        prompt: prompt
      }
    }))
    
    return NextResponse.json({ designs })
    
  } catch (error) {
    logger.error('Ошибка генерации дизайна', error as Error)
    return NextResponse.json(
      { error: 'Ошибка при генерации дизайна' },
      { status: 500 }
    )
  }
}