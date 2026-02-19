'use client';

import { useState } from 'react';
import Upload from '@/components/Upload';
import DataQualitySummaryComponent from '@/components/DataQualitySummary';
import InvalidTable from '@/components/InvalidTable';
import Charts from '@/components/Charts';
import RoyaltyEstimator from '@/components/RoyaltyEstimator';
import HalftimeShowAnalysis from '@/components/HalftimeShowAnalysis';
import BayAreaLegends from '@/components/BayAreaLegends';
import ArtistSpotlight from '@/components/ArtistSpotlight';
import { ParsedRow, StreamRow, DataQualitySummary } from '@/types/stream';
import { parseCSV, calculateDataQuality, getValidRows, exportToCSV } from '@/lib/validation';

export default function Home() {
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [validData, setValidData] = useState<StreamRow[]>([]);
  const [qualitySummary, setQualitySummary] = useState<DataQualitySummary | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileLoaded = (content: string) => {
    try {
      const parsed = parseCSV(content);
      setParsedRows(parsed);
      
      const summary = calculateDataQuality(parsed);
      setQualitySummary(summary);
      
      const valid = getValidRows(parsed);
      setValidData(valid);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
      setParsedRows([]);
      setValidData([]);
      setQualitySummary(null);
    }
  };

  const handleError = (err: string) => {
    setError(err);
  };

  const handleDownloadCleaned = () => {
    if (validData.length === 0) return;

    const csvContent = exportToCSV(validData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_streams.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const invalidRows = parsedRows.filter((row) => row.errors.length > 0);

  return (
    <main className="sc-shell relative z-10 py-10">
      <div className="sc-container">
        {/* Header */}
        <div className="relative z-10 mb-8 flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="sc-h1">Royalty Checker</h1>
              <span className="sc-chip">
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--sc-gold)]" />
                Label-grade data QA
              </span>
            </div>
            <p className="sc-muted max-w-3xl">
              Music streaming data analysis dashboard for top artists.
            </p>
            <div className="mt-3">
              <BayAreaLegends />
            </div>
          </div>

          {/* Explanation Section */}
          <div className="sc-card sc-card-pad">
            <h2 className="sc-h2 mb-2">How this project works for royalty data ingestion:</h2>
            <p className="sc-muted text-sm">
              1. <strong className="text-[color:var(--sc-text)]">Ingest</strong> (CSV upload) → 2.{` `}
              <strong className="text-[color:var(--sc-text)]">Validate</strong> (schema + quality checks) → 3.{` `}
              <strong className="text-[color:var(--sc-text)]">Analyze</strong> (charts + rollups) → 4.{` `}
              <strong className="text-[color:var(--sc-text)]">Report</strong> (cleaned export + estimated royalties).
              Keep bad data from disrupting high-quality financial analytics.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="sc-card sc-card-pad mb-8">
          <h2 className="sc-h2 mb-4">Upload CSV Data</h2>
          <Upload onFileLoaded={handleFileLoaded} onError={handleError} />
          {error && (
            <div className="mt-4 rounded-xl border border-[color:rgba(255,90,106,0.35)] bg-[color:rgba(255,90,106,0.08)] p-4 text-[color:var(--sc-text)]">
              {error}
            </div>
          )}
        </div>

        {/* Data Quality Summary */}
        {qualitySummary && (
          <div className="sc-card sc-card-pad mb-8">
            <DataQualitySummaryComponent summary={qualitySummary} />
            
            {validData.length > 0 && (
              <div className="mt-6 border-t border-[color:var(--sc-border)] pt-6">
                <button
                  onClick={handleDownloadCleaned}
                  className="sc-btn-primary"
                >
                  Download Cleaned Dataset ({validData.length} rows)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Invalid Rows Table */}
        {invalidRows.length > 0 && (
          <div className="sc-card sc-card-pad mb-8">
            <InvalidTable invalidRows={invalidRows} />
          </div>
        )}

        {/* Charts */}
        {validData.length > 0 && (
          <div className="sc-card sc-card-pad mb-8">
            <Charts data={validData} />
          </div>
        )}

        {/* Royalty Estimator */}
        {validData.length > 0 && (
          <div className="sc-card sc-card-pad mb-8">
            <RoyaltyEstimator data={validData} />
          </div>
        )}

        {/* Halftime Show Analysis */}
        {validData.length > 0 && (
          <div className="sc-card sc-card-pad mb-8">
            <HalftimeShowAnalysis data={validData} />
          </div>
        )}

        {/* Bay Area Legends Spotlight */}
        <div className="sc-card sc-card-pad mb-8">
          <ArtistSpotlight data={validData} />
        </div>
      </div>
    </main>
  );
}
