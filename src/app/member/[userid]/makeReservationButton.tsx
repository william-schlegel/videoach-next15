"use client";

import type { Room } from "@prisma/client";
import { isBefore, isEqual, startOfToday } from "date-fns";
import { useTranslations } from "next-intl";
import useSWR from "swr";

type MakeReservationProps = Readonly<{
  room: Room | null;
  reservations: { id: string; date: Date }[];
  planningActivityId: string;
  memberId: string;
  day: Date;
}>;

export default function MakeReservationButton({
  room,
  reservations,
  planningActivityId,
  memberId,
  day,
}: MakeReservationProps) {
  const t = useTranslations("dashboard");
  const { mutate } = useSWR("/api/planning/post", () =>
    fetch("/api/planning", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberId,
        planningActivityId,
        date: day,
      }),
    }),
  );

  if (!room) return null;
  if (isBefore(day, startOfToday())) return null;

  const free =
    room.capacity > reservations.length
      ? room.capacity - reservations.length
      : 0;
  if (room.reservation === "NONE")
    return (
      <div className="text-center">
        <p className="btn btn-disabled btn-outline btn-xs">
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
        <button className="btn btn-primary btn-xs" onClick={() => mutate()}>
          {t("member.reserve")}
        </button>
      )}
    </div>
  );
}
