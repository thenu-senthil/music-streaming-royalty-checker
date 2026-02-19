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
        <h2 className="text-xl font-semibold">Royalty Estimator</h2>
        <span className="text-sm text-gray-500 italic">*Estimated values only</span>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> These are estimated royalties based on typical payout rates per stream. 
          Actual rates vary by platform, subscription tier, and region. This is for illustrative purposes only.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Payout Rates (per stream)</h3>
        <div className="space-y-3">
          {rates.map((rateConfig) => (
            <div key={rateConfig.platform} className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{rateConfig.platform}:</label>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm">$</span>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={rateConfig.rate}
                  onChange={(e) =>
                    handleRateChange(rateConfig.platform, parseFloat(e.target.value) || 0)
                  }
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-sm text-gray-600">per stream</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Estimated Royalties</h3>
        <div className="space-y-3">
          {platformRoyalties.map((p) => (
            <div key={p.platform} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium">{p.platform}</span>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {p.streams.toLocaleString()} streams × ${p.rate.toFixed(3)}
                </div>
                <div className="text-lg font-bold text-green-600">
                  ${p.estimatedRoyalty.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300 mt-3">
            <span className="text-lg font-bold">Total Estimated Royalty</span>
            <span className="text-2xl font-bold text-green-600">
              ${totalRoyalty.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
