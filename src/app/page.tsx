import Link from "next/link";
import { listTierLists } from "@/app/actions/tier-list";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { HomeTierListCard } from "@/components/home-tier-list-card";
import { Plus, Crown, Sparkles, LayoutGrid } from "lucide-react";

const ROW_A = [
  //"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
  //"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=500&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80", // salad
  //"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80",
  "https://images.unsplash.com/photo-1502364271109-0a9a75a2a9df?w=500&q=80",
  "https://images.unsplash.com/photo-1517499414974-3b42addf2d86?w=500&q=80", // dimsum
];

const ROW_B = [
  //"https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=500&q=80",
  "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&q=80",
  //"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80", // pasta bright bg
  "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=500&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&q=80",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80",
  //"https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80",
  "https://images.unsplash.com/photo-1632558610168-8377309e34c7?w=500&q=80", // kbbq
];

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
          <div className="pointer-events-none absolute inset-0 z-0 flex flex-col gap-1" aria-hidden>
            <div className="hero-food-row hero-food-row--left">
              {[...ROW_A, ...ROW_A].map((src, i) => (
                <div key={`a-${i}`} className="hero-food-photo">
                  <img src={src} alt="" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="hero-food-row hero-food-row--right">
              {[...ROW_B, ...ROW_B].map((src, i) => (
                <div key={`b-${i}`} className="hero-food-photo">
                  <img src={src} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <div className="container relative z-[1] mx-auto px-6 py-20 md:py-28">
            <div className="mx-auto max-w-2xl rounded-3xl bg-background/70 px-8 py-10 text-center backdrop-blur-xl md:px-12">
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
              {tierLists.map((list) => (
                <HomeTierListCard
                  key={list.id}
                  id={list.id}
                  title={list.title}
                  itemCount={list.items.length}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
