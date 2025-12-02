// src/app/service/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getServiceBySlug } from "@/lib/api/services";
import { resolveMediaUrl } from "@/lib/media";
import type {
  ServiceDetailResponse,
  ServiceDetailHero,
  ServicePriceExtended,
  ChecklistItem,
  FaqItem,
} from "@/types/api";

type PageProps = {
  // в новой версии Next params прилетает как Promise
  params: Promise<{ slug: string }>;
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

  let data: ServiceDetailResponse;
  try {
    data = await getServiceBySlug(slug);
  } catch {
    notFound();
  }

  const {
    service,
    hero,
    about,
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

  return (
    <main className="bg-white">
      <ServiceHero
        service={service}
        hero={hero}
        bookingUrl={bookingUrl}
      />

      <section className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-8">
        {/* Описание услуги */}
        {about && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
              Об услуге
            </h2>
            <p className="text-base leading-relaxed text-slate-700 sm:text-[17px]">
              {about}
            </p>
          </section>
        )}

        {/* Стоимость и варианты */}
        {pricesExtended.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
              Стоимость и варианты
            </h2>
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
          </section>
        )}

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
        <img
          src={resolveMediaUrl(mainImage.url)}
          alt={mainImage.alt ?? hero.title}
          className="absolute inset-0 h-full w-full object-cover"
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
          <a href="/services" className="hover:underline">
            Услуги
          </a>
          <span className="mx-1.5 opacity-60">/</span>
          <a
            href={`/services/${service.category.slug}`}
            className="hover:underline"
          >
            {service.category.name}
          </a>
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

          {/* преимущества */}
          {hero.benefits?.length > 0 && (
            <ul className="space-y-1.5 text-base text-[#F3F7FA]/85">
              {hero.benefits.map((benefit, idx) => (
                <li
                  key={`${service.id}-hero-benefit-${idx}`}
                  className="flex gap-2"
                >
                  <span className="mt-1 h-4.5 w-1.5 shrink-0 rounded-full bg-[#F3F7FA]" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}

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
