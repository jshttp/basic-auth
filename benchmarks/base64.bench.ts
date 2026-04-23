import { bench, describe } from 'vitest';

type Uint8ArrayWithBase64 = typeof Uint8Array & {
  fromBase64?: (str: string) => Uint8Array;
};

type BufferLike = {
  from(
    input: string,
    encoding: 'base64' | 'utf-8',
  ): { toString(encoding: 'utf-8' | 'base64'): string };
};

const NodeBuffer = (globalThis as any).Buffer as BufferLike | undefined;

const textDecoder = new TextDecoder('utf-8');

function decodeBase64WithUint8Array(str: string): string {
  return textDecoder.decode(
    (Uint8Array as Uint8ArrayWithBase64).fromBase64!(str),
  );
}

function decodeBase64WithNodeBuffer(str: string): string {
  return NodeBuffer!.from(str, 'base64').toString('utf-8');
}

function decodeBase64WithAtob(str: string): string {
  const binary = atob(str);
  return textDecoder.decode(
    Uint8Array.from(binary, (char) => char.charCodeAt(0)),
  );
}

const hasUint8ArrayFromBase64 =
  typeof (Uint8Array as Uint8ArrayWithBase64).fromBase64 === 'function';
const hasNodeBuffer = typeof NodeBuffer?.from === 'function';

const payloads = [
  {
    name: 'short username/password',
    decoded: 'user:password',
  },
  {
    name: 'common API style credential',
    decoded: 'api-client-42:sk_live_b36WzMj0n95wE1y8hHkR2iS4qT7vNuPx',
  },
  {
    name: 'long token-like password',
    decoded:
      'service-account:7f2d9c31f7f14131a65d5315f2dbdb34dc5ddacb4f57b74a04a066f53f8e92bf',
  },
].map((payload) => ({
  ...payload,
  encoded: NodeBuffer!.from(payload.decoded, 'utf-8').toString('base64'),
}));

// Sanity check that all decoding methods produce the same results before benchmarking
for (const payload of payloads) {
  if (decodeBase64WithAtob(payload.encoded) !== payload.decoded) {
    throw new Error(`atob decode failed for ${payload.name}`);
  }

  if (
    hasUint8ArrayFromBase64 &&
    decodeBase64WithUint8Array(payload.encoded) !== payload.decoded
  ) {
    throw new Error(`Uint8Array.fromBase64 decode failed for ${payload.name}`);
  }

  if (
    hasNodeBuffer &&
    decodeBase64WithNodeBuffer(payload.encoded) !== payload.decoded
  ) {
    throw new Error(`Buffer decode failed for ${payload.name}`);
  }
}

describe('decode base64 for basic-auth payloads', () => {
  for (const payload of payloads) {
    describe(payload.name, () => {
      if (hasUint8ArrayFromBase64) {
        bench('Uint8Array.fromBase64 + TextDecoder', () => {
          decodeBase64WithUint8Array(payload.encoded);
        });
      }

      if (hasNodeBuffer) {
        bench('Buffer.from(base64).toString(utf-8)', () => {
          decodeBase64WithNodeBuffer(payload.encoded);
        });
      }

      bench('atob + Uint8Array.from + TextDecoder', () => {
        decodeBase64WithAtob(payload.encoded);
      });
    });
  }
});
