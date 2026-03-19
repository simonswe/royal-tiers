import Link from "next/link";
import { listTierLists } from "@/app/actions/tier-list";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Plus, ArrowRight, Crown, Sparkles, LayoutGrid } from "lucide-react";

export default async function HomePage() {
  const tierLists = await listTierLists();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Crown className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Royal Tiers</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/30" />
          <div className="container relative mx-auto px-6 py-20 md:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Drag, drop, rank, share
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                Rank your favorite{" "}
                <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                  food spots
                </span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground md:text-xl">
                Create beautiful tier lists, drag restaurants into S through D tiers,
                and share your rankings with friends.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/list/new">
                  <Button size="lg" className="h-12 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30">
                    <Plus className="h-5 w-5 mr-2" />
                    Create a tier list
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {tierLists.length > 0 && (
          <section className="container mx-auto px-6 py-14">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <LayoutGrid className="h-4 w-4 text-secondary-foreground" />
              </div>
              <h2 className="text-xl font-bold">Your tier lists</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tierLists.map((list) => {
                const itemCount = list.items.length;
                return (
                  <Link
                    key={list.id}
                    href={`/list/${list.id}/edit`}
                    className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-chart-1 to-chart-5 opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate text-card-foreground group-hover:text-primary transition-colors">
                          {list.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
