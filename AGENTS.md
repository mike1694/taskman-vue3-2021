# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Stack
- Frontend: Vue 3 (Options API only, no `<script setup>`), vue-router 4, Vuex 4, Vue CLI 5, TypeScript ~4.9, plain CSS + SCSS.
- Backend (`backend/`): Express 4 + TypeScript, runs via ts-node/nodemon in dev; uses `sql.js` (WASM SQLite), NOT `better-sqlite3` (only its types are in devDeps).

## Commands
- `npm run dev` — starts frontend (:8080) and backend (:3000) together (concurrently). Dev proxy in `vue.config.js` maps `/api` → `http://localhost:3000` and strips the `/api` prefix, so backend routes have NO `/api` prefix.
- `npm run build` builds ONLY the frontend. Backend compiles separately: `cd backend && npm run build` (tsc → `backend/dist/`).
- `npm run prod` = frontend build + `docker-compose up --build` (nginx serves `dist/`, proxies `/api/` → `backend:3000`).
- There is NO test framework (no jest/vitest/mocha, no `tests/` dir — tsconfig references `tests/**` but it doesn't exist). Backend has no linter; `npm run lint` covers frontend `src/` only.

## Critical gotchas
- DB is in-memory `sql.js`. Every write route must call `save()` from `backend/src/db.ts` or changes are lost on restart. DB file: `backend/data/tasks.db`.
- Route handlers in `backend/src/routes/*.ts` map rows by positional index (`row[0]`…`row[11]`) — column order in the `CREATE TABLE` of `backend/src/db.ts` is load-bearing; reordering/inserting a column silently breaks mappings.
- Booleans (`reopen`, `timer`, `closed`) are stored as INTEGER 0/1, converted via `Boolean(row[n])`.
- All mutations are POST endpoints (`/task/delete`, `/history/create`, ...). There are no HTTP DELETE routes; `fetch_delete()` in `src/api/fetch_api.ts` is dead code.
- `src/api/fetch_api.ts` never throws — returns `{ error: true }` or `[]` on failure. Always check for `.error`.
- `.env`'s `VUE_APP_API_URL` is unused: both Vuex stores hardcode `const URL = '/api'`.

## Conventions
- Vuex modules are `namespaced: true` with snake_case actions/mutations/getters (`get_tasks`, `set_all_tasks`); components map them via `mapGetters`/`mapActions` with camelCase aliases.
- Entity interfaces use `I` prefix and default export (`ITaskItem`, `IHistoryItem`); they are duplicated in `backend/src/types.ts` — keep both in sync.
- Mixins are template-less `.vue` files in `src/vueMixins/` (not components).
- ESLint disables `prefer-const` and `vue/multi-word-component-names`; quote style is not enforced (single and double quotes both in use).
- UI strings are in Russian; `getDateNow()` in `src/api/date_now.ts` relies on locale `DD.MM.YYYY` to produce `YYYY-MM-DD`.
