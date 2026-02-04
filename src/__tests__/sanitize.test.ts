import { sanitizeString } from '@/lib/validations/sanitize';

describe('sanitizeString', () => {
  it('escapes HTML', () => {
    expect(sanitizeString('<script>alert(1)</script>')).not.toContain('<');
    expect(sanitizeString('"foo"')).toContain('&quot;');
  });

  it('returns empty for null/undefined', () => {
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
  });

  it('limits length when maxLength provided', () => {
    const long = 'a'.repeat(100);
    expect(sanitizeString(long, 10).length).toBe(10);
  });
});
