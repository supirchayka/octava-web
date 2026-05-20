// src/lib/api/client.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

type ApiGetInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export const PUBLIC_API_REVALIDATE_SECONDS = 300;

export async function apiGet<T>(path: string, init?: ApiGetInit): Promise<T> {
  const url = API_BASE_URL + path;
  const hasCachePolicy = Boolean(init?.cache || init?.next);

  const res = await fetch(url, {
    ...init,
    ...(hasCachePolicy
      ? {}
      : { next: { revalidate: PUBLIC_API_REVALIDATE_SECONDS } }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("API error", res.status, text);
    throw new Error(`API GET ${path} failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}
