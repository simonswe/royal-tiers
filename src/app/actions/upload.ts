"use server";

import { supabase } from "@/lib/supabase";

const BUCKET = "tier-images";

export async function uploadImage(
  base64DataUrl: string
): Promise<{ url: string } | { error: string }> {
  if (!supabase) {
    return { error: "Storage is not configured" };
  }

  const match = base64DataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return { error: "Invalid image data" };

  const mimeType = match[1];
  const ext = mimeType.split("/")[1] === "webp" ? "webp" : mimeType.split("/")[1];
  const buffer = Buffer.from(match[2], "base64");

  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: mimeType, upsert: false });

  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return { url: urlData.publicUrl };
}
