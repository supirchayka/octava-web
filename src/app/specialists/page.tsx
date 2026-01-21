import Image from "next/image";
import Link from "next/link";

import { getSpecialists } from "@/lib/api/specialists";
import { resolveMediaUrl } from "@/lib/media";
import type { Specialist } from "@/types/api";

export const dynamic = "force-static";

export default async function SpecialistsPage() {
  const specialists = await getSpecialists();

  const sortedSpecialists = [...specialists].sort((a, b) =>
    `${a.lastName} ${a.firstName}`.localeCompare(
      `${b.lastName} ${b.firstName}`,
      "ru"
    )
  );

  return (
    <main className="bg-white">
      <section className="relative w-full overflow-hidden border-b border-slate-100">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,19,33,1), rgba(29,45,68,0.9), rgba(29,45,68,0.85))",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -bottom-10 h-40 w-40 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
          <div className="absolute -right-20 -top-10 h-32 w-32 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-10 text-[#F3F7FA] md:py-12">
          <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#F3F7FA]/80">
            Команда клиники OCTAVA
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Специалисты, которым доверяют пациенты
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#F3F7FA]/85 sm:text-base">
            Врачи OCTAVA объединяют клиническую экспертизу и деликатный подход.
            Здесь собраны профильные специалисты, которые подбирают программы
            ухода и терапии под ваши цели.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        {sortedSpecialists.length === 0 ? (
          <p className="text-sm text-slate-600">
            Список специалистов временно недоступен. Попробуйте обновить
            страницу позже.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedSpecialists.map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function SpecialistCard({ specialist }: { specialist: Specialist }) {
  const fullName = `${specialist.firstName} ${specialist.lastName}`;
  const services = specialist.services ?? [];
  const experienceLabel = formatExperience(specialist.experienceYears);
  const initials = getInitials(specialist.firstName, specialist.lastName);

  return (
    <Link href={`/specialists/${specialist.id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_12px_32px_rgba(13,19,33,0.08)] transition hover:-translate-y-1 hover:border-[#1D2D44]/25 hover:shadow-[0_18px_45px_rgba(13,19,33,0.18)]">
        <div className="relative h-44 w-full overflow-hidden bg-[#0D1321]/10">
          {specialist.photo ? (
            <>
              <Image
                src={resolveMediaUrl(specialist.photo.url)}
                alt={fullName}
                fill
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
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

        <div className="flex flex-1 flex-col gap-3 px-4 py-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[#0D1321] sm:text-lg">
              {fullName}
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {specialist.specialization}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
            <span className="inline-flex items-center rounded-full bg-[#F3F7FA] px-2.5 py-1">
              Стаж: {experienceLabel}
            </span>
            {services.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-[#F3F7FA] px-2.5 py-1">
                {services.length} услуг(и)
              </span>
            )}
          </div>

          {specialist.biography && (
            <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
              {specialist.biography}
            </p>
          )}

          {services.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-2 text-[11px] font-medium text-[#1D2D44]">
              {services.slice(0, 3).map((service) => (
                <span
                  key={service.id}
                  className="rounded-full border border-[#1D2D44]/15 bg-white px-2.5 py-1"
                >
                  {service.name}
                </span>
              ))}
              {services.length > 3 && (
                <span className="rounded-full border border-[#1D2D44]/15 bg-white px-2.5 py-1">
                  +{services.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
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
