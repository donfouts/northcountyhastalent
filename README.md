# North County Has Talent

Website for **northcountyhastalent.com**: a static [Astro](https://astro.build) site with a no-code editing panel at `/admin` ([Sveltia CMS](https://github.com/sveltia/sveltia-cms)). There's no database. All content is Markdown/JSON in this repo, and each save from `/admin` commits to GitHub and triggers a rebuild.

See [Requirements.md](Requirements.md) and [Recommendations.md](Recommendations.md) for the plan and decisions.

## Local development

Requires Node 20.3+ (Node 22+ recommended; Amplify builds on 22).

```sh
npm install
npm run dev            # garden theme (default)
npm run dev:fair       # Summer Fair theme
npm run dev:marquee    # Vintage Marquee theme
npm run build          # outputs to dist/
```

Copy `.env.example` to `.env` to set `PUBLIC_THEME` and `PUBLIC_WEB3FORMS_KEY`.

## Where things live

| What | Where |
|---|---|
| Performers, sponsors, charities, events | `src/content/<collection>/*.md` |
| Page headlines & copy | `src/content/pages/*.md` |
| Contact email, donate link, announcement bar | `src/content/settings/site.json` |
| Uploaded photos (auto-optimized at build) | `src/assets/uploads/` |
| Theme colors / fonts | `src/styles/global.css` (one block per theme) |
| Per-theme hero & motifs | `src/components/Hero.astro`, `Wordmark.astro`, `Bunting.astro` |
| Typeset logo (swap for real logo later) | `src/components/Wordmark.astro` |
| CMS fields | `public/admin/config.yml` |

### How events drive the site
- The event with `status: upcoming` controls the homepage call-to-action buttons (`auditionsOpen`, `ticketsOnSale`), the Tickets page and the date line.
- Events with `status: past` appear under **Past Events** with their photo gallery.
- Performers and sponsors are tagged with the events they took part in. The homepage lineup shows the upcoming event's performers, or falls back to the most recent past event's.

## Demos on AWS Amplify (3 themes, one repo)

Create **three Amplify apps** connected to this repo's `main` branch. They differ only in one environment variable:

| App | `PUBLIC_THEME` |
|---|---|
| ncht-garden | `garden` |
| ncht-fair | `fair` |
| ncht-marquee | `marquee` |

Also set `PUBLIC_WEB3FORMS_KEY` on each app. `amplify.yml` handles the build. Optional custom subdomains: `garden.ncht.foutsdev.com`, etc.

## Forms

The sponsor and audition forms post to [Web3Forms](https://web3forms.com). Create an access key for the destination inbox (currently `Info@FallbrookHasTalent.org`) and set it as `PUBLIC_WEB3FORMS_KEY`. Without a key, the forms show a "demo mode" notice.

## Editor login (/admin)

1. **Now:** at `/admin`, choose "Sign in with token" and use a GitHub fine-grained personal access token with *Contents: read & write* on this repo.
2. **For the host:** deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) (free Cloudflare Worker) with a GitHub OAuth app, then set `base_url` in `public/admin/config.yml`. The host signs in with their own GitHub account, added as a repo collaborator.

## Launch checklist
- [ ] Choose a theme and set its `PUBLIC_THEME` on the production app
- [ ] Point `northcountyhastalent.com` at Amplify; redirect `northcountyhastalent.org` to it
- [ ] 301 `fallbrookhastalent.org/*` (`/get-tickets/` → `/tickets/`, `/sponsors-contact/` → `/sponsors/`, `/performer/` → `/performers/`)
- [ ] Switch the contact email and Web3Forms key to the new-domain mailbox
- [ ] Upload the 2026 gallery photos (about 50) via `/admin` → Events → 2026 Fallbrook Has Talent
- [ ] Replace performer bios with the host's original wording and add performer photos
