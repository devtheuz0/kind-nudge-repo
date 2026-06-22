/**
 * Cenário animado por trás da homenagem. Um por TemplateId.
 * Tudo em CSS puro — leve, sem libs.
 */
import { useMemo } from "react";
import type { TemplateId } from "@/lib/builder-store";

export function TemplateBackdrop({ template }: { template: TemplateId }) {
  switch (template) {
    case "coracao":      return <Coracao />;
    case "jardim":       return <Jardim />;
    case "constelacao":  return <Constelacao />;
    case "polaroid":     return <Polaroid />;
    case "patinhas":     return <Patinhas />;
    case "vela":         return <Vela />;
    case "bodas":        return <Bodas />;
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
        {/* connecting lines (decorative) */}
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

function Polaroid() {
  return (
    <Layer>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,244,225,0.12),_transparent_70%)]" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute h-24 w-20 bg-cream/90 shadow-xl"
          style={{
            top: `${10 + i * 14}%`,
            left: `${(i % 2 === 0 ? 5 : 80) + (i * 2)}%`,
            transform: `rotate(${i % 2 === 0 ? -8 : 6}deg)`,
            background: "#FFF4E1",
          }}
        >
          <div className="m-2 h-14 w-16 bg-navy/60" />
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
