# React + Vite

## Дневник финансов (Money Journal)

Клиентское приложение для ведения личных финансов.

### Стек
- React 19 + Vite
- Tailwind CSS v4
- Recharts (графики), lucide-react (иконки)

### Возможности
- Добавление доходов/расходов, заметки и категории
- Предпросмотр и фильтрация записей
- Аналитика по категориям и эмоциям (графики)
- Локальное хранение в браузере (`localStorage`, ключ `money-diary-v1`)
- Импорт/экспорт JSON

### Запуск локально
1. Установить зависимости:
   ```bash
   npm install
   ```
2. Запустить dev-сервер:
   ```bash
   npm run dev
   ```
   Откройте http://localhost:5173/

### Сборка и предпросмотр
- Сборка: `npm run build`
- Предпросмотр сборки: `npm run preview`

### Деплой
Если деплой на GitHub Pages внутри репозитория, укажите базовый путь:
```bash
# пример для репозитория username/repo
set VITE_BASE=/repo/
# или в .env.local: VITE_BASE=/repo/
```

### Структура
- `index.html` — HTML-шаблон
- `src/main.jsx` — вход в приложение
- `src/App.jsx` — корневой компонент
- `src/features/money-diary/` — основная функциональность
- `src/components/ui/` — переиспользуемые UI-компоненты

### Примечания
- Используется алиас `@` → `./src` (см. `vite.config.js`)
- Стили Tailwind подключены через `@tailwindcss/postcss`
