// src/app/contacts/page.tsx

import type { Metadata } from "next";

type PageProps = {
  // в новой версии Next searchParams тоже может быть Promise
  searchParams: Promise<{ service?: string }>;
};

export const metadata: Metadata = {
  title: "Контакты — клиника OCTAVA",
  description:
    "Контакты клиники OCTAVA. Запись на консультацию, телефон, форма обратной связи.",
};

export default async function ContactsPage(props: PageProps) {
  const { service } = await props.searchParams;
  const serviceSlug = service ?? "";

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
            <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#F3F7FA]/85 backdrop-blur-md">
              Контакты клиники OCTAVA
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Связь с клиникой и запись на консультацию
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[#F3F7FA]/85 sm:text-base">
              Оставьте заявку или свяжитесь удобным для вас способом. Мы
              уточним детали, подберём время приёма и ответим на вопросы
              по процедурам.
            </p>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl border border-[#F3F7FA]/20 bg-[#0D1321]/40 p-5 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.5)]">
              <dl className="space-y-3 text-sm text-[#F3F7FA]/90">
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-[#F3F7FA]/60">
                    Телефон
                  </dt>
                  <dd className="mt-1 text-base font-medium">
                    +7 (___) ___-__-__ {/* TODO: подставь реальный номер */}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-[#F3F7FA]/60">
                    Адрес
                  </dt>
                  <dd className="mt-1">
                    Улица, дом, город {/* TODO: реальный адрес клиники */}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-[#F3F7FA]/60">
                    График работы
                  </dt>
                  <dd className="mt-1">
                    Ежедневно, 10:00–21:00 {/* TODO: реальный график */}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-[#F3F7FA]/60">
                    Мессенджеры
                  </dt>
                  <dd className="mt-1">
                    {/* TODO: подставь реальные ссылки */}
                    WhatsApp / Telegram
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Контент: форма + боковая панель */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
          <ContactForm serviceSlug={serviceSlug} />
          <ContactSidePanel />
        </div>
      </section>
    </main>
  );
}

// ---------------- ФОРМА ----------------

function ContactForm({ serviceSlug }: { serviceSlug?: string }) {
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

      <form className="flex flex-col gap-3">
        {/* скрытое поле со slug услуги, если есть */}
        {hasService && (
          <input
            type="hidden"
            name="serviceSlug"
            value={serviceSlug}
          />
        )}

        {/* Имя */}
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            Имя
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]"
            placeholder="Как к вам обращаться"
          />
        </div>

        {/* Телефон */}
        <div>
          <label
            htmlFor="contact-phone"
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            Телефон
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]"
            placeholder="+7 ___ ___-__-__"
          />
        </div>

        {/* Комментарий */}
        <div>
          <label
            htmlFor="contact-comment"
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            Комментарий (по желанию)
          </label>
          <textarea
            id="contact-comment"
            name="comment"
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]"
            placeholder="Кратко опишите вопрос (без указания подробных медицинских данных)"
          />
        </div>

        {/* Согласие на ПД */}
        <div className="mt-1 flex items-start gap-2 rounded-xl bg-white px-3 py-3 text-[11px] leading-snug text-slate-700">
          <input
            id="pd-consent"
            name="pdConsent"
            type="checkbox"
            required
            className="mt-[3px] h-3.5 w-3.5 accent-[#1D2D44]"
          />
          <label htmlFor="pd-consent" className="cursor-pointer">
            Я ознакомился(лась) с{" "}
            <a
              href="/personal-data-policy"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              Политикой обработки персональных данных
            </a>{" "}
            и даю{" "}
            <a
              href="/personal-data-consent"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              согласие на обработку персональных данных
            </a>{" "}
            в целях обработки моего обращения и обратной связи.
          </label>
        </div>

        {/* Согласие на рекламу (опционально) */}
        <div className="flex items-start gap-2 text-[11px] leading-snug text-slate-600">
          <input
            id="marketing-consent"
            name="marketingConsent"
            type="checkbox"
            className="mt-[3px] h-3.5 w-3.5 accent-[#1D2D44]"
          />
          <label htmlFor="marketing-consent" className="cursor-pointer">
            Согласен(на) на получение информационных и рекламных сообщений
            о услугах клиники OCTAVA по указанным контактам.
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#1D2D44] px-4 py-2.5 text-sm font-semibold text-[#F3F7FA] shadow-[0_10px_28px_rgba(13,19,33,0.45)] transition hover:bg-[#0D1321] hover:shadow-[0_14px_36px_rgba(13,19,33,0.6)]"
        >
          Отправить заявку
        </button>

        <p className="mt-1 text-[11px] leading-snug text-slate-500">
          Оператор персональных данных – Клиника OCTAVA
          {/* TODO: подставь полное юр. лицо / ОГРН/ИНН при необходимости */}
        </p>
      </form>
    </section>
  );
}

// ---------------- ПРАВАЯ ПАНЕЛЬ (карта/доп.инфо) ----------------

function ContactSidePanel() {
  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-slate-100 bg-white px-5 py-5 shadow-[0_10px_28px_rgba(13,19,33,0.06)] md:px-6 md:py-6">
        <h2 className="text-base font-semibold text-[#0D1321] sm:text-lg">
          Как нас найти
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          Здесь можно разместить краткое описание маршрута: ближайшее метро,
          ориентиры, парковку и особенности входа в клинику.
        </p>
      </div>

      <div className="relative h-[260px] w-full overflow-hidden rounded-3xl sm:h-[320px]">
        

        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A28dd05ca9b6d38be2b7a73b4717361155d924ffa0ab2474b03317efcc9a45b1c&amp;source=constructor" width="100%" height="500"></iframe>
        </div>
      </div>
    </section>
  );
}
