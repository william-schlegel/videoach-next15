import { Role } from "@prisma/client";
import { CACHE_TAGS, dbCache, getGlobalTag, getIdTag } from "^/lib/cache";
import { z } from "zod";
import { db } from "./db";

// const PricingObject = z.object({
//   id: z.string().cuid(),
//   roleTarget: z.nativeEnum(Role),
//   title: z.string(),
//   description: z.string(),
//   free: z.boolean().optional().default(false),
//   highlighted: z.boolean().optional().default(false),
//   monthly: z.number().optional().default(0),
//   yearly: z.number().optional().default(0),
// });

const RoleInput = z.nativeEnum(Role);

type RoleInputType = z.infer<typeof RoleInput>;

export async function getPricingForRole(input: RoleInputType) {
  const parseResult = RoleInput.safeParse(input);
  if (!parseResult.success) {
    return { error: true, message: "Invalid input" };
  }
  const cacheFn = dbCache(() => getPricingForRoleInternal(input), {
    tags: [getGlobalTag(CACHE_TAGS.pricing)],
  });

  return cacheFn();
}

async function getPricingForRoleInternal(input: RoleInputType) {
  return db.pricing.findMany({
    where: { roleTarget: input, deleted: false },
    include: { options: true },
    orderBy: [{ monthly: "asc" }],
  });
}

export async function getAllPricing() {
  const cacheFn = dbCache(() => getAllPricingInternal(), {
    tags: [getGlobalTag(CACHE_TAGS.pricing)],
  });

  return cacheFn();
}

async function getAllPricingInternal() {
  return db.pricing.findMany({
    orderBy: [{ roleTarget: "asc" }, { monthly: "asc" }],
  });
}

const PricingByIdInput = z.string().cuid();

type PricingByIdType = z.infer<typeof PricingByIdInput>;

export async function getPricingById(input: PricingByIdType) {
  const parseResult = PricingByIdInput.safeParse(input);
  if (!parseResult.success) {
    return { error: true, message: "Invalid input", data: null };
  }
  const cacheFn = dbCache(() => getPricingByIdInternal(input), {
    tags: [getIdTag(input, CACHE_TAGS.pricing)],
  });

  return cacheFn();
}

async function getPricingByIdInternal(input: PricingByIdType) {
  const pricing = await db.pricing.findUnique({
    where: { id: input },
    include: { options: true, features: true },
  });
  return { error: false, data: pricing, message: "" };
}

// export const pricingRouter = router({
//   getPricingById: publicProcedure
//     .input(z.string().cuid())
//     .query(({ ctx, input }) => {
//       return ctx.prisma.pricing.findUnique({
//         where: { id: input },
//         include: { options: true, features: true },
//       });
//     }),
//

//   createPricing: protectedProcedure
//     .input(
//       z.object({
//         base: PricingObject.omit({ id: true }),
//         options: z.array(z.string()),
//         features: z.array(z.nativeEnum(Feature)),
//       })
//     )
//     .mutation(({ input, ctx }) => {
//       if (ctx.session.user.role !== Role.ADMIN)
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           message: "You are not authorized to create a pricing",
//         });
//       return ctx.prisma.pricing.create({
//         data: {
//           ...input.base,
//           options: {
//             createMany: {
//               data: input.options.map((o, i) => ({ name: o, weight: i })),
//             },
//           },
//           features: {
//             createMany: {
//               data: input.features.map((f) => ({ feature: f })),
//             },
//           },
//         },
//       });
//     }),
//   updatePricing: protectedProcedure
//     .input(
//       z.object({
//         base: PricingObject.partial(),
//         options: z.array(z.string()),
//         features: z.array(z.nativeEnum(Feature)),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       if (ctx.session.user.role !== Role.ADMIN)
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           message: "You are not authorized to modify a pricing",
//         });
//       await ctx.prisma.pricingOption.deleteMany({
//         where: { pricingId: input.base.id },
//       });
//       await ctx.prisma.pricingFeature.deleteMany({
//         where: { pricingId: input.base.id },
//       });
//       return ctx.prisma.pricing.update({
//         where: { id: input.base.id },
//         data: {
//           ...input.base,
//           options: {
//             createMany: {
//               data: input.options.map((o, i) => ({ name: o, weight: i })),
//             },
//           },
//           features: {
//             createMany: {
//               data: input.features.map((f) => ({ feature: f })),
//             },
//           },
//         },
//       });
//     }),
//   deletePricing: protectedProcedure
//     .input(z.string())
//     .mutation(({ input, ctx }) => {
//       if (ctx.session.user.role !== Role.ADMIN)
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           message: "You are not authorized to delete a pricing",
//         });
//       return ctx.prisma.pricing.update({
//         where: { id: input },
//         data: { deleted: true, deletionDate: new Date(Date.now()) },
//       });
//     }),
//   undeletePricing: protectedProcedure
//     .input(z.string())
//     .mutation(({ input, ctx }) => {
//       if (ctx.session.user.role !== Role.ADMIN)
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           message: "You are not authorized to undelete a pricing",
//         });
//       return ctx.prisma.pricing.update({
//         where: { id: input },
//         data: { deleted: false, deletionDate: null },
//       });
//     }),
//   deletePricingOption: protectedProcedure
//     .input(z.string())
//     .mutation(({ input, ctx }) => {
//       if (ctx.session.user.role !== Role.ADMIN)
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           message: "You are not authorized to delete a pricing option",
//         });
//       return ctx.prisma.pricingOption.deleteMany({ where: { name: input } });
//     }),
// });
