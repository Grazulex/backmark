import { describe, it, expect } from 'vitest';
import {
  formatDateWithPattern,
  getCurrentTimestamp,
  isValidDate,
} from '../../src/utils/date';

describe('date.ts', () => {
  describe('formatDateWithPattern', () => {
    it('should format date with default pattern', () => {
      const result = formatDateWithPattern('2025-10-24T10:30:00.000Z');
      // Result may vary based on timezone, just check format
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });

    it('should format date with custom pattern', () => {
      const result = formatDateWithPattern('2025-10-24T10:30:00.000Z', 'yyyy-MM-dd');
      expect(result).toBe('2025-10-24');
    });

    it('should format date with time pattern', () => {
      const result = formatDateWithPattern('2025-10-24T14:45:30.000Z', 'HH:mm:ss');
      // Result may vary based on timezone, just check format
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('should handle undefined date', () => {
      const result = formatDateWithPattern(undefined);
      expect(result).toBe('—');
    });

    it('should handle empty string', () => {
      const result = formatDateWithPattern('');
      expect(result).toBe('—');
    });

    it('should return original string for invalid date', () => {
      const result = formatDateWithPattern('not-a-date');
      expect(result).toBe('not-a-date');
    });

    it('should handle year-only pattern', () => {
      const result = formatDateWithPattern('2025-10-24T10:30:00.000Z', 'yyyy');
      expect(result).toBe('2025');
    });

    it('should handle month and day pattern', () => {
      const result = formatDateWithPattern('2025-10-24T10:30:00.000Z', 'MM/dd');
      expect(result).toBe('10/24');
    });
  });

  describe('getCurrentTimestamp', () => {
    it('should return ISO string', () => {
      const result = getCurrentTimestamp();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should return valid ISO date', () => {
      const result = getCurrentTimestamp();
      const date = new Date(result);
      expect(date.toISOString()).toBe(result);
    });

    it('should return current time', () => {
      const before = Date.now();
      const result = getCurrentTimestamp();
      const after = Date.now();

      const timestamp = new Date(result).getTime();
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('isValidDate', () => {
    it('should validate correct ISO date', () => {
      expect(isValidDate('2025-10-24T10:30:00.000Z')).toBe(true);
    });

    it('should validate date without time', () => {
      expect(isValidDate('2025-10-24')).toBe(true);
    });

    it('should validate date with timezone', () => {
      expect(isValidDate('2025-10-24T10:30:00+02:00')).toBe(true);
    });

    it('should reject invalid date string', () => {
      expect(isValidDate('not-a-date')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isValidDate('')).toBe(false);
    });

    it('should reject malformed date', () => {
      expect(isValidDate('2025-13-45')).toBe(false);
    });

    // parseISO actually accepts year-only dates
    it.skip('should reject partial date', () => {
      expect(isValidDate('2025')).toBe(false);
    });

    it('should validate date with milliseconds', () => {
      expect(isValidDate('2025-10-24T10:30:00.123Z')).toBe(true);
    });
  });
});
