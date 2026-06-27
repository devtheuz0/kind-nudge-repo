import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Lock, ShieldCheck } from "lucide-react";
import { useBuilder } from "@/lib/builder-store";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { useState } from "react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Memora" }] }),
  component: Checkout,
});

function Checkout() {
  const navigate = useNavigate();
  const s = useBuilder();
  const [email, setEmail] = useState("");
  const [starting, setStarting] = useState(false);

  const priceId = s.plan === "eternal" ? "memora_eterno_onetime" : "memora_temporario_onetime";
  const price = s.plan === "eternal" ? "R$ 29,90" : "R$ 19,90";
  const planName = s.plan === "eternal" ? "Eterno" : "Temporário";
  const slug = s.slug || "sua-homenagem";
  const url = `memora.app/para/${slug}`;

  const returnUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/checkout/return?session_id={CHECKOUT_SESSION_ID}&slug=${encodeURIComponent(slug)}&plan=${s.plan ?? "temporary"}`;

  const canStart = email.includes("@") && email.length > 5;

  return (
    <main className="bg-builder min-h-screen">
      <PaymentTestModeBanner />
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => navigate({ to: "/criar/$category", params: { category: s.category ?? "amor" } })} className="btn-ghost text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar a editar
          </button>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Pagamento seguro via Stripe</span>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80">Finalizando</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">Quase lá — falta só o presente subir.</h1>
            <p className="mt-2 text-sm text-muted-foreground">A homenagem fica privada até o pagamento ser confirmado. Sem pagamento, o link não publica.</p>
          </div>

          {!starting ? (
            <>
              <div>
                <p className="mb-2 text-sm font-semibold">Seu e-mail (para receber o link e o QR Code)</p>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="voce@email.com"
                  className="memora-input"
                />
              </div>
              <button
                onClick={() => canStart && setStarting(true)}
                disabled={!canStart}
                className="btn-gold w-full justify-center text-sm"
              >
                Pagar {price} com Stripe <Lock className="h-4 w-4" />
              </button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3" /> Sem reembolso após pagamento (produto digital).
              </p>
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-card/60 p-2 sm:p-4">
              <StripeEmbeddedCheckout
                priceId={priceId}
                customerEmail={email}
                returnUrl={returnUrl}
                metadata={{
                  slug,
                  plan: s.plan ?? "temporary",
                  to_name: s.toName ?? "",
                  from_name: s.fromName ?? "",
                }}
              />
            </div>
          )}
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
            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-success" /> {s.plan === "eternal" ? "Link vitalício" : "Link válido por 1 ano"}</li>
            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-success" /> QR Code para imprimir/enviar</li>
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-extrabold text-primary">{price}</span>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground">
            <Link to="/" className="underline">memora.app</Link> · Sem reembolso após pagamento · Temporário avisa 30 dias antes de expirar com opção de upgrade para Eterno.
          </p>
        </aside>
      </div>
    </main>
  );
}
