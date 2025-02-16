import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  revalidateDbCache,
} from "@/lib/cache";
import { db } from "./db";
import { z } from "zod";
import type {
  Activity,
  Club,
  DayName,
  Planning,
  PlanningActivity,
  Room,
  RoomReservation,
  Site,
  UserCoach,
} from "@prisma/client";
import { getDayName } from "@/lib/formatDate";
import { isCUID } from "@/lib/checkValidity";

const getMemberDailyPlanningSchema = z.object({
  memberId: z.string().cuid(),
  date: z.date(),
});

type GetMemberDailyPlanning = z.infer<typeof getMemberDailyPlanningSchema>;

export async function getMemberDailyPlanning(input: GetMemberDailyPlanning) {
  const parseResult = getMemberDailyPlanningSchema.safeParse(input);
  if (!parseResult.success) {
    return { error: true, message: "Invalid input" };
  }
  const cacheFn = dbCache(() => getMemberDailyPlanningInternal(input), {
    tags: [getGlobalTag(CACHE_TAGS.planning)],
  });

  return cacheFn();
}

async function getMemberDailyPlanningInternal(input: GetMemberDailyPlanning) {
  const user = await db.user.findUnique({
    where: { id: input.memberId },
    include: {
      memberData: {
        include: {
          subscriptions: {
            include: {
              activitieGroups: true,
              activities: true,
              rooms: true,
              sites: true,
            },
          },
        },
      },
    },
  });
  const clubIds = Array.from(
    new Set(user?.memberData?.subscriptions.map((s) => s.clubId)),
  );

  const planningClubs = await db.planning.findMany({
    where: {
      startDate: {
        lte: new Date(Date.now()),
      },
      clubId: {
        in: clubIds,
      },
    },
    include: { club: true },
  });

  const planning: (Planning & {
    club: Club;
    activities: (PlanningActivity & {
      site: Site;
      room: Room | null;
      activity: Activity;
      coach: UserCoach | null;
      reservations: { id: string; date: Date }[];
    })[];
    withNoCalendar: (Activity & {
      rooms: {
        id: string;
        name: string;
        capacity: number;
        reservation: RoomReservation;
      }[];
      reservations: { id: string; date: Date; roomName: string }[];
    })[];
  })[] = [];

  const dayName = getDayName(input.date);

  for (const planningClub of planningClubs) {
    const sub = user?.memberData?.subscriptions.filter(
      (s) => s.clubId === planningClub.clubId,
    );

    type TIn = { in: string[] };
    type TFilter = {
      activityId?: TIn;
      activity?: { groupId: TIn };
      siteId?: TIn;
      roomId?: TIn;
    };
    const where: {
      day: DayName;
      planningId: string;
      OR?: TFilter[];
    } = {
      day: dayName,
      planningId: planningClub.id,
    };
    type TFilterNC = {
      id?: TIn;
      groupId?: TIn;
    };

    const whereNoCal: {
      clubId: string;
      noCalendar: boolean;
      OR?: TFilterNC[];
    } = {
      clubId: planningClub.clubId,
      noCalendar: true,
    };

    for (const s of sub ?? []) {
      let fAct: TIn | null = null;
      let fGAct: TIn | null = null;
      let fSite: TIn | null = null;
      let fRoom: TIn | null = null;

      if (s.mode === "ACTIVITY_GROUP")
        fGAct = {
          in: s?.activitieGroups.map((ag) => ag.id),
        };
      if (s.mode === "ACTIVITY")
        fAct = {
          in: s.activities.map((a) => a.id),
        };
      if (s.restriction === "SITE") {
        const sites = s.sites.map((s) => s.id);
        fSite = { in: sites };
      }
      if (s.restriction === "ROOM") {
        const rooms = s.rooms.map((s) => s.id);
        fRoom = { in: rooms };
      }
      const filter: TFilter = {};
      if (fGAct) filter.activity = { groupId: fGAct };
      if (fAct) filter.activityId = fAct;
      if (fSite) filter.siteId = fSite;
      if (fRoom) filter.roomId = fRoom;
      if (Object.keys(filter).length) {
        if (!where.OR) where.OR = [];
        where.OR.push(filter);
      }
      const filterNC: TFilterNC = {};
      if (fGAct) filterNC.groupId = fGAct;
      if (fAct) filterNC.id = fAct;
      if (Object.keys(filterNC).length) {
        if (!whereNoCal.OR) whereNoCal.OR = [];
        whereNoCal.OR.push(filterNC);
      }
    }
    const pa = await db.planningActivity.findMany({
      where,
      include: {
        activity: true,
        coach: true,
        room: true,
        site: true,
        reservations: {
          where: {
            date: { gte: input.date },
          },
        },
      },
    });
    const withNoCalendar = await db.activity.findMany({
      where: whereNoCal,
      include: {
        // sites: { select: { name: true } },
        rooms: {
          select: {
            id: true,
            name: true,
            capacity: true,
            reservation: true,
          },
        },
        reservations: {
          where: {
            date: { gte: input.date },
          },
          include: {
            room: true,
          },
        },
      },
    });
    planning.push({
      ...planningClub,
      activities: pa.map((p) => ({
        ...p,
        reservations: p.reservations
          .filter((r) => isCUID(r.planningActivityId))
          .map((r) => ({ id: r.planningActivityId ?? "", date: r.date })),
      })),
      withNoCalendar: withNoCalendar.map((wnc) => ({
        ...wnc,
        rooms: wnc.rooms ?? [],
        reservations: wnc.reservations
          .filter((r) => isCUID(r.activityId))
          .map((r) => ({
            id: r.activityId ?? "",
            date: r.date,
            roomName: r.room?.name ?? "",
          })),
      })),
    });
  }

  // TODO: manage exception days
  return planning;
}

const createPlanningReservationSchema = z.object({
  memberId: z.string().cuid(),
  planningActivityId: z.string().cuid(),
  date: z.date(),
});

export type CreatePlanningReservation = z.infer<
  typeof createPlanningReservationSchema
>;

export async function createPlanningReservation(
  input: CreatePlanningReservation,
) {
  const parseResult = createPlanningReservationSchema.safeParse(input);
  if (!parseResult.success) {
    return { error: true, message: "Invalid input" };
  }
  try {
    const reservation = await db.reservation.create({
      data: {
        date: input.date,
        planningActivityId: input.planningActivityId,
        userId: input.memberId,
      },
    });
    revalidateDbCache({ tag: CACHE_TAGS.planning });
    return { error: false, data: reservation };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Error occurred" };
  }
}

export async function deleteReservation(input: string) {
  const parseResult = z.string().cuid().safeParse(input);
  if (!parseResult.success) {
    return { error: true, message: "Invalid input" };
  }
  try {
    const deleted = await db.reservation.delete({ where: { id: input } });
    revalidateDbCache({ tag: CACHE_TAGS.planning });
    return { error: false, data: deleted.id };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Error occurred" };
  }
}
