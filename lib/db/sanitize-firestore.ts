/** Firestore rejects documents containing `undefined` field values. */
export function sanitizeFirestoreData<T>(value: T): T {
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeFirestoreData(item)) as T;
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      if (entry !== undefined) {
        result[key] = sanitizeFirestoreData(entry);
      }
    }
    return result as T;
  }

  return value;
}
