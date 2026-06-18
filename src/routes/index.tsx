import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Memora — Homenagens digitais que ficam para sempre" },
      {
        name: "description",
        content:
          "Crie uma homenagem digital imersiva com fotos, vídeos, áudios e linha do tempo. Pago uma vez, lembrado para sempre.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="bg-aurora min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <Heart className="h-5 w-5 text-emotion" fill="currentColor" />
          Memora
        </Link>
        <Link
          to="/criar"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium glow-primary transition hover:brightness-110"
        >
          Criar homenagem
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-24 text-center sm:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-secondary" />
          +12.400 homenagens criadas
        </span>
        <h1 className="mt-6 font-display text-5xl leading-tight font-semibold sm:text-6xl">
          A homenagem que vai{" "}
          <span className="bg-gradient-to-r from-secondary to-emotion bg-clip-text text-transparent">
            guardar para sempre
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          Fotos, vídeos, áudios e histórias em uma página imersiva. Pago uma vez,
          lembrado para sempre.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/criar"
            className="w-full rounded-lg bg-primary px-6 py-3 text-base font-medium glow-primary transition hover:brightness-110 sm:w-auto"
          >
            Criar minha homenagem
          </Link>
          <button className="w-full rounded-lg border border-border bg-card/60 px-6 py-3 text-base font-medium transition hover:bg-card sm:w-auto">
            Ver exemplo
          </button>
        </div>
      </section>
    </main>
  );
}
