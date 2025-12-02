import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceCategoryBySlug } from "@/lib/api/serviceCategories";
import { resolveMediaUrl } from "@/lib/media";
import type {
  ServiceCategoryDetails,
  CategoryService,
} from "@/types/api";

type PageProps = {
  // ВАЖНО: params теперь Promise — это новое поведение Next
  params: Promise<{ slug: string }>;
};

// ---------- SEO из блока seo ----------

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const { slug } = await props.params; // дожидаемся params

  let data: ServiceCategoryDetails;
  try {
    data = await getServiceCategoryBySlug(slug);
  } catch {
    // Если категория не найдена — не падаем, просто отдаём дефолтный мета
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

// ---------- Страница категории ----------

export default async function CategoryServicesPage(props: PageProps) {
  const { slug } = await props.params; // тоже ждём params

  let data: ServiceCategoryDetails;
  try {
    data = await getServiceCategoryBySlug(slug);
  } catch {
    // API вернул 404 / ошибку — отдаем стандартную 404-страницу Next
    notFound();
  }

  const { category, services } = data;

  return (
    <main className="bg-white">
      <CategoryHero category={category} />
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <ServicesList services={services} />
      </section>
    </main>
  );
}

// ---------- HERO категории ----------

function CategoryHero({
  category,
}: {
  category: ServiceCategoryDetails["category"];
}) {
  const heroImage = category.heroImage;

  return (
    <section className="relative w-full min-h-[55vh] overflow-hidden">
      {heroImage && (
        <img
          src={resolveMediaUrl(heroImage.url)}
          alt={heroImage.alt ?? category.name}
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
          <span>{category.name}</span>
        </div>

        <h1 className="text-balance text-3xl font-semibold tracking-tight text-[#F3F7FA] sm:text-4xl md:text-5xl">
          {category.name}
        </h1>

        {category.description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#F3F7FA]/85 sm:text-base">
            {category.description}
          </p>
        )}
      </div>
    </section>
  );
}

// ---------- Список услуг категории ----------

function ServicesList({ services }: { services: CategoryService[] }) {
  if (!services.length) {
    return (
      <p className="text-sm text-slate-600">
        В этой категории пока нет опубликованных услуг.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#0D1321] sm:text-xl">
        Услуги категории
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: CategoryService }) {
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
            <p className="text-sm text-slate-600">
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

        {service.benefits?.length > 0 && (
          <ul className="mb-4 space-y-1.5 text-xs text-slate-600">
            {service.benefits.map((benefit, i) => (
              <li
                key={`${service.id}-benefit-${i}`}
                className="flex gap-2"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D2D44]" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#1D2D44]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1D2D44]/6 transition group-hover:bg-[#1D2D44]/12">
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M6.25 4.75H13.5V12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.5 12.75L13.5 4.75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>Подробнее об услуге</span>
          </div>
        </div>
      </article>
    </a>
  );
}