import { describe, expect, it } from 'vitest';
import { isUniqueViolation } from './query-violations.js';

describe('isUniqueViolation', () => {
  it('recognizes the MySQL duplicate-entry code', () => {
    expect(isUniqueViolation({ code: 'ER_DUP_ENTRY' })).toBe(true);
  });

  it('recognizes the MySQL duplicate-entry errno', () => {
    expect(isUniqueViolation({ errno: 1062 })).toBe(true);
  });

  it('recognizes a MySQL duplicate-entry error wrapped by Drizzle', () => {
    expect(isUniqueViolation({ cause: { code: 'ER_DUP_ENTRY' } })).toBe(true);
  });

  it('keeps recognizing the existing PostgreSQL unique-violation code', () => {
    expect(isUniqueViolation({ code: '23505' })).toBe(true);
  });

  it('returns false for errors unrelated to unique constraints', () => {
    expect(isUniqueViolation({ code: 'ER_BAD_FIELD_ERROR' })).toBe(false);
  });
});
