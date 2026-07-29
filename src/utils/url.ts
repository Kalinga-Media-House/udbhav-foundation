/**
 * Safely constructs a URL with query parameters.
 */
export const constructUrl = (baseUrl: string, params: Record<string, string | number | boolean | undefined>): string => {
  const url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  
  // If we used localhost as a fallback but the baseUrl was just a path, return pathname + search
  if (!baseUrl.startsWith('http') && url.origin === 'http://localhost') {
    return url.pathname + url.search;
  }
  
  return url.toString();
};
