"use client";

import { SelectDate } from "^/app/_components/ui/selectDay";
import { startOfToday } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import DailyPlanning from "./dailyPlanning";

type DailyPlanningSectionProps = Readonly<{
  userId: string;
}>;

export default function DailyPlanningSection({
  userId,
}: DailyPlanningSectionProps) {
  const [day, setDay] = useState(startOfToday());
  const t = useTranslations();
  return (
    <article className="border-primary rounded-md border p-2">
      <div className="flex items-center justify-between">
        <h2>{t("member.my-planning")}</h2>
        <SelectDate day={day} onNewDay={(newDay) => setDay(newDay)} />
      </div>
      <DailyPlanning day={day} memberId={userId} />
    </article>
  );
}
