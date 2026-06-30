import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Check, Copy, Download, Loader2, Share2 } from "lucide-react";
import { Memo } from "@/components/Memo";
import { getStripeEnvironment } from "@/lib/stripe";
import { confirmPayment } from "@/utils/homenagens.functions";
import { markPaid } from "@/lib/homenagens";
import type { Plan } from "@/lib/builder-store";

export const Route = createFileRoute("/checkout/return")({
  head: () => ({ meta: [{ title: "Pagamento confirmado — Memora" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
    slug: typeof search.slug === "string" ? search.slug : undefined,
    plan: typeof search.plan === "string" ? search.plan : undefined,
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id, slug, plan } = Route.useSearch();
  const [state, setState] = useState<"loading" | "paid" | "open" | "error">("loading");
  const [, setEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const qrWrapRef = useRef<HTMLDivElement>(null);

  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/para/${slug ?? ""}` : "";

  useEffect(() => {
    if (!session_id) {
      setState("error");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await confirmPayment({
          data: { sessionId: session_id, environment: getStripeEnvironment() },
        });
        if (cancelled) return;
        if ("error" in res) {
          setState("error");
          return;
        }
        if (res.paid && slug) {
          setEmail(res.email);
          markPaid(slug, {
            plan: (plan as Plan) ?? "temporary",
            email: res.email,
            sessionId: session_id,
          });
          setState("paid");
        } else {
          setState("open");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session_id, slug, plan]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — fall back to share
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Sua homenagem Memora", url: publicUrl });
        return;
      } catch {
        /* user cancelled */
      }
    }
    copy();
  };

  const downloadQR = () => {
    const canvas = qrWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `memora-${slug ?? "homenagem"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (state === "loading") {
    return (
      <main className="bg-builder grid min-h-screen place-items-center px-6 text-center">
        <div>
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Confirmando seu pagamento…</p>
        </div>
      </main>
    );
  }

  if (state === "error" || state === "open") {
    return (
      <main className="bg-builder grid min-h-screen place-items-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl font-extrabold">Não confirmamos o pagamento</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A homenagem só publica após a confirmação. Tente novamente.
          </p>
          <Link to="/checkout" className="btn-gold mt-6 inline-flex text-sm">
            Voltar ao checkout
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-builder min-h-screen px-6 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <Memo mood="celebrate" size={120} priority className="mx-auto animate-heartbeat" />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80">
          Pagamento confirmado
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
          Sua homenagem está no ar ✨
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {plan === "eternal"
            ? "Link vitalício, fica para sempre."
            : "Link válido por 1 ano."}
        </p>


        <div className="mt-8 grid gap-6 sm:grid-cols-[auto_1fr] sm:text-left">
          <div ref={qrWrapRef} className="mx-auto rounded-2xl bg-cream p-4">
            <QRCodeCanvas value={publicUrl} size={160} bgColor="#FAF6EE" fgColor="#0B1526" />
          </div>
          <div className="flex flex-col justify-center gap-3">
            <p className="font-mono text-xs text-muted-foreground">URL da homenagem</p>
            <p className="break-all rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-sm text-primary">
              {publicUrl}
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={copy} className="btn-ghost text-xs">
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copiar link
                  </>
                )}
              </button>
              <button onClick={share} className="btn-ghost text-xs">
                <Share2 className="h-3.5 w-3.5" /> Compartilhar
              </button>
              <button onClick={downloadQR} className="btn-ghost text-xs">
                <Download className="h-3.5 w-3.5" /> Baixar QR
              </button>
              <Link
                to="/para/$slug"
                params={{ slug: slug ?? "" }}
                className="btn-gold text-xs"
              >
                Abrir homenagem
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-2 text-sm">
          <Link to="/minhas" className="btn-ghost text-xs">
            Minhas homenagens
          </Link>
          <Link to="/" className="btn-ghost text-xs">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
