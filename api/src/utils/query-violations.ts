type UniqueViolation = {
  code?: '23505' | 'ER_DUP_ENTRY';
  errno?: 1062;
};

export function isUniqueViolation(error: unknown): error is UniqueViolation {
  const visited = new Set<object>();
  let currentError = error;

  while (typeof currentError === 'object' && currentError !== null && !visited.has(currentError)) {
    visited.add(currentError);

    const { code, errno, cause } = currentError as {
      code?: unknown;
      errno?: unknown;
      cause?: unknown;
    };

    if (code === '23505' || code === 'ER_DUP_ENTRY' || errno === 1062) {
      return true;
    }

    currentError = cause;
  }

  return false;
}
