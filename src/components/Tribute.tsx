/**
 * Tribute — homenagem imersiva estilo LovePanda.
 * Cover fullscreen, galeria editorial, timeline com pontos conectados,
 * mensagem central, player de música fixo.
 */
import { ChevronDown, Music2, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
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

export function Tribute({ data, compact = false, locked = false }: { data: TributeData; compact?: boolean; locked?: boolean }) {
  const template = TEMPLATES.find((t) => t.id === data.templateId) ?? TEMPLATES[0];
  const cat = CATEGORIES.find((c) => c.id === data.category);
  const eyebrow = cat ? `${cat.emoji} ${cat.label.toUpperCase()}` : "♥ PARA QUEM AMO";

  return (
    <div
      className="bg-tribute relative isolate min-h-full text-[#f5f0e8]"
      style={{
        ["--accent" as string]: template.accent,
        paddingBottom: data.music ? (compact ? 64 : 76) : 0,
      }}
    >
      <TemplateBackdrop template={data.templateId} />
      {locked && <PreviewWatermark />}

      {/* ============== SEÇÃO 1 — COVER ============== */}
      <section
        className={cn(
          "relative z-10 flex flex-col items-center justify-center px-6 text-center",
          compact ? "min-h-[520px] py-12" : "min-h-screen py-16",
        )}
      >
        <p
          className="animate-fade-up font-sans text-[10px] font-semibold tracking-[0.25em] text-[#d4a33b]"
          style={{ animationDelay: "0ms" }}
        >
          {eyebrow}
        </p>
        <h1
          className="animate-fade-up serif-italic mt-5 font-display font-bold not-italic leading-[1.05] text-[#f5f0e8]"
          style={{
            animationDelay: "150ms",
            fontSize: compact ? "44px" : "clamp(52px, 11vw, 96px)",
          }}
        >
          {data.toName || "Para você"}
        </h1>
        {data.openingPhrase && (
          <p
            className="animate-fade-up serif-italic mt-5 max-w-[300px] text-[15px] leading-relaxed text-[#f5f0e8]/55"
            style={{ animationDelay: "300ms" }}
          >
            "{data.openingPhrase}"
          </p>
        )}
        {data.startDate && (
          <div className="animate-fade-up mt-8" style={{ animationDelay: "450ms" }}>
            <Counter date={data.startDate} />
            {data.fromName && (
              <p className="mt-3 text-[10px] tracking-[0.2em] text-[#f5f0e8]/35">
                AO LADO DE {data.fromName.toUpperCase()}
              </p>
            )}
          </div>
        )}
        {!compact && (
          <div className="animate-bounce-arrow absolute bottom-8 left-1/2 -translate-x-1/2 text-[#d4a33b]">
            <ChevronDown className="h-5 w-5" />
          </div>
        )}
      </section>

      {/* ============== SEÇÃO 2 — GALERIA EDITORIAL ============== */}
      {data.media.length > 0 && (
        <section className={cn("relative z-10 mx-auto max-w-2xl px-5", compact ? "mt-6" : "mt-10")}>
          <SectionDivider label="Nossos momentos" />
          <EditorialGallery items={data.media} />
        </section>
      )}

      {/* ============== SEÇÃO 3 — TIMELINE ============== */}
      {data.timeline.length > 0 && (
        <section className={cn("relative z-10 mx-auto max-w-xl px-6", compact ? "mt-10" : "mt-20")}>
          <SectionDivider label="Nossa linha do tempo" />
          <TimelineList events={data.timeline} />
        </section>
      )}

      {/* ============== SEÇÃO 4 — MENSAGEM ============== */}
      {data.mainMessage && (
        <section className={cn("relative z-10 mx-auto max-w-xl px-8 text-center", compact ? "mt-10" : "mt-20")}>
          <p
            className="serif-italic whitespace-pre-line leading-[1.8] text-[#f5f0e8]/65"
            style={{ fontSize: compact ? "14px" : "16px" }}
          >
            {highlightDatesNames(data.mainMessage)}
          </p>
        </section>
      )}

      {/* Rodapé */}
      <footer className="relative z-10 mt-16 pb-10 text-center">
        <p className="font-display text-[10px] tracking-[0.3em] text-[#d4a33b]/45">MEMORA</p>
        <p className="mt-2 text-[11px] text-[#f5f0e8]/20">feito com ♥ no Memora</p>
      </footer>

      {data.music && <MusicPlayer track={data.music} />}
    </div>
  );
}

function PreviewWatermark() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[45] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-30deg, transparent 0 80px, rgba(245,240,232,0.4) 80px 82px), repeating-linear-gradient(-30deg, transparent 0 220px, rgba(212,163,59,0.25) 220px 320px)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-12">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="font-display text-[44px] font-black uppercase tracking-[0.4em] text-[#d4a33b]/15 sm:text-[72px]"
              style={{ transform: "rotate(-22deg)" }}
            >
              PRÉVIA · MEMORA · PRÉVIA
            </span>
          ))}
        </div>
      </div>
      <div className="pointer-events-none fixed left-1/2 top-3 z-[46] -translate-x-1/2 rounded-full border border-primary/50 bg-background/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur">
        Prévia bloqueada — publique para liberar
      </div>
    </>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 text-center">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4a33b]/30" />
      <span className="font-display text-[11px] tracking-[0.25em] text-[#d4a33b]/75">
        {label.toUpperCase()}
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4a33b]/30" />
    </div>
  );
}

function EditorialGallery({ items }: { items: MediaItem[] }) {
  const visible = items.slice(0, 5);
  const remaining = items.length - 4;
  const [a, b, c, d, e] = visible;
  return (
    <div className="mt-6 grid gap-1">
      {(a || b) && (
        <div className="grid grid-cols-5 gap-1">
          {a && <Tile item={a} className="col-span-3 h-[180px]" />}
          {b && <Tile item={b} className="col-span-2 h-[180px]" />}
        </div>
      )}
      {c && <Tile item={c} className="h-[140px]" />}
      {(d || e) && (
        <div className="grid grid-cols-2 gap-1">
          {d && <Tile item={d} className="h-[150px]" />}
          {e && (
            <Tile item={e} className="relative h-[150px]" overlay={items.length > 5 ? `+${remaining} fotos` : undefined} />
          )}
        </div>
      )}
    </div>
  );
}

function Tile({ item, className, overlay }: { item: MediaItem; className?: string; overlay?: string }) {
  return (
    <figure className={cn("relative overflow-hidden rounded-[10px] bg-white/5", className)}>
      {item.type === "photo" && <img src={item.url} alt={item.caption} className="h-full w-full object-cover" />}
      {item.type === "video" && (
        <video src={item.url} muted loop autoPlay playsInline className="h-full w-full object-cover" />
      )}
      {item.type === "audio" && (
        <div className="flex h-full items-center justify-center text-[#d4a33b]">
          <Music2 className="h-6 w-6" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
      {item.caption && (
        <figcaption className="absolute bottom-2 left-2 right-2 truncate font-display text-[11px] italic text-white/90">
          {item.caption}
        </figcaption>
      )}
      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/55">
          <span className="rounded-full border border-white/40 px-3 py-1 text-[11px] font-semibold tracking-wider text-white">
            {overlay}
          </span>
        </div>
      )}
    </figure>
  );
}

function TimelineList({ events }: { events: TimelineEvent[] }) {
  const symbols = ["✦", "♡", "★", "◈"];
  return (
    <div className="relative mt-8">
      <span
        className="absolute left-[15px] top-0 h-full w-px"
        style={{
          background:
            "linear-gradient(180deg, rgba(212,163,59,0.3), rgba(212,163,59,0.05))",
        }}
      />
      <ol className="space-y-8">
        {events.map((e, i) => (
          <li key={e.id} className="relative pl-12">
            <span
              className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full text-[14px] text-[#d4a33b]"
              style={{
                background: "rgba(212,163,59,0.1)",
                border: "1.5px solid rgba(212,163,59,0.35)",
              }}
            >
              {e.icon || symbols[i % symbols.length]}
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d4a33b]">
              {fmtDate(e.date)}
            </p>
            <p className="mt-1 font-display text-[16px] font-medium text-[#f0ebe0]">{e.title}</p>
            {e.description && (
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#f5f0e8]/45">{e.description}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function fmtDate(d: string) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function highlightDatesNames(text: string) {
  // realça números/datas (dd/mm/aaaa, anos como 2024) e palavras em CAIXA ALTA
  const re = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\b(?:19|20)\d{2}\b|\b[A-ZÀ-Ý]{2,}\b)/g;
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p) ? (
      <span key={i} className="text-[#d4a33b] not-italic">{p}</span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function Counter({ date }: { date: string }) {
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
    return { years, months, days: days % 30, hrs };
  }, [date, now]);
  if (!stats) return null;
  const cells = [
    { label: "ANOS", v: stats.years },
    { label: "MESES", v: stats.months },
    { label: "DIAS", v: stats.days },
    { label: "HORAS", v: stats.hrs },
  ];
  return (
    <div className="flex items-center justify-center gap-2">
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-center">
          <div
            className="flex w-[58px] flex-col items-center rounded-md px-2 py-1.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(212,163,59,0.2)",
            }}
          >
            <span className="font-display text-[26px] font-bold leading-none text-[#d4a33b]">
              {String(c.v).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[8px] tracking-[0.15em] text-[#f5f0e8]/35">{c.label}</span>
          </div>
          {i < cells.length - 1 && <span className="px-1 text-[#d4a33b]/40">·</span>}
        </div>
      ))}
    </div>
  );
}

function MusicPlayer({ track }: { track: MusicTrack }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio(track.previewUrl);
    a.loop = true;
    a.volume = 0.7;
    audioRef.current = a;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    const unlock = () => {
      a.play().then(() => setPlaying(true)).catch(() => {});
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => {
      a.pause();
      window.removeEventListener("pointerdown", unlock);
    };
  }, [track.previewUrl]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center gap-3 px-4"
      style={{
        background: "rgba(11,21,38,0.92)",
        backdropFilter: "blur(12px)",
        borderTop: "0.5px solid rgba(212,163,59,0.15)",
      }}
    >
      <Music2 className="h-4 w-4 text-[#d4a33b]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-semibold text-[#f5f0e8]">{track.title}</p>
        <p className="truncate text-[10px] text-[#f5f0e8]/55">{track.artist}</p>
      </div>
      <button
        onClick={toggle}
        className="grid h-9 w-9 place-items-center rounded-full bg-[#d4a33b] text-[#0b1526] transition hover:brightness-110"
        aria-label={playing ? "Pausar" : "Tocar"}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
      </button>
    </div>
  );
}
