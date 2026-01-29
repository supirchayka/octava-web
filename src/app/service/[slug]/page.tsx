// src/app/service/[slug]/page.tsx

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getServiceBySlug } from "@/lib/api/services";
import { resolveMediaUrl } from "@/lib/media";
import { ServiceContactForm } from "../ServiceContactForm";
import type {
  ServiceDetailResponse,
  ServiceDetailHero,
  ServicePriceExtended,
  ChecklistItem,
  FaqItem,
  Specialist,
} from "@/types/api";

type PageProps = {
  // в новой версии Next params прилетает как Promise
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// ---------- SEO из seo блока услуги ----------

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const { slug } = await props.params;

  let data: ServiceDetailResponse;
  try {
    data = await getServiceBySlug(slug);
  } catch {
    return {};
  }

  const seo = data.seo;
  if (!seo) return {};

  const robots: Metadata["robots"] = {
    index: seo.robotsIndex ?? true,
    follow: seo.robotsFollow ?? true,
  };

  return {
    title: seo.metaTitle ?? undefined,
    description: seo.metaDescription || undefined,
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
              alt: seo.ogImage.alt ?? undefined,
              width: seo.ogImage.width ?? undefined,
              height: seo.ogImage.height ?? undefined,
            },
          ]
        : undefined,
    },
  };
}

// ---------- Страница услуги ----------

export default async function ServicePage(props: PageProps) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  let data: ServiceDetailResponse;
  try {
    data = await getServiceBySlug(slug);
  } catch {
    notFound();
  }

  const {
    service,
    hero,
    specialists,
    pricesExtended,
    indications,
    contraindications,
    preparationChecklist,
    rehabChecklist,
    faq,
    legalDisclaimer,
  } = data;

  const bookingUrl = `/contacts?service=${encodeURIComponent(
    service.slug
  )}`;
  const utm = extractUtm(searchParams);
  const sortedSpecialists = [...(specialists ?? [])].sort((a, b) =>
    `${a.lastName} ${a.firstName}`.localeCompare(
      `${b.lastName} ${b.firstName}`,
      "ru"
    )
  );

  return (
    <main className="bg-white">
      <ServiceHero
        service={service}
        hero={hero}
        bookingUrl={bookingUrl}
      />

      <section className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-8">
        <section className="space-y-6">
          <input
            type="radio"
            name="service-tabs"
            id="tab-about"
            className="peer/about sr-only"
            defaultChecked
          />
          <input
            type="radio"
            name="service-tabs"
            id="tab-prices"
            className="peer/prices sr-only"
          />
          <input
            type="radio"
            name="service-tabs"
            id="tab-specialists"
            className="peer/specialists sr-only"
          />

          <div className="flex justify-center">
            <div
              className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-[0_12px_24px_rgba(13,19,33,0.08)]"
              role="tablist"
              aria-label="Разделы услуги"
            >
              <label
                htmlFor="tab-about"
                className="cursor-pointer rounded-full px-5 py-2 text-sm font-medium text-slate-600 transition hover:text-[#1D2D44] peer-checked/about:bg-[#1D2D44] peer-checked/about:text-white peer-checked/about:shadow-[0_8px_18px_rgba(13,19,33,0.25)]"
              >
                Об услуге
              </label>
              <label
                htmlFor="tab-prices"
                className="cursor-pointer rounded-full px-5 py-2 text-sm font-medium text-slate-600 transition hover:text-[#1D2D44] peer-checked/prices:bg-[#1D2D44] peer-checked/prices:text-white peer-checked/prices:shadow-[0_8px_18px_rgba(13,19,33,0.25)]"
              >
                Цены
              </label>
              <label
                htmlFor="tab-specialists"
                className="cursor-pointer rounded-full px-5 py-2 text-sm font-medium text-slate-600 transition hover:text-[#1D2D44] peer-checked/specialists:bg-[#1D2D44] peer-checked/specialists:text-white peer-checked/specialists:shadow-[0_8px_18px_rgba(13,19,33,0.25)]"
              >
                Специалисты
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_32px_rgba(13,19,33,0.08)]">
            <div className="hidden space-y-4 peer-checked/about:block">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
                  Об услуге
                </h2>
                <p className="text-base leading-relaxed text-slate-700 sm:text-[17px]">
                  {service.about}
                </p>
              </div>
              {hero.benefits?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#0D1321]">
                    Преимущества
                  </h3>
                  <BenefitsList
                    items={hero.benefits}
                    serviceId={service.id}
                  />
                </div>
              )}
            </div>

            <div className="hidden space-y-4 peer-checked/prices:block">
              <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
                Цены
              </h2>
              {pricesExtended.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_12px_32px_rgba(13,19,33,0.08)]">
                  <div className="divide-y divide-slate-100">
                    {pricesExtended
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((item) => (
                        <PriceRow
                          key={item.id}
                          item={item}
                          bookingUrl={bookingUrl}
                        />
                      ))}
                  </div>
                </div>
              ) : (
                <EmptyState text="Цены для этой услуги будут добавлены позже." />
              )}
            </div>

            <div className="hidden space-y-4 peer-checked/specialists:block">
              <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
                Специалисты
              </h2>
              {sortedSpecialists.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedSpecialists.map((specialist) => (
                    <SpecialistCard
                      key={specialist.id}
                      specialist={specialist}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState text="Команда специалистов будет доступна в ближайшее время." />
              )}
            </div>
          </div>
        </section>

        {/* Показания / противопоказания */}
        {(indications.length > 0 || contraindications.length > 0) && (
          <section className="grid gap-6 md:grid-cols-2">
            {indications.length > 0 && (
              <CardBlock title="Показания">
                <BulletList items={indications} />
              </CardBlock>
            )}
            {contraindications.length > 0 && (
              <CardBlock title="Противопоказания">
                <BulletList items={contraindications} variant="danger" />
              </CardBlock>
            )}
          </section>
        )}

        {/* Подготовка / реабилитация */}
        {(preparationChecklist.length > 0 ||
          rehabChecklist.length > 0) && (
          <section className="grid gap-6 md:grid-cols-2">
            {preparationChecklist.length > 0 && (
              <CardBlock title="Как подготовиться">
                <Checklist items={preparationChecklist} />
              </CardBlock>
            )}
            {rehabChecklist.length > 0 && (
              <CardBlock title="После процедуры">
                <Checklist items={rehabChecklist} />
              </CardBlock>
            )}
          </section>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
              Частые вопросы
            </h2>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white shadow-[0_10px_28px_rgba(13,19,33,0.06)]">
              {faq
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <FaqItem key={item.id} item={item} />
                ))}
            </div>
          </section>
        )}

        {/* Форма контактов по услуге */}
        <section className="rounded-3xl border border-slate-100 bg-[#F3F7FA] px-5 py-7 shadow-[0_12px_32px_rgba(13,19,33,0.08)] md:px-7 md:py-8">
          <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
            Записаться на процедуру
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
            Заполните форму — администратор свяжется с вами, уточнит детали и подберёт программу.
          </p>

          <ServiceContactForm
            serviceId={service.id}
            serviceSlug={service.slug}
            utm={utm}
          />
        </section>

        {/* Дисклеймер */}
        {legalDisclaimer && (
          <section className="border-t border-slate-200 pt-4">
            <p className="text-[13px] text-slate-500 sm:text-sm">
              {legalDisclaimer}
            </p>
          </section>
        )}
      </section>
    </main>
  );
}

// ---------- HERO услуги ----------

function ServiceHero({
  service,
  hero,
  bookingUrl,
}: {
  service: ServiceDetailResponse["service"];
  hero: ServiceDetailHero;
  bookingUrl: string;
}) {
  const mainImage = hero.images?.[0];

  return (
    <section className="relative w-full min-h-[55vh] overflow-hidden">
      {mainImage && (
        <Image
          src={resolveMediaUrl(mainImage.url)}
          alt={mainImage.alt ?? hero.title}
          fill
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
          priority
        />
      )}

      {/* градиент в фирменных синих */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0D1321]/95 via-[#1D2D44]/85 to-[#1D2D44]/60" />

      {/* декоративные пятна */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 bottom-[-40px] h-40 w-40 rounded-full bg-[#F3F7FA]/10 blur-3xl" />
        <div className="absolute -right-20 top-[-40px] h-32 w-32 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* хлебные крошки */}
        <div className="mb-4 text-xs text-[#F3F7FA]/80">
          <Link href="/services" className="hover:underline">
            Услуги
          </Link>
          <span className="mx-1.5 opacity-60">/</span>
          <Link
            href={`/services/${service.category.slug}`}
            className="hover:underline"
          >
            {service.category.name}
          </Link>
          <span className="mx-1.5 opacity-60">/</span>
          <span>{service.name}</span>
        </div>

        <div className="max-w-3xl space-y-5">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-[#F3F7FA] sm:text-4xl md:text-5xl">
            {hero.title}
          </h1>

          {hero.shortOffer && (
            <p className="text-base leading-relaxed text-[#F3F7FA]/85 sm:text-lg">
              {hero.shortOffer}
            </p>
          )}

          {/* чипы: цена и длительность */}
          <div className="flex flex-wrap items-center gap-2 text-s text-[#F3F7FA]/85">
            {hero.priceFrom && (
              <span className="rounded-full bg-[#0D1321]/60 px-3 py-1">
                от {hero.priceFrom} ₽
              </span>
            )}
            {hero.durationMinutes && (
              <span className="rounded-full bg-[#0D1321]/60 px-3 py-1">
                ~ {hero.durationMinutes} минут
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="pt-2">
            <a
              href={bookingUrl}
              className="inline-flex items-center justify-center rounded-full bg-[#F3F7FA] px-6 py-2.5 text-sm font-medium text-[#1D2D44] shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_55px_rgba(0,0,0,0.45)]"
            >
              {hero.ctaText || "Записаться"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Варианты цен ----------

function PriceRow({
  item,
  bookingUrl,
}: {
  item: ServicePriceExtended;
  bookingUrl: string;
}) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
      <div className="space-y-1">
        <p className="text-base font-medium text-[#0D1321] sm:text-lg">
          {item.title}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          {item.durationMinutes && (
            <span className="rounded-full bg-[#F3F7FA] px-2.5 py-1">
              ~ {item.durationMinutes} минут
            </span>
          )}
          {item.type && (
            <span className="rounded-full bg-slate-50 px-2.5 py-1">
              {item.type === "BASE"
                ? "Основной вариант"
                : item.type === "EXTRA"
                ? "Дополнительный"
                : item.type}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-lg font-semibold text-[#0D1321] sm:text-xl">
          {item.price} ₽
        </p>
        <a
          href={bookingUrl}
          className="inline-flex items-center justify-center rounded-full bg-[#1D2D44] px-4 py-1.5 text-xs font-medium text-[#F3F7FA] shadow-sm transition hover:bg-[#0D1321]"
        >
          Записаться
        </a>
      </div>
    </div>
  );
}

// ---------- Универсальные блоки ----------

function CardBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="h-full rounded-2xl border border-slate-100 bg-[#F3F7FA]/70 p-4 shadow-[0_10px_28px_rgba(13,19,33,0.06)]">
      <h3 className="mb-3 text-base font-semibold text-[#0D1321] sm:text-lg">
        {title}
      </h3>
      {children}
    </div>
  );
}

function BulletList({
  items,
  variant = "default",
}: {
  items: string[];
  variant?: "default" | "danger";
}) {
  const dotClass =
    variant === "danger" ? "bg-[#D71920]" : "bg-[#1D2D44]";

  return (
    <ul className="space-y-1.5 text-sm text-slate-700 sm:text-[15px]">
      {items.map((text, i) => (
        <li key={`${text}-${i}`} className="flex gap-2">
          <span
            className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`}
          />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

function BenefitsList({
  items,
  serviceId,
}: {
  items: string[];
  serviceId: number;
}) {
  return (
    <ul className="space-y-2 text-sm text-slate-700 sm:text-base">
      {items.map((benefit, idx) => (
        <li
          key={`${serviceId}-about-benefit-${idx}`}
          className="flex gap-2"
        >
          <span className="mt-1 h-4 w-1.5 shrink-0 rounded-full bg-[#1D2D44]" />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}

function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-slate-700 sm:text-[15px]">
      {items
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((item) => (
          <li key={item.id} className="flex gap-2">
            <span className="mt-[2px] inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-[#1D2D44]/40 bg-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1D2D44]" />
            </span>
            <span>{item.text}</span>
          </li>
        ))}
    </ul>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-600">
      {text}
    </div>
  );
}

function FaqItem({ item }: { item: FaqItem }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-base text-[#0D1321] sm:px-5">
        <span>{item.question}</span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F7FA] text-xs text-[#1D2D44] transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-700 sm:px-5">
        {item.answer}
      </div>
    </details>
  );
}

function SpecialistCard({ specialist }: { specialist: Specialist }) {
  const fullName = `${specialist.firstName} ${specialist.lastName}`;
  const initials = getInitials(specialist.firstName, specialist.lastName);
  const experienceLabel = formatExperience(specialist.experienceYears);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_12px_32px_rgba(13,19,33,0.08)]">
      <div className="relative h-48 w-full overflow-hidden bg-[#0D1321]/10">
        {specialist.photo ? (
          <>
            <Image
              src={resolveMediaUrl(specialist.photo.url)}
              alt={fullName}
              fill
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(145deg, rgba(13,19,33,0.35), rgba(29,45,68,0.15), rgba(29,45,68,0.0))",
              }}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1D2D44] to-[#0D1321] text-lg font-semibold text-[#F3F7FA]">
            {initials}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[#0D1321] sm:text-lg">
            {fullName}
          </h3>
          <p className="text-sm text-slate-600">
            {specialist.specialization}
          </p>
        </div>
        <p className="text-sm text-slate-600">
          {experienceLabel} опыта
        </p>
      </div>
    </article>
  );
}

// ---------- UTM ----------

type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

function extractUtm(
  searchParams: Record<string, string | string[] | undefined>
): UtmParams {
  const get = (key: string) => {
    const v = searchParams[key];
    return typeof v === "string" ? v : undefined;
  };

  return {
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    utm_term: get("utm_term"),
  };
}

function formatExperience(years: number) {
  const mod10 = years % 10;
  const mod100 = years % 100;
  let suffix = "лет";

  if (mod10 === 1 && mod100 !== 11) {
    suffix = "год";
  } else if (
    mod10 >= 2 &&
    mod10 <= 4 &&
    (mod100 < 12 || mod100 > 14)
  ) {
    suffix = "года";
  }

  return `${years} ${suffix}`;
}

function getInitials(firstName: string, lastName: string) {
  const first = firstName.trim()[0] ?? "";
  const last = lastName.trim()[0] ?? "";
  return `${first}${last}`.toUpperCase();
}
