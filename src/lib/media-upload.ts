import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS_SECONDS = 60 * 60 * 24 * 365 * 10;

/**
 * Upload a tribute media file to Supabase Storage (private bucket "homenagens")
 * and return a long-lived signed URL that works cross-device for <img>/<video>.
 */
export async function uploadHomenagemMedia(
  slug: string,
  file: File,
): Promise<{ url: string; path: string }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${slug || "draft"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const { error: upErr } = await supabase.storage
    .from("homenagens")
    .upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (upErr) throw new Error(upErr.message);
  const { data, error: sErr } = await supabase.storage
    .from("homenagens")
    .createSignedUrl(path, TEN_YEARS_SECONDS);
  if (sErr || !data?.signedUrl) throw new Error(sErr?.message ?? "Failed to sign URL");
  return { url: data.signedUrl, path };
}
