import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "rt_admin";
/** Session length in seconds (7 days) */
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function signToken(exp: number): string {
  const secret = getAdminPassword();
  if (!secret) return "";
  const sig = createHmac("sha256", secret).update(String(exp)).digest("hex");
  return `${exp}.${sig}`;
}

function parseAndVerifyToken(raw: string | undefined): boolean {
  if (!raw) return false;
  const secret = getAdminPassword();
  if (!secret) return false;
  const dot = raw.indexOf(".");
  if (dot === -1) return false;
  const expStr = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now() / 1000) return false;
  const expected = createHmac("sha256", secret).update(String(exp)).digest("hex");
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return parseAndVerifyToken(token);
}

export async function requireAdmin(nextPath?: string): Promise<void> {
  if (!(await isAdmin())) {
    const qs =
      nextPath && nextPath.startsWith("/")
        ? `?next=${encodeURIComponent(nextPath)}`
        : "";
    redirect(`/admin/login${qs}`);
  }
}

export function createAdminSessionCookieValue(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  return signToken(exp);
}

export const adminCookieName = COOKIE_NAME;

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
