// src/components/layout/SiteHeader.tsx
import { getOrg } from "@/lib/api/org";
import type { Organization } from "@/types/api";
import { SiteHeaderClient } from "./SiteHeaderClient";

function getPrimaryPhone(org: Organization): string | null {
  const phone = org.phones?.find((p) => p.isPrimary) ?? org.phones?.[0];
  return phone?.number ?? null;
}

export async function SiteHeader() {
  const org = await getOrg();
  const phoneNumber = getPrimaryPhone(org);

  return (
    <SiteHeaderClient
      phoneDisplay={phoneNumber}
      email={org.email}
    />
  );
}
