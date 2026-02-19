import { StreamRowSchema, ParsedRow, DataQualitySummary, StreamRow } from '@/types/stream';
import Papa from 'papaparse';

export function parseCSV(csvContent: string): ParsedRow[] {
  const parsed = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const requiredColumns = ['date', 'platform', 'artist', 'track', 'country', 'streams'];
  const hasAllColumns = requiredColumns.every((col) =>
    parsed.meta.fields?.some((field) => field.toLowerCase() === col.toLowerCase())
  );

  if (!hasAllColumns) {
    throw new Error(`Missing required columns. Required: ${requiredColumns.join(', ')}`);
  }

  return parsed.data.map((row, index) => {
    const errors: string[] = [];
    let data: StreamRow | undefined;

    // Normalize column names (case-insensitive)
    const normalizedRow: Record<string, string> = {};
    parsed.meta.fields?.forEach((field) => {
      const key = field.toLowerCase();
      normalizedRow[key] = row[field] || '';
    });

    // Check for missing fields
    requiredColumns.forEach((col) => {
      if (!normalizedRow[col] || normalizedRow[col].trim() === '') {
        errors.push(`Missing ${col}`);
      }
    });

    // Validate with Zod
    try {
      data = StreamRowSchema.parse(normalizedRow);
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error.message);
      }
    }

    return {
      raw: row,
      data,
      errors,
      rowIndex: index + 2, // +2 because index is 0-based and CSV has header
    };
  });
}

export function calculateDataQuality(parsedRows: ParsedRow[]): DataQualitySummary {
  const totalRows = parsedRows.length;
  const validRows = parsedRows.filter((row) => row.errors.length === 0).length;
  const invalidRows = totalRows - validRows;

  let missingFields = 0;
  let invalidDates = 0;
  const duplicateKeys = new Set<string>();
  const seenKeys = new Set<string>();

  parsedRows.forEach((row) => {
    // Count missing fields
    if (row.errors.some((e) => e.startsWith('Missing'))) {
      missingFields++;
    }

    // Count invalid dates
    if (row.errors.some((e) => e.includes('Date must be'))) {
      invalidDates++;
    }

    // Check duplicates (date+platform+track+country)
    if (row.data) {
      const key = `${row.data.date}|${row.data.platform}|${row.data.track}|${row.data.country}`;
      if (seenKeys.has(key)) {
        duplicateKeys.add(key);
      } else {
        seenKeys.add(key);
      }
    }
  });

  return {
    totalRows,
    validRows,
    invalidRows,
    missingFields,
    invalidDates,
    duplicateRows: duplicateKeys.size,
  };
}

export function getValidRows(parsedRows: ParsedRow[]): StreamRow[] {
  return parsedRows.filter((row) => row.errors.length === 0).map((row) => row.data!);
}

export function exportToCSV(data: StreamRow[]): string {
  const headers = ['date', 'platform', 'artist', 'track', 'country', 'streams'];
  const rows = data.map((row) => [
    row.date,
    row.platform,
    row.artist,
    row.track,
    row.country,
    row.streams.toString(),
  ]);

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
}
