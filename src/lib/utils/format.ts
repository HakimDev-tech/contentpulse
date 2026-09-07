export function formatNumber(
  value: number,
  decimals = 0,
): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatScore(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return `${Math.round(value)}/100`;
}

export function formatPercentage(
  value: number,
  decimals = 0,
): string {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${value.toFixed(decimals)}%`;
}

export function formatDate(
  date: string | Date | number,
): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

export function formatDateTime(
  date: string | Date | number,
): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

export function truncateText(
  text: string,
  maxLength: number,
): string {
  const normalized = text.trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(
    0,
    Math.max(0, maxLength - 3),
  )}...`;
}

export function capitalize(
  value: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    return "";
  }

  return (
    normalized.charAt(0).toUpperCase() +
    normalized.slice(1)
  );
}

export function formatLabel(
  value: string,
): string {
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map(capitalize)
    .join(" ");
}