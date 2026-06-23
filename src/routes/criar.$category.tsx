import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Edit3,
  Eye,
  Film,
  Image as ImageIcon,
  Loader2,
  Mic2,
  Palette,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  TEMPLATES,
  useBuilder,
  type Category,
  type MediaItem,
  type Plan,
  type TemplateId,
} from "@/lib/builder-store";
import { cn } from "@/lib/utils";
import { Memo } from "@/components/Memo";
import { TemplateBackdrop } from "@/components/templates/TemplateBackdrop";
import { MusicSearch } from "@/components/MusicSearch";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Tribute } from "@/components/Tribute";

export const Route = createFileRoute("/criar/$category")({
  head: ({ params }) => ({
    meta: [{ title: `Criar homenagem (${params.category}) — Memora` }],
  }),
  component: Builder,
});

const STEPS = [
  { n: 1, label: "Quem é" },
  { n: 2, label: "Mídia" },
  { n: 3, label: "Linha do tempo" },
  { n: 4, label: "Visual & música" },
  { n: 5, label: "Prévia" },
  { n: 6, label: "Publicar" },
] as const;

function Builder() {
  const { category } = Route.useParams();
  const navigate = useNavigate();
  const step = useBuilder((s) => s.step);
  const next = useBuilder((s) => s.next);
  const prev = useBuilder((s) => s.prev);
  const setCategory = useBuilder((s) => s.setCategory);
  const setStep = useBuilder((s) => s.setStep);
  const saving = useBuilder((s) => s.saving);
  const currentCategory = useBuilder((s) => s.category);

  useEffect(() => {
    if (CATEGORIES.some((c) => c.id === category) && currentCategory !== category) {
      setCategory(category as Category);
    }
  }, [category, setCategory, currentCategory]);

  return (
    <main className="bg-warmlight relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" preload="intent" className="flex items-center gap-2 font-display text-base font-bold">
            <Memo mood="avatar" size={26} animate={false} /> Memora
          </Link>
          <SaveIndicator saving={saving} />
          <Link to="/criar" preload="intent" className="rounded-md p-2 text-muted-foreground hover:bg-card hover:text-foreground" aria-label="Sair">
            <X className="h-4 w-4" />
          </Link>
        </div>

        <div className="mx-auto max-w-5xl px-4 pb-3 sm:px-6">
          {/* mobile: step number + progress bar */}
          <div className="flex items-center gap-3 sm:hidden">
            <span className="font-mono text-[11px] text-muted-foreground">{step}/{STEPS.length}</span>
            <div className="flex flex-1 gap-1">
              {STEPS.map((s) => (
                <div key={s.n} className={cn("h-1.5 flex-1 rounded-full", s.n <= step ? "bg-primary" : "bg-border")} />
              ))}
            </div>
          </div>
          {/* desktop: full bar with labels and active underline */}
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              {STEPS.map((s) => (
                <div key={s.n} className={cn("h-1.5 flex-1 rounded-full transition", s.n <= step ? "bg-primary" : "bg-border")} />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px]">
              {STEPS.map((s) => (
                <button
                  key={s.n}
                  onClick={() => s.n < step && setStep(s.n as never)}
                  disabled={s.n >= step}
                  className={cn(
                    "relative pb-1 transition",
                    s.n === step ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground",
                    s.n < step && "cursor-pointer",
                  )}
                >
                  {s.label}
                  {s.n === step && (
                    <span className="absolute -bottom-0.5 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 pt-8 pb-32 sm:px-6">
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
        {step === 4 && <StepFour />}
        {step === 5 && <StepPreview />}
        {step === 6 && <StepPublish />}
      </div>

      {step !== 5 && <PreviewPanel />}

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={() => (step === 1 ? navigate({ to: "/criar" }) : prev())}
            className="btn-ghost text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
            Etapa {step} de {STEPS.length}
          </span>
          <NextButton step={step} onNext={next} />
        </div>
      </footer>
    </main>
  );
}

function NextButton({ step, onNext }: { step: number; onNext: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const handle = () => {
    if (step === 6) {
      setSubmitting(true);
      setTimeout(() => navigate({ to: "/" }), 1800);
      return;
    }
    onNext();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <button onClick={handle} disabled={submitting} className="btn-gold text-sm">
      {submitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Preparando checkout…
        </>
      ) : step === 6 ? (
        <>Finalizar e pagar <Send className="arrow-r h-4 w-4" /></>
      ) : step === 5 ? (
        <>Tudo certo, publicar <ArrowRight className="arrow-r h-4 w-4" /></>
      ) : (
        <>Próximo <ArrowRight className="arrow-r h-4 w-4" /></>
      )}
    </button>
  );
}

function SaveIndicator({ saving }: { saving: "idle" | "saving" | "saved" }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {saving === "saving" && (<><Loader2 className="h-3 w-3 animate-spin" /> Salvando…</>)}
      {saving === "saved" && (
        <span key={Date.now()} className="flex items-center gap-1 animate-in fade-in zoom-in duration-300 text-success">
          <CheckCircle2 className="h-3.5 w-3.5" /> Salvo
        </span>
      )}
    </div>
  );
}

/* ----------------------------- STEP 1 ----------------------------- */

function StepOne() {
  const s = useBuilder();
  const [genLoading, setGenLoading] = useState(false);

  const generate = async () => {
    setGenLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const phrases = [
      `${s.toName || "Você"}, cada dia ao seu lado virou uma página da minha história favorita.`,
      `Tem coisas que a gente não explica, só sente. Você é uma delas, ${s.toName || "amor"}.`,
      `Se o tempo me perguntar onde fui feliz, vou dizer o seu nome: ${s.toName || "você"}.`,
    ];
    s.patch({ openingPhrase: phrases[Math.floor(Math.random() * phrases.length)] });
    setGenLoading(false);
  };

  const max = 140;
  const left = max - s.openingPhrase.length;

  return (
    <StepShell
      icon={<Memo mood="wave" size={88} />}
      eyebrow="Etapa 1"
      title="Para quem é essa história?"
      subtitle="Cada detalhe importa."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Seu nome">
          <input value={s.fromName} onChange={(e) => s.patch({ fromName: e.target.value })} placeholder="Maria" className="memora-input" />
        </Field>
        <Field label="Nome de quem recebe">
          <input value={s.toName} onChange={(e) => s.patch({ toName: e.target.value })} placeholder="João" className="memora-input" />
        </Field>
      </div>
      <Field label="Data especial" hint="Quando se conheceram, aniversário, etc.">
        <input type="date" value={s.startDate} onChange={(e) => s.patch({ startDate: e.target.value })} className="memora-input font-mono" />
      </Field>
      <Field label="Frase de abertura">
        <div className="relative">
          <textarea
            value={s.openingPhrase}
            onChange={(e) => s.patch({ openingPhrase: e.target.value.slice(0, max) })}
            rows={2}
            placeholder="Escreva uma frase que abre o coração…"
            className="memora-input resize-none pr-14"
          />
          <span className={cn(
            "absolute right-3 bottom-2 font-mono text-[10px]",
            left < 20 ? "text-emotion" : "text-muted-foreground/70",
          )}>
            {s.openingPhrase.length}/{max}
          </span>
        </div>
        <button
          onClick={generate}
          disabled={genLoading}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition hover:underline disabled:opacity-50"
        >
          {genLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          Gerar frase com IA
        </button>
      </Field>
    </StepShell>
  );
}

/* ----------------------------- STEP 2 ----------------------------- */

function StepTwo() {
  const media = useBuilder((s) => s.media);
  const addMedia = useBuilder((s) => s.addMedia);
  const removeMedia = useBuilder((s) => s.removeMedia);
  const updateCaption = useBuilder((s) => s.updateMediaCaption);
  const plan = useBuilder((s) => s.plan);
  const inputRef = useRef<HTMLInputElement>(null);
  const max = plan === "temporary" ? 20 : 100;

  const counts = {
    photo: media.filter((m) => m.type === "photo").length,
    video: media.filter((m) => m.type === "video").length,
    audio: media.filter((m) => m.type === "audio").length,
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (media.length >= max) return;
      const type: MediaItem["type"] = file.type.startsWith("video")
        ? "video"
        : file.type.startsWith("audio")
        ? "audio"
        : "photo";
      addMedia({ type, url: URL.createObjectURL(file), name: file.name, caption: "" });
    });
  };

  return (
    <StepShell
      icon={<IconBubble><Camera className="h-6 w-6" /></IconBubble>}
      eyebrow="Etapa 2"
      title="As memórias"
      subtitle="Fotos, vídeos e áudios que contam essa história."
    >
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className="glass cursor-pointer rounded-2xl border-dashed border-primary/40 p-5 text-center transition hover:border-primary hover:bg-primary/5"
      >
        <Upload className="mx-auto h-6 w-6 text-primary" />
        <p className="mt-2 text-sm">
          Arraste ou <span className="font-semibold text-primary underline-offset-4 hover:underline">escolha do dispositivo</span>
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {media.length} de {max} {plan === "temporary" && "(plano Temporário)"}
        </p>
        <input ref={inputRef} type="file" multiple accept="image/*,video/*,audio/*" className="hidden" onChange={(e) => onFiles(e.target.files)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <CountChip icon={<ImageIcon className="h-3.5 w-3.5" />} label="Fotos" n={counts.photo} />
        <CountChip icon={<Film className="h-3.5 w-3.5" />} label="Vídeos" n={counts.video} />
        <CountChip icon={<Mic2 className="h-3.5 w-3.5" />} label="Áudios" n={counts.audio} />
      </div>

      {media.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma memória ainda. <br />
            <span className="text-cream/80">Que tal começar com a foto favorita?</span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {media.map((m) => (
            <div key={m.id} className="group relative overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-square bg-muted">
                {m.type === "photo" && <img src={m.url} alt={m.name} className="h-full w-full object-cover" />}
                {m.type === "video" && <video src={m.url} className="h-full w-full object-cover" muted />}
                {m.type === "audio" && (
                  <div className="flex h-full items-center justify-center text-primary"><Mic2 className="h-8 w-8" /></div>
                )}
                <button onClick={() => removeMedia(m.id)} className="absolute right-1.5 top-1.5 rounded-md bg-background/80 p-1.5 opacity-0 transition group-hover:opacity-100" aria-label="Remover">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                value={m.caption}
                onChange={(e) => updateCaption(m.id, e.target.value)}
                placeholder="Legenda…"
                className="w-full border-t border-border bg-transparent px-2 py-1.5 text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>
          ))}
        </div>
      )}
    </StepShell>
  );
}

function CountChip({ icon, label, n }: { icon: React.ReactNode; label: string; n: number }) {
  const active = n > 0;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
      active ? "border-primary/60 bg-primary/15 text-primary" : "border-border bg-card/40 text-muted-foreground",
    )}>
      {icon} {label}
      <span className={cn("ml-1 font-mono text-[11px]", active ? "text-primary" : "opacity-50")}>{n}</span>
    </span>
  );
}

/* ----------------------------- STEP 3 ----------------------------- */

const SUGGESTED_MARCOS = [
  { title: "Quando nos conhecemos", icon: "✨" },
  { title: "Primeira viagem juntos", icon: "📍" },
  { title: "Um momento que marcou", icon: "❤️" },
];

function StepThree() {
  const events = useBuilder((s) => s.timeline);
  const addEvent = useBuilder((s) => s.addEvent);
  const removeEvent = useBuilder((s) => s.removeEvent);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ date: "", title: "", description: "", icon: "❤️" });

  const icons = ["❤️", "✨", "🌹", "🎉", "📍", "💍", "🌙", "🕯️", "🎓", "🐾"];

  return (
    <StepShell
      icon={<IconBubble><Calendar className="h-6 w-6" /></IconBubble>}
      eyebrow="Etapa 3"
      title="Linha do tempo"
      subtitle="Quais momentos marcaram tudo?"
    >
      {events.length === 0 ? (
        <div className="relative flex flex-col items-center px-6 py-10">
          {/* linha vertical */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed border-primary/40" />
          <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground glow-primary">
            <Plus className="h-4 w-4" />
          </span>
          <p className="relative z-10 mt-3 font-display text-lg font-bold">Seu primeiro marco</p>
          <p className="relative z-10 mt-1 text-center text-xs text-muted-foreground">
            Toque numa sugestão ou crie do zero.
          </p>
          <div className="relative z-10 mt-5 flex flex-wrap justify-center gap-2">
            {SUGGESTED_MARCOS.map((sg) => (
              <button
                key={sg.title}
                onClick={() => { setDraft({ date: "", title: sg.title, description: "", icon: sg.icon }); setOpen(true); }}
                className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium transition hover:border-primary/60 hover:bg-primary/10"
              >
                {sg.icon} {sg.title}
              </button>
            ))}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="relative z-10 mt-5 btn-gold text-sm"
          >
            <Plus className="h-4 w-4" /> Criar marco
          </button>
        </div>
      ) : (
        <>
          <ol className="relative space-y-4 border-l-2 border-primary/40 pl-6">
            {events.map((e) => (
              <li key={e.id} className="relative">
                <span className="absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs glow-primary">
                  {e.icon}
                </span>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-muted-foreground">
                        {new Date(e.date).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="mt-0.5 truncate font-semibold">{e.title}</p>
                      {e.description && <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>}
                    </div>
                    <button onClick={() => removeEvent(e.id)} className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card/40 px-4 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-foreground"
          >
            <Plus className="h-4 w-4" /> Adicionar mais um marco
          </button>
        </>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur sm:items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md glass rounded-t-2xl border-border p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Novo marco</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="memora-input font-mono" />
              <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Título (ex: Nosso primeiro encontro)" className="memora-input" />
              <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={3} placeholder="Conta como foi…" className="memora-input resize-none" />
              <div className="flex flex-wrap gap-2">
                {icons.map((i) => (
                  <button
                    key={i}
                    onClick={() => setDraft({ ...draft, icon: i })}
                    className={cn(
                      "h-9 w-9 rounded-lg border text-base transition",
                      draft.icon === i ? "border-primary bg-primary/15" : "border-border bg-card/60 hover:bg-card",
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <button
                disabled={!draft.date || !draft.title}
                onClick={() => {
                  addEvent(draft);
                  setDraft({ date: "", title: "", description: "", icon: "❤️" });
                  setOpen(false);
                }}
                className="w-full btn-gold justify-center text-sm"
              >
                Adicionar marco
              </button>
            </div>
          </div>
        </div>
      )}
    </StepShell>
  );
}

/* ----------------------------- STEP 4 ----------------------------- */

function StepFour() {
  const s = useBuilder();
  const [genLoading, setGenLoading] = useState(false);

  const generateStory = async () => {
    setGenLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const story = `Tem histórias que começam sem aviso. A nossa começou ${
      s.startDate ? `em ${new Date(s.startDate).toLocaleDateString("pt-BR")}` : "num desses dias comuns"
    } e, desde então, ${s.toName || "você"} virou capítulo de tudo.\n\nCada foto aqui, cada palavra, cada música, é um pedacinho da gente.\n\nObrigado por existir. — ${s.fromName || "com amor"}`;
    s.patch({ mainMessage: story });
    setGenLoading(false);
  };

  return (
    <StepShell
      icon={<IconBubble><Palette className="h-6 w-6" /></IconBubble>}
      eyebrow="Etapa 4"
      title="Visual & música"
      subtitle="Escolha o clima e a trilha sonora."
    >
      <div>
        <p className="mb-3 text-sm font-semibold">Template</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TEMPLATES.map((t) => {
            const active = s.templateId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => s.patch({ templateId: t.id as TemplateId })}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-card/60 text-left transition",
                  active
                    ? "border-primary shadow-[0_0_0_2px_var(--color-primary),0_8px_32px_-6px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
                    : "border-border hover:border-primary/50 hover:-translate-y-0.5",
                )}
              >
                {/* tag de mood no canto superior direito */}
                <span className="absolute right-2 top-2 z-10 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-primary backdrop-blur">
                  {t.mood}
                </span>
                <div className="relative h-28 overflow-hidden bg-night">
                  <div className="transition-transform duration-700 group-hover:scale-110">
                    <TemplateBackdrop template={t.id} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{t.desc}</p>
                  </div>
                  {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Música de fundo">
        <MusicSearch />
      </Field>

      <Field label="Mensagem principal">
        <textarea
          value={s.mainMessage}
          onChange={(e) => s.patch({ mainMessage: e.target.value })}
          rows={7}
          placeholder={`Desde o dia que nos conhecemos, cada momento ao seu lado\nse tornou uma lembrança que quero guardar para sempre…\n\n(escreva com o coração — ou peça pra IA começar)`}
          className="memora-input resize-none placeholder:italic placeholder:text-muted-foreground/40"
        />
        <button
          onClick={generateStory}
          disabled={genLoading}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition hover:underline disabled:opacity-50"
        >
          {genLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Gerar história com IA
        </button>
      </Field>
    </StepShell>
  );
}

/* ----------------------------- STEP 5 — preview final ----------------------------- */

function StepPreview() {
  const category = useBuilder((s) => s.category);
  const fromName = useBuilder((s) => s.fromName);
  const toName = useBuilder((s) => s.toName);
  const startDate = useBuilder((s) => s.startDate);
  const openingPhrase = useBuilder((s) => s.openingPhrase);
  const mainMessage = useBuilder((s) => s.mainMessage);
  const media = useBuilder((s) => s.media);
  const timeline = useBuilder((s) => s.timeline);
  const templateId = useBuilder((s) => s.templateId);
  const music = useBuilder((s) => s.music);
  const setStep = useBuilder((s) => s.setStep);
  const [full, setFull] = useState(false);

  // Dados de exemplo para a prévia parecer viva mesmo sem preenchimento
  const data = {
    category,
    fromName: fromName || "Maria",
    toName: toName || "Você",
    startDate: startDate || new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
    openingPhrase: openingPhrase || "Tem coisas que a gente não explica, só sente.",
    mainMessage: mainMessage || "Cada foto, cada palavra, cada música aqui é um pedacinho da nossa história.",
    media,
    timeline,
    templateId,
    music,
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="text-center">
        <Memo mood="celebrate" size={84} className="mx-auto" />
        <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">Está pronto?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta é a prévia da homenagem. Confira tudo antes de publicar.
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <button onClick={() => setStep(1)} className="btn-ghost text-xs">
            <Edit3 className="h-3.5 w-3.5" /> Editar
          </button>
          <button onClick={() => setFull(true)} className="btn-gold text-xs">
            <Eye className="h-3.5 w-3.5" /> Ver em tela cheia
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary/30 glow-soft">
        <Tribute data={data} compact />
      </div>
      <p className="text-center text-[11px] text-muted-foreground">
        Essa é uma prévia com dados de exemplo. O resultado final usará suas fotos e mensagem reais.
      </p>

      {full && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-background animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Prévia em tela cheia</p>
            <button onClick={() => setFull(false)} className="rounded-md p-2 hover:bg-card" aria-label="Fechar">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Tribute data={data} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- STEP 6 ----------------------------- */

function StepPublish() {
  const s = useBuilder();
  const [check, setCheck] = useState<"idle" | "checking" | "ok" | "taken">("idle");

  const sanitized = useMemo(
    () =>
      s.slug
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50),
    [s.slug],
  );

  const runCheck = () => {
    if (!sanitized || sanitized.length < 3) return;
    setCheck("checking");
    setTimeout(() => {
      const taken = ["joao-e-maria", "teste", "memora"].includes(sanitized);
      setCheck(taken ? "taken" : "ok");
    }, 600);
  };

  const suggestions = check === "taken"
    ? [`${sanitized}-${new Date().getFullYear()}`, `${sanitized}-${Math.floor(Math.random() * 99)}`, `para-${sanitized}`]
    : [];

  return (
    <StepShell
      icon={<IconBubble><Send className="h-5 w-5" /></IconBubble>}
      eyebrow="Última etapa"
      title="Quase pronto!"
      subtitle="Como as pessoas vão encontrar?"
    >
      <Field label="URL personalizada">
        <div className="flex items-stretch overflow-hidden rounded-lg border border-border bg-card/60 focus-within:border-primary">
          <span className="flex items-center bg-muted px-3 font-mono text-xs text-muted-foreground">memora.app/para/</span>
          <input
            value={s.slug}
            onChange={(e) => { s.patch({ slug: e.target.value }); setCheck("idle"); }}
            placeholder="para-joao"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
          />
          <button
            onClick={runCheck}
            disabled={sanitized.length < 3 || check === "checking"}
            className="border-l border-border bg-primary/15 px-3 text-xs font-semibold text-primary transition hover:bg-primary/25 disabled:opacity-40"
          >
            {check === "checking" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Verificar"}
          </button>
        </div>
        {check === "ok" && <p className="mt-2 flex items-center gap-1 text-xs text-success"><Check className="h-3 w-3" /> Disponível</p>}
        {check === "taken" && (
          <div className="mt-2 text-xs text-destructive">
            Esse link já existe. Tente:
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {suggestions.map((sg) => (
                <button key={sg} onClick={() => { s.patch({ slug: sg }); setCheck("idle"); }} className="rounded-md bg-card px-2 py-1 font-mono text-[11px] hover:bg-primary/20">
                  {sg}
                </button>
              ))}
            </div>
          </div>
        )}
      </Field>

      <div>
        <p className="mb-3 text-sm font-semibold">Escolha o plano</p>
        <div className="space-y-3">
          <PlanCard
            id="eternal"
            active={s.plan === "eternal"}
            onClick={() => s.patch({ plan: "eternal" })}
            badge="Mais escolhido"
            highlighted
            price="R$ 29,90"
            name="Eterno"
            tagline="Para memórias que nunca deveriam desaparecer"
            features={["Salvo para sempre", "Fotos ilimitadas", "Linha do tempo completa", "Analytics de reações"]}
          />
          <PlanCard
            id="temporary"
            active={s.plan === "temporary"}
            onClick={() => s.patch({ plan: "temporary" })}
            price="R$ 19,90"
            name="Temporário"
            tagline="Ideal para surpresas rápidas"
            features={["Online por 3 dias", "Até 20 fotos", "QR Code", "Música"]}
            disabled={["Sem linha do tempo"]}
          />
        </div>
      </div>
    </StepShell>
  );
}

/* ----------------------------- shared ----------------------------- */

function StepShell({
  icon,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-start gap-4">
        <div className="shrink-0">{icon}</div>
        <div className="flex-1 pt-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80">{eyebrow}</p>
          <h1 className="mt-1 font-display text-[1.85rem] leading-tight font-extrabold sm:text-4xl">{title}</h1>
          <p className="mt-1.5 text-sm text-cream/60">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary glow-soft">
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function PlanCard({ active, onClick, badge, highlighted, price, name, tagline, features, disabled = [] }: {
  id: Plan; active: boolean; onClick: () => void; badge?: string; highlighted?: boolean;
  price: string; name: string; tagline: string; features: string[]; disabled?: string[];
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full rounded-2xl border p-5 text-left transition",
        active ? "border-primary bg-primary/10 glow-primary" : "border-border bg-card/60 hover:border-primary/50",
        highlighted && !active && "ring-1 ring-primary/30",
      )}
    >
      {badge && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
          {badge}
        </span>
      )}
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold">{name}</p>
          <p className="text-xs text-muted-foreground">{tagline}</p>
        </div>
        <p className="font-display text-2xl font-extrabold text-primary">{price}</p>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 shrink-0 text-success" /><span>{f}</span></li>
        ))}
        {disabled.map((f) => (
          <li key={f} className="flex items-center gap-2 text-muted-foreground line-through"><X className="h-3.5 w-3.5 shrink-0" /><span>{f}</span></li>
        ))}
      </ul>
    </button>
  );
}
