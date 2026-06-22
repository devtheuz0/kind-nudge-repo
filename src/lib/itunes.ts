import type { MusicTrack } from "./builder-store";

type ItunesResult = {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
};

export async function searchTracks(query: string, signal?: AbortSignal): Promise<MusicTrack[]> {
  const q = query.trim();
  if (!q) return [];
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=12`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Falha na busca");
  const data = (await res.json()) as { results: ItunesResult[] };
  return data.results
    .filter((r) => r.previewUrl)
    .map((r) => ({
      id: String(r.trackId),
      title: r.trackName,
      artist: r.artistName,
      artwork: r.artworkUrl100.replace("100x100", "300x300"),
      previewUrl: r.previewUrl,
    }));
}
