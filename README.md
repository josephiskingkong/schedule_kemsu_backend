# Schedule KEMSU Backend

Серверная часть системы учёта посещаемости учебных занятий КемГУ.

**Стек:** Node.js · TypeScript · Express 5 · PostgreSQL 15 · Sequelize · Swagger · Docker

## Docker-образ

```
ghcr.io/josephiskingkong/schedule_kemsu_backend:latest
```

Образ автоматически собирается и публикуется в GitHub Container Registry при каждом пуше в `main`.

---

## Развёртывание

### Быстрый старт (Docker Compose)

Единственное требование — установленный [Docker](https://docs.docker.com/get-docker/).

**1. Клонировать репозиторий:**

```bash
git clone https://github.com/josephiskingkong/schedule_kemsu_backend.git
cd schedule_kemsu_backend
```

**2. Запустить:**

```bash
docker compose up -d
```

Эта команда:
- Поднимет PostgreSQL 15
- Выполнит миграции и заполнит БД тестовыми данными
- Запустит API-сервер

**3. Проверить:**

```bash
curl http://localhost:3000/health
# {"status":"ok"}
```

**4. Остановить:**

```bash
docker compose down
```

Для полной очистки с удалением данных БД:

```bash
docker compose down -v
```

---

### Доступные сервисы

| Сервис | URL |
|--------|-----|
| API | http://localhost:3000/api |
| Swagger UI | http://localhost:3000/api-docs |
| Health check | http://localhost:3000/health |

### Тестовые учётные записи

| Логин | Пароль |
|-------|--------|
| `petrov@kemsu.ru` | `password123` |
| `gaidai@kemsu.ru` | `password123` |

---

### Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|-------------|----------|
| `PORT` | `3000` | Порт сервера |
| `DB_HOST` | `localhost` | Хост PostgreSQL |
| `DB_PORT` | `5432` | Порт PostgreSQL |
| `DB_NAME` | `schedule_kemsu` | Имя базы данных |
| `DB_USER` | `postgres` | Пользователь БД |
| `DB_PASSWORD` | `postgres` | Пароль БД |
| `JWT_SECRET` | — | Секрет для JWT-токенов |
| `JWT_EXPIRES_IN` | `24h` | Время жизни токена |

---

### Локальная разработка (без Docker)

**Требования:** Node.js ≥ 18, PostgreSQL ≥ 14

```bash
# Установить зависимости
npm install

# Создать .env
cp .env.example .env   # или создать вручную (см. переменные выше)

# Создать БД
psql -U postgres -c "CREATE DATABASE schedule_kemsu"

# Миграции + тестовые данные
npm run db:migrate
npm run db:seed

# Запуск
npm run dev
```

---

## API

Полная документация доступна в Swagger UI: http://localhost:3000/api-docs

### Эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| `POST` | `/api/auth/login` | Авторизация |
| `GET` | `/api/auth/profile` | Профиль преподавателя |
| `GET` | `/api/groups` | Список групп |
| `GET` | `/api/groups/:id` | Группа по ID |
| `POST` | `/api/groups` | Создать группу |
| `PUT` | `/api/groups/:id` | Обновить группу |
| `DELETE` | `/api/groups/:id` | Удалить группу |
| `GET` | `/api/students/group/:groupId` | Студенты группы |
| `POST` | `/api/students` | Добавить студента |
| `PUT` | `/api/students/:id` | Обновить студента |
| `DELETE` | `/api/students/:id` | Удалить студента |
| `GET` | `/api/lessons` | Занятия преподавателя |
| `GET` | `/api/lessons/:id` | Занятие с посещаемостью |
| `POST` | `/api/lessons` | Создать занятие |
| `DELETE` | `/api/lessons/:id` | Удалить занятие |
| `PUT` | `/api/attendance/:id` | Изменить статус |
| `GET` | `/api/attendance/statuses` | Справочник статусов |
