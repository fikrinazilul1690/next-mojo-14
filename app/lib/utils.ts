export function formatIDR(
  num: number,
  config?: { maximumSignificantDigits: number }
): string {
  return new Intl.NumberFormat('id-ID', {
    ...config,
    style: 'currency',
    currency: 'IDR',
  }).format(num);
}

export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
