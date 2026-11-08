# material

Study material for the Unibo MSc in Artificial Intelligence, published as static pages on Cloudflare Pages.

| Page | What it is |
|---|---|
| `mldm/classification-guide/` | Complete explanatory guide: classification, decision trees, validation, model selection, performance measures, Naïve Bayes, logistic regression, kNN |
| `mldm/classification-review/` | One-hour timed review: flashcards, multiple choice, written problems, weak spots |
| `mldm/briefing-08-11/` | 30-minute catch-up briefing for lectures 08 to 11 |

Every page is one self-contained `index.html`, so there is no build step.

## Deploy (Cloudflare Pages)

Connect this repo in Workers & Pages, leave the build command empty and set the output directory to `/`. Add the custom domain under Custom domains. `_headers` asks search engines not to index the pages.

## Notes

- NordicMart is a fictional retailer: its data, counts, weights and scores are illustrative numbers, not results fitted on real data.
- Progress and answers on the review page are stored in each visitor's browser (localStorage).
