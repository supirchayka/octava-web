"use client";

import Link from "next/link";
import { useState } from "react";

import type { ServicePriceCategory } from "@/types/api";

type Gender = "female" | "male";

type PricesPageClientProps = {
  data: Record<Gender, ServicePriceCategory[]>;
  pricePdf: { url: string; name: string } | null;
};

export function PricesPageClient({ data, pricePdf }: PricesPageClientProps) {
  const categories = [...(data.female ?? []), ...(data.male ?? [])];
  const [openCategoryKeys, setOpenCategoryKeys] = useState<string[]>([]);

  const toggleCategory = (categoryKey: string) => {
    setOpenCategoryKeys((currentKeys) =>
      currentKeys.includes(categoryKey)
        ? currentKeys.filter((currentKey) => currentKey !== categoryKey)
        : [...currentKeys, categoryKey],
    );
  };

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:pt-12">
        <header className="space-y-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-[#0D1321] sm:text-3xl">Цены</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Актуальные цены на все услуги салона.
            </p>
            {pricePdf && (
              <a
                href={pricePdf.url}
                target="_blank"
                rel="noreferrer"
                download={pricePdf.name}
                className="inline-flex items-center rounded-full border border-[#0D1321] px-5 py-2 text-sm font-medium text-[#0D1321] transition hover:bg-[#0D1321] hover:text-white"
              >
                Скачать прайс PDF
              </a>
            )}
          </div>
        </header>

        <div className="mt-10 space-y-6">
          {categories.map((category) => {
            const categoryKey = `${category.id}-${category.gender}`;
            const isOpen = openCategoryKeys.includes(categoryKey);

            return (
              <section
                key={categoryKey}
                className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_40px_rgba(13,19,33,0.08)]"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(categoryKey)}
                  aria-expanded={isOpen}
                  aria-controls={`category-panel-${categoryKey}`}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 text-left transition hover:bg-slate-50"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-[#0D1321]">{category.name}</h2>
                    {category.description && <p className="mt-2 text-sm text-slate-600">{category.description}</p>}
                  </div>
                  <svg
                    className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </button>

                <div
                  id={`category-panel-${categoryKey}`}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}
                >
                  <div className="overflow-hidden">
                    <div className="divide-y divide-slate-100">
                      {category.services.map((service) => (
                        <Link
                          key={service.id}
                          href={`/service/${service.slug}`}
                          className="block px-6 py-6 transition hover:bg-slate-50"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-[#0D1321]">{service.name}</h3>
                              {service.shortOffer && <p className="mt-1 text-sm text-slate-600">{service.shortOffer}</p>}
                            </div>
                            <div className="text-sm text-slate-500 md:text-right">
                              {service.priceFrom && <p className="text-base font-semibold text-[#0D1321]">от {service.priceFrom}</p>}
                              {service.durationMinutes && <p>{service.durationMinutes} мин</p>}
                            </div>
                          </div>

                          {service.pricesExtended.length > 0 && (
                            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white">
                              <div className="divide-y divide-slate-100">
                                {service.pricesExtended
                                  .slice()
                                  .sort((a, b) => a.order - b.order)
                                  .map((item) => (
                                    <PriceRow key={item.id} item={item} />
                                  ))}
                              </div>
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
          {categories.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              Пока нет доступных цен.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function PriceRow({
  item,
}: {
  item: {
    id: number;
    title: string;
    price: string;
    durationMinutes: number | null;
    sessionsCount?: number | null;
  };
}) {
  return (
    <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-[#0D1321]">{item.title}</p>
        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500">
          {item.durationMinutes && <span>{item.durationMinutes} мин</span>}
          {item.sessionsCount && <span>{item.sessionsCount} сеансов</span>}
        </div>
      </div>
      <div className="text-base font-semibold text-[#0D1321]">{item.price}</div>
    </div>
  );
}
