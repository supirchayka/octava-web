// src/lib/media.ts

export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base =
    process.env.NEXT_PUBLIC_ASSET_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "";

  if (!base) return path; // на крайний случай — отдаём как есть "/uploads/..."

  return `${base}${path}`;
}
