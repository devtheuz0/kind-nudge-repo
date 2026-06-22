/**
 * Memo — a estrelinha guardiã das memórias do Memora.
 * SVG inline com variantes de pose. Animação suave por CSS.
 */
import { cn } from "@/lib/utils";

export type MemoMood =
  | "idle"
  | "wave"
  | "heart"
  | "photo"
  | "thinking"
  | "celebrate"
  | "sleep";

export function Memo({
  mood = "idle",
  size = 96,
  className,
  animate = true,
}: {
  mood?: MemoMood;
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        animate && "animate-bob",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className="drop-shadow-[0_8px_28px_rgba(245,196,106,0.45)]"
      >
        {/* glow */}
        <defs>
          <radialGradient id="memo-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#F5C46A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F5C46A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="memo-body" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#FFE9A8" />
            <stop offset="55%" stopColor="#F5C46A" />
            <stop offset="100%" stopColor="#D89B2C" />
          </radialGradient>
        </defs>

        <circle cx="60" cy="60" r="55" fill="url(#memo-glow)" />

        {/* star body */}
        <path
          d="M60 18 L72 50 L106 52 L78 72 L88 104 L60 86 L32 104 L42 72 L14 52 L48 50 Z"
          fill="url(#memo-body)"
          stroke="#B8801F"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* antenninha com bolinha */}
        <path
          d="M60 18 Q66 8 72 6"
          stroke="#B8801F"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="73" cy="5.5" r="3.5" fill="#FFE9A8" stroke="#B8801F" strokeWidth="0.8" />

        {/* eyes */}
        <Eyes mood={mood} />

        {/* mouth */}
        <Mouth mood={mood} />

        {/* accessory by mood */}
        {mood === "heart" && (
          <path
            d="M60 76 C53 70, 45 76, 50 84 L60 92 L70 84 C75 76, 67 70, 60 76 Z"
            fill="#F43F5E"
            className="animate-heartbeat"
            style={{ transformOrigin: "60px 84px" }}
          />
        )}
        {mood === "photo" && (
          <g transform="translate(72 70) rotate(8)">
            <rect width="28" height="22" rx="3" fill="#FFF4E1" stroke="#B8801F" strokeWidth="0.8" />
            <circle cx="9" cy="9" r="3" fill="#F5C46A" />
            <path d="M3 19 L11 12 L17 17 L25 9 L25 19 Z" fill="#1E3A5F" />
          </g>
        )}

        {/* sparkles */}
        <g fill="#FFE9A8" opacity="0.8" className="animate-pulse">
          <path d="M14 30 l2 -4 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 z" />
          <path d="M100 86 l1.5 -3 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 z" />
        </g>
      </svg>
    </div>
  );
}

function Eyes({ mood }: { mood: MemoMood }) {
  if (mood === "sleep") {
    return (
      <>
        <path d="M44 56 q4 -4 8 0" stroke="#0D1B2A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M68 56 q4 -4 8 0" stroke="#0D1B2A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "celebrate" || mood === "wave") {
    return (
      <>
        <path d="M42 58 q6 -8 12 0" stroke="#0D1B2A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M66 58 q6 -8 12 0" stroke="#0D1B2A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </>
    );
  }
  // default round eyes with shine
  return (
    <>
      <ellipse cx="48" cy="58" rx="4.5" ry="5.5" fill="#0D1B2A" />
      <ellipse cx="72" cy="58" rx="4.5" ry="5.5" fill="#0D1B2A" />
      <circle cx="49.5" cy="56" r="1.4" fill="#FFFFFF" />
      <circle cx="73.5" cy="56" r="1.4" fill="#FFFFFF" />
    </>
  );
}

function Mouth({ mood }: { mood: MemoMood }) {
  switch (mood) {
    case "thinking":
      return <path d="M54 72 q6 2 12 0" stroke="#0D1B2A" strokeWidth="2.2" fill="none" strokeLinecap="round" />;
    case "celebrate":
      return (
        <path d="M50 68 q10 14 20 0 q-10 6 -20 0 z" fill="#0D1B2A" />
      );
    case "wave":
    case "heart":
    case "photo":
    case "idle":
    default:
      return (
        <path
          d="M50 70 q10 10 20 0"
          stroke="#0D1B2A"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
      );
  }
}
