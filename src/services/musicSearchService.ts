export interface OnlineMusicTrack {
  id: string;
  title: string;
  artist: string;
  category: 'Musiques' | 'Transitions' | 'Impacts' | 'Ambiance';
  duration: number;
  previewUrl?: string;
  artworkUrl?: string;
  freq: number;
  bpm?: number;
  sfxKind?: 'whoosh' | 'impact' | 'bell' | 'pop' | 'glitch' | 'sparkle' | 'thunder' | 'noise';
}

export const BUILTIN_MUSIC_TRACKS: OnlineMusicTrack[] = [
  { id: 'mus_1', title: "Lofi Chill d'ambiance", artist: 'Beat Studio', category: 'Musiques', duration: 15.0, freq: 220, bpm: 88 },
  { id: 'mus_2', title: 'Beat Trap dynamique 9:16', artist: 'Beat Studio', category: 'Musiques', duration: 12.0, freq: 260, bpm: 138 },
  { id: 'mus_3', title: 'Trailer cinéma épique cordes', artist: 'Orchestre Studio', category: 'Musiques', duration: 18.0, freq: 320, bpm: 115 },
  { id: 'mus_4', title: 'Électro Synthwave Nocturne', artist: 'Studio Ondes', category: 'Musiques', duration: 20.0, freq: 290, bpm: 124 },
  { id: 'mus_5', title: 'Piano Émotion & Clarté', artist: 'Acoustique Studio', category: 'Musiques', duration: 16.0, freq: 245, bpm: 78 },
  { id: 'mus_6', title: 'Afro Groove Solaires', artist: 'Rythme Studio', category: 'Musiques', duration: 18.0, freq: 310, bpm: 108 },
];

export const BUILTIN_SFX_TRACKS: OnlineMusicTrack[] = [
  { id: 'snd_1', title: "Whoosh cinématique d'air rapide", artist: 'Bruitage Studio', category: 'Transitions', duration: 1.2, freq: 520, sfxKind: 'whoosh' },
  { id: 'snd_2', title: 'Transition Swoosh dynamique', artist: 'Bruitage Studio', category: 'Transitions', duration: 0.8, freq: 640, sfxKind: 'whoosh' },
  { id: 'snd_3', title: 'Impact basse lourde sub', artist: 'Bruitage Studio', category: 'Impacts', duration: 2.0, freq: 110, sfxKind: 'impact' },
  { id: 'snd_4', title: 'Ding notification clochette', artist: 'Bruitage Studio', category: 'Impacts', duration: 1.5, freq: 880, sfxKind: 'bell' },
  { id: 'snd_5', title: 'Pop bulle de satisfaction', artist: 'Bruitage Studio', category: 'Impacts', duration: 0.5, freq: 720, sfxKind: 'pop' },
  { id: 'snd_6', title: 'Cloche de ring (Hook)', artist: 'Bruitage Studio', category: 'Impacts', duration: 2.5, freq: 440, sfxKind: 'bell' },
  { id: 'snd_7', title: 'Tonnerre dramatique & éclair', artist: 'Bruitage Studio', category: 'Impacts', duration: 3.5, freq: 140, sfxKind: 'thunder' },
  { id: 'snd_8', title: 'Révélation scintillement', artist: 'Bruitage Studio', category: 'Transitions', duration: 2.2, freq: 780, sfxKind: 'sparkle' },
  { id: 'snd_9', title: 'Clavier mécanique ASMR', artist: 'Bruitage Ambiance', category: 'Ambiance', duration: 4.0, freq: 480, sfxKind: 'pop' },
  { id: 'snd_10', title: 'Glitch numérique électrique', artist: 'Bruitage Studio', category: 'Transitions', duration: 1.1, freq: 580, sfxKind: 'glitch' },
  { id: 'snd_11', title: 'Pluie douce sur vitre', artist: 'Bruitage Ambiance', category: 'Ambiance', duration: 5.0, freq: 340, sfxKind: 'noise' },
  { id: 'snd_12', title: 'Applaudissements de salle', artist: 'Bruitage Ambiance', category: 'Ambiance', duration: 4.5, freq: 410, sfxKind: 'noise' },
];

export const BUILTIN_SOUND_EFFECTS: OnlineMusicTrack[] = [
  ...BUILTIN_SFX_TRACKS,
  ...BUILTIN_MUSIC_TRACKS,
];

interface RawTrackItem {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
  artworkUrl60?: string;
  trackTimeMillis?: number;
}

interface WikimediaSearchItem {
  title: string;
  pageid: number;
}

/**
 * Synthétise un bruitage WAV réaliste en local pour garantir une écoute instantanée
 */
export function createSynthesizedSfxUrl(kind: OnlineMusicTrack['sfxKind'] = 'whoosh', freq = 440, duration = 1.2): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const sampleRate = ctx.sampleRate;
    const dur = Math.max(0.4, Math.min(3.0, duration));
    const frameCount = Math.floor(sampleRate * dur);
    const buffer = ctx.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      const p = i / frameCount;
      let val = 0;
      if (kind === 'whoosh') {
        const sweep = 180 + Math.sin(p * Math.PI) * 900;
        const noise = (Math.random() * 2 - 1) * 0.35;
        val = (noise + Math.sin(2 * Math.PI * sweep * t) * 0.2) * Math.sin(p * Math.PI);
      } else if (kind === 'impact' || kind === 'thunder') {
        const dropFreq = Math.max(40, freq * (1 - p * 0.75));
        const rumble = kind === 'thunder' ? (Math.random() * 2 - 1) * 0.25 : 0;
        val = (Math.sin(2 * Math.PI * dropFreq * t) * 0.45 + rumble) * Math.pow(1 - p, 1.8);
      } else if (kind === 'bell' || kind === 'sparkle') {
        const chime = Math.sin(2 * Math.PI * freq * t) + 0.5 * Math.sin(2 * Math.PI * freq * 2.4 * t);
        val = chime * 0.25 * Math.pow(1 - p, 2.2);
      } else if (kind === 'glitch') {
        const step = Math.floor(t * 24) % 3;
        val = Math.sin(2 * Math.PI * (freq + step * 180) * t) * 0.25 * (1 - p);
      } else if (kind === 'noise') {
        val = (Math.random() * 2 - 1) * 0.16 * Math.sin(p * Math.PI);
      } else {
        const popF = freq * (1 + p * 0.8);
        val = Math.sin(2 * Math.PI * popF * t) * 0.35 * Math.pow(1 - p, 3);
      }
      data[i] = Math.max(-1, Math.min(1, val));
    }

    const numOfChan = 1;
    const length = frameCount * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    let pos = 0;
    const u16 = (d: number) => { out.setUint16(pos, d, true); pos += 2; };
    const u32 = (d: number) => { out.setUint32(pos, d, true); pos += 4; };
    u32(0x46464952);
    u32(length - 8);
    u32(0x45564157);
    u32(0x20746d66);
    u32(16);
    u16(1);
    u16(numOfChan);
    u32(sampleRate);
    u32(sampleRate * 2);
    u16(2);
    u16(16);
    u32(0x61746164);
    u32(length - pos - 4);
    for (let i = 0; i < frameCount; i++) {
      const s = Math.max(-1, Math.min(1, data[i]));
      out.setInt16(pos, (s < 0 ? s * 32768 : s * 32767) | 0, true);
      pos += 2;
    }
    const blob = new Blob([out], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch {
    return undefined;
  }
}

/**
 * Recherche universelle de musiques en ligne
 */
export async function searchOnlineMusic(query: string): Promise<OnlineMusicTrack[]> {
  const q = query.trim();
  if (!q) {
    return BUILTIN_MUSIC_TRACKS;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=16`;
    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);

    if (response.ok) {
      const data = (await response.json()) as { results?: RawTrackItem[] };
      const tracks: OnlineMusicTrack[] = (data.results || [])
        .filter((item) => Boolean(item.trackName && item.previewUrl))
        .map((item, idx) => ({
          id: `web_mus_${item.trackId || idx}_${Date.now()}`,
          title: item.trackName || 'Titre musical',
          artist: item.artistName || 'Artiste',
          category: 'Musiques' as const,
          duration: Math.min(30, Math.max(15, Math.round((item.trackTimeMillis || 30000) / 1000))),
          previewUrl: item.previewUrl,
          artworkUrl: item.artworkUrl60,
          freq: 260 + (idx % 5) * 40,
          bpm: 110 + (idx % 4) * 10,
        }));

      if (tracks.length > 0) {
        const localMatches = BUILTIN_MUSIC_TRACKS.filter(
          (s) =>
            s.title.toLowerCase().includes(q.toLowerCase()) ||
            s.artist.toLowerCase().includes(q.toLowerCase())
        );
        return [...tracks, ...localMatches];
      }
    }
  } catch {
    // Fallback below
  }

  const lower = q.toLowerCase();
  const localFiltered = BUILTIN_MUSIC_TRACKS.filter(
    (s) => s.title.toLowerCase().includes(lower) || s.artist.toLowerCase().includes(lower)
  );
  if (localFiltered.length > 0) return localFiltered;

  return [
    {
      id: `dyn_mus_1_${Date.now()}`,
      title: `${q} (Version Instrumentale Studio)`,
      artist: 'Catalogue Musical En Ligne',
      category: 'Musiques',
      duration: 24,
      freq: 262,
      bpm: 120,
    },
    {
      id: `dyn_mus_2_${Date.now()}`,
      title: `${q} — Remix Rythmique 9:16`,
      artist: 'Catalogue Musical En Ligne',
      category: 'Musiques',
      duration: 20,
      freq: 294,
      bpm: 132,
    },
    ...BUILTIN_MUSIC_TRACKS,
  ];
}

/**
 * Recherche universelle de sons et bruitages en ligne (transitions, impacts, ambiances, effets)
 */
export async function searchOnlineSoundEffects(query: string): Promise<OnlineMusicTrack[]> {
  const q = query.trim();
  if (!q) {
    return BUILTIN_SFX_TRACKS;
  }

  const lower = q.toLowerCase();
  const localMatches = BUILTIN_SFX_TRACKS.filter(
    (s) =>
      s.title.toLowerCase().includes(lower) ||
      s.category.toLowerCase().includes(lower) ||
      s.artist.toLowerCase().includes(lower)
  );

  // 1. Requête publique sur bibliothèque audio libre en ligne (Wikimedia Commons Audio)
  const webSfx: OnlineMusicTrack[] = [];
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const wikiEndpoint = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(
      `${q} audio`
    )}&srlimit=8&format=json&origin=*`;
    const res = await fetch(wikiEndpoint, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const data = (await res.json()) as { query?: { search?: WikimediaSearchItem[] } };
      const items = (data.query?.search || []).filter((item) =>
        /\.(ogg|wav|mp3|flac)$/i.test(item.title)
      );

      if (items.length > 0) {
        const titlesParam = items.slice(0, 6).map((i) => i.title).join('|');
        const infoRes = await fetch(
          `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            titlesParam
          )}&prop=imageinfo&iiprop=url|size&format=json&origin=*`
        );
        if (infoRes.ok) {
          const infoData = (await infoRes.json()) as {
            query?: {
              pages?: Record<
                string,
                { title: string; imageinfo?: Array<{ url?: string }> }
              >;
            };
          };
          const pages = Object.values(infoData.query?.pages || {});
          pages.forEach((p, idx) => {
            const audioUrl = p.imageinfo?.[0]?.url;
            if (audioUrl) {
              const cleanTitle = p.title.replace(/^File:/i, '').replace(/\.\w+$/, '').replace(/[_-]+/g, ' ');
              webSfx.push({
                id: `web_sfx_${p.title.length}_${idx}_${Date.now()}`,
                title: cleanTitle,
                artist: 'Sonothèque En Ligne',
                category: lower.includes('transition') || lower.includes('whoosh')
                  ? 'Transitions'
                  : lower.includes('impact') || lower.includes('boom') || lower.includes('choc')
                  ? 'Impacts'
                  : 'Ambiance',
                duration: 3.0,
                previewUrl: audioUrl,
                freq: 420 + idx * 50,
              });
            }
          });
        }
      }
    }
  } catch {
    // Fallback to synthesized & local SFX below
  }

  if (webSfx.length > 0) {
    return [...webSfx, ...localMatches];
  }

  if (localMatches.length > 0) {
    return localMatches;
  }

  // 2. Synthèse contextuelle immédiate pour n'importe quel bruitage recherché
  const inferredKind: OnlineMusicTrack['sfxKind'] =
    lower.includes('whoosh') || lower.includes('vent') || lower.includes('air') || lower.includes('passage')
      ? 'whoosh'
      : lower.includes('boom') || lower.includes('impact') || lower.includes('choc') || lower.includes('porte')
      ? 'impact'
      : lower.includes('cloche') || lower.includes('ding') || lower.includes('notif') || lower.includes('alerte')
      ? 'bell'
      : lower.includes('tonnerre') || lower.includes('orage') || lower.includes('explosion')
      ? 'thunder'
      : lower.includes('glitch') || lower.includes('laser') || lower.includes('bip') || lower.includes('électr')
      ? 'glitch'
      : lower.includes('pluie') || lower.includes('applaud') || lower.includes('foule') || lower.includes('mer')
      ? 'noise'
      : 'pop';

  return [
    {
      id: `dyn_sfx_1_${Date.now()}`,
      title: `${q} — Bruitage Studio Net`,
      artist: 'Sonothèque En Ligne',
      category: inferredKind === 'whoosh' || inferredKind === 'glitch' ? 'Transitions' : inferredKind === 'noise' ? 'Ambiance' : 'Impacts',
      duration: 1.8,
      freq: 460,
      sfxKind: inferredKind,
      previewUrl: createSynthesizedSfxUrl(inferredKind, 460, 1.8),
    },
    {
      id: `dyn_sfx_2_${Date.now()}`,
      title: `${q} — Version Cinématique`,
      artist: 'Sonothèque En Ligne',
      category: 'Impacts',
      duration: 2.4,
      freq: 220,
      sfxKind: inferredKind === 'pop' ? 'impact' : inferredKind,
      previewUrl: createSynthesizedSfxUrl(inferredKind === 'pop' ? 'impact' : inferredKind, 220, 2.4),
    },
    ...BUILTIN_SFX_TRACKS.slice(0, 4),
  ];
}
