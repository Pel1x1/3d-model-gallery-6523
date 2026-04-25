# Справочник REST API

Все API-эндпоинты имеют префикс `/api/`. Сервер принимает и возвращает данные в формате **JSON**.

---

## Типы данных

Типы определены в файле `shared/api.ts` и используются как на сервере, так и на клиенте.

### Model

Основная сущность — 3D-модель.

```typescript
interface Model {
  id: string;          // Уникальный идентификатор
  title: string;       // Название модели
  description: string; // Описание
  author: string;      // Имя автора
  fileUrl: string;     // URL файла модели (.glb)
  thumbnailUrl: string;// URL превью-изображения
  createdAt: string;   // Дата создания (ISO 8601)
  updatedAt: string;   // Дата обновления (ISO 8601)
  tags?: string[];     // Теги (опционально)
}
```

---

## Эндпоинты

### GET /api/ping

Проверка доступности сервера.

**Ответ `200 OK`:**
```json
{
  "message": "ping"
}
```

Сообщение можно переопределить через переменную окружения `PING_MESSAGE`.

---

### GET /api/demo

Демо-эндпоинт.

**Ответ `200 OK`:**
```json
{
  "message": "Hello from the server!"
}
```

---

### GET /api/models

Получить список всех 3D-моделей.

**Ответ `200 OK`:**
```json
{
  "models": [
    {
      "id": "1",
      "title": "Cube",
      "description": "A simple 3D cube model with metallic material",
      "author": "Demo User",
      "fileUrl": "/models/cube.glb",
      "thumbnailUrl": "https://...",
      "createdAt": "2026-04-18T10:00:00.000Z",
      "updatedAt": "2026-04-18T10:00:00.000Z",
      "tags": ["cube", "geometric", "basic"]
    }
  ]
}
```

**TypeScript-тип ответа:** `ModelsResponse`

---

### GET /api/models/:id

Получить одну модель по идентификатору.

**Параметры пути:**

| Параметр | Тип | Описание |
|---|---|---|
| `id` | `string` | Идентификатор модели |

**Ответ `200 OK`:**
```json
{
  "model": {
    "id": "1",
    "title": "Cube",
    "description": "A simple 3D cube model with metallic material",
    "author": "Demo User",
    "fileUrl": "/models/cube.glb",
    "thumbnailUrl": "https://...",
    "createdAt": "2026-04-18T10:00:00.000Z",
    "updatedAt": "2026-04-18T10:00:00.000Z",
    "tags": ["cube", "geometric", "basic"]
  }
}
```

**TypeScript-тип ответа:** `ModelDetailResponse`

**Ответ `404 Not Found`:**
```json
{
  "error": "Model not found"
}
```

---

### POST /api/models

Загрузить новую 3D-модель.

**Тело запроса (`Content-Type: application/json`):**

| Поле | Тип | Обязательно | Описание |
|---|---|---|---|
| `title` | `string` | Да | Название модели |
| `description` | `string` | Да | Описание модели |
| `fileUrl` | `string` | Нет | URL .glb-файла (если не указан — `/models/default.glb`) |
| `thumbnailUrl` | `string` | Нет | URL превью (если не указан — картинка по умолчанию) |
| `tags` | `string[]` | Нет | Массив тегов |

**Пример запроса:**
```json
{
  "title": "Моя модель",
  "description": "Описание модели",
  "fileUrl": "https://example.com/model.glb",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "tags": ["custom", "test"]
}
```

**Ответ `201 Created`:**
```json
{
  "success": true,
  "modelId": "7",
  "message": "Model uploaded successfully"
}
```

**TypeScript-тип ответа:** `UploadModelResponse`

**Ответ `400 Bad Request`:**
```json
{
  "error": "Title and description are required"
}
```

---

### GET /api/models/:id/viewer

Получить метаданные для рендеринга модели.

**Параметры пути:**

| Параметр | Тип | Описание |
|---|---|---|
| `id` | `string` | Идентификатор модели |

**Ответ `200 OK`:**
```json
{
  "modelData": "/models/cube.glb",
  "format": "glb",
  "size": 2048
}
```

**TypeScript-тип ответа:** `ModelViewerDataResponse`

**Ответ `404 Not Found`:**
```json
{
  "error": "Model not found"
}
```

---

## Использование на клиенте

Пример получения списка моделей с типобезопасностью:

```typescript
import { ModelsResponse } from '@shared/api';

const response = await fetch('/api/models');
const data: ModelsResponse = await response.json();

data.models.forEach(model => {
  console.log(model.title); // TypeScript знает структуру
});
```

---

## Текущие ограничения

> Данные хранятся **в памяти** (`modelsStore` в `server/routes/models.ts`). При перезапуске сервера добавленные модели теряются. В продакшен-среде необходимо заменить хранилище на реальную базу данных (PostgreSQL, MongoDB и т.п.).
