# North County Has Talent — Site Design Recommendations

_Draft v1 · 2026-11-18 · companion to [Requirements.md](Requirements.md)_

## 1. Decisions so far

| Topic | Decision |
|---|---|
| Name / domain | Simple rename: **North County Has Talent** at `northcountyhastalent.com`. Old domain 301-redirects. |
| Editing | Git-backed CMS. Static site plus a web admin panel at `/admin`, with no database. |
| Hosting | AWS Amplify Hosting in the foutsdev account, building automatically from GitHub. |
| Audition photo | Performers send a **link** to their photo (Instagram, Drive, Dropbox), not an upload. |
| Past events | One gallery for now: **2026 Fallbrook Has Talent** (June 6, 2026, White Horse Ranch). |
| Next event | Not yet scheduled. The homepage shows "Save the date — 2027 coming soon". |
| Demo themes | Garden Party, Summer Fair, Vintage Marquee. |
| Form email | Both forms go to `Info@FallbrookHasTalent.org` until a new-domain mailbox exists. |
| Repo | `github.com/donfouts/northcountyhastalent` |
| DNS | The host owns both `northcountyhastalent.com` and `.org` and the old domain at their registrar. Redirects get set up at launch. |
| Logo | Typeset wordmark for now; a real logo is likely later. The theme keeps the logo swappable as one file. |
| 2026 gallery | About 50 selected photos (in progress). They'll live in the repo; no external storage needed at that size. |
| Charities / donate | Keep Mentoring for Purpose, Whiskers & Tails and the Stripe donate link. |
| Demo URLs | Amplify default URLs for now; `ncht.foutsdev.com` subdomains if needed. |
| Audition details | Deadline, set length and limits are TBD; placeholder copy for now. |

## 2. Recommended stack

| Layer | Choice | Why | Cost |
|---|---|---|---|
| Site generator | **Astro** (static output) | Fast, plain HTML output, good image optimization, content stored as simple Markdown/YAML files | $0 |
| Admin panel | **Sveltia CMS** (Decap-compatible) at `/admin` | The host fills in forms and uploads photos. Each save commits to GitHub, which triggers a rebuild that goes live in about 2 minutes. | $0 |
| CMS login | GitHub OAuth through a tiny auth function (Lambda, or the free Cloudflare Worker `sveltia-cms-auth`) | Required so the host can log in to the admin panel | $0 |
| Source | GitHub repo (private is fine) | Holds the content and the full edit history, so any mistake can be undone | $0 |
| Hosting | **AWS Amplify Hosting** | Builds on each push, free SSL, custom domains and preview URLs | ~$1–3/mo at this traffic |
| DNS | Route 53 hosted zone (or keep DNS at the registrar) | | $0.50/mo |
| Forms | **Web3Forms** (free, 250 submissions/mo), with a honeypot field and hCaptcha | No server to run; emails go straight to Info@ | $0 |
| Analytics | Cloudflare Web Analytics or GA4 | Free and cookie-light | $0 |

**Estimated total: about $2–4/month**, plus the domain renewal.

**Fallback if GitHub login is too much for the host:** [Pages CMS](https://pagescms.org) offers the same idea as a hosted service, with no auth function to run. It still needs a GitHub account. If the host can't use GitHub at all, the next option is a Google Sheet as the content source, which handles photos less well.

### How one codebase serves three demos
- There is one repo, and colors, fonts and decorative motifs live in a theme file per theme.
- There are **3 Amplify apps on the same `main` branch**, each with a `THEME=garden|fair|marquee` environment variable.
  - `garden.ncht.foutsdev.<domain>`
  - `fair.ncht.foutsdev.<domain>`
  - `marquee.ncht.foutsdev.<domain>`
- A CMS edit updates all three demos at once, so the host compares themes on identical content.
- Once a theme is chosen, delete the other two apps and point `northcountyhastalent.com` at the winner.

## 3. Sitemap

```
/                     Home
/performers/          Lineup grid → /performers/<slug>/ detail
/tickets/             Ticket tiers + "Buy on TixFox" button
/sponsors/            Sponsor cards + "Become a sponsor" form
/past-events/         Event index → /past-events/2026-fallbrook/ gallery
/audition/            Requirements + submission form
/about/  (optional)   Beneficiaries, mission, production partner
/admin/               CMS (host only)
```
Footer on every page: contact email, sponsorship phone, Donate (Stripe link), social links, beneficiary logos.

### Page notes
- **Home.** Hero with the event name, date or "coming soon", and a primary call to action. The call to action changes with event status: *Audition now*, then *Get tickets*, then *See the photos*. Below that come a lineup teaser, an "Evening includes" strip (silent auction, wine pull, food), beneficiaries, a sponsor logo wall and a donate band.
- **Performers.** A card grid showing photo, name or act, genre tag and social icons. The detail page adds the full bio, a YouTube embed and links. Performers are linked to events, so past acts become "alumni" without being deleted.
- **Tickets.** Tiers are editable cards (VIP Table from $600, GA $75, and so on) with an includes list. Policies (21+, no pets, bring a chair) are listed below. A big **Buy on TixFox** button links to the event URL stored in settings. When no sale is open, a "Tickets on sale soon" state replaces the button.
- **Sponsors.** Optional tiers (Presenting, Gold, Community) with logo, short bio and link. The form collects company, contact, email, phone, interest level and message, and sends to Info@.
- **Past events.** One card per event links to a gallery page with a masonry grid, a lightbox and a short recap (date, venue, performers, amount raised).
- **Audition.** Placeholder requirements copy (below) and a form with these fields: name or band name, email, phone, genre, number of performers, photo link, website and social links, short bio (max 500 characters), public YouTube performance link, and a consent checkbox.

## 4. Content model (what the host edits)

| Collection | Fields |
|---|---|
| **Performers** | name, slug, photo, genre, short bio, full bio, website, instagram, facebook, tiktok, youtube video, events[], order |
| **Sponsors** | name, logo, tier, short bio, website, events[], order |
| **Events** | title, date, start/end time, venue, address, status (`upcoming` / `tickets-on-sale` / `past`), TixFox URL, ticket tiers[], features[], recap, gallery photos[], beneficiaries[] |
| **Beneficiaries** | name, logo, description, website |
| **Pages** | Home intro, About, Audition requirements, Ticket policies: free-text rich copy |
| **Site settings** | current event, contact email, sponsorship phone, Donate URL, social links, announcement bar text |

The host never edits HTML. Every field above is a form input or an image upload in `/admin`.

## 5. Theme directions (for the 3 demos)

All three are light. They differ in mood, not layout, so the comparison stays fair.

| | **Garden Party** | **Summer Fair** | **Vintage Marquee** |
|---|---|---|---|
| Mood | Relaxed ranch evening, avocado country | Bright, playful community fair | Classic talent-show stage, in daylight |
| Background | Cream `#FBF7EF` | White `#FFFFFF` | Warm ivory `#FFF8EC` |
| Primary | Sage / avocado `#5E7D4A` | Coral `#FF6B5B` | Theater red `#B8322A` |
| Accent | Terracotta `#C9714B` | Sunshine `#FFC93C` + teal `#1FA5A0` | Gold `#D9A441` |
| Headlines | Fraunces (soft serif) | Baloo 2 / Fredoka (rounded) | Abril Fatface / Bebas Neue |
| Body | Inter | Nunito | DM Sans |
| Motifs | Leaf sprigs, string-light dots, linen texture | Bunting, confetti, wavy dividers | Marquee bulbs, ticket-stub cards, scalloped edges |

A visual preview of all three is published as an artifact (linked in the chat).

## 6. Forms & email

- Use **Web3Forms**. The access key is registered to the destination address, so both forms send to `Info@FallbrookHasTalent.org` for now.
- Spam protection: a hidden honeypot field plus hCaptcha (free).
- After submitting, visitors see a thank-you page with what happens next.
- **New-domain mailbox (to decide):** the cheapest option is free forwarding with ImprovMX (`info@northcountyhastalent.com` forwards to an existing inbox). If the host wants to *send* as the new address, use Google Workspace at about $7/user/mo or Zoho Mail's free tier.

## 7. Migration & redirects

301-redirect `fallbrookhastalent.org/*` to the new site, keeping paths:

| Old | New |
|---|---|
| `/performers/`, `/performer/` | `/performers/` |
| `/get-tickets/` | `/tickets/` |
| `/sponsors-contact/` | `/sponsors/` |
| anything else | `/` |

This needs DNS or registrar access for the old domain, which the WordPress designer (247wordpressed) may currently control. Content to carry over: the 4 performers, 5 sponsors, 2 beneficiaries, ticket tier copy, Village News press links and the Stripe donate link.

## 8. Placeholder audition copy

> **Want to take the stage?** North County Has Talent is looking for singers, bands, dancers, comedians and every kind of performer in between. Tell us about your act and send a short video of you performing. Our team reviews every submission and will reach out to selected acts by email.
>
> **What we need:** your name or act name, a still photo (a link is fine), your website or social links, a short bio (2–4 sentences), and a link to a **publicly viewable** video of you performing live (YouTube preferred; unlisted is fine).
>
> **Good to know:** performers must be available on event day for sound check. Acts of all ages are welcome, but the event is 21+ for guests. _Deadline and set length: TBD._

## 9. Phased plan

1. **Scaffold.** Astro site, content collections, CMS config and the existing content migrated in.
2. **Themes.** Build the 3 themes on shared components, deploy 3 Amplify demos and send the links to the host.
3. **Host trial.** The host edits a performer and a sponsor through `/admin` to confirm the workflow works for them.
4. **Pick and polish.** Pick the theme, finish accessibility (WCAG AA contrast, alt text) and SEO/Open Graph images, and add 2026 gallery photos.
5. **Launch.** Point the domain, set up redirects, switch the form email to the new mailbox and add analytics.

## 10. Open questions

1. **Host CMS login:** will the host log in to `/admin` with their own GitHub account, added as a collaborator on the repo, or share one? Their own account is recommended.
2. **Audition details:** submission deadline, set length and any age or genre limits (TBD).
3. **Mailbox:** when will `info@northcountyhastalent.com` exist, so the forms can switch to it?
4. **Theme pick:** choose after the host has reviewed the three demos.
