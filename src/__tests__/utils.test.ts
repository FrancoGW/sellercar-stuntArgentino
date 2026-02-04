import { formatPrice, getExpirationStatus } from '@/lib/utils';

describe('formatPrice', () => {
  it('formats number as ARS currency', () => {
    expect(formatPrice(1500000)).toMatch(/\d[\d.,]*/);
    expect(formatPrice(0)).toMatch(/0/);
  });
});

describe('getExpirationStatus', () => {
  it('returns null for null/undefined', () => {
    expect(getExpirationStatus(null)).toBeNull();
    expect(getExpirationStatus(undefined)).toBeNull();
  });

  it('returns error for past date', () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    expect(getExpirationStatus(past)).toBe('error');
  });

  it('returns warning for date within 30 days', () => {
    const soon = new Date();
    soon.setDate(soon.getDate() + 15);
    expect(getExpirationStatus(soon)).toBe('warning');
  });

  it('returns ok for date after 30 days', () => {
    const later = new Date();
    later.setDate(later.getDate() + 60);
    expect(getExpirationStatus(later)).toBe('ok');
  });
});
