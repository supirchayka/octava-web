// src/components/layout/SiteFooter.tsx

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white pb-6 pt-8 text-sm text-slate-600">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            OCTAVA
          </p>
          <p className="mt-2 text-sm text-[#0D1321]">
            Антивозрастная и эстетическая медицина.
          </p>
        </div>

        <div className="grid flex-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Навигация
            </p>
            <ul className="space-y-1">
              <li>
                <a href="/" className="hover:text-[#1D2D44]">
                  Главная
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-[#1D2D44]">
                  Услуги
                </a>
              </li>
              <li>
                <a href="/devices" className="hover:text-[#1D2D44]">
                  Аппараты
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#1D2D44]">
                  О клинике
                </a>
              </li>
              <li>
                <a href="/contacts" className="hover:text-[#1D2D44]">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Контакты
            </p>
            <ul className="space-y-1">
              <li>
                Телефон:{" "}
                <a href="tel:+79999999999" className="hover:text-[#1D2D44]">
                  +7&nbsp;999&nbsp;999-99-99
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:info@example.com"
                  className="hover:text-[#1D2D44]"
                >
                  info@example.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Документы
            </p>
            <ul className="space-y-1">
              <li>
                <a href="/personal-data-consent" className="hover:text-[#1D2D44]">
                  Согласие на обработку персональных данных
                </a>
              </li>
              <li>
                <a
                  href="/personal-data-policy"
                  className="hover:text-[#1D2D44]"
                >
                  Политика обработки персональных данных
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-6xl flex-col items-start justify-between gap-2 px-4 text-xs text-slate-400 md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} OCTAVA</span>
        <span>
          Не является публичной офертой. Есть противопоказания, требуется
          консультация специалиста.
        </span>
      </div>
    </footer>
  );
}
