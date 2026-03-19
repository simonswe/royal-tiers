import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewTierListPage() {
  const shareSlug = nanoid(10);
  const tierList = await prisma.tierList.create({
    data: { title: "Untitled Tier List", shareSlug },
  });
  redirect(`/list/${tierList.id}/edit`);
}
