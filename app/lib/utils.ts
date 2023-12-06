import { CartItem, CheckoutItem, ProductSoldStat } from './definitions';

export function formatIDR(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(num);
}

export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function countSubTotal(items: Array<CheckoutItem>): number {
  return items
    .map((item) => item.price * item.quantity)
    .reduce((prev, current) => prev + current, 0);
}

export function countCartTotal(
  items: Array<CartItem>,
  initialValue: number
): number {
  return items
    .map((item) => item.quantity)
    .reduce((prev, current) => prev + current, initialValue);
}

export function zeroPad(num: number, places: number): string {
  return String(num).padStart(places, '0');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

export function formatDateWithTime(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatMonthAndYearOnly(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: '2-digit',
    month: 'short',
  }).format(date);
}

export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const generateYAxis = (stat: ProductSoldStat[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const topLabel = Math.max(...stat.map((month) => month.total_product_sold));

  for (let i = topLabel; i >= 0; i -= 1) {
    yAxisLabels.push(i);
  }

  return { yAxisLabels, topLabel };
};
