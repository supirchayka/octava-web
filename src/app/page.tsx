import Image from "next/image";
import Link from "next/link";
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
      <SubHeroSection subHero={subHero} />
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
    <section className="relative w-full min-h-[72vh] overflow-hidden">
      {/* Фоновая картинка из hero.images */}
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

      {/* Слой с градиентным затемнением фирменными цветами */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0D1321]/90 via-[#1D2D44]/85 to-[#1D2D44]/60" />

        {/* Декоративные пятна/ореолы поверх градиента */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#F3F7FA]/10 blur-3xl" />
          <div className="absolute right-[-80px] bottom-[-40px] h-72 w-72 rounded-full bg-[#F3F7FA]/8 blur-3xl" />
        </div>
      </div>

      {/* Контентная часть */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 text-[#F3F7FA] md:flex-row md:items-center md:py-16 mt-8">
        {/* Левая колонка: заголовок/подзаголовок/CTA — строго из hero */}
        <div className="flex-1 mt-6 animate-[fade-up_0.7s_ease-out_both]">

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl mt-16">
            {hero.title}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#F3F7FA]/85 sm:text-base">
            {hero.subtitle}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            {hero.ctaText && hero.ctaUrl && (
              <a
                href={hero.ctaUrl}
                className="relative inline-flex items-center justify-center rounded-full bg-[#F3F7FA] px-6 py-2.5 text-sm font-medium text-[#1D2D44] shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_55px_rgba(0,0,0,0.45)]"
              >
                {/* Светящийся контур вокруг кнопки */}
                <span className="pointer-events-none absolute inset-[-2px] rounded-full border border-[#F3F7FA]/50 opacity-40 blur-[1px]" />
                <span className="relative">{hero.ctaText}</span>
              </a>
            )}

            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-[#F3F7FA]/40 bg-white/0 px-5 py-2.5 text-sm font-medium text-[#F3F7FA] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[#F3F7FA] hover:bg-white/5"
            >
              Смотреть направления
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- DIRECTIONS (2 в ряд, карточки с фото) ----------------

function DirectionsSection({ directions }: { directions: HomeDirection[] }) {
  if (!directions?.length) return null;

  return (
    <section id="services" className="mb-12">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="inline-flex rounded-full bg-[#F3F7FA] px-3 py-1 text-2xl font-normal text-slate-700">
            Направления OCTAVA
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {directions.map((direction, index) => {
          const image = direction.heroImage;

          return (
            <Link
              key={`${direction.slug}-${index}-${direction.id}`}
              href={`/services/${direction.slug}`}
              className="group relative flex min-h-[220px] overflow-hidden rounded-3xl bg-[#ffffff] text-[#F3F7FA] shadow-[0_18px_45px_rgba(0,0,0,0.15)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            >
              {image && (
                <Image
                  src={resolveMediaUrl(image.url)}
                  alt={image.alt ?? direction.name}
                  fill
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}

              {/* градиентное затемнение снизу */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1321]/90 via-[#0D1321]/75 to-transparent" />

              {/* декоративные пятна */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-20 top-[-40px] h-40 w-40 rounded-full bg-[#F3F7FA]/10 blur-3xl" />
                <div className="absolute -left-24 bottom-[-40px] h-48 w-48 rounded-full bg-[#F3F7FA]/8 blur-3xl" />
              </div>

              {/* контент карточки */}
              <div className="relative z-10 flex flex-1 flex-col justify-end gap-3 p-5">
                

                <h3 className="text-lg font-semibold">
                  {direction.name}
                </h3>

                {direction.description && (
                  <p className="text-sm text-[#F3F7FA]/85">
                    {direction.description}
                  </p>
                )}

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
                  <span>Подробнее о направлении</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
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
          <ContactLeadForm variant="dark" />
        </div>
      </div>
    </section>
  );
}