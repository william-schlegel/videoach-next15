import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

import { env } from "^/env";

import { createNewUserFromClerk } from "^/server/user";

// import { deleteUser } from "@/server/db/users"
// import { Stripe } from "stripe"

// const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created": {
      console.info("user.created", event.data.id);
      await createNewUserFromClerk(event.data.id);
      break;
    }
    case "user.deleted": {
      // TODO:
      // if (event.data.id != null) {
      //   const userSubscription = await getUserSubscription(event.data.id)
      //   if (userSubscription?.stripeSubscriptionId != null) {
      //     await stripe.subscriptions.cancel(
      //       userSubscription?.stripeSubscriptionId
      //     )
      //   }
      //   await deleteUser(event.data.id)
      // }
    }
  }

  return new Response("", { status: 200 });
}
