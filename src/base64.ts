type Uint8ArrayWithBase64 = typeof Uint8Array & {
  fromBase64?: (str: string) => Uint8Array;
};

type Uint8ArrayInstanceWithBase64 = Uint8Array & {
  toBase64?: () => string;
};

type BufferLike = {
  from(
    input: string,
    encoding: 'base64' | 'utf-8',
  ): { toString(encoding: 'utf-8' | 'base64'): string };
};

const NodeBuffer = (globalThis as any).Buffer as BufferLike | undefined;
const uint8ArrayPrototype =
  Uint8Array.prototype as Uint8ArrayInstanceWithBase64;

const textDecoder = new TextDecoder('utf-8');
const textEncoder = new TextEncoder();

/**
 * Decode base64 string.
 * @private
 */
export const decodeBase64: (str: string) => string = (() => {
  // 1) Node.js (fast path)
  if (typeof NodeBuffer?.from === 'function') {
    return (str: string) => NodeBuffer.from(str, 'base64').toString('utf-8');
  }

  // 2) Modern Web / some runtimes
  if (typeof (Uint8Array as Uint8ArrayWithBase64).fromBase64 === 'function') {
    return (str: string) =>
      textDecoder.decode((Uint8Array as Uint8ArrayWithBase64).fromBase64!(str));
  }

  // 3) Browser fallback
  return (str: string) => {
    const binary = atob(str);
    return textDecoder.decode(
      Uint8Array.from(binary, (char) => char.charCodeAt(0)),
    );
  };
})();

/**
 * Encode string to base64.
 * @private
 */
export const encodeBase64: (str: string) => string = (() => {
  // 1) Node.js (fast path)
  if (typeof NodeBuffer?.from === 'function') {
    return (str: string) => NodeBuffer.from(str, 'utf-8').toString('base64');
  }

  // 2) Modern Web / some runtimes
  if (typeof uint8ArrayPrototype.toBase64 === 'function') {
    return (str: string) =>
      (textEncoder.encode(str) as Uint8ArrayInstanceWithBase64).toBase64!();
  }

  // 3) Browser fallback
  return (str: string) => {
    const bytes = textEncoder.encode(str);
    let binary = '';

    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  };
})();
