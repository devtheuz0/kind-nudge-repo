/**
 * Tribute — renderiza a homenagem completa a partir do builder state.
 * Usado no preview ao vivo, no preview final e (futuramente) na URL pública.
 */
import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  TEMPLATES,
  type Category,
  type MediaItem,
  type MusicTrack,
  type TemplateId,
  type TimelineEvent,
} from "@/lib/builder-store";
import { TemplateBackdrop } from "./templates/TemplateBackdrop";
import { Memo } from "./Memo";

export type TributeData = {
  category: Category | null;
  fromName: string;
  toName: string;
  startDate: string;
  openingPhrase: string;
  mainMessage: string;
  media: MediaItem[];
  timeline: TimelineEvent[];
  templateId: TemplateId;
  music: MusicTrack | null;
};

export function Tribute({ data, compact = false }: { data: TributeData; compact?: boolean }) {
  const template = TEMPLATES.find((t) => t.id === data.templateId) ?? TEMPLATES[0];
  const cat = CATEGORIES.find((c) => c.id === data.category);

  return (
    <div
      className="relative isolate min-h-full bg-night text-foreground"
      style={{ ["--accent" as string]: template.accent }}
    >
      <TemplateBackdrop template={data.templateId} />

      <div className={compact ? "relative z-10 px-4 py-8" : "relative z-10 px-6 py-16"}>
        {/* Hero */}
        <section className="mx-auto max-w-2xl text-center">
          <Memo mood="heart" size={compact ? 64 : 96} />
          {cat && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary/80">
              {cat.emoji} {cat.label}
            </p>
          )}
          <h1
            className={
              compact
                ? "mt-3 font-display text-2xl font-bold leading-tight"
                : "mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl"
            }
            style={{ color: "var(--accent)" }}
          >
            {data.toName || "Para você"}
          </h1>
          {data.openingPhrase && (
            <p className={compact ? "mt-3 text-sm text-foreground/85" : "mt-5 text-lg text-foreground/85"}>
              "{data.openingPhrase}"
            </p>
          )}
          {data.startDate && <Counter date={data.startDate} compact={compact} />}
          {data.fromName && (
            <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
              de {data.fromName}
            </p>
          )}
        </section>

        {/* Media gallery */}
        {data.media.length > 0 && (
          <section className={compact ? "mx-auto mt-10 max-w-2xl" : "mx-auto mt-20 max-w-3xl"}>
            <h2 className="text-center font-display text-xl font-semibold sm:text-2xl">
              Nossos momentos
            </h2>
            <div className={compact ? "mt-4 grid grid-cols-2 gap-2" : "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"}>
              {data.media.map((m) => (
                <figure key={m.id} className="group overflow-hidden rounded-xl border border-white/10 bg-card/60">
                  <div className="aspect-square">
                    {m.type === "photo" && <img src={m.url} alt={m.caption} className="h-full w-full object-cover" />}
                    {m.type === "video" && <video src={m.url} muted loop autoPlay playsInline className="h-full w-full object-cover" />}
                    {m.type === "audio" && (
                      <div className="flex h-full items-center justify-center text-primary">♪</div>
                    )}
                  </div>
                  {m.caption && (
                    <figcaption className="px-2 py-1.5 text-xs text-muted-foreground">{m.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Timeline */}
        {data.timeline.length > 0 && (
          <section className={compact ? "mx-auto mt-10 max-w-xl" : "mx-auto mt-20 max-w-xl"}>
            <h2 className="text-center font-display text-xl font-semibold sm:text-2xl">Linha do tempo</h2>
            <ol className="relative mt-6 space-y-4 border-l-2 border-primary/40 pl-6">
              {data.timeline.map((e) => (
                <li key={e.id} className="relative">
                  <span
                    className="absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
                    style={{ boxShadow: "0 0 16px var(--accent)" }}
                  >
                    {e.icon}
                  </span>
                  <div className="rounded-xl border border-white/10 bg-card/60 p-3 backdrop-blur">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-primary/80">
                      {new Date(e.date).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="mt-0.5 font-semibold">{e.title}</p>
                    {e.description && <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Main message */}
        {data.mainMessage && (
          <section className={compact ? "mx-auto mt-10 max-w-xl text-center" : "mx-auto mt-20 max-w-xl text-center"}>
            <p className="whitespace-pre-line text-base leading-relaxed text-foreground/90 sm:text-lg">
              {data.mainMessage}
            </p>
          </section>
        )}

        {/* footer signature */}
        <footer className="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-3 text-center">
          <Memo mood="celebrate" size={56} />
          <p className="text-xs text-muted-foreground">feito com ♥ no Memora</p>
        </footer>
      </div>

      {/* Floating music player */}
      {data.music && <MusicPlayer track={data.music} />}
    </div>
  );
}

function Counter({ date, compact }: { date: string; compact: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const stats = useMemo(() => {
    const start = new Date(date).getTime();
    if (!start) return null;
    const ms = Math.max(0, now - start);
    const sec = Math.floor(ms / 1000);
    const days = Math.floor(sec / 86400);
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const hrs = Math.floor((sec % 86400) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return { years, months, days: days % 30, hrs, mins, secs };
  }, [date, now]);
  if (!stats) return null;
  const cells = [
    { label: "anos", v: stats.years },
    { label: "meses", v: stats.months },
    { label: "dias", v: stats.days },
    { label: "h", v: stats.hrs },
    { label: "min", v: stats.mins },
    { label: "s", v: stats.secs },
  ];
  return (
    <div className={compact ? "mt-4 grid grid-cols-6 gap-1" : "mt-6 grid grid-cols-6 gap-2"}>
      {cells.map((c) => (
        <div key={c.label} className="rounded-lg border border-white/10 bg-white/5 p-2 backdrop-blur">
          <p className={compact ? "font-mono text-sm font-bold text-primary" : "font-mono text-2xl font-bold text-primary"}>
            {String(c.v).padStart(2, "0")}
          </p>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

function MusicPlayer({ track }: { track: MusicTrack }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio(track.previewUrl);
    audioRef.current.src = track.previewUrl;
    audioRef.current.loop = true;
    return () => { audioRef.current?.pause(); };
  }, [track.previewUrl]);
  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };
  return (
    <div className="sticky bottom-4 z-20 mx-auto mt-8 flex w-[min(92%,420px)] items-center gap-3 rounded-full border border-primary/40 bg-background/85 p-2 pr-4 backdrop-blur glow-soft">
      <button
        onClick={toggle}
        className="rounded-full bg-primary p-2 text-primary-foreground"
        aria-label={playing ? "Pausar" : "Tocar"}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <img src={track.artwork} alt="" className="h-9 w-9 rounded-full" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">{track.title}</p>
        <p className="truncate text-[10px] text-muted-foreground">{track.artist}</p>
      </div>
    </div>
  );
}
