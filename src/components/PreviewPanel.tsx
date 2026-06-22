import { Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBuilder } from "@/lib/builder-store";
import { Tribute } from "./Tribute";

export function PreviewPanel() {
  const [open, setOpen] = useState(false);
  // Subscribe to whole state — used inside open panel only
  const data = useBuilder((s) => ({
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
  }));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xl glow-primary transition hover:brightness-110 sm:bottom-6"
      >
        <Eye className="h-4 w-4" />
        Ver prévia
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex bg-background/80 backdrop-blur">
          <div className="ml-auto flex h-full w-full flex-col sm:w-[440px] sm:border-l sm:border-border">
            <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
              <p className="text-sm font-semibold">Prévia ao vivo</p>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-2 hover:bg-card"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Tribute data={data} compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
