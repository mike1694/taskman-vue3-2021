# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Stack
- Frontend: Vue 3 (components use `<script setup lang="ts">`), vue-router 4, Pinia, Vite, TypeScript (~5.x), plain CSS + SCSS.
- Backend (`backend/`): Express 4 + TypeScript, runs via ts-node/nodemon in dev; uses `sql.js` (WASM SQLite), NOT `better-sqlite3` (only its types are in devDeps).

## Commands
- `npm run dev` — starts frontend (:8080) and backend (:3000) together (concurrently). Dev proxy in `vite.config.mts` maps `/api` → `http://localhost:3000` and strips the `/api` prefix, so backend routes have NO `/api` prefix.
- `npm run build` builds ONLY the frontend. Backend compiles separately: `cd backend && npm run build` (tsc → `backend/dist/`).
- `npm run prod` = frontend build + `docker-compose up --build` (nginx serves `dist/`, proxies `/api/` → `backend:3000`).
- There is NO test framework (no jest/vitest/mocha, no `tests/` dir — tsconfig references `tests/**` but it doesn't exist). Lint and format are handled by oxlint/oxfmt (see Conventions): `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`.

## Critical gotchas
- DB is in-memory `sql.js`. Every write route must call `save()` from `backend/src/db.ts` or changes are lost on restart. DB file: `backend/data/tasks.db`.
- Route handlers in `backend/src/routes/*.ts` map rows by positional index (`row[0]`…`row[11]`) — column order in the `CREATE TABLE` of `backend/src/db.ts` is load-bearing; reordering/inserting a column silently breaks mappings.
- Booleans (`reopen`, `timer`, `closed`) are stored as INTEGER 0/1, converted via `Boolean(row[n])`.
- All mutations are POST endpoints (`/task/delete`, `/history/create`, ...). There are no HTTP DELETE routes; `fetchDelete()` in `src/api/fetchApi.ts` is dead code.
- `src/api/fetchApi.ts` never throws — returns `{ error: true }` or `[]` on failure. Always check for `.error`.
- `.env`'s `VUE_APP_API_URL` is unused: the `tasks` and `history` stores hardcode `const URL = '/api'`.

## Conventions
- Pinia stores in `src/store/` use `defineStore` setup style (composition API: `ref` state + plain functions, returned from setup; no `state`/`actions` options). The `tasks`/`history` stores hardcode `const URL = '/api'`; components access stores via `useXxxStore()` + `storeToRefs`.
- Entity types use `type` aliases without the `I` prefix, PascalCase filenames and named exports (`TaskItem`, `HistoryItem`, `DateOptions`, `TasksObject` in `src/types/`); they are duplicated in `backend/src/types.ts` — keep both in sync.
- No `export default` in TS modules: named `router` in `src/router/index.ts`, named `pinia` in `src/store/index.ts`, named `use...` functions in composables. `.vue` SFCs keep default imports (Vue SFC compilation requires them); the shim in `src/shims-vue.d.ts` keeps `export default`.
- Files in `src/api/` and `src/store/` are camelCase (`dateNow.ts`, `dateTimeFormat.ts`, `fetchApi.ts`, `taskSettings.ts`), and their exported variables are camelCase too (`fetchPost`, `fetchGet`, `fetchDelete`).
- Linting: oxlint (`.oxlintrc.json`) — plugins `eslint`, `typescript`, `unicorn`, `oxc`, `vue`; categories `correctness: "error"`, `suspicious: "warn"`. Disabled rules: `no-console`, `no-debugger`, `prefer-const`, `oxc/no-async-endpoint-handlers` (Express 4 handlers rely on internal try/catch). Inline suppressions: `// oxlint-disable-next-line <rule>` (legacy `eslint-disable` comments also work).
- Formatting: oxfmt (`.oxfmtrc.json`) — single quotes, semicolons, trailing commas, `printWidth: 70` (max line length; oxlint has no `max-len` rule, so line width is enforced via `npm run format:check`, not by `npm run lint`); import sorting and package.json sorting are disabled. Check with `npm run format:check`.
- UI strings are in Russian; `getDateNow()` in `src/api/dateNow.ts` relies on locale `DD.MM.YYYY` to produce `YYYY-MM-DD`.
- Vue templates: attributes follow the Vue Style Guide element attribute order — `v-for` → `v-if`/`v-else-if`/`v-else`/`v-show` → `id` → `ref`/`key` → `v-model` → dynamic `:prop` → static attrs (`class`, `title`, ...) → `@event`/`v-on` → `v-html`/`v-text`; static attrs keep their source order. This is a manual convention: oxlint does not implement `vue/attributes-order` and oxfmt does not sort attributes.
- Vue templates reference props explicitly with the `props.` prefix (`props.className`, `props.item.id`); `defineProps` is always assigned to `const props` (including `withDefaults(defineProps<...>(), { ... })`). Loop variables from `v-for` are not rewritten.
- BEM styles (bem-audit in `plans/bem-audit.md` is the reference): naming is `block`, `block__element`, `block--modifier`, `block__element--modifier`. Selectors by tag, `id`, and attribute are forbidden for styling (only reset/base in `src/assets/css/global.css` and framework classes like `router-link-exact-active`, `.fade-*` are allowed). No nesting outside a block (`&__element` nesting inside a block and modifiers are the only allowed nesting). Styling a component via classes provided by a parent (cross-component selectors) is forbidden — express state with the component's own BEM modifiers (e.g. `task-item--closed` from `props.item.closed`, `task-list--hot` passed via prop `className`). Global blocks: `.btn` (`src/assets/css/btn.css`), `.field` (`src/assets/css/field.css`), `.transition-*`. Utilities (`src/assets/css/*.css`: `mb2`, `p5`, `flex-*`, `text-left`, `w100`, labels) form a separate non-BEM layer: keep them out of new components or encapsulate them into component BEM blocks instead.
