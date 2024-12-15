import type {
  Activity,
  DayOpeningTime,
  OpeningTime,
  RoomReservation,
} from "@prisma/client";
import { getDayForDate } from "^/lib/getDayName";
import { getCalendarForClub } from "^/server/calendar";
import { getTranslations } from "next-intl/server";

type WncRoom = {
  id: string;
  name: string;
  capacity: number;
  reservation: RoomReservation;
};

type WncProps = {
  activity: Activity & {
    rooms: WncRoom[];
  };
  day: Date;
  memberId: string;
  reservations: { id: string; date: Date }[];
};

type TOpeningTime =
  | (DayOpeningTime & {
      workingHours: OpeningTime[];
    })
  | null;

export default async function Wnc({
  activity,
  day,
  memberId,
  reservations,
}: WncProps) {
  const t = await getTranslations("dashboard");
  const dayName = getDayForDate(day);
  const calClub = await getCalendarForClub(activity.clubId);

  let openingText = "";
  let OT: TOpeningTime = null;
  if (calClub) OT = calClub.openingTime.find((d) => d.name === dayName) ?? null;

  if (OT?.wholeDay) openingText = t("member.all-day");
  else if (OT?.closed) openingText = t("member.closed");
  else {
    openingText =
      OT?.workingHours.map((wh) => `${wh.opening}-${wh.closing}`).join(" | ") ??
      "";
  }

  return (
    <>
      {activity.rooms.map((room) => (
        <div
          key={`${room?.name}-${activity.id}`}
          className="border-base-300 bg-base-100 border p-2"
        >
          <p>
            <span className="text-xs">{openingText}</span>&nbsp;
            <span>{activity.name}</span>
          </p>
          <p className="text-xs">
            {room?.name ? <span>{room.name}</span> : null}
          </p>
          <ReserveDuration
            activity={activity}
            room={room}
            reservations={reservations}
            day={day}
            memberId={memberId}
            workingHours={OT}
          />
        </div>
      ))}
    </>
  );
}

type ReserveDurationProps = {
  activity: Activity;
  room: WncRoom;
  reservations: { id: string; date: Date }[];
  day: Date;
  memberId: string;
  workingHours: TOpeningTime;
};

async function ReserveDuration(
  {
    // room,
    // activity,
    // reservations,
    // day,
    // memberId,
    // workingHours,
  }: ReserveDurationProps,
) {
  return null;
  // const t  = await getTranslations("dashboard");
  //   const utils = trpc.useContext();
  //   const createReservation =
  //     trpc.plannings.createActivityReservation.useMutation({
  //       onSuccess() {
  //         utils.users.getReservationsByUserId.invalidate({
  //           userId: memberId,
  //           after: day,
  //         });
  //         utils.plannings.getMemberDailyPlanning.invalidate({
  //           memberId,
  //           date: day,
  //         });
  //       },
  //     });
  //   const [closeModal, setCloseModal] = useState(false);

  //   if (isBefore(day, startOfToday())) return null;

  //   const onSubmit = (slot: TSlot) => {
  //     const [hours, minutes] = getHour(setHour(slot.start));
  //     const date = add(startOfDay(day), { hours, minutes });
  //     createReservation.mutate({
  //       date,
  //       memberId,
  //       activityId: activity.id,
  //       roomId: room.id,
  //       activitySlot: slot.number,
  //     });
  //     setCloseModal(true);
  //   };

  //   if (room?.reservation === "NONE")
  //     return (
  //       <div className="text-center">
  //         <p className="btn-outline btn-disabled btn btn-xs">
  //           {t("member.free-access")}
  //         </p>
  //       </div>
  //     );
  //   const free =
  //     room.capacity > reservations.length
  //       ? room.capacity - reservations.length
  //       : 0;

  //   return (
  //     <div className="flex items-center justify-between gap-2">
  //       <p className="text-xs">
  //         {free
  //           ? t("member.remain", { free, capacity: room.capacity })
  //           : t("member.waiting-list")}
  //       </p>
  //       {reservations.find(
  //         (r) => r.id === activity.id && isEqual(day, r.date)
  //       ) ? (
  //         <span className="btn btn-accent btn-xs">{t("member.reserved")}</span>
  //       ) : (
  //         <Modal
  //           title={t("member.reserve")}
  //           variant="Primary"
  //           buttonSize="xs"
  //           cancelButtonText=""
  //           closeModal={closeModal}
  //           onCloseModal={() => setCloseModal(false)}
  //         >
  //           <h3>{t("member.reserve")}</h3>
  //           <label>{t("club:activity.slot")}</label>
  //           <AvailableSlots
  //             workingHours={workingHours}
  //             duration={activity.reservationDuration}
  //             day={day}
  //             reservations={reservations}
  //             onSelect={(slot) => onSubmit(slot)}
  //           />
  //         </Modal>
  //       )}
  //     </div>
  //   );
  // }

  // type TSlot = {
  //   start: number;
  //   end: number;
  //   slot: string;
  //   number: number;
  //   available: boolean;
  // };
  // type AvailableSlotsProps = {
  //   workingHours: TOpeningTime;
  //   reservations: { id: string; date: Date }[];
  //   onSelect: (slot: TSlot) => void;
  //   duration: number;
  //   day: Date;
  // };

  // function getHour(workingHour: string | null | undefined) {
  //   if (workingHour == null || workingHour == undefined) return [0, 0];
  //   const hm = workingHour.split(":");
  //   if (hm.length < 2) return [0, 0];
  //   const h = Number(hm[0]);
  //   const m = Number(hm[1]);
  //   return [h, m];
  // }

  // function setHour(hm: number) {
  //   const h = Math.floor(hm);
  //   const m = (hm - h) * 60;
  //   return `${`0${h}`.slice(-2)}:${`0${m}`.slice(-2)}`;
  // }

  // function AvailableSlots({
  //   workingHours,
  //   reservations,
  //   duration,
  //   onSelect,
  //   day,
  // }: AvailableSlotsProps) {
  //   const { t } = useTranslation("dashboard");
  //   const slots: Array<TSlot> = [];
  //   if (!workingHours) return <span>{t("club:activity.no-slot")}</span>;
  //   const [hs, ms] = getHour(workingHours.workingHours[0]?.opening);
  //   let hStart = (hs ?? 0) + (ms ?? 0) / 60;
  //   const [he, me] = getHour(workingHours.workingHours[0]?.closing);
  //   const hEnd = (he ?? 0) + (me ?? 0) / 60;
  //   const durationDec = duration / 60;

  //   function checkAvailability(start: number) {
  //     const [hours, minutes] = getHour(setHour(start));
  //     const dtStart = add(startOfDay(day), { hours, minutes });
  //     const dtEnd = add(startOfDay(day), {
  //       hours,
  //       minutes: minutes ?? 0 + duration,
  //     });
  //     const reserved = reservations.find(
  //       (r) => r.date >= dtStart && r.date <= dtEnd
  //     );
  //     return !reserved;
  //   }

  //   while (hStart < hEnd) {
  //     const end = Math.min(hStart + durationDec, hEnd);
  //     slots.push({
  //       start: hStart,
  //       end,
  //       slot: `${setHour(hStart)} : ${setHour(end)}`,
  //       available: checkAvailability(hStart),
  //       number: slots.length,
  //     });
  //     hStart += durationDec;
  //   }

  //   return (
  //     <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2">
  //       {slots.map((slot, idx) => (
  //         <span
  //           key={idx}
  //           className={`btn btn-sm ${
  //             slot.available ? "btn-primary" : "btn-disabled"
  //           }`}
  //           onClick={() => onSelect(slot)}
  //         >
  //           {slot.slot}
  //         </span>
  //       ))}
  //     </div>
  //   );
}
