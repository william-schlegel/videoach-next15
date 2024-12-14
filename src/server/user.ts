import { CACHE_TAGS, dbCache, getIdTag, revalidateDbCache } from "^/lib/cache";
import { db } from "./db";
import type { Role } from "@prisma/client";

export async function getUser(userId: string) {
  const cacheFn = dbCache(() => getUserInternal(userId), {
    tags: [getIdTag(userId, CACHE_TAGS.user)],
  });

  return cacheFn();
}

async function getUserInternal(userId: string) {
  const data = await db.user.findFirst({
    where: {
      clerkId: userId,
    },
    include: {
      pricing: {
        include: {
          features: true,
        },
      },
    },
  });

  return {
    id: data?.id,
    name: data?.name ?? "",
    email: data?.email ?? "",
    role: data?.role ?? ("VISITOR" as Role | "VISITOR"),
    features: data?.pricing?.features.map((f) => f.feature) ?? [],
  };
}

export type GetUserData = Awaited<ReturnType<typeof getUser>> | null;

export async function createNewUserFromClerk(userId: string) {
  const newUser = await db.user.create({
    data: {
      clerkId: userId,
    },
  });
  if (newUser != null) {
    revalidateDbCache({
      tag: CACHE_TAGS.user,
      id: newUser.id,
      userId: newUser.clerkId,
    });
  }

  return newUser;
}
