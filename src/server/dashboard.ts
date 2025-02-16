import { Role } from "@prisma/client";
import { CACHE_TAGS, dbCache, getGlobalTag, getIdTag } from "@/lib/cache";
import { startOfToday } from "date-fns";
import { z } from "zod";
import { db } from "./db";
import { getUser } from "./user";

// export const dashboardRouter = router({
//   getManagerDataForUserId: protectedProcedure
//     .input(z.string())
//     .query(async ({ ctx, input }) => {
//       if (
//         ctx.session.user.role !== Role.ADMIN &&
//         ctx.session.user.role !== Role.MANAGER &&
//         ctx.session.user.role !== Role.MANAGER_COACH
//       )
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           message: "You cannot read manager data",
//         });
//       const clubData = await ctx.prisma.club.findMany({
//         where: { managerId: input },
//         include: {
//           sites: {
//             include: { _count: true },
//           },
//           activities: {
//             select: { name: true },
//           },
//           subscriptions: {
//             select: {
//               _count: true,
//               users: {
//                 select: {
//                   userId: true,
//                 },
//               },
//             },
//           },
//           events: {
//             where: {
//               startDate: { gte: startOfToday() },
//             },
//             orderBy: {
//               startDate: "asc",
//             },
//           },
//         },
//       });

//       if (!clubData) return null;
//       const memberSet = new Set<string>();
//       let members = 0;
//       const initialValue = {
//         activities: 0,
//         subscriptions: 0,
//         sites: 0,
//         rooms: 0,
//       };
//       const { activities, subscriptions, sites, rooms } = clubData.reduce(
//         (acc, c) => {
//           for (const s of c.subscriptions)
//             for (const u of s.users) memberSet.add(u.userId);
//           acc.subscriptions += c.subscriptions.length;
//           acc.sites += c.sites.length;
//           acc.rooms += c.sites.reduce((ss, s) => (ss += s._count.rooms), 0);
//           acc.activities += c.activities.length;
//           return acc;
//         },
//         initialValue
//       );
//       members = memberSet.size;

//       return {
//         clubs: clubData.map((c) => ({
//           id: c.id,
//           name: c.name,
//           events: c.events.map((e) => ({
//             id: e.id,
//             name: e.name,
//             startDate: e.startDate,
//           })),
//         })),
//         clubCount: clubData.length,
//         activities,
//         subscriptions,
//         sites,
//         rooms,
//         members,
//       };
//     }),
//   getCoachDataForUserId: protectedProcedure
//     .input(z.string())
//     .query(async ({ ctx, input }) => {
//       if (
//         ctx.session.user.role !== Role.ADMIN &&
//         ctx.session.user.role !== Role.COACH &&
//         ctx.session.user.role !== Role.MANAGER_COACH
//       )
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           message: "You cannot read coach data",
//         });
//       const clubData = await ctx.prisma.user.findUnique({
//         where: { id: input },
//         include: {
//           coachData: {
//             include: {
//               clubs: true,
//               certifications: true,
//               activityGroups: true,
//               page: true,
//               coachingPrices: true,
//             },
//           },
//         },
//       });
//       return clubData;
//     }),

export async function getAdminData() {
  const { userId } = await auth();
  if (!userId) return { error: true, data: null, message: "No user id found" };
  const user = await getUser(userId);
  if (!user || user.role !== Role.ADMIN)
    return { error: true, data: null, message: "user is not admin" };

  const cacheFn = dbCache(() => getAdminDataInternal(), {
    tags: [getGlobalTag(CACHE_TAGS.club), getGlobalTag(CACHE_TAGS.user)],
  });

  return cacheFn();
}

async function getAdminDataInternal() {
  const clubs = await db.club.findMany({
    include: { sites: { include: { _count: true } } },
  });
  const members = await db.user.findMany();
  return {
    error: false,
    data: {
      clubs,
      members,
    },
    message: null,
  };
}

export type GetAdminData = Awaited<ReturnType<typeof getAdminData>>;
