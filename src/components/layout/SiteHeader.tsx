// src/components/layout/SiteHeader.tsx
import { getOrg } from "@/lib/api/org";
import type { Organization } from "@/types/api";
import { SiteHeaderClient } from "./SiteHeaderClient";

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

export async function SiteHeader() {
  const org = await getOrg();
  const phoneNumber = getPrimaryPhone(org);
  const phoneHref = buildTelHref(phoneNumber);

  return (
    <SiteHeaderClient
      phoneDisplay={phoneNumber}
      phoneHref={phoneHref}
      email={org.email}
      orgName={org.fullName}
    />
  );
}
