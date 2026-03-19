import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Crown className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Page not found</h2>
        <p className="mt-2 text-muted-foreground">The tier list you&apos;re looking for doesn&apos;t exist.</p>
      </div>
      <Link href="/">
        <Button className="rounded-full px-6">Go home</Button>
      </Link>
    </div>
  );
}
