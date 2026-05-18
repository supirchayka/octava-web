import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Tenor_Sans } from "next/font/google";
import { getHomePage } from "@/lib/api/pages";
import { resolveMediaUrl } from "@/lib/media";
import type { HomePageResponse, HomeHero } from "@/types/api";
import { InteriorSection } from "@/components/home/InteriorSection";
import { ContactLeadForm } from "@/components/ContactLeadForm";

const tenorSans = Tenor_Sans({
  weight: "400",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const data: HomePageResponse = await getHomePage();
  const seo = data.seo;

  if (!seo) return {};

  const robots: Metadata["robots"] = {
    index: seo.robotsIndex ?? true,
    follow: seo.robotsFollow ?? true,
  };

  return {
    title: seo.metaTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots,
    openGraph: {
      title: seo.ogTitle ?? seo.metaTitle ?? undefined,
      description: seo.ogDescription ?? seo.metaDescription ?? undefined,
      images: seo.ogImage
        ? [
            {
              url: resolveMediaUrl(seo.ogImage.url),
              width: seo.ogImage.width ?? undefined,
              height: seo.ogImage.height ?? undefined,
              alt: seo.ogImage.alt ?? undefined,
            },
          ]
        : undefined,
    },
  };
}

export default async function HomePage() {
  const data = await getHomePage();
  const { hero, interior } = data;

  return (
    <main className="bg-white">
      <HeroSection hero={hero} />
      <div className="mx-auto max-w-6xl px-4 pt-16 md:pt-10">
        <DirectionsSection />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 md:pt-10">
        <InteriorSection interior={interior} />
        <BottomCtaSection />
      </div>
    </main>
  );
}

function HeroSection({ hero }: { hero: HomeHero }) {
  const heroVideos = [...(hero.images ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const desktopVideo =
    heroVideos.find((item) => item.heroVariant === "DESKTOP") ?? heroVideos[0];
  const mobileVideo =
    heroVideos.find((item) => item.heroVariant === "MOBILE") ??
    heroVideos.find((item) => item.order === 1) ??
    desktopVideo;
  const desktopVideoSrc = desktopVideo ? resolveMediaUrl(desktopVideo.url) : "/hero-video.mp4";
  const mobileVideoSrc = mobileVideo ? resolveMediaUrl(mobileVideo.url) : desktopVideoSrc;

  return (
    <section className="relative flex min-h-[82vh] min-h-[82svh] w-full items-end justify-center overflow-hidden bg-[#0D1321]">
      <video
        className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={mobileVideoSrc} type={mobileVideo?.mime ?? undefined} />
      </video>
      <video
        className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={desktopVideoSrc} type={desktopVideo?.mime ?? undefined} />
      </video>

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(13, 19, 33, 0.48)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(35deg, rgba(13, 19, 33, 0.72) 0%, rgba(29, 45, 68, 0.55) 55%, rgba(29, 45, 68, 0.2) 100%)",
        }}
      />

      <div className="relative w-full pb-10 text-center">
        <p className="text-4xl font-semibold text-white sm:text-5xl tenorSans">
          <span className={tenorSans.className}>OCTAVA</span>
        </p>
      </div>
    </section>
  );
}

function DirectionsSection() {
  return (
    <section id="services">
      <div className="grid gap-5 sm:grid-cols-2">
        <GenderLink
          label="Женщины"
          description="Вдохновение на совершенство"
          href="/services/female"
          imageSrc="/woman.png"
        />
        <GenderLink
          label="Мужчины"
          description="Мужской взгляд на эстетику"
          href="/services/male"
          imageSrc="/man.png"
        />
      </div>
    </section>
  );
}

function GenderLink({
  label,
  description,
  href,
  imageSrc,
}: {
  label: string;
  description: string;
  href: string;
  imageSrc: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[360px] overflow-hidden rounded-3xl bg-[#ffffff] text-[#F3F7FA] shadow-[0_18px_45px_rgba(0,0,0,0.15)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
    >
      <Image
        src={imageSrc}
        alt={label}
        fill
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1321]/90 via-[#0D1321]/75 to-transparent" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 top-[-40px] h-40 w-40 rounded-full bg-[#F3F7FA]/10 blur-3xl" />
        <div className="absolute -left-24 bottom-[-40px] h-48 w-48 rounded-full bg-[#F3F7FA]/8 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-end gap-3 p-5">
        <h3 className="text-2xl font-semibold">{label}</h3>
        <p className="text-sm text-[#F3F7FA]/85">{description}</p>

        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-[#F3F7FA]/85">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white/15">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
              <path
                d="M6 4.75L12.25 4.75L12.25 11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.25 12.5L12.25 4.75"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function BottomCtaSection() {
  return (
    <section
      id="booking"
      className="rounded-3xl bg-[#1D2D44] px-5 py-8 text-[#F3F7FA] shadow-xl md:px-8 md:py-10"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="md:max-w-sm">
          <h2 className="text-lg font-semibold sm:text-xl">Оставьте контакты для связи</h2>
          <p className="mt-2 text-sm text-[#F3F7FA]/80">
            Мы используем ваши данные только для обработки обращения и связи с вами по указанному вопросу.
          </p>
        </div>

        <div className="w-full max-w-md">
          <Suspense fallback={<div className="h-10 w-full" />}>
            <ContactLeadForm variant="dark" />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
