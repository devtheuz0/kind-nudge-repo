import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowRight,
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Infinity as InfinityIcon,
  Trash2,
} from "lucide-react";
import { Memo } from "@/components/Memo";
import {
  type Homenagem,
  listHomenagens,
  removeHomenagem,
  subscribeHomenagens,
} from "@/lib/homenagens";

export const Route = createFileRoute("/minhas")({
  head: () => ({ meta: [{ title: "Minhas Homenagens — Memora" }] }),
  component: MinhasHomenagens,
});

function MinhasHomenagens() {
  const [items, setItems] = useState<Homenagem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(listHomenagens());
    setHydrated(true);
    return subscribeHomenagens(() => setItems(listHomenagens()));
  }, []);

  return (
    <main className="bg-builder min-h-screen">
      <header className="border-b border-border/60 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-base font-bold">
            <Memo mood="avatar" size={26} animate={false} priority /> Memora
          </Link>
          <Link to="/criar" className="btn-gold text-xs">
            Nova homenagem <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80">
          Minha conta
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
          Minhas homenagens
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tudo o que você criou neste dispositivo. Pagas têm link e QR Code prontos para
          compartilhar.
        </p>

        {hydrated && items.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
            <Memo mood="thinking" size={88} className="mx-auto" />
            <h2 className="mt-4 font-display text-xl font-bold">Nada por aqui ainda</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie sua primeira homenagem em poucos minutos.
            </p>
            <Link to="/criar" className="btn-gold mt-6 inline-flex text-sm">
              Criar homenagem <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <ul className="mt-8 space-y-3">
          {items.map((h) => (
            <HomenagemCard key={h.slug} h={h} />
          ))}
        </ul>
      </div>
    </main>
  );
}

function HomenagemCard({ h }: { h: Homenagem }) {
  const publicUrl = useMemo(
    () => (typeof window !== "undefined" ? `${window.location.origin}/para/${h.slug}` : ""),
    [h.slug],
  );
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const isPaid = h.status === "paid";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `memora-${h.slug}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const onRemove = () => {
    if (confirm("Remover esta homenagem do seu dispositivo?")) removeHomenagem(h.slug);
  };

  const title =
    h.data.toName?.trim() ||
    (h.data.category ? `Para ${h.data.category}` : "Homenagem sem título");
  const created = new Date(h.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <li className="rounded-2xl border border-border bg-card/60 p-4 transition hover:border-primary/50">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-bold">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Criada em {created} · /para/<span className="font-mono">{h.slug}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPaid ? (
            h.expiresAt ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                <Clock className="h-3 w-3" /> Pago · expira{" "}
                {new Date(h.expiresAt).toLocaleDateString("pt-BR")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                <InfinityIcon className="h-3 w-3" /> Pago · vitalício
              </span>
            )
          ) : (
            <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              Pagamento pendente
            </span>
          )}
        </div>
      </div>

      {!isPaid && (
        <div className="mt-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3 text-xs text-muted-foreground">
          O link e o QR Code só ficam disponíveis após o pagamento. Finalize para publicar.
        </div>
      )}

      {isPaid && (
        <div className="mt-3 break-all rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 font-mono text-xs text-primary">
          {publicUrl}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`/para/${h.slug}`}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost text-xs"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Abrir
        </a>
        {isPaid ? (
          <>
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
            <button onClick={() => setShowQR((v) => !v)} className="btn-ghost text-xs">
              <Download className="h-3.5 w-3.5" /> {showQR ? "Ocultar QR" : "QR Code"}
            </button>
          </>
        ) : (
          <Link to="/checkout" className="btn-gold text-xs">
            Pagar e publicar
          </Link>
        )}
        <button
          onClick={onRemove}
          className="btn-ghost text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" /> Remover
        </button>
      </div>

      {isPaid && showQR && (
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
          <div ref={qrRef} className="rounded-2xl bg-cream p-3">
            <QRCodeCanvas value={publicUrl} size={140} bgColor="#FAF6EE" fgColor="#0B1526" />
          </div>
          <button onClick={downloadQR} className="btn-gold text-xs">
            <Download className="h-3.5 w-3.5" /> Baixar PNG
          </button>
        </div>
      )}
    </li>
  );
}
