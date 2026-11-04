/**
 * Extract a standard base64 token from a Basic authorization header.
 */
export function parseBasic(value: string): string | undefined {
  const match = BASIC_REGEXP.exec(value);
  if (!match) return undefined;

  const encoded = match[1];
  const length = encoded.length;
  if (
    length % 4 === 1 ||
    (encoded.charCodeAt(length - 1) === 61 && length % 4 !== 0)
  ) {
    return undefined;
  }

  return encoded;
}

// Bound padding to avoid scanning arbitrarily long runs of '='.
const BASIC_REGEXP = /^ *Basic +([a-z0-9+/]+={0,2}) *$/i;
