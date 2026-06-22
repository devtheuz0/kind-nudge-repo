import { Loader2, Music2, Pause, Play, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { searchTracks } from "@/lib/itunes";
import { useBuilder, type MusicTrack } from "@/lib/builder-store";
import { cn } from "@/lib/utils";

export function MusicSearch() {
  const music = useBuilder((s) => s.music);
  const setMusic = useBuilder((s) => s.setMusic);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await searchTracks(q, ctrl.signal);
        setResults(r);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [q]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = (track: MusicTrack) => {
    if (!audioRef.current) audioRef.current = new Audio();
    if (playingId === track.id) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current.src = track.previewUrl;
    audioRef.current.play().catch(() => {});
    setPlayingId(track.id);
    audioRef.current.onended = () => setPlayingId(null);
  };

  return (
    <div className="space-y-3">
      {music ? (
        <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-3">
          <img src={music.artwork} alt="" className="h-12 w-12 rounded-md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{music.title}</p>
            <p className="truncate text-xs text-muted-foreground">{music.artist}</p>
          </div>
          <button
            onClick={() => toggle(music)}
            className="rounded-full bg-primary p-2 text-primary-foreground"
            aria-label="Tocar prévia"
          >
            {playingId === music.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => {
              audioRef.current?.pause();
              setPlayingId(null);
              setMusic(null);
            }}
            className="rounded-full p-2 text-muted-foreground hover:bg-card"
            aria-label="Remover música"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar música (ex: Djavan Oceano)"
            className="memora-input pl-10"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      )}

      {!music && results.length > 0 && (
        <ul className="max-h-72 space-y-1.5 overflow-y-auto rounded-xl border border-border bg-card/60 p-2">
          {results.map((track) => (
            <li
              key={track.id}
              className={cn(
                "flex items-center gap-3 rounded-lg p-2 transition hover:bg-primary/10",
              )}
            >
              <img src={track.artwork} alt="" className="h-11 w-11 rounded-md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{track.title}</p>
                <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
              </div>
              <button
                onClick={() => toggle(track)}
                className="rounded-full bg-card p-2 hover:bg-primary/20"
                aria-label="Prévia"
              >
                {playingId === track.id ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={() => {
                  audioRef.current?.pause();
                  setPlayingId(null);
                  setMusic(track);
                }}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Escolher
              </button>
            </li>
          ))}
        </ul>
      )}

      {!music && !loading && q && results.length === 0 && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Music2 className="h-3.5 w-3.5" /> Nada encontrado para "{q}"
        </p>
      )}
    </div>
  );
}
