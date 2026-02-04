import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind sin conflictos (cn = class names).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formatea precio para mostrar (alto contraste en UI).
 */
export function formatPrice(value: number, currency = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Estado de vencimiento: ok (verde), warning (amarillo), error (rojo).
 */
export type ExpirationStatus = 'ok' | 'warning' | 'error';

export function getExpirationStatus(
  expiresAt: Date | string | null
): ExpirationStatus | null {
  if (!expiresAt) return null;
  const exp = new Date(expiresAt);
  const now = new Date();
  const daysUntil = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil < 0) return 'error';
  if (daysUntil <= 7) return 'warning';
  return 'ok';
}

/** Días restantes hasta la fecha (negativo si ya venció). */
export function getDaysRemaining(expiresAt: Date | string | null): number | null {
  if (!expiresAt) return null;
  const exp = new Date(expiresAt);
  const now = new Date();
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-AR').format(n);
}

/**
 * Arma la URL de WhatsApp para Argentina.
 * Acepta número con o sin 54, con espacios/guiones; devuelve solo dígitos para wa.me.
 */
export function whatsappUrl(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, '');
  const withCountry = digits.startsWith('54') ? digits : `54${digits}`;
  const base = `https://wa.me/${withCountry}`;
  if (!text?.trim()) return base;
  return `${base}?text=${encodeURIComponent(text.trim())}`;
}
