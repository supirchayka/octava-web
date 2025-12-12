// src/lib/api/org.ts
import { apiGet } from "./client";
import type { Organization } from "@/types/api";

export async function getOrg(): Promise<Organization> {
  return apiGet<Organization>("/org", {
    next: { revalidate: 3600 }, // час кэш, можно поменять
  });
}
