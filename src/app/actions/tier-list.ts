"use server";

import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteStorageFile, deleteStorageFiles } from "./upload";

export async function createTierList(title: string = "Untitled Tier List") {
  await requireAdmin();
  const shareSlug = nanoid(10);
  const tierList = await prisma.tierList.create({
    data: { title, shareSlug },
    include: { items: true },
  });
  revalidatePath("/");
  return tierList;
}

export async function listTierLists() {
  return prisma.tierList.findMany({
    orderBy: { updatedAt: "desc" },
    include: { items: { select: { id: true } } },
  });
}

export async function getTierListById(id: string) {
  return prisma.tierList.findUnique({
    where: { id },
    include: { items: { orderBy: { position: "asc" } } },
  });
}

export async function getTierListBySlug(slug: string) {
  return prisma.tierList.findUnique({
    where: { shareSlug: slug },
    include: { items: { orderBy: { position: "asc" } } },
  });
}

export async function updateTierListTitle(id: string, title: string) {
  await requireAdmin();
  await prisma.tierList.update({ where: { id }, data: { title } });
  revalidatePath("/");
  revalidatePath(`/list/${id}/edit`);
}

export async function updateItemPositions(
  updates: { itemId: string; tierLabel: string; position: number }[]
) {
  await requireAdmin();
  await prisma.$transaction(
    updates.map(({ itemId, tierLabel, position }) =>
      prisma.tierItem.update({
        where: { id: itemId },
        data: { tierLabel, position },
      })
    )
  );
}

export async function addTierItem(
  tierListId: string,
  name: string,
  imageUrl: string,
  tierLabel: string = "Unranked"
) {
  await requireAdmin();
  const count = await prisma.tierItem.count({
    where: { tierListId, tierLabel },
  });
  const item = await prisma.tierItem.create({
    data: { tierListId, tierLabel, name, imageUrl, position: count },
  });
  revalidatePath("/");
  return item;
}

export async function deleteTierItem(itemId: string) {
  await requireAdmin();
  const item = await prisma.tierItem.findUnique({
    where: { id: itemId },
    select: { imageUrl: true },
  });
  await prisma.tierItem.delete({ where: { id: itemId } });
  if (item) await deleteStorageFile(item.imageUrl);
  revalidatePath("/");
}

export async function deleteTierList(id: string) {
  await requireAdmin();
  const items = await prisma.tierItem.findMany({
    where: { tierListId: id },
    select: { imageUrl: true },
  });
  await prisma.tierList.delete({ where: { id } });
  await deleteStorageFiles(items.map((i) => i.imageUrl));
  revalidatePath("/");
}
