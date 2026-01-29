// src/lib/api/servicePrices.ts
import { apiGet } from "./client";
import type { ServicePriceCategory } from "@/types/api";

export async function getServicePrices(
  gender: "female" | "male"
): Promise<ServicePriceCategory[]> {
  return apiGet<ServicePriceCategory[]>(`/services/prices/${gender}`, {
    next: { revalidate: 60 },
  });
}
