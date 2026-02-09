"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_PHONE_COUNTRY,
  formatPhone,
  getCountryDigitsLimit,
  getPhoneCountry,
  getPhonePlaceholder,
  parsePhoneDigits,
  PHONE_COUNTRIES,
  type PhoneCountryCode,
} from "@/lib/phone";

type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

type ServiceFormPayload = {
  name: string;
  phone: string;
  message?: string;
  serviceId: number;
  serviceSlug: string;
  pagePath: string;
  pdnConsent: boolean;
  marketingConsent?: boolean;
} & UtmParams;

type SubmitResult = {
  ok: boolean;
  error?: string;
};

type Props = {
  serviceId: number;
  serviceSlug: string;
  utm?: UtmParams;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export function ServiceContactForm({ serviceId, serviceSlug, utm }: Props) {
  const pathname = usePathname();
  const pagePath = useMemo(() => pathname ?? `/service/${serviceSlug}`, [
    pathname,
    serviceSlug,
  ]);

  const [name, setName] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] =
    useState<PhoneCountryCode>(DEFAULT_PHONE_COUNTRY);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [message, setMessage] = useState("");
  const [pdnConsent, setPdnConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const phoneCountry = useMemo(
    () => getPhoneCountry(phoneCountryCode),
    [phoneCountryCode],
  );
  const phone = useMemo(
    () => formatPhone(phoneCountry, phoneDigits),
    [phoneCountry, phoneDigits],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    if (!pdnConsent) {
      setResult({
        ok: false,
        error: "Необходимо дать согласие на обработку персональных данных.",
      });
      return;
    }

    if (phoneDigits.length !== getCountryDigitsLimit(phoneCountry)) {
      setResult({
        ok: false,
        error: "Введите корректный номер телефона полностью.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ServiceFormPayload = {
        name,
        phone,
        pdnConsent: true,
        serviceId,
        serviceSlug,
        pagePath,
      };

      if (message.trim()) {
        payload.message = message.trim();
      }

      if (utm) {
        if (utm.utm_source) payload.utm_source = utm.utm_source;
        if (utm.utm_medium) payload.utm_medium = utm.utm_medium;
        if (utm.utm_campaign) payload.utm_campaign = utm.utm_campaign;
        if (utm.utm_content) payload.utm_content = utm.utm_content;
        if (utm.utm_term) payload.utm_term = utm.utm_term;
      }

      if (marketingConsent) {
        payload.marketingConsent = true;
      }

      const res = await fetch(`${API_BASE}/forms/service`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        const data: unknown = await res.json().catch(() => ({ ok: true }));
        if (typeof data === "object" && data !== null && "ok" in data) {
          const ok = (data as { ok: boolean }).ok;
          if (ok) {
            setResult({ ok: true });
            setName("");
            setPhoneCountryCode(DEFAULT_PHONE_COUNTRY);
            setPhoneDigits("");
            setMessage("");
            setPdnConsent(false);
            setMarketingConsent(false);
            setShowSuccessModal(true);
            return;
          }
        }
      }

      const text = await res.text().catch(() => "");
      setResult({
        ok: false,
        error:
          text ||
          `Ошибка при отправке формы (код ${res.status}). Попробуйте ещё раз.`,
      });
    } catch {
      setResult({
        ok: false,
        error: "Не удалось отправить форму. Проверьте подключение к сети.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="service-name"
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            Имя
          </label>
          <input
            id="service-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]"
            placeholder="Как к вам обращаться"
          />
        </div>

        <div>
          <label
            htmlFor="service-phone"
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            Телефон
          </label>
          <div className="flex gap-2">
            <select
              aria-label="Код страны"
              value={phoneCountryCode}
              onChange={(e) => {
                const nextCountry = getPhoneCountry(
                  e.target.value as PhoneCountryCode,
                );
                setPhoneCountryCode(nextCountry.code);
                setPhoneDigits((currentDigits) =>
                  currentDigits.slice(0, getCountryDigitsLimit(nextCountry)),
                );
              }}
              className="w-[138px] rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900 outline-none transition focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]"
            >
              {PHONE_COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} (+{country.dialCode})
                </option>
              ))}
            </select>
            <input
              id="service-phone"
              name="phone"
              type="tel"
              required
              inputMode="numeric"
              value={phone}
              onChange={(e) =>
                setPhoneDigits(parsePhoneDigits(e.target.value, phoneCountry))
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]"
              placeholder={getPhonePlaceholder(phoneCountry)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="service-message"
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            Комментарий (по желанию)
          </label>
          <textarea
            id="service-message"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]"
            placeholder="Например: интересует консультация и подбор курса"
          />
        </div>

        <div className="mt-1 flex items-start gap-2 rounded-xl bg-white px-3 py-3 text-[11px] leading-snug text-slate-700">
          <input
            id="service-pdn"
            name="pdnConsent"
            type="checkbox"
            required
            checked={pdnConsent}
            onChange={(e) => setPdnConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#1D2D44] sm:mt-[3px] sm:h-4 sm:w-4"
          />
          <label htmlFor="service-pdn" className="cursor-pointer">
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
            в целях обработки моего обращения и обратной связи по выбранной
            услуге.
          </label>
        </div>

        <div className="flex items-start gap-2 text-[11px] leading-snug text-slate-600">
          <input
            id="service-marketing"
            name="marketingConsent"
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#1D2D44] sm:mt-[3px] sm:h-4 sm:w-4"
          />
          <label htmlFor="service-marketing" className="cursor-pointer">
            Согласен(на) на получение информационных и рекламных сообщений о
            услугах клиники OCTAVA по указанным контактам.
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#1D2D44] px-4 py-2.5 text-sm font-semibold text-[#F3F7FA] shadow-[0_10px_28px_rgba(13,19,33,0.45)] transition hover:bg-[#0D1321] hover:shadow-[0_14px_36px_rgba(13,19,33,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Отправка..." : "Заказать звонок"}
        </button>

        {result && !result.ok && (
          <p className="mt-2 text-[11px] text-red-600">{result.error}</p>
        )}
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h3 className="text-lg font-semibold text-[#0D1321]">
              Заявка отправлена
            </h3>
            <p className="mt-2 text-sm text-slate-700">
              Мы свяжемся с вами в ближайшее время, чтобы уточнить детали.
            </p>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#1D2D44] px-4 py-2 text-sm font-semibold text-[#F3F7FA] shadow-sm transition hover:bg-[#0D1321]"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </>
  );
}

