import { getMemberDailyPlanning } from "^/server/planning";
import { getTranslations } from "next-intl/server";
import Wnc from "./reservationWithNoCalendar";
import MakeReservationButton from "./makeReservationButton";

type DailyPlanningProps = Readonly<{
  memberId: string;
  day: Date;
}>;

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
          className="flex flex-col items-center rounded border border-secondary bg-base-100"
        >
          <div className="w-full bg-secondary text-center text-secondary-content">
            {plan.club.name}
          </div>
          <div className="flex shrink-0 flex-wrap items-start gap-2 p-2">
            {plan.activities.map((activity) => (
              <div
                key={activity.id}
                className="border border-base-300 bg-base-100 p-2"
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
                <MakeReservationButton
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
