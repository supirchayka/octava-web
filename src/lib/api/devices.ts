// src/lib/api/devices.ts
import type { DeviceListItem, DeviceDetailResponse } from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export async function getDevices(): Promise<DeviceListItem[]> {
  const res = await fetch(`${API_BASE}/devices`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API GET /devices failed with status ${res.status}`);
  }

  const data = (await res.json()) as DeviceListItem[] | null;
  return Array.isArray(data) ? data : [];
}

/**
 * Возвращает детальную инфу по аппарату или null, если бекэнд дал 404.
 */
export async function getDeviceBySlug(
  slug: string
): Promise<DeviceDetailResponse | null> {
  const res = await fetch(`${API_BASE}/devices/${slug}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(
      `API GET /devices/${slug} failed with status ${res.status}`
    );
  }

  const data = (await res.json()) as DeviceDetailResponse;
  // подстраховка: заполняем отсутствующие массивы
  return {
    ...data,
    galleryImages: data.galleryImages ?? [],
    inlineImages: data.inlineImages ?? [],
    attachments: data.attachments ?? [],
    indications: data.indications ?? [],
    contraindications: data.contraindications ?? [],
    sideEffects: data.sideEffects ?? [],
    documents: data.documents ?? [],
    faq: data.faq ?? [],
    services: data.services ?? [],
  };
}
