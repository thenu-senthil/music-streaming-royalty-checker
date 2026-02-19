'use client';

import { StreamRow } from '@/types/stream';
import { BAY_AREA_ARTISTS } from './BayAreaLegends';

interface ArtistSpotlightProps {
  data: StreamRow[];
}

function matchArtist(csvArtist: string, artist: (typeof BAY_AREA_ARTISTS)[number]) {
  const lowered = csvArtist.toLowerCase();
  return artist.csvMatch.some((m) => lowered.includes(m.toLowerCase()));
}

export default function ArtistSpotlight({ data }: ArtistSpotlightProps) {
  const artistStats = BAY_AREA_ARTISTS.map((artist) => {
    const rows = data.filter((row) => matchArtist(row.artist, artist));
    const totalStreams = rows.reduce((sum, r) => sum + r.streams, 0);
    const topTracks = rows.reduce((acc, row) => {
      acc[row.track] = (acc[row.track] || 0) + row.streams;
      return acc;
    }, {} as Record<string, number>);
    const top = Object.entries(topTracks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { artist, totalStreams, topTracksList: top };
  });

  return (
    <div className="space-y-6" id="artist-spotlight">
      <h2 className="sc-h2">Bay Area Legends</h2>
      <p className="sc-muted text-sm">
        Click a legend above to jump to their profile. Data below reflects your uploaded CSV when
        available.
      </p>

      <div className="space-y-8">
        {artistStats.map(({ artist, totalStreams, topTracksList }) => (
          <section
            key={artist.id}
            id={`artist-${artist.id}`}
            className="sc-card sc-card-pad scroll-mt-24"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="shrink-0">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[rgba(212,175,55,0.4)] to-[rgba(244,215,123,0.9)]" />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <h3 className="sc-h3 text-[color:var(--sc-text)]">{artist.name}</h3>
                <p className="sc-muted text-sm leading-relaxed">{artist.bio}</p>
                {totalStreams > 0 ? (
                  <div className="pt-2">
                    <p className="text-sm text-[color:var(--sc-text)]">
                      <span className="font-semibold text-[color:var(--sc-gold)]">
                        {totalStreams.toLocaleString()}
                      </span>{' '}
                      streams in your data
                    </p>
                    {topTracksList.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm sc-muted">
                        <li className="font-medium text-[color:var(--sc-text)]">Top tracks:</li>
                        {topTracksList.map(([track, streams]) => (
                          <li key={track}>
                            {track} — {streams.toLocaleString()} streams
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <p className="text-sm sc-muted">
                    No streaming data for this artist in your file. Load the sample CSV or upload
                    data that includes {artist.name}.
                  </p>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
