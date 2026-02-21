import { apiGet } from "./client";
import type { Specialist } from "@/types/api";

export async function getSpecialists(): Promise<Specialist[]> {
  return apiGet<Specialist[]>("/specialists");
}
