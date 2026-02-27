import Image from "next/image";
import Link from "next/link";

import { getServiceCategoriesByGender } from "@/lib/api/serviceCategories";
import type { ServiceCategory } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function MaleServicesPage() {
  const categories = await getServiceCategoriesByGender("male");

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:pt-12">
        <header className="mb-10 max-w-3xl animate-[fade-up_0.6s_ease-out_both]">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0D1321] sm:text-3xl">
            Почему мужчины выбирают нас?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Подготовили направления с эффективными решениями для мужского ухода
            — от эстетики до консультаций специалистов.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((category, index) => (
            <CategoryCard
              key={`${category.slug}-${category.id}-${index}`}
              category={category}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function CategoryCard({ category }: { category: ServiceCategory }) {
  const image = category.heroImage;

  return (
    <Link
      href={`/services/${category.slug}`}
      className="group relative flex min-h-[230px] overflow-hidden rounded-3xl bg-[#ffffff] text-[#F3F7FA] shadow-[0_18px_45px_rgba(13,19,33,0.18)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(13,19,33,0.3)]"
    >
      {image && (
        <Image
          src={resolveMediaUrl(image.url)}
          alt={image.alt ?? category.name}
          fill
          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 33vw"
          priority
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1321]/92 via-[#0D1321]/80 to-transparent" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 bottom-[-40px] h-40 w-40 rounded-full bg-[#F3F7FA]/10 blur-3xl" />
        <div className="absolute -right-16 top-[-32px] h-32 w-32 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[#F3F7FA]/2 bg-[#0D1321]/60 px-3 py-1 text-[22px] font-medium text-[#FFFFFF]/90 backdrop-blur-md">
              <h2>{category.name}</h2>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#F3F7FA]/90">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white/16">
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
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
        </div>
      </div>
    </Link>
  );
}
