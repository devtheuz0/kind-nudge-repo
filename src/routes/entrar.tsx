import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Clock, Infinity as InfinityIcon, Loader2, Mail, MailCheck } from "lucide-react";
import { Memo } from "@/components/Memo";

export const Route = createFileRoute("/entrar")({
  head: () => ({ meta: [{ title: "Entrar — Memora" }] }),
  component: Entrar,
});

const MOCK_DRAFTS = [
  { id: "1", to: "Para a Mariana", updated: "Há 2 dias", status: "draft" as const },
  { id: "2", to: "Para meu pai", updated: "Há 1 semana", status: "published" as const, expiresAt: null },
  { id: "3", to: "Aniversário do João", updated: "Há 3 semanas", status: "published" as const, expiresAt: "em 2 dias" },
];

function Entrar() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const send = () => {
    if (!email.includes("@")) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 900);
  };

  if (unlocked) {
    return (
      <main className="bg-builder min-h-screen">
        <header className="border-b border-border/60 px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-base font-bold">
            <Memo mood="avatar" size={26} animate={false} /> Memora
          </Link>
        </header>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80">Minha conta</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">Suas homenagens</h1>
          <p className="mt-2 text-sm text-muted-foreground">Acompanhe rascunhos, validade e edite quando quiser.</p>

          <ul className="mt-8 space-y-3">
            {MOCK_DRAFTS.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-4 transition hover:border-primary/50">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold">{d.to}</p>
                  <p className="text-xs text-muted-foreground">{d.updated}</p>
                </div>
                <div className="flex items-center gap-2">
                  {d.status === "draft" && (
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">Rascunho</span>
                  )}
                  {d.status === "published" && d.expiresAt && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#7aa7d9]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7aa7d9]">
                      <Clock className="h-3 w-3" /> Expira {d.expiresAt}
                    </span>
                  )}
                  {d.status === "published" && !d.expiresAt && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                      <InfinityIcon className="h-3 w-3" /> Vitalício
                    </span>
                  )}
                  <button className="rounded-full bg-card p-2 text-muted-foreground hover:text-foreground"><ArrowRight className="h-4 w-4" /></button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-center">
            <Link to="/criar" className="btn-gold text-sm">Criar nova homenagem <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-builder grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm text-center animate-fade-up">
        <Memo mood="wave" size={88} className="mx-auto" />
        <h1 className="mt-3 font-display text-3xl font-extrabold">Entrar no Memora</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sem senhas. A gente envia um link mágico no seu e-mail.</p>

        {!sent ? (
          <div className="mt-6 space-y-3">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="voce@email.com" className="memora-input pl-10" />
            </div>
            <button onClick={send} disabled={loading || !email.includes("@")} className="btn-gold w-full justify-center text-sm">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</> : <>Receber link mágico <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-success/40 bg-success/10 p-6">
            <MailCheck className="mx-auto h-8 w-8 text-success" />
            <p className="mt-3 text-sm font-semibold">Enviamos para {email}</p>
            <p className="mt-1 text-xs text-muted-foreground">Abra seu e-mail e clique no link para entrar.</p>
            <button onClick={() => setUnlocked(true)} className="mt-4 text-xs font-semibold text-primary underline-offset-4 hover:underline">
              (simular clique no link)
            </button>
          </div>
        )}

        <Link to="/" className="mt-6 inline-block text-xs text-muted-foreground hover:text-foreground">← voltar ao início</Link>
      </div>
    </main>
  );
}
