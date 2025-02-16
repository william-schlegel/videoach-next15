import { CACHE_TAGS, dbCache, getUserTag } from "@/lib/cache";
import { z } from "zod";
import { db } from "./db";

const getCalendarForClubSchema = z.string().cuid();
type GetCalendarForClub = z.infer<typeof getCalendarForClubSchema>;

export async function getCalendarForClub(input: GetCalendarForClub) {
  getCalendarForClubSchema.parse(input);
  const cacheFn = dbCache(() => getCalendarForClubInternal(input), {
    tags: [getUserTag(input, CACHE_TAGS.calendar)],
  });

  return cacheFn();
}

async function getCalendarForClubInternal(input: GetCalendarForClub) {
  const now = new Date();
  const dtNow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );
  return db.openingCalendar.findFirst({
    where: { clubs: { some: { id: input } }, startDate: { lte: dtNow } },
    orderBy: { startDate: "desc" },
    include: { openingTime: { include: { workingHours: true } } },
  });
}
