# AP Practice

Practice bank for **AP U.S. History** and **AP Chemistry**.

- Standard MCQs and a separate **trap** mode per unit
- Filters by topic and difficulty
- Explanations, distractor notes, and trap “how to avoid” after each answer
- KaTeX for chemistry formulas
- Source / license attribution on answers

## Data

Question JSON lives in `data/apush` and `data/apchem` (standard `questions/`, trap `traps/`, plus `blueprint.json`).

Original and open-license items only. Not affiliated with the College Board.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Connected to Vercel from this GitHub repo. Production deploys on push to `main`.
