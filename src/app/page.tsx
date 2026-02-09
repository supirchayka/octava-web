import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getHomePage } from "@/lib/api/pages";
import { resolveMediaUrl } from "@/lib/media";
import type {
  HomePageResponse,
  HomeHero,
  HomeSubHero,
  HomeDirection,
} from "@/types/api";

import { InteriorSection } from "@/components/home/InteriorSection";
import { ContactLeadForm } from "@/components/ContactLeadForm";

// SEO из блока seo
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
    alternates: seo.canonicalUrl
      ? { canonical: seo.canonicalUrl }
      : undefined,
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
  const { hero, directions, subHero, interior } = data;

  return (
    <main className="bg-white">
      <HeroSection hero={hero} />
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <DirectionsSection directions={directions} />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <InteriorSection interior={interior} />
        <BottomCtaSection />
      </div>
    </main>
  );
}

// ---------------- HERO (full width, 70–75% высоты, украшенный) ----------------

function HeroSection({ hero }: { hero: HomeHero }) {
  const mainImage = hero.images[0];

  return (
    <section className="relative flex min-h-[82vh] w-full items-end justify-center overflow-hidden">
      {mainImage && (
        <Image
          src={resolveMediaUrl(mainImage.url)}
          alt={mainImage.alt ?? ""}
          fill
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
          priority
        />
      )}

      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-tr from-[#0D1321]/90 via-[#1D2D44]/85 to-[#1D2D44]/60" />

      <div className="relative w-full pb-10 text-center">
        <p className="text-4xl font-semibold tracking-[0.35em] text-white sm:text-5xl">
          OCTAVA
        </p>
      </div>
    </section>
  );
}

// ---------------- DIRECTIONS (2 в ряд, карточки с фото) ----------------

function DirectionsSection({ directions }: { directions: HomeDirection[] }) {
  if (!directions?.length) return null;

  return (
    <section id="services" className="mb-12">
      <div className="mb-18 flex items-end justify-between gap-3">
        <div>

        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <GenderLink
          label="Женщины"
          description="Категории эстетического и оздоровительного ухода, собранные для женских запросов."
          href="/services/female"
        />
        <GenderLink
          label="Мужчины"
          description="Процедуры и консультации, разработанные для мужских направлений и задач."
          href="/services/male"
        />
      </div>
    </section>
  );
}

function GenderLink({
  label,
  description,
  href,
}: {
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[360px] overflow-hidden rounded-3xl bg-[#ffffff] text-[#F3F7FA] shadow-[0_18px_45px_rgba(0,0,0,0.15)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D2D44] via-[#0D1321] to-[#1D2D44]" />

      {/* градиентное затемнение снизу */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1321]/90 via-[#0D1321]/75 to-transparent" />

      {/* декоративные пятна */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 top-[-40px] h-40 w-40 rounded-full bg-[#F3F7FA]/10 blur-3xl" />
        <div className="absolute -left-24 bottom-[-40px] h-48 w-48 rounded-full bg-[#F3F7FA]/8 blur-3xl" />
      </div>

      {/* контент карточки */}
      <div className="relative z-10 flex flex-1 flex-col justify-end gap-3 p-5">
        <h3 className="text-2xl font-semibold">{label}</h3>

        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-[#F3F7FA]/85">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white/15">
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-3.5 w-3.5"
            >
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


// ---------------- SUB HERO (градиентный блок в фирменных цветах) ----------------

function SubHeroSection({
  subHero,
}: {
  subHero: HomeSubHero;
}) {
  if (!subHero.title && !subHero.subtitle) return null;

  return (
    <section className="relative w-full overflow-hidden">
      {subHero.image?.url && (
        <Image
          src={resolveMediaUrl(subHero.image.url)}
          alt=""
          fill
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
          priority
        />
      )}

      {/* мощное затемнение в фирменных синих */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D1321]/90 via-[#1D2D44]/85 to-[#0D1321]/90" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* градиентная рамка */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D1321] via-[#1D2D44] to-[#0D1321] p-[1px] shadow-[0_22px_60px_rgba(13,19,33,0.35)]">
          {/* внутренний тёмный слой */}
          <div className="relative rounded-[calc(1.5rem-1px)] bg-[#0D1321]/60 px-6 py-8 backdrop-blur-xl md:px-8 md:py-10">
            {/* декоративные мягкие пятна */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-16 -top-10 h-32 w-32 rounded-full bg-[#F3F7FA]/10 blur-3xl" />
              <div className="absolute -right-20 bottom-[-32px] h-40 w-40 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
            </div>

            {/* текст из subHero */}
            <div className="relative max-w-3xl animate-[fade-up_0.6s_ease-out_both]">
              {subHero.title && (
                <h2 className="text-2xl font-semibold tracking-tight text-[#F3F7FA] sm:text-3xl md:text-[32px]">
                  {subHero.title}
                </h2>
              )}
              {subHero.subtitle && (
                <p className="mt-4 text-base leading-relaxed text-[#F3F7FA]/85 md:text-lg">
                  {subHero.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- FORM (внизу, с учётом 152-ФЗ) ----------------

function BottomCtaSection() {
  return (
    <section
      id="booking"
      className="rounded-3xl bg-[#1D2D44] px-5 py-8 text-[#F3F7FA] shadow-xl md:px-8 md:py-10"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="md:max-w-sm">
          <h2 className="text-lg font-semibold sm:text-xl">
            Оставьте контакты для связи
          </h2>
          <p className="mt-2 text-sm text-[#F3F7FA]/80">
            Мы используем ваши данные только для обработки обращения и связи с
            вами по указанному вопросу.
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
