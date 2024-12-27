"use client";

import type {
  Activity,
  PlanningActivity,
  Reservation,
  Room,
  UserCoach,
} from "@prisma/client";
import Confirmation from "^/app/_components/ui/confirmation";
import { getButtonSize } from "^/app/_components/ui/modal";
import { formatDateLocalized } from "^/lib/formatDate";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import useSWR from "swr";

type MyReservationProps = Readonly<{
  memberId: string;
  day: Date;
  reservation: Reservation & {
    room: Room | null;
    activity: Activity | null;
    planningActivity:
      | (PlanningActivity & {
          activity: Activity;
          coach: UserCoach | null;
          room: Room | null;
        })
      | null;
  };
}>;

export default function MyReservation({ reservation }: MyReservationProps) {
  const t = useTranslations("dashboard");

  const { mutate } = useSWR("/api/planning/delete", () =>
    fetch("/api/planning", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservationId: reservation.id,
      }),
    }),
  );

  return (
    <div className="rounded border border-primary bg-base-100">
      <div className="flex items-center justify-between gap-4 bg-primary px-3 py-1 text-center text-primary-content">
        <span>{formatDateLocalized(reservation.date, { withDay: true })}</span>
        <Confirmation
          message={t("member.reservation-delete-message")}
          title={t("member.delete-reservation")}
          buttonIcon={<i className={`bx bx-trash ${getButtonSize("xs")}`} />}
          onConfirm={() => mutate()}
          buttonSize="xs"
          variant="Icon-Only-Secondary"
        />
      </div>
      {reservation?.planningActivity ? (
        <div className="p-2">
          <div className="space-x-2 text-center">
            <span className="font-semibold">
              {reservation.planningActivity?.activity?.name}
            </span>
            {reservation.planningActivity?.coach?.publicName ? (
              <span className="text-xs">
                {"("}
                {reservation.planningActivity?.coach?.publicName}
                {")"}
              </span>
            ) : null}
          </div>
          <div className="flex justify-between">
            <span>{reservation.planningActivity?.startTime}</span>
            <span>{reservation.planningActivity?.room?.name}</span>
          </div>
        </div>
      ) : null}
      {reservation?.activity ? (
        <div className="p-2">
          <div className="space-x-2 text-center">
            <span className="font-semibold">{reservation.activity?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="space-x-2">
              <span>{format(reservation?.date, "HH:mm")}</span>
              <span className="text-xs">
                {"("}
                {reservation.activity.reservationDuration}
                {"')"}
              </span>
            </span>
            <span>{reservation.room?.name}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
