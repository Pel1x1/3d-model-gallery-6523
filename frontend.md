# Фронтенд

## Маршрутизация

Маршруты определены в `client/App.tsx` с помощью React Router 6.

| Путь | Компонент | Доступ |
|---|---|---|
| `/` | `Index` | Публичный |
| `/model/:id` | `ModelDetail` | Публичный |
| `/login` | `Login` | Публичный |
| `/register` | `Register` | Публичный |
| `/profile` | `Profile` | Только авторизованные |
| `*` | `NotFound` | Публичный |

Маршрут `/profile` обёрнут в `<ProtectedRoute>` — неавторизованный пользователь будет перенаправлен на `/login`.

---

## Страницы

### Index (`client/pages/Index.tsx`)

Главная страница — галерея всех 3D-моделей.

**Что делает:**
- Запрашивает `GET /api/models` при монтировании
- Отображает карточки моделей в сетке (grid)
- Каждая карточка содержит превью, название, описание, теги и автора
- Клик по карточке переходит на `/model/:id`

---

### ModelDetail (`client/pages/ModelDetail.tsx`)

Детальная страница модели с 3D-вьювером.

**Что делает:**
- Извлекает `id` из URL-параметра (`useParams`)
- Запрашивает `GET /api/models/:id`
- Рендерит `<ModelViewer>` с файлом модели
- Показывает метаданные: название, описание, автор, дата, теги
- Кнопки «Скачать» и «Поделиться»

---

### Login (`client/pages/Login.tsx`)

Страница входа в систему.

**Что делает:**
- Форма с полями email и пароль
- Вызывает `useAuth().login(email, password)`
- При успехе — редирект на `/`
- При ошибке — отображает сообщение об ошибке
- Ссылка на демо-учётные данные (`demo@example.com` / `123456`)

---

### Register (`client/pages/Register.tsx`)

Страница регистрации нового пользователя.

**Что делает:**
- Форма с полями имя, email, пароль, подтверждение пароля
- Проверяет совпадение паролей на клиенте
- Вызывает `useAuth().register(email, password, name)`
- При успехе — редирект на `/`

---

### Profile (`client/pages/Profile.tsx`)

Страница профиля авторизованного пользователя.

**Что делает:**
- Показывает информацию о текущем пользователе (имя, email)
- Форма загрузки новой модели (название, описание, URL файла, URL превью, теги)
- Отправляет `POST /api/models`
- Кнопка «Выйти» вызывает `useAuth().logout()`

---

### NotFound (`client/pages/NotFound.tsx`)

Страница 404 для несуществующих маршрутов.

---

## Компоненты

### Layout (`client/components/Layout.tsx`)

Общий макет страницы с шапкой и навигацией. Оборачивает содержимое большинства страниц.

### ModelViewer (`client/components/ModelViewer.tsx`)

Интерактивный 3D-вьювер на основе **React Three Fiber** и **Three.js**.

**Пропсы:**

| Проп | Тип | Обязательно | Описание |
|---|---|---|---|
| `modelUrl` | `string` | Да | URL .glb-файла для загрузки |
| `title` | `string` | Нет | Подпись, отображаемая поверх вьювера |

**Возможности:**
- Загружает GLTF/GLB модель через `useGLTF` из `@react-three/drei`
- Автоматически масштабирует модель под область просмотра
- Центрирует модель по bounding box
- Автовращение (`autoRotate`, скорость `3`)
- Управление мышью: вращение, зум (скролл), панорамирование
- Освещение: ambient (0.5) + два directional light
- Fallback-кубик при загрузке или ошибке
- Подсказка по управлению появляется при наведении мыши

**Пример использования:**
```tsx
<ModelViewer modelUrl="/models/cube.glb" title="Куб" />
```

### ProtectedRoute (`client/components/ProtectedRoute.tsx`)

HOC-компонент для защиты маршрутов. Проверяет `isAuthenticated` из `AuthContext`. Если пользователь не авторизован — перенаправляет на `/login`.

```tsx
<ProtectedRoute>
  <Profile />
</ProtectedRoute>
```

---

## UI-библиотека (`client/components/ui/`)

Предустановленная библиотека компонентов на основе **Radix UI** и **shadcn/ui**. Все компоненты стилизованы через TailwindCSS и поддерживают тёмную тему.

Доступные компоненты: `Button`, `Card`, `Dialog`, `Input`, `Label`, `Badge`, `Tabs`, `Select`, `Tooltip`, `Toast`, `Sidebar`, `Table`, `Form`, `Avatar`, `Dropdown Menu`, `Sheet`, `Progress`, `Skeleton`, и другие.

---

## Стилизация

### Глобальные стили

Файл `client/global.css` содержит CSS-переменные цветовой темы в формате HSL:

```css
:root {
  --background: 0 0% 99%;
  --foreground: 219 14% 20%;
  --primary: 215 100% 50%;    /* Синий */
  --secondary: 263 80% 50%;   /* Фиолетовый */
  --radius: 0.75rem;
  /* ...и другие токены */
}
```

### Утилита `cn()`

Для объединения классов Tailwind используется функция `cn()` из `client/lib/utils.ts`:

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  { "conditional-class": someCondition },
  props.className
)} />
```

`cn()` объединяет `clsx` и `tailwind-merge`, что позволяет безопасно переопределять классы.

---

## Хуки

### `useAuth()`

Хук для работы с контекстом аутентификации. Подробнее — в [документации по аутентификации](./auth.md).

### `useMobile()`

```typescript
import { useMobile } from "@/hooks/use-mobile";

const isMobile = useMobile(); // true если ширина экрана < 768px
```

### `useToast()`

Хук для отображения toast-уведомлений.

```typescript
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();
toast({ title: "Готово!", description: "Модель загружена." });
```

---

## Работа с данными

Для запросов к серверу используется **TanStack Query** (`@tanstack/react-query`). `QueryClient` создаётся в `App.tsx` и оборачивает всё дерево компонентов через `QueryClientProvider`.

Пример паттерна загрузки:

```typescript
import { useQuery } from "@tanstack/react-query";
import { ModelsResponse } from "@shared/api";

const { data, isLoading, error } = useQuery({
  queryKey: ["models"],
  queryFn: async () => {
    const res = await fetch("/api/models");
    return res.json() as Promise<ModelsResponse>;
  },
});
```
