// src/app/contacts/page.tsx

import type { Metadata } from "next";
import { getOrg } from "@/lib/api/org";
import { getContactsPage } from "@/lib/api/pages";
import { Suspense } from "react";

type PageProps = {
  // в новой версии Next searchParams может быть Promise
  searchParams: Promise<{ service?: string }>;
};

export const metadata: Metadata = {
  title: "Контакты — клиника OCTAVA",
  description:
    "Контакты клиники OCTAVA. Запись на консультацию, телефон, форма обратной связи.",
};

function normalizeMapUrl(rawValue: string | null | undefined): string | null {
  const raw = rawValue?.trim();
  if (!raw) return null;

  // Allow admins to paste either a direct URL or a full iframe snippet.
  const iframeSrcMatch = raw.match(/src=["']([^"']+)["']/i);
  const candidate = iframeSrcMatch?.[1] ?? raw;

  return candidate.replace(/&amp;/g, "&");
}

export default async function ContactsPage(props: PageProps) {
  const { service } = await props.searchParams;
  const serviceSlug = service ?? "";

  const org = await getOrg();
  const contacts = await getContactsPage()
    .then((res) => res.contacts)
    .catch(() => null);
  const primaryPhone = org.phones?.find((p) => p.isPrimary) ?? org.phones?.[0];
  const phoneNumber = contacts?.phone ?? primaryPhone?.number ?? null;
  const mapUrl = normalizeMapUrl(contacts?.yandexMapUrl);
  const addressHtml = contacts?.address?.trim() || null;

  return (
    <main className="bg-white">
      {/* HERO с контактной информацией */}
      <section className="relative w-full overflow-hidden border-b border-slate-100">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,19,33,1), rgba(29,45,68,0.95), rgba(29,45,68,0.85))",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 bottom-[-40px] h-40 w-40 rounded-full bg-[#F3F7FA]/15 blur-3xl" />
          <div className="absolute -right-20 top-[-40px] h-32 w-32 rounded-full bg-[#F3F7FA]/12 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 text-[#F3F7FA] md:flex-row md:items-center md:py-12">
          <div className="flex-1 space-y-4">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Связь с клиникой и запись на консультацию
            </h1>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl border border-[#F3F7FA]/20 bg-[#0D1321]/40 p-5 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.5)]">
              <dl className="space-y-3 text-sm text-[#F3F7FA]/90">

                {phoneNumber && (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.16em] text-[#F3F7FA]/60">
                      Телефон
                    </dt>
                    <dd className="mt-1 text-base font-medium">
                      {phoneNumber}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-[#F3F7FA]/60">
                    Режим работы
                  </dt>
                  <dd className="mt-1">10:00 – 22:00, ежедневно</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Контент: форма + боковая панель */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
          <div className="order-2 md:order-1">
            <ContactForm serviceSlug={serviceSlug} org={org} />
          </div>
          <div className="order-1 md:order-2">
            <ContactSidePanel
              org={org}
              addressHtml={addressHtml}
              mapUrl={mapUrl}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

// ---------------- ФОРМА ----------------

import type { Organization } from "@/types/api";
import { ContactLeadForm } from "@/components/ContactLeadForm";

function ContactForm({
  serviceSlug,
  org,
}: {
  serviceSlug?: string;
  org: Organization;
}) {
  const hasService = Boolean(serviceSlug && serviceSlug.trim().length > 0);

  return (
    <section className="rounded-3xl border border-slate-100 bg-[#F3F7FA] px-5 py-7 shadow-[0_12px_32px_rgba(13,19,33,0.08)] md:px-7 md:py-8">
      <div className="mb-5 space-y-2">
        <h2 className="text-xl font-semibold text-[#0D1321] sm:text-2xl">
          Оставить заявку
        </h2>
        <p className="text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Укажите контактные данные — администратор свяжется с вами, чтобы
          уточнить детали и выбрать удобное время.
        </p>

        {hasService && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#1D2D44] shadow-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1D2D44]" />
            <span>
              Выбранная услуга:{" "}
              <span className="font-semibold">{serviceSlug}</span>
            </span>
          </div>
        )}
      </div>

      <Suspense fallback={<div className="h-10 w-full" />}>
        <ContactLeadForm serviceSlug={serviceSlug} operatorNote={null} />
      </Suspense>

      <p className="mt-3 text-[11px] leading-snug text-slate-500">
        Оператор персональных данных — {org.fullName}, ОГРН {org.ogrn}, ИНН
        {" "}
        {org.inn}
        {org.kpp ? `, КПП ${org.kpp}` : ""}, адрес: {org.address}.
      </p>
    </section>
  );
}

// ---------------- ПРАВАЯ ПАНЕЛЬ (карта/доп.инфо) ----------------

function ContactSidePanel({
  org,
  addressHtml,
  mapUrl,
}: {
  org: Organization;
  addressHtml: string | null;
  mapUrl: string | null;
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-slate-100 bg-white px-5 py-5 shadow-[0_10px_28px_rgba(13,19,33,0.06)] md:px-6 md:py-6">
        <h2 className="text-base font-semibold text-[#0D1321] sm:text-lg">
          Как нас найти
        </h2>
        {addressHtml ? (
          <div
            className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px] [&_b]:font-semibold [&_br]:block [&_div]:my-2 [&_em]:italic [&_i]:italic [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:font-semibold [&_u]:underline [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: addressHtml }}
          />
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
            {org.address}
          </p>
        )}
        <p className="mt-3 text-sm font-medium leading-relaxed text-[#1D2D44] sm:text-[15px]">
          Для гостей клиники предусмотрена подземная парковка
        </p>
      </div>

      <div className="relative h-[360px] w-full overflow-hidden rounded-3xl text-[#F3F7FA] shadow-[0_4px_25px_rgba(13,19,33,0.15)] sm:h-[320px]">
        {mapUrl ? (
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        ) : (
          <div className="h-full w-full bg-slate-100" />
        )}
      </div>
    </section>
  );
}
