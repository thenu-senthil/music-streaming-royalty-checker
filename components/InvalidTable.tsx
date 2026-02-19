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
      <h2 className="text-xl font-semibold">Invalid Rows</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Row #</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Data</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Errors</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invalidRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">{row.rowIndex}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(row.raw, null, 2)}
                  </pre>
                </td>
                <td className="px-4 py-2 text-sm text-red-600">
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
