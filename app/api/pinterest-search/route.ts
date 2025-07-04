import { NextResponse } from 'next/server'

// Временные моковые данные для разработки
// TODO: Заменить на реальный Pinterest API
const generateMockPins = (query: string, count: number = 6) => {
  const styles = [
    'Минималистичный', 'Современный', 'Корпоративный', 
    'Технологичный', 'Элегантный', 'Яркий'
  ]
  
  const descriptions = [
    'Чистый дизайн с акцентом на типографику',
    'Градиентные элементы и современные формы',
    'Профессиональный вид с четкой структурой',
    'Футуристичный подход с анимациями',
    'Премиальный стиль с изысканными деталями',
    'Смелые цвета и динамичная композиция'
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `pin-${Date.now()}-${i}`,
    imageUrl: `https://picsum.photos/400/300?random=${Date.now() + i}`,
    title: `${styles[i % styles.length]} дизайн`,
    description: descriptions[i % descriptions.length],
    link: `https://pinterest.com/pin/${Date.now()}-${i}`
  }))
}

export async function POST(request: Request) {
  try {
    const { query, industry, style } = await request.json()
    
    // Формируем поисковый запрос
    const searchQuery = [
      query,
      industry && `${industry} website`,
      style && `${style} design`,
      'hero section'
    ].filter(Boolean).join(' ')
    
    // TODO: Интегрировать реальный Pinterest API
    // const pins = await searchPinterest(searchQuery)
    
    // Пока используем моковые данные
    const pins = generateMockPins(searchQuery)
    
    return NextResponse.json({
      pins,
      query: searchQuery,
      total: pins.length
    })
    
  } catch (error) {
    console.error('Ошибка поиска Pinterest:', error)
    return NextResponse.json(
      { error: 'Ошибка при поиске референсов' },
      { status: 500 }
    )
  }
}