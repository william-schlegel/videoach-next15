import Image from "next/image";
import ButtonLink from "./_components/ui/buttonLink";
import { redirect, RedirectType } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getActualUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getActualUser();
  if (user) {
    const { role, id: userId } = user;
    if (role === "MEMBER") redirect(`/member/${userId}`, RedirectType.replace);
    if (role === "COACH") redirect(`/coach/${userId}`, RedirectType.replace);
    if (role === "MANAGER")
      redirect(`/manager/${userId}`, RedirectType.replace);
    if (role === "MANAGER_COACH")
      redirect(`/manager-coach/${userId}`, RedirectType.replace);
    if (role === "ADMIN") redirect(`/admin/${userId}`, RedirectType.replace);
  }
  const t = await getTranslations("home");

  return (
    <section className="bg-gradient-home-hero hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <Image
          src="/images/image.png"
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
            <ButtonLink className="btn btn-accent" href="#find-club">
              {t("btn-visitor")}
            </ButtonLink>
            <ButtonLink className="btn btn-primary" href="/manager">
              {t("btn-manager")}
            </ButtonLink>
            <ButtonLink className="btn btn-secondary" href="/coach">
              {t("btn-coach")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
