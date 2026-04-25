# Руководство разработчика

## Требования

- **Node.js** >= 18
- **pnpm** >= 10 (`npm install -g pnpm`)

---

## Установка

```bash
# Клонировать репозиторий
git clone <url-репозитория>
cd 3d-model-gallery

# Установить зависимости
pnpm install
```

---

## Команды

| Команда | Описание |
|---|---|
| `pnpm dev` | Запустить dev-сервер (клиент + сервер на порту 8080) |
| `pnpm build` | Собрать клиент и сервер для продакшена |
| `pnpm build:client` | Собрать только React SPA → `dist/spa/` |
| `pnpm build:server` | Собрать только Express-сервер → `dist/server/` |
| `pnpm start` | Запустить продакшен-сервер |
| `pnpm test` | Запустить тесты (Vitest) |
| `pnpm typecheck` | Проверить типы TypeScript |
| `pnpm format.fix` | Отформатировать код через Prettier |

---

## Переменные окружения

Файл `.env` в корне проекта. В репозиторий не коммитится.

| Переменная | Описание | Пример |
|---|---|---|
| `PING_MESSAGE` | Сообщение эндпоинта `/api/ping` | `pong` |

Добавить новую переменную:
1. Указать её в `.env`
2. Получить на сервере через `process.env.MY_VAR` (dotenv подключён в `server/index.ts`)

---

## Режим разработки

```bash
pnpm dev
```

- Запускается Vite dev-сервер, интегрированный с Express
- **Клиент и сервер** работают на одном порту **8080**
- Hot Module Replacement (HMR) для клиентского кода
- Автоматическая перезагрузка сервера при изменении файлов в `server/`
- Прокси API-запросов (`/api/*`) к Express-обработчикам

---

## Добавление новой страницы

1. Создать компонент в `client/pages/MyPage.tsx`
2. Зарегистрировать маршрут в `client/App.tsx`:

```tsx
import MyPage from "./pages/MyPage";

<Route path="/my-page" element={<MyPage />} />
```

Для защищённого маршрута:
```tsx
<Route
  path="/my-page"
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
/>
```

---

## Добавление нового API-эндпоинта

1. (Опционально) Добавить интерфейс ответа в `shared/api.ts`:

```typescript
export interface MyResponse {
  data: string;
}
```

2. Создать обработчик в `server/routes/my-route.ts`:

```typescript
import { RequestHandler } from "express";
import { MyResponse } from "@shared/api";

export const handleMyRoute: RequestHandler = (req, res) => {
  const response: MyResponse = { data: "hello" };
  res.json(response);
};
```

3. Зарегистрировать в `server/index.ts`:

```typescript
import { handleMyRoute } from "./routes/my-route";

app.get("/api/my-endpoint", handleMyRoute);
```

---

## Добавление нового цвета в тему

1. Добавить CSS-переменную в `client/global.css`:

```css
:root {
  --my-color: 120 60% 50%; /* HSL-формат */
}
```

2. Зарегистрировать в `tailwind.config.ts`:

```typescript
colors: {
  "my-color": "hsl(var(--my-color))",
}
```

3. Использовать в компонентах: `className="bg-my-color text-my-color"`

---

## Тестирование

Тесты написаны с использованием **Vitest**. Файлы тестов располагаются рядом с исходниками с суффиксом `.spec.ts` / `.spec.tsx`.

```bash
# Запуск всех тестов
pnpm test

# Запуск в watch-режиме
pnpm vitest
```

Пример существующего теста: `client/lib/utils.spec.ts`.

---

## Сборка для продакшена

```bash
pnpm build
```

Создаёт:
- `dist/spa/` — статика React SPA
- `dist/server/node-build.mjs` — скомпилированный Express-сервер

Запуск:
```bash
pnpm start
# → node dist/server/node-build.mjs
# Сервер будет раздавать SPA из dist/spa/ и обрабатывать /api/*
```

---

## Деплой

### Netlify

Проект готов к деплою на Netlify. Адаптер `netlify/functions/api.ts` оборачивает Express в Netlify Function.

```bash
# Через CLI Netlify
netlify deploy --prod
```

Конфигурация: `netlify.toml`.

### Vercel

Для деплоя на Vercel потребуется настройка `vercel.json` с маршрутизацией API-запросов.

### Самостоятельный сервер (VPS)

```bash
pnpm build
pnpm start
```

Рекомендуется запускать через process-менеджер (например, PM2):
```bash
pm2 start "pnpm start" --name 3d-gallery
```

---

## Структура типов и алиасы путей

| Алиас | Разрешается в |
|---|---|
| `@/*` | `client/*` |
| `@shared/*` | `shared/*` |

Например:
```typescript
import { cn } from "@/lib/utils";           // → client/lib/utils.ts
import { Model } from "@shared/api";         // → shared/api.ts
```

---

## Форматирование кода

Проект использует **Prettier** (конфиг `.prettierrc`).

```bash
# Проверить форматирование
pnpm prettier --check .

# Исправить форматирование
pnpm format.fix
```

Рекомендуется настроить «Format on Save» в редакторе.
