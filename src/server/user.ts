import { CACHE_TAGS, dbCache, getIdTag, revalidateDbCache } from "@/lib/cache";
import { db } from "./db";
import type { Role } from "@prisma/client";
import { z } from "zod";

export async function getUser(userId: string) {
  const cacheFn = dbCache(() => getUserInternal(userId), {
    tags: [getIdTag(userId, CACHE_TAGS.user)],
  });

  return cacheFn();
}

async function getUserInternal(userId: string) {
  const data = await db.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      pricing: {
        include: {
          features: true,
        },
      },
      memberData: {
        include: {
          subscriptions: {
            include: {
              activitieGroups: true,
              activities: true,
              sites: true,
              rooms: true,
              club: true,
            },
          },
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
    subscriptions: data?.memberData?.subscriptions ?? [],
  };
}

export type GetUserData = Awaited<ReturnType<typeof getUser>> | null;

export async function createNewUserFromClerk(
  userId: string,
  emails: string[],
  firstName: string | null,
  lastName: string | null,
) {
  const newUser = await db.user.create({
    data: {
      clerkId: userId,
      email: emails?.[0] ?? "",
      name: `${firstName} ${lastName}`,
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

const getReservationsByUserIdSchema = z.object({
  userId: z.string(),
  after: z.date(),
});
type GetReservationsByUserId = z.infer<typeof getReservationsByUserIdSchema>;

export async function getReservationsByUserId(input: GetReservationsByUserId) {
  const parseResult = getReservationsByUserIdSchema.safeParse(input);
  if (!parseResult.success) {
    return { error: true, data: [], message: "Invalid input" };
  }
  const cacheFn = dbCache(() => getReservationsByUserIdInternal(input), {
    tags: [getIdTag(input.userId, CACHE_TAGS.user)],
  });

  return cacheFn();
}

async function getReservationsByUserIdInternal(input: GetReservationsByUserId) {
  const reservations = await db.reservation.findMany({
    where: { userId: input.userId, date: { gte: input.after } },
    orderBy: { date: "asc" },
    include: {
      room: true,
      activity: true,
      planningActivity: {
        include: {
          activity: true,
          coach: true,
          room: true,
        },
      },
    },
  });
  return { error: false, data: reservations, message: "" };
}
