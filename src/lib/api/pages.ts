// src/lib/api/pages.ts
import { apiGet } from "./client";
import type { AboutPageResponse } from "@/types/about";
import type { HomePageResponse } from "@/types/api";

export async function getHomePage(): Promise<HomePageResponse> {
  return apiGet<HomePageResponse>("/pages/home");
}

export async function getAboutPage(): Promise<AboutPageResponse> {
  return apiGet<AboutPageResponse>("/pages/about");
}
