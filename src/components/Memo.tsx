/**
 * Memo — a estrelinha guardiã das memórias.
 * Renderiza as poses oficiais (3D renders) da identidade visual.
 */
import { cn } from "@/lib/utils";
import memoHero from "@/assets/memo/memo-hero.webp";
import memoWave from "@/assets/memo/memo-wave.webp";
import memoHeart from "@/assets/memo/memo-heart.webp";
import memoPhoto from "@/assets/memo/memo-photo.webp";
import memoThinking from "@/assets/memo/memo-thinking.webp";
import memoCelebrate from "@/assets/memo/memo-celebrate.webp";
import memoAvatar from "@/assets/memo/memo-avatar.webp";

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
  return (
    <span
      className={cn("relative inline-block align-middle", className)}
      style={{ width: size, height: size }}
    >
      <img
        src={SRC[mood]}
        alt={alt}
        width={size}
        height={size}
        draggable={false}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-expect-error - fetchpriority is valid HTML
        fetchpriority={priority ? "high" : "auto"}
        className={cn(
          "select-none object-contain drop-shadow-[0_10px_30px_rgba(245,196,106,0.35)]",
          animate && "animate-bob",
        )}
        style={{ width: size, height: size }}
      />
    </span>
  );
}
