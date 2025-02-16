import {
  type CreatePlanningReservation,
  createPlanningReservation,
  deleteReservation,
} from "@/server/planning";

export async function POST(req: Request) {
  const payload = (await req.json()) as CreatePlanningReservation;

  const newReservation = await createPlanningReservation({
    planningActivityId: payload.planningActivityId,
    memberId: payload.memberId,
    date: payload.date,
  });
  if (newReservation.error) {
    return new Response("Erreur", { status: 400 });
  }
  return newReservation.data;
}

export async function DELETE(req: Request) {
  const payload = (await req.json()) as string;
  const deletionResult = await deleteReservation(payload);
  if (deletionResult.error) {
    return new Response("Erreur", { status: 400 });
  }
  return deletionResult.data;
}
