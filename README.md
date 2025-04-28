Платформа для пользовательских блогов(постов)

Для работы платформы используем тестовые env переменные с файла env.example и для бэка и для фронта и создаем .env кидаем их в этой файл:

Front: 
PORT=8000
HOST_ENV=local
# SOURCE_VERSION=123
# SENTRY_AUTH_TOKEN=test
VITE_TRPC_URL=https://localhost:3000/trpc
VITE_WEBAPP_URL=https://localhost:8000
# VITE_WEBAPP_SENTRY_DSN=test
VITE_CLOUDINARY_CLOUD_NAME=dquf3wlzq

Backend: 
PORT=3000
DATABASE_URL=postgresql://post:post@localhost:5432/post?schema=public
HOST_ENV=local
JWT_SECRET=local-jwt-secret
PASSWORD_SALT=local-password-salt
INITIAL_ADMIN_PASSWORD=1234
WEBAPP_URL=https://localhost:8000
DEBUG=postnick:*,-postnick:prisma:*,-postnick:trpc:query:success
# BACKEND_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
# SOURCE_VERSION=123
SENTRY_AUTH_TOKEN=test
# CLOUDINARY_API_KEY=test
# CLOUDINARY_API_SECRET=test
CLOUDINARY_CLOUD_NAME=dquf3wlzq
NODE_ENV=development

Для запуска проекта необходимо выполнить одновременно следующие команды:

Запуск бэка: 
- Переход в каталог backend: cd backend
- Выполнение команды: pnpm dev

Запуск фронта: 
- Переход в каталог blogsApp: cd blogsApp
- Выполнение команды: pnpm dev 
