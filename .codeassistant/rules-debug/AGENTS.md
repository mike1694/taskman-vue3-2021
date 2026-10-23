# Project Debug Rules (Non-Obvious Only)
- Data "lost" after a backend restart means a write route missed `save()` in `backend/src/db.ts` — `sql.js` keeps the DB in memory, the file `backend/data/tasks.db` is only re-exported on `save()`. In Docker it lives in the `db-data` volume at `/app/data/tasks.db`.
- Failing frontend requests are silent by design: `src/api/fetch_api.ts` returns `{ error: true }` / `[]` instead of throwing; Vuex actions only log via `console.error` in `.catch`.
- Backend logs appear only in the terminal running nodemon; ESLint's `no-console` is off in dev and warn in prod, so switching `NODE_ENV=production` is what activates console warnings during lint.
- Type mismatches surface as wrong values, not errors: booleans round-trip as INTEGER 0/1 (`Boolean(row[n])`), and interfaces (`ITaskItem`, `IHistoryItem`) declare fields as optional that the API may omit.
- Backend routes are mounted at `/` (tasks) and `/get/history` — no `/api` prefix exists server-side; in dev the prefix is stripped by the `vue.config.js` devServer proxy and in prod by `nginx/nginx.conf`. Check both when endpoints 404.
