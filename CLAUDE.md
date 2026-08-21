# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The Rolls-Royce Enthusiasts' Club (RREC) website — a Next.js 16 (App Router, TypeScript) app with a Postgres-backed admin panel for News and Events, plus a real membership system (Stripe-backed signup/billing, a member self-service portal). It replaced an earlier static HTML mockup; the design language (ink/cream/gold palette, Libre Caslon Display + DM Sans typefaces) carries forward from that concept, refined toward a more spacious, editorial, photography-led feel.

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

Copy `.env.example` to `.env` (`DATABASE_URL`) and `.env.local` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `MEMBER_SESSION_SECRET`, `STRIPE_*`), then `npm run db:migrate && npm run db:seed`.

**`.env.local` must never contain `DATABASE_URL` (or any other var also in `.env`).** Next.js gives `.env.local` priority over `.env` — `vercel link`/`vercel env pull` write production values into `.env.local` by default, and if `DATABASE_URL` ends up there, `npm run dev` silently starts hitting the **production** database instead of local Docker Postgres (this happened once — see git history). Production values pulled from Vercel live in `.env.vercel-prod-reference` instead (gitignored, not auto-loaded by Next.js) — use them manually, inline, when you need to run something against prod: `DATABASE_URL="<paste>" npx prisma migrate deploy`.

The Prisma client generates to `lib/generated/prisma` (gitignored, custom `output` path in `schema.prisma`) — it's regenerated automatically via the `postinstall` script, so run `npm install` after pulling schema changes.

### Stripe (local dev)

Membership signup/billing needs the Stripe CLI to forward webhooks locally:

```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This prints a `whsec_...` value — put it in `.env.local` as `STRIPE_WEBHOOK_SECRET`. Test cards: `4242 4242 4242 4242`, any future expiry, any CVC. The 5 Stripe Prices (4 membership tiers + the one-time joining fee) already exist in the connected Stripe account's test mode; their IDs are the `STRIPE_PRICE_*` env vars — don't recreate them, reuse the existing ones (see `.env.example`).

## Architecture

### Route groups: public site vs. admin vs. member portal

- `app/(site)/` — the public marketing site, wrapped by `app/(site)/layout.tsx` (renders `<Header>`/`<Footer>`). Contains the 10 static content pages (about, membership, sections, registers, publications, affiliates, history, foundation, archives, faqs) plus the dynamic `news/` and `events/` routes, and the membership join flow (`membership/join`, `membership/welcome`).
- `app/admin/` — the admin panel (News/Events/Members management). `app/admin/login/` is public. `app/admin/(protected)/` is gated: its `layout.tsx` calls `getCurrentAdmin()` and redirects to `/admin/login` if there's no session, and renders the admin topbar/nav instead of the public Header/Footer.
- `app/portal/` — the member self-service portal (view membership status, manage billing, edit profile). Same shape as `app/admin/`: `app/portal/login/` is public, `app/portal/(protected)/` is gated by `getCurrentMember()`. **Fully separate from the admin panel** — different Prisma model, different session cookie/secret, different login page. Don't conflate the two.
- `app/layout.tsx` (root) is intentionally bare — just fonts and `<html>/<body>`. **Do not add Header/Footer there** — that was a real bug during initial build (the public nav floated over and intercepted clicks on admin pages). Site chrome belongs in `app/(site)/layout.tsx` only; `app/admin` and `app/portal` each render their own chrome.

### Auth

Custom session-cookie auth, not a library like NextAuth — deliberately minimal, and deliberately **two independent auth systems**, not one unified with roles:

- `lib/auth.ts` / `lib/memberAuth.ts` — `iron-session` config for admins/members respectively. Separate cookie names (`rrec_admin_session` / `rrec_member_session`) and separate secrets (`SESSION_SECRET` / `MEMBER_SESSION_SECRET`) — a session sealed with the wrong secret fails `unsealData` and is treated as unauthenticated, so a mixed-up cookie fails *closed* (redirect to the right login), never fails *open* into the wrong account type.
- `lib/password.ts` — bcrypt hash/verify, shared by both (kept separate from `lib/auth.ts`/`lib/memberAuth.ts` because `prisma/seed.ts` needs hashing but can't import `next/headers`/`server-only` outside a request context).
- `proxy.ts` (repo root) — gates `/admin/:path*` and `/portal/:path*` independently: two path-branched checks in one function, each verifying its own sealed session cookie via `unsealData` and redirecting to its own login page if missing/invalid. Every admin/member Server Action that mutates data *also* re-checks `getCurrentAdmin()`/`getCurrentMember()` itself (see `lib/actions/*.ts`) — per Next's own proxy docs, proxy coverage can silently break if a route moves, so Server Actions must not rely on it alone.
- Admins: no signup route, ever. The first admin is created by `prisma/seed.ts` from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars; additional admins = re-run the seed with different values (or insert directly).
- Members: public self-service signup *is* the point — see Membership & payments below. There's no separate "create a member" admin form; members are created by the join flow (or an admin manually comping one via `/admin/members`).

### Content model & scope boundary

Only **News** (`Post` model) and **Events** (`Event` model) are database-backed and admin-editable — matching the ask ("admin panel to add content, news and events"), not a full page CMS. The other 10 marketing pages are plain React Server Components with hardcoded copy in `app/(site)/*/page.tsx`. If that scope ever expands, it needs a new Prisma model + admin screen, not a retrofit.

- `lib/content.ts` — public-facing read queries (`getPublishedPosts`, `getPostBySlug`, `getUpcomingAndPastEvents`, `getEventBySlug`) — always filtered to `status: "published"`.
- `lib/actions/news.ts`, `lib/actions/events.ts` — admin Server Actions (`"use server"`) for create/update/delete. Each calls `revalidatePath` on the relevant public routes plus `/` (home shows a "Latest news" strip) after a mutation, since these are cache-affecting writes.
- Public news/events pages and the homepage are `export const dynamic = "force-dynamic"` — they read the DB directly on every request rather than being statically prerendered, so admin edits show up immediately without a redeploy.
- Body text is plain text with blank-line-separated paragraphs (`lib/format.ts#paragraphs`), not markdown/rich text — kept intentionally simple for MVP.
- Image handling: admins upload a file directly (`components/admin/ImageUploadField.tsx`, a client component with a live preview) rather than pasting a URL. It calls `lib/actions/upload.ts#uploadImage`, which uploads to **Vercel Blob** when connected — either via the classic `BLOB_READ_WRITE_TOKEN` or (the connection method Vercel's dashboard uses now) `BLOB_STORE_ID` + an automatic Vercel OIDC token that `@vercel/blob` picks up on its own — or falls back to writing into `public/uploads/` (gitignored) for local dev with no extra setup. The resulting URL is stored in the hidden `coverImage` field the rest of the form submits normally. Production **requires** a Vercel Blob store connected (see Deploying below) — Vercel's filesystem is ephemeral, so the local-disk fallback would silently lose uploads there. `next.config.ts` allowlists the Blob CDN hostname under `images.remotePatterns` and raises the Server Actions body limit to `6mb` (Next's default 1MB is too small for image uploads) — see `components/ui/PlaceholderImage.tsx` for the gradient stand-in shown when a post/event has no cover image at all.

### Membership & payments

Real online payment via Stripe Checkout (hosted, redirect-based — no Stripe.js/Elements loaded on our own pages, no publishable key needed) + Stripe Subscriptions (annual, auto-renewing, matching the real tier pricing). Not embedded Elements, deliberately — minimizes PCI scope for a project this size.

- `prisma/schema.prisma`'s `Member` model uses plain string fields for `tier`/`status` (not Prisma `enum`s), matching `Post.status`/`Event.status` — adding a new value never needs a migration, just validate it at the Server Action boundary.
- `lib/stripe.ts` — Stripe client singleton, `TIER_PRICE_IDS`/`JOINING_FEE_PRICE_ID`/`TIER_LABELS` lookup tables keyed by the same tier strings as the DB, `subscriptionPeriodEnd()` helper. **API-version gotcha**: `current_period_end` no longer lives on `Subscription` itself — it moved to `subscription.items.data[0].current_period_end`. Similarly an Invoice's subscription reference is `invoice.parent?.subscription_details?.subscription`, not a top-level `invoice.subscription`. Both drifted in a recent Stripe API version; check the installed `stripe` package's `.d.ts` files before assuming an older tutorial's shape is still correct.
- `lib/actions/memberJoin.ts#joinAction` — public signup: upserts a `pending` Member by email (handles an abandoned-then-retried signup without a unique-constraint crash), creates a Checkout Session (`mode: "subscription"`, the tier's recurring price **plus** the one-time joining-fee price as a second line item — Stripe Checkout supports mixing a one-time price into a subscription-mode session), and redirects to Stripe. If the email already belongs to a **non**-pending Member, redirects to `/portal/login` instead of re-running signup — the join flow is for brand-new members only, there's no "resubscribe after cancellation" flow yet.
- `app/api/stripe/webhook/route.ts` — the only Route Handler in the app (everything else is Server Actions); webhooks need raw-body signature verification (`await request.text()`, never `.json()` first) and receive unauthenticated-but-signed external requests, which doesn't fit the Server Action model. Handles `checkout.session.completed`, `customer.subscription.updated`/`.deleted`, `invoice.payment_failed`.
- `lib/memberActivation.ts` — the shared, **idempotent** status-update logic both the webhook and `/membership/welcome` call. Re-applying the same write twice (e.g. webhook and the welcome-page bridge both firing for the same checkout) is a harmless no-op, not a duplicate side effect — this is what lets the welcome page log a member in immediately for good UX without waiting on webhook delivery, while the webhook stays the durable source of truth.
- **Cookies can only be set in a Server Action or Route Handler, never during a page render** — this bit us once building `/membership/welcome`. That page is a Server Component that verifies the Checkout Session and does the DB activation write (fine, no cookies involved), then renders a button whose `formAction` is `completeMemberLoginAction` (in `lib/actions/memberJoin.ts`) — a real Server Action that sets the session cookie. Don't try to call `session.save()` directly inside a page component's render.
- `/portal/(protected)/layout.tsx` gates on **"has a valid member session"**, not `status === "active"` — a `past_due` or `canceled` member must still be able to log in to see their status and fix billing, or a cancellation would permanently lock them out.
- No member directory, no event RSVP/booking tied to membership, no member-only gated content on News/Events — explicit scope boundary, not an oversight, same spirit as the News/Events-only admin scope above.

### Design system

Tokens live in `app/globals.css` (`:root` custom properties: `--ink`/`--cream`/`--paper`/`--gold`/`--line`, a spacing scale `--space-*`, a typography scale `--text-*`), plus a handful of **global, un-scoped utility classes** defined there on purpose (`.eyebrow`, `.textLink`, `.btn`/`.btnLight`/`.btnDark`/`.btnOutline`/`.btnGhost`, `.container`) — these are meant to be combined with CSS Module classes via template strings (e.g. `` `eyebrow ${styles.something}` ``), which is why they're plain classes and not modules. `.btnOutline` is for dark backgrounds (transparent, light border); `.btnGhost` is the light-background equivalent — don't use `.btnOutline` on a light/paper background, the border is nearly invisible there.

Reusable page-section components are in `components/ui/`: `PageHero`, `ContentSection`, `Editorial` (the alternating image/text pattern — deliberately reused across About/History/Foundation/Home rather than one-off styled per page), `CardsGrid`, `Timeline`, `Accordion`, `PostList`, `PlaceholderImage`. Prefer composing these over writing new page-specific CSS when adding or editing a static page — that's what keeps the ten marketing pages visually consistent without duplicating markup the way the original 12-file static site did.

Fonts are loaded via `next/font/google` in the root layout (`--font-dm-sans`, `--font-libre-caslon`); `globals.css` references them as `var(--font-dm-sans)`/`var(--font-libre-caslon)`, not literal font-family strings — next/font renames the actual `@font-face` family, so hardcoding "DM Sans" as a string won't work.

## Deploying (Vercel)

**Live at https://rrec-website.vercel.app** — Vercel project `rrec-website` under team `yans-projects-7fc28a30`. Deploys are **manual via the authenticated Vercel CLI** (`npx vercel deploy --prod`), not automatic on git push — the GitHub App's auto-deploy connection to either remote couldn't be established (tried granting it repo access via github.com/settings/installations; the API still reported the repo as inaccessible, not fully diagnosed). Deploy by running `vercel deploy --prod` from this directory after any change that should go live.

Two git remotes get pushed in parallel out of habit (neither one drives deployment): `origin` → `webature/RollsRoyceEnthusiastsClub` (branch `refactoring`), `newhost` → `skukovsky/rrec-website` (branch `main`).

Storage/integrations already connected to the Vercel project (Postgres via Neon, Blob) — this is what a *new* project would still need set up:

1. Add a **Postgres** integration (Neon-backed; `vercel integration add neon` works non-interactively) — populates `DATABASE_URL` and friends.
2. Add a **Blob** store — **dashboard-only, no CLI creation command** (`vercel blob` only manages files in an existing store). In the dashboard, watch for a Public/Private access choice during creation and pick **Public** — a store created without an explicit choice defaults to **private**, which breaks cover images (`put(..., { access: "public" })` throws "Cannot use public access on a private store"). If you end up with a private store, delete it and recreate rather than trying to find a settings toggle to flip it after the fact (there isn't one in the dashboard UI as of writing). Once a public store exists, connect it to the project with `vercel integration-resource connect <store-name> <project-name> --yes`.
3. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `MEMBER_SESSION_SECRET` (random 32+ char strings), and the Stripe vars below as Production env vars (`vercel env add <NAME> production`).
4. Stripe (production/live mode): create the 5 live-mode Prices (mirroring the test-mode ones — live and test are separate object spaces, IDs differ), set `STRIPE_SECRET_KEY`/`STRIPE_PUBLISHABLE_KEY`/`STRIPE_PRICE_*` to the live values, create a live-mode webhook endpoint pointed at `https://rrec-website.vercel.app/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET` to its signing secret. **Before switching to live keys**, point a *test-mode* webhook at the real production URL and run one full signup through it — validates the deployed Route Handler for real over HTTPS with zero financial risk.
5. After the first deploy, run `prisma migrate deploy` and the seed script once against the production `DATABASE_URL` (see the `.env.vercel-prod-reference` note above — pass it inline, don't put it in `.env.local`) to create the schema and the real first admin account.
