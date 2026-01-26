import Link from "next/link";

export const dynamic = "force-static";

export default function ServicesLandingPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:pt-12">
        <header className="mb-10 max-w-3xl animate-[fade-up_0.6s_ease-out_both]">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0D1321] sm:text-3xl">
            Выберите направление
          </h1>
          <p className="mt-3 text-sl leading-relaxed text-slate-600">
            Перейдите к женским или мужским категориям услуг, чтобы посмотреть
            подборку процедур.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          <GenderLink
            label="Женщины"
            description="Категории эстетического и оздоровительного ухода, собранные для женских запросов."
            href="/services/female"
          />
          <GenderLink
            label="Мужчины"
            description="Процедуры и консультации, разработанные для мужских направлений и задач."
            href="/services/male"
          />
        </div>
      </section>
    </main>
  );
}

function GenderLink({
  label,
  description,
  href,
}: {
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[220px] overflow-hidden rounded-3xl bg-[#ffffff] text-[#F3F7FA] shadow-[0_18px_45px_rgba(0,0,0,0.15)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D2D44] via-[#0D1321] to-[#1D2D44]" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1321]/90 via-[#0D1321]/75 to-transparent" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 top-[-40px] h-40 w-40 rounded-full bg-[#F3F7FA]/10 blur-3xl" />
        <div className="absolute -left-24 bottom-[-40px] h-48 w-48 rounded-full bg-[#F3F7FA]/8 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-end gap-3 p-5">
        <h3 className="text-lg font-semibold">{label}</h3>

        <p className="text-sm text-[#F3F7FA]/85">{description}</p>

        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-[#F3F7FA]/85">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white/15">
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-3.5 w-3.5"
            >
              <path
                d="M6 4.75L12.25 4.75L12.25 11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.25 12.5L12.25 4.75"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>Подробнее о направлении</span>
        </div>
      </div>
    </Link>
  );
}
