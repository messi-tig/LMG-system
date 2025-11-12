## Quick orientation for AI code assistants

This is a small Vue 3 app scaffolded with Vite. Keep changes minimal and consistent with existing patterns.

- Tech stack: Vue 3, Vite, Vue Router (v4), Pinia, PrimeVue, vue-i18n, primeicons.
- Entry: `src/main.js` — libraries are registered here (Pinia, i18n, PrimeVue). i18n messages are defined inline in `main.js` and the app uses legacy mode.
- Router: `src/router/index.js` (history mode). Routes sometimes use inline component objects for small pages.
- Aliases: `@` → `src` (see `vite.config.js`). Prefer imports like `import X from '@/components/...'.`

What to do first
- Use the project's scripts in `package.json`: `npm install`, `npm run dev` (dev server), `npm run build` (production), `npm run preview` (preview build).
- The Vite config enables `@vitejs/plugin-vue` and `vite-plugin-vue-devtools` — expect devtools to be available during `npm run dev`.

Patterns and conventions (concrete examples)
- i18n: messages are stored in `main.js` and initial locale is `om`. To change locale programmatically the app uses legacy API: `this.$i18n.locale = 'en'` (see `App.vue`).
- Global registration: PrimeVue components are registered in `main.js` via `app.component('Button', Button)`. Follow this pattern for small, frequently used UI components.
- Styles: PrimeVue theme and core CSS are imported in `main.js`. Project-level CSS lives under `src/assets` (e.g. `base.css`, `main.css`).
- Small route components: router includes inline components for simple pages (see `/users` and `/settings` in `src/router/index.js`). For larger pages create `src/views/*.vue`.

Guidance for edits by an AI assistant
- Use the existing entry points: add global app wiring in `src/main.js`. Avoid creating alternate app bootstrap files.
- Prefer using the `@` alias for imports. Do not change `vite.config.js` unless fixing a bug — mention rationale in PR body when changing config.
- Keep i18n messages structure consistent if adding languages (add to `messages` object in `main.js` and update tests/README if necessary).
- When adding UI code, prefer PrimeVue components and follow the current theming import (saga-blue). Register new small components globally only when they are reused across many views; otherwise use local registration.

Files and locations to reference
- App bootstrap: `src/main.js`
- Router: `src/router/index.js`
- Main layout: `src/App.vue`
- Components: `src/components/` (icons under `src/components/icons/`)
- Assets / CSS: `src/assets/` (`base.css`, `main.css`)
- Build config: `vite.config.js` and `package.json` scripts

Avoid making these assumptions
- The project currently defines i18n messages inline; do not relocate them into a new loading system without explicit task instructions.
- Do not introduce new global state libraries beyond Pinia unless requested.

If you propose larger structural changes (new i18n file layout, folder re-org, or replacing UI library):
- Include a short migration plan and at least one small automated verification (e.g., a smoke route or a minimal unit test) in the PR.

If anything above is unclear or you want an example PR that implements a small change (add a language, register a component, or add a route), tell me which and I will draft it.
