"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import {
  adminCookieName,
  createAdminSessionCookieValue,
  getAdminSessionCookieOptions,
} from "@/lib/admin-auth";

function safeComparePassword(input: string, expected: string): boolean {
  const a = Buffer.from(input, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const nextRaw = String(formData.get("next") ?? "");
  const next =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/";

  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !safeComparePassword(password, expected)) {
    return { error: "Invalid password" };
  }

  const token = createAdminSessionCookieValue();
  if (!token) {
    return { error: "Server is not configured for admin login" };
  }

  (await cookies()).set(adminCookieName, token, getAdminSessionCookieOptions());
  redirect(next);
}

export async function logoutAdmin() {
  (await cookies()).delete(adminCookieName);
  redirect("/");
}
