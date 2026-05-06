# AGENTS.md

Operational guide for AI coding agents (Droid, Claude, Cursor, Copilot, etc.) working in this repository. Human contributors may also find it useful.

## TL;DR for agents

- Package manager: **pnpm** (lockfile is `pnpm-lock.yaml`). Never use `npm`/`yarn`.
- Node: 24.x required (Vercel no longer supports Node 18.x; pinned via `engines` in `package.json` and `.nvmrc`).
- Always run before declaring a task done:
  ```bash
  pnpm install --frozen-lockfile
  pnpm lint
  pnpm typecheck
  pnpm build
  ```
- Commit style: Conventional Commit prefix + gitmoji shortcode, e.g. `feat: :sparkles: Add anchor link for markdown header.`
- Do **not** commit secrets. Required env vars are documented in `.env.example`.

## Project overview

A statically-generated personal blog built with **Next.js 14 (App Router) + TypeScript + Tailwind**.
Posts are Markdown files in `_posts/`, comments and reactions are stored in **Vercel Postgres**, and authentication uses **Auth0**.

## Tech stack

| Concern    | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 14 (App Router, RSC, Server Actions)       |
| Language   | TypeScript (strict)                                |
| Styling    | Tailwind CSS + `@nextui-org/react`                 |
| Markdown   | `remark` / `remark-rehype` / `rehype-*`            |
| Auth       | `@auth0/nextjs-auth0`                              |
| DB         | `@vercel/postgres` (raw SQL via tagged tpl)        |
| Validation | `zod`                                              |
| Analytics  | `@vercel/analytics`, `@vercel/speed-insights`, GTM |
| Hosting    | Vercel                                             |

## Directory layout

```
_posts/                    Markdown blog posts (front-matter via gray-matter)
public/                    Static assets (favicons, images, manifest)
scripts/seed.js            One-shot Vercel Postgres schema + seed
src/
  app/                     Next.js App Router routes
    _components/           Shared client/server components (underscore = not a route)
    api/auth/              Auth0 catch-all route handler
    posts/[slug]/          Post detail page
    layout.tsx             Root layout, metadata, providers
    page.tsx               Home page
    providers.tsx          NextUI + theme providers
  interfaces/              Shared TS types (Post, Comment, Reaction)
  lib/
    actions.ts             Server Actions (createComment, addReaction, ...)
    data.ts                Server-only data access (FS + SQL)
    constants.ts           Site-level constants (name, URLs, GTM id)
    markdownToHtml.ts      Remark/Rehype pipeline
    placeholder-data.js    Seed data for scripts/seed.js
    utils.ts               Misc helpers
```

Path alias: `@/*` -> `src/*`, `@public/*` -> `public/*`.

## Available scripts

| Script           | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | Start Next.js dev server on http://localhost:3000 |
| `pnpm build`     | Production build (also acts as a typecheck gate)  |
| `pnpm start`     | Run the production build                          |
| `pnpm lint`      | `next lint` (ESLint with `eslint-config-next`)    |
| `pnpm typecheck` | `tsc --noEmit` (strict mode)                      |
| `pnpm format`    | Prettier write across the repo                    |
| `pnpm seed`      | Initialise Vercel Postgres schema + seed data     |

## Local setup

```bash
pnpm install
cp .env.example .env.local   # then fill in real values
pnpm dev
```

Without a Postgres connection, the app still renders posts (FS only); comments / reactions silently fall back to empty arrays (`try/catch` in `src/lib/data.ts` and `actions.ts`). Without Auth0 env vars, the `/api/auth/*` routes will not work but the rest of the site continues to render.

## Environment variables

See `.env.example` for the canonical list. High-level summary:

- **Auth0** (`AUTH0_*`): required for login + comments.
- **Vercel Postgres** (`POSTGRES_*`): required for comments + reactions + `pnpm seed`.
- **`PREVIEW_MODE`**: when truthy, posts marked `preview: true` in front-matter are listed.

Never log, print, or commit secret values. If you need to reference a secret in code, read it via `process.env.X` only on the server.

## Coding conventions

1. **TypeScript strict** is on; do not introduce `any` without a justified comment.
2. **Server vs client**: components default to Server Components. Add `'use client'` only when you actually need state, effects, or browser APIs. Server Actions live in `src/lib/actions.ts` and start with `'use server'`.
3. **Validation**: validate every Server Action input with `zod` (see existing examples in `src/lib/actions.ts`).
4. **SQL**: only the tagged-template form `sql\`...\``from`@vercel/postgres`. Never interpolate user input as a raw string.
5. **Imports**: use the `@/...` alias for anything under `src/`.
6. **Styling**: Tailwind utility classes; co-locate with the component. The `clsx` helper is whitelisted for `prettier-plugin-tailwindcss` class sorting.
7. **Formatting**: Prettier with single quotes (`prettier.config.js`). Run `pnpm format` if unsure.
8. **No new top-level config files** unless necessary; prefer extending the existing ones.

## Commit & PR conventions

Recent history (see `git log --oneline`) follows:

```
<type>: :<gitmoji>: <Sentence-cased subject>.
```

Examples:

- `feat: :sparkles: Add anchor link for markdown header.`
- `fix: :adhesive_bandage: Fix wrong head in posts.`

Branch naming: `feat/<slug>` or `fix/<slug>`.

Default base branch: `main`. Open a PR rather than pushing to `main`.

## Validation contract for agents

Before opening a PR or marking a task complete, an agent **must**:

1. `pnpm install --frozen-lockfile` succeeds.
2. `pnpm lint` reports no errors.
3. `pnpm typecheck` reports no errors.
4. `pnpm build` completes successfully.
5. Any new content in `_posts/` includes the standard front-matter (`title`, `excerpt`, `date`, `coverImage`, `author`).
6. No file under `.env*` (other than `.env.example`) is staged.

If any of the above fails, fix it before handing back. Do not silence rules with `// eslint-disable` or `// @ts-ignore` to make the gate green.

## Things to avoid

- Adding heavy runtime dependencies for trivial helpers (prefer a small util in `src/lib/utils.ts`).
- Editing `pnpm-lock.yaml` by hand.
- Introducing a second package manager (no `package-lock.json`, no `yarn.lock`).
- Reaching into `node_modules` or the `.next/` build output from source.
- Writing to the database outside of Server Actions.
