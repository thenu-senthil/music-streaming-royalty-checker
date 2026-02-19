# Royalty Checker

**Music streaming data analysis dashboard for top artists.**  
Built as a portfolio project inspired by [Empire](https://empire.la)—the independent distribution and label powerhouse known for artist-first deals, transparent royalties, and data-driven operations.

---

## Inspiration: Empire & Ghazi Shami

**Ghazi Shami** is the founder and CEO of Empire Distribution. A Palestinian-American from San Francisco, he started Empire in 2010 with a credit card and a different vision: **artist autonomy and transparency**. Instead of locking artists into long exclusive deals, Empire offered non-exclusive partnerships, monthly royalty payments, and tools so artists could see and track their earnings. That approach helped break acts like Kendrick Lamar, Migos, Cardi B, and Anderson .Paak. This project takes that same spirit—clear data, clean pipelines, and usable analytics—and puts it into a single dashboard: ingest streaming data, validate it, analyze it, and report on it so royalties and artist metrics stay trustworthy and actionable.

---

## Features

- **CSV upload** — Drag & drop or browse; load the included sample dataset to see it work
- **Data validation** — Zod-based checks (dates, required fields, non-negative streams)
- **Data quality summary** — Valid/invalid rows, missing fields, duplicates
- **Analytics charts** — Streams by platform, top tracks, streams over time
- **Royalty estimator** — Editable payout rates per platform and estimated royalties
- **Halftime show impact** — Pre/post show streaming comparison for selected artists
- **Bay Area legends** — Clickable artist spotlights (E-40, Too Short, Mac Dre, Keak da Sneak, Richie Rich) with short bios and data when available

---

## Try it with the sample dataset

1. **Clone and run the app** (see [Getting started](#getting-started) below).
2. On the dashboard, click **“Load Sample CSV”**.
3. The app will load `public/sample_streams.csv`, validate it, and show:
   - Data quality summary and optional download of the cleaned CSV  
   - Charts (platforms, top tracks, time series)  
   - Royalty estimates and halftime show analysis  
   - Bay Area legend spotlights (E-40, Too Short, Mac Dre, Keak da Sneak, Richie Rich have sample rows)

No extra CSV is required—the sample file is in the repo and is used by the “Load Sample CSV” button.

---

## CSV format

Your own CSV must use these columns (order can vary; names are case-insensitive):

| Column    | Format / rules                |
|----------|--------------------------------|
| `date`   | YYYY-MM-DD                     |
| `platform` | e.g. Spotify, Apple Music, YouTube |
| `artist` | Artist name                    |
| `track`  | Song title                     |
| `country`| Country code (e.g. US)        |
| `streams`| Non-negative integer          |

Example:

```csv
date,platform,artist,track,country,streams
2024-01-01,Spotify,E40,Function,US,45000
```

---

## Tech stack

- **Next.js 14+** (App Router), **TypeScript**, **Tailwind CSS**
- **PapaParse** (CSV), **Zod** (validation), **Recharts** (charts), **date-fns** (dates)

---

## Getting started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install and run

```bash
git clone https://github.com/thenu-senthil/music-streaming-royalty-checker.git
cd music-streaming-royalty-checker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then click **Load Sample CSV** to run the full flow.

### Build for production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. At [vercel.com](https://vercel.com), **Add New → Project** and import the repo.
3. Use the default Next.js settings and deploy.

---

## Project structure

```
music-streaming-royalty-checker/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Upload.tsx
│   ├── DataQualitySummary.tsx
│   ├── InvalidTable.tsx
│   ├── Charts.tsx
│   ├── RoyaltyEstimator.tsx
│   ├── HalftimeShowAnalysis.tsx
│   ├── BayAreaLegends.tsx
│   └── ArtistSpotlight.tsx
├── lib/
│   └── validation.ts
├── types/
│   └── stream.ts
└── public/
    └── sample_streams.csv   ← sample dataset (use “Load Sample CSV”)
```

---

## How the project mirrors royalty ingestion

1. **Ingest** — CSV upload or sample load  
2. **Validate** — Schema and quality checks  
3. **Analyze** — Charts and rollups  
4. **Report** — Cleaned export and estimated royalties  

Keeping bad data out of the pipeline keeps financial analytics reliable—the same idea behind tools artists and labels use at companies like Empire.

---

## License

MIT
