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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Назад
          </button>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Выберите стиль редизайна
        </h2>
        <p className="text-gray-600 mb-8">
          Можно выбрать до 3 стилей или оставить выбор за AI
        </p>

        {analysis?.summary && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Анализ сайта:</h3>
            <p className="text-blue-800">{analysis.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {STYLE_OPTIONS.map(style => (
            <button
              key={style.id}
              onClick={() => toggleStyle(style.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedStyles.includes(style.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-1">{style.name}</h3>
              <p className="text-sm text-gray-600">{style.description}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onGenerate}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            {selectedStyles.length === 0 
              ? 'Сгенерировать с выбором AI'
              : `Сгенерировать (${selectedStyles.length} ${selectedStyles.length === 1 ? 'стиль' : 'стиля'})`
            }
          </button>
        </div>
      </div>
    </div>
  )
}