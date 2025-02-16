import { CACHE_TAGS, dbCache, getIdTag } from "@/lib/cache";
import { db } from "./db";
import { z } from "zod";

const getDataNamesShema = z.object({
  siteIds: z.array(z.string().cuid()),
  roomIds: z.array(z.string().cuid()),
  activityGroupIds: z.array(z.string().cuid()),
  activityIds: z.array(z.string().cuid()),
});

type GetDataNamesParams = z.infer<typeof getDataNamesShema>;

export async function getDataNames(input: GetDataNamesParams) {
  getDataNamesShema.parse(input);
  const cacheFn = dbCache(() => getDataNamesInternal(input), {
    tags: [
      ...input.siteIds.map((id) => getIdTag(id, CACHE_TAGS.site)),
      ...input.roomIds.map((id) => getIdTag(id, CACHE_TAGS.room)),
      ...input.activityGroupIds.map((id) =>
        getIdTag(id, CACHE_TAGS.activityGroup),
      ),
      ...input.activityIds.map((id) => getIdTag(id, CACHE_TAGS.activity)),
    ],
  });

  return cacheFn();
}

async function getDataNamesInternal(input: GetDataNamesParams) {
  getDataNamesShema.parse(input);
  const sites = await db.site.findMany({
    where: { id: { in: input.siteIds } },
    select: { id: true, name: true },
  });
  const rooms = await db.room.findMany({
    where: { id: { in: input.roomIds } },
    select: { id: true, name: true },
  });

  const activityGroups = await db.activityGroup.findMany({
    where: { id: { in: input.activityGroupIds } },
    select: { id: true, name: true },
  });
  const activities = await db.activity.findMany({
    where: { id: { in: input.activityIds } },
    select: { id: true, name: true },
  });

  return { sites, rooms, activityGroups, activities };
}
