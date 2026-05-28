// Tagged-union service result. Services never throw across their boundary —
// they normalize all failures (Supabase errors, network errors, unexpected
// exceptions) into a `{ success: false, error }` shape. Callers narrow on
// `success` and never have to remember which functions throw vs. return.

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function fail(error: string): ServiceResult<never> {
  return { success: false, error };
}

// Narrows an `unknown` thrown value to a human-readable error string without
// using `any`. Supabase errors are plain objects with a string `message`, not
// instances of Error, so we check both shapes.
export function fromError(
  err: unknown,
  fallback = 'Unexpected error'
): ServiceResult<never> {
  if (err instanceof Error) return { success: false, error: err.message };
  if (
    err !== null &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  ) {
    return { success: false, error: (err as { message: string }).message };
  }
  return { success: false, error: fallback };
}
