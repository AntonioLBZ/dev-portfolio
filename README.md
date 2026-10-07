# dev-portfolio

Personal portfolio of a frontend developer (React/TypeScript/CSS): a one-page site with scroll-driven animations and a
detail page per project. The UI is in Spanish.

**Live:** [antoniolbz.vercel.app](https://antoniolbz.vercel.app)

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19
- **Language:** TypeScript (strict mode)
- **Styling:** SCSS (CSS Modules) on top of design tokens defined as CSS custom properties
- **Motion:** GSAP (ScrollTrigger, SplitText) + Lenis smooth scroll + View Transitions between routes; always respects
  `prefers-reduced-motion`
- **Linting:** ESLint, Prettier and Stylelint (SCSS)
- **Package manager:** pnpm
- **Deployment:** Vercel

## Local development

```bash
pnpm install
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `pnpm dev`          | Dev server on port 3000                       |
| `pnpm build`        | Production build (type-checks, does not lint) |
| `pnpm start`        | Serves the production build                   |
| `pnpm lint`         | ESLint                                        |
| `pnpm lint:fix`     | ESLint `--fix`, then Prettier `--write`       |
| `pnpm lint:css`     | Stylelint on `**/*.scss`                      |
| `pnpm lint:css:fix` | Stylelint `--fix`                             |

There are no tests, CI or git hooks, so run `pnpm lint` and `pnpm lint:css` before committing.

Dependencies are pinned to exact versions. pnpm 11 ignores `save-exact` in `.npmrc`, so add packages with
`pnpm add -E <package>`.

## Routes

| Route              | Description                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| `/`                | One-page home: hero, about, experience, stack, projects, education, contact |
| `/projects/[slug]` | Project detail (static, one page per entry in `content/projects.json`)      |

## Content

All content lives in JSON and is read only through the getters in `lib/content.ts`:

- `content/cv.json` (typed by `types/cv.ts`): profile, experience, education, skills. `getProfile()` deliberately omits
  phone, address and birth date.
- `content/projects.json` (typed by `types/project.ts`): projects. `placeholder: true` marks example entries and
  `featured: true` shows the project on the home. `cover` is optional: without it, a gradient generated from `accent` is
  used.

## Folder structure

```
dev-portfolio/
├── app/                    # Next.js routes (App Router)
│   ├── layout.tsx          # Root layout (fonts, smooth scroll, header, footer)
│   ├── page.tsx            # Home
│   ├── projects/[slug]/    # Project detail
│   ├── not-found.tsx       # 404
│   ├── fonts.ts            # next/font setup
│   └── globals.scss        # Entry point for global styles
│
├── components/
│   ├── layout/             # Header, footer, back-to-top
│   ├── motion/             # GSAP/Lenis wrappers (Reveal, SplitHeading, SmoothScroll, RouteScroll, BackgroundField)
│   ├── sections/           # Home sections (hero, about, experience, skills, projects, education, contact)
│   └── ui/                 # Shared pieces (section header, project cover, marquee, magnetic, expandable rows)
│
├── content/                # Static data (JSON)
│   ├── cv.json             # CV data
│   └── projects.json       # Projects data
│
├── lib/
│   ├── content.ts          # Typed getters for the JSON content
│   ├── nav.ts              # Home sections used by the navigation
│   └── motion/             # GSAP setup (plugins, easings, durations), reduced-motion hook and the background shader
│
├── styles/
│   ├── _tokens.scss        # Design tokens (colors, type scale, spacing, motion)
│   ├── _reset.scss
│   ├── _base.scss          # Base styles and route transitions
│   └── abstracts/          # Breakpoints and mixins, injected in every .scss
│
├── types/                  # Shared TypeScript types
├── public/                 # Static assets
│
├── AGENTS.md / CLAUDE.md   # Guidance for coding agents (commands, architecture, conventions)
├── .npmrc                  # save-exact=true
├── .prettierrc
├── .prettierignore
├── .stylelintrc.mjs
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```

## Conventions

- Design tokens only: no hardcoded colors, sizes or durations in SCSS.
- BEM class names in kebab-case (`.card`, `.card__title`, `.card--active`), alphabetical property order, no
  `!important`. Stylelint enforces it.
- Animate only `transform` and `opacity`, and give every animation a reduced-motion branch.
- Prettier: 4 spaces, single quotes, `printWidth` 120.
- Code comments in English; UI text in Spanish.

More detail in [AGENTS.md](AGENTS.md).

## Roadmap / Pending

- [x] Web sections: home and project pages
- [x] Real CV and projects content
- [x] Full design and styling
- [x] Reusable UI components
- [x] Vercel deployment
- [ ] CV PDF generation from `content/cv.json`
- [ ] Blog/notes and lab sections
