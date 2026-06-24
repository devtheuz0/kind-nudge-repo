import { Loader2, Music2, Pause, Play, Search, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { searchTracks } from "@/lib/itunes";
import { useBuilder, type MusicTrack } from "@/lib/builder-store";
import { cn } from "@/lib/utils";

// Faixas brasileiras e internacionais famosas
const FAMOUS: { label: string; query: string; mood: string }[] = [
  { label: "Perfect — Ed Sheeran", query: "Ed Sheeran Perfect", mood: "Amor" },
  { label: "All of Me — John Legend", query: "John Legend All of Me", mood: "Amor" },
  { label: "A Thousand Years — Christina Perri", query: "Christina Perri Thousand Years", mood: "Casamento" },
  { label: "Make You Feel My Love — Adele", query: "Adele Make You Feel My Love", mood: "Amor" },
  { label: "Thinking Out Loud — Ed Sheeran", query: "Ed Sheeran Thinking Out Loud", mood: "Amor" },
  { label: "Can't Help Falling in Love — Elvis", query: "Elvis Presley Can't Help Falling in Love", mood: "Amor" },
  { label: "At Last — Etta James", query: "Etta James At Last", mood: "Casamento" },
  { label: "You Are the Reason — Calum Scott", query: "Calum Scott You Are the Reason", mood: "Amor" },
  { label: "Marry Me — Train", query: "Train Marry Me", mood: "Casamento" },
  { label: "Just the Way You Are — Bruno Mars", query: "Bruno Mars Just The Way You Are", mood: "Amor" },
  { label: "Detalhes — Roberto Carlos", query: "Roberto Carlos Detalhes", mood: "Amor" },
  { label: "Evidências — Chitãozinho & Xororó", query: "Chitãozinho Xororó Evidências", mood: "Amor" },
  { label: "Trem-Bala — Ana Vilela", query: "Ana Vilela Trem-Bala", mood: "Vida" },
  { label: "Tocando em Frente — Almir Sater", query: "Almir Sater Tocando em Frente", mood: "Vida" },
  { label: "Amor I Love You — Marisa Monte", query: "Marisa Monte Amor I Love You", mood: "Amor" },
  { label: "Eduardo e Mônica — Legião Urbana", query: "Legião Urbana Eduardo e Mônica", mood: "História" },
  { label: "Pais e Filhos — Legião Urbana", query: "Legião Urbana Pais e Filhos", mood: "Família" },
  { label: "Anunciação — Alceu Valença", query: "Alceu Valença Anunciação", mood: "Brasil" },
  { label: "Oceano — Djavan", query: "Djavan Oceano", mood: "Sonho" },
  { label: "Velha Infância — Tribalistas", query: "Tribalistas Velha Infância", mood: "Amizade" },
  { label: "Wonderful Tonight — Eric Clapton", query: "Eric Clapton Wonderful Tonight", mood: "Amor" },
  { label: "Stand By Me — Ben E. King", query: "Ben E. King Stand By Me", mood: "Amizade" },
  { label: "Here Comes The Sun — Beatles", query: "Beatles Here Comes The Sun", mood: "Alegria" },
  { label: "What a Wonderful World — Armstrong", query: "Louis Armstrong Wonderful World", mood: "Vida" },
  { label: "See You Again — Wiz Khalifa", query: "Wiz Khalifa See You Again", mood: "Saudade" },
  { label: "Tears in Heaven — Eric Clapton", query: "Eric Clapton Tears in Heaven", mood: "Saudade" },
  { label: "Like I'm Gonna Lose You — Meghan Trainor", query: "Meghan Trainor Like I'm Gonna Lose You", mood: "Família" },
  { label: "Happy — Pharrell Williams", query: "Pharrell Williams Happy", mood: "Festa" },
  { label: "Parabéns Pra Você", query: "Parabéns Pra Você", mood: "Aniversário" },
  { label: "Mais que Nada — Sergio Mendes", query: "Sergio Mendes Mais Que Nada", mood: "Festa" },
  { label: "Garota de Ipanema — Tom Jobim", query: "Tom Jobim Garota de Ipanema", mood: "Bossa" },
  { label: "Photograph — Ed Sheeran", query: "Ed Sheeran Photograph", mood: "Nostalgia" },
  { label: "I Will Always Love You — Whitney", query: "Whitney Houston I Will Always Love You", mood: "Amor" },
  { label: "Sweet Child O' Mine — Guns N' Roses", query: "Guns N Roses Sweet Child O Mine", mood: "Rock" },
];

export function MusicSearch() {
  const music = useBuilder((s) => s.music);
  const setMusic = useBuilder((s) => s.setMusic);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await searchTracks(q, ctrl.signal);
        setResults(r);
      } catch {}
      finally { setLoading(false); }
    }, 400);
    return () => { ctrl.abort(); clearTimeout(t); };
  }, [q]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = (track: MusicTrack) => {
    if (!audioRef.current) audioRef.current = new Audio();
    if (playingId === track.id) { audioRef.current.pause(); setPlayingId(null); return; }
    audioRef.current.src = track.previewUrl;
    audioRef.current.play().catch(() => {});
    setPlayingId(track.id);
    audioRef.current.onended = () => setPlayingId(null);
  };

  if (music) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-3">
        <img src={music.artwork} alt="" className="h-12 w-12 rounded-md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{music.title}</p>
          <p className="truncate text-xs text-muted-foreground">{music.artist}</p>
        </div>
        <button onClick={() => toggle(music)} className="rounded-full bg-primary p-2 text-primary-foreground" aria-label="Tocar prévia">
          {playingId === music.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button onClick={() => { audioRef.current?.pause(); setPlayingId(null); setMusic(null); }} className="rounded-full p-2 text-muted-foreground hover:bg-card" aria-label="Remover música">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ex: Ed Sheeran - Perfect, Roberto Carlos…"
          className="memora-input pl-10"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
      </div>

      {!q && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Mais escolhidas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {FAMOUS.map((f) => (
              <button
                key={f.query}
                onClick={() => setQ(f.query)}
                className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-[11px] font-medium text-cream/80 transition hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <ul className="max-h-72 space-y-1.5 overflow-y-auto rounded-xl border border-border bg-card/60 p-2">
          {results.map((track) => (
            <li key={track.id} className={cn("flex items-center gap-3 rounded-lg p-2 transition hover:bg-primary/10")}>
              <img src={track.artwork} alt="" className="h-11 w-11 rounded-md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{track.title}</p>
                <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
              </div>
              <button onClick={() => toggle(track)} className="rounded-full bg-card p-2 hover:bg-primary/20" aria-label="Prévia">
                {playingId === track.id ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => { audioRef.current?.pause(); setPlayingId(null); setMusic(track); }}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Escolher
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && q && results.length === 0 && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Music2 className="h-3.5 w-3.5" /> Nada encontrado para "{q}"
        </p>
      )}
    </div>
  );
}
