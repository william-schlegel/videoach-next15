import type {
  Activity,
  ActivityGroup,
  Club,
  Room,
  Site,
  Subscription,
  SubscriptionMode,
  SubscriptionRestriction,
} from "@prisma/client";
import { getDataNames } from "^/server/subscription";
import { getTranslations } from "next-intl/server";

type SubscriptionProps = {
  subscription: Subscription & {
    sites: Site[];
    activities: Activity[];
    rooms: Room[];
    activitieGroups: ActivityGroup[];
    club: Club;
  };
};

export default async function Subscription({
  subscription,
}: SubscriptionProps) {
  const { sites, rooms, activityGroups, activities } = await getDataNames({
    activityGroupIds: subscription.activitieGroups.map((ag) => ag.id),
    activityIds: subscription.activities.map((ag) => ag.id),
    siteIds: subscription.sites.map((ag) => ag.id),
    roomIds: subscription.rooms.map((ag) => ag.id),
  });
  return (
    <div className="card bg-base-100 w-full shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h3 className="card-title text-primary">{subscription.name}</h3>
          <span className="badge-primary badge">{subscription.club.name}</span>
        </div>
        {/* {shortInfo ? <p>{shortInfo}</p> : ""} */}
        <div className="flex gap-2">
          <List label="sites" items={sites.map((s) => s.name)} />
          <List label="rooms" items={rooms.map((r) => r.name)} />
          <List
            label="activity-groups"
            items={activityGroups.map((a) => a.name)}
          />
          <List label="activities" items={activities.map((a) => a.name)} />
        </div>
      </div>
    </div>
  );
}
type ListProps = {
  label: string;
  items: string[];
};
export async function List({ label, items }: ListProps) {
  if (!items.length) return null;
  const t = await getTranslations("dashboard");
  return (
    <div className="flex flex-1 flex-col">
      <h4>{t(label, { count: items.length })}</h4>
      <ul>
        {items.map((item, idx) => (
          <li key={`ITEM-${idx}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// export function useDisplaySubscriptionInfo(
//   mode: SubscriptionMode | undefined,
//   restriction: SubscriptionRestriction | undefined,
//   activityGroupIds: string[],
//   activityIds: string[],
//   siteIds: string[],
//   roomIds: string[]
// ) {
//   const t = useTranslations("club");

//   const { data } = getDataNames.useQuery(
//     {
//       siteIds,
//       roomIds,
//       activityGroupIds,
//       activityIds,
//     },
//     { enabled: mode != undefined && restriction != undefined }
//   );
//   let info = "";
//   let shortInfo = "";

//   if (!data)
//     return {
//       info: "",
//       sites: [],
//       rooms: [],
//       activityGroups: [],
//       activities: [],
//     };

//   const sites = data.sites.map((s) => s.name);
//   const rooms = data.rooms.map((s) => s.name);
//   const activityGroups = data.activityGroups.map((s) => s.name);
//   const activities = data.activities.map((s) => s.name);

//   const listFormatter = new Intl.ListFormat(i18n?.language);

//   switch (mode) {
//     case "ALL_INCLUSIVE":
//       shortInfo = t("subscription.mode.all-inclusive-select");
//       break;
//     case "ACTIVITY_GROUP":
//       info = t("subscription.mode.activity-group-select", {
//         count: data.activityGroups.length,
//       });
//       info = info.concat(listFormatter.format(activityGroups));
//       break;
//     case "ACTIVITY":
//       info = t("subscription.mode.activity-select", {
//         count: data.activities.length,
//       });
//       info = info.concat(listFormatter.format(activities));
//       break;
//     case "DAY":
//       shortInfo = t("subscription.mode.day-select");
//       break;
//     default:
//   }
//   info = info.concat(" ");
//   switch (restriction) {
//     case "CLUB":
//       info = info.concat(t("subscription.restriction.club-select"));
//       break;
//     case "SITE":
//       info = info.concat(
//         t("subscription.restriction.site-select", { count: data.sites.length })
//       );
//       info = info.concat(listFormatter.format(sites));
//       break;
//     case "ROOM":
//       info = info.concat(
//         t("subscription.restriction.room-select", { count: data.rooms.length })
//       );
//       info = info.concat(listFormatter.format(rooms));
//       break;
//     default:
//   }

//   return {
//     shortInfo,
//     info: shortInfo.concat(info),
//     sites,
//     rooms,
//     activityGroups,
//     activities,
//   };
// }
