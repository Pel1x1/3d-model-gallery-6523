# Аутентификация

## Обзор

Система аутентификации реализована **полностью на клиенте** с использованием React Context API и `localStorage`. Серверный API для аутентификации отсутствует — это упрощённая демо-реализация.

> **Важно для продакшена:** В реальном приложении аутентификацию следует перенести на сервер с использованием JWT или сессий, а пароли хранить в хешированном виде.

---

## Файлы

| Файл | Назначение |
|---|---|
| `client/context/AuthContext.tsx` | Контекст, провайдер и хук `useAuth()` |
| `client/components/ProtectedRoute.tsx` | HOC-компонент защиты маршрутов |
| `client/pages/Login.tsx` | Страница входа |
| `client/pages/Register.tsx` | Страница регистрации |

---

## AuthContext

### Интерфейс пользователя

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}
```

### Интерфейс контекста

```typescript
interface AuthContextType {
  user: User | null;         // Текущий пользователь (null если не авторизован)
  isAuthenticated: boolean;  // true если пользователь авторизован
  isLoading: boolean;        // true пока идёт инициализация из localStorage
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}
```

---

## Хранилище данных

Данные пользователей хранятся в `localStorage` в двух ключах:

| Ключ | Содержимое |
|---|---|
| `users` | JSON-массив всех зарегистрированных пользователей (с паролями) |
| `user` | JSON-объект текущего авторизованного пользователя (без пароля) |

При первом запуске приложение автоматически создаёт демо-пользователя:
```json
{
  "id": "demo_user_1",
  "email": "demo@example.com",
  "password": "123456",
  "name": "Demo User"
}
```

---

## Методы

### login(email, password)

1. Проверяет, что оба поля заполнены
2. Проверяет корректность email (наличие `@`)
3. Проверяет длину пароля (минимум 6 символов)
4. Ищет пользователя в `localStorage["users"]` по email + пароль
5. Если найден — сохраняет объект `User` в стейт и в `localStorage["user"]`
6. Если не найден — бросает ошибку `"Неверная электронная почта или пароль"`

### register(email, password, name)

1. Проверяет все обязательные поля
2. Проверяет корректность email
3. Проверяет длину пароля (минимум 6 символов)
4. Проверяет длину имени (минимум 2 символа)
5. Проверяет, что email ещё не занят
6. Создаёт нового пользователя с уникальным `id = "user_" + Date.now()`
7. Добавляет в массив `localStorage["users"]`
8. Авторизует пользователя автоматически

### logout()

Очищает стейт (`user = null`) и удаляет `localStorage["user"]`.

---

## Хук useAuth()

```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, register, logout } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <p>Не авторизован</p>;

  return <p>Привет, {user.name}!</p>;
}
```

Хук должен вызываться **внутри** `AuthProvider`. Иначе будет выброшена ошибка:
```
useAuth must be used within an AuthProvider
```

---

## Защита маршрутов

Компонент `ProtectedRoute` проверяет `isAuthenticated` из контекста:

```tsx
// client/App.tsx
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
```

Если пользователь не авторизован и пытается открыть защищённый маршрут — он автоматически перенаправляется на `/login`.

---

## Демо-аккаунт

| Поле | Значение |
|---|---|
| Email | `demo@example.com` |
| Пароль | `123456` |
| Имя | `Demo User` |

---

## Ограничения текущей реализации

- Пароли хранятся в открытом виде в `localStorage` — **небезопасно для продакшена**
- Нет токенов/сессий — данные доступны любому JS-коду на странице
- Нет восстановления пароля
- Нет верификации email
- Нет ролей и разграничения прав доступа
