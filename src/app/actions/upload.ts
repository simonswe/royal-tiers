"use server";

import { supabase, supabaseAdmin } from "@/lib/supabase";

const BUCKET = "tier-images";

function getClient() {
  return supabaseAdmin ?? supabase;
}

function extractFilePath(imageUrl: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;
  const path = imageUrl.slice(idx + marker.length);
  return path || null;
}

export async function deleteStorageFile(imageUrl: string) {
  const client = getClient();
  if (!client) return;
  const filePath = extractFilePath(imageUrl);
  if (!filePath) return;
  const { error } = await client.storage.from(BUCKET).remove([filePath]);
  if (error) console.error("Storage delete failed:", error.message, filePath);
}

export async function deleteStorageFiles(imageUrls: string[]) {
  const client = getClient();
  if (!client || imageUrls.length === 0) return;
  const paths = imageUrls
    .map(extractFilePath)
    .filter((p): p is string => !!p);
  if (paths.length === 0) return;
  const { error } = await client.storage.from(BUCKET).remove(paths);
  if (error) console.error("Storage batch delete failed:", error.message, paths);
}

export async function uploadImage(
  base64DataUrl: string
): Promise<{ url: string } | { error: string }> {
  const client = getClient();
  if (!client) {
    return { error: "Storage is not configured" };
  }

  const match = base64DataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return { error: "Invalid image data" };

  const mimeType = match[1];
  const ext = mimeType.split("/")[1] === "webp" ? "webp" : mimeType.split("/")[1];
  const buffer = Buffer.from(match[2], "base64");

  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await client.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: mimeType, upsert: false });

  if (error) return { error: error.message };

  const { data: urlData } = client.storage.from(BUCKET).getPublicUrl(data.path);
  return { url: urlData.publicUrl };
}
