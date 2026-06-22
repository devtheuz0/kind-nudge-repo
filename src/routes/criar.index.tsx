import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES, useBuilder } from "@/lib/builder-store";
import { Memo } from "@/components/Memo";

export const Route = createFileRoute("/criar/")({
  head: () => ({
    meta: [{ title: "Criar homenagem — Memora" }],
  }),
  component: ChooseCategory,
});

function ChooseCategory() {
  const navigate = useNavigate();
  const setCategory = useBuilder((s) => s.setCategory);
  const reset = useBuilder((s) => s.reset);

  return (
    <main className="bg-night starfield min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2 text-sm text-cream/70 hover:text-cream">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="flex items-center gap-2 font-display text-lg font-bold">
          <Memo size={28} animate={false} /> Memora
        </div>
        <span className="w-16" />
      </header>

      <section className="mx-auto max-w-5xl px-6 pt-8 pb-24 sm:pt-12">
        <div className="text-center">
          <Memo mood="wave" size={96} />
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
            Para quem é sua homenagem?
          </h1>
          <p className="mt-3 text-cream/75">
            Escolha uma categoria — o Memo cuida do resto.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                reset();
                setCategory(cat.id);
                navigate({ to: "/criar/$category", params: { category: cat.id } });
              }}
              className="group relative flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-card/60 p-5 text-center backdrop-blur transition hover:-translate-y-1 hover:border-primary/60 hover:glow-soft"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="font-semibold">{cat.label}</span>
              <span className="text-[11px] text-cream/60">{cat.hint}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
