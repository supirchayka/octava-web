"use client";

import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Логотип + название (здесь можно потом взять из /org или seo) */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1D2D44] text-[#F3F7FA] shadow-lg">
            <span className="text-sm font-semibold">OC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-[#0D1321]">
              Клиника OCTAVA
            </span>
            <span className="text-xs text-slate-500">
              Антивозрастная и эстетическая медицина
            </span>
          </div>
        </div>

        {/* Навигация — десктоп */}
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <a href="/" className="transition-colors hover:text-[#1D2D44]">
            Главная
          </a>
          <a href="/services" className="transition-colors hover:text-[#1D2D44]">
            Услуги
          </a>
          <a href="/devices" className="transition-colors hover:text-[#1D2D44]">
            Аппараты
          </a>
          <a href="/about" className="transition-colors hover:text-[#1D2D44]">
            О клинике
          </a>
          <a href="/contacts" className="transition-colors hover:text-[#1D2D44]">
            Контакты
          </a>
        </nav>

        {/* Телефон + CTA — десктоп */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href="tel:+79999999999"
            className="text-sm font-medium text-[#0D1321]"
          >
            +7&nbsp;999&nbsp;999-99-99
          </a>
          <a
            href="/contacts"
            className="rounded-full bg-[#1D2D44] px-4 py-2 text-sm font-medium text-[#F3F7FA] shadow-lg transition hover:bg-[#0D1321]"
          >
            Записаться
          </a>
        </div>

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
            <a
              href="/"
              className="py-1 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              Главная
            </a>
            <a
              href="/services"
              className="py-1 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              Услуги
            </a>
            <a
              href="/devices"
              className="py-1 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              Аппараты
            </a>
            <a
              href="/about"
              className="py-1 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              О клинике
            </a>
            <a
              href="/contacts"
              className="py-1 text-[#0D1321]"
              onClick={() => setOpen(false)}
            >
              Контакты
            </a>

            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <a
                href="tel:+79999999999"
                className="text-sm font-medium text-[#0D1321]"
              >
                +7&nbsp;999&nbsp;999-99-99
              </a>
              <a
                href="/contacts"
                className="inline-flex items-center justify-center rounded-full bg-[#1D2D44] px-4 py-2 text-sm font-medium text-[#F3F7FA] shadow-lg"
                onClick={() => setOpen(false)}
              >
                Записаться
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
