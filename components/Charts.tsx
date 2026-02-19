'use client';

import { StreamRow } from '@/types/stream';
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
import { format, parseISO } from 'date-fns';

interface ChartsProps {
  data: StreamRow[];
}

export default function Charts({ data }: ChartsProps) {
  // Total streams by platform
  const platformStreams = data.reduce((acc, row) => {
    acc[row.platform] = (acc[row.platform] || 0) + row.streams;
    return acc;
  }, {} as Record<string, number>);

  const platformData = Object.entries(platformStreams)
    .map(([platform, streams]) => ({ platform, streams }))
    .sort((a, b) => b.streams - a.streams);

  // Top 10 tracks
  const trackStreams = data.reduce((acc, row) => {
    const key = `${row.artist} - ${row.track}`;
    acc[key] = (acc[key] || 0) + row.streams;
    return acc;
  }, {} as Record<string, number>);

  const topTracks = Object.entries(trackStreams)
    .map(([track, streams]) => ({ track, streams }))
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10)
    .reverse(); // Reverse for better bar chart display

  // Streams over time (grouped by day)
  const dailyStreams = data.reduce((acc, row) => {
    acc[row.date] = (acc[row.date] || 0) + row.streams;
    return acc;
  }, {} as Record<string, number>);

  const timeSeriesData = Object.entries(dailyStreams)
    .map(([date, streams]) => ({
      date: format(parseISO(date), 'MMM dd'),
      streams,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartTitleClass = 'text-lg font-medium mb-4';
  const chartCardClass =
    'p-6 rounded-xl border bg-[var(--chart-bg)] border-[var(--chart-border)]';

  return (
    <div className="space-y-8">
      <h2 className="sc-h2 text-[var(--chart-title)]">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Streams by Platform */}
        <div className={chartCardClass}>
          <h3 className={`${chartTitleClass} text-[var(--chart-title)]`}>
            Total Streams by Platform
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="platform" tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} />
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
              <Bar dataKey="streams" fill="var(--sc-gold)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 Tracks */}
        <div className={chartCardClass}>
          <h3 className={`${chartTitleClass} text-[var(--chart-title)]`}>
            Top 10 Tracks by Streams
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topTracks} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis type="number" tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} />
              <YAxis dataKey="track" type="category" width={150} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} />
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
              <Bar dataKey="streams" fill="var(--sc-gold-2)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Streams Over Time */}
        <div className={`${chartCardClass} lg:col-span-2`}>
          <h3 className={`${chartTitleClass} text-[var(--chart-title)]`}>
            Streams Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--chart-tick)', fontSize: 12 }} />
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
              <Line type="monotone" dataKey="streams" stroke="var(--sc-gold)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
