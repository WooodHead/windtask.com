# windtask.com

Content site for [https://windtask.com](https://windtask.com). Astro content collections, Markdown and MDX, Tailwind, and the Cloudflare adapter. Deploy target is a Worker plus static assets. This repository holds the site and Wrangler config only — it does not create Cloudflare resources by itself.

## Stack

- Astro 7, TypeScript, pnpm
- Content collections (`src/content.config.ts`) with Markdown and MDX
- Tailwind CSS 4 via `@tailwindcss/vite`
- `@astrojs/cloudflare` and Wrangler
- `@astrojs/sitemap`, a `robots.txt` endpoint, and `/rss.xml`

## Commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm run generate-types
```

`pnpm build` writes the static site to `dist/`. `pnpm preview` serves that build with the Workers runtime locally. `pnpm run deploy` builds and then runs `wrangler deploy`. Do not run deploy until the `windtask.com` zone is on the Cloudflare account you are logged into — the route in `wrangler.jsonc` will attach the hostname.

Node.js `>=22.23.4` is required (current Astro engines).

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/articles/` | All articles |
| `/articles/[slug]/` | One article |
| `/categories/` | Category index |
| `/categories/[category]/` | Articles in that category |
| `/rss.xml` | RSS feed |
| `/robots.txt` | Crawler rules, including the sitemap URL |
| `/sitemap-index.xml` | Generated at build |
| `/ads.txt` | AdSense sellers record |

Trailing slashes are on. Canonical URLs use `https://windtask.com`.

## Article workflow

1. Add `src/content/articles/your-slug.md` or `.mdx`.
2. Set frontmatter:

```yaml
title: "Title"
description: "One or two sentences for the index, RSS, and meta description."
pubDate: 2026-11-03
category: finops
tags: [coding-agents, cloud-waste]
# updatedDate: 2026-11-10
# draft: true
# sample: true
```

`category` and each tag are lowercase kebab-case. `draft: true` drops the entry from the site, the sitemap, and the feed. `sample: true` marks a stub in the index.

3. Put images next to the collection and reference them from the file, for example `./images/resource-lifecycle.svg` → `src/content/articles/images/resource-lifecycle.svg`.
4. A new `category` value creates `/categories/<category>/` on the next build. Add a title and description in `src/lib/articles.ts` (`categoryMeta`) when you want a label other than a title-cased slug.
5. `pnpm dev` to read it, `pnpm build` before you ship.

The FinOps essay is `src/content/articles/coding-agent-cloud-waste-agent-leftovers.mdx`. `src/content/articles/sample-categories-are-paths.md` is a stub so the Notes category has a page.

## Categories, not subdomains

Categories are paths on one hostname: `/categories/finops/`, `/categories/notes/`. They are a field in frontmatter, not DNS.

A subdomain such as `finops.windtask.com` would be another hostname, another certificate, and usually another Worker or route. Keep a topic in this collection until it needs its own origin, cookies, or deploy lifecycle. If that happens, add a custom domain route for that hostname — do not pretend a category slug is a zone.

## AdSense verification

The publisher id is public and already in the site:

- Every page `<head>` includes `<meta name="google-adsense-account" content="ca-pub-7256473819820075">`.
- `public/ads.txt` is served at `https://windtask.com/ads.txt` with `google.com, pub-7256473819820075, DIRECT, f08c47fec0942fa0`.

After deploy:

1. In AdSense, add `windtask.com` and start site review. Google checks the meta tag and `ads.txt`.
2. Leave `PUBLIC_ADSENSE_CLIENT` empty until you want units on the page. Empty hides every ad slot and does not load the AdSense script.
3. When you are ready to show units, copy `.env.example` to `.env` and set:
   - `PUBLIC_ADSENSE_CLIENT=ca-pub-7256473819820075`
   - `PUBLIC_ADSENSE_SLOT` to the numeric slot id from AdSense (Ad units).
4. Rebuild. Both variables are `PUBLIC_` and inlined at build time. A Worker runtime var alone will not change an already built page. In Workers Builds, set them as build environment variables, then build.

`.env` and `.dev.vars` stay untracked.

## Wrangler deploy

Config lives in `wrangler.jsonc`:

- Worker name `windtask`
- Entrypoint `@astrojs/cloudflare/entrypoints/server` (Astro 6+ Cloudflare adapter)
- Assets from `./dist`, HTML forced to a trailing slash, unknown paths served with `404.html`
- Compatibility date `2026-11-03`, `nodejs_compat`, and `global_fetch_strictly_public`
- Workers Logs and Traces enabled
- Custom domain route for `windtask.com`

Sessions are off, and images are compiled at build time, so deploy does not provision a KV namespace or a Cloudflare Images binding.

```sh
pnpm build
pnpm exec wrangler deploy
```

Or `pnpm run deploy`. `wrangler deploy` publishes the Worker. This is the step that talks to Cloudflare. `pnpm exec wrangler types` refreshes `worker-configuration.d.ts` after binding changes.

Log in with `pnpm exec wrangler login` (or an account API token in the environment) before the first deploy. Preview locally with `pnpm preview` instead of deploying.

## Bind windtask.com

1. Add the zone `windtask.com` to the same Cloudflare account as the Worker. Nameservers at the registrar must point at Cloudflare before a custom domain can attach.
2. Keep the route in `wrangler.jsonc`:

```jsonc
"routes": [
  { "pattern": "windtask.com", "custom_domain": true }
]
```

3. Run `pnpm run deploy`. Cloudflare creates the DNS record and certificate for the apex and routes every path to this Worker. You do not add the record by hand.
4. Optional `www`: add `{ "pattern": "www.windtask.com", "custom_domain": true }` only if that hostname should hit the same Worker, then deploy again. A redirect from `www` to the apex can also be a Redirect Rule in the zone.
5. Confirm `https://windtask.com/ads.txt`, `/robots.txt`, `/sitemap-index.xml`, and `/rss.xml`.

`workers_dev` stays on, so the Worker also answers on `windtask.<account>.workers.dev`. Production canonicals stay on `https://windtask.com`.
