"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const t = useTranslations("home");
  const router = useRouter();
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
            <button
              className="btn-accent btn"
              onClick={() => router.push("#find-club")}
            >
              {t("btn-visitor")}
            </button>
            <button
              className="btn-primary btn"
              onClick={() => router.push("/manager")}
            >
              {t("btn-manager")}
            </button>
            <button
              className="btn-secondary btn"
              onClick={() => router.push("/coach")}
            >
              {t("btn-coach")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
