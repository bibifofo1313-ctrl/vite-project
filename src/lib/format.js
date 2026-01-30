const nisFormatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat('he-IL', {
  maximumFractionDigits: 2
});

export function formatNIS(value) {
  if (!Number.isFinite(value)) {
    return '—';
  }
  return nisFormatter.format(value);
}

export function formatNumber(value, digits = 0) {
  if (!Number.isFinite(value)) {
    return '—';
  }
  return new Intl.NumberFormat('he-IL', {
    maximumFractionDigits: digits
  }).format(value);
}

export function formatPercent(value, digits = 0) {
  if (!Number.isFinite(value)) {
    return '—';
  }
  return `${formatNumber(value, digits)}%`;
}

export function formatMonthYear(date) {
  if (!(date instanceof Date)) {
    return '—';
  }
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long'
  }).format(date);
}

export function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) {
    return value;
  }
  return Math.min(Math.max(value, min), max);
}
