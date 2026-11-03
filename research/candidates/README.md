# Candidate keyword research log

This directory is the durable log for keyword digs. It sits at `research/candidates/` on purpose: Astro collections only load `src/content/articles`, so these notes never become pages and do not affect `pnpm build`.

Every dig round appends here, including a round that ships nothing.

## Layout

| Path | Role |
| --- | --- |
| `INDEX.md` | One row per keyword. The only list to scan. |
| `by-date/YYYY-MM-DD.md` | That day's dig: sources, URLs, and why a term was kept or rejected. Date is Asia/Shanghai. |
| `by-cluster/<slug>.md` | Optional rollup. Open one when a theme has 3+ related keywords (or the same number of distinct signals). |

Do not put this log under `content/research/` or `src/content/`.

## INDEX columns

| Column | Meaning |
| --- | --- |
| keyword | Demand or query the article would answer. |
| cluster | Theme slug. Matches `by-cluster/<slug>.md` when that file exists. |
| intent | Search intent in a few words (investigation, comparison, how-to, governance). |
| status | One of the values below. |
| date | Date discovered (`YYYY-MM-DD`). |
| sources | Platform plus URL. Several sources go in one cell, separated by `;`. |
| notes | One-line rationale. Rejections include the reason. |

`INDEX.md` is sorted by status, then by date. Within the same status and date, keep the order the term was recorded. Rejected rows stay. Never delete history to tidy the table.

If a later round merges sources into an existing keyword, update the INDEX row in place. Say what changed in that day's `by-date/` file. Do not add a second row for the same keyword.

## Status

Only these values:

| Status | Meaning |
| --- | --- |
| `new` | Captured. Not past the SEO gate. Includes items explicitly hung for a later cycle. |
| `gating` | In SEO review now. |
| `approved` | Gate passed. Draft has not started. |
| `writing` | Draft is in progress (including a draft waiting on site publish). |
| `published` | Live on the site. |
| `rejected` | Will not ship. The reason stays in `notes`. |

Do not invent statuses (`候选`, `挂起`, `放行`, `淘汰` are notes, not status values). A hung term stays `new` until a gate decision changes it.

## Dig round checklist

1. Add or update `by-date/YYYY-MM-DD.md` with platform, URL, one-line rationale, and the decision.
2. Add or update every keyword in `INDEX.md`. Keep the seven columns.
3. If a cluster now has 3+ related terms, add or update `by-cluster/<slug>.md`.
4. Leave site UI, styles, and `public/ads.txt` alone unless the round is actually publishing an article.
