import type { Pricing, Role } from "@prisma/client";

import {
  CreatePricing,
  DeletePricing,
  UndeletePricing,
  UpdatePricing,
} from "^/app/_modals/managePricing";
import { Pricing as PricingComponent } from "^/app/_components/ui/pricing";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "^/server/user";
import { redirect, RedirectType } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAllPricing, getPricingById } from "^/server/pricing";
import createLink from "^/lib/createLink";
import { getRoleName } from "^/lib/getRoleName";
import PageLayout from "^/app/_components/pageLayout";
import Link from "next/link";
import { formatMoney } from "^/lib/formatNumber";

type PageProps = Readonly<{
  searchParams: Promise<{ pricingId: string }>;
}>;

async function PricingManagement({ searchParams }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/", RedirectType.replace);

  const pricingId = (await searchParams).pricingId;
  const user = await getUser(userId);
  if (user.role !== "ADMIN") redirect("/", RedirectType.replace);
  const t = await getTranslations("admin");

  const data = await getAllPricing();

  if (pricingId === "") redirect(createLink({ pricingId: data[0]?.id }));
  const gd = new Map<string, Pricing[]>();
  for (const p of data) {
    const act = gd.get(p.roleTarget) ?? [];
    act.push(p);

    gd.set(p.roleTarget, act);
  }
  const groupedData = Array.from(gd).map((g) => ({
    name: t(`auth:${getRoleName(g[0] as Role)}`),
    items: g[1],
  }));
  return (
    <PageLayout title={t("pricing.manage-my-pricing")}>
      <div className="mb-4 flex flex-row items-center gap-4">
        <h1>{t("pricing.manage-my-pricing")}</h1>
        <CreatePricing />
      </div>
      <div className="flex gap-4">
        <div className="w-1/4">
          {groupedData.map((group) => (
            <div key={group.name} className="mb-4">
              <h3>{group.name}</h3>
              <ul className="menu overflow-hidden rounded bg-base-100">
                {group.items.map((pricing) => (
                  <li key={pricing.id}>
                    <Link
                      href={createLink({ pricingId: pricing.id })}
                      className={`flex w-full items-center justify-between text-center ${
                        pricingId === pricing.id ? "active" : ""
                      }`}
                    >
                      <span>
                        {pricing.title}&nbsp;
                        <span className="text-xs">
                          {pricing.free
                            ? null
                            : `(${formatMoney(pricing.monthly)})`}
                        </span>
                      </span>
                      <span className="space-x-2">
                        {pricing.highlighted ? (
                          <i className="bx bxs-star bx-xs text-accent" />
                        ) : null}
                        {pricing.deleted ? (
                          <i className="bx bx-trash bx-sm text-red-600" />
                        ) : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {pricingId === "" ? null : <PricingContent pricingId={pricingId} />}
      </div>
    </PageLayout>
  );
}

export default PricingManagement;

type PricingContentProps = Readonly<{
  pricingId: string;
}>;

export async function PricingContent({ pricingId }: PricingContentProps) {
  const pricingQuery = await getPricingById(pricingId);
  return (
    <div className="flex w-full flex-col gap-4">
      <PricingComponent data={pricingQuery.data} />
      <div className="flex items-center gap-2">
        <UpdatePricing pricingId={pricingId} />

        {pricingQuery.data?.deleted ? (
          <UndeletePricing pricingId={pricingId} />
        ) : (
          <DeletePricing pricingId={pricingId} />
        )}
      </div>
    </div>
  );
}
