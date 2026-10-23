# Project Architecture Rules (Non-Obvious Only)
- `/api` exists only at the edge: dev proxy (`vue.config.js`) and prod nginx (`nginx/nginx.conf`) both strip it (`pathRewrite: {'^/api': ''}` / `proxy_pass http://backend:3000/`). Backend routes must never be prefixed with `/api`.
- The domain model is triplicated and must stay in sync manually: `CREATE TABLE` in `backend/src/db.ts`, positional row mappings in `backend/src/routes/*.ts`, TS interfaces in `backend/src/types.ts` + `src/types/*.ts`.
- No migration system — schema changes risk corrupting the existing binary `data/tasks.db` (exported via `db.export()`).
- `store/task_settings.ts` holds volatile UI settings persisted nowhere — every toggle resets on reload.
- `fetch_delete()` in `src/api/fetch_api.ts` is dead code; deletion is done via POST endpoints, so the network contract is POST-only for writes.
- `backend/src/db.ts` exposes a module-level singleton DB; tasks and history routers share it and both are mounted at `/` in `backend/src/index.ts`.
