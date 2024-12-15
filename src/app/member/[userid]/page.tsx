import Link from "next/link";
import { getReservationsByUserId, getUser } from "^/server/user";
import { redirect } from "next/navigation";
import Subscription from "./subscription";
import { getTranslations } from "next-intl/server";
import PageLayout from "^/app/_components/pageLayout";
import { SelectDate } from "^/app/_components/ui/selectDay";
import { startOfToday } from "date-fns";
/***
 *
 *  Member dashboard
 *
 */

export default async function Page({
  params,
}: {
  params: Promise<{ userid: string }>;
}) {
  const userId = (await params).userid;
  const user = await getUser(userId);
  if (user.role !== "MEMBER" && user.role !== "ADMIN") redirect(`/`);
  const t = await getTranslations("dashboard");
  const queryReservations = await getReservationsByUserId({
    userId,
    after: startOfToday(),
  });

  return (
    <PageLayout title={t("member.dashboard")}>
      <h1 className="flex justify-between">
        {t("member.dashboard")}
        <Link
          className="btn btn-secondary"
          href={`/member/${userId}/subscribe`}
        >
          {t("member.new-subscription")}
        </Link>
      </h1>
      <h2>
        {t("member.my-subscription", {
          count: user.subscriptions.length ?? 0,
        })}
      </h2>
      <section className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(20rem,30rem))] justify-center gap-4">
        {user.subscriptions.map((sub) => (
          <Subscription key={sub.id} subscription={sub} />
        ))}
      </section>
      <section className="grid auto-rows-auto gap-2 lg:grid-cols-2">
        <article className="border-primary rounded-md border p-2">
          <h2>{t("member.my-reservations")}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))] gap-2">
            {queryReservations?.map((reservation) => (
              // <MyReservation
              //   key={reservation.id}
              //   reservation={reservation}
              //   memberId={userId}
              //   day={day}
              // />
              <div key={reservation.id}>{reservation.id}</div>
            ))}
          </div>
        </article>
      </section>
    </PageLayout>
  );
}

// type MyReservationProps = {
//   memberId: string;
//   day: Date;
//   reservation: Reservation & {
//     room: Room | null;
//     activity: Activity | null;
//     planningActivity:
//       | (PlanningActivity & {
//           activity: Activity;
//           coach: UserCoach | null;
//           room: Room | null;
//         })
//       | null;
//   };
// };

// function MyReservation({ reservation, memberId, day }: MyReservationProps) {
//   const { t } = useTranslation("dashboard");
//   const utils = trpc.useContext();
//   const deleteReservation = trpc.plannings.deleteReservation.useMutation({
//     onSuccess() {
//       utils.users.getReservationsByUserId.invalidate({
//         userId: memberId,
//         after: day,
//       });
//       utils.plannings.getMemberDailyPlanning.invalidate({
//         memberId,
//         date: day,
//       });
//     },
//   });

//   function handleDeleteReservation() {
//     deleteReservation.mutate(reservation.id);
//   }

//   return (
//     <div className="rounded border border-primary bg-base-100">
//       <div className="flex items-center justify-between gap-4 bg-primary px-3 py-1 text-center text-primary-content">
//         <span>{formatDateLocalized(reservation.date, { withDay: true })}</span>
//         <Confirmation
//           message={t("member.reservation-delete-message")}
//           title={t("member.delete-reservation")}
//           buttonIcon={<i className={`bx bx-trash ${getButtonSize("xs")}`} />}
//           onConfirm={() => handleDeleteReservation()}
//           buttonSize="xs"
//           variant="Icon-Only-Secondary"
//         />
//       </div>
//       {reservation?.planningActivity ? (
//         <div className="p-2">
//           <div className="space-x-2 text-center">
//             <span className="font-semibold">
//               {reservation.planningActivity?.activity?.name}
//             </span>
//             {reservation.planningActivity?.coach?.publicName ? (
//               <span className="text-xs">
//                 {"("}
//                 {reservation.planningActivity?.coach?.publicName}
//                 {")"}
//               </span>
//             ) : null}
//           </div>
//           <div className="flex justify-between">
//             <span>{reservation.planningActivity?.startTime}</span>
//             <span>{reservation.planningActivity?.room?.name}</span>
//           </div>
//         </div>
//       ) : null}
//       {reservation?.activity ? (
//         <div className="p-2">
//           <div className="space-x-2 text-center">
//             <span className="font-semibold">{reservation.activity?.name}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="space-x-2">
//               <span>{format(reservation?.date, "HH:mm")}</span>
//               <span className="text-xs">
//                 {"("}
//                 {reservation.activity.reservationDuration}
//                 {"')"}
//               </span>
//             </span>
//             <span>{reservation.room?.name}</span>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// type DailyPlanningProps = {
//   memberId: string;
//   day: Date;
// };

// function DailyPlanning({ memberId, day }: DailyPlanningProps) {
//   const { t } = useTranslation("dashboard");
//   const planning = trpc.plannings.getMemberDailyPlanning.useQuery({
//     date: day,
//     memberId,
//   });
//   if (planning.isInitialLoading) return <Spinner />;
//   if (!planning.data) return <div>{t("no-planning")}</div>;
//   return (
//     <div className="flex flex-col gap-2">
//       {planning.data.map((plan) => (
//         <div
//           key={plan.id}
//           className="flex flex-col items-center rounded border border-secondary bg-base-100"
//         >
//           <div className="w-full  bg-secondary text-center text-secondary-content">
//             {plan.club.name}
//           </div>
//           <div className="flex shrink-0 flex-wrap items-start gap-2 p-2">
//             {plan.activities.map((activity) => (
//               <div
//                 key={activity.id}
//                 className="border border-base-300 bg-base-100 p-2"
//               >
//                 <p>
//                   <span className="text-xs">{activity.startTime}</span>
//                   {" ("}
//                   <span className="text-xs">{activity.duration}</span>
//                   {"') "}
//                   <span>{activity.activity.name}</span>
//                 </p>
//                 <p className="text-xs">
//                   <span>{activity.site?.name}</span>
//                   {" - "}
//                   <span>{activity.room?.name}</span>
//                 </p>
//                 <MakeReservation
//                   room={activity.room}
//                   reservations={activity.reservations}
//                   memberId={memberId}
//                   planningActivityId={activity.id}
//                   day={day}
//                 />
//               </div>
//             ))}
//             {plan.withNoCalendar.map((activity) => (
//               <Wnc
//                 key={activity.id}
//                 activity={activity}
//                 day={day}
//                 memberId={memberId}
//                 reservations={activity.reservations}
//               />
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// type MakeReservationProps = {
//   room: Room | null;
//   reservations: { id: string; date: Date }[];
//   planningActivityId: string;
//   memberId: string;
//   day: Date;
// };
// function MakeReservation({
//   room,
//   reservations,
//   planningActivityId,
//   memberId,
//   day,
// }: MakeReservationProps) {
//   const { t } = useTranslation("dashboard");
//   const utils = trpc.useContext();
//   const createReservation =
//     trpc.plannings.createPlanningReservation.useMutation({
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

//   if (!room) return null;
//   if (isBefore(day, startOfToday())) return null;

//   const free =
//     room.capacity > reservations.length
//       ? room.capacity - reservations.length
//       : 0;
//   if (room.reservation === "NONE")
//     return (
//       <div className="text-center">
//         <p className="btn-outline btn-disabled btn btn-xs">
//           {t("member.free-access")}
//         </p>
//       </div>
//     );

//   return (
//     <div className="flex items-center justify-between gap-2">
//       <p className="text-xs">
//         {free
//           ? t("member.remain", { free, capacity: room.capacity })
//           : t("member.waiting-list")}
//       </p>
//       {reservations.find(
//         (r) => r.id === planningActivityId && isEqual(day, r.date)
//       ) ? (
//         <span className="btn btn-accent btn-xs">{t("member.reserved")}</span>
//       ) : (
//         <button
//           className="btn btn-primary btn-xs"
//           onClick={() =>
//             createReservation.mutate({
//               planningActivityId,
//               memberId,
//               date: day,
//             })
//           }
//         >
//           {t("member.reserve")}
//         </button>
//       )}
//     </div>
//   );
// }

// type WncRoom = {
//   id: string;
//   name: string;
//   capacity: number;
//   reservation: RoomReservation;
// };

// type WncProps = {
//   activity: Activity & {
//     rooms: WncRoom[];
//   };
//   day: Date;
//   memberId: string;
//   reservations: { id: string; date: Date }[];
// };

// type TOpeningTime =
//   | (DayOpeningTime & {
//       workingHours: OpeningTime[];
//     })
//   | null;

// function Wnc({ activity, day, memberId, reservations }: WncProps) {
//   const { t } = useTranslation("dashboard");
//   const { getDayForDate } = useDayName();
//   const dayName = getDayForDate(day);
//   const calClub = trpc.calendars.getCalendarForClub.useQuery(
//     activity.clubId,

//     { enabled: isCUID(activity.clubId) }
//   );

//   let openingText = "";
//   let OT: TOpeningTime = null;
//   if (calClub.data)
//     OT = calClub.data.openingTime.find((d) => d.name === dayName) ?? null;

//   if (OT?.wholeDay) openingText = t("member.all-day");
//   else if (OT?.closed) openingText = t("member.closed");
//   else {
//     openingText =
//       OT?.workingHours.map((wh) => `${wh.opening}-${wh.closing}`).join(" | ") ??
//       "";
//   }

//   return (
//     <>
//       {activity.rooms.map((room) => (
//         <div
//           key={`${room?.name}-${activity.id}`}
//           className="border border-base-300 bg-base-100 p-2"
//         >
//           <p>
//             <span className="text-xs">{openingText}</span>&nbsp;
//             <span>{activity.name}</span>
//           </p>
//           <p className="text-xs">
//             {room?.name ? <span>{room.name}</span> : null}
//           </p>
//           <ReserveDuration
//             activity={activity}
//             room={room}
//             reservations={reservations}
//             day={day}
//             memberId={memberId}
//             workingHours={OT}
//           />
//         </div>
//       ))}
//     </>
//   );
// }

// type ReserveDurationProps = {
//   activity: Activity;
//   room: WncRoom;
//   reservations: { id: string; date: Date }[];
//   day: Date;
//   memberId: string;
//   workingHours: TOpeningTime;
// };

// function ReserveDuration({
//   room,
//   activity,
//   reservations,
//   day,
//   memberId,
//   workingHours,
// }: ReserveDurationProps) {
//   const { t } = useTranslation("dashboard");
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
// }

// type ListProps = {
//   label: string;
//   items: string[];
// };

// export function List({ label, items }: ListProps) {
//   const { t } = useTranslation("dashboard");
//   if (!items.length) return null;
//   return (
//     <div className="flex flex-1 flex-col">
//       <h4>{t(label, { count: items.length })}</h4>
//       <ul>
//         {items.map((item, idx) => (
//           <li key={`ITEM-${idx}`}>{item}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
