import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewTierListPage() {
  await requireAdmin("/list/new");
  const shareSlug = nanoid(10);
  const tierList = await prisma.tierList.create({
    data: { title: "Untitled Tier List", shareSlug },
  });
  redirect(`/list/${tierList.id}/edit`);
}
