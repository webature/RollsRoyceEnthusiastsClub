# Rolls-Royce Enthusiasts' Club

The RREC website: a Next.js app with an admin panel for News and Events.

See [CLAUDE.md](./CLAUDE.md) for setup, commands, and architecture notes.

## Admin panel

The admin panel lets Club staff publish News posts and Events without touching any code. Only News and Events are managed here — the other pages (About, Membership, History, etc.) are fixed content maintained by a developer.

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
   - **Cover image URL** — a link to an already-hosted image (there's no upload button yet — see below). Leave blank to use a placeholder.
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

There's currently no drag-and-drop image upload. To add a photo to a post or event, host it somewhere first (e.g. upload it to any image host you have) and paste the direct image URL into the **Cover image URL** field. Leaving it blank shows a neutral placeholder instead of a broken image.
