import { utf8fromString, utf8toString } from '@exodus/bytes/utf8.js';
import { fromBase64, toBase64 } from '@exodus/bytes/base64.js';
import base64js = require('base64-js');
import { describe, bench } from 'vitest';

const hasBufferSupport = typeof (globalThis as any).Buffer !== 'undefined';
const Buffer = (globalThis as any).Buffer;

const hasUint8ArrayBase64Support =
  typeof (Uint8Array as any).fromBase64 === 'function' &&
  typeof (Uint8Array.prototype as any).toBase64 === 'function';

const textDecoder = new (globalThis as any).TextDecoder('utf-8', {
  fatal: true,
  ignoreBOM: true,
});
const textEncoder = new (globalThis as any).TextEncoder('utf-8');

function decodeWithBuffer(str: string): string {
  return Buffer.from(str, 'base64').toString();
}
function encodeWithBuffer(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64');
}

function decodeWithExodusBytes(str: string): string {
  return utf8toString(fromBase64(str));
}
function encodeWithExodusBytes(str: string): string {
  return toBase64(utf8fromString(str));
}

function decodeWithBase64Js(str: string): string {
  return textDecoder.decode(base64js.toByteArray(str));
}
function encodeWithBase64Js(str: string): string {
  return base64js.fromByteArray(textEncoder.encode(str));
}

function decodeWithUint8Array(str: string): string {
  return textDecoder.decode(
    (
      Uint8Array as typeof Uint8Array & {
        fromBase64: (str: string) => Uint8Array;
      }
    ).fromBase64(str),
  );
}
function encodeWithUint8Array(str: string): string {
  return textEncoder.encode(str).toBase64();
}

describe('base64 decode - short', () => {
  const str = 'dGVzdDpwYXNzd29yZA=='; // "test:password"

  bench('decode @exodus/bytes', () => {
    decodeWithExodusBytes(str);
  });
  bench('decode base64-js', () => {
    decodeWithBase64Js(str);
  });
  if (hasUint8ArrayBase64Support) {
    bench('decode Uint8Array.fromBase64', () => {
      decodeWithUint8Array(str);
    });
  }
  if (hasBufferSupport) {
    bench('decode Buffer', () => {
      decodeWithBuffer(str);
    });
  }
});

describe('base64 encode - short', () => {
  const str = 'test:password';

  bench('encode @exodus/bytes', () => {
    encodeWithExodusBytes(str);
  });
  bench('encode base64-js', () => {
    encodeWithBase64Js(str);
  });
  if (hasUint8ArrayBase64Support) {
    bench('encode Uint8Array.toBase64', () => {
      encodeWithUint8Array(str);
    });
  }
  if (hasBufferSupport) {
    bench('encode Buffer', () => {
      encodeWithBuffer(str);
    });
  }
});

describe('base64 decode - long', () => {
  const str =
    'VGhpcyBpcyBhIHZlcnkgbG9uZyBzdHJpbmcgdGhhdCB3aWxsIGJlIHVzZWQgdG8gYmVuY2htYXJrIHRoZSBiYXNlNjQgZGVjb2RlIHJlc3BvbnNlIG9mIHRoZSBiYXNpYyBhdXRoIHBhcnNlIGZ1bmN0aW9uLg=='; // "This is a very long string that will be used to benchmark the base64 decode response of the basic auth parse function."

  bench('decode @exodus/bytes', () => {
    decodeWithExodusBytes(str);
  });
  bench('decode base64-js', () => {
    decodeWithBase64Js(str);
  });
  if (hasUint8ArrayBase64Support) {
    bench('decode Uint8Array.fromBase64', () => {
      decodeWithUint8Array(str);
    });
  }
  if (hasBufferSupport) {
    bench('decode Buffer', () => {
      decodeWithBuffer(str);
    });
  }
});

describe('base64 encode - long', () => {
  const str =
    'This is a very long string that will be used to benchmark the base64 encode response of the basic auth format function.';

  bench('encode @exodus/bytes', () => {
    encodeWithExodusBytes(str);
  });
  bench('encode base64-js', () => {
    encodeWithBase64Js(str);
  });
  if (hasUint8ArrayBase64Support) {
    bench('encode Uint8Array.toBase64', () => {
      encodeWithUint8Array(str);
    });
  }
  if (hasBufferSupport) {
    bench('encode Buffer', () => {
      encodeWithBuffer(str);
    });
  }
});
