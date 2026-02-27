import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSpecialists } from "@/lib/api/specialists";
import { resolveMediaUrl } from "@/lib/media";
import type { Specialist } from "@/types/api";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const { id } = await props.params;
  const specialist = await findSpecialist(id);

  if (!specialist) return {};

  const fullName = formatSpecialistFullName(specialist);

  return {
    title: `${fullName} — специалист OCTAVA`,
    description: `${specialist.specialization}. Стаж ${formatExperience(
      specialist.experienceYears
    )}.`,
  };
}

export default async function SpecialistPage(props: PageProps) {
  const { id } = await props.params;
  const specialist = await findSpecialist(id);

  if (!specialist) {
    notFound();
  }

  const fullName = formatSpecialistFullName(specialist);
  const experienceLabel = formatExperience(specialist.experienceYears);
  const services = specialist.services ?? [];

  return (
    <main className="bg-white">
      <section className="relative w-full overflow-hidden border-b border-slate-100">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(13,19,33,0.95), rgba(29,45,68,0.82), rgba(29,45,68,0.4))",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -bottom-10 h-40 w-40 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
          <div className="absolute -right-24 -top-10 h-32 w-32 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-[#F3F7FA] md:flex-row md:items-center md:justify-between md:gap-8 md:py-14">
          <div className="max-w-2xl space-y-4">
            <Link
              href="/specialists"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#F3F7FA]/75 transition hover:text-[#F3F7FA]"
            >
              <span className="text-base">←</span>
              Все специалисты
            </Link>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-[#F3F7FA]/70">
                {specialist.specialization}
              </p>
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {fullName}
              </h1>
              <div className="flex flex-wrap gap-2 text-xs text-[#F3F7FA]/80">
                <span className="rounded-full bg-white/10 px-3 py-1">
                  Стаж: {experienceLabel}
                </span>
                {services.length > 0 && (
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    {services.length} услуг(и) в работе
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#F3F7FA]/85 sm:text-base">
              {`${specialist.specialization} с опытом ${experienceLabel}. ` +
                "Запишитесь на консультацию, чтобы обсудить цели ухода и получить персональную программу."}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={`/contacts?specialist=${encodeURIComponent(fullName)}`}
                className="inline-flex items-center justify-center rounded-full bg-[#F3F7FA] px-5 py-2 text-sm font-semibold text-[#0D1321] transition hover:bg-white"
              >
                Записаться на приём
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-[#F3F7FA] transition hover:border-white"
              >
                Посмотреть услуги
              </Link>
            </div>
          </div>

          <div className="relative h-64 w-full max-w-sm self-center overflow-hidden rounded-3xl border border-white/15 bg-[#0D1321]/35 shadow-[0_18px_45px_rgba(0,0,0,0.35)] sm:h-72 md:h-80 md:w-[320px] md:shrink-0 md:self-auto">
            {specialist.photo ? (
              <Image
                src={resolveMediaUrl(specialist.photo.url)}
                alt={fullName}
                fill
                className="h-full w-full object-cover object-top"
                sizes="(max-width: 768px) min(100vw, 24rem), 320px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1D2D44] to-[#0D1321] text-4xl font-semibold">
                {getInitials(specialist.firstName, specialist.lastName)}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-10">
        {specialist.biography && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
              Биография и подход
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-slate-700 sm:text-[17px]">
              {specialist.biography}
            </p>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
                Услуги специалиста
              </h2>
              <p className="text-sm text-slate-600 sm:text-[15px]">
                Подберите направление или процедуру, чтобы узнать больше о
                программе лечения.
              </p>
            </div>
            <Link
              href="/services"
              className="text-sm font-medium text-[#1D2D44] hover:underline"
            >
              Все услуги клиники
            </Link>
          </div>

          {services.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-[#F3F7FA] px-5 py-4 text-sm text-slate-600">
              Сейчас в карточке специалиста нет закреплённых услуг. Свяжитесь с
              нами, чтобы уточнить доступные направления.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(13,19,33,0.06)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-[#0D1321]">
                        {service.name}
                      </h3>
                      {service.shortOffer && (
                        <p className="text-sm text-slate-600">
                          {service.shortOffer}
                        </p>
                      )}
                    </div>
                    {service.priceFrom && (
                      <span className="shrink-0 rounded-full bg-[#F3F7FA] px-3 py-1 text-xs font-semibold text-[#1D2D44]">
                        от {service.priceFrom} ₽
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs font-medium text-[#1D2D44]">
                    <Link
                      href={`/service/${service.slug}`}
                      className="inline-flex items-center gap-2 hover:underline"
                    >
                      Подробнее об услуге
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

async function findSpecialist(id: string): Promise<Specialist | null> {
  const specialists = await getSpecialists();
  const specialistId = Number(id);

  if (Number.isNaN(specialistId)) {
    return null;
  }

  return specialists.find((item) => item.id === specialistId) ?? null;
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

function formatSpecialistFullName(specialist: Specialist) {
  return `${specialist.lastName} ${specialist.firstName} ${specialist.middleName ?? ""}`.trim();
}
