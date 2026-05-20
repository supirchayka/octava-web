import Link from "next/link";

import type { ServicePriceCategory, ServicePriceExtended } from "@/types/api";

type Gender = "female" | "male";

type PricesPageClientProps = {
  data: Record<Gender, ServicePriceCategory[]>;
  pricePdf: { url: string; name: string } | null;
};

export function PricesPageClient({ data, pricePdf }: PricesPageClientProps) {
  const groups: Array<{ key: Gender; title: string; categories: ServicePriceCategory[] }> = [
    { key: "female", title: "Женщинам", categories: data.female ?? [] },
    { key: "male", title: "Мужчинам", categories: data.male ?? [] },
  ];
  const hasCategories = groups.some((group) => group.categories.length > 0);

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:pt-12">
        <header className="space-y-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-[#0D1321] sm:text-3xl">
              Цены
            </h1>
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

        <div className="mt-10 space-y-10">
          {groups.map((group) => (
            <section key={group.key} className="space-y-4">
              {group.categories.length > 0 && (
                <h2 className="text-2xl font-semibold text-[#0D1321]">
                  {group.title}
                </h2>
              )}
              <div className="space-y-6">
                {group.categories.map((category) => {
                  const categoryKey = `${group.key}-${category.id}`;

                  return (
                    <details
                      key={categoryKey}
                      className="group/category overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_40px_rgba(13,19,33,0.08)]"
                    >
                      <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 text-left transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                        <div>
                          <h3 className="text-xl font-semibold text-[#0D1321]">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="mt-2 text-sm text-slate-600">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <ChevronIcon className="group-open/category:rotate-180" />
                      </summary>

                      <div className="divide-y divide-slate-100">
                        {category.services.map((service) => (
                          <article key={service.id} className="px-6 py-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:justify-between">
                              <details className="group/service min-w-0 flex-1">
                                <summary className="flex min-w-0 cursor-pointer list-none items-start justify-between gap-4 rounded-2xl p-3 text-left transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                                  <div className="min-w-0">
                                    <h4 className="text-lg font-semibold text-[#0D1321]">
                                      {service.name}
                                    </h4>
                                    {service.shortOffer && (
                                      <p className="mt-1 text-sm text-slate-600">
                                        {service.shortOffer}
                                      </p>
                                    )}
                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                                      {service.priceFrom && (
                                        <span className="font-semibold text-[#0D1321]">
                                          от {service.priceFrom}
                                        </span>
                                      )}
                                      {service.durationMinutes && (
                                        <span>{service.durationMinutes} мин</span>
                                      )}
                                    </div>
                                  </div>
                                  <ChevronIcon className="group-open/service:rotate-180" />
                                </summary>

                                <div className="px-3 pb-3">
                                  {service.pricesExtended.length > 0 ? (
                                    <div className="mt-1 overflow-hidden rounded-2xl border border-slate-100 bg-white">
                                      <div className="divide-y divide-slate-100">
                                        {service.pricesExtended.map((item) => (
                                          <PriceRow key={item.id} item={item} />
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="mt-1 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                      Детализированные цены не добавлены
                                    </p>
                                  )}
                                </div>
                              </details>

                              <Link
                                href={`/service/${service.slug}`}
                                className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[#0D1321] px-4 text-sm font-medium text-[#0D1321] transition hover:bg-[#0D1321] hover:text-white md:self-center"
                              >
                                Подробнее
                              </Link>
                            </div>
                          </article>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>
          ))}

          {!hasCategories && (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              Пока нет доступных цен.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform duration-300 ${className ?? ""}`}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PriceRow({ item }: { item: ServicePriceExtended }) {
  return (
    <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-[#0D1321]">{item.title}</p>
        <p className="mt-1 text-[11px] uppercase text-slate-500">
          Код услуги: {item.serviceCode}
        </p>
        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500">
          {item.durationMinutes && <span>{item.durationMinutes} мин</span>}
          {item.sessionsCount && <span>{item.sessionsCount} сеансов</span>}
        </div>
      </div>
      <div className="text-base font-semibold text-[#0D1321]">{item.price}</div>
    </div>
  );
}
