# Rolls-Royce Enthusiasts' Club

The RREC website: a Next.js app with an admin panel for News and Events, and a real membership system (online joining, payment and a member account area).

See [CLAUDE.md](./CLAUDE.md) for setup, commands, and architecture notes.

## Admin panel

The admin panel lets Club staff publish News posts and Events, and manage member records, without touching any code. Only News, Events and Members are managed here — the other pages (About, History, etc.) are fixed content maintained by a developer.

### Logging in

Go to **`/admin`** on the live site (e.g. `https://rolls-royce-enthusiasts-club.vercel.app/admin`) — you'll be redirected to the login page if you're not already signed in. Sign in with the email and password given to you by whoever set up the site.

There is no self-service signup or "forgot password" page. If you're locked out or need another staff member added, ask a developer to re-run the seed script with new credentials.

### Dashboard

After signing in you'll land on the dashboard, showing how many News posts and Events exist and how many are published. Use the top navigation (**Dashboard / News / Events**) to move around, and **Sign out** on the right when you're done.

### Writing a News post

1. Go to **News** in the admin nav, then **+ New post**.
2. Fill in:
   - **Title** — the headline.
   - **URL slug** — leave blank to auto-generate from the title, or set your own (it becomes the web address, e.g. `/news/your-slug`).
   - **Excerpt** — one or two sentences shown in the News list and homepage.
   - **Body** — the full story. Leave a blank line between paragraphs; each becomes its own paragraph on the page.
   - **Cover image** — click **Upload image**, pick a photo from your computer, and you'll see a preview once it's uploaded (JPEG, PNG, WebP or GIF, up to 5MB). Click **Replace image** to swap it or **Remove image** to clear it. Leave it empty to use a placeholder.
   - **Status** — **Draft** keeps it hidden from the public site; **Published** makes it live immediately.
3. Click **Create post**.

Draft posts are only visible in the admin list, never on the public site, so it's safe to start writing and come back later. Switch a post to **Published** whenever it's ready — there's no scheduling, it goes live as soon as you save.

To change or take down a post later, go to **News**, click **Edit** on it, make your changes, and **Save changes**. **Delete** removes it permanently (you'll be asked to confirm).

### Adding an Event

Same idea as News, under **Events → + New event**, with two extra fields:

- **Location** (optional) — venue and postcode.
- **Starts** / **Ends** — the event date(s) and time. **Starts** is required; leave **Ends** blank for a single-day event.

Events automatically sort into **Upcoming** and **Past** on the public `/events` page based on the start date — no need to move them manually once the date passes.

### About cover images

Uploaded images are stored in Vercel Blob storage on the live site, so anything you upload stays put across deploys — you don't need to host photos anywhere yourself.

## Membership

Visitors join and pay online at **`/membership/join`** — they pick a tier, enter their details, and pay by card via Stripe (the Club never sees or stores card numbers). Once paid, they're automatically signed into their own account at **`/portal`**, where they can see their membership status and renewal date, update their contact details, and manage billing (update card, view invoices, cancel) — the "Manage billing" button hands them off to Stripe's own secure billing page.

Membership renews automatically each year by card, the same way a subscription does — there's no manual renewal step for members or staff.

### Viewing members (admin)

Go to **Members** in the admin nav to see everyone who's signed up, with a status for each:

- **Pending** — started signing up but hasn't completed payment yet.
- **Active** — paid and current.
- **Payment overdue** — a renewal payment failed; Stripe will keep retrying automatically.
- **Canceled** — membership has ended.

Click **View** on anyone to see their full details. From there you can **Grant active membership** (for a comped or offline-paid member, without them paying online) or **Cancel membership** (cancels their Stripe billing too, if they have any).
