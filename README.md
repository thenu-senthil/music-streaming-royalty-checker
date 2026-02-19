# Royalty Checker

A Next.js 14+ web application for music streaming data analysis, designed to mirror royalty ingestion workflows. Upload CSV files, validate data quality, analyze streaming metrics, estimate royalties, and track halftime show performer impact.

## Features

- **CSV Upload**: Drag & drop or browse to upload streaming data CSV files
- **Sample Data**: Load sample CSV with halftime show performers
- **Data Validation**: Zod-based validation with comprehensive error reporting
- **Data Quality Dashboard**: Summary of valid/invalid rows, missing fields, duplicates
- **Analytics Charts**: 
  - Total streams by platform
  - Top 10 tracks by streams
  - Streams over time (line chart)
  - Top 10 countries by streams
- **Royalty Estimator**: Calculate estimated royalties with customizable payout rates per platform
- **Halftime Show Analysis**: Compare pre/post show streaming metrics for Super Bowl performers

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **PapaParse** (CSV parsing)
- **Zod** (Data validation)
- **Recharts** (Data visualization)
- **date-fns** (Date manipulation)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd streamcheck
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## CSV Format

Your CSV file must include the following columns:
- `date` (YYYY-MM-DD format)
- `platform` (e.g., Spotify, Apple Music, YouTube)
- `artist` (artist name)
- `track` (song title)
- `country` (country code)
- `streams` (non-negative integer)

Example:
```csv
date,platform,artist,track,country,streams
2024-01-01,Spotify,Bad Bunny,Un Verano Sin Ti,US,150000
```

## Deployment to Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and click "New Project"

3. Import your GitHub repository

4. Configure build settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. Click "Deploy"

Your app will be live at `https://your-project.vercel.app`

## Project Structure

```
streamcheck/
├── app/
│   └── page.tsx              # Main dashboard page
├── components/
│   ├── Upload.tsx            # CSV upload component
│   ├── DataQualitySummary.tsx
│   ├── InvalidTable.tsx      # Error display table
│   ├── Charts.tsx            # Analytics visualizations
│   ├── RoyaltyEstimator.tsx  # Royalty calculator
│   └── HalftimeShowAnalysis.tsx # Bonus analysis
├── lib/
│   └── validation.ts         # CSV parsing & validation logic
├── types/
│   └── stream.ts             # TypeScript types & Zod schemas
└── public/
    └── sample_streams.csv    # Sample data file
```

## How It Works

This dashboard demonstrates the core workflow of royalty data processing:

1. **Ingest**: Upload CSV file or load sample data
2. **Validate**: Parse and validate each row using Zod schemas
3. **Analyze**: Generate charts and metrics from valid data
4. **Report**: Calculate estimated royalties and track performer impact

## Halftime Show Artists Tracked

- Bad Bunny, Rihanna, The Weeknd
- Dr. Dre, Snoop Dogg, Eminem
- Usher, Shakira, Jennifer Lopez, Beyoncé
- E40, Knxwledge, Pusha T
- Kanye West, ASAP Rocky, Lorde

## License

MIT
