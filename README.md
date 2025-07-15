# BLOGS

Многоуровневое приложение для ведения блогов с поддержкой аутентификации, публикаций, комментариев, лайков/дизлайков, загрузки изображений и аналитики. Проект разделён на backend (Node.js + Prisma) и frontend (React).

## Структура проекта

```
BLOGS/
  backend/         # Серверная часть (Node.js, tRPC, Prisma)
  blogsApp/        # Клиентская часть (React, Vite)
  shared/          # Общие утилиты и типы
  docker-compose.yml
  Dockerfile
  README.md
```

---

## Технологии

- **Backend:** Node.js, TypeScript, tRPC, Prisma, Passport, Sentry, Cloudflare (загрузка), Jest
- **Frontend:** React, Vite, React Router, SCSS, Mixpanel, Sentry, TRPC, React Helmet
- **Общие:** Docker, Docker Compose, ESLint, Prettier, pnpm

---

## Быстрый старт

1. **Клонируйте репозиторий:**
   ```sh
   git clone <repo-url>
   cd BLOGS
   ```

2. **Установите зависимости:**
   ```sh
   pnpm install
   ```

3. **Настройте переменные окружения:**
   - Скопируйте `env.example` в `.env` в каждом из `backend/`, `blogsApp/` и корне.
   - Заполните необходимые значения (DB, Cloudinary, Sentry и др.).

4. **Локальный запуск без Docker:**
   - Backend:
     ```sh
     cd backend
     pnpm dev
     ```
   - Frontend:
     ```sh
     cd blogsApp
     pnpm dev
     ```

---

## Настройка окружения

- **backend/env.example** — пример переменных для backend (DB, JWT, Cloudinary, Sentry и др.)
- **blogsApp/env.example** — пример переменных для frontend (API URL, Sentry и др.)
- **env.docker.example** — пример для Docker-окружения

---

## Backend

### Основные возможности backend

- REST и tRPC API для работы с постами, комментариями, лайками/дизлайками
- Аутентификация (Passport, JWT)
- Миграции и ORM через Prisma
- Загрузка изображений (Cloudflare)
- Логирование, обработка ошибок, интеграция с Sentry
- Скрипты для инициализации БД

#### Структура

- `src/router/` — роутеры tRPC (auth, posts, upload)
- `src/lib/` — вспомогательные модули (passport, prisma, sentry, logger и др.)
- `src/prisma/` — схема и миграции Prisma
- `src/scripts/` — скрипты для работы с БД

#### Скрипты backend

- `pnpm dev` — запуск в режиме разработки
- `pnpm build` — сборка
- `pnpm test` — тесты (Jest)
- `pnpm migrate` — миграции Prisma

---

## Frontend

### Основные возможности frontend

- SPA на React + Vite
- Маршрутизация (React Router)
- Страницы: все посты, просмотр, создание, редактирование, профиль, аутентификация
- Загрузка изображений (Cloudinary)
- Аналитика (Mixpanel), мониторинг (Sentry)
- Глобальные стили на SCSS

#### Структура

- `src/pages/` — страницы приложения
- `src/components/` — переиспользуемые компоненты (кнопки, формы, лайки, загрузка и др.)
- `src/lib/` — контексты, роутинг, интеграции
- `src/styles/` — SCSS-стили

#### Скрипты frontend

- `pnpm dev` — запуск в режиме разработки
- `pnpm build` — сборка
- `pnpm preview` — предпросмотр сборки
- `pnpm test` — тесты (Jest)

---

## Общие команды

- `pnpm install` — установка зависимостей во всех пакетах
- `pnpm lint` — запуск линтера
- `pnpm format` — автоформатирование

---

## Docker

- **docker-compose.yml** — поднимает backend, frontend и БД (например, PostgreSQL)
- **Dockerfile** — сборка образа приложения

---

## Тестирование

- Backend: Jest (`backend/src/utils/*.unit.test.ts`)
- Frontend: Jest (`blogsApp/src/utils/*.unit.test.ts`)
- Интеграционные тесты: `backend/src/test/integration.ts`

