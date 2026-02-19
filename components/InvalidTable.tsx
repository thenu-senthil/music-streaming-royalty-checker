'use client';

import { ParsedRow } from '@/types/stream';

interface InvalidTableProps {
  invalidRows: ParsedRow[];
}

export default function InvalidTable({ invalidRows }: InvalidTableProps) {
  if (invalidRows.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="sc-h2 text-[var(--chart-title)]">Invalid Rows</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-[var(--chart-border)] rounded-xl overflow-hidden">
          <thead style={{ background: 'var(--chart-bg)' }}>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-[var(--chart-title)]">Row #</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[var(--chart-title)]">Data</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-[var(--chart-title)]">Errors</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--chart-border)]" style={{ background: 'var(--chart-bg)' }}>
            {invalidRows.map((row, idx) => (
              <tr key={idx} className="hover:opacity-90">
                <td className="px-4 py-2 text-sm text-[var(--chart-title)]">{row.rowIndex}</td>
                <td className="px-4 py-2 text-sm text-[var(--chart-muted)]">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(row.raw, null, 2)}
                  </pre>
                </td>
                <td className="px-4 py-2 text-sm text-[var(--sc-danger)]">
                  <ul className="list-disc list-inside">
                    {row.errors.map((error, errIdx) => (
                      <li key={errIdx}>{error}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
