export function clamp(
  value: number,
  min = 0,
  max = 100,
): number {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

export function average(
  values: number[],
): number {
  if (values.length === 0) {
    return 0;
  }

  const validValues = values.filter(
    (value) => Number.isFinite(value),
  );

  if (validValues.length === 0) {
    return 0;
  }

  return (
    validValues.reduce(
      (sum, value) => sum + value,
      0,
    ) / validValues.length
  );
}

export function round(
  value: number,
  decimals = 0,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = 10 ** decimals;

  return (
    Math.round(value * factor) / factor
  );
}

export function normalizeScore(
  value: number,
  min = 0,
  max = 100,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (max <= min) {
    return 0;
  }

  const normalized =
    ((value - min) / (max - min)) * 100;

  return clamp(normalized);
}

export function sortByNumber<T>(
  items: T[],
  getValue: (item: T) => number,
  direction: "asc" | "desc" = "desc",
): T[] {
  return [...items].sort((a, b) => {
    const aValue = getValue(a);
    const bValue = getValue(b);

    return direction === "asc"
      ? aValue - bValue
      : bValue - aValue;
  });
}

export function unique<T>(
  items: T[],
): T[] {
  return Array.from(new Set(items));
}

export function uniqueBy<T, K>(
  items: T[],
  getKey: (item: T) => K,
): T[] {
  const seen = new Set<K>();

  return items.filter((item) => {
    const key = getKey(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
}

export function groupBy<T, K>(
  items: T[],
  getKey: (item: T) => K,
): Map<K, T[]> {
  const groups = new Map<K, T[]>();

  for (const item of items) {
    const key = getKey(item);
    const existing = groups.get(key);

    if (existing) {
      existing.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  return groups;
}

export function isDefined<T>(
  value: T | null | undefined,
): value is T {
  return value !== null && value !== undefined;
}

export function sleep(
  milliseconds: number,
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function generateId(
  prefix = "id",
): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}