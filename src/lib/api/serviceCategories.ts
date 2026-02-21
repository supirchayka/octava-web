// src/lib/api/serviceCategories.ts
import { apiGet } from "./client";
import type { ServiceCategory, ServiceCategoryDetails } from "@/types/api";

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  return apiGet<ServiceCategory[]>("/service-categories");
}

export async function getServiceCategoriesByGender(
  gender: "female" | "male"
): Promise<ServiceCategory[]> {
  return apiGet<ServiceCategory[]>(`/service-categories/${gender}`);
}

export async function getServiceCategoryBySlug(
  slug: string
): Promise<ServiceCategoryDetails> {
  return apiGet<ServiceCategoryDetails>(`/service-categories/${slug}`);
}
