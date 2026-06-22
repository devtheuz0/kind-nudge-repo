import { create } from "zustand";

export type Category =
  | "amor"
  | "mae"
  | "pai"
  | "amiga"
  | "filho"
  | "avos"
  | "casamento"
  | "aniversario"
  | "formatura"
  | "pet"
  | "empresa"
  | "memoria";

export const CATEGORIES: {
  id: Category;
  emoji: string;
  label: string;
  hint: string;
  defaultTemplate: TemplateId;
}[] = [
  { id: "amor",        emoji: "❤️", label: "Para quem amo",   hint: "Namoro, paixão, alma gêmea",   defaultTemplate: "coracao" },
  { id: "mae",         emoji: "🌷", label: "Para minha mãe",   hint: "Dia das mães, agradecimento",  defaultTemplate: "jardim" },
  { id: "pai",         emoji: "⭐", label: "Para meu pai",     hint: "Pai herói, gratidão",          defaultTemplate: "constelacao" },
  { id: "amiga",       emoji: "💛", label: "Para amiga(o)",    hint: "Amizade que vira família",     defaultTemplate: "jardim" },
  { id: "filho",       emoji: "🧸", label: "Para meu filho(a)",hint: "Crescimento, primeiros passos",defaultTemplate: "polaroid" },
  { id: "avos",        emoji: "👵", label: "Para os avós",     hint: "Histórias de uma vida",        defaultTemplate: "memoria" },
  { id: "casamento",   emoji: "💍", label: "Casamento / Bodas",hint: "Aniversário de casamento",     defaultTemplate: "bodas" },
  { id: "aniversario", emoji: "🎂", label: "Aniversário",      hint: "Surpresa especial",            defaultTemplate: "polaroid" },
  { id: "formatura",   emoji: "🎓", label: "Formatura",        hint: "Conquista, vitória",           defaultTemplate: "constelacao" },
  { id: "pet",         emoji: "🐾", label: "Para o pet",       hint: "Melhor amigo de 4 patas",      defaultTemplate: "patinhas" },
  { id: "empresa",     emoji: "🏆", label: "Time / Empresa",   hint: "Reconhecimento profissional",  defaultTemplate: "constelacao" },
  { id: "memoria",     emoji: "🕯️", label: "Em memória de...", hint: "Quem partiu e vive na gente",  defaultTemplate: "vela" },
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
  | "coracao"
  | "jardim"
  | "constelacao"
  | "polaroid"
  | "patinhas"
  | "vela"
  | "bodas";

export const TEMPLATES: {
  id: TemplateId;
  name: string;
  desc: string;
  mood: string; // e.g. "Romântico"
  accent: string; // hex for theming
}[] = [
  { id: "coracao",     name: "Coração Pulsante", desc: "Corações flutuantes e pulsação ao ritmo do amor",        mood: "Amor",        accent: "#F43F5E" },
  { id: "jardim",      name: "Jardim de Memórias", desc: "Pétalas caem suavemente sobre suas lembranças",         mood: "Carinho",     accent: "#F5C46A" },
  { id: "constelacao", name: "Constelação",       desc: "Estrelas se conectam formando sua história",              mood: "Eternidade",  accent: "#E6EBFF" },
  { id: "polaroid",    name: "Polaroids",         desc: "Fotos antigas caindo, espalhadas com carinho",            mood: "Nostalgia",   accent: "#FFF4E1" },
  { id: "patinhas",    name: "Patinhas",          desc: "Pegadas aparecem no caminho do seu pet",                  mood: "Companhia",   accent: "#D4A574" },
  { id: "vela",        name: "Vela Eterna",       desc: "Uma chama suave tremula em memória",                      mood: "Saudade",     accent: "#F5C46A" },
  { id: "bodas",       name: "Bodas de Ouro",     desc: "Partículas douradas celebram a vida em comum",            mood: "Celebração",  accent: "#F5C46A" },
];

export type Plan = "temporary" | "eternal";

export type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  previewUrl: string;
};

type BuilderState = {
  step: 1 | 2 | 3 | 4 | 5 | 6;
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
  setMusic: (m: MusicTrack | null) => void;
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
  templateId: "coracao" as TemplateId,
  music: null,
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
    if (s < 6) set({ step: (s + 1) as BuilderState["step"] });
  },
  prev: () => {
    const s = get().step;
    if (s > 1) set({ step: (s - 1) as BuilderState["step"] });
  },
  setCategory: (category) => {
    const cat = CATEGORIES.find((c) => c.id === category);
    set({ category, templateId: cat?.defaultTemplate ?? "coracao" });
  },
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
  setMusic: (music) => set({ music }),
  reset: () => set(initial),
}));

// Autosave indicator — guarded against infinite loop:
// only react to *data* changes, and bail when already saving/saved transitions.
let saveTimer: ReturnType<typeof setTimeout> | null = null;
useBuilder.subscribe((state, prev) => {
  // Ignore meta-only changes (step / saving) to avoid recursion.
  if (state.saving !== prev.saving) return;
  if (state.step !== prev.step) return;
  // Shallow check on data fields
  const changed =
    state.fromName !== prev.fromName ||
    state.toName !== prev.toName ||
    state.startDate !== prev.startDate ||
    state.openingPhrase !== prev.openingPhrase ||
    state.mainMessage !== prev.mainMessage ||
    state.media !== prev.media ||
    state.timeline !== prev.timeline ||
    state.templateId !== prev.templateId ||
    state.music !== prev.music ||
    state.slug !== prev.slug ||
    state.plan !== prev.plan ||
    state.category !== prev.category;
  if (!changed) return;
  if (saveTimer) clearTimeout(saveTimer);
  // Show "saving" only if not already
  if (useBuilder.getState().saving !== "saving") {
    useBuilder.setState({ saving: "saving" });
  }
  saveTimer = setTimeout(() => {
    useBuilder.setState({ saving: "saved" });
  }, 600);
});
