"use server";

import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteStorageFile, deleteStorageFiles } from "./upload";

const tierListDetailInclude = {
  tags: { orderBy: { name: "asc" as const } },
  items: {
    orderBy: { position: "asc" as const },
    include: { tags: { orderBy: { name: "asc" as const } } },
  },
} as const;

async function revalidateTierListPaths(tierListId: string) {
  const row = await prisma.tierList.findUnique({
    where: { id: tierListId },
    select: { shareSlug: true },
  });
  revalidatePath("/");
  revalidatePath(`/list/${tierListId}/edit`);
  if (row) revalidatePath(`/list/${row.shareSlug}`);
}

async function assertTagsBelongToList(tierListId: string, tagIds: string[]) {
  if (tagIds.length === 0) return;
  const n = await prisma.tierListTag.count({
    where: { tierListId, id: { in: tagIds } },
  });
  if (n !== tagIds.length) {
    throw new Error("One or more labels are invalid for this list");
  }
}

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Use a hex colour like #22c55e");

const createTagSchema = z.object({
  name: z.string().trim().min(1).max(40),
  color: z
    .string()
    .transform((s) => {
      const t = s.trim();
      if (/^#[0-9A-Fa-f]{6}$/i.test(t)) return t.toUpperCase();
      return t;
    })
    .pipe(hexColor),
});

const updateTagSchema = z.object({
  name: z.string().trim().min(1).max(40).optional(),
  color: z
    .string()
    .transform((s) => {
      const t = s.trim();
      if (/^#[0-9A-Fa-f]{6}$/i.test(t)) return t.toUpperCase();
      return t;
    })
    .pipe(hexColor)
    .optional(),
});

const updateItemSchema = z.object({
  name: z.string().trim().min(1).max(200),
  notes: z.string().trim().max(2000).optional().nullable(),
  highlight: z.enum(["NONE", "STAR", "HIDDEN_GEM"]),
  tagIds: z.array(z.string().min(1)).max(24),
});

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
    include: tierListDetailInclude,
  });
}

export async function getTierListBySlug(slug: string) {
  return prisma.tierList.findUnique({
    where: { shareSlug: slug },
    include: tierListDetailInclude,
  });
}

export async function updateTierListTitle(id: string, title: string) {
  await requireAdmin();
  await prisma.tierList.update({ where: { id }, data: { title } });
  revalidatePath("/");
  revalidatePath(`/list/${id}/edit`);
}

export async function createTierListTag(tierListId: string, raw: unknown) {
  await requireAdmin();
  const parsed = createTagSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid label");
  const { name, color } = parsed.data;
  try {
    await prisma.tierListTag.create({
      data: { tierListId, name, color },
    });
  } catch (e: unknown) {
    const code = typeof e === "object" && e && "code" in e ? (e as { code: string }).code : "";
    if (code === "P2002") throw new Error("A label with that name already exists");
    throw e;
  }
  await revalidateTierListPaths(tierListId);
}

export async function updateTierListTag(tagId: string, raw: unknown) {
  await requireAdmin();
  const parsed = updateTagSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid label");
  const data = parsed.data;
  if (data.name === undefined && data.color === undefined) return;
  try {
    const tag = await prisma.tierListTag.update({
      where: { id: tagId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.color !== undefined ? { color: data.color } : {}),
      },
      select: { tierListId: true },
    });
    await revalidateTierListPaths(tag.tierListId);
  } catch (e: unknown) {
    const code = typeof e === "object" && e && "code" in e ? (e as { code: string }).code : "";
    if (code === "P2002") throw new Error("That label name is already used");
    throw e;
  }
}

export async function deleteTierListTag(tagId: string) {
  await requireAdmin();
  const tag = await prisma.tierListTag.delete({
    where: { id: tagId },
    select: { tierListId: true },
  });
  await revalidateTierListPaths(tag.tierListId);
}

export async function updateTierItem(itemId: string, data: z.infer<typeof updateItemSchema>) {
  await requireAdmin();
  const parsed = updateItemSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.message);
  const { name, notes, highlight, tagIds } = parsed.data;
  const item = await prisma.tierItem.findUnique({
    where: { id: itemId },
    select: { tierListId: true },
  });
  if (!item) throw new Error("Item not found");
  await assertTagsBelongToList(item.tierListId, tagIds);
  await prisma.tierItem.update({
    where: { id: itemId },
    data: {
      name,
      notes: notes === "" || notes == null ? null : notes,
      highlight,
      tags: { set: tagIds.map((id) => ({ id })) },
    },
  });
  await revalidateTierListPaths(item.tierListId);
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
  options?: {
    tierLabel?: string;
    notes?: string | null;
    tagIds?: string[];
  }
) {
  await requireAdmin();
  const tierLabel = options?.tierLabel ?? "Unranked";
  const tagIds = options?.tagIds ?? [];
  const notes =
    options?.notes === undefined || options?.notes === null
      ? null
      : String(options.notes).trim() || null;
  await assertTagsBelongToList(tierListId, tagIds);
  const count = await prisma.tierItem.count({
    where: { tierListId, tierLabel },
  });
  const item = await prisma.tierItem.create({
    data: {
      tierListId,
      tierLabel,
      name,
      imageUrl,
      position: count,
      notes,
      tags:
        tagIds.length > 0 ? { connect: tagIds.map((id) => ({ id })) } : undefined,
    },
  });
  await revalidateTierListPaths(tierListId);
  return item;
}

export async function deleteTierItem(itemId: string) {
  await requireAdmin();
  const item = await prisma.tierItem.findUnique({
    where: { id: itemId },
    select: { imageUrl: true, tierListId: true },
  });
  await prisma.tierItem.delete({ where: { id: itemId } });
  if (item) {
    await deleteStorageFile(item.imageUrl);
    await revalidateTierListPaths(item.tierListId);
  }
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
