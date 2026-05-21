export function formatWebsiteLabel(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const normalized = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    const { hostname } = new URL(normalized);
    return hostname.replace(/^www\./i, "");
  } catch {
    return trimmed.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
  }
}
