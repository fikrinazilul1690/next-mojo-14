import { CartItem, CheckoutItem } from './definitions';

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
