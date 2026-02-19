'use client';

import { StreamRow, HALFTIME_SHOW_ARTISTS } from '@/types/stream';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { parseISO, isAfter, isBefore, subDays, addDays } from 'date-fns';

interface HalftimeShowAnalysisProps {
  data: StreamRow[];
}

// Super Bowl halftime show dates (approximate - you can adjust these)
const HALFTIME_SHOW_DATES: Record<string, string> = {
  'Bad Bunny': '2023-02-12',
  'Rihanna': '2023-02-12',
  'The Weeknd': '2021-02-07',
  'Dr. Dre': '2022-02-13',
  'Snoop Dogg': '2022-02-13',
  'Eminem': '2022-02-13',
  'Usher': '2024-02-11',
  'Shakira': '2020-02-02',
  'Jennifer Lopez': '2020-02-02',
  'Beyoncé': '2013-02-03',
};

export default function HalftimeShowAnalysis({ data }: HalftimeShowAnalysisProps) {
  // Filter data for halftime show artists
  const halftimeData = data.filter((row) =>
    HALFTIME_SHOW_ARTISTS.some((artist) =>
      row.artist.toLowerCase().includes(artist.toLowerCase())
    )
  );

  if (halftimeData.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--chart-border)] p-6 bg-[var(--chart-bg)]">
        <h2 className="sc-h2 text-[var(--chart-title)] mb-4">Halftime Show Impact Analysis</h2>
        <p className="text-[var(--chart-muted)]">No data found for halftime show performers.</p>
      </div>
    );
  }

  // Calculate pre/post show metrics for each artist
  const artistMetrics = HALFTIME_SHOW_ARTISTS.map((artist) => {
    const artistRows = halftimeData.filter((row) =>
      row.artist.toLowerCase().includes(artist.toLowerCase())
    );

    if (artistRows.length === 0) return null;

    const showDate = HALFTIME_SHOW_DATES[artist];
    if (!showDate) return null;

    const showDateObj = parseISO(showDate);
    const prePeriodStart = subDays(showDateObj, 30);
    const postPeriodEnd = addDays(showDateObj, 30);

    const preShow = artistRows.filter((row) => {
      const rowDate = parseISO(row.date);
      return isAfter(rowDate, prePeriodStart) && isBefore(rowDate, showDateObj);
    });

    const postShow = artistRows.filter((row) => {
      const rowDate = parseISO(row.date);
      return isAfter(rowDate, showDateObj) && isBefore(rowDate, postPeriodEnd);
    });

    const preShowStreams = preShow.reduce((sum, row) => sum + row.streams, 0);
    const postShowStreams = postShow.reduce((sum, row) => sum + row.streams, 0);
    const avgPreShow = preShow.length > 0 ? preShowStreams / preShow.length : 0;
    const avgPostShow = postShow.length > 0 ? postShowStreams / postShow.length : 0;
    const changePercent =
      avgPreShow > 0 ? ((avgPostShow - avgPreShow) / avgPreShow) * 100 : 0;

    return {
      artist,
      preShowStreams,
      postShowStreams,
      avgPreShow: Math.round(avgPreShow),
      avgPostShow: Math.round(avgPostShow),
      changePercent: Math.round(changePercent),
      hasIncrease: changePercent > 0,
    };
  }).filter((m): m is NonNullable<typeof m> => m !== null);

  const artistsWithIncrease = artistMetrics.filter((m) => m.hasIncrease);
  const artistsWithDecrease = artistMetrics.filter((m) => !m.hasIncrease);

  const comparisonData = artistMetrics.map((m) => ({
    artist: m.artist,
    'Pre-Show (30 days)': m.avgPreShow,
    'Post-Show (30 days)': m.avgPostShow,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="sc-h2 text-[var(--chart-title)]">Halftime Show Impact Analysis</h2>
        <span className="text-sm text-[var(--chart-muted)]">
          Comparing 30 days before vs. 30 days after show
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[var(--chart-border)] p-4 bg-[rgba(34,197,94,0.12)]">
          <div className="text-sm font-medium text-[#86efac] mb-1">Artists with Increase</div>
          <div className="text-2xl font-bold text-[var(--chart-title)]">{artistsWithIncrease.length}</div>
        </div>
        <div className="rounded-xl border border-[var(--chart-border)] p-4 bg-[rgba(239,68,68,0.12)]">
          <div className="text-sm font-medium text-[#fca5a5] mb-1">Artists with Decrease</div>
          <div className="text-2xl font-bold text-[var(--chart-title)]">{artistsWithDecrease.length}</div>
        </div>
        <div className="rounded-xl border border-[var(--chart-border)] p-4 bg-[rgba(59,130,246,0.12)]">
          <div className="text-sm font-medium text-[#93c5fd] mb-1">Total Artists Analyzed</div>
          <div className="text-2xl font-bold text-[var(--chart-title)]">{artistMetrics.length}</div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="rounded-xl border border-[var(--chart-border)] p-6 bg-[var(--chart-bg)]">
        <h3 className="text-lg font-medium mb-4 text-[var(--chart-title)]">
          Average Daily Streams: Pre-Show vs Post-Show
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="artist" angle={-45} textAnchor="end" height={120} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: 'var(--sc-bg)',
                border: '1px solid var(--chart-border)',
                borderRadius: '8px',
                color: 'var(--chart-title)',
              }}
              labelStyle={{ color: 'var(--chart-muted)' }}
            />
            <Legend wrapperStyle={{ color: 'var(--chart-muted)' }} />
            <Bar dataKey="Pre-Show (30 days)" fill="var(--chart-tick)" />
            <Bar dataKey="Post-Show (30 days)" fill="var(--sc-gold)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="rounded-xl border border-[var(--chart-border)] p-6 bg-[var(--chart-bg)]">
        <h3 className="text-lg font-medium mb-4 text-[var(--chart-title)]">Detailed Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-[var(--chart-border)] rounded-xl overflow-hidden">
            <thead style={{ background: 'var(--chart-bg)' }}>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-[var(--chart-title)]">Artist</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-[var(--chart-title)]">Pre-Show Avg</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-[var(--chart-title)]">Post-Show Avg</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-[var(--chart-title)]">Change %</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-[var(--chart-title)]">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--chart-border)]">
              {artistMetrics.map((m) => (
                <tr key={m.artist} className="hover:opacity-90">
                  <td className="px-4 py-2 text-sm font-medium text-[var(--chart-title)]">{m.artist}</td>
                  <td className="px-4 py-2 text-sm text-right text-[var(--chart-muted)]">
                    {m.avgPreShow.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-right text-[var(--chart-muted)]">
                    {m.avgPostShow.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-2 text-sm text-right font-medium ${
                      m.hasIncrease ? 'text-[#86efac]' : 'text-[#fca5a5]'
                    }`}
                  >
                    {m.hasIncrease ? '+' : ''}
                    {m.changePercent}%
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        m.hasIncrease
                          ? 'bg-[rgba(34,197,94,0.2)] text-[#86efac]'
                          : 'bg-[rgba(239,68,68,0.2)] text-[#fca5a5]'
                      }`}
                    >
                      {m.hasIncrease ? '↑ Increase' : '↓ Decrease'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
