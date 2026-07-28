// src/lib/media.ts

export function resolveMediaUrl(path: string | null | undefined): string {
  const normalizedPath = path?.trim();
  if (!normalizedPath) return "";
  if (normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")) return normalizedPath;

  const base =
    process.env.NEXT_PUBLIC_ASSET_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "";

  if (!base) {
    return normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
  }

  return `${base.replace(/\/+$/, "")}/${normalizedPath.replace(/^\/+/, "")}`;
}
