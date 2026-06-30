import { createServerFn } from "@tanstack/react-start";
import { createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import type { StripeEnv } from "@/lib/stripe.server";

type UpsertResult = { ok: true } | { error: string };

export const upsertDraft = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string; data: unknown }) => {
    if (!/^[a-z0-9-]{3,80}$/i.test(data.slug)) throw new Error("Invalid slug");
    if (!data.data || typeof data.data !== "object") throw new Error("Invalid data");
    return data;
  })
  .handler(async ({ data }): Promise<UpsertResult> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: existing } = await supabaseAdmin
        .from("homenagens")
        .select("status")
        .eq("slug", data.slug)
        .maybeSingle();
      if (existing?.status === "paid") return { ok: true }; // don't overwrite paid
      const { error } = await supabaseAdmin
        .from("homenagens")
        .upsert({ slug: data.slug, data: data.data as never, status: "pending" });
      if (error) return { error: error.message };
      return { ok: true };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Failed to save draft" };
    }
  });

type ConfirmResult =
  | { paid: true; slug: string; plan: string; email: string | null }
  | { paid: false }
  | { error: string };

export const confirmPayment = createServerFn({ method: "POST" })
  .inputValidator((data: { sessionId: string; environment: StripeEnv }) => {
    if (!/^cs_[a-zA-Z0-9_]+$/.test(data.sessionId)) throw new Error("Invalid sessionId");
    return data;
  })
  .handler(async ({ data }): Promise<ConfirmResult> => {
    try {
      const stripe = createStripeClient(data.environment);
      const session = await stripe.checkout.sessions.retrieve(data.sessionId);
      const paid = session.payment_status === "paid" || session.status === "complete";
      if (!paid) return { paid: false };
      const meta = (session.metadata ?? {}) as Record<string, string>;
      const slug = meta.slug;
      const plan = meta.plan || "temporary";
      if (!slug) return { error: "Session missing slug" };
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const expiresAt =
        plan === "eternal"
          ? null
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      const email = session.customer_details?.email ?? null;
      const { error } = await supabaseAdmin
        .from("homenagens")
        .update({
          status: "paid",
          plan,
          email,
          session_id: session.id,
          paid_at: new Date().toISOString(),
          expires_at: expiresAt,
        })
        .eq("slug", slug);
      if (error) return { error: error.message };
      return { paid: true, slug, plan, email };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
