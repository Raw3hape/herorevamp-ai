# HeroRevamp AI - Документация проекта

## 📋 Текущий статус
- **URL**: https://herorevamp-ai.vercel.app/
- **GitHub**: https://github.com/Raw3hape/herorevamp-ai
- **Последний коммит**: a2bc7f7 - Волны с параллаксом

## 🛠️ Технологии
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI**: OpenAI API (GPT-4 Vision + DALL-E 3)
- **Скриншоты**: Puppeteer с @sparticuz/chromium
- **Анимации**: Framer Motion
- **Хостинг**: Vercel

## 📁 Структура проекта
```
herorevamp-ai/
├── app/
│   ├── page.tsx              # Главная страница
│   ├── layout.tsx            # Layout приложения
│   ├── globals.css           # Глобальные стили
│   └── api/
│       ├── analyze/          # API для анализа сайтов
│       ├── generate/         # API для генерации дизайнов
│       └── log-error/        # API для логирования ошибок
├── components/
│   ├── AnalysisForm.tsx      # Форма ввода URL
│   ├── StyleSelector.tsx     # Выбор стилей дизайна
│   ├── ResultsDisplay.tsx    # Отображение результатов
│   ├── LoadingState.tsx      # Состояние загрузки
│   ├── LoadingMessages.tsx   # Анимированные сообщения
│   └── ParticlesBackground.tsx # 3D волны частиц
├── lib/
│   ├── puppeteer.ts          # Конфигурация Puppeteer
│   └── logger.ts             # Система логирования
└── types/
    └── index.ts              # TypeScript типы

```

## 🚀 Быстрый старт

### Локальная разработка:
```bash
cd /Users/nikita/Desktop/Design\ generation/herorevamp-ai
npm run dev
```
Откройте http://localhost:3000

### Деплой на Vercel:
```bash
git add .
git commit -m "Описание изменений"
git push
```
Vercel автоматически развернет изменения

## 🔑 Переменные окружения
В файле `.env.local`:
```
OPENAI_API_KEY=your_key_here
```

## 📝 Текущие особенности

### Дизайн:
- Светлая тема с градиентами
- Glass morphism эффекты
- Интерактивные 3D волны из частиц (1000 прямоугольников)
- Фиолетовый градиент с параллаксом
- Анимированный фон

### Функциональность:
- Анализ сайта через скриншот + парсинг текста
- GPT-4 Vision анализирует дизайн и контент
- Выбор до 3 стилей для генерации
- DALL-E 3 создает 2 варианта дизайна
- Скачивание результатов
- Система логирования ошибок

### Процесс:
1. Пользователь вводит URL
2. Делается скриншот и парсинг
3. GPT-4 анализирует сайт
4. Пользователь выбирает стили
5. Генерируются 2 варианта дизайна

## 🐛 Известные проблемы
- Лимит времени выполнения на Vercel - 10 секунд
- Puppeteer может быть медленным для больших сайтов

## 💡 Идеи для улучшений
- Добавить историю генераций
- Реализовать кеширование результатов
- Добавить больше стилей дизайна
- Интеграция с внешним API для скриншотов
- Добавить экспорт в Figma

## 📊 Команды для мониторинга
- Логи Vercel: https://vercel.com/dashboard
- GitHub Actions: В репозитории → Actions
- Использование OpenAI: https://platform.openai.com/usage

## 🔧 Полезные команды
```bash
# Проверка TypeScript
npx tsc --noEmit

# Локальная сборка
npm run build

# Просмотр логов git
git log --oneline -10

# Откат изменений
git reset --soft HEAD~1
```

---
Последнее обновление: 2025-07-04