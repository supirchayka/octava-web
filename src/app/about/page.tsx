// src/app/about/page.tsx

import { getAboutPage } from "@/lib/api/pages";
import { resolveMediaUrl } from "@/lib/media";
import type {
  AboutHero,
  AboutHeroCta,
  AboutTrustItem,
  AboutTrustKind,
} from "@/types/about";
import type { Metadata } from "next";

// ---------- SEO ----------

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutPage();
  const seo = data.seo;

  const robots: Metadata["robots"] | undefined = seo
    ? {
        index: seo.robotsIndex ?? true,
        follow: seo.robotsFollow ?? true,
      }
    : undefined;

  return {
    title: seo?.metaTitle ?? undefined,
    description: seo?.metaDescription ?? undefined,
    alternates: seo?.canonicalUrl
      ? { canonical: seo.canonicalUrl }
      : undefined,
    robots,
    openGraph: seo
      ? {
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
        }
      : undefined,
  };
}

// ---------- Страница "О клинике" ----------

export default async function AboutPage() {
  const data = await getAboutPage();
  const { hero, trustItems, howWeAchieve, facts, heroCta } = data;

  const sortedFacts = [...facts].sort((a, b) => a.order - b.order);

  return (
    <main className="bg-white">
      <AboutHeroSection hero={hero} heroCta={heroCta} />

      <section className="mx-auto max-w-6xl space-y-12 px-4 pb-16 pt-10">
        {/* Как мы достигаем результатов */}
        {howWeAchieve && (
          <section className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
                Как мы работаем
              </h2>
              <p className="text-base leading-relaxed text-slate-700 sm:text-[17px]">
                {howWeAchieve}
              </p>
            </div>
            <div className="relative">
              <div className="absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-[#1D2D44]/5 blur-2xl" />
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#0D1321]/5 blur-3xl" />
              <div className="relative rounded-3xl border border-[#1D2D44]/10 bg-[#F3F7FA] px-5 py-5 shadow-[0_12px_32px_rgba(13,19,33,0.08)]">
                <p className="text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                  OCTAVA — это место, где диагностика, anti-age и эстетика
                  собраны в единую систему. Мы смотрим на здоровье кожи шире,
                  чем просто косметология: учитываем гормональный фон, образ
                  жизни и долгосрочные цели.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Факты о подходе */}
        {sortedFacts.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
              Наш подход к работе с пациентами
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {sortedFacts.map((fact, index) => (
                <article
                  key={fact.id}
                  className="relative overflow-hidden rounded-2xl border border-slate-100 bg-[#F3F7FA]/60 p-4 shadow-[0_8px_24px_rgba(13,19,33,0.05)]"
                >
                  <div className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-[#1D2D44]/5 blur-2xl" />
                  <div className="relative flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1D2D44] text-xs font-semibold text-[#F3F7FA]">
                      {(index + 1).toString().padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0D1321] sm:text-[15px]">
                        {fact.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700 sm:text-[14px]">
                        {fact.text}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Доверие: лицензии, сертификаты, награды */}
        {trustItems.length > 0 && (
          <section className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
                  Лицензии, сертификаты и награды
                </h2>
                <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">
                  Юридическая чистота, контроль качества и признание
                  профессионального сообщества.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {trustItems.map((item) => (
                <TrustCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

// ---------- Hero секция ----------

function AboutHeroSection({
  hero,
  heroCta,
}: {
  hero: AboutHero;
  heroCta: AboutHeroCta | null;
}) {
  const hasImage = !!hero.image;

  return (
    <section className="relative w-full overflow-hidden border-b border-slate-100">
      {hasImage && hero.image && (
        <img
          src={resolveMediaUrl(hero.image.url)}
          alt={hero.image.alt ?? hero.title}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* затемнение + градиент фирменных цветов */}
      <div
        className="absolute inset-0"
        style={{
          background: hasImage
            ? "linear-gradient(110deg, rgba(13,19,33,0.96) 0%, rgba(29,45,68,0.88) 35%, rgba(29,45,68,0.20) 72%, rgba(243,247,250,0.0) 100%)"
            : "linear-gradient(135deg, #0D1321, #1D2D44)",
        }}
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -bottom-10 h-40 w-40 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
        <div className="absolute -right-20 -top-10 h-32 w-32 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 text-[#F3F7FA] md:flex-row md:items-center md:py-16">
        {/* Текст слева */}
        <div className="flex-1 space-y-4">
          <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#F3F7FA]/80 backdrop-blur-md">
            О клинике OCTAVA
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {hero.title}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[#F3F7FA]/85 sm:text-lg">
            {hero.description}
          </p>

          {heroCta && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="/contacts"
                className="inline-flex items-center justify-center rounded-full bg-[#F3F7FA] px-6 py-2.5 text-sm font-medium text-[#1D2D44] shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_55px_rgba(0,0,0,0.45)]"
              >
                {heroCta.title}
              </a>
              {heroCta.subtitle && (
                <p className="max-w-xs text-xs leading-relaxed text-[#F3F7FA]/80 sm:text-[13px]">
                  {heroCta.subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Акцентная карточка справа */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-md">
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#0D1321]/35 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#1D2D44]/35 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-[#F3F7FA]/10 bg-[#F3F7FA]/95 px-5 py-5 text-sm text-slate-800 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-6 md:py-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1D2D44]/5 px-3 py-1 text-[11px] font-medium text-[#1D2D44]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1D2D44]" />
                Антивозрастная и эстетическая медицина
              </div>
              <p className="text-sm leading-relaxed text-slate-800 sm:text-[15px]">
                Мы работаем не только с внешним проявлением возраста, но и
                с его причинами. Каждый план лечения — это комбинация
                диагностики, аппаратных методик и поддержки образа жизни.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Карточки доверия ----------

function TrustCard({ item }: { item: AboutTrustItem }) {
  const kindMeta = mapTrustKind(item.kind);
  const issuedDate = item.issuedAt
    ? formatRusDate(item.issuedAt)
    : null;

  return (
    <article className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(13,19,33,0.06)]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#1D2D44]/5 blur-3xl" />
      <div className="relative flex items-start gap-3">
        <div
          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border text-xs font-medium ${kindMeta.badgeClass}`}
        >
          {kindMeta.short}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#0D1321] sm:text-[15px]">
            {item.title}
          </h3>
          {item.issuedBy && (
            <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              {item.issuedBy}
            </p>
          )}
        </div>
      </div>

      <div className="relative space-y-1 text-[12px] text-slate-700 sm:text-[13px]">
        {item.number && (
          <p>
            <span className="text-slate-500">Номер:</span>{" "}
            <span className="font-medium">{item.number}</span>
          </p>
        )}
        {issuedDate && (
          <p>
            <span className="text-slate-500">Дата выдачи:</span>{" "}
            <span>{issuedDate}</span>
          </p>
        )}
      </div>
    </article>
  );
}

function mapTrustKind(kind: AboutTrustKind) {
  switch (kind) {
    case "LICENSE":
      return {
        label: "Медицинская лицензия",
        short: "Лиц",
        badgeClass:
          "border-emerald-100 bg-emerald-50/80 text-emerald-900",
      };
    case "CERTIFICATE":
      return {
        label: "Сертификат",
        short: "Сер",
        badgeClass: "border-sky-100 bg-sky-50/80 text-sky-900",
      };
    case "AWARD":
      return {
        label: "Премия",
        short: "Прем",
        badgeClass:
          "border-amber-100 bg-amber-50/80 text-amber-900",
      };
    case "ATTESTATION":
      return {
        label: "Аттестация",
        short: "Атт",
        badgeClass:
          "border-violet-100 bg-violet-50/80 text-violet-900",
      };
    default:
      return {
        label: "Документ",
        short: "Док",
        badgeClass:
          "border-slate-200 bg-slate-50 text-slate-800",
      };
  }
}

// ---------- Утилиты ----------

function formatRusDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}
