import Image from "next/image";
import Translation from "./_components/translation";
import ButtonLink from "./_components/ui/buttonLink";

export default function HomePage() {
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
            <Translation text="home.title" />
          </h1>
          <p className="py-6">
            <Translation text="home.hero-text" />
          </p>
          <div className="flex flex-wrap gap-2">
            <ButtonLink className="btn-accent btn" href="#find-club">
              <Translation text="home.btn-visitor" />
            </ButtonLink>
            <ButtonLink className="btn-primary btn" href="/manager">
              <Translation text="home.btn-manager" />
            </ButtonLink>
            <ButtonLink className="btn-secondary btn" href="/coach">
              <Translation text="home.btn-coach" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
