// src/app/devices/[slug]/page.tsx

import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { getDeviceBySlug } from "@/lib/api/devices";
import { resolveMediaUrl } from "@/lib/media";
import type {
  DeviceDetailResponse,
  DeviceSideEffect,
  DeviceRelatedService,
  FaqItem,
  GenericFileRef,
} from "@/types/api";
import DeviceBookingForm from "../DeviceBookingForm";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// ---------- SEO ----------

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getDeviceBySlug(slug);

  if (!data || !data.seo) {
    return {};
  }

  const seo = data.seo;

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

// ---------- Страница ----------

export default async function DevicePage(props: PageProps) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  const data = await getDeviceBySlug(slug);

  // 404 от бекэнда — своя аккуратная заглушка
  if (!data) {
    return <DeviceNotFound slug={slug} />;
  }

  const {
    device,
    hero,
    galleryImages,
    inlineImages,
    indications,
    contraindications,
    sideEffects,
    attachments,
    documents,
    faq,
    services,
  } = data;

  const utm = extractUtm(searchParams);

  return (
    <main className="bg-white">
      <DeviceHero device={device} hero={hero} />

      <section className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-8">
        {/* Описание и принцип работы */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
              О аппарате
            </h2>
            <p className="text-base leading-relaxed text-slate-700 sm:text-[17px]">
              {device.positioning}
            </p>

            {device.principle && (
              <div className="rounded-2xl bg-[#F3F7FA] p-4 text-sm text-slate-700 sm:text-[15px]">
                <h3 className="mb-1 text-sm font-semibold text-[#0D1321] sm:text-[15px]">
                  Принцип работы
                </h3>
                <p className="leading-relaxed">{device.principle}</p>
              </div>
            )}

            {device.safetyNotes && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-900 sm:text-[15px]">
                <h3 className="mb-1 text-sm font-semibold sm:text-[15px]">
                  Комфорт и безопасность
                </h3>
                <p className="leading-relaxed">{device.safetyNotes}</p>
              </div>
            )}
          </div>

          {/* Галерея (правая колонка) */}
          <div className="space-y-3">
            {galleryImages.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_12px_32px_rgba(13,19,33,0.08)]">
                <div className="border-b border-slate-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-[#0D1321]">
                    Галерея насадок и режимов
                  </h3>
                </div>
                <div className="grid gap-2 p-3 sm:grid-cols-2">
                  {galleryImages.map((img) => (
                    <figure
                      key={img.id}
                      className="overflow-hidden rounded-xl border border-slate-100 bg-[#F3F7FA]"
                    >
                      <Image
                        src={resolveMediaUrl(img.url)}
                        alt={img.alt ?? ""}
                        width={img.file?.width ?? 800}
                        height={img.file?.height ?? 600}
                        className="h-32 w-full object-cover sm:h-40"
                      />
                      {img.caption && (
                        <figcaption className="px-2.5 py-2 text-[11px] text-slate-600">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {inlineImages.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="border-b border-slate-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-[#0D1321]">
                    Детали и элементы
                  </h3>
                </div>
                <div className="flex gap-2 overflow-x-auto px-3 py-3">
                  {inlineImages.map((img) => (
                    <Image
                      key={img.id}
                      src={resolveMediaUrl(img.url)}
                      alt={img.alt ?? ""}
                      width={img.file?.width ?? 320}
                      height={img.file?.height ?? 240}
                      className="h-24 w-auto rounded-xl border border-slate-100 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Показания / противопоказания / побочные эффекты */}
        {(indications.length > 0 ||
          contraindications.length > 0 ||
          sideEffects.length > 0) && (
          <section className="grid gap-6 md:grid-cols-3">
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
            {sideEffects.length > 0 && (
              <CardBlock title="Побочные эффекты">
                <SideEffectsList items={sideEffects} />
              </CardBlock>
            )}
          </section>
        )}

        {/* Документы и вложения */}
        {(attachments.length > 0 || documents.length > 0) && (
          <section className="grid gap-6 md:grid-cols-2">
            {attachments.length > 0 && (
              <CardBlock title="Материалы по аппарату">
                <FilesList items={attachments} />
              </CardBlock>
            )}
            {documents.length > 0 && (
              <CardBlock title="Документы и сертификаты">
                <FilesList items={documents} />
              </CardBlock>
            )}
          </section>
        )}

        {/* Услуги на этом аппарате */}
        {services.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
              Процедуры на этом аппарате
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <DeviceServiceCard key={service.id} service={service} />
              ))}
            </div>
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
                  <FaqItemRow key={item.id} item={item} />
                ))}
            </div>
          </section>
        )}

        {/* Форма записи на аппарат */}
        <section id="device-booking">
          <DeviceBookingFormWrapper data={data} utm={utm} />
        </section>
      </section>
    </main>
  );
}

// ---------- Hero аппарата ----------

function DeviceHero({
  device,
  hero,
}: {
  device: DeviceDetailResponse["device"];
  hero: DeviceDetailResponse["hero"];
}) {
  const mainImage = hero.images?.[0];

  return (
    <section className="relative w-full min-h-[55vh] overflow-hidden">
      {mainImage && (
        <Image
          src={resolveMediaUrl(mainImage.url)}
          alt={mainImage.alt ?? `${device.brand} ${device.model}`}
          fill
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
          priority
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(13,19,33,0.96), rgba(29,45,68,0.9), rgba(29,45,68,0.75))",
        }}
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -bottom-10 h-40 w-40 rounded-full bg-[#F3F7FA]/10 blur-3xl" />
        <div className="absolute -right-20 -top-10 h-32 w-32 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 text-[#F3F7FA] md:py-14">
        {/* хлебные крошки */}
        <div className="mb-4 text-xs text-[#F3F7FA]/80">
          <Link href="/" className="hover:underline">
            Главная
          </Link>
          <span className="mx-1.5 opacity-60">/</span>
          <Link href="/devices" className="hover:underline">
            Аппараты
          </Link>
          <span className="mx-1.5 opacity-60">/</span>
          <span>
            {device.brand} {device.model}
          </span>
        </div>

        <div className="max-w-3xl space-y-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[#F3F7FA]/65">
            Аппарат {device.brand}
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {device.model}
          </h1>

          {hero.positioning && (
            <p className="text-base leading-relaxed text-[#F3F7FA]/85 sm:text-lg">
              {hero.positioning}
            </p>
          )}

          {/* бейджи сертификатов: поддерживаем и строки, и объекты {id,type,label,image,file} */}
          {Array.isArray(hero.certBadges) && hero.certBadges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[#F3F7FA]/90">
              {(hero.certBadges as unknown[]).map((badge, i) => {
                let label: string | null = null;
                let idPart: string | number | undefined;

                if (typeof badge === "string") {
                  label = badge;
                } else if (
                  badge &&
                  typeof badge === "object" &&
                  "label" in badge
                ) {
                  const maybeLabel = (badge as { label?: unknown }).label;
                  if (typeof maybeLabel === "string") {
                    label = maybeLabel;
                  }
                  if ("id" in badge) {
                    idPart = (badge as { id?: unknown }).id as
                      | string
                      | number
                      | undefined;
                  }
                }

                if (!label) {
                  return null;
                }

                const key = idPart ?? `${label}-${i}`;

                return (
                  <span
                    key={key}
                    className="rounded-full bg-[#0D1321]/50 px-3 py-1"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          )}

          <div className="pt-3">
            <a
              href="#device-booking"
              className="inline-flex items-center justify-center rounded-full bg-[#F3F7FA] px-6 py-2.5 text-sm font-medium text-[#1D2D44] shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_55px_rgba(0,0,0,0.45)]"
            >
              Записаться на процедуру на этом аппарате
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Вспомогательные блоки ----------

function CardBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
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

function SideEffectsList({ items }: { items: DeviceSideEffect[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-slate-700 sm:text-[15px]">
      {items.map((item) => (
        <li key={item.id} className="flex gap-2">
          <span className="mt-0.5 inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-[#1D2D44]/40 bg-white">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D2D44]" />
          </span>
          <span>
            {item.text}{" "}
            {item.rarity && (
              <span className="ml-1 inline-flex rounded-full bg-white/70 px-2 py-px text-[10px] text-slate-600">
                {mapRarity(item.rarity)}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function mapRarity(raw: string): string {
  const r = raw.toUpperCase();
  if (r === "COMMON") return "Часто";
  if (r === "RARE") return "Редко";
  if (r === "VERY_RARE") return "Очень редко";
  return raw;
}

// attachments/documents: аккуратно работаем с GenericFileRef
function FilesList({ items }: { items: GenericFileRef[] }) {
  if (!items.length) return null;

  return (
    <ul className="space-y-2 text-sm text-slate-700 sm:text-[15px]">
      {items.map((item, idx) => {
        const title =
          item.title ??
          item.name ??
          item.label ??
          `Документ ${idx + 1}`;

        const description = item.description ?? item.caption ?? null;
        const file = item.file ?? null;
        const url = file?.url ?? item.url ?? null;

        return (
          <li
            key={item.id ?? `file-${idx}`}
            className="flex flex-col gap-1 rounded-xl bg-white px-3 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-[#0D1321]">{title}</span>
              {url && (
                <a
                  href={resolveMediaUrl(url)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-[#1D2D44] underline underline-offset-2"
                >
                  Открыть
                </a>
              )}
            </div>
            {description && (
              <p className="text-[11px] text-slate-600">{description}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function DeviceServiceCard({
  service,
}: {
  service: DeviceRelatedService;
}) {
  return (
    <a
      href={`/service/${service.slug}`}
      className="group block h-full"
    >
      <article className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_32px_rgba(13,19,33,0.08)] transition group-hover:-translate-y-1 group-hover:border-[#1D2D44]/25 group-hover:shadow-[0_18px_45px_rgba(13,19,33,0.18)]">
        <div className="mb-3 flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#0D1321] sm:text-base">
            {service.name}
          </h3>
          {service.shortOffer && (
            <p className="text-xs text-slate-600 sm:text-[13px]">
              {service.shortOffer}
            </p>
          )}
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          {service.priceFrom && (
            <span className="rounded-full bg-[#F3F7FA] px-2.5 py-1">
              от {service.priceFrom} ₽
            </span>
          )}
          {service.durationMinutes && (
            <span className="rounded-full bg-[#F3F7FA] px-2.5 py-1">
              ~ {service.durationMinutes} минут
            </span>
          )}
        </div>
        <div className="mt-auto pt-1 text-[11px] font-medium text-[#1D2D44]">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D2D44]" />
            Подробнее об услуге
          </span>
        </div>
      </article>
    </a>
  );
}

function FaqItemRow({ item }: { item: FaqItem }) {
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

// ---------- UTM + форма ----------

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

function DeviceBookingFormWrapper({
  data,
  utm,
}: {
  data: DeviceDetailResponse;
  utm: UtmParams;
}) {
  const title = `${data.device.brand} ${data.device.model}`;

  return (
    <div className="rounded-3xl border border-slate-100 bg-[#F3F7FA] px-5 py-7 shadow-[0_12px_32px_rgba(13,19,33,0.08)] md:px-7 md:py-8">
      <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
        Запись на процедуру на аппарате {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
        Оставьте контакты — администратор свяжется с вами, чтобы подобрать
        процедуру и режим работы аппарата под вашу задачу.
      </p>

      <DeviceBookingForm
        deviceId={data.device.id}
        deviceSlug={data.device.slug}
        utm={utm}
      />
    </div>
  );
}

// ---------- Заглушка при 404 от /devices/:slug ----------

function DeviceNotFound({ slug }: { slug: string }) {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-[#0D1321] sm:text-3xl">
          Аппарат не найден
        </h1>
        <p className="mt-3 text-sm text-slate-700 sm:text-[15px]">
          К сожалению, аппарат со ссылкой{" "}
          <span className="font-mono break-all">/devices/{slug}</span>{" "}
          не найден или временно недоступен.
        </p>
        <Link
          href="/devices"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1D2D44] px-5 py-2.5 text-sm font-medium text-[#F3F7FA] shadow-[0_10px_28px_rgba(13,19,33,0.45)] transition hover:bg-[#0D1321]"
        >
          Вернуться в каталог аппаратов
        </Link>
      </section>
    </main>
  );
}
