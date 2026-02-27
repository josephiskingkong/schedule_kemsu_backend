# Система учёта посещаемости учебных занятий — Backend API

## Отчёт по практике

**Задание:** Разработка и стабилизация backend-API для SPA-интерфейса преподавателя

**Стек:** Node.js · TypeScript · Express 5 · PostgreSQL 15 · Sequelize · Swagger · Docker

---

## 1. Введение и контекст

### 1.1. Описание проекта

Система учёта посещаемости учебных занятий КемГУ. Позволяет преподавателям:
- Вести учебные группы со студентами (с разделением на подгруппы)
- Создавать занятия с привязкой к группе, дате/времени и предмету
- Отмечать посещаемость студентов на каждом занятии
- Редактировать статусы посещаемости (присутствует / отсутствует / опоздал / уважительная причина)

Контекст проекта: [Google Drive](https://drive.google.com/drive/folders/11MIKH1wvMyDM-l7_gdCS7HmrtCjFannP?usp=sharing)

### 1.2. Цель практики

Привести в рабочее состояние и доработать серверную часть (backend API), подготовить стабильную основу для SPA-интерфейса преподавателей.

### 1.3. Источники данных и наследие

- **Backend:** Исходный код API (AttendanceApi) — прототип с 17 таблицами
- **Схема БД:**
  - [Часть 1 — справочники](https://drawsql.app/teams/personal-3372/diagrams/attendance-pt1) (факультеты, направления)
  - [Часть 2 — основные таблицы](https://drawsql.app/teams/personal-3372/diagrams/attendance-pt2)
- **Дизайн:** макеты Android, макеты дашборда

---

## 2. Анализ исходного состояния и выявленные проблемы

### 2.1. Исходный Backend (AttendanceApi)

Прототип содержал **17 таблиц** со сложной иерархией:

```
faculty → department → lecturer
specialty → track → base_group → work_group
student → group_enrollment → work_group + academic_year
discipline → discipline_plan → activity_type + lecturer + work_group
classroom → attendance_session → discipline_plan
attendance_status → attendance → student + attendance_session
```

**Выявленные проблемы:**
- Избыточная сложность схемы для MVP (17 таблиц, множество промежуточных связей)
- Нестабильность методов, необработанные исключения
- Отсутствие единого формата ответов API
- Нет документации (Swagger/OpenAPI)
- Неконсистентные дампы БД

### 2.2. Исходная схема БД

| Таблица | Назначение |
|---------|-----------|
| `faculty` | Факультеты |
| `department` | Кафедры |
| `lecturer` | Преподаватели (с ролями и привязкой к кафедре) |
| `specialty` | Направления подготовки |
| `track` | Профили |
| `base_group` | Базовые группы |
| `work_group` | Рабочие группы |
| `student` | Студенты |
| `academic_year` | Учебные годы |
| `group_enrollment` | Зачисления в группы |
| `discipline` | Дисциплины |
| `activity_type` | Типы занятий |
| `discipline_plan` | Учебные планы |
| `classroom` | Аудитории |
| `attendance_session` | Занятия (сессии) |
| `attendance_status` | Статусы посещаемости |
| `attendance` | Посещаемость |

---

## 3. Принятые решения и проделанная работа

### 3.1. Задача 1 — Анализ и восстановление

- ✅ Изучена исходная схема БД (17 таблиц, 2 раздельные диаграммы)
- ✅ Проанализирован код прототипа API, составлен список эндпоинтов
- ✅ Развёрнуто локальное окружение (PostgreSQL 15, Node.js 23)
- ✅ Проведено тестирование — выявлена нестабильность и избыточность

### 3.2. Задача 2 — Проектирование и стабилизация API

#### Ключевое решение: упрощение схемы БД

Исходные 17 таблиц сокращены до **5 таблиц** без потери функциональности для MVP:

```
lecturer ──┐
           ├──→ lesson ──→ attendance
group ─────┤                    ↑
           └──→ student ────────┘
```

#### Новая схема БД (ER-диаграмма)

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   lecturer   │       │      lesson      │       │  attendance  │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)          │──┐    │ id (PK)      │
│ first_name   │  │    │ group_id (FK)    │  │    │ lesson_id(FK)│
│ last_name    │  └───→│ subject_name     │  └───→│ student_id(FK│
│ middle_name  │       │ date_time        │       │ status (ENUM)│
│ login        │       │ subgroup         │       │ created_at   │
│ password     │       │ academic_hours   │       │ updated_at   │
└──────────────┘       │ lecturer_id (FK) │       └──────────────┘
                       │ created_at       │              ↑
┌──────────────┐       │ updated_at       │              │
│student_group │       └──────────────────┘              │
├──────────────┤                                         │
│ id (PK)      │──┐    ┌──────────────────┐              │
│ name (UNIQUE)│  │    │     student      │              │
│ created_at   │  │    ├──────────────────┤              │
│ updated_at   │  │    │ id (PK)          │──────────────┘
└──────────────┘  └───→│ first_name       │
                       │ last_name        │
                       │ middle_name      │
                       │ photo            │
                       │ group_id (FK)    │
                       │ subgroup (1-3)   │
                       │ created_at       │
                       │ updated_at       │
                       └──────────────────┘
```

**Статусы посещаемости (ENUM):**

| Значение | Описание |
|----------|----------|
| `present` | Присутствует |
| `absent` | Отсутствует |
| `late` | Опоздал |
| `excused` | Уважительная причина |

#### Обоснование упрощения

| Что было (17 таблиц) | Что стало (5 таблиц) | Почему |
|---|---|---|
| `faculty`, `department` | Убраны | Для MVP преподавателю не нужна орг. структура |
| `specialty`, `track`, `base_group`, `work_group` | `student_group` | Одна таблица с названием группы (напр. «ПИ-221») |
| `academic_year`, `group_enrollment` | Убраны | Студенты привязаны к группе напрямую |
| `discipline`, `activity_type`, `discipline_plan` | Поле `subject_name` в `lesson` | Название предмета хранится в занятии |
| `classroom` | Убрана | Не критична для учёта посещаемости |
| `attendance_session` | `lesson` | Занятие с датой/временем, группой и предметом |
| `attendance_status` | ENUM в `attendance` | 4 фиксированных статуса вместо отдельной таблицы |

#### Реализованные эндпоинты API

Все ответы приведены к единому формату: `{ success: boolean, data?: T, message?: string }`

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `POST` | `/api/auth/login` | Авторизация, получение JWT-токена |
| `GET` | `/api/auth/profile` | Профиль текущего преподавателя |
| `GET` | `/api/groups` | Все группы со списком студентов |
| `GET` | `/api/groups/:id` | Группа по ID со студентами |
| `POST` | `/api/groups` | Создание группы (опц. с массивом студентов) |
| `PUT` | `/api/groups/:id` | Обновление названия группы |
| `DELETE` | `/api/groups/:id` | Удаление группы (каскадно) |
| `GET` | `/api/students/group/:groupId` | Студенты группы (фильтр `?subgroup=`) |
| `POST` | `/api/students` | Добавление студента в группу |
| `PUT` | `/api/students/:id` | Редактирование данных студента |
| `DELETE` | `/api/students/:id` | Удаление студента |
| `GET` | `/api/lessons` | Занятия текущего преподавателя |
| `GET` | `/api/lessons/:id` | Занятие с данными посещаемости |
| `POST` | `/api/lessons` | Создание занятия (авто-генерация посещаемости) |
| `DELETE` | `/api/lessons/:id` | Удаление занятия |
| `PUT` | `/api/attendance/:id` | Изменение статуса посещаемости |
| `GET` | `/api/attendance/statuses` | Справочник статусов посещаемости |

**Итого: 17 эндпоинтов** (2 авторизация + 5 группы + 4 студенты + 4 занятия + 2 посещаемость)

#### Ключевая логика: автоматическое создание записей посещаемости

При создании занятия (`POST /api/lessons`) система:
1. Создаёт запись занятия с привязкой к группе, предмету, дате/времени
2. Находит всех студентов группы (или подгруппы, если указана)
3. Автоматически создаёт записи посещаемости со статусом `present` для каждого студента
4. Возвращает занятие с полным списком посещаемости

Это реализует сценарий: *«Преподаватель создаёт занятие → все студенты по умолчанию присутствуют → преподаватель отмечает отсутствующих/опоздавших»*

#### Валидация

- Подгруппа: допустимые значения 1, 2, 3 (или null — вся группа)
- Уникальность имени группы (HTTP 409 при дублировании)
- Обязательные поля: группа + предмет + дата/время при создании занятия
- Статус посещаемости: только из ENUM (`present`, `absent`, `late`, `excused`)
- JWT-авторизация на всех защищённых маршрутах

### 3.3. Работа с БД — миграции

Создана миграция `20260226000001-restructure-tables.js`, которая:
1. Удаляет все 17 старых таблиц (с каскадным удалением)
2. Удаляет устаревшие ENUM-типы
3. Создаёт 5 новых таблиц с внешними ключами и каскадным удалением
4. Обеспечивает откат (`down`) для полного реверса

### 3.4. Документирование — Swagger/OpenAPI

Реализована полная спецификация OpenAPI 3.0 с описанием:
- Всех 17 эндпоинтов
- 15 схем данных (DTO для запросов и ответов)
- JWT-авторизации (Bearer token)
- Кодов ошибок и описаний

Swagger UI доступен по адресу: `http://localhost:3000/api-docs`

JSON-спецификация: `http://localhost:3000/api-docs.json`

### 3.5. Docker

Настроена контейнеризация с `docker-compose.yml`:
- **db** — PostgreSQL 15 Alpine c healthcheck
- **migrate** — одноразовый контейнер: миграции + сиды
- **app** — Node.js приложение (multi-stage build, порт 3000)

---

## 4. Структура проекта

```
schedule_kemsu_back/
├── docker-compose.yml          # Оркестрация контейнеров
├── Dockerfile                  # Multi-stage сборка
├── package.json                # Зависимости и скрипты
├── tsconfig.json               # Конфигурация TypeScript
└── src/
    ├── app.ts                  # Express-приложение, middleware, Swagger UI
    ├── server.ts               # Точка входа, подключение к БД
    ├── db.ts                   # Sequelize-инстанс, регистрация моделей
    ├── swagger.ts              # OpenAPI 3.0 спецификация (15 схем)
    ├── config/
    │   ├── index.ts            # Конфигурация из .env
    │   └── database.js         # Конфигурация для sequelize-cli
    ├── controllers/
    │   ├── authController.ts       # login, getProfile
    │   ├── groupController.ts      # CRUD групп
    │   ├── studentController.ts    # CRUD студентов
    │   ├── lessonController.ts     # CRUD занятий + авто-посещаемость
    │   └── attendanceController.ts # Обновление статуса, справочник
    ├── middleware/
    │   ├── auth.ts             # JWT-авторизация
    │   └── errorHandler.ts     # Централизованная обработка ошибок
    ├── migrations/
    │   └── 20260226000001-restructure-tables.js
    ├── models/
    │   ├── Lecturer.ts         # Преподаватель
    │   ├── Group.ts            # Учебная группа
    │   ├── Student.ts          # Студент (фото, подгруппа)
    │   ├── Lesson.ts           # Занятие (предмет, дата, подгруппа)
    │   ├── Attendance.ts       # Посещаемость (статус ENUM)
    │   └── index.ts            # Экспорт моделей
    ├── routes/
    │   ├── auth.ts             # POST /login, GET /profile
    │   ├── groups.ts           # CRUD /groups
    │   ├── students.ts         # CRUD /students
    │   ├── lessons.ts          # CRUD /lessons
    │   ├── attendance.ts       # PUT /:id, GET /statuses
    │   └── index.ts            # Корневой роутер
    ├── seeders/
    │   └── 20260226000001-demo-data.js
    ├── types/
    │   └── index.ts            # AuthRequest, JwtPayload
    └── utils/
        └── AppError.ts         # Кастомный класс ошибки
```

---

## 5. Технический стек

| Компонент | Технология | Версия |
|-----------|-----------|--------|
| Runtime | Node.js | 23.8.0 |
| Язык | TypeScript | 5.9.3 |
| Web-фреймворк | Express | 5.2.1 |
| ORM | Sequelize + sequelize-typescript | 6.37.7 / 2.1.6 |
| СУБД | PostgreSQL | 15 |
| Аутентификация | JWT (jsonwebtoken + bcryptjs) | 9.0.3 / 3.0.3 |
| Документация | swagger-jsdoc + swagger-ui-express | 6.2.8 / 5.0.1 |
| Контейнеризация | Docker + Docker Compose | — |
| VCS | Git + GitHub | — |

---

## 6. Инструкция по локальному развёртыванию

### Вариант 1 — Docker (рекомендуется)

```bash
git clone https://github.com/josephiskingkong/schedule_kemsu_backend.git
cd schedule_kemsu_backend
docker compose up --build
```

Сервис будет доступен:
- API: `http://localhost:3000/api`
- Swagger UI: `http://localhost:3000/api-docs`
- Health check: `http://localhost:3000/health`

### Вариант 2 — Локально

**Требования:** Node.js ≥ 18, PostgreSQL ≥ 14

1. Клонировать репозиторий:
```bash
git clone https://github.com/josephiskingkong/schedule_kemsu_backend.git
cd schedule_kemsu_backend
```

2. Установить зависимости:
```bash
npm install
```

3. Создать файл `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=schedule_kemsu
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=kemsu_attendance_secret_key_2026
JWT_EXPIRES_IN=24h
```

4. Создать базу данных:
```bash
psql -U postgres -c "CREATE DATABASE schedule_kemsu"
```

5. Выполнить миграции и заполнить тестовыми данными:
```bash
npm run db:migrate
npm run db:seed
```

6. Запустить сервер:
```bash
npm run dev
```

### Тестовые учётные записи

| Логин | Пароль | ФИО |
|-------|--------|-----|
| `petrov@kemsu.ru` | `password123` | Петров Иван Сергеевич |
| `gaidai@kemsu.ru` | `password123` | Гайдай Алексей Викторович |

### Тестовые данные

- **2 группы:** ПИ-221 (6 студентов, подгруппы 1-3), ПИ-222 (2 студента)
- **3 занятия:** Программирование на Python, Базы данных, Математический анализ
- **10 записей посещаемости** с разными статусами

---

## 7. Примеры запросов к API

### Авторизация
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login": "petrov@kemsu.ru", "password": "password123"}'
```

Ответ:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": 1,
      "first_name": "Иван",
      "last_name": "Петров",
      "middle_name": "Сергеевич",
      "login": "petrov@kemsu.ru"
    }
  }
}
```

### Создание занятия (с автоматической посещаемостью)
```bash
curl -X POST http://localhost:3000/api/lessons \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": 1,
    "subject_name": "Программирование на Python",
    "date_time": "2026-03-02T09:00:00Z",
    "subgroup": 1,
    "academic_hours": 2
  }'
```

Ответ — занятие с автоматически созданной посещаемостью для подгруппы 1:
```json
{
  "success": true,
  "data": {
    "id": 4,
    "group_id": 1,
    "subject_name": "Программирование на Python",
    "date_time": "2026-03-02T09:00:00.000Z",
    "subgroup": 1,
    "academic_hours": 2,
    "lecturer_id": 1,
    "group": { "id": 1, "name": "ПИ-221" },
    "attendances": [
      {
        "id": 11,
        "student_id": 1,
        "status": "present",
        "student": { "first_name": "Дмитрий", "last_name": "Смирнов", "subgroup": 1 }
      },
      {
        "id": 12,
        "student_id": 2,
        "status": "present",
        "student": { "first_name": "Анна", "last_name": "Козлова", "subgroup": 1 }
      }
    ]
  }
}
```

### Изменение статуса посещаемости
```bash
curl -X PUT http://localhost:3000/api/attendance/11 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "absent"}'
```

---

## 8. Результаты тестирования

Все 17 эндпоинтов протестированы вручную (curl):

| # | Эндпоинт | Метод | Статус |
|---|----------|-------|--------|
| 1 | `/api/auth/login` | POST | ✅ |
| 2 | `/api/auth/profile` | GET | ✅ |
| 3 | `/api/groups` | GET | ✅ |
| 4 | `/api/groups/:id` | GET | ✅ |
| 5 | `/api/groups` | POST | ✅ |
| 6 | `/api/groups/:id` | PUT | ✅ |
| 7 | `/api/groups/:id` | DELETE | ✅ |
| 8 | `/api/students/group/:groupId` | GET | ✅ |
| 9 | `/api/students/group/:groupId?subgroup=` | GET | ✅ |
| 10 | `/api/students` | POST | ✅ |
| 11 | `/api/students/:id` | PUT | ✅ |
| 12 | `/api/students/:id` | DELETE | ✅ |
| 13 | `/api/lessons` | GET | ✅ |
| 14 | `/api/lessons/:id` | GET | ✅ |
| 15 | `/api/lessons` | POST | ✅ |
| 16 | `/api/lessons/:id` | DELETE | ✅ |
| 17 | `/api/attendance/:id` | PUT | ✅ |
| 18 | `/api/attendance/statuses` | GET | ✅ |

Дополнительно проверено:
- ✅ Валидация обязательных полей (400)
- ✅ Уникальность имени группы (409)
- ✅ Несуществующие ресурсы (404)
- ✅ Авторизация — запросы без токена (401)
- ✅ Каскадное удаление (группа → студенты → посещаемость)
- ✅ TypeScript компиляция без ошибок (`tsc --noEmit`)
- ✅ Docker Compose — запуск всего стека
- ✅ Swagger UI — отображение документации

---

## 9. Соответствие критериям успешного выполнения

### Backend

| Критерий | Статус |
|----------|--------|
| API стабильно работает, не выбрасывает необработанных исключений | ✅ Централизованная обработка ошибок через `errorHandler` + `AppError` |
| Существует актуальная документация Swagger/OpenAPI | ✅ 15 схем, все эндпоинты задокументированы |
| Реализованы все методы, необходимые для MVP SPA | ✅ 17 эндпоинтов покрывают все сценарии |

### Покрытие User Stories

| Сценарий | Реализация на backend |
|----------|----------------------|
| «Преподаватель хочу зайти» | `POST /api/auth/login` — JWT-авторизация |
| «Посмотреть свои группы» | `GET /api/groups` — список групп со студентами |
| «Создать занятие и отметить посещаемость» | `POST /api/lessons` — авто-генерация с `present` |
| «Изменить статус студента» | `PUT /api/attendance/:id` — смена статуса |
| «Посмотреть прошлые занятия» | `GET /api/lessons` — список с сортировкой по дате |
| «Добавить/удалить студента» | `POST/DELETE /api/students` |

---

## 10. Репозиторий

**GitHub:** [github.com/josephiskingkong/schedule_kemsu_backend](https://github.com/josephiskingkong/schedule_kemsu_backend)

| Коммит | Описание |
|--------|----------|
| `02bd7c1` | `refactor: restructure to simplified model (groups, students, lessons, attendance)` — полная реструктуризация |
| `d26562b` | `feat: add date_time field to lessons` — добавление даты/времени занятия |
