import { notFound } from "next/navigation";
import { getTierListBySlug, getTierListById } from "@/app/actions/tier-list";
import { TierListView } from "@/components/tier-list-view";
import { Crown } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const tierList = (await getTierListBySlug(id)) ?? (await getTierListById(id));
  if (!tierList) return { title: "Tier List" };
  return {
    title: `${tierList.title} | Royal Tiers`,
    description: tierList.description || `Tier list: ${tierList.title}. View the full ranking on Royal Tiers.`,
    openGraph: { title: `${tierList.title} | Royal Tiers`, description: tierList.description || `Check out this tier list on Royal Tiers.`, type: "website" },
    twitter: { card: "summary_large_image", title: `${tierList.title} | Royal Tiers` },
  };
}

export default async function SharedTierListPage({ params }: PageProps) {
  const { id } = await params;
  const tierList = (await getTierListBySlug(id)) ?? (await getTierListById(id));
  if (!tierList) notFound();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Crown className="h-4 w-4" />
            </div>
            <h1 className="text-lg font-bold truncate">{tierList.title}</h1>
          </div>
          <a
            href="/"
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            More tier lists
          </a>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <TierListView items={tierList.items} />
      </main>
    </div>
  );
}
