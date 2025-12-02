// src/lib/api/client.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

type ApiInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

export async function apiGet<T>(path: string, init?: ApiInit): Promise<T> {
  const url = API_BASE_URL + path;

  const res = await fetch(url, {
    next: { revalidate: 60, ...(init?.next ?? {}) },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("API error", res.status, text);
    throw new Error(`API GET ${path} failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}
