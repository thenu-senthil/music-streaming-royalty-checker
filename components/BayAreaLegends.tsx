'use client';

const BAY_AREA_ARTISTS = [
  {
    id: 'e40',
    name: 'E-40',
    csvMatch: ['E40', 'E-40'],
    bio: 'Earl Stevens, better known as E-40, is a rapper, entrepreneur, and record executive from Vallejo, California. A pioneer of the hyphy movement and Bay Area slang, he has released over two dozen albums since the early 1990s. His hits include "Function," "Choices," and "U and Dat." He founded Sick Wid It Records and remains one of hip-hop\'s most prolific independent artists.',
  },
  {
    id: 'too-short',
    name: 'Too Short',
    csvMatch: ['Too Short'],
    bio: 'Todd Anthony Shaw, known as Too $hort, is a rapper and producer from Oakland. He began recording in the mid-1980s and helped put West Coast rap on the map with explicit, street-focused rhymes. Classics include "Freaky Tales," "Life Is... Too Short," and "Gettin\' It." He is considered one of the founding fathers of Oakland hip-hop.',
  },
  {
    id: 'mac-dre',
    name: 'Mac Dre',
    csvMatch: ['Mac Dre'],
    bio: 'Andre Louis Hicks, better known as Mac Dre, was a rapper, producer, and label head from Vallejo. A central figure in the Bay Area\'s hyphy and "thizz" culture, he founded Thizz Entertainment. Hits like "Feeling Myself," "Thizzle Dance," and "Get Stupid" defined a generation. His legacy continues to influence Bay Area rap long after his passing.',
  },
  {
    id: 'keak-da-sneak',
    name: 'Keak da Sneak',
    csvMatch: ['Keak da Sneak'],
    bio: 'Charles Kente Williams, known as Keak da Sneak, is a rapper from Oakland and a key architect of the hyphy sound. He popularized terms like "hyphy" and "go dumb" and collaborated with E-40 on hits such as "Tell Me When to Go." Known for his distinctive growl and energetic delivery, he has been a Bay Area staple since the late 1990s.',
  },
  {
    id: 'richie-rich',
    name: 'Richie Rich',
    csvMatch: ['Richie Rich'],
    bio: 'Richie Rich is a rapper from Oakland who rose to prominence in the early 1990s as part of the Dangerous Crew. He collaborated with artists like Too $hort and Ant Banks and released albums such as "Seasoned Veteran" and "Half Thang." He remains an important voice in the Oakland hip-hop community.',
  },
] as const;

interface BayAreaLegendsProps {
  artistData?: { artist: string; streams: number; track: string }[];
}

export default function BayAreaLegends({ artistData = [] }: BayAreaLegendsProps) {
  const scrollToArtist = (id: string) => {
    document.getElementById(`artist-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {BAY_AREA_ARTISTS.map((artist) => (
        <button
          key={artist.id}
          type="button"
          onClick={() => scrollToArtist(artist.id)}
          className="flex items-center gap-2 rounded-full border border-[color:var(--sc-border)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs transition-colors hover:border-[color:var(--sc-gold)] hover:bg-[rgba(212,175,55,0.08)] sc-muted"
        >
          <span className="inline-block h-6 w-6 shrink-0 rounded-full bg-gradient-to-tr from-[rgba(212,175,55,0.35)] to-[rgba(244,215,123,0.8)]" />
          <span className="font-medium text-[color:var(--sc-text)]">{artist.name}</span>
          <span className="uppercase tracking-wide text-[0.6rem] text-[color:var(--sc-muted)]">
            Bay Area
          </span>
        </button>
      ))}
    </div>
  );
}

export { BAY_AREA_ARTISTS };
