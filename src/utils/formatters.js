export function formatCurrency(value, currency = 'USD') {
  const prefix = currency === 'MXN' ? 'MX' : '';
  if (Math.abs(value) >= 1000000) {
    return `${prefix}$${(value / 1000000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `${prefix}$${(value / 1000).toFixed(1)}K`;
  }
  return `${prefix}$${value.toFixed(2)}`;
}

export function formatCurrencyFull(value, currency = 'USD') {
  const prefix = currency === 'MXN' ? 'MX' : '';
  return `${prefix}$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatWeight(lbs) {
  return lbs.toLocaleString('en-US') + ' lbs';
}

export function formatPercent(value, showSign = true) {
  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}

export function formatPricePerLb(value, currency = 'USD') {
  const prefix = currency === 'MXN' ? 'MX' : '';
  return `${prefix}$${value.toFixed(3)}/lb`;
}

export function daysAgo(dateStr) {
  return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
}
