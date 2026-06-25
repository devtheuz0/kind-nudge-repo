import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, CreditCard, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useBuilder } from "@/lib/builder-store";
import { Memo } from "@/components/Memo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Memora" }] }),
  component: Checkout,
});

function Checkout() {
  const navigate = useNavigate();
  const s = useBuilder();
  const [method, setMethod] = useState<"card" | "pix">("card");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ email: "", name: "", number: "", exp: "", cvv: "" });

  const price = s.plan === "eternal" ? "R$ 29,90" : "R$ 19,90";
  const planName = s.plan === "eternal" ? "Eterno" : "Temporário";
  const url = `memora.app/para/${s.slug || "sua-homenagem"}`;

  const valid = useMemo(() => {
    if (!form.email.includes("@")) return false;
    if (method === "pix") return true;
    return form.name.length > 2 && form.number.replace(/\s/g, "").length >= 14 && form.exp.length >= 4 && form.cvv.length >= 3;
  }, [form, method]);

  const submit = () => {
    if (!valid) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1800);
  };

  if (done) {
    return (
      <main className="bg-builder grid min-h-screen place-items-center px-6 text-center">
        <div className="animate-fade-up max-w-md">
          <Memo mood="celebrate" size={120} className="mx-auto animate-heartbeat" />
          <h1 className="mt-4 font-display text-4xl font-extrabold">Sua homenagem está no ar ✨</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Enviamos o link para <span className="text-cream">{form.email}</span> e também pode acessar em:
          </p>
          <p className="mt-3 inline-block rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-sm text-primary">{url}</p>
          <div className="mt-6 flex justify-center gap-2">
            <Link to="/entrar" className="btn-ghost text-sm">Ver minhas homenagens</Link>
            <Link to="/" className="btn-gold text-sm">Voltar ao início</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-builder min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => navigate({ to: "/criar/$category", params: { category: s.category ?? "amor" } })} className="btn-ghost text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar a editar
          </button>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Pagamento seguro</span>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80">Finalizando</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">Quase lá — falta só o presente subir.</h1>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">E-mail (também usamos para login sem senha)</p>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="voce@email.com" className="memora-input" />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Forma de pagamento</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setMethod("card")} className={cn("flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition", method === "card" ? "border-primary bg-primary/10 text-primary" : "border-border bg-card/60")}>
                <CreditCard className="h-4 w-4" /> Cartão
              </button>
              <button onClick={() => setMethod("pix")} className={cn("flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition", method === "pix" ? "border-primary bg-primary/10 text-primary" : "border-border bg-card/60")}>
                <span className="font-mono text-base font-black">PIX</span>
              </button>
            </div>
          </div>

          {method === "card" ? (
            <div className="grid gap-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome no cartão" className="memora-input" />
              <input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value.replace(/[^\d ]/g, "").slice(0, 19) })} placeholder="0000 0000 0000 0000" inputMode="numeric" className="memora-input font-mono" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.exp} onChange={(e) => setForm({ ...form, exp: e.target.value.slice(0, 5) })} placeholder="MM/AA" className="memora-input font-mono" />
                <input value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="CVV" className="memora-input font-mono" />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
              <div className="mx-auto grid h-32 w-32 place-items-center rounded-xl bg-cream text-night">
                <span className="font-mono text-[10px]">[ QR PIX MOCK ]</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Escaneie no seu app — a confirmação é automática.</p>
            </div>
          )}

          <button onClick={submit} disabled={!valid || submitting} className="btn-gold w-full justify-center text-sm">
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Processando…</> : <>Pagar {price} <Lock className="h-4 w-4" /></>}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3" /> Checkout simulado — em breve via Stripe.
          </p>
        </section>

        <aside className="h-fit rounded-2xl border border-border bg-card/60 p-5 lg:sticky lg:top-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80">Resumo</p>
          <h3 className="mt-1 font-display text-xl font-bold">Plano {planName}</h3>
          <p className="mt-1 text-xs text-muted-foreground">Para <span className="text-cream">{s.toName || "—"}</span> · de <span className="text-cream">{s.fromName || "—"}</span></p>
          <div className="my-4 border-t border-border" />
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-success" /> {s.media.length} memórias adicionadas</li>
            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-success" /> {s.timeline.length} marcos na linha do tempo</li>
            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-success" /> Música {s.music ? `"${s.music.title}"` : "sem trilha"}</li>
            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-success" /> URL: {url}</li>
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-extrabold text-primary">{price}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
