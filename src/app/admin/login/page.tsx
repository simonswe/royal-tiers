import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { isAdmin } from "@/lib/admin-auth";
import { linkGhostSm } from "@/lib/link-button-classes";
import { Crown } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { next: nextRaw } = await searchParams;
  const next =
    nextRaw?.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/";

  if (await isAdmin()) {
    redirect(next);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Crown className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Royal Tiers</span>
          </Link>
        </div>
      </header>
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          <h1 className="text-xl font-bold">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the admin password to create and edit tier lists.
          </p>
          <div className="mt-6">
            <AdminLoginForm nextPath={next} />
          </div>
          <div className="mt-6 text-center">
            <Link href="/" className={linkGhostSm}>
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
