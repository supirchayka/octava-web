// src/lib/api/serviceCategories.ts
import { apiGet } from "./client";
import type { ServiceCategory, ServiceCategoryDetails } from "@/types/api";

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  return apiGet<ServiceCategory[]>("/service-categories", {
    next: { revalidate: 60 },
  });
}

export async function getServiceCategoryBySlug(
  slug: string
): Promise<ServiceCategoryDetails> {
  return apiGet<ServiceCategoryDetails>(`/service-categories/${slug}`, {
    next: { revalidate: 60 },
  });
}
