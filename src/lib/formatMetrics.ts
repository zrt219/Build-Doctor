export function formatMetricNumber(value: number) {
  return value.toLocaleString("en-US");
}

export function formatSignedMetric(value: number) {
  if (value > 0) {
    return `+${formatMetricNumber(value)}`;
  }

  return formatMetricNumber(value);
}

export function formatGigabytes(value: number) {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })} GB`;
}

export function formatConfidence(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
