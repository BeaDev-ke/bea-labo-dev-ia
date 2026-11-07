/**
 * Bibliothèque de sons et musiques libres de droits.
 *
 * Source : API publique d'Openverse (https://api.openverse.org), sans clé.
 * On ne garde que les licences qui autorisent l'usage commercial ET la
 * modification (couper, mixer) : CC0, domaine public et CC BY.
 * Pour CC BY, le crédit de l'auteur est obligatoire : il est conservé dans
 * `credit` et exporté avec le montage.
 */

export type LibraryKind = 'sound_effect' | 'music';

export interface LibrarySound {
  id: string;
  title: string;
  creator: string;
  /** Durée en secondes (arrondie). 0 si inconnue. */
  duration: number;
  /** URL directe du fichier audio. */
  url: string;
  license: string;
  /** Page d'origine du son (pour le crédit). */
  sourceUrl: string;
  kind: LibraryKind;
  /** Texte de crédit prêt à copier. */
  credit: string;
}

const ENDPOINT = 'https://api.openverse.org/v1/audio/';
const ALLOWED_LICENSES = 'cc0,pdm,by';
const PAGE_SIZE = 20;

const cache = new Map<string, LibrarySound[]>();

interface RawAudio {
  id?: string;
  title?: string;
  creator?: string | null;
  duration?: number | null;
  url?: string | null;
  license?: string;
  license_version?: string;
  foreign_landing_url?: string;
}

function licenseLabel(license?: string, version?: string): string {
  if (!license) return 'Licence inconnue';
  if (license === 'cc0') return 'CC0 (domaine public)';
  if (license === 'pdm') return 'Domaine public';
  return `CC ${license.toUpperCase()}${version ? ` ${version}` : ''}`;
}

function toSound(raw: RawAudio, kind: LibraryKind): LibrarySound | null {
  if (!raw.id || !raw.url) return null;
  // On refuse tout ce qui n'est pas servi en https (contenu mixte bloqué).
  if (!raw.url.startsWith('https://')) return null;
  const title = (raw.title || 'Sans titre').trim();
  const creator = (raw.creator || 'Auteur inconnu').trim();
  const license = licenseLabel(raw.license, raw.license_version);
  const sourceUrl = raw.foreign_landing_url || raw.url;
  return {
    id: raw.id,
    title,
    creator,
    duration: raw.duration ? Math.max(1, Math.round(raw.duration / 1000)) : 0,
    url: raw.url,
    license,
    sourceUrl,
    kind,
    credit: `« ${title} » par ${creator} — ${license} — ${sourceUrl}`,
  };
}

export async function searchLibrarySounds(
  query: string,
  kind: LibraryKind,
  signal?: AbortSignal
): Promise<LibrarySound[]> {
  const q = query.trim();
  if (!q) return [];
  const key = `${kind}|${q.toLowerCase()}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const params = new URLSearchParams({
    q,
    category: kind,
    license: ALLOWED_LICENSES,
    page_size: String(PAGE_SIZE),
  });

  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}?${params.toString()}`, { signal });
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
    throw new Error('Connexion à la bibliothèque impossible. Vérifie ta connexion internet.');
  }

  if (res.status === 429) {
    throw new Error('Trop de recherches pour le moment. Réessaie dans une minute.');
  }
  if (!res.ok) {
    throw new Error(`La bibliothèque a répondu avec une erreur (${res.status}).`);
  }

  const data = (await res.json()) as { results?: RawAudio[] };
  const sounds = (data.results || [])
    .map((r) => toSound(r, kind))
    .filter((s): s is LibrarySound => s !== null);

  cache.set(key, sounds);
  return sounds;
}

/** Texte des crédits à coller dans la description de la vidéo. */
export function buildCredits(sounds: Array<{ credit?: string }>): string {
  const lines = sounds.map((s) => s.credit).filter((c): c is string => !!c);
  if (!lines.length) return '';
  return ['Sons et musiques :', ...Array.from(new Set(lines)).map((l) => `- ${l}`)].join('\n');
}
