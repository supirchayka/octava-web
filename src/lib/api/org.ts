// src/lib/api/org.ts
import { apiGet } from "./client";
import type { Organization, OrganizationSummary } from "@/types/api";

export async function getOrg(): Promise<Organization> {
  return apiGet<Organization>("/org");
}

export async function getOrgSummary(): Promise<OrganizationSummary> {
  return apiGet<OrganizationSummary>("/org/summary");
}
