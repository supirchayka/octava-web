// src/lib/api/pages.ts
import { apiGet } from "./client";
import type { AboutPageResponse } from "@/types/about";
import type { ContactsPageResponse, HomePageResponse, PricesPageResponse, ServicesPageResponse } from "@/types/api";

export async function getHomePage(): Promise<HomePageResponse> {
  return apiGet<HomePageResponse>("/pages/home", { cache: "no-store" });
}

export async function getAboutPage(): Promise<AboutPageResponse> {
  return apiGet<AboutPageResponse>("/pages/about");
}

export async function getContactsPage(): Promise<ContactsPageResponse> {
  return apiGet<ContactsPageResponse>("/pages/contacts");
}

export async function getServicesPage(): Promise<ServicesPageResponse> {
  return apiGet<ServicesPageResponse>("/pages/services");
}

export async function getPricesPage(): Promise<PricesPageResponse> {
  return apiGet<PricesPageResponse>("/pages/prices");
}
