import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useBuilder } from "@/lib/builder-store";
import { getHomenagem, subscribeHomenagens } from "@/lib/homenagens";
import { Tribute, type TributeData } from "@/components/Tribute";

export const Route = createFileRoute("/para/$slug")({
  head: ({ params }) => ({ meta: [{ title: `Para ${params.slug} — Memora` }] }),
  component: PublicTribute,
});

function PublicTribute() {
  const { slug } = Route.useParams();
  const builder = useBuilder();
  const [tick, setTick] = useState(0);

  // Re-render when the local homenagens store changes (e.g. payment confirmed
  // in another tab) so the watermark drops without a manual reload.
  useEffect(() => subscribeHomenagens(() => setTick((t) => t + 1)), []);

  const stored = getHomenagem(slug);
  // void tick so the linter keeps the dependency
  void tick;

  let data: TributeData | null = null;
  let paid = false;

  if (stored) {
    data = stored.data;
    paid = stored.status === "paid";
  } else if (builder.category && builder.slug === slug) {
    // Live preview while still editing on this device, before the snapshot
    // is saved (snapshot is written on checkout entry).
    data = {
      category: builder.category,
      fromName: builder.fromName,
      toName: builder.toName,
      startDate: builder.startDate,
      openingPhrase: builder.openingPhrase,
      mainMessage: builder.mainMessage,
      media: builder.media,
      timeline: builder.timeline,
      templateId: builder.templateId,
      music: builder.music,
    };
    paid = false;
  }

  if (!data) {
    return (
      <main className="bg-builder grid min-h-screen place-items-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl font-extrabold">Homenagem não encontrada</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta homenagem foi criada em outro dispositivo, ou o link está incorreto.
          </p>
          <Link to="/" className="btn-gold mt-6 inline-flex text-sm">
            Voltar ao início
          </Link>
        </div>
      </main>
    );
  }

  return <Tribute data={data} locked={!paid} />;
}
