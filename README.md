# TaskMan — планировщик задач с музыкальным уклоном

TaskMan — веб-приложение для планирования задач с музыкальным уклоном. Помимо
классического управления задачами, оно ведёт журнал истории: прослушивания и
работа над композициями фиксируются с длительностью трека, путём к файлу и
статусом.

Интерфейс — на русском языке; фронтенд на Vue 3 + TypeScript, бэкенд на
Express с in-memory SQLite (`sql.js`).

## Возможности

### Задачи

Список задач разбит на секции — расчёт и группировка в
[`TasksComponent.vue`](src/components/TasksComponent.vue):

- **«Важные»** — срочные задачи (`type: "hot"`) с дедлайном (дата и время),
  отсортированные по ближайшему сроку;
- **«Текущие»** — обычные задачи (`type: "normal"`);
- **«Завершённые»** — выполненные задачи; по желанию группируются по дате
  закрытия.

Каждая задача поддерживает:

- название, описание, дедлайн, результат и дату создания;
- переоткрытие завершённой задачи (флаг «Переоткрывать»);
- настройки отображения: показ дат и описаний, направление списков
  (колонка/строка), группировка завершённых по датам — хранилище
  [`task_settings`](src/store/task_settings.ts);
- создание, редактирование и удаление с подтверждением.

Форма задачи и карточка — [`TaskForm.vue`](src/components/TaskForm.vue) и
[`TaskItem.vue`](src/components/TaskItem.vue).

### История — журнал с музыкальным уклоном

Раздел «История» ведёт журнал записей с музыкальной спецификой:

- **Длительность композиции** (`song_length`) — вводится как время
  (например, продолжительность трека или прослушивания); поле формы в
  [`HistoryForm.vue`](src/components/HistoryForm.vue);
- **Путь** — путь к файлу или папке проекта; клик по нему копирует путь в
  буфер обмена ([`HistoryItem.vue`](src/components/HistoryItem.vue));
- **Статусы** — «Создано», «В работе», «Закончено»;
- заголовок, описание и дата записи;
- добавление, редактирование и удаление с подтверждающим диалогом.

Сущности: [`IHistoryItem`](src/types/IHistoryItem.ts) (фронтенд) и
[`backend/src/types.ts`](backend/src/types.ts) (бэкенд).

### Горячие клавиши

Обработчики — [`useAppRouteKeyup`](src/composables/useAppRouteKeyup.ts) и
[`useTasksKeyup`](src/composables/useTasksKeyup.ts):

| Клавиша | Действие |
| --- | --- |
| `H` | Перейти в «Историю» |
| `+` | Перейти к созданию задачи |
| `Esc` | Вернуться на главную / снять редактирование |

## Технологии

**Frontend**

- Vue 3 + TypeScript, Vite;
- Pinia (хранилища в [`src/store`](src/store/index.ts));
- vue-router 4 ([`src/router`](src/router/index.ts));
- SCSS.

**Backend**

- Express 4 + TypeScript ([`backend/src`](backend/src/index.ts));
- `sql.js` (WASM SQLite) — база живёт в памяти и сохраняется в файл
  [`backend/data/tasks.db`](backend/src/db.ts);
- мутации — только POST-эндпоинты ([`routes/tasks.ts`](backend/src/routes/tasks.ts),
  [`routes/history.ts`](backend/src/routes/history.ts)).

**Деплой**

- Docker Compose + nginx ([`docker-compose.yml`](docker-compose.yml),
  [`nginx/nginx.conf`](nginx/nginx.conf)).

## Запуск

### Установка

```bash
npm install              # корень — фронтенд
cd backend && npm install
```

### Разработка (hot reload)

```bash
npm run dev
```

Команда запускает параллельно (через `concurrently`):

- фронтенд: `http://localhost:8080` (Vite; проксирует `/api` → `:3000` со
  снятием префикса, см. [`vite.config.mts`](vite.config.mts));
- бэкенд: `http://localhost:3000` (nodemon + ts-node).

Можно запускать по отдельности:

```bash
npm run dev:backend  # только API (порт 3000)
npm run dev:frontend # только Vite (порт 8080)
```

### Сборка

```bash
npm run build        # сборка фронтенда в dist/
npm run typecheck    # проверка типов vue-tsc без сборки
```

Бэкенд собирается отдельно:

```bash
cd backend && npm run build   # tsc → backend/dist/
cd backend && npm start       # запуск собранного backend
```

### Production

```bash
npm run prod          # сборка фронтенда + docker-compose up --build -d
npm run prod:stop     # docker-compose down
npm run prod:restart  # пересборка и перезапуск
```

### Линт и форматирование

```bash
npm run lint          # oxlint — src, backend, vite.config.mts
npm run lint:fix      # автоисправление
npm run format        # oxfmt
npm run format:check  # CI-проверка форматирования
```

## Структура проекта

```
src/
  api/          # fetch-обёртки, работа с датами
  assets/       # CSS/SCSS, изображения
  components/   # UI-компоненты (задачи, история, формы, диалоги)
  composables/  # обработчики горячих клавиш
  router/       # маршруты: /, /create, /history
  store/        # Pinia-хранилища: tasks, history, task_settings
  types/        # интерфейсы I* (дублируются в backend/src/types.ts)
  views/        # страницы: Tasks.vue, Create.vue, History.vue
backend/
  src/
    db.ts        # инициализация sql.js + save()
    routes/      # API: tasks, history
    types.ts     # бэкенд-типы (синхронизируются с фронтом вручную)
  data/tasks.db  # файл базы данных (создаётся автоматически)
nginx/           # конфиг nginx для продакшена
```

## Особенности бэкенда

- База данных — in-memory `sql.js`; каждое изменение сохраняется вызовом
  `save()` в [`db.ts`](backend/src/db.ts). Без этого изменения теряются при
  перезапуске.
- Все мутации — POST-эндпоинты: `/task/create`, `/task/update`,
  `/task/delete`, `/history/create`, `/history/update`, `/history/delete`.
- Чтение: `GET /`, `GET /get/history`, `GET /health`.
- Фронтенд-типы и бэкенд-типы продублированы вручную и должны
  поддерживаться синхронно.
