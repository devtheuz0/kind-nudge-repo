import { create } from "zustand";

export type Category =
  | "amor"
  | "mae"
  | "pai"
  | "amiga"
  | "formatura"
  | "memoria";

export const CATEGORIES: { id: Category; emoji: string; label: string }[] = [
  { id: "amor", emoji: "❤️", label: "Para quem amo" },
  { id: "mae", emoji: "👩‍👧", label: "Para minha mãe" },
  { id: "pai", emoji: "👴", label: "Para meu pai" },
  { id: "amiga", emoji: "👯", label: "Para minha amiga" },
  { id: "formatura", emoji: "🎓", label: "Formatura/Conquista" },
  { id: "memoria", emoji: "🕯️", label: "Em memória de..." },
];

export type MediaItem = {
  id: string;
  type: "photo" | "video" | "audio";
  url: string;
  name: string;
  caption: string;
};

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
};

export type TemplateId =
  | "aurora"
  | "serenata"
  | "eternidade"
  | "jardim"
  | "oceano"
  | "memoria";

export const TEMPLATES: {
  id: TemplateId;
  name: string;
  color: string;
  swatch: string;
}[] = [
  { id: "aurora", name: "Aurora", color: "#7C3AED", swatch: "from-violet-600 to-fuchsia-500" },
  { id: "serenata", name: "Serenata", color: "#F43F5E", swatch: "from-rose-500 to-orange-400" },
  { id: "eternidade", name: "Eternidade", color: "#D4AF37", swatch: "from-zinc-900 to-amber-500" },
  { id: "jardim", name: "Jardim", color: "#10B981", swatch: "from-emerald-600 to-lime-400" },
  { id: "oceano", name: "Oceano", color: "#2563EB", swatch: "from-blue-700 to-cyan-400" },
  { id: "memoria", name: "Memória", color: "#A16207", swatch: "from-stone-700 to-amber-700" },
];

export type Plan = "temporary" | "eternal";

type BuilderState = {
  step: 1 | 2 | 3 | 4 | 5;
  category: Category | null;
  fromName: string;
  toName: string;
  startDate: string;
  openingPhrase: string;
  mainMessage: string;
  media: MediaItem[];
  timeline: TimelineEvent[];
  templateId: TemplateId;
  musicUrl: string;
  slug: string;
  plan: Plan;
  saving: "idle" | "saving" | "saved";

  setStep: (s: BuilderState["step"]) => void;
  next: () => void;
  prev: () => void;
  setCategory: (c: Category) => void;
  patch: (p: Partial<BuilderState>) => void;
  addMedia: (m: Omit<MediaItem, "id">) => void;
  removeMedia: (id: string) => void;
  updateMediaCaption: (id: string, caption: string) => void;
  addEvent: (e: Omit<TimelineEvent, "id">) => void;
  removeEvent: (id: string) => void;
  reset: () => void;
};

const initial = {
  step: 1 as const,
  category: null,
  fromName: "",
  toName: "",
  startDate: "",
  openingPhrase: "",
  mainMessage: "",
  media: [],
  timeline: [],
  templateId: "aurora" as TemplateId,
  musicUrl: "",
  slug: "",
  plan: "eternal" as Plan,
  saving: "idle" as const,
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const useBuilder = create<BuilderState>((set, get) => ({
  ...initial,
  setStep: (step) => set({ step }),
  next: () => {
    const s = get().step;
    if (s < 5) set({ step: (s + 1) as BuilderState["step"] });
  },
  prev: () => {
    const s = get().step;
    if (s > 1) set({ step: (s - 1) as BuilderState["step"] });
  },
  setCategory: (category) => set({ category }),
  patch: (p) => set(p as BuilderState),
  addMedia: (m) =>
    set((s) => ({ media: [...s.media, { ...m, id: uid() }] })),
  removeMedia: (id) =>
    set((s) => ({ media: s.media.filter((m) => m.id !== id) })),
  updateMediaCaption: (id, caption) =>
    set((s) => ({
      media: s.media.map((m) => (m.id === id ? { ...m, caption } : m)),
    })),
  addEvent: (e) =>
    set((s) => ({
      timeline: [...s.timeline, { ...e, id: uid() }].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    })),
  removeEvent: (id) =>
    set((s) => ({ timeline: s.timeline.filter((e) => e.id !== id) })),
  reset: () => set(initial),
}));

// Mock autosave indicator
let saveTimer: ReturnType<typeof setTimeout> | null = null;
useBuilder.subscribe((state, prev) => {
  // ignore meta keys
  if (state.step !== prev.step || state.saving !== prev.saving) return;
  useBuilder.setState({ saving: "saving" });
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    useBuilder.setState({ saving: "saved" });
  }, 800);
});
