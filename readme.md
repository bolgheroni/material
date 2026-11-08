# material
oi

Study material for the Unibo MSc in Artificial Intelligence, published as static pages on Cloudflare Pages.

| Page | What it is |
|---|---|
| `mldm/classification-guide/` | Complete explanatory guide: classification, decision trees, validation, model selection, performance measures, Naïve Bayes, logistic regression, kNN |
| `mldm/classification-review/` | One-hour timed review: flashcards, multiple choice, written problems, weak spots |
| `mldm/briefing-08-11/` | 30-minute catch-up briefing for lectures 08 to 11 |

Every page is one self-contained `index.html`, so there is no build step.

## Deploy (Cloudflare Pages)

Connect this repo in Workers & Pages, leave the build command empty and set the output directory to `/`. Add the custom domain under Custom domains. `_headers` asks search engines not to index the pages.

## Password

`functions/_middleware.js` (a Cloudflare Pages Function) asks for a password before serving any page and keeps the visitor signed in for 30 days with a cookie. The password is not in the repo: set it as a **secret** named `SITE_PASSWORD` in Pages > Settings > Variables and Secrets (Production, and Preview if wanted), then redeploy. Without it the site answers 500. To change the password, edit the secret and redeploy; every old cookie stops working.

The gate protects the deployed site, not this repository: while the repo is public its files are readable on GitHub. Make the repo private if the content should not be public (Pages works with private repos).

## Notes

- NordicMart is a fictional retailer: its data, counts, weights and scores are illustrative numbers, not results fitted on real data.
- Progress and answers on the review page are stored in each visitor's browser (localStorage).
