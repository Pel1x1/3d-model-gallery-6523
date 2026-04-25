# Архитектура проекта

## Общая схема

Приложение построено по архитектуре **Full-Stack SPA** — единое React-приложение на фронтенде, обслуживаемое Express-сервером на бэкенде. В режиме разработки оба слоя работают на одном порту (8080) благодаря интеграции Vite с Express.

```
Браузер
  │
  │  HTTP / REST API
  ▼
┌─────────────────────────────────────────────┐
│              Express-сервер (порт 8080)      │
│                                             │
│  ┌─────────────────┐  ┌──────────────────┐  │
│  │  Vite Dev / SPA │  │   REST API /api  │  │
│  │  (статика React)│  │   (бизнес-логика)│  │
│  └─────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## Структура каталогов

```
3d-model-gallery/
├── client/                  # React SPA (фронтенд)
│   ├── App.tsx              # Точка входа, маршрутизация
│   ├── global.css           # Глобальные стили, CSS-переменные темы
│   ├── vite-env.d.ts        # Типы для окружения Vite
│   ├── pages/               # Страницы (компоненты маршрутов)
│   │   ├── Index.tsx        # Главная — галерея моделей
│   │   ├── ModelDetail.tsx  # Детальная страница модели
│   │   ├── Login.tsx        # Страница входа
│   │   ├── Register.tsx     # Страница регистрации
│   │   ├── Profile.tsx      # Профиль пользователя + загрузка
│   │   └── NotFound.tsx     # Страница 404
│   ├── components/
│   │   ├── Layout.tsx       # Общий макет (шапка, навигация)
│   │   ├── ModelViewer.tsx  # 3D-вьювер (Three.js / R3F)
│   │   ├── ProtectedRoute.tsx # HOC защиты маршрутов
│   │   └── ui/              # Библиотека UI-компонентов (Radix + shadcn)
│   ├── context/
│   │   └── AuthContext.tsx  # Контекст аутентификации
│   ├── hooks/
│   │   ├── use-mobile.tsx   # Хук определения мобильного устройства
│   │   └── use-toast.ts     # Хук toast-уведомлений
│   └── lib/
│       └── utils.ts         # Утилита cn() для классов Tailwind
│
├── server/                  # Express бэкенд
│   ├── index.ts             # Создание и конфигурация Express-приложения
│   ├── node-build.ts        # Точка входа для продакшен-бинаря
│   └── routes/
│       ├── demo.ts          # Демо-эндпоинт /api/demo
│       └── models.ts        # CRUD для 3D-моделей
│
├── shared/                  # Общий код (клиент + сервер)
│   └── api.ts               # TypeScript-интерфейсы для API
│
├── netlify/
│   └── functions/api.ts     # Адаптер для деплоя на Netlify Functions
│
├── public/
│   └── robots.txt
│
├── vite.config.ts           # Конфиг Vite для клиента
├── vite.config.server.ts    # Конфиг Vite для сборки сервера
├── tailwind.config.ts       # Конфиг Tailwind CSS
├── tsconfig.json            # Настройки TypeScript
└── package.json
```

---

## Слои приложения

### 1. Фронтенд (client/)

React 18 SPA с клиентской маршрутизацией через React Router 6. Приложение использует следующие паттерны:

- **Контекст React** (`AuthContext`) для глобального состояния аутентификации
- **TanStack Query** (`@tanstack/react-query`) для кеширования и загрузки серверных данных
- **React Three Fiber** для рендеринга 3D-сцен прямо в JSX
- **Radix UI + TailwindCSS** для доступных и стилизованных UI-компонентов

### 2. Бэкенд (server/)

Express 5 сервер с минимальным набором REST API-эндпоинтов. Данные хранятся в памяти (`modelsStore` — массив в `models.ts`). В продакшен-среде его следует заменить на реальную базу данных.

Middleware:
- `cors()` — разрешение кросс-доменных запросов
- `express.json()` — разбор JSON-тел запросов
- `express.urlencoded()` — разбор form-encoded тел

### 3. Общий код (shared/)

Типы TypeScript, которые импортируются как на клиенте (через алиас `@shared/*`), так и на сервере. Это гарантирует типобезопасность на обоих концах.

---

## Путевые алиасы

| Алиас | Путь |
|---|---|
| `@/*` | `client/*` |
| `@shared/*` | `shared/*` |

Алиасы настроены в `tsconfig.json` и `vite.config.ts`.

---

## Сборка

### Клиент

```bash
pnpm build:client
```

Vite собирает React SPA в директорию `dist/spa/`.

### Сервер

```bash
pnpm build:server
```

Vite (с конфигом `vite.config.server.ts`) компилирует Express-сервер в `dist/server/node-build.mjs`.

### Продакшен-запуск

```bash
pnpm start
# → node dist/server/node-build.mjs
```

Сервер раздаёт статику SPA из `dist/spa/` и обрабатывает API-запросы.

---

## Деплой на Netlify

Для деплоя на Netlify предусмотрен адаптер `netlify/functions/api.ts`, который оборачивает Express-приложение в Netlify Function. Конфигурация описана в `netlify.toml`.
