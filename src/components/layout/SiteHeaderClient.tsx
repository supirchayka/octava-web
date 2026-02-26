"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Tenor_Sans } from 'next/font/google'

const tenorSans = Tenor_Sans({
  weight: '400',
  subsets: ['latin'],
})

type SiteHeaderClientProps = {
  phoneDisplay: string | null;
  email: string | null;
  telegramUrl: string | null;
  whatsappUrl: string | null;
  maxMessengerUrl: string | null;
};

export function SiteHeaderClient({
  phoneDisplay,
  email,
  telegramUrl,
  whatsappUrl,
  maxMessengerUrl,
}: SiteHeaderClientProps) {
  const [open, setOpen] = useState(false);

  const normalizedPhone = phoneDisplay?.replace(/[^+\d]/g, "") ?? "";
  const whatsappLink =
    (whatsappUrl && whatsappUrl.trim().length > 0 ? whatsappUrl : null) ??
    (normalizedPhone
      ? `https://wa.me/${normalizedPhone.replace("+", "")}`
      : null);
  const telegramLink =
    telegramUrl && telegramUrl.trim().length > 0 ? telegramUrl : null;
  const maxLink =
    maxMessengerUrl && maxMessengerUrl.trim().length > 0
      ? maxMessengerUrl
      : null;
  const hasMessengerLinks = Boolean(telegramLink || whatsappLink || maxLink);

  return (
    <header className="relative border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Логотип + название (можно дополнить брендингом из SEO) */}
        <div className="flex items-center gap-2">
          <Link href="/">
                        <Image src="/octava-logo.png" alt={"Octava Logo"}
                        className=""
                        width={160}
                        height={40}
                        sizes="(max-width: 40px)"
                        priority />
                  
                    </Link>
          {/*
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1D2D44] text-[#F3F7FA] shadow-lg">
            <span className="text-sm font-semibold">OC</span>
          </div>
          */}
          <div className="flex flex-col">
            <span className="hidden text-2xl font-semibold tracking-wide text-[#0D1321]">
              <span className={tenorSans.className}>OCTAVA</span>
            </span>
          </div>
        </div>

        {/* Навигация — десктоп */}
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link
            href="/"
            className="mr-4 transition-colors hover:text-[#1D2D44]"
          >
            Главная
          </Link>
          <Link
            href="/services"
            className="transition-colors hover:text-[#1D2D44]"
          >
            Услуги
          </Link>
          <Link
            href="/devices"
            className="transition-colors hover:text-[#1D2D44]"
          >
            Аппараты
          </Link>
          <Link
            href="/prices"
            className="transition-colors hover:text-[#1D2D44]"
          >
            Цены
          </Link>
          <Link
            href="/specialists"
            className="transition-colors hover:text-[#1D2D44]"
          >
            Специалисты
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-[#1D2D44]"
          >
            О клинике
          </Link>
          <Link
            href="/contacts"
            className="transition-colors hover:text-[#1D2D44]"
          >
            Контакты
          </Link>
        </nav>

        {/* Мессенджеры — десктоп */}
        {hasMessengerLinks && (
          <div className="hidden items-center gap-3 md:flex">
          {telegramLink && (
          <a
            href={telegramLink}
            aria-label="Telegram"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#0D1321] transition hover:border-[#1D2D44] hover:text-[#1D2D44]"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.994 6.559-1.94 9.149c-.146.646-.525.8-1.064.5l-2.95-2.176-1.423 1.37c-.157.157-.289.289-.59.289l.212-3.02 5.49-4.96c.239-.212-.053-.332-.37-.12l-6.79 4.28-2.922-.916c-.635-.2-.648-.635.133-.94l11.41-4.39c.53-.2.997.12.804.94z" />
            </svg>
          </a>
          )}
          {whatsappLink && (
          <a
            href={whatsappLink}
            aria-label="WhatsApp"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#0D1321] transition hover:border-[#1D2D44] hover:text-[#1D2D44]"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.769.967-.94 1.166-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.01-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.261c.001-5.462 4.445-9.906 9.91-9.906 2.652 0 5.144 1.033 7.022 2.91a9.86 9.86 0 012.912 7.019c-.002 5.462-4.446 9.906-9.91 9.906m8.413-18.319A11.815 11.815 0 0012.05.2C5.495.2.16 5.535.16 12.09c0 2.102.55 4.158 1.597 5.97L.1 23.8l5.904-1.55a11.823 11.823 0 005.99 1.627h.005c6.555 0 11.89-5.335 11.89-11.89a11.815 11.815 0 00-3.425-8.52" />
            </svg>
          </a>
          )}
          {maxLink && (
          <a
            href={maxLink}
            aria-label="Max messenger"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#0D1321] transition hover:border-[#1D2D44] hover:text-[#1D2D44]"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path d="M6 8h12a2 2 0 0 1 2 2v5a3 3 0 0 1-3 3H9l-4 3v-3H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" />
              <path d="M8 11l2 3 2-3 2 3 2-3" />
            </svg>
          </a>
          )}
        </div>
        )}

        {/* Бургер — мобилка */}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Открыть меню"
        >
          <span className="sr-only">Меню</span>
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-4 rounded-full bg-[#0D1321] transition ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-4 rounded-full bg-[#0D1321] transition ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Мобильное меню */}
      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-slate-100 bg-white/95 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-sm">
            <Link
              href="/"
              className="pb-2 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              Главная
            </Link>
            <Link
              href="/specialists"
              className="py-1 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              Специалисты
            </Link>
            <Link
              href="/services"
              className="py-1 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              Услуги
            </Link>
            <Link
              href="/devices"
              className="py-1 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              Аппараты
            </Link>
            <Link
              href="/prices"
              className="py-1 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              Цены
            </Link>
            <Link
              href="/about"
              className="py-1 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              О клинике
            </Link>
            <Link
              href="/contacts"
              className="py-1 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              Контакты
            </Link>

            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-3">
                {telegramLink && (
                <a
                  href={telegramLink}
                  aria-label="Telegram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#0D1321]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.994 6.559-1.94 9.149c-.146.646-.525.8-1.064.5l-2.95-2.176-1.423 1.37c-.157.157-.289.289-.59.289l.212-3.02 5.49-4.96c.239-.212-.053-.332-.37-.12l-6.79 4.28-2.922-.916c-.635-.2-.648-.635.133-.94l11.41-4.39c.53-.2.997.12.804.94z" />
                  </svg>
                </a>
                )}
                {whatsappLink && (
                <a
                  href={whatsappLink}
                  aria-label="WhatsApp"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#0D1321]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.769.967-.94 1.166-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.01-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.261c.001-5.462 4.445-9.906 9.91-9.906 2.652 0 5.144 1.033 7.022 2.91a9.86 9.86 0 012.912 7.019c-.002 5.462-4.446 9.906-9.91 9.906m8.413-18.319A11.815 11.815 0 0012.05.2C5.495.2.16 5.535.16 12.09c0 2.102.55 4.158 1.597 5.97L.1 23.8l5.904-1.55a11.823 11.823 0 005.99 1.627h.005c6.555 0 11.89-5.335 11.89-11.89a11.815 11.815 0 00-3.425-8.52" />
                  </svg>
                </a>
                )}
                {maxLink && (
                <a
                  href={maxLink}
                  aria-label="Max messenger"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#0D1321]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                    className="h-5 w-5"
                  >
                    <path d="M6 8h12a2 2 0 0 1 2 2v5a3 3 0 0 1-3 3H9l-4 3v-3H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" />
                    <path d="M8 11l2 3 2-3 2 3 2-3" />
                  </svg>
                </a>
                )}
              </div>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="text-xs text-slate-600 underline"
                  onClick={() => setOpen(false)}
                >
                  {email}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
