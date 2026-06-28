/**
 * Memo — a estrelinha guardiã das memórias.
 * Renderiza as poses oficiais (3D renders) da identidade visual.
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import memoHero from "@/assets/memo/memo-hero.png";
import memoWave from "@/assets/memo/memo-wave.png";
import memoHeart from "@/assets/memo/memo-heart.png";
import memoPhoto from "@/assets/memo/memo-photo.png";
import memoThinking from "@/assets/memo/memo-thinking.png";
import memoCelebrate from "@/assets/memo/memo-celebrate.png";
import memoAvatar from "@/assets/memo/memo-avatar.png";

export type MemoMood =
  | "idle"
  | "wave"
  | "heart"
  | "photo"
  | "thinking"
  | "celebrate"
  | "sleep"
  | "hero"
  | "avatar";

const SRC: Record<MemoMood, string> = {
  idle: memoWave,
  wave: memoWave,
  heart: memoHeart,
  photo: memoPhoto,
  thinking: memoThinking,
  celebrate: memoCelebrate,
  sleep: memoThinking,
  hero: memoHero,
  avatar: memoAvatar,
};

export function Memo({
  mood = "idle",
  size = 96,
  className,
  animate = true,
  alt = "Memo, a estrelinha do Memora",
  priority = false,
}: {
  mood?: MemoMood;
  size?: number;
  className?: string;
  animate?: boolean;
  alt?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span
      className={cn("relative inline-block align-middle", className)}
      style={{ width: size, height: size }}
    >
      {!loaded && (
        <span
          aria-hidden
          className="absolute inset-2 animate-pulse rounded-full bg-primary/15 blur-md"
        />
      )}
      <img
        src={SRC[mood]}
        alt={alt}
        width={size}
        height={size}
        draggable={false}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-expect-error - fetchpriority is valid HTML, not yet in React types in some versions
        fetchpriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "select-none object-contain drop-shadow-[0_10px_30px_rgba(245,196,106,0.35)] transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          animate && loaded && "animate-bob",
        )}
        style={{ width: size, height: size }}
      />
    </span>
  );
}
