import { getPricingForRole } from "^/server/pricing";
import { getTranslations } from "next-intl/server";
import PageLayout from "../_components/pageLayout";
import { Feature, FeatureContainer } from "^/app/_components/ui/features";
import { Pricing, PricingContainer } from "^/app/_components/ui/pricing";
import Link from "next/link";

/**
 *
 *  Manager presentation on Videoach page
 *
 */

async function ManagerPage() {
  const pricings = await getPricingForRole("MANAGER");
  const t = await getTranslations("home");

  return (
    <PageLayout>
      <section className="hero bg-base-100">
        <div className="hero-content py-48 text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">{t("manager-title")}</h1>
            <p className="py-6 text-lg">{t("manager-text")}</p>
          </div>
        </div>
      </section>
      <section className="bg-base-100">
        <div className="container mx-auto">
          <h2 className="pt-12">{t("features.manager")}</h2>
          <FeatureContainer>
            <Feature
              title={t("features.management.title")}
              description={t("features.management.description")}
            >
              <i className="bx bx-building bx-lg text-accent" />
            </Feature>
            <Feature
              title={t("features.communication.title")}
              description={t("features.communication.description")}
            >
              <i className="bx bx-bell bx-lg text-accent" />
            </Feature>
            <Feature
              title={t("features.page.title")}
              description={t("features.page.description")}
            >
              <i className="bx bx-windows bx-lg text-accent" />
            </Feature>
            <Feature
              title={t("features.mobile.title")}
              description={t("features.mobile.description")}
            >
              <i className="bx bx-mobile-alt bx-lg text-accent" />
            </Feature>
          </FeatureContainer>
        </div>
      </section>
      <section className="bg-base-200">
        <div className="container mx-auto">
          <h2 className="pt-12">{t("pricing.usage")}</h2>
          <p className="alert alert-info">{t("pricing.try-offer")}</p>
          <PricingContainer>
            {Array.isArray(pricings) &&
              pricings?.map((pricing) => (
                <Pricing key={pricing.id} pricingId={pricing.id} />
              ))}
          </PricingContainer>
          <Link href="/user/signin">
            <button className="btn btn-accent btn-block my-4">
              {t("pricing.create-your-account")}
            </button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

export default ManagerPage;
