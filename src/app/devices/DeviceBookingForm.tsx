"use client";

import { useState } from "react";

type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

// тип полезной нагрузки POST /forms/device
type DeviceFormPayload = {
  name: string;
  phone: string;
  message?: string;
  deviceId?: number;
  deviceSlug?: string;
  pdnConsent: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  marketingConsent?: boolean;
};

type SubmitResult = {
  ok: boolean;
  error?: string;
};

type Props = {
  deviceId: number;
  deviceSlug: string;
  utm?: UtmParams;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export default function DeviceBookingForm({
  deviceId,
  deviceSlug,
  utm,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [pdnConsent, setPdnConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

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
      const payload: DeviceFormPayload = {
        name,
        phone,
        pdnConsent: true,
        deviceId,
        deviceSlug,
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

      const res = await fetch(`${API_BASE}/forms/device`, {
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
    <form
      className="mt-5 flex flex-col gap-3"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          htmlFor="device-name"
          className="mb-1 block text-xs font-medium text-slate-700"
        >
          Имя
        </label>
        <input
          id="device-name"
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
          htmlFor="device-phone"
          className="mb-1 block text-xs font-medium text-slate-700"
        >
          Телефон
        </label>
        <input
          id="device-phone"
          name="phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]"
          placeholder="+7 ___ ___-__-__"
        />
      </div>

      <div>
        <label
          htmlFor="device-message"
          className="mb-1 block text-xs font-medium text-slate-700"
        >
          Комментарий (по желанию)
        </label>
        <textarea
          id="device-message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]"
          placeholder="Например: интересует коррекция зоны живота, уточнить противопоказания и курс"
        />
      </div>

      <div className="mt-1 flex items-start gap-2 rounded-xl bg-white px-3 py-3 text-[11px] leading-snug text-slate-700">
        <input
          id="device-pdn"
          name="pdnConsent"
          type="checkbox"
          required
          checked={pdnConsent}
          onChange={(e) => setPdnConsent(e.target.checked)}
          className="mt-[3px] h-3.5 w-3.5 accent-[#1D2D44]"
        />
        <label htmlFor="device-pdn" className="cursor-pointer">
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
          в целях обработки моего обращения и обратной связи по выбранному
          аппарату.
        </label>
      </div>

      <div className="flex items-start gap-2 text-[11px] leading-snug text-slate-600">
        <input
          id="device-marketing"
          name="marketingConsent"
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className="mt-[3px] h-3.5 w-3.5 accent-[#1D2D44]"
        />
        <label htmlFor="device-marketing" className="cursor-pointer">
          Согласен(на) на получение информационных и рекламных сообщений
          о услугах клиники OCTAVA по указанным контактам.
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#1D2D44] px-4 py-2.5 text-sm font-semibold text-[#F3F7FA] shadow-[0_10px_28px_rgba(13,19,33,0.45)] transition hover:bg-[#0D1321] hover:shadow-[0_14px_36px_rgba(13,19,33,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Отправка..." : "Отправить заявку"}
      </button>

      {result && (
        <p
          className={`mt-2 text-[11px] ${
            result.ok ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {result.ok
            ? "Заявка отправлена. Мы свяжемся с вами в ближайшее время."
            : result.error}
        </p>
      )}
    </form>
  );
}
