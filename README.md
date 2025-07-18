# SMS Inventory Application 📦✨

[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white&style=for-the-badge)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white&style=for-the-badge)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)](https://www.docker.com/)

> ⚡ **Проект можно развернуть и проверить все функции в браузере за 3–5 минут: подробная инструкция ниже!**

## Описание

Приложение для учета товаров, разработано в рамках тестового задания на позицию Middle Web Developer для компании «СМАРТ МИЛ СЕРВИС».\
Стек: **Monorepo (backend: NestJS, frontend: React+Vite, база: PostgreSQL, контейнеризация: Docker Compose + Nginx).**

### Основные возможности

- Управление товарами: добавление, просмотр, редактирование, удаление.
- Постраничная навигация (до 50 товаров на странице).
- Минималистичный дизайн на Tailwind CSS.
- Поиск по названию или артикулу.
- Клиентская валидация с подсветкой ошибок.
- Интерактивные уведомления (toast), кастомное подтверждение удаления, индикаторы загрузки.

---

### Дополнительные улучшения

- **User Experience (UX):** кастомные всплывающие сообщения, автосмещение фокуса на первое ошибочное поле, гибкий ввод цены, “умный” поиск с debounce.
- **Чистая архитектура:** модульные компоненты, централизованные экспорты, разделение бизнес-логики и UI.
- **Быстрый запуск:** вся инфраструктура запускается одной командой через Docker Compose, фронтенд работает через Nginx-прокси (решение CORS), полностью рабочий Swagger.

---

### 🚀 Быстрый старт

#### 1. Клонируйте репозиторий

```bash
git clone https://github.com/Stanislavstranger/sms-inventory-app.git
cd sms-inventory-app
```

#### 2. Создайте файл `.env` в корне проекта:

```
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=sms_inventory
DB_PORT=5432
```

#### 3. Установите зависимости и запустите проект:

```bash
npm install
docker compose up --build -d
```

- **Frontend:** [http://localhost:5174](http://localhost:5174)
- **Swagger (API docs):** [http://localhost:3000/api](http://localhost:3000/api)

---

### 🛠️ Технологии

- **Backend:** Node.js (NestJS), TypeORM, PostgreSQL
- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **DevOps:** Docker, Docker Compose, Nginx

---

### API Endpoints

- `GET /api/products` – список товаров с пагинацией и поиском
- `POST /api/products` – создать товар
- `PUT /api/products/:id` – обновить товар
- `DELETE /api/products/:id` – удалить товар

**Swagger**: [http://localhost:3000/api](http://localhost:3000/api)

---

### Полезные команды

```bash
npm run docker:up      # Запустить все сервисы (Postgres, backend, frontend)
npm run docker:down    # Остановить и удалить контейнеры и сеть (данные БД будут удалены)
npm run docker:clean   # Полная очистка окружения и volume БД
docker compose ps      # Проверить статус контейнеров
docker compose logs -f # Смотреть логи сервисов
```

## 📬 Contact

- [Telegram](https://t.me/Stanislav_GV)

> Если нужны детали по архитектуре, принципам валидации, структуре компонентов — расскажу при интервью или в личном общении!
