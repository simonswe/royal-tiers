import { notFound } from "next/navigation";
import { getTierListById } from "@/app/actions/tier-list";
import { TierEditor } from "@/components/tier-editor/tier-editor";
import { CopyShareLinkButton } from "@/components/copy-share-link-button";
import { EditableTitle } from "@/components/editable-title";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Crown, ExternalLink } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTierListPage({ params }: PageProps) {
  const { id } = await params;
  const tierList = await getTierListById(id);
  if (!tierList) notFound();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Crown className="h-4 w-4" />
            </div>
            <EditableTitle tierListId={tierList.id} initialTitle={tierList.title} />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <CopyShareLinkButton slug={tierList.shareSlug} />
            <Link href={`/list/${tierList.shareSlug}`} target="_blank">
              <Button variant="outline" size="sm" className="rounded-full gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                Preview
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <TierEditor tierList={tierList} />
      </main>
    </div>
  );
}
