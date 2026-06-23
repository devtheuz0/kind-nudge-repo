import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES, useBuilder, type Category } from "@/lib/builder-store";
import { Memo } from "@/components/Memo";

export const Route = createFileRoute("/criar/")({
  head: () => ({
    meta: [{ title: "Para quem é? — Memora" }],
  }),
  component: ChooseCategory,
});

// Tint por categoria — dá personalidade real a cada card
const TINT: Record<Category, string> = {
  amor: "#F43F5E",
  mae: "#E8A4C9",
  pai: "#F5C46A",
  amiga: "#FFD66B",
  filho: "#FFB088",
  avos: "#C9A0DC",
  casamento: "#E6EBFF",
  aniversario: "#FF8FA3",
  formatura: "#7DD3FC",
  pet: "#D4A574",
  empresa: "#FCD34D",
  memoria: "#A7C7E7",
};

function ChooseCategory() {
  const navigate = useNavigate();
  const setCategory = useBuilder((s) => s.setCategory);
  const reset = useBuilder((s) => s.reset);

  return (
    <main className="bg-warmlight starfield min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-sm text-cream/70 hover:text-cream">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="flex items-center gap-2 font-display text-lg font-bold">
          <Memo mood="avatar" size={28} animate={false} /> Memora
        </div>
        <span className="w-16" />
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-6 pb-24 sm:px-6 sm:pt-10">
        <div className="text-center">
          <Memo mood="wave" size={112} className="mx-auto" />
          <h1 className="mt-4 font-display text-[2rem] font-extrabold leading-tight sm:text-5xl">
            Para quem é essa <span className="text-primary">história</span>?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-cream/75 sm:text-base">
            Escolha quem vai receber. O Memo adapta o tom, o tema visual e a trilha.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                reset();
                setCategory(cat.id);
                navigate({ to: "/criar/$category", params: { category: cat.id } });
              }}
              className="cat-card group"
              style={{ ["--cat-tint" as string]: TINT[cat.id] }}
            >
              <span
                aria-hidden
                className="grid h-11 w-11 place-items-center rounded-xl text-2xl shadow-inner transition group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${TINT[cat.id]}33, ${TINT[cat.id]}11)`,
                  border: `1px solid ${TINT[cat.id]}55`,
                }}
              >
                {cat.emoji}
              </span>
              <div>
                <p className="font-display text-[15px] font-bold leading-tight">{cat.label}</p>
                <p className="mt-1 text-[11px] leading-snug text-cream/55">{cat.hint}</p>
              </div>
              <span
                className="absolute right-3 top-3 text-[10px] font-mono uppercase tracking-widest opacity-0 transition group-hover:opacity-70"
                style={{ color: TINT[cat.id] }}
              >
                criar →
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
