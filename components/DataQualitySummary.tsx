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
    { label: 'Total Rows', value: summary.totalRows, color: 'bg-blue-50 text-blue-700' },
    { label: 'Valid Rows', value: summary.validRows, color: 'bg-green-50 text-green-700' },
    { label: 'Invalid Rows', value: summary.invalidRows, color: 'bg-red-50 text-red-700' },
    { label: 'Missing Fields', value: summary.missingFields, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Invalid Dates', value: summary.invalidDates, color: 'bg-orange-50 text-orange-700' },
    { label: 'Duplicate Rows', value: summary.duplicateRows, color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Data Quality Summary</h2>
        <div className="text-sm text-gray-600">
          Quality Score: <span className="font-bold">{qualityPercentage}%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`p-4 rounded-lg ${card.color}`}>
            <div className="text-sm font-medium mb-1">{card.label}</div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
