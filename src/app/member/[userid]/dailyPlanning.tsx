import { type Room } from "@prisma/client";
import {
  createPlanningReservation,
  getMemberDailyPlanning,
} from "^/server/planning";
import { isBefore, isEqual, startOfToday } from "date-fns";
import { getTranslations } from "next-intl/server";
import Wnc from "./reservationWithNoCalendar";

type DailyPlanningProps = {
  memberId: string;
  day: Date;
};

export default async function DailyPlanning({
  memberId,
  day,
}: DailyPlanningProps) {
  const t = await getTranslations("dashboard");
  const planning = await getMemberDailyPlanning({
    date: day,
    memberId,
  });
  if (!planning) return <div>{t("no-planning")}</div>;
  return (
    <div className="flex flex-col gap-2">
      {planning.map((plan) => (
        <div
          key={plan.id}
          className="border-secondary bg-base-100 flex flex-col items-center rounded border"
        >
          <div className="bg-secondary text-secondary-content w-full text-center">
            {plan.club.name}
          </div>
          <div className="flex shrink-0 flex-wrap items-start gap-2 p-2">
            {plan.activities.map((activity) => (
              <div
                key={activity.id}
                className="border-base-300 bg-base-100 border p-2"
              >
                <p>
                  <span className="text-xs">{activity.startTime}</span>
                  {" ("}
                  <span className="text-xs">{activity.duration}</span>
                  {"') "}
                  <span>{activity.activity.name}</span>
                </p>
                <p className="text-xs">
                  <span>{activity.site?.name}</span>
                  {" - "}
                  <span>{activity.room?.name}</span>
                </p>
                <MakeReservation
                  room={activity.room}
                  reservations={activity.reservations}
                  memberId={memberId}
                  planningActivityId={activity.id}
                  day={day}
                />
              </div>
            ))}
            {plan.withNoCalendar.map((activity) => (
              <Wnc
                key={activity.id}
                activity={activity}
                day={day}
                memberId={memberId}
                reservations={activity.reservations}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type MakeReservationProps = {
  room: Room | null;
  reservations: { id: string; date: Date }[];
  planningActivityId: string;
  memberId: string;
  day: Date;
};

async function MakeReservation({
  room,
  reservations,
  planningActivityId,
  memberId,
  day,
}: MakeReservationProps) {
  const t = await getTranslations("dashboard");

  if (!room) return null;
  if (isBefore(day, startOfToday())) return null;

  const free =
    room.capacity > reservations.length
      ? room.capacity - reservations.length
      : 0;
  if (room.reservation === "NONE")
    return (
      <div className="text-center">
        <p className="btn-outline btn-disabled btn btn-xs">
          {t("member.free-access")}
        </p>
      </div>
    );

  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs">
        {free
          ? t("member.remain", { free, capacity: room.capacity })
          : t("member.waiting-list")}
      </p>
      {reservations.find(
        (r) => r.id === planningActivityId && isEqual(day, r.date),
      ) ? (
        <span className="btn btn-accent btn-xs">{t("member.reserved")}</span>
      ) : (
        <button
          className="btn btn-primary btn-xs"
          // onClick={() =>
          //   createReservation({
          //     planningActivityId,
          //     memberId,
          //     date: day,
          //   })
          // }
        >
          {t("member.reserve")}
        </button>
      )}
    </div>
  );
}
