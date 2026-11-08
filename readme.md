# material
oi

Study material for the Unibo MSc in Artificial Intelligence, published as static pages (Cloudflare Worker with static assets).

| Page | What it is |
|---|---|
| `public/mldm/classification-guide/` | Complete explanatory guide: classification, decision trees, validation, model selection, performance measures, Naïve Bayes, logistic regression, kNN |
| `public/mldm/classification-review/` | One-hour timed review: flashcards, multiple choice, written problems, weak spots |
| `public/mldm/briefing-08-11/` | 30-minute catch-up briefing for lectures 08 to 11 |

Every page is one self-contained `index.html`, so there is no build step.

## Deploy (Cloudflare Workers with static assets)

The site is a Worker (`src/worker.js`) that serves the static files in `public/` after a password check. `wrangler.jsonc` describes it; its `name` must match the Worker's name in the Cloudflare dashboard.

- Connect this repo in Workers & Pages (Import a repository). Keep the default deploy command `npx wrangler deploy`, no build command. Every push to `main` deploys.
- Add the custom domain in the Worker's Settings, Domains & Routes.
- **Password**: set a secret named `SITE_PASSWORD` in the Worker's Settings, Variables and Secrets (type Secret), then redeploy. Without it the site answers 500. Visitors sign in once and a 30-day cookie keeps them in; changing the secret signs everybody out.
- The gate protects the deployed site, not this repository: while the repo is public its files are readable on GitHub. Make the repo private if the content should not be public.

## Layout

```
public/                 static files served by the Worker
  index.html            landing page with links
  _headers              extra response headers
  mldm/<page>/index.html
src/worker.js           password gate + static assets
wrangler.jsonc          Worker config
```

A Cloudflare Pages `functions/` directory is not used: with `functions/` next to static files `wrangler deploy` refuses to build.

## Notes

- NordicMart is a fictional retailer: its data, counts, weights and scores are illustrative numbers, not results fitted on real data.
- Progress and answers on the review page are stored in each visitor's browser (localStorage).
