import { apiGet, PUBLIC_API_REVALIDATE_SECONDS } from "./client";
import type { Specialist } from "@/types/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export async function getSpecialists(): Promise<Specialist[]> {
  return apiGet<Specialist[]>("/specialists");
}

export async function getSpecialistById(
  id: number,
): Promise<Specialist | null> {
  const res = await fetch(`${API_BASE}/specialists/${id}`, {
    next: { revalidate: PUBLIC_API_REVALIDATE_SECONDS },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`API GET /specialists/${id} failed with status ${res.status}`);
  }

  return res.json() as Promise<Specialist>;
}
