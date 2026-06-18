import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Image as ImageIcon,
  Loader2,
  Plus,
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
  { n: 4, label: "Visual" },
  { n: 5, label: "Publicar" },
] as const;

function Builder() {
  const { category } = Route.useParams();
  const navigate = useNavigate();
  const step = useBuilder((s) => s.step);
  const next = useBuilder((s) => s.next);
  const prev = useBuilder((s) => s.prev);
  const setCategory = useBuilder((s) => s.setCategory);
  const saving = useBuilder((s) => s.saving);

  // Sync route param into store
  useEffect(() => {
    if (CATEGORIES.some((c) => c.id === category)) {
      setCategory(category as Category);
    }
  }, [category, setCategory]);

  const cat = CATEGORIES.find((c) => c.id === category);

  return (
    <main className="bg-aurora flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-base font-semibold"
          >
            <Heart className="h-4 w-4 text-emotion" fill="currentColor" />
            Memora
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {saving === "saving" && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Salvando…
              </>
            )}
            {saving === "saved" && (
              <>
                <Check className="h-3 w-3 text-success" /> Salvo agora
              </>
            )}
          </div>
          <Link
            to="/criar"
            className="rounded-md p-2 text-muted-foreground hover:bg-card hover:text-foreground"
            aria-label="Sair"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>

        {/* Progress */}
        <div className="mx-auto max-w-5xl px-4 pb-3 sm:px-6">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition",
                    s.n <= step
                      ? "bg-gradient-to-r from-primary to-secondary"
                      : "bg-border",
                  )}
                />
                {i === STEPS.length - 1 && (
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {step}/{STEPS.length}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 hidden justify-between text-xs text-muted-foreground sm:flex">
            {STEPS.map((s) => (
              <span
                key={s.n}
                className={cn(s.n === step && "font-medium text-foreground")}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 pt-8 pb-32 sm:px-6">
        {cat && step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
        {step === 4 && <StepFour />}
        {step === 5 && <StepFive />}
      </div>

      {/* Footer nav */}
      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={() => (step === 1 ? navigate({ to: "/criar" }) : prev())}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-4 py-2.5 text-sm font-medium transition hover:bg-card"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <span className="font-mono text-xs text-muted-foreground">
            Etapa {step} de {STEPS.length}
          </span>
          <button
            onClick={() => {
              if (step === 5) {
                // mock checkout
                alert("Mock: indo para checkout 🎉");
                return;
              }
              next();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold glow-primary transition hover:brightness-110"
          >
            {step === 5 ? "Finalizar e pagar" : "Próximo"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </main>
  );
}

/* ----------------------------- STEP 1 ----------------------------- */

function StepOne() {
  const s = useBuilder();
  const [genLoading, setGenLoading] = useState(false);

  const generate = async () => {
    setGenLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const phrases = [
      `${s.toName || "Você"}, cada dia ao seu lado virou uma página da minha história favorita.`,
      `Tem coisas que a gente não explica, só sente. Você é uma delas, ${s.toName || "amor"}.`,
      `Se o tempo me perguntar onde fui feliz, vou dizer o seu nome: ${s.toName || "você"}.`,
    ];
    s.patch({ openingPhrase: phrases[Math.floor(Math.random() * phrases.length)] });
    setGenLoading(false);
  };

  return (
    <StepShell
      title="Vamos começar"
      subtitle="Para quem é essa homenagem?"
    >
      <Field label="Seu nome">
        <input
          value={s.fromName}
          onChange={(e) => s.patch({ fromName: e.target.value })}
          placeholder="Maria"
          className="memora-input"
        />
      </Field>
      <Field label="Nome de quem recebe">
        <input
          value={s.toName}
          onChange={(e) => s.patch({ toName: e.target.value })}
          placeholder="João"
          className="memora-input"
        />
      </Field>
      <Field label="Data especial" hint="Quando se conheceram, aniversário, etc.">
        <input
          type="date"
          value={s.startDate}
          onChange={(e) => s.patch({ startDate: e.target.value })}
          className="memora-input font-mono"
        />
      </Field>
      <Field label="Frase de abertura">
        <div className="relative">
          <textarea
            value={s.openingPhrase}
            onChange={(e) => s.patch({ openingPhrase: e.target.value })}
            rows={3}
            placeholder="Escreva uma frase que abre o coração…"
            className="memora-input pr-32 resize-none"
          />
          <button
            onClick={generate}
            disabled={genLoading}
            className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-3 py-1.5 text-xs font-medium text-secondary transition hover:bg-primary/25 disabled:opacity-50"
          >
            {genLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            Gerar com IA
          </button>
        </div>
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

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (media.length >= max) return;
      const type: MediaItem["type"] = file.type.startsWith("video")
        ? "video"
        : file.type.startsWith("audio")
        ? "audio"
        : "photo";
      addMedia({
        type,
        url: URL.createObjectURL(file),
        name: file.name,
        caption: "",
      });
    });
  };

  return (
    <StepShell
      title="Adicione as memórias"
      subtitle="Fotos, vídeos e áudios que contam essa história."
    >
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
        }}
        className="glass rounded-2xl p-8 text-center"
      >
        <Upload className="mx-auto h-8 w-8 text-secondary" />
        <p className="mt-3 text-sm">
          Arraste arquivos aqui ou{" "}
          <button
            onClick={() => inputRef.current?.click()}
            className="font-medium text-secondary underline-offset-4 hover:underline"
          >
            escolha do dispositivo
          </button>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {media.length} de {max} {plan === "temporary" ? "(plano Temporário)" : "itens"}
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {media.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {media.map((m) => (
            <div key={m.id} className="group relative overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-square bg-muted">
                {m.type === "photo" && (
                  <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                )}
                {m.type === "video" && (
                  <video src={m.url} className="h-full w-full object-cover" muted />
                )}
                {m.type === "audio" && (
                  <div className="flex h-full items-center justify-center text-secondary">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                <button
                  onClick={() => removeMedia(m.id)}
                  className="absolute right-1.5 top-1.5 rounded-md bg-background/80 p-1.5 text-foreground opacity-0 transition group-hover:opacity-100"
                  aria-label="Remover"
                >
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

/* ----------------------------- STEP 3 ----------------------------- */

function StepThree() {
  const events = useBuilder((s) => s.timeline);
  const addEvent = useBuilder((s) => s.addEvent);
  const removeEvent = useBuilder((s) => s.removeEvent);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    date: "",
    title: "",
    description: "",
    icon: "❤️",
  });

  const icons = ["❤️", "✨", "🌹", "🎉", "📍", "💍", "🌙", "🕯️"];

  return (
    <StepShell
      title="Linha do tempo"
      subtitle="Quais momentos marcaram tudo?"
    >
      <button
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card/40 px-4 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-foreground"
      >
        <Plus className="h-4 w-4" /> Adicionar marco
      </button>

      {events.length > 0 && (
        <ol className="relative mt-6 space-y-4 border-l-2 border-border pl-6">
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
                    <p className="mt-0.5 truncate font-medium">{e.title}</p>
                    {e.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {e.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeEvent(e.id)}
                    className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md glass rounded-t-2xl border-border p-5 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Novo marco</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className="memora-input font-mono"
              />
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Título (ex: Nosso primeiro encontro)"
                className="memora-input"
              />
              <textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                rows={3}
                placeholder="Conta como foi…"
                className="memora-input resize-none"
              />
              <div className="flex flex-wrap gap-2">
                {icons.map((i) => (
                  <button
                    key={i}
                    onClick={() => setDraft({ ...draft, icon: i })}
                    className={cn(
                      "h-9 w-9 rounded-lg border text-base transition",
                      draft.icon === i
                        ? "border-primary bg-primary/15"
                        : "border-border bg-card/60 hover:bg-card",
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
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold glow-primary transition hover:brightness-110 disabled:opacity-40"
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
    await new Promise((r) => setTimeout(r, 1100));
    const story = `Tem histórias que começam sem aviso. A nossa começou ${
      s.startDate ? `em ${new Date(s.startDate).toLocaleDateString("pt-BR")}` : "num desses dias comuns"
    } e, desde então, ${s.toName || "você"} virou capítulo de tudo.\n\nCada foto aqui, cada palavra, cada música, é um pedacinho da gente. Da risada solta no carro, do silêncio bom de domingo de manhã, das brigas que viraram piada.\n\nObrigado por existir. Essa homenagem é pequena pra tudo que você é — mas é minha forma de dizer: eu te escolho, todo dia, de novo. — ${s.fromName || "com amor"}`;
    s.patch({ mainMessage: story });
    setGenLoading(false);
  };

  return (
    <StepShell title="Personalização" subtitle="Como ela vai parecer?">
      <div>
        <p className="mb-3 text-sm font-medium">Template</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => s.patch({ templateId: t.id as TemplateId })}
              className={cn(
                "group overflow-hidden rounded-xl border bg-card/60 text-left transition",
                s.templateId === t.id
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border hover:border-primary/50",
              )}
            >
              <div className={cn("h-20 bg-gradient-to-br", t.swatch)} />
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium">{t.name}</span>
                {s.templateId === t.id && (
                  <Check className="h-4 w-4 text-secondary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Field label="Música (URL Spotify, YouTube ou link MP3)">
        <input
          value={s.musicUrl}
          onChange={(e) => s.patch({ musicUrl: e.target.value })}
          placeholder="https://open.spotify.com/track/…"
          className="memora-input"
        />
      </Field>

      <Field label="Mensagem principal">
        <div className="relative">
          <textarea
            value={s.mainMessage}
            onChange={(e) => s.patch({ mainMessage: e.target.value })}
            rows={8}
            placeholder="Escreva a história que vocês escreveram juntos…"
            className="memora-input resize-none"
          />
          <button
            onClick={generateStory}
            disabled={genLoading}
            className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary/15 px-3 py-2 text-xs font-medium text-secondary transition hover:bg-primary/25 disabled:opacity-50"
          >
            {genLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Gerar história completa com IA
          </button>
        </div>
      </Field>
    </StepShell>
  );
}

/* ----------------------------- STEP 5 ----------------------------- */

function StepFive() {
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

  useEffect(() => {
    if (!sanitized || sanitized.length < 3) {
      setCheck("idle");
      return;
    }
    setCheck("checking");
    const t = setTimeout(() => {
      // Mock: "joao-e-maria" / "teste" pretend taken
      const taken = ["joao-e-maria", "teste", "memora"].includes(sanitized);
      setCheck(taken ? "taken" : "ok");
    }, 500);
    return () => clearTimeout(t);
  }, [sanitized]);

  const suggestions = check === "taken"
    ? [`${sanitized}-${new Date().getFullYear()}`, `${sanitized}-${Math.floor(Math.random() * 99)}`, `para-${sanitized}`]
    : [];

  return (
    <StepShell title="Quase pronto!" subtitle="Como as pessoas vão encontrar?">
      <Field label="URL personalizada">
        <div className="flex items-stretch overflow-hidden rounded-lg border border-border bg-card/60 focus-within:border-primary">
          <span className="flex items-center bg-muted px-3 font-mono text-xs text-muted-foreground">
            memora.app/para/
          </span>
          <input
            value={s.slug}
            onChange={(e) => s.patch({ slug: e.target.value })}
            placeholder="para-joao"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
          />
          <span className="flex w-10 items-center justify-center">
            {check === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {check === "ok" && <Check className="h-4 w-4 text-success" />}
            {check === "taken" && <X className="h-4 w-4 text-destructive" />}
          </span>
        </div>
        {check === "ok" && (
          <p className="mt-2 text-xs text-success">✓ Disponível</p>
        )}
        {check === "taken" && (
          <div className="mt-2 text-xs text-destructive">
            Esse link já existe. Tente:
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {suggestions.map((sg) => (
                <button
                  key={sg}
                  onClick={() => s.patch({ slug: sg })}
                  className="rounded-md bg-card px-2 py-1 font-mono text-[11px] text-foreground hover:bg-primary/20"
                >
                  {sg}
                </button>
              ))}
            </div>
          </div>
        )}
      </Field>

      <div>
        <p className="mb-3 text-sm font-medium">Escolha o plano</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <PlanCard
            id="temporary"
            active={s.plan === "temporary"}
            onClick={() => s.patch({ plan: "temporary" })}
            badge="Último minuto"
            price="R$ 19,90"
            name="Temporário"
            features={["Online por 3 dias", "Até 20 fotos", "QR Code", "Música"]}
            disabled={["Sem linha do tempo", "Sem quiz"]}
          />
          <PlanCard
            id="eternal"
            active={s.plan === "eternal"}
            onClick={() => s.patch({ plan: "eternal" })}
            badge="Mais escolhido"
            highlighted
            price="R$ 29,90"
            name="Eterno"
            features={[
              "Salvo para sempre",
              "Fotos ilimitadas",
              "Linha do tempo",
              "Quiz interativo",
              "Analytics completo",
            ]}
          />
        </div>
      </div>
    </StepShell>
  );
}

/* ----------------------------- shared ----------------------------- */

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function PlanCard({
  active,
  onClick,
  badge,
  highlighted,
  price,
  name,
  features,
  disabled = [],
}: {
  id: Plan;
  active: boolean;
  onClick: () => void;
  badge: string;
  highlighted?: boolean;
  price: string;
  name: string;
  features: string[];
  disabled?: string[];
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border p-5 text-left transition",
        active
          ? "border-primary bg-primary/10 glow-primary"
          : "border-border bg-card/60 hover:border-primary/50",
        highlighted && !active && "ring-1 ring-secondary/30",
      )}
    >
      <span
        className={cn(
          "absolute -top-2.5 left-4 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
          highlighted ? "bg-emotion text-foreground" : "bg-secondary text-secondary-foreground",
        )}
      >
        {badge}
      </span>
      <p className="text-sm text-muted-foreground">{name}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{price}</p>
      <ul className="mt-4 space-y-1.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 shrink-0 text-success" />
            <span>{f}</span>
          </li>
        ))}
        {disabled.map((f) => (
          <li key={f} className="flex items-center gap-2 text-muted-foreground line-through">
            <X className="h-3.5 w-3.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}
