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
    - `content/cv.json` (typed by `types/cv.ts`) → profile, experience, education, skills… `getProfile()` only exposes city and country from `address`. The repo is public: never add private data (phone, birth date, street address). A certification may carry an optional `credentialUrl` (shown as "Ver credencial" next to `credentialId` when expanded).
    - `content/projects.json` (typed by `types/project.ts`) → projects. `placeholder: true` marks example entries; `cover` is optional (a gradient from `accent` is generated otherwise).
- Server components by default; only motion wrappers and `components/ui/expandable.tsx` are `'use client'`.

## Motion

- GSAP (+ ScrollTrigger, SplitText, `@gsap/react`) and Lenis. Always import from `@/lib/motion/gsap` (registers plugins once, exports `EASE`, `DURATION`, `MOTION_QUERY`).
- `components/motion/smooth-scroll.tsx`: root Lenis driven by `gsap.ticker`, `anchors: true` (plain `<a href="#id">` scrolls smoothly).
- `components/motion/route-scroll.tsx`: Lenis keeps its own scroll state, which Next and the browser don't reset on navigation. It scrolls to the top on new routes and restores the saved position on back/forward. `stopInertiaOnNavigate` cuts in-flight inertia on link clicks.
- `components/motion/background-field.tsx` + `lib/motion/contour-field.ts`: fixed WebGL2 canvas (`z-index: -1`, `pointer-events: none`) with faint contour lines. They drift with scroll, react to mouse hover and to taps on empty areas, and the glow takes the `data-accent` of the project in view or under the cursor. Static under reduced motion; no-op without WebGL2. `body` has no background so the canvas shows through (`html` paints it). Remove `<BackgroundField />` from `app/layout.tsx` to disable it.
- `components/ui/expandable.tsx` (`ExpandableGroup` + `ExpandableItem`): rows with details revealed on mouse hover, tap or Enter/Space, one open per group. Used in the education section; an item without `details` renders as a plain row.
- Reusable wrappers: `Reveal` (fade/translate on enter, optional `stagger`), `SplitHeading` (masked line/word reveal), `Magnetic`.
- Animated elements get `data-reveal` → `opacity: 0` in CSS before hydration (no flash), only under `html.js` and `prefers-reduced-motion: no-preference`; the wrapper sets it visible. An inline script in the layout sets `js` on `<html>` before first paint and drops it after 5s, so without scripts (or with a bundle that never loads) the content stays visible. Once GSAP has run, the inline `opacity` it sets is what counts, not the class.
- Every animation uses `gsap.matchMedia()` with a reduced-motion branch where content is fully visible. Animate only `transform`/`opacity`.
- Route transitions: React `<ViewTransition name share="morph" default="none">` on project cover/title in both the card and the detail page. CSS in `styles/_base.scss`.

## Accessibility (WCAG 2.2 AA)

- Never hide content before it is revealed with `visibility`/`autoAlpha`/`display`: it would leave the Tab order and the a11y tree. `Reveal` animates `opacity` + `y` only, and a `focusin` listener finishes the reveal so a focused element is never left invisible.
- External links use `components/ui/external-link.tsx` (target/rel, decorative arrow, visually hidden "se abre en una pestaña nueva"), never a bare `target="_blank"`.
- `components/layout/skip-link.tsx` targets `<main id="contenido" tabIndex={-1}>`. `components/layout/anchor-focus.tsx` focuses the target of in-page `#hash` links (and `/#id` after a route change), because Lenis scrolls but leaves focus behind. Sections get `tabindex="-1"` on demand; their ring is suppressed in `anchor-focus.scss`.
- Header: it hides on scroll down but `.header:has(:focus-visible)` keeps it on screen. While the menu is open `main`, `footer` and anything marked `data-back-to-top`/`data-skip-link` are `inert` (add new fixed or floating UI to that list), Tab cycles inside the header, arrows/Home/End move between menu links and Escape closes it, returning focus to the toggle. Floating UI uses `--z-float`, below the header and menu.
- Anything that moves by itself for more than 5s needs a pause control (`MarqueeGroup`, WCAG 2.2.2). Static is the default CSS; motion is added only inside `@media (prefers-reduced-motion: no-preference)`.
- `SplitText` on anything but a heading takes `aria: 'none'`: its default puts an invalid `aria-label` on a `<p>` and `aria-hidden` on every word. Headings keep the default.
- Contrast: `--color-text-muted` is 5.6:1 and `--color-text-subtle` 4.1:1 (large text only, e.g. the About reveal). Keep new text colours at 4.5:1 on `--color-bg` (3:1 for large text).
- Expandable details also dismiss with Escape (hover and keyboard); their +/× icon shows on touch devices and on `:focus-visible`.
- There are no a11y tests: audit with axe-core (WCAG 2.2 AA tags) in Chrome after scrolling the whole page, so every reveal has run.

## SCSS

- `styles/_tokens.scss`: all design tokens as CSS custom properties (`--color-*`, `--font-*`, `--text-*` fluid scale, `--space-*`, `--radius-*`, `--ease-*`, `--duration-*`, `--z-*`). Use tokens, never hardcode values.
- `styles/abstracts/` (breakpoints `mq('sm'|'md'|'lg'|'xl')`, `container`, `hover`, `touch`, `reduced-motion`, `visually-hidden`, `label`) is auto-injected in every `.scss` via `sassOptions.additionalData` in `next.config.ts` — no `@use` needed.
- `app/globals.scss` only `@use`s tokens, reset and base. Fonts come from `app/fonts.ts` (`next/font`).
- Shared section wrapper: `components/ui/section.module.scss` + `SectionHeader`.
- Stylelint (`.stylelintrc.mjs`) enforces:
    - BEM class names in kebab-case: `.card`, `.card__title`, `.card--active` (not `.cardHeader` or `.card_title`). Access hyphenated classes as `styles['contact-item']`.
    - Alphabetical property order; `@extend` before `@include`, both before declarations.
    - No `!important`.
    - Sass emits declarations that follow an `@include` *after* it, so `@include reduced-motion`/`touch` cannot override a property declared in the same rule. Put transitions in `@media (prefers-reduced-motion: no-preference)` instead, and keep touch-only styles entirely inside `@include touch`.
- Run `pnpm lint:css:fix` before finishing; most of these are auto-fixable.

## Conventions

- Prettier: 4 spaces, single quotes, `printWidth` 120, `trailingComma: es5`, LF. `*.md` is in `.prettierignore`.
- Code comments: English, minimal and short. Define what something is (`// Small mono label: dates, section indices`), never narrate what the code does; skip them when the name already says it. Use `//` in SCSS (not `/* */`).
- UI text is in Spanish (`<html lang="es">`).
