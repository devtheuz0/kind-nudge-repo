import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Memo } from "@/components/Memo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Memora — Transformando memórias em presentes inesquecíveis" },
      {
        name: "description",
        content:
          "Crie uma homenagem digital imersiva com fotos, vídeos, música e linha do tempo. O Memo te guia em cada passo.",
      },
      { property: "og:title", content: "Memora — Homenagens digitais" },
      { property: "og:description", content: "O presente que fica para sempre." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="bg-night starfield min-h-screen text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="inline-flex"><Memo size={36} animate={false} /></span>
          <span>Memora</span>
        </Link>
        <Link
          to="/criar"
          preload="intent"
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground glow-primary transition hover:brightness-110"
        >
          Começar agora
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-12 pb-20 sm:pt-20 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-cream/80">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            +12.400 homenagens criadas
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] font-extrabold sm:text-6xl">
            Transformando memórias em{" "}
            <span className="text-primary">presentes inesquecíveis</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-cream/75 sm:text-lg">
            Fotos, vídeos, música e uma linha do tempo num só lugar mágico.
            O Memo, nossa estrelinha guardiã, te guia em cada passo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/criar"
              preload="intent"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground glow-primary transition hover:brightness-110"
            >
              Criar minha homenagem <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="rounded-full border border-cream/20 bg-white/5 px-6 py-3.5 text-base font-medium text-cream transition hover:bg-white/10">
              Ver exemplo
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-xs text-cream/70">
            <span>✦ Fácil de usar</span>
            <span>♥ Feito com amor</span>
            <span>🔒 100% seguro</span>
            <span>★ Momentos eternos</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <Memo mood="heart" size={280} />
        </div>
      </section>

      {/* Meet Memo */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-card/60 p-8 backdrop-blur">
          <div className="grid gap-8 sm:grid-cols-[auto,1fr] sm:items-center">
            <Memo mood="wave" size={120} />
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary">
                Conheça o Memo
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold">
                O guardião das memórias
              </h2>
              <p className="mt-3 text-cream/80">
                O Memo é uma estrelinha cheia de luz e significado. Ele te
                acompanha em cada etapa para criar homenagens que emocionam
                e conectam.
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { mood: "wave", t: "Oi! Eu sou o Memo!" },
              { mood: "heart", t: "Vamos criar algo inesquecível?" },
              { mood: "photo", t: "Adicione fotos e músicas" },
              { mood: "celebrate", t: "Um presente para sempre!" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl bg-white/5 p-4 text-center">
                <Memo mood={s.mood as never} size={64} />
                <p className="mt-2 text-xs text-cream/80">{s.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
