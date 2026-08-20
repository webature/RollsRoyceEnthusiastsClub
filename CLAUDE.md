# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The Rolls-Royce Enthusiasts' Club (RREC) website — a Next.js 16 (App Router, TypeScript) app with a Postgres-backed admin panel for News and Events. It replaced an earlier static HTML mockup; the design language (ink/cream/gold palette, Libre Caslon Display + DM Sans typefaces) carries forward from that concept, refined toward a more spacious, editorial, photography-led feel.

**Next.js 16 has real breaking changes from what you likely know** (Prisma 7 does too — see below). Before touching routing, middleware, caching, or image config, check `node_modules/next/dist/docs/` (bundled version-matched docs) rather than relying on prior knowledge. Notably: middleware is `proxy.ts` now (see `proxy.ts` at the repo root), not `middleware.ts`; `params`/`searchParams` are always `Promise`s; `revalidateTag` needs a second `cacheLife` argument.

## Commands

- `npm run dev` — start the dev server (Turbopack, default in Next 16).
- `npm run build` / `npm start` — production build / run.
- `npm run lint` — ESLint (flat config).
- `npm run db:migrate` — `prisma migrate dev` (create/apply a migration from `prisma/schema.prisma`).
- `npm run db:seed` — seed the first admin user (from `ADMIN_EMAIL`/`ADMIN_PASSWORD`) plus sample News/Events. Safe to re-run (upserts).
- `npx prisma studio` — browse the database.

### Local database

The app requires Postgres (Prisma uses the `@prisma/adapter-pg` driver adapter — there is no bundled query engine binary in Prisma 7, so `PrismaClient` must always be constructed with `{ adapter }`, see `lib/db.ts`). For local dev, run Postgres in Docker:

```
docker run -d --name rrec-postgres -e POSTGRES_USER=rrec -e POSTGRES_PASSWORD=rrec_dev_pw \
  -e POSTGRES_DB=rrec -p 55432:5432 postgres:16-alpine
```

Copy `.env.example` to `.env` (`DATABASE_URL`) and `.env.local` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`), then `npm run db:migrate && npm run db:seed`.

The Prisma client generates to `lib/generated/prisma` (gitignored, custom `output` path in `schema.prisma`) — it's regenerated automatically via the `postinstall` script, so run `npm install` after pulling schema changes.

## Architecture

### Route groups: public site vs. admin

- `app/(site)/` — the public marketing site, wrapped by `app/(site)/layout.tsx` (renders `<Header>`/`<Footer>`). Contains the 10 static content pages (about, membership, sections, registers, publications, affiliates, history, foundation, archives, faqs) plus the dynamic `news/` and `events/` routes.
- `app/admin/` — the admin panel. `app/admin/login/` is public. `app/admin/(protected)/` is gated: its `layout.tsx` calls `getCurrentAdmin()` and redirects to `/admin/login` if there's no session, and renders the admin topbar/nav instead of the public Header/Footer.
- `app/layout.tsx` (root) is intentionally bare — just fonts and `<html>/<body>`. **Do not add Header/Footer there** — that was a real bug during initial build (the public nav floated over and intercepted clicks on admin pages). Site chrome belongs in `app/(site)/layout.tsx` only.

### Auth

Custom session-cookie auth, not a library like NextAuth — deliberately minimal for a small, fixed set of trusted admins with no self-serve signup:

- `lib/auth.ts` — `iron-session` config, `getSession()`/`getCurrentAdmin()` (server-only, uses `next/headers`).
- `lib/password.ts` — bcrypt hash/verify (kept separate from `lib/auth.ts` because `prisma/seed.ts` needs hashing but can't import `next/headers`/`server-only` outside a request context).
- `proxy.ts` (repo root) — gates `/admin/:path*` at the edge of routing: verifies the sealed session cookie with `unsealData` and redirects to `/admin/login` if missing/invalid. Every admin Server Action *also* re-checks `getCurrentAdmin()` itself (see `lib/actions/*.ts`) — per Next's own proxy docs, proxy coverage can silently break if a route moves, so Server Actions must not rely on it alone.
- There is no signup route, ever. The first admin is created by `prisma/seed.ts` from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars; additional admins = re-run the seed with different values (or insert directly).

### Content model & scope boundary

Only **News** (`Post` model) and **Events** (`Event` model) are database-backed and admin-editable — matching the ask ("admin panel to add content, news and events"), not a full page CMS. The other 10 marketing pages are plain React Server Components with hardcoded copy in `app/(site)/*/page.tsx`. If that scope ever expands, it needs a new Prisma model + admin screen, not a retrofit.

- `lib/content.ts` — public-facing read queries (`getPublishedPosts`, `getPostBySlug`, `getUpcomingAndPastEvents`, `getEventBySlug`) — always filtered to `status: "published"`.
- `lib/actions/news.ts`, `lib/actions/events.ts` — admin Server Actions (`"use server"`) for create/update/delete. Each calls `revalidatePath` on the relevant public routes plus `/` (home shows a "Latest news" strip) after a mutation, since these are cache-affecting writes.
- Public news/events pages and the homepage are `export const dynamic = "force-dynamic"` — they read the DB directly on every request rather than being statically prerendered, so admin edits show up immediately without a redeploy.
- Body text is plain text with blank-line-separated paragraphs (`lib/format.ts#paragraphs`), not markdown/rich text — kept intentionally simple for MVP.
- Image handling: admins upload a file directly (`components/admin/ImageUploadField.tsx`, a client component with a live preview) rather than pasting a URL. It calls `lib/actions/upload.ts#uploadImage`, which uploads to **Vercel Blob** when connected — either via the classic `BLOB_READ_WRITE_TOKEN` or (the connection method Vercel's dashboard uses now) `BLOB_STORE_ID` + an automatic Vercel OIDC token that `@vercel/blob` picks up on its own — or falls back to writing into `public/uploads/` (gitignored) for local dev with no extra setup. The resulting URL is stored in the hidden `coverImage` field the rest of the form submits normally. Production **requires** a Vercel Blob store connected (see Deploying below) — Vercel's filesystem is ephemeral, so the local-disk fallback would silently lose uploads there. `next.config.ts` allowlists the Blob CDN hostname under `images.remotePatterns` and raises the Server Actions body limit to `6mb` (Next's default 1MB is too small for image uploads) — see `components/ui/PlaceholderImage.tsx` for the gradient stand-in shown when a post/event has no cover image at all.

### Design system

Tokens live in `app/globals.css` (`:root` custom properties: `--ink`/`--cream`/`--paper`/`--gold`/`--line`, a spacing scale `--space-*`, a typography scale `--text-*`), plus a handful of **global, un-scoped utility classes** defined there on purpose (`.eyebrow`, `.textLink`, `.btn`/`.btnLight`/`.btnDark`/`.btnOutline`/`.btnGhost`, `.container`) — these are meant to be combined with CSS Module classes via template strings (e.g. `` `eyebrow ${styles.something}` ``), which is why they're plain classes and not modules. `.btnOutline` is for dark backgrounds (transparent, light border); `.btnGhost` is the light-background equivalent — don't use `.btnOutline` on a light/paper background, the border is nearly invisible there.

Reusable page-section components are in `components/ui/`: `PageHero`, `ContentSection`, `Editorial` (the alternating image/text pattern — deliberately reused across About/History/Foundation/Home rather than one-off styled per page), `CardsGrid`, `Timeline`, `Accordion`, `PostList`, `PlaceholderImage`. Prefer composing these over writing new page-specific CSS when adding or editing a static page — that's what keeps the ten marketing pages visually consistent without duplicating markup the way the original 12-file static site did.

Fonts are loaded via `next/font/google` in the root layout (`--font-dm-sans`, `--font-libre-caslon`); `globals.css` references them as `var(--font-dm-sans)`/`var(--font-libre-caslon)`, not literal font-family strings — next/font renames the actual `@font-face` family, so hardcoding "DM Sans" as a string won't work.

## Deploying (Vercel)

Deployed via the GitHub integration (`webature/RollsRoyceEnthusiastsClub` → `rolls-royce-enthusiasts-club.vercel.app`) — push to the tracked branch to deploy, no local Vercel CLI link.

One-time setup still needed in the Vercel dashboard (not done from this environment — no CLI/API access here):

1. Add a **Vercel Postgres** (Neon-backed) storage integration to the project; this populates `DATABASE_URL`.
2. Add a **Vercel Blob** storage integration; this populates `BLOB_STORE_ID` (or `BLOB_READ_WRITE_TOKEN`, depending on connection method), which `lib/actions/upload.ts` needs for cover-image uploads to work in production.
3. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` (random 32+ char string) as Production env vars.
4. After the first deploy, run `prisma migrate deploy` and the seed script once against the production `DATABASE_URL` (locally, with `DATABASE_URL` pointed at prod) to create the schema and the real first admin account.
