import { z } from 'zod';

export const StreamRowSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  platform: z.string().min(1, 'Platform is required'),
  artist: z.string().min(1, 'Artist is required'),
  track: z.string().min(1, 'Track is required'),
  country: z.string().min(1, 'Country is required'),
  streams: z.string().transform((val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) {
      throw new Error('Streams must be a non-negative integer');
    }
    return num;
  }),
});

export type StreamRow = z.infer<typeof StreamRowSchema>;

export interface ParsedRow {
  raw: Record<string, string>;
  data?: StreamRow;
  errors: string[];
  rowIndex: number;
}

export interface DataQualitySummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  missingFields: number;
  invalidDates: number;
  duplicateRows: number;
}

export interface PlatformRate {
  platform: string;
  rate: number;
}

export const HALFTIME_SHOW_ARTISTS = [
  'Bad Bunny',
  'Rihanna',
  'The Weeknd',
  'Dr. Dre',
  'Snoop Dogg',
  'Eminem',
  'Usher',
  'Shakira',
  'Jennifer Lopez',
  'Beyoncé',
  'E40',
  'Knxwledge',
  'Pusha T',
  'Kanye West',
  'ASAP Rocky',
  'Lorde',
];
