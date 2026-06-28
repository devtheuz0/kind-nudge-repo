/**
 * Local persistence of homenagens (frontend-only, per device).
 * Stores both the draft snapshot (for re-rendering the public page) and
 * the payment status (paid / pending / plan / expiry).
 */
import type { TributeData } from "@/components/Tribute";
import type { Plan } from "./builder-store";

const KEY = "memora:homenagens";

export type HomenagemStatus = "pending" | "paid";

export type Homenagem = {
  slug: string;
  data: TributeData;
  createdAt: string;
  updatedAt: string;
  status: HomenagemStatus;
  plan?: Plan;
  email?: string | null;
  paidAt?: string | null;
  expiresAt?: string | null;
  sessionId?: string | null;
};

type Store = Record<string, Homenagem>;

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
}

function write(store: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent("memora:homenagens"));
}

export function saveDraft(slug: string, data: TributeData): Homenagem {
  if (!slug) throw new Error("slug obrigatório");
  const store = read();
  const now = new Date().toISOString();
  const existing = store[slug];
  const next: Homenagem = existing
    ? { ...existing, data, updatedAt: now }
    : { slug, data, createdAt: now, updatedAt: now, status: "pending" };
  store[slug] = next;
  write(store);
  return next;
}

export function markPaid(
  slug: string,
  payload: { plan: Plan; email?: string | null; sessionId?: string | null },
): Homenagem | null {
  const store = read();
  const h = store[slug];
  if (!h) return null;
  const expiresAt =
    payload.plan === "eternal"
      ? null
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  store[slug] = {
    ...h,
    status: "paid",
    plan: payload.plan,
    email: payload.email ?? null,
    sessionId: payload.sessionId ?? null,
    paidAt: new Date().toISOString(),
    expiresAt,
    updatedAt: new Date().toISOString(),
  };
  write(store);
  return store[slug];
}

export function getHomenagem(slug: string): Homenagem | null {
  return read()[slug] ?? null;
}

export function listHomenagens(): Homenagem[] {
  return Object.values(read()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

export function removeHomenagem(slug: string) {
  const store = read();
  delete store[slug];
  write(store);
}

/** Subscribe to changes (same tab + cross-tab via storage event). */
export function subscribeHomenagens(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  const onLocal = () => cb();
  window.addEventListener("storage", onStorage);
  window.addEventListener("memora:homenagens", onLocal as EventListener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("memora:homenagens", onLocal as EventListener);
  };
}
