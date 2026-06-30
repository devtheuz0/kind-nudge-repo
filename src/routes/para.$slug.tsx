import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useBuilder } from "@/lib/builder-store";
import { getHomenagem, subscribeHomenagens } from "@/lib/homenagens";
import { supabase } from "@/integrations/supabase/client";
import { Tribute, type TributeData } from "@/components/Tribute";

export const Route = createFileRoute("/para/$slug")({
  head: ({ params }) => ({ meta: [{ title: `Para ${params.slug} — Memora` }] }),
  component: PublicTribute,
});

type RemoteState =
  | { kind: "loading" }
  | { kind: "found"; data: TributeData; paid: boolean }
  | { kind: "missing" };

function PublicTribute() {
  const { slug } = Route.useParams();
  const builder = useBuilder();
  const [tick, setTick] = useState(0);
  const [remote, setRemote] = useState<RemoteState>({ kind: "loading" });

  useEffect(() => subscribeHomenagens(() => setTick((t) => t + 1)), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("homenagens")
        .select("data, status")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setRemote({ kind: "missing" });
        return;
      }
      setRemote({
        kind: "found",
        data: data.data as unknown as TributeData,
        paid: data.status === "paid",
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Local fallbacks (creator on same device): keep live preview while editing.
  const stored = getHomenagem(slug);
  void tick;

  let data: TributeData | null = null;
  let paid = false;

  if (remote.kind === "found") {
    data = remote.data;
    paid = remote.paid;
  } else if (stored) {
    data = stored.data;
    paid = stored.status === "paid";
  } else if (builder.category && builder.slug === slug) {
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

  if (remote.kind === "loading" && !data) {
    return (
      <main className="bg-builder grid min-h-screen place-items-center px-6 text-center">
        <p className="text-sm text-muted-foreground">Carregando homenagem…</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="bg-builder grid min-h-screen place-items-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl font-extrabold">Homenagem não encontrada</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Verifique se o link está correto.
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
