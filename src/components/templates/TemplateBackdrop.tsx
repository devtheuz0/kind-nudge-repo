/**
 * Cenário animado por trás da homenagem. Cada template tem identidade própria.
 * Aceita opcionalmente `media` para mostrar fotos reais no backdrop.
 */
import { useMemo } from "react";
import type { MediaItem, TemplateId } from "@/lib/builder-store";

export function TemplateBackdrop({
  template,
  media = [],
}: {
  template: TemplateId;
  media?: MediaItem[];
}) {
  const photos = media.filter((m) => m.type === "photo");
  switch (template) {
    case "coracao":      return <Coracao />;
    case "jardim":       return <Jardim />;
    case "constelacao":  return <Constelacao />;
    case "polaroid":     return <Polaroid photos={photos} />;
    case "patinhas":     return <Patinhas />;
    case "vela":         return <Vela />;
    case "bodas":        return <Bodas />;
    case "vinil":        return <Vinil />;
    case "cinema":       return <Cinema photos={photos} />;
    case "cartas":       return <Cartas />;
    case "festa":        return <Festa />;
    case "mar":          return <Mar />;
    default:             return null;
  }
}

function Layer({ children }: { children: React.ReactNode }) {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden">{children}</div>;
}

function Coracao() {
  const items = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({
      left: `${(i * 7 + 5) % 95}%`,
      delay: `${(i * 0.6) % 8}s`,
      duration: `${10 + (i % 5) * 2}s`,
      size: 12 + (i % 4) * 6,
    })),
    [],
  );
  return (
    <Layer>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,63,94,0.18),_transparent_60%)]" />
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute bottom-0 text-rose-400"
          style={{
            left: it.left,
            fontSize: it.size,
            animation: `float-up ${it.duration} linear ${it.delay} infinite`,
          }}
        >
          ❤
        </span>
      ))}
    </Layer>
  );
}

function Jardim() {
  const petals = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      left: `${(i * 6 + 3) % 97}%`,
      delay: `${(i * 0.4) % 9}s`,
      duration: `${12 + (i % 6) * 2}s`,
    })),
    [],
  );
  return (
    <Layer>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,196,106,0.18),_transparent_60%)]" />
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute -top-6 text-amber-200"
          style={{
            left: p.left,
            fontSize: 14 + (i % 3) * 6,
            animation: `float-up ${p.duration} linear ${p.delay} infinite reverse`,
          }}
        >
          🌸
        </span>
      ))}
    </Layer>
  );
}

function Constelacao() {
  const stars = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: 0.5 + Math.random() * 1.4,
      d: `${Math.random() * 4}s`,
    })),
    [],
  );
  return (
    <Layer>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="#FFF4E1"
            style={{ animation: `twinkle 3s ease-in-out ${s.d} infinite alternate` }}
          />
        ))}
        {stars.slice(0, 12).map((s, i, arr) => {
          const n = arr[(i + 1) % arr.length];
          return (
            <line
              key={`l${i}`}
              x1={`${s.x}%`} y1={`${s.y}%`}
              x2={`${n.x}%`} y2={`${n.y}%`}
              stroke="#F5C46A" strokeOpacity="0.18" strokeWidth="0.6"
            />
          );
        })}
      </svg>
    </Layer>
  );
}

/** Polaroid — agora recebe FOTOS REAIS do usuário e espalha como um mural. */
function Polaroid({ photos }: { photos: MediaItem[] }) {
  // Sempre exibe ao menos 5 slots; se faltar, repete; se nada, deixa em branco com placeholder
  const slots = useMemo(() => {
    const positions = [
      { top: "6%",  left: "4%",  rot: -10, size: 100, delay: "0s" },
      { top: "12%", left: "62%", rot: 8,   size: 120, delay: "0.6s" },
      { top: "44%", left: "10%", rot: -4,  size: 110, delay: "1.2s" },
      { top: "48%", left: "58%", rot: 12,  size: 130, delay: "0.3s" },
      { top: "72%", left: "30%", rot: -6,  size: 115, delay: "0.9s" },
    ];
    return positions.map((p, i) => ({ ...p, photo: photos[i % Math.max(photos.length, 1)] }));
  }, [photos]);

  return (
    <Layer>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,244,225,0.12),_transparent_70%)]" />
      {slots.map((s, i) => (
        <div
          key={i}
          className="polaroid absolute animate-drift"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            ["--r" as string]: `${s.rot}deg`,
            transform: `rotate(${s.rot}deg)`,
            animationDelay: s.delay,
          }}
        >
          {s.photo ? (
            <img
              src={s.photo.url}
              alt=""
              className="block aspect-square w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="block aspect-square w-full bg-gradient-to-br from-[#15263d] to-[#0b1526]" />
          )}
          <span className="absolute bottom-2 left-2 right-2 truncate text-center font-display text-[10px] italic text-[#1a1a1a]/70">
            {s.photo?.caption || "···"}
          </span>
        </div>
      ))}
    </Layer>
  );
}

function Patinhas() {
  const paws = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({
      x: 5 + (i * 7) % 90,
      y: 10 + (i * 11) % 80,
      r: i % 2 === 0 ? -15 : 15,
    })),
    [],
  );
  return (
    <Layer>
      {paws.map((p, i) => (
        <span
          key={i}
          className="absolute text-3xl text-amber-200/40"
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `rotate(${p.r}deg)` }}
        >
          🐾
        </span>
      ))}
    </Layer>
  );
}

function Vela() {
  return (
    <Layer>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div
          className="h-16 w-6 rounded-full bg-gradient-to-t from-amber-300 via-amber-100 to-white opacity-80 blur-sm animate-flicker"
          style={{ transformOrigin: "50% 100%" }}
        />
        <div className="h-40 w-10 rounded-md bg-gradient-to-b from-cream to-amber-200/60" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(245,196,106,0.22),_transparent_60%)]" />
    </Layer>
  );
}

function Bodas() {
  const dust = useMemo(
    () => Array.from({ length: 26 }, (_, i) => ({
      left: `${(i * 4 + 2) % 99}%`,
      delay: `${(i * 0.3) % 7}s`,
      duration: `${8 + (i % 5) * 2}s`,
    })),
    [],
  );
  return (
    <Layer>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,196,106,0.22),_transparent_60%)]" />
      {dust.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 text-primary"
          style={{
            left: p.left,
            fontSize: 8 + (i % 4) * 4,
            animation: `float-up ${p.duration} linear ${p.delay} infinite`,
          }}
        >
          ✦
        </span>
      ))}
    </Layer>
  );
}

/* ============== NOVOS TEMPLATES ============== */

function Vinil() {
  return (
    <Layer>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(29,185,84,0.12),_transparent_65%)]" />
      <div
        className="vinyl animate-spin-slow absolute"
        style={{
          bottom: "-25%",
          right: "-20%",
          width: "70%",
          aspectRatio: "1/1",
          opacity: 0.55,
        }}
      />
      <div
        className="vinyl animate-spin-slow absolute"
        style={{
          top: "-30%",
          left: "-25%",
          width: "60%",
          aspectRatio: "1/1",
          opacity: 0.35,
          animationDuration: "10s",
        }}
      />
    </Layer>
  );
}

function Cinema({ photos }: { photos: MediaItem[] }) {
  const frames = useMemo(() => {
    const src = photos.length ? photos : Array.from({ length: 4 }, () => null);
    return [...src, ...src]; // duplicate for seamless loop
  }, [photos]);
  return (
    <Layer>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1526_0%,#1a1a1a_100%)]" />
      {[20, 60].map((y) => (
        <div
          key={y}
          className="absolute left-0 flex h-20 w-[200%] items-center gap-2 bg-black/80 px-2 animate-film"
          style={{ top: `${y}%`, animationDelay: `${y === 60 ? "-15s" : "0s"}` }}
        >
          {frames.map((f, i) => (
            <div
              key={i}
              className="h-16 w-20 shrink-0 overflow-hidden border-2 border-y-amber-200/30 bg-card"
            >
              {f && f.url ? (
                <img src={f.url} alt="" className="h-full w-full object-cover" draggable={false} />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-navy/60 to-deep" />
              )}
            </div>
          ))}
        </div>
      ))}
      {/* sprocket holes */}
      {[18, 58].map((y) => (
        <div key={`top${y}`} className="absolute left-0 h-1.5 w-full" style={{ top: `${y - 0.5}%`, background: "repeating-linear-gradient(90deg, #f5c46a 0 6px, transparent 6px 16px)", opacity: 0.4 }} />
      ))}
    </Layer>
  );
}

function Cartas() {
  const letters = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({
      left: `${(i * 10 + 5) % 95}%`,
      delay: `${(i * 0.7) % 8}s`,
      duration: `${14 + (i % 4) * 2}s`,
      r: i % 2 === 0 ? -8 : 8,
    })),
    [],
  );
  return (
    <Layer>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,196,106,0.14),_transparent_65%)]" />
      {letters.map((l, i) => (
        <span
          key={i}
          className="absolute bottom-0 text-2xl"
          style={{
            left: l.left,
            transform: `rotate(${l.r}deg)`,
            animation: `float-up ${l.duration} linear ${l.delay} infinite`,
          }}
        >
          {i % 2 === 0 ? "✉️" : "💌"}
        </span>
      ))}
    </Layer>
  );
}

function Festa() {
  const confetti = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({
      left: `${(i * 2.7) % 100}%`,
      delay: `${(i * 0.18) % 5}s`,
      duration: `${5 + (i % 6)}s`,
      color: ["#F5C46A", "#F43F5E", "#7DD3FC", "#86efac", "#fbcfe8"][i % 5],
      w: 4 + (i % 3) * 3,
      h: 8 + (i % 4) * 3,
    })),
    [],
  );
  return (
    <Layer>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,63,94,0.16),_transparent_60%)]" />
      {confetti.map((c, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-[1px]"
          style={{
            left: c.left,
            width: c.w,
            height: c.h,
            background: c.color,
            animation: `confetti-fall ${c.duration}s linear ${c.delay} infinite`,
          }}
        />
      ))}
    </Layer>
  );
}

function Mar() {
  return (
    <Layer>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1526_0%,#15263d_50%,#1e3a5f_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2">
        {[0, 1, 2].map((i) => (
          <svg key={i} className="absolute inset-x-0" viewBox="0 0 400 60" preserveAspectRatio="none"
            style={{ bottom: i * 28, height: 80, opacity: 0.35 - i * 0.08, animation: `drift ${8 + i * 2}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
            <path d="M0,30 Q100,5 200,30 T400,30 V60 H0 Z" fill={i === 0 ? "#7DD3FC" : i === 1 ? "#F5C46A" : "#fbcfe8"} />
          </svg>
        ))}
      </div>
      <div className="absolute top-[15%] right-[10%] h-20 w-20 rounded-full bg-gradient-to-br from-primary to-emotion blur-2xl opacity-60" />
    </Layer>
  );
}
