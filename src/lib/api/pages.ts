// src/lib/api/pages.ts
import { apiGet } from "./client";
import type { HomePageResponse } from "@/types/api";

export async function getHomePage(): Promise<HomePageResponse> {
  return apiGet<HomePageResponse>("/pages/home", {
    next: { revalidate: 60 },
  });
}
