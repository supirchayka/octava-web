// src/components/layout/SiteFooter.tsx
import Image from "next/image";
import { Tenor_Sans } from 'next/font/google'

import Link from "next/link";

import { getOrg } from "@/lib/api/org";
import type { Organization } from "@/types/api";

const tenorSans = Tenor_Sans({
  weight: '400',
  subsets: ['latin'],
})


function getPrimaryPhone(org: Organization): string | null {
  const phone = org.phones?.find((p) => p.isPrimary) ?? org.phones?.[0];
  return phone?.number ?? null;
}

function buildTelHref(phone: string | null): string | null {
  if (!phone) return null;
  const normalized = phone.replace(/[^+\d]/g, "");
  if (!normalized) return null;
  return `tel:${normalized}`;
}

export async function SiteFooter() {
  const org = await getOrg();
  const phoneNumber = getPrimaryPhone(org);
  const phoneHref = buildTelHref(phoneNumber);

  return (
    <footer className="mt-16 border-t border-slate-100 bg-white pb-6 pt-8 text-sm text-slate-600">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
                    <Image src="/octava-logo.png" alt={"Octava Logo"}
                    className=""
                    width={160}
                    height={40}
                    sizes="(max-width: 40px)"
                    priority />
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
                <Link href="/" className="hover:text-[#1D2D44]">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#1D2D44]">
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="/devices" className="hover:text-[#1D2D44]">
                  Аппараты
                </Link>
              </li>
              <li>
                <Link href="/prices" className="hover:text-[#1D2D44]">
                  Цены
                </Link>
              </li>
              <li>
                <Link href="/specialists" className="hover:text-[#1D2D44]">
                  Специалисты
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#1D2D44]">
                  О клинике
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-[#1D2D44]">
                  Контакты
                </Link>
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
                {phoneHref ? (
                  <a href={phoneHref} className="hover:text-[#1D2D44]">
                    {phoneNumber}
                  </a>
                ) : (
                  <span>{phoneNumber ?? "—"}</span>
                )}
              </li>
              <li>
                Email:{" "}
                <a href={`mailto:${org.email}`} className="hover:text-[#1D2D44]">
                  {org.email}
                </a>
              </li>
              <li>
                Адрес:{" "}
                <span>{org.address}</span>
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
                <a href="/personal-data-policy" className="hover:text-[#1D2D44]">
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
