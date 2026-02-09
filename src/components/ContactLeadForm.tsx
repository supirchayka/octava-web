"use client";

import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type ContactFormPayload = {
  name: string;
  phone: string;
  message?: string;
  pagePath: string;
  pdnConsent: boolean;
  marketingConsent?: boolean;
  serviceSlug?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

type SubmitResult = {
  ok: boolean;
  error?: string;
};

type Props = {
  serviceSlug?: string;
  variant?: "light" | "dark";
  operatorNote?: string | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export function ContactLeadForm({
  serviceSlug,
  variant = "light",
  operatorNote = "Оператор персональных данных – Клиника OCTAVA.",
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const utm = useMemo(() => {
    if (!searchParams) return {};
    return {
      utm_source: searchParams.get("utm_source") ?? undefined,
      utm_medium: searchParams.get("utm_medium") ?? undefined,
      utm_campaign: searchParams.get("utm_campaign") ?? undefined,
      utm_content: searchParams.get("utm_content") ?? undefined,
      utm_term: searchParams.get("utm_term") ?? undefined,
    };
  }, [searchParams]);

  const pagePath = useMemo(() => pathname ?? "", [pathname]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [pdnConsent, setPdnConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    setIsSubmitting(true);
    try {
      const payload: ContactFormPayload = {
        name,
        phone,
        pdnConsent: true,
        pagePath,
      };

      if (serviceSlug?.trim()) {
        payload.serviceSlug = serviceSlug.trim();
      }

      if (message.trim()) {
        payload.message = message.trim();
      }

      if (marketingConsent) {
        payload.marketingConsent = true;
      }

      if (utm.utm_source) payload.utm_source = utm.utm_source;
      if (utm.utm_medium) payload.utm_medium = utm.utm_medium;
      if (utm.utm_campaign) payload.utm_campaign = utm.utm_campaign;
      if (utm.utm_content) payload.utm_content = utm.utm_content;
      if (utm.utm_term) payload.utm_term = utm.utm_term;

      const res = await fetch(`${API_BASE}/forms/contact`, {
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
            setPhone("");
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

  const isDark = variant === "dark";

  return (
    <>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {serviceSlug?.trim() ? (
          <input type="hidden" name="serviceSlug" value={serviceSlug} />
        ) : null}

        <div>
          <label
            htmlFor="contact-name"
            className={`mb-1 block text-xs font-medium ${
              isDark ? "text-[#F3F7FA]/80" : "text-slate-700"
            }`}
          >
            Имя
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-1 ${
              isDark
                ? "border-[#F3F7FA]/20 bg-[#0D1321]/20 text-[#F3F7FA] placeholder:text-[#F3F7FA]/60 focus:border-[#F3F7FA] focus:bg-[#0D1321]/30"
                : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#1D2D44] focus:ring-[#1D2D44]"
            }`}
            placeholder="Как к вам обращаться"
          />
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className={`mb-1 block text-xs font-medium ${
              isDark ? "text-[#F3F7FA]/80" : "text-slate-700"
            }`}
          >
            Телефон
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-1 ${
              isDark
                ? "border-[#F3F7FA]/20 bg-[#0D1321]/20 text-[#F3F7FA] placeholder:text-[#F3F7FA]/60 focus:border-[#F3F7FA] focus:bg-[#0D1321]/30"
                : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#1D2D44] focus:ring-[#1D2D44]"
            }`}
            placeholder="+7 ___ ___-__-__"
          />
        </div>

        <div>
          <label
            htmlFor="contact-comment"
            className={`mb-1 block text-xs font-medium ${
              isDark ? "text-[#F3F7FA]/80" : "text-slate-700"
            }`}
          >
            Комментарий (по желанию)
          </label>
          <textarea
            id="contact-comment"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-1 ${
              isDark
                ? "border-[#F3F7FA]/20 bg-[#0D1321]/20 text-[#F3F7FA] placeholder:text-[#F3F7FA]/60 focus:border-[#F3F7FA] focus:bg-[#0D1321]/30"
                : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#1D2D44] focus:ring-[#1D2D44]"
            }`}
            placeholder="Кратко опишите вопрос (без указания подробных медицинских данных)"
          />
        </div>

        <div
          className={`mt-1 flex items-start gap-2 rounded-xl px-3 py-3 text-[11px] leading-snug ${
            isDark
              ? "bg-[#0D1321]/30 text-[#F3F7FA]/80"
              : "bg-white text-slate-700"
          }`}
        >
          <input
            id="contact-pdn"
            name="pdnConsent"
            type="checkbox"
            required
            checked={pdnConsent}
            onChange={(e) => setPdnConsent(e.target.checked)}
            className={`mt-0.5 h-5 w-5 shrink-0 sm:mt-[3px] sm:h-4 sm:w-4 ${
              isDark ? "accent-[#F3F7FA]" : "accent-[#1D2D44]"
            }`}
          />
          <label htmlFor="contact-pdn" className="cursor-pointer">
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

        <div
          className={`flex items-start gap-2 text-[11px] leading-snug ${
            isDark ? "text-[#F3F7FA]/70" : "text-slate-600"
          }`}
        >
          <input
            id="contact-marketing"
            name="marketingConsent"
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className={`mt-0.5 h-5 w-5 shrink-0 sm:mt-[3px] sm:h-4 sm:w-4 ${
              isDark ? "accent-[#F3F7FA]" : "accent-[#1D2D44]"
            }`}
          />
          <label htmlFor="contact-marketing" className="cursor-pointer">
            Согласен(на) на получение информационных и рекламных сообщений о
            услугах клиники OCTAVA по указанным контактам.
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isDark
              ? "bg-[#F3F7FA] text-[#1D2D44] hover:bg-white"
              : "bg-[#1D2D44] text-[#F3F7FA] shadow-[0_10px_28px_rgba(13,19,33,0.45)] hover:bg-[#0D1321] hover:shadow-[0_14px_36px_rgba(13,19,33,0.6)]"
          }`}
        >
          {isSubmitting ? "Отправка..." : "Отправить заявку"}
        </button>

        {result && !result.ok && (
          <p
            className={`mt-2 text-[11px] ${
              isDark ? "text-red-200" : "text-red-600"
            }`}
          >
            {result.error}
          </p>
        )}

        {operatorNote && (
          <p
            className={`mt-1 text-[11px] leading-snug ${
              isDark ? "text-[#F3F7FA]/60" : "text-slate-500"
            }`}
          >
            {operatorNote}
          </p>
        )}
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h3 className="text-lg font-semibold text-[#0D1321]">
              Заявка отправлена
            </h3>
            <p className="mt-2 text-sm text-slate-700">
              Спасибо! Мы свяжемся с вами по указанным контактам.
            </p>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#1D2D44] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0D1321]"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}

