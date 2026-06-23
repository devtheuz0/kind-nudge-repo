import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, ImageIcon, Music2, Sparkles, Star } from "lucide-react";
import { Memo } from "@/components/Memo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Memora — Transformando memórias em presentes inesquecíveis" },
      {
        name: "description",
        content:
          "Crie uma homenagem digital imersiva com fotos, vídeos, música e linha do tempo. O Memo te guia em cada passo. Pronto em 5 minutos.",
      },
      { property: "og:title", content: "Memora — Homenagens digitais" },
      { property: "og:description", content: "O presente que fica para sempre." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="bg-warmlight starfield min-h-screen overflow-hidden text-foreground">
      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <Memo mood="avatar" size={36} animate={false} />
          <span>Memora</span>
        </Link>
        <Link to="/criar" preload="intent" className="btn-gold text-sm">
          Começar <ArrowRight className="arrow-r h-4 w-4" />
        </Link>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pt-8 pb-16 sm:px-6 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div className="relative z-10 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" /> +12.400 homenagens criadas
          </span>
          <h1 className="mt-5 font-display text-[2.4rem] leading-[1.02] font-extrabold tracking-tight sm:text-6xl">
            O presente que <span className="text-primary">não cabe</span><br className="hidden sm:block" />
            numa caixa.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[15px] text-cream/75 sm:text-lg lg:mx-0">
            Reúna fotos, vídeos, áudios, linha do tempo e a música preferida
            numa página inesquecível. Pronto em <strong className="text-cream">5 minutos</strong>.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start">
            <Link to="/criar" preload="intent" className="btn-gold px-7 py-4 text-base">
              Criar minha homenagem <ArrowRight className="arrow-r h-4 w-4" />
            </Link>
            <a href="#como-funciona" className="btn-ghost text-sm">Como funciona</a>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-cream/65 lg:justify-start">
            <li className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-primary" /> Feito com amor</li>
            <li className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary" /> 4.9/5 emoção</li>
            <li className="flex items-center gap-1.5"><Music2 className="h-3.5 w-3.5 text-primary" /> Música embutida</li>
          </ul>
        </div>

        {/* Memo hero */}
        <div className="relative mx-auto flex h-[340px] w-full max-w-md items-center justify-center sm:h-[440px]">
          <div className="absolute h-72 w-72 animate-pulse rounded-full bg-primary/25 blur-3xl" />
          <Memo mood="hero" size={380} className="relative z-10 drop-shadow-[0_20px_60px_rgba(245,196,106,0.55)]" />
          {/* speech bubble */}
          <div className="absolute left-[8%] top-[12%] hidden rounded-2xl rounded-bl-sm border border-primary/40 bg-card/90 px-3 py-2 text-xs font-medium text-cream shadow-lg backdrop-blur sm:block animate-pop-in">
            Oi! Eu sou o Memo ✨
          </div>
          <div className="absolute right-[6%] bottom-[14%] hidden rounded-2xl rounded-br-sm border border-primary/40 bg-card/90 px-3 py-2 text-xs font-medium text-cream shadow-lg backdrop-blur sm:block animate-pop-in" style={{ animationDelay: "0.6s" }}>
            Vamos criar algo eterno?
          </div>
        </div>
      </section>

      {/* como funciona */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">Como funciona</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">3 passos. Zero fricção.</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { n: 1, mood: "wave" as const, title: "Conta a história", desc: "Nome, data, frase de abertura. Sem complicação." },
            { n: 2, mood: "photo" as const, title: "Solta as memórias", desc: "Fotos, vídeos, áudios e a música que define vocês." },
            { n: 3, mood: "celebrate" as const, title: "Compartilha o link", desc: "Manda o QR Code ou link. O presente acontece." },
          ].map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-white/10 bg-card/50 p-6 text-center backdrop-blur">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 font-mono text-[11px] font-bold text-primary-foreground">0{s.n}</span>
              <Memo mood={s.mood} size={88} className="mx-auto" />
              <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-cream/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* prova social rápida */}
      <section className="mx-auto max-w-5xl px-5 pb-24 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-card/40 p-7 backdrop-blur sm:p-10">
          <div className="grid gap-6 sm:grid-cols-3 sm:items-center">
            <blockquote className="sm:col-span-2 text-lg text-cream/90 sm:text-xl">
              <span className="text-3xl leading-none text-primary">"</span>
              Meu pai chorou. Minha mãe chorou. Eu chorei. Foi o melhor presente
              que já dei na vida.
              <span className="text-3xl leading-none text-primary">"</span>
              <footer className="mt-3 text-sm text-cream/60 not-italic">— Camila, 32</footer>
            </blockquote>
            <div className="text-center">
              <Link to="/criar" preload="intent" className="btn-gold w-full justify-center text-sm">
                Criar a minha <ArrowRight className="arrow-r h-4 w-4" />
              </Link>
              <p className="mt-3 text-[11px] text-cream/55">A partir de R$ 19,90</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-cream/45">
        <div className="flex items-center justify-center gap-2">
          <ImageIcon className="h-3 w-3" /> Memora · feito com ♥ em São Paulo
        </div>
      </footer>
    </main>
  );
}
