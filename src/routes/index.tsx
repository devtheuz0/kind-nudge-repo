import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, FolderHeart, Heart, ImageIcon, Infinity as InfinityIcon, Music2, QrCode, Shield, Sparkles, Star, Timer } from "lucide-react";
import { useState } from "react";
import { Memo } from "@/components/Memo";
import { TemplateBackdrop } from "@/components/templates/TemplateBackdrop";
import { TEMPLATES } from "@/lib/builder-store";
import { cn } from "@/lib/utils";

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
        <nav className="hidden items-center gap-6 text-sm text-cream/70 md:flex">
          <a href="#templates" className="hover:text-cream">Templates</a>
          <a href="#como-funciona" className="hover:text-cream">Como funciona</a>
          <a href="#precos" className="hover:text-cream">Preços</a>
          <a href="#faq" className="hover:text-cream">Perguntas</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/minhas"
            preload="intent"
            className="btn-ghost text-xs sm:text-sm"
            aria-label="Minhas homenagens"
          >
            <FolderHeart className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">Meus</span>
          </Link>
          <Link to="/criar" preload="intent" className="btn-gold text-xs sm:text-sm">
            Começar <ArrowRight className="arrow-r h-4 w-4" />
          </Link>
        </div>
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
            <a href="#templates" className="btn-ghost text-sm">Ver templates</a>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-cream/65 lg:justify-start">
            <li className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-primary" /> Feito com amor</li>
            <li className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary" /> 4.9/5 emoção</li>
            <li className="flex items-center gap-1.5"><Music2 className="h-3.5 w-3.5 text-primary" /> Música embutida</li>
            <li className="flex items-center gap-1.5"><QrCode className="h-3.5 w-3.5 text-primary" /> QR Code</li>
          </ul>
        </div>

        {/* Memo hero */}
        <div className="relative mx-auto flex h-[340px] w-full max-w-md items-center justify-center sm:h-[440px]">
          <div className="absolute h-72 w-72 animate-pulse rounded-full bg-primary/25 blur-3xl" />
          <Memo mood="hero" size={380} className="relative z-10 drop-shadow-[0_20px_60px_rgba(245,196,106,0.55)]" />
          <div className="absolute left-[8%] top-[12%] hidden rounded-2xl rounded-bl-sm border border-primary/40 bg-card/90 px-3 py-2 text-xs font-medium text-cream shadow-lg backdrop-blur sm:block animate-pop-in">
            Oi! Eu sou o Memo ✨
          </div>
          <div className="absolute right-[6%] bottom-[14%] hidden rounded-2xl rounded-br-sm border border-primary/40 bg-card/90 px-3 py-2 text-xs font-medium text-cream shadow-lg backdrop-blur sm:block animate-pop-in" style={{ animationDelay: "0.6s" }}>
            Vamos criar algo eterno?
          </div>
        </div>
      </section>

      {/* logos / números */}
      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-6">
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-card/40 p-6 backdrop-blur sm:grid-cols-4">
          {[
            { k: "12.4k+", v: "Homenagens criadas" },
            { k: "98%", v: "Recomendam" },
            { k: "180+", v: "Cidades no Brasil" },
            { k: "4.9/5", v: "Avaliação média" },
          ].map((s) => (
            <div key={s.v} className="text-center">
              <p className="font-display text-2xl font-extrabold text-primary sm:text-3xl">{s.k}</p>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-cream/55">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* templates showcase */}
      <section id="templates" className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">Templates</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Cada homenagem tem seu clima.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-cream/65">
            {TEMPLATES.length} templates animados, do romântico ao cinematográfico — sua história escolhe o cenário.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 transition hover:-translate-y-1 hover:border-primary/60">
              <div className="relative h-40 overflow-hidden" style={{ background: "linear-gradient(180deg,#0b1526,#15263d)" }}>
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <TemplateBackdrop template={t.id} />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-2 text-center">
                  <p className="font-display text-[13px] font-bold text-cream" style={{ textShadow: "0 2px 8px rgba(0,0,0,.7)" }}>{t.name}</p>
                </div>
              </div>
              <div className="px-3 py-2">
                <p className="text-[10px] font-bold tracking-widest text-primary">{t.mood.toUpperCase()}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-cream/65">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* recursos */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">Recursos</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Tudo o que faltava num presente.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <ImageIcon className="h-5 w-5" />, title: "Galeria deslizável", desc: "Fotos viram polaroids num carrossel que reage ao toque." },
            { icon: <Music2 className="h-5 w-5" />, title: "Trilha de verdade", desc: "Música embutida com player estilo Spotify e barra de progresso." },
            { icon: <Timer className="h-5 w-5" />, title: "Contador ao vivo", desc: "Anos, meses, dias e horas desde a data que importa." },
            { icon: <QrCode className="h-5 w-5" />, title: "QR Code físico", desc: "Cole no presente, no convite, no quadro. Funciona em qualquer celular." },
            { icon: <InfinityIcon className="h-5 w-5" />, title: "Link vitalício", desc: "Sua homenagem pode viver para sempre — você decide." },
            { icon: <Shield className="h-5 w-5" />, title: "Privacidade real", desc: "Só quem tem o link acessa. Sem rede social, sem ruído." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur transition hover:border-primary/40">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">{f.icon}</div>
              <p className="mt-3 font-display text-base font-bold">{f.title}</p>
              <p className="mt-1 text-sm text-cream/65">{f.desc}</p>
            </div>
          ))}
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

      {/* preços */}
      <section id="precos" className="mx-auto max-w-5xl px-5 pb-20 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">Preços</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Pagamento único. Sem assinatura.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <PriceCard
            tag="Último minuto"
            price="R$ 19,90"
            name="Temporário"
            sub="Online por 3 dias"
            features={["Até 20 fotos", "Música embutida", "QR Code", "Todos os templates"]}
          />
          <PriceCard
            highlighted
            tag="Mais escolhido"
            price="R$ 29,90"
            name="Eterno"
            sub="Salvo para sempre"
            features={["Fotos ilimitadas", "Linha do tempo completa", "Reações dos visitantes", "Analytics de visitas"]}
          />
        </div>
      </section>

      {/* depoimentos */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">Quem deu chorou</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Histórias reais.</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Meu pai chorou. Minha mãe chorou. Eu chorei. Foi o melhor presente que já dei.", a: "Camila, 32" },
            { t: "Casei semana passada. A homenagem foi exibida no telão da festa. Foi mágico.", a: "Bruno e Lia" },
            { t: "Minha vó faleceu. Esse foi o jeito de manter ela perto. Obrigada, Memora.", a: "Patrícia, 45" },
          ].map((q) => (
            <blockquote key={q.a} className="rounded-2xl border border-white/10 bg-card/40 p-6 text-sm text-cream/85 backdrop-blur">
              <span className="text-3xl leading-none text-primary">"</span>
              {q.t}
              <footer className="mt-3 text-xs text-cream/55 not-italic">— {q.a}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 pb-20 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">Perguntas</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">A gente respondeu antes.</h2>
        </div>
        <div className="mt-8 space-y-2">
          {[
            { q: "Como a pessoa recebe a homenagem?", a: "Você recebe um link único + um QR Code. Pode mandar no WhatsApp, imprimir num cartão ou colar no presente." },
            { q: "Funciona em qualquer celular?", a: "Sim. A homenagem abre direto no navegador — sem app, sem cadastro pra quem recebe." },
            { q: "Eu posso editar depois?", a: "Sim. Em \"Minhas homenagens\" você acessa todos os seus rascunhos e publicações direto do navegador, sem senha." },
            { q: "A música é legalizada?", a: "Usamos prévias oficiais (30s) via API pública. Nada de upload pirata." },
            { q: "E se eu desistir?", a: "Você só paga ao publicar. Antes disso, tudo fica em rascunho." },
          ].map((f) => (
            <Faq key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-5xl px-5 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card/60 to-card/40 p-8 text-center backdrop-blur sm:p-12">
          <Memo mood="celebrate" size={96} className="mx-auto" />
          <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">Pronto para emocionar?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-cream/70">
            5 minutos pra criar. Uma vida pra lembrar.
          </p>
          <Link to="/criar" preload="intent" className="btn-gold mt-6 px-7 py-4 text-base">
            Começar agora <ArrowRight className="arrow-r h-4 w-4" />
          </Link>
          <p className="mt-3 text-[11px] text-cream/50">Pagamento único · A partir de R$ 19,90</p>
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

function PriceCard({
  tag,
  price,
  name,
  sub,
  features,
  highlighted = false,
}: {
  tag: string;
  price: string;
  name: string;
  sub: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div className={cn(
      "relative rounded-3xl border p-6 backdrop-blur transition hover:-translate-y-1",
      highlighted ? "border-primary/60 bg-primary/10 glow-soft" : "border-white/10 bg-card/40",
    )}>
      <div className="flex items-center justify-between">
        <span className={cn(
          "rounded-full px-2.5 py-1 text-[10px] font-bold tracking-widest",
          highlighted ? "bg-primary text-primary-foreground" : "bg-card text-cream/70",
        )}>{tag.toUpperCase()}</span>
        <span className="text-[10px] text-cream/50">{sub}</span>
      </div>
      <p className="mt-5 font-display text-3xl font-extrabold">{name}</p>
      <p className="mt-1 font-display text-4xl font-black text-primary">{price}</p>
      <ul className="mt-5 space-y-2 text-sm text-cream/80">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
          </li>
        ))}
      </ul>
      <Link to="/criar" preload="intent" className={cn("mt-6 inline-flex w-full justify-center", highlighted ? "btn-gold" : "btn-ghost", "text-sm")}>
        Escolher {name} <ArrowRight className="arrow-r h-4 w-4" />
      </Link>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="w-full rounded-2xl border border-white/10 bg-card/40 p-5 text-left backdrop-blur transition hover:border-primary/40"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-display text-base font-bold">{q}</span>
        <span className={cn("text-primary transition-transform", open && "rotate-45")}>+</span>
      </div>
      {open && <p className="mt-3 text-sm text-cream/70">{a}</p>}
    </button>
  );
}
