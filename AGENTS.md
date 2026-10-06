<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Comandos

Solo pnpm (`.npmrc` tiene `save-exact=true`: las dependencias se pinean exactas, sin `^`).

```bash
pnpm dev            # dev server en :3000
pnpm build          # build de producción (Turbopack por defecto en Next 16)
pnpm lint           # ESLint (eslint-config-next + eslint-config-prettier)
pnpm lint:fix       # ESLint --fix y luego prettier --write .
pnpm lint:css       # Stylelint sobre **/*.scss
pnpm lint:css:fix
```

- No hay framework de tests, ni CI, ni husky, ni hooks de git. No los busques.
- `next build` **sí** ejecuta TypeScript y falla si hay errores de tipos, pero **ya no ejecuta el linter** (`next lint` fue eliminado en Next 16). Hay que correr los linters a mano.
- Para solo chequear tipos: `npx next typegen && npx tsc --noEmit`. `next typegen` es necesario para tener los tipos de rutas (`PageProps`, `LayoutProps`) generados; sin él, `tsc` no los valida.
- Comentarios en el código mínimos, cortos y a lo sumo, de definición.

## SCSS

- `next.config.ts` está vacío: **no hay `sassOptions.additionalData`**. Los SCSS de componente (`.module.scss`) se compilan como stylesheet raíz, así que **las variables de `app/globals.scss` (`$color-*`, `$spacing-*`, `$breakpoint-*`) no están disponibles** ahí y el build falla con `Undefined variable`. Para compartir variables hay que moverlas a un partial e importar con `@use`, o configurar `additionalData`.
- `globals.scss` se importa en `app/layout.tsx` (no en `_app` ni `_document`).
- Stylelint es estricto y va más allá de lo obvio:
  - Clases BEM en kebab-case: `.card`, `.card__title`, `.card--active`. `.cardHeader` o `.card_title` fallan.
  - Propiedades **en orden alfabético** dentro de cada bloque.
  - `!important` está prohibido; usa `@extend`/`@include` (además `@extend` va antes que `@include`).
  - Corre `pnpm lint:css:fix` antes de dar por terminado: varios de estos errores son auto-corregibles.

## Alias y estructura

- `@/*` apunta a la **raíz** del repo (`tsconfig.json` → `"@/*": ["./*"]`), no a `src/`.
- Rutas en `app/` (flat, sin locale): `/`, `/cv`, `/cv/pdf`.
- UI en `components/` (`cv/`, `ui/`, `layout/`), datos estáticos en `content/*.json` (CV real en `cv.json`), utilidades en `lib/`, tipos en `types/`.
- `pnpm-workspace.yaml` **no declara un monorepo**: no tiene campo `packages/`, solo `allowBuilds` desactivando los build scripts de `sharp` y `unrs-resolver`.

## CV / datos

- `content/cv.json` tiene los datos reales del CV (experiencia, educación, certificaciones, idiomas, skills).
- `app/cv/page.tsx` renderiza el CV desde ese JSON.
- `app/cv/pdf/route.ts` genera HTML para imprimir/guardar como PDF (sin librerías pesadas).
- Tipos en `types/cv.ts`.

## Formato

Prettier: 4 espacios, comillas simples, `printWidth` 120, `trailingComma: es5`, LF. Ojo: `.prettierignore` excluye `*.md`, así que los markdown no se formatean. Los comentarios del código están en español; mantenlo.