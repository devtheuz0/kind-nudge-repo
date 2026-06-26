/**
 * Tribute — homenagem imersiva (LovePanda × Spotify × cartão digital).
 * Cover fullscreen, carrossel deslizável de fotos, vídeos com divisória,
 * timeline com marcos, mensagem central, "ficha do presente" e player.
 */
import { ChevronDown, ChevronLeft, ChevronRight, Heart, MessageCircle, Music2, Pause, Play, Share2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
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
  const photos = data.media.filter((m) => m.type === "photo");
  const videos = data.media.filter((m) => m.type === "video");
  const audios = data.media.filter((m) => m.type === "audio");

  return (
    <div
      className="bg-tribute relative isolate min-h-full text-[#f5f0e8]"
      style={{
        ["--accent" as string]: template.accent,
        paddingBottom: data.music ? (compact ? 64 : 88) : 0,
      }}
    >
      <TemplateBackdrop template={data.templateId} media={data.media} />
      {locked && <PreviewWatermark />}

      {/* ============== COVER ============== */}
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
            className="animate-fade-up serif-italic mt-5 max-w-[300px] text-[15px] leading-relaxed text-[#f5f0e8]/65"
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
          <div className="animate-bounce-arrow absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#d4a33b]">
            <span className="text-[10px] tracking-[0.3em]">DESLIZE</span>
            <ChevronDown className="h-5 w-5" />
          </div>
        )}
      </section>

      {/* ============== FICHA DO PRESENTE — estilo Spotify ============== */}
      <section className={cn("relative z-10 mx-auto max-w-md px-5", compact ? "mt-4" : "mt-8")}>
        <GiftCard data={data} photos={photos.length} videos={videos.length} audios={audios.length} />
      </section>

      {/* ============== GALERIA DESLIZÁVEL DE FOTOS ============== */}
      {photos.length > 0 && (
        <section className={cn("relative z-10 mx-auto max-w-2xl", compact ? "mt-10" : "mt-20")}>
          <div className="px-5">
            <SectionDivider label={`Nossas memórias · ${photos.length}`} kind="photo" />
          </div>
          <SwipeGallery items={photos} compact={compact} />
        </section>
      )}

      {/* ============== VÍDEOS — divisória separada ============== */}
      {videos.length > 0 && (
        <section className={cn("relative z-10 mx-auto max-w-2xl px-5", compact ? "mt-10" : "mt-20")}>
          <SectionDivider label={`Em movimento · ${videos.length}`} kind="video" />
          <VideoStack items={videos} />
        </section>
      )}

      {/* ============== TIMELINE ============== */}
      {data.timeline.length > 0 && (
        <section className={cn("relative z-10 mx-auto max-w-xl px-6", compact ? "mt-10" : "mt-20")}>
          <SectionDivider label="Nossa linha do tempo" />
          <TimelineList events={data.timeline} />
        </section>
      )}

      {/* ============== MENSAGEM ============== */}
      {data.mainMessage && (
        <section className={cn("relative z-10 mx-auto max-w-xl px-8", compact ? "mt-10" : "mt-20")}>
          <SectionDivider label="Uma palavra do coração" />
          <div className="mt-6 rounded-2xl border border-[#d4a33b]/25 bg-[#0d1a2e]/60 p-6 backdrop-blur">
            <p
              className="serif-italic whitespace-pre-line leading-[1.8] text-[#f5f0e8]/85"
              style={{ fontSize: compact ? "14px" : "16px" }}
            >
              {highlightDatesNames(data.mainMessage)}
            </p>
            {data.fromName && (
              <p className="mt-5 text-right font-display text-[14px] italic text-[#d4a33b]">— {data.fromName}</p>
            )}
          </div>
        </section>
      )}

      {/* ============== REAÇÕES ============== */}
      <section className={cn("relative z-10 mx-auto max-w-md px-6", compact ? "mt-10" : "mt-20")}>
        <SectionDivider label="Deixe um carinho" />
        <ReactionsBar />
      </section>

      {/* Rodapé */}
      <footer className="relative z-10 mt-16 pb-10 text-center">
        <p className="font-display text-[10px] tracking-[0.3em] text-[#d4a33b]/45">MEMORA</p>
        <p className="mt-2 text-[11px] text-[#f5f0e8]/30">um presente digital · feito com ♥</p>
      </footer>

      {data.music && <MusicPlayer track={data.music} />}
    </div>
  );
}

function GiftCard({ data, photos, videos, audios }: { data: TributeData; photos: number; videos: number; audios: number }) {
  const cover = data.media.find((m) => m.type === "photo");
  const cat = CATEGORIES.find((c) => c.id === data.category);
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-5 backdrop-blur"
      style={{
        background: "linear-gradient(135deg, rgba(212,163,59,0.18) 0%, rgba(11,21,38,0.85) 70%)",
        border: "1px solid rgba(212,163,59,0.25)",
        boxShadow: "0 24px 50px -20px rgba(0,0,0,0.6)",
      }}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#15263d] ring-1 ring-[#d4a33b]/30">
          {cover ? (
            <img src={cover.url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-3xl">{cat?.emoji ?? "✦"}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#1db954]">PRESENTE DIGITAL</p>
          <p className="mt-1 truncate font-display text-xl font-bold">{cat?.label || "Memora"}</p>
          <p className="truncate text-xs text-[#f5f0e8]/55">
            {data.fromName ? `por ${data.fromName}` : "feito com carinho"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold">
            <Tag>{photos} foto{photos !== 1 ? "s" : ""}</Tag>
            {videos > 0 && <Tag>{videos} víd</Tag>}
            {audios > 0 && <Tag>{audios} áudio{audios !== 1 ? "s" : ""}</Tag>}
            {data.timeline.length > 0 && <Tag>{data.timeline.length} marcos</Tag>}
            {data.music && <Tag tone="green">♪ trilha</Tag>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "green" }) {
  const styles =
    tone === "green"
      ? "border-[#1db954]/50 bg-[#1db954]/15 text-[#1db954]"
      : "border-[#d4a33b]/30 bg-[#d4a33b]/10 text-[#d4a33b]";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5", styles)}>
      {children}
    </span>
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

function SectionDivider({ label, kind }: { label: string; kind?: "photo" | "video" }) {
  const symbol = kind === "video" ? "▶" : kind === "photo" ? "◇" : "✦";
  return (
    <div className="flex items-center gap-4 text-center">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4a33b]/30" />
      <span className="inline-flex items-center gap-2 font-display text-[11px] tracking-[0.25em] text-[#d4a33b]/85">
        <span className="text-[#d4a33b]/60">{symbol}</span>
        {label.toUpperCase()}
        <span className="text-[#d4a33b]/60">{symbol}</span>
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4a33b]/30" />
    </div>
  );
}

/** Carrossel deslizável com molduras polaroid e feedback de swipe. */
function SwipeGallery({ items, compact }: { items: MediaItem[]; compact: boolean }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: items.length > 1, align: "center", dragFree: false });
  const [index, setIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => {
      setIndex(embla.selectedScrollSnap());
      setShowHint(false);
    };
    embla.on("select", onSelect);
    embla.on("pointerDown", () => setShowHint(false));
    return () => { embla.off("select", onSelect); };
  }, [embla]);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative mt-6">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((it, i) => (
            <div key={it.id} className="min-w-0 shrink-0 grow-0 basis-[78%] pl-3 first:pl-5 last:pr-5">
              <figure
                className="polaroid mx-auto"
                style={{
                  width: "100%",
                  transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)`,
                }}
              >
                <div className={cn("relative overflow-hidden", compact ? "aspect-square" : "aspect-[4/5]")}>
                  <img
                    src={it.url}
                    alt={it.caption || ""}
                    className="h-full w-full object-cover transition-transform duration-700"
                    draggable={false}
                  />
                </div>
                <figcaption className="absolute bottom-2 left-2 right-2 truncate text-center font-display text-[12px] italic text-[#1a1a1a]/75">
                  {it.caption || `momento ${i + 1}`}
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* Swipe hint */}
      {showHint && items.length > 1 && (
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <div className="animate-swipe-hint rounded-full bg-black/60 p-2 backdrop-blur">
            <ChevronRight className="h-4 w-4 text-[#d4a33b]" />
          </div>
        </div>
      )}

      {/* Setas (desktop) */}
      {items.length > 1 && !compact && (
        <>
          <button
            onClick={() => embla?.scrollPrev()}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/50 p-2 backdrop-blur transition hover:bg-black/70 sm:block"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4 text-[#d4a33b]" />
          </button>
          <button
            onClick={() => embla?.scrollNext()}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/50 p-2 backdrop-blur transition hover:bg-black/70 sm:block"
            aria-label="Próxima"
          >
            <ChevronRight className="h-4 w-4 text-[#d4a33b]" />
          </button>
        </>
      )}

      {/* Dots */}
      {items.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => embla?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-[#d4a33b]" : "w-1.5 bg-white/25",
              )}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoStack({ items }: { items: MediaItem[] }) {
  return (
    <div className="mt-6 space-y-4">
      {items.map((v) => (
        <figure
          key={v.id}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
        >
          <video
            src={v.url}
            controls
            playsInline
            preload="metadata"
            className="block aspect-video w-full bg-black"
          />
          {v.caption && (
            <figcaption className="border-t border-white/5 bg-[#0b1526]/80 px-3 py-2 text-center text-[12px] italic text-[#f5f0e8]/70">
              {v.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
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
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#f5f0e8]/55">{e.description}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ReactionsBar() {
  const [counts, setCounts] = useState({ heart: 0, sparkle: 0, msg: 0 });
  const bump = (k: keyof typeof counts) => setCounts((c) => ({ ...c, [k]: c[k] + 1 }));
  return (
    <div className="mt-5 flex items-center justify-center gap-3">
      <ReactBtn icon={<Heart className="h-4 w-4" />} count={counts.heart} onClick={() => bump("heart")} />
      <ReactBtn icon={<Sparkles className="h-4 w-4" />} count={counts.sparkle} onClick={() => bump("sparkle")} />
      <ReactBtn icon={<MessageCircle className="h-4 w-4" />} count={counts.msg} onClick={() => bump("msg")} />
      <button
        onClick={() => navigator.share?.({ title: "Memora", url: window.location.href }).catch(() => {})}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0d1a2e]/80 px-3 py-2 text-xs text-[#f5f0e8]/70 transition hover:border-[#d4a33b]/40 hover:text-[#d4a33b]"
      >
        <Share2 className="h-4 w-4" /> Compartilhar
      </button>
    </div>
  );
}

function ReactBtn({ icon, count, onClick }: { icon: React.ReactNode; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0d1a2e]/80 px-3 py-2 text-xs text-[#f5f0e8]/70 transition hover:border-[#d4a33b]/40 hover:text-[#d4a33b] active:scale-95"
    >
      <span className="transition-transform group-active:scale-125">{icon}</span>
      <span className="font-mono text-[11px]">{count}</span>
    </button>
  );
}

function fmtDate(d: string) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function highlightDatesNames(text: string) {
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

/** Player de música no rodapé — estilo Spotify com barra de progresso. */
function MusicPlayer({ track }: { track: MusicTrack }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

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
    const onTime = () => setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
    a.addEventListener("timeupdate", onTime);
    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
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
      className="fixed inset-x-0 bottom-0 z-50 flex flex-col"
      style={{
        background: "rgba(11,21,38,0.94)",
        backdropFilter: "blur(14px)",
        borderTop: "0.5px solid rgba(29,185,84,0.25)",
      }}
    >
      <div className="h-0.5 w-full bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#1db954] to-[#d4a33b] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex h-14 items-center gap-3 px-4">
        <img src={track.artwork} alt="" className={cn("h-10 w-10 rounded-md ring-1 ring-[#1db954]/40", playing && "animate-bob")} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-[#f5f0e8]">{track.title}</p>
          <p className="truncate text-[10px] text-[#f5f0e8]/55">{track.artist}</p>
        </div>
        {playing && (
          <div className="hidden items-end gap-0.5 sm:flex">
            {[0,1,2,3].map((i) => (
              <span key={i} className="block w-0.5 rounded-t bg-[#1db954]" style={{ height: 6 + (i%2)*8, animation: `bob ${0.6 + i*0.2}s ease-in-out infinite` }} />
            ))}
          </div>
        )}
        <button
          onClick={toggle}
          className="grid h-10 w-10 place-items-center rounded-full bg-[#1db954] text-black transition hover:scale-105"
          aria-label={playing ? "Pausar" : "Tocar"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
        </button>
      </div>
    </div>
  );
}

// Keep imports tidy
void Music2;
