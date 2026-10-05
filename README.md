# dev-portfolio

Personal portfolio of a frontend developer (React/TypeScript/CSS).

## Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** SCSS (CSS Modules with `.module.scss` syntax)
- **Package manager:** pnpm
- **Linting:** ESLint + Prettier
- **Deployment:** Vercel

## Local development

```bash
pnpm install
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Folder structure

```
dev-portfolio/
├── app/                    # Next.js routes (App Router)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home
│   └── globals.scss        # Global styles + variables
│
├── components/             # Reusable UI
│   ├── ui/                 # Base components (Button, Card, etc.)
│   └── layout/             # Header, Footer, Nav
│
├── content/                # Static data (JSON)
│   ├── cv.json             # CV data
│   └── projects.json       # Projects data
│
├── lib/                    # Helpers and utilities
│
├── types/                  # Shared TypeScript types
│
├── public/                 # Static assets
│
├── .gitignore
├── .npmrc                  # save-exact=true
├── .prettierrc
├── .prettierignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

## Roadmap / Pending

- [ ] Web sections: home, projects, CV, blog/notes, lab
- [ ] CV PDF generation from `content/cv.json`
- [ ] Real CV and projects content
- [ ] Full design and styling
- [ ] Reusable UI components
- [ ] Vercel deployment
