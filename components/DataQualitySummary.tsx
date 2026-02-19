'use client';

import { DataQualitySummary } from '@/types/stream';

interface DataQualitySummaryProps {
  summary: DataQualitySummary;
}

export default function DataQualitySummaryComponent({ summary }: DataQualitySummaryProps) {
  const qualityPercentage = summary.totalRows > 0 
    ? Math.round((summary.validRows / summary.totalRows) * 100) 
    : 0;

  const cards = [
    { label: 'Total Rows', value: summary.totalRows, bg: 'rgba(59, 130, 246, 0.15)', text: '#93c5fd' },
    { label: 'Valid Rows', value: summary.validRows, bg: 'rgba(34, 197, 94, 0.15)', text: '#86efac' },
    { label: 'Invalid Rows', value: summary.invalidRows, bg: 'rgba(239, 68, 68, 0.15)', text: '#fca5a5' },
    { label: 'Missing Fields', value: summary.missingFields, bg: 'rgba(234, 179, 8, 0.15)', text: '#fde047' },
    { label: 'Invalid Dates', value: summary.invalidDates, bg: 'rgba(249, 115, 22, 0.15)', text: '#fdba74' },
    { label: 'Duplicate Rows', value: summary.duplicateRows, bg: 'rgba(168, 85, 247, 0.15)', text: '#e9d5ff' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="sc-h2 text-[var(--chart-title)]">Data Quality Summary</h2>
        <div className="text-sm text-[var(--chart-muted)]">
          Quality Score: <span className="font-bold text-[var(--chart-title)]">{qualityPercentage}%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-4 rounded-xl border border-[var(--chart-border)]"
            style={{ background: card.bg }}
          >
            <div className="text-sm font-medium mb-1" style={{ color: card.text }}>{card.label}</div>
            <div className="text-2xl font-bold text-[var(--chart-title)]">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
