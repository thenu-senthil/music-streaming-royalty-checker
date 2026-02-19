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
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Halftime Show Impact Analysis</h2>
        <p className="text-gray-600">No data found for halftime show performers.</p>
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
        <h2 className="text-xl font-semibold">Halftime Show Impact Analysis</h2>
        <span className="text-sm text-gray-500">
          Comparing 30 days before vs. 30 days after show
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm font-medium text-green-700 mb-1">Artists with Increase</div>
          <div className="text-2xl font-bold text-green-600">{artistsWithIncrease.length}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm font-medium text-red-700 mb-1">Artists with Decrease</div>
          <div className="text-2xl font-bold text-red-600">{artistsWithDecrease.length}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-700 mb-1">Total Artists Analyzed</div>
          <div className="text-2xl font-bold text-blue-600">{artistMetrics.length}</div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">
          Average Daily Streams: Pre-Show vs Post-Show
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="artist" angle={-45} textAnchor="end" height={120} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Pre-Show (30 days)" fill="#94a3b8" />
            <Bar dataKey="Post-Show (30 days)" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Detailed Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Artist</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                  Pre-Show Avg
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                  Post-Show Avg
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                  Change %
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {artistMetrics.map((m) => (
                <tr key={m.artist} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-medium">{m.artist}</td>
                  <td className="px-4 py-2 text-sm text-right">
                    {m.avgPreShow.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {m.avgPostShow.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-2 text-sm text-right font-medium ${
                      m.hasIncrease ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {m.hasIncrease ? '+' : ''}
                    {m.changePercent}%
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        m.hasIncrease
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
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
