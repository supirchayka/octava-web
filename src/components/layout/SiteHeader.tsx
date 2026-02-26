// src/components/layout/SiteHeader.tsx
import { getOrg } from "@/lib/api/org";
import { getContactsPage } from "@/lib/api/pages";
import type { Organization } from "@/types/api";
import { SiteHeaderClient } from "./SiteHeaderClient";

function getPrimaryPhone(org: Organization): string | null {
  const phone = org.phones?.find((p) => p.isPrimary) ?? org.phones?.[0];
  return phone?.number ?? null;
}

export async function SiteHeader() {
  const [contactsResult, orgResult] = await Promise.allSettled([
    getContactsPage(),
    getOrg(),
  ]);

  const contacts =
    contactsResult.status === "fulfilled" ? contactsResult.value.contacts : null;

  const org = orgResult.status === "fulfilled" ? orgResult.value : null;
  const phoneNumber = contacts?.phone ?? (org ? getPrimaryPhone(org) : null);
  const email = contacts?.email ?? org?.email ?? null;

  return (
    <SiteHeaderClient
      phoneDisplay={phoneNumber}
      email={email}
      telegramUrl={contacts?.telegramUrl ?? null}
      whatsappUrl={contacts?.whatsappUrl ?? null}
      maxMessengerUrl={contacts?.maxMessengerUrl ?? null}
    />
  );
}
