# Project Documentation Rules (Non-Obvious Only)
- README.md is stale: it documents `npm run serve`, which is not a script. Real dev command is `npm run dev` (frontend :8080 + backend :3000).
- The plan in `.gigacode_vsc/plans/` mentions `better-sqlite3`, but the implementation actually uses `sql.js` (WASM) — trust the code, not that plan.
- `src/api/` is NOT the backend API — it contains the fetch wrapper and date helpers; the API server lives in `backend/src/`.
- `src/vueMixins/*.vue` are template-less mixin files, not components — don't register them as routes or components.
- `src/assets/css/*.css` are atomic utility classes (margin/padding/width/flex/...) imported via `global.css` in `src/main.ts`; `src/assets/scss/main.scss` exists but is commented out.
- Root `index.txt`/`text.txt` and `.gigacode_vsc/worktrees/*` are scratch/stale copies — ignore them.
- `.env`'s `VUE_APP_API_URL` is unused; both Vuex stores hardcode `const URL = '/api'`.
