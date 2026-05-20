// src/components/layout/SiteHeader.tsx
import Image from "next/image";
import Link from "next/link";
import { Tenor_Sans } from "next/font/google";

import { getOrgSummary } from "@/lib/api/org";
import { getContactsPage } from "@/lib/api/pages";
import type { OrganizationSummary } from "@/types/api";
import { SiteMobileMenu } from "./SiteHeaderClient";

const tenorSans = Tenor_Sans({
  weight: "400",
  subsets: ["latin"],
});

type MessengerLinks = {
  telegramLink: string | null;
  whatsappLink: string | null;
  maxLink: string | null;
};

function getPrimaryPhone(org: OrganizationSummary): string | null {
  const phone = org.phones?.find((p) => p.isPrimary) ?? org.phones?.[0];
  return phone?.number ?? null;
}

function buildMessengerLinks({
  phoneDisplay,
  telegramUrl,
  whatsappUrl,
  maxMessengerUrl,
}: {
  phoneDisplay: string | null;
  telegramUrl: string | null;
  whatsappUrl: string | null;
  maxMessengerUrl: string | null;
}): MessengerLinks {
  const normalizedPhone = phoneDisplay?.replace(/[^+\d]/g, "") ?? "";
  const whatsappLink =
    (whatsappUrl && whatsappUrl.trim().length > 0 ? whatsappUrl : null) ??
    (normalizedPhone
      ? `https://wa.me/${normalizedPhone.replace("+", "")}`
      : null);

  return {
    telegramLink:
      telegramUrl && telegramUrl.trim().length > 0 ? telegramUrl : null,
    whatsappLink,
    maxLink:
      maxMessengerUrl && maxMessengerUrl.trim().length > 0
        ? maxMessengerUrl
        : null,
  };
}

function DesktopMessengerLinks({
  telegramLink,
  whatsappLink,
  maxLink,
}: MessengerLinks) {
  if (!telegramLink && !whatsappLink && !maxLink) {
    return null;
  }

  return (
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
          <Image
            src="/mesmax.png"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
            className="h-5 w-5 rounded-sm object-cover"
          />
        </a>
      )}
    </div>
  );
}

export async function SiteHeader() {
  const [contactsResult, orgResult] = await Promise.allSettled([
    getContactsPage(),
    getOrgSummary(),
  ]);

  const contacts =
    contactsResult.status === "fulfilled" ? contactsResult.value.contacts : null;

  const org = orgResult.status === "fulfilled" ? orgResult.value : null;
  const phoneNumber = contacts?.phone ?? (org ? getPrimaryPhone(org) : null);
  const email = contacts?.email ?? org?.email ?? null;
  const links = buildMessengerLinks({
    phoneDisplay: phoneNumber,
    telegramUrl: contacts?.telegramUrl ?? null,
    whatsappUrl: contacts?.whatsappUrl ?? null,
    maxMessengerUrl: contacts?.maxMessengerUrl ?? null,
  });

  return (
    <header className="relative border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/octava-logo.png"
              alt="Octava Logo"
              width={160}
              height={40}
            />
          </Link>
          <div className="flex flex-col">
            <span className="hidden text-2xl font-semibold tracking-wide text-[#0D1321]">
              <span className={tenorSans.className}>OCTAVA</span>
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/" className="mr-4 transition-colors hover:text-[#1D2D44]">
            Главная
          </Link>
          <Link
            href="/services"
            className="transition-colors hover:text-[#1D2D44]"
          >
            Услуги
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

        <DesktopMessengerLinks {...links} />
        <SiteMobileMenu email={email} {...links} />
      </div>
    </header>
  );
}
