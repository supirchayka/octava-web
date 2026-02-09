// src/app/devices/page.tsx

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getDevices } from "@/lib/api/devices";
import { resolveMediaUrl } from "@/lib/media";
import type { DeviceListItem } from "@/types/api";

export const metadata: Metadata = {
  title: "Аппаратные технологии — клиника OCTAVA",
  description:
    "Каталог аппаратных технологий клиники OCTAVA: SMAS-лифтинг, RF-лифтинг, криолиполиз, микровибрационная терапия и другие методы.",
};

export default async function DevicesCatalogPage() {
  const devices = await getDevices();

  return (
    <main className="bg-white">
      {/* HERO каталога аппаратов */}
      <section className="relative w-full overflow-hidden border-b border-slate-100">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,19,33,1), rgba(29,45,68,0.9), rgba(29,45,68,0.8))",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -bottom-10 h-40 w-40 rounded-full bg-[#F3F7FA]/15 blur-3xl" />
          <div className="absolute -right-20 -top-10 h-32 w-32 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-10 text-[#F3F7FA] md:py-12">
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Аппараты, на которых мы работаем
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#F3F7FA]/85 sm:text-base">
            Мы используем современные сертифицированные аппараты с доказанной
            эффективностью: от SMAS-лифтинга и RF-терапии до криолиполиза
            и комплексного ухода за кожей.
          </p>
        </div>
      </section>

      {/* Сетка карточек аппаратов */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        {devices.length === 0 ? (
          <p className="text-sm text-slate-600">
            Сейчас каталог аппаратов временно недоступен. Попробуйте обновить
            страницу позднее.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function DeviceCard({ device }: { device: DeviceListItem }) {
  const heroImage = device.heroImage;

  return (
    <Link
      href={`/devices/${device.slug}`}
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_12px_32px_rgba(13,19,33,0.08)] transition hover:-translate-y-1 hover:border-[#1D2D44]/25 hover:shadow-[0_18px_45px_rgba(13,19,33,0.18)]">
        {/* Картинка HERO */}
        <div className="relative h-75 w-full overflow-hidden">
          {heroImage && (
            <>
              <Image
                src={resolveMediaUrl(heroImage.url)}
                alt={heroImage.alt ?? `${device.brand} ${device.model}`}
                fill
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(13,19,33,0.42), rgba(29,45,68,0.25), rgba(29,45,68,0.0))",
                }}
              />
            </>
          )}
          {!heroImage && (
            <div className="flex h-full w-full items-center justify-center bg-[#0D1321] text-xs text-[#F3F7FA]/80">
              Изображение будет доступно позднее
            </div>
          )}
        </div>

        {/* Текстовая часть */}
        <div className="flex flex-1 flex-col gap-2 px-4 py-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
              {device.brand}
            </p>
            <h2 className="text-sm font-semibold text-[#0D1321] sm:text-base">
              {device.model}
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 sm:text-[13px]">
            {device.positioning}
          </p>

          <div className="mt-auto flex items-center justify-between pt-2 text-[11px] font-medium text-[#1D2D44]">
            <span className="inline-flex items-center gap-1">
            </span>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F7FA] text-xs text-[#1D2D44]">
              &rarr;
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
