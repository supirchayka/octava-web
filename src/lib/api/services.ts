// src/lib/api/services.ts
import { apiGet } from "./client";
import type { ServiceDetailResponse } from "@/types/api";

export async function getServiceBySlug(
  slug: string
): Promise<ServiceDetailResponse> {
  return apiGet<ServiceDetailResponse>(`/services/${slug}`, {
    next: { revalidate: 60 },
  });
}
