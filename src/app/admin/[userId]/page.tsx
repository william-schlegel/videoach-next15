import PageLayout from "@/app/_components/pageLayout";
import { getAdminData } from "@/server/dashboard";
import { getUser } from "@/server/user";
import { getTranslations } from "next-intl/server";
import { redirect, RedirectType } from "next/navigation";

type PageProps = Readonly<{
  params: Promise<{ userId: string }>;
}>;
async function AdminDashboard({ params }: PageProps) {
  const userId = (await params).userId;
  const user = await getUser(userId);
  if (user.role !== "ADMIN") redirect("/", RedirectType.replace);
  const adminQuery = await getAdminData();
  if (adminQuery.error) redirect("/", RedirectType.replace);

  const t = await getTranslations("dashboard");
  const siteCount = adminQuery.data?.clubs?.reduce(
    (acc, c) => {
      acc.sites += c.sites.length;
      acc.rooms += c.sites.reduce((ss, s) => ss + s._count.rooms, 0);
      return acc;
    },
    { sites: 0, rooms: 0 },
  ) ?? { sites: 0, rooms: 0 };

  const memberCount = adminQuery.data?.members?.length;

  return (
    <PageLayout title={t("admin-dashboard")}>
      <h1 className="flex justify-between">{t("admin-dashboard")}</h1>
      <section className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-primary">
            <i className="bx bx-building bx-lg" />
          </div>
          <div className="stat-title">
            {t("clubs", { count: adminQuery.data?.clubs?.length ?? 0 })}
          </div>
          <div className="stat-value text-primary">
            {adminQuery.data?.clubs?.length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-figure text-primary">
            <i className="bx bx-map-pin bx-lg" />
          </div>
          <div className="stat-title">
            {t("sites", { count: siteCount.sites })}
          </div>
          <div className="stat-value text-primary">{siteCount.sites}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-primary">
            <i className="bx bx-home bx-lg" />
          </div>
          <div className="stat-title">
            {t("rooms", { count: siteCount.rooms })}
          </div>
          <div className="stat-value text-primary">{siteCount.rooms}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-primary">
            <i className="bx bx-user bx-lg" />
          </div>
          <div className="stat-title">
            {t("members", { count: memberCount })}
          </div>
          <div className="stat-value text-primary">{memberCount}</div>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-2">
        <article className="rounded-md border border-primary p-2">
          <h2>{t("subscriptions")}</h2>
        </article>
        <article className="rounded-md border border-primary p-2">
          <h2>{t("kpi")}</h2>
        </article>
      </section>
    </PageLayout>
  );
}

export default AdminDashboard;
