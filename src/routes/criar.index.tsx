import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Heart } from "lucide-react";
import { CATEGORIES, useBuilder } from "@/lib/builder-store";

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
    <main className="bg-aurora min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <Heart className="h-4 w-4 text-emotion" fill="currentColor" /> Memora
        </div>
        <span className="w-16" />
      </header>

      <section className="mx-auto max-w-5xl px-6 pt-8 pb-24 sm:pt-16">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Para quem é sua homenagem?
          </h1>
          <p className="mt-3 text-muted-foreground">
            Escolha uma categoria para começar. Você pode mudar tudo depois.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                reset();
                setCategory(cat.id);
                navigate({ to: "/criar/$category", params: { category: cat.id } });
              }}
              className="group glass relative flex flex-col items-center gap-3 rounded-2xl p-8 text-center transition hover:-translate-y-1 hover:glow-primary"
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="font-medium">{cat.label}</span>
              <span className="absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-primary/50" />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
