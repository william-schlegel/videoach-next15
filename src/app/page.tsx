import Image from "next/image";
import ButtonLink from "./_components/ui/buttonLink";
import { getUser } from "^/server/user";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) {
    const { role } = await getUser(userId);
    if (role === "MEMBER") redirect(`/member/${userId}`);
    if (role === "COACH") redirect(`/coach/${userId}`);
    if (role === "MANAGER") redirect(`/manager/${userId}`);
    if (role === "MANAGER_COACH") redirect(`/manager-coach/${userId}`);
    if (role === "ADMIN") redirect(`/admin/${userId}`);
  }
  const t = await getTranslations("home");

  return (
    <section className="bg-gradient-home-hero hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <Image
          src="/images/bruce-mars-gJtDg6WfMlQ-unsplash.jpg"
          alt=""
          width={800}
          height={800}
          className="max-w-lg rounded-lg shadow-2xl"
        />

        <div>
          <h1 className="text-[clamp(2rem,5vw,8rem)] font-bold leading-[clamp(1.5rem,4vw,6rem)]">
            {t("title")}
          </h1>
          <p className="py-6">{t("hero-text")}</p>
          <div className="flex flex-wrap gap-2">
            <ButtonLink className="btn-accent btn" href="#find-club">
              {t("btn-visitor")}
            </ButtonLink>
            <ButtonLink className="btn-primary btn" href="/manager">
              {t("btn-manager")}
            </ButtonLink>
            <ButtonLink className="btn-secondary btn" href="/coach">
              {t("btn-coach")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
