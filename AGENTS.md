<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

pnpm only. Pin dependencies exactly (no `^`): pnpm 11 ignores `save-exact` in `.npmrc`, so strip it after `pnpm add` or use `pnpm add -E`.

```bash
pnpm dev            # dev server on :3000
pnpm build          # production build (Turbopack, type-checks)
pnpm lint           # ESLint (eslint-config-next + eslint-config-prettier)
pnpm lint:fix       # ESLint --fix, then prettier --write .
pnpm lint:css       # Stylelint on **/*.scss
pnpm lint:css:fix
```

- There are no tests, CI or git hooks.
- `next build` fails on type errors but does **not** lint (`next lint` was removed in Next 16). Run `pnpm lint` and `pnpm lint:css` manually.
- Type-check only: `npx next typegen && npx tsc --noEmit` (`typegen` generates route types such as `PageProps`/`LayoutProps`).

## Architecture

- `@/*` resolves to the **repo root** (no `src/`).
- Routes (`app/`, no i18n): `/` (one-page home built from `components/sections/*`), `/projects/[slug]` (static, `generateStaticParams`, `dynamicParams = false`).
- Content lives in JSON and is read **only** through `lib/content.ts` getters:
    - `content/cv.json` (typed by `types/cv.ts`) → profile, experience, education, skills… `getProfile()` deliberately omits phone, address and birth date.
    - `content/projects.json` (typed by `types/project.ts`) → projects. `placeholder: true` marks example entries; `cover` is optional (a gradient from `accent` is generated otherwise).
- Server components by default; only motion wrappers are `'use client'`.

## Motion

- GSAP (+ ScrollTrigger, SplitText, `@gsap/react`) and Lenis. Always import from `@/lib/motion/gsap` (registers plugins once, exports `EASE`, `DURATION`, `MOTION_QUERY`).
- `components/motion/smooth-scroll.tsx`: root Lenis driven by `gsap.ticker`, `anchors: true` (plain `<a href="#id">` scrolls smoothly).
- `components/motion/route-scroll.tsx`: Lenis keeps its own scroll state, which Next and the browser don't reset on navigation. It scrolls to the top on new routes and restores the saved position on back/forward. `stopInertiaOnNavigate` cuts in-flight inertia on link clicks.
- Reusable wrappers: `Reveal` (fade/translate on enter, optional `stagger`), `SplitHeading` (masked line/word reveal), `Magnetic`.
- Animated elements get `data-reveal` → `opacity: 0` in CSS before hydration (no flash); the wrapper sets it visible. A `<noscript>` style in the layout undoes it.
- Every animation uses `gsap.matchMedia()` with a reduced-motion branch where content is fully visible. Animate only `transform`/`opacity`.
- Route transitions: React `<ViewTransition name share="morph" default="none">` on project cover/title in both the card and the detail page. CSS in `styles/_base.scss`.

## SCSS

- `styles/_tokens.scss`: all design tokens as CSS custom properties (`--color-*`, `--font-*`, `--text-*` fluid scale, `--space-*`, `--radius-*`, `--ease-*`, `--duration-*`, `--z-*`). Use tokens, never hardcode values.
- `styles/abstracts/` (breakpoints `mq('sm'|'md'|'lg'|'xl')`, `container`, `hover`, `reduced-motion`, `visually-hidden`, `label`) is auto-injected in every `.scss` via `sassOptions.additionalData` in `next.config.ts` — no `@use` needed.
- `app/globals.scss` only `@use`s tokens, reset and base. Fonts come from `app/fonts.ts` (`next/font`).
- Shared section wrapper: `components/ui/section.module.scss` + `SectionHeader`.
- Stylelint (`.stylelintrc.mjs`) enforces:
    - BEM class names in kebab-case: `.card`, `.card__title`, `.card--active` (not `.cardHeader` or `.card_title`). Access hyphenated classes as `styles['contact-item']`.
    - Alphabetical property order; `@extend` before `@include`, both before declarations.
    - No `!important`.
- Run `pnpm lint:css:fix` before finishing; most of these are auto-fixable.

## Conventions

- Prettier: 4 spaces, single quotes, `printWidth` 120, `trailingComma: es5`, LF. `*.md` is in `.prettierignore`.
- Code comments: English, minimal and short. Define what something is (`// Small mono label: dates, section indices`), never narrate what the code does; skip them when the name already says it. Use `//` in SCSS (not `/* */`).
- UI text is in Spanish (`<html lang="es">`).
