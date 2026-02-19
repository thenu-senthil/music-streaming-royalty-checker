'use client';

import { useState, useEffect } from 'react';
import { StreamRow, PlatformRate } from '@/types/stream';

interface RoyaltyEstimatorProps {
  data: StreamRow[];
}

const DEFAULT_RATES: PlatformRate[] = [
  { platform: 'Spotify', rate: 0.003 },
  { platform: 'Apple Music', rate: 0.007 },
  { platform: 'YouTube', rate: 0.001 },
  { platform: 'Amazon Music', rate: 0.004 },
  { platform: 'Tidal', rate: 0.012 },
];

export default function RoyaltyEstimator({ data }: RoyaltyEstimatorProps) {
  const [rates, setRates] = useState<PlatformRate[]>(DEFAULT_RATES);

  // Get unique platforms from data and merge with default rates
  useEffect(() => {
    const platforms = new Set(data.map((row) => row.platform));
    const existingRates = new Map(rates.map((r) => [r.platform, r.rate]));
    
    const allRates: PlatformRate[] = Array.from(platforms).map((platform) => ({
      platform,
      rate: existingRates.get(platform) || 0.003, // Default to 0.003 if not set
    }));

    setRates(allRates);
  }, [data]);

  const handleRateChange = (platform: string, newRate: number) => {
    setRates((prev) =>
      prev.map((r) => (r.platform === platform ? { ...r, rate: newRate } : r))
    );
  };

  // Calculate royalties
  const platformRoyalties = rates.map((rateConfig) => {
    const platformData = data.filter((row) => row.platform === rateConfig.platform);
    const totalStreams = platformData.reduce((sum, row) => sum + row.streams, 0);
    const estimatedRoyalty = totalStreams * rateConfig.rate;

    return {
      platform: rateConfig.platform,
      streams: totalStreams,
      rate: rateConfig.rate,
      estimatedRoyalty,
    };
  });

  const totalRoyalty = platformRoyalties.reduce((sum, p) => sum + p.estimatedRoyalty, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="sc-h2 text-[var(--chart-title)]">Royalty Estimator</h2>
        <span className="text-sm text-[var(--chart-muted)] italic">*Estimated values only</span>
      </div>

      <div className="rounded-xl border border-[var(--chart-border)] p-4 bg-[rgba(234,179,8,0.08)]">
        <p className="text-sm text-[var(--chart-title)]">
          <strong className="text-[var(--sc-gold)]">Note:</strong>{' '}
          <span className="text-[var(--chart-muted)]">
            Estimated royalties from typical payout rates per stream. Actual rates vary by platform,
            tier, and region. Illustrative only.
          </span>
        </p>
      </div>

      <div className="rounded-xl border border-[var(--chart-border)] p-6 bg-[var(--chart-bg)]">
        <h3 className="text-lg font-medium mb-4 text-[var(--chart-title)]">Payout Rates (per stream)</h3>
        <div className="space-y-3">
          {rates.map((rateConfig) => (
            <div key={rateConfig.platform} className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-[var(--chart-title)]">{rateConfig.platform}:</label>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-[var(--chart-muted)]">$</span>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={rateConfig.rate}
                  onChange={(e) =>
                    handleRateChange(rateConfig.platform, parseFloat(e.target.value) || 0)
                  }
                  className="sc-input text-[var(--chart-title)]"
                />
                <span className="text-sm text-[var(--chart-muted)]">per stream</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--chart-border)] p-6 bg-[var(--chart-bg)]">
        <h3 className="text-lg font-medium mb-4 text-[var(--chart-title)]">Estimated Royalties</h3>
        <div className="space-y-3">
          {platformRoyalties.map((p) => (
            <div key={p.platform} className="flex justify-between items-center py-2 border-b border-[var(--chart-border)]">
              <span className="font-medium text-[var(--chart-title)]">{p.platform}</span>
              <div className="text-right">
                <div className="text-sm text-[var(--chart-muted)]">
                  {p.streams.toLocaleString()} streams × ${p.rate.toFixed(3)}
                </div>
                <div className="text-lg font-bold text-[var(--sc-gold)]">
                  ${p.estimatedRoyalty.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 border-t-2 border-[var(--chart-border)] mt-3">
            <span className="text-lg font-bold text-[var(--chart-title)]">Total Estimated Royalty</span>
            <span className="text-2xl font-bold text-[var(--sc-gold)]">
              ${totalRoyalty.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
