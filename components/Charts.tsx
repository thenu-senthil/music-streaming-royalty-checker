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

  // Top 10 countries
  const countryStreams = data.reduce((acc, row) => {
    acc[row.country] = (acc[row.country] || 0) + row.streams;
    return acc;
  }, {} as Record<string, number>);

  const topCountries = Object.entries(countryStreams)
    .map(([country, streams]) => ({ country, streams }))
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10)
    .reverse();

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Streams by Platform */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Total Streams by Platform</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="streams" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 Tracks */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Top 10 Tracks by Streams</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topTracks} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="track" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="streams" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Streams Over Time */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Streams Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="streams" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 Countries */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Top 10 Countries by Streams</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCountries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="streams" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
