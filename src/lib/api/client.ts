// src/lib/api/client.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = API_BASE_URL + path;

  const res = await fetch(url, {
    ...init,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("API error", res.status, text);
    throw new Error(`API GET ${path} failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}
