import { createFileRoute, Link } from "@tanstack/react-router";
import { useBuilder } from "@/lib/builder-store";
import { Tribute, type TributeData } from "@/components/Tribute";

export const Route = createFileRoute("/para/$slug")({
  head: ({ params }) => ({ meta: [{ title: `Para ${params.slug} — Memora` }] }),
  component: PublicTribute,
});

function PublicTribute() {
  const { slug } = Route.useParams();
  const s = useBuilder();

  let paid = false;
  if (typeof window !== "undefined") {
    try {
      const map = JSON.parse(localStorage.getItem("memora:published") ?? "{}");
      paid = Boolean(map[slug]);
    } catch {}
  }

  // Frontend-only: tribute data lives in the local builder store.
  // If this device doesn't have the matching draft, show a friendly miss.
  if (!s.category || s.slug !== slug) {
    return (
      <main className="bg-builder grid min-h-screen place-items-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl font-extrabold">Homenagem não encontrada</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta homenagem foi criada em outro dispositivo. Em breve hospedaremos as homenagens na nuvem para abrir em qualquer lugar.
          </p>
          <Link to="/" className="btn-gold mt-6 inline-flex text-sm">Voltar ao início</Link>
        </div>
      </main>
    );
  }

  const data: TributeData = {
    category: s.category,
    fromName: s.fromName,
    toName: s.toName,
    startDate: s.startDate,
    openingPhrase: s.openingPhrase,
    mainMessage: s.mainMessage,
    media: s.media,
    timeline: s.timeline,
    templateId: s.templateId,
    music: s.music,
  };

  return <Tribute data={data} locked={!paid} />;
}
