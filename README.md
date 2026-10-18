# China Tea Heritage Map

A bilingual static map of 46 tea-related entries in China's national intangible cultural heritage inventory, with 15 reviewed interactive experiences and two static illustrated process guides.

## View locally

Open `index.html` in a modern browser. No backend or account is required. Saved projects, browsing history and exploration progress stay in the current browser.

## Current snapshot

- Full Chinese and English interface and project content.
- Project comparison, recommendations, saved projects and exploration history.
- Reviewed quizzes, illustrations, process guides and sequencing activities.
- Longjing has nine main process illustrations; Jingshan has eight principal ritual stages. All cards are visible without animation, dragging or quizzes. Earlier scene records are retained, but these two reading guides do not display interactive progress.
- One official source entry per project; no video or separate English Summary section.

## Data and sources

The deployed data is in `data/tea_heritage.json` and `data/tea_heritage_data.js`. Project references are retained in the data. English text is a reviewed translation, not necessarily an official English publication. AI-assisted illustrations are identified as schematics rather than documentary photographs.

The editorial source documents and approval records live outside this repository. Some scripts are editorial tools and require that local workspace; they are not necessary to view the website. Referenced sources and assets do not acquire an unrestricted reuse licence merely by being included here.

## Deployment

`scripts/package_public_preview.py` prepares an allowlisted static distribution in the adjacent publication workspace. It validates the 46-project scope and 17 content modules (15 interactive and two static), removes local document paths and approval conversation notes from the public distribution, and includes only approved artwork. Publish that distribution, not the entire working directory. Hosting charges, domain requirements and mainland-China availability depend on the selected provider.

## Checks

Node.js tests are in `scripts/*.test.cjs`. The DOM tests need `jsdom`; set `TEA_TEST_JSDOM` to its installed path. The Python feed-validation tests additionally need the local editorial workspace. Automated DOM tests do not replace visual browser checks.
