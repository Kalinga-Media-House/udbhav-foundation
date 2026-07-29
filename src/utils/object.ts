/**
 * Deep clones an object using native structuredClone if available, 
 * falling back to JSON.parse/stringify.
 */
export const deepClone = <T>(obj: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Checks if an object is strictly empty (no keys).
 */
export const isEmptyObject = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0;
};
