export function formatDownloads(n: number): string {
  if (!Number.isFinite(n) || n <= 0) {
    return "0";
  }

  const count = Math.floor(n);

  if (count < 1_000) {
    return String(count);
  }

  if (count < 1_000_000) {
    const thousands = count / 1_000;
    return thousands >= 10
      ? `${Math.floor(thousands)}K`
      : `${trimTrailingZero(thousands.toFixed(1))}K`;
  }

  const millions = count / 1_000_000;
  return millions >= 10
    ? `${Math.floor(millions)}M`
    : `${trimTrailingZero(millions.toFixed(1))}M`;
}

function trimTrailingZero(value: string): string {
  return value.endsWith(".0") ? value.slice(0, -2) : value;
}
