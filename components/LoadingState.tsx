'use client'

export function LoadingState() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-900">Обрабатываем...</p>
          <p className="text-sm text-gray-600 mt-2 text-center">
            AI анализирует сайт и создает дизайн
          </p>
        </div>
      </div>
    </div>
  )
}