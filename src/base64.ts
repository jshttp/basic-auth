export const base64 = (() => {
  if (typeof Buffer !== 'undefined') {
    return {
      encode: (str: string) => Buffer.from(str, 'utf-8').toString('base64'),
      decode: (str: string) => Buffer.from(str, 'base64').toString('utf-8'),
    };
  }

  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();

  return {
    encode: (str: string) => {
      const bytes = textEncoder.encode(str);
      return bytes.toBase64();
    },
    decode: (str: string) => {
      const bytes = Uint8Array.fromBase64(str);
      return textDecoder.decode(bytes);
    },
  };
})();
