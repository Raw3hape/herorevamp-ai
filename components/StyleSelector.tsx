'use client'

interface StyleSelectorProps {
  analysis: any
  selectedStyles: string[]
  onStylesChange: (styles: string[]) => void
  onGenerate: () => void
  onBack: () => void
}

const STYLE_OPTIONS = [
  { id: 'minimalist', name: 'Минималистичный', description: 'Чистый, современный, много пространства' },
  { id: 'bold', name: 'Яркий и смелый', description: 'Насыщенные цвета, крупная типографика' },
  { id: 'corporate', name: 'Корпоративный', description: 'Профессиональный, доверие, надежность' },
  { id: 'playful', name: 'Игривый', description: 'Дружелюбный, анимации, закругленные формы' },
  { id: 'elegant', name: 'Элегантный', description: 'Премиальный, изысканный, утонченный' },
  { id: 'tech', name: 'Технологичный', description: 'Футуристичный, градиенты, современный' },
  { id: 'organic', name: 'Органический', description: 'Природные формы, мягкие цвета' },
  { id: 'retro', name: 'Ретро-современный', description: 'Винтаж с современным подходом' }
]

export function StyleSelector({ analysis, selectedStyles, onStylesChange, onGenerate, onBack }: StyleSelectorProps) {
  const toggleStyle = (styleId: string) => {
    if (selectedStyles.includes(styleId)) {
      onStylesChange(selectedStyles.filter(s => s !== styleId))
    } else if (selectedStyles.length < 3) {
      onStylesChange([...selectedStyles, styleId])
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2 font-medium"
        >
          <span>←</span>
          <span>Назад</span>
        </button>
      </div>

      <h2 className="text-4xl font-bold text-gradient mb-4">
        Выберите стиль
      </h2>
      <p className="text-gray-600 mb-12 text-lg">
        Можно выбрать до 3 стилей или довериться AI
      </p>

        {analysis?.summary && (
          <div className="mb-12 p-6 glass rounded-2xl">
            <h3 className="font-semibold text-gray-800 mb-3">Анализ сайта</h3>
            <p className="text-gray-600 leading-relaxed">{analysis.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {STYLE_OPTIONS.map(style => (
            <button
              key={style.id}
              onClick={() => toggleStyle(style.id)}
              className={`p-6 rounded-2xl transition-all text-left ${
                selectedStyles.includes(style.id)
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-xl scale-105'
                  : 'glass hover:shadow-lg hover:scale-102'
              }`}
            >
              <h3 className={`font-semibold mb-2 ${selectedStyles.includes(style.id) ? 'text-white' : 'text-gray-800'}`}>{style.name}</h3>
              <p className={`text-sm ${selectedStyles.includes(style.id) ? 'text-white/90' : 'text-gray-600'}`}>{style.description}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onGenerate}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {selectedStyles.length === 0 
              ? 'Сгенерировать'
              : `Сгенерировать ${selectedStyles.length} ${selectedStyles.length === 1 ? 'вариант' : 'варианта'}`
            }
          </button>
        </div>
    </div>
  )
}