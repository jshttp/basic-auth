import { afterAll, expect, beforeAll, describe, it, vi } from 'vitest';

const importBase64 = async () => {
  vi.resetModules();

  const { base64 } = await import('./base64.js');
  return base64;
};

const ENCODE_CASES = [
  ['', ''],
  ['f', 'Zg=='],
  ['fo', 'Zm8='],
  ['foo', 'Zm9v'],
  ['foob', 'Zm9vYg=='],
  ['fooba', 'Zm9vYmE='],
  ['foobar', 'Zm9vYmFy'],
  ['foo:bar', 'Zm9vOmJhcg=='],
  [':', 'Og=='],
  ['\ufeffa:', '77u/YTo='],
  ['\0\x7f', 'AH8='],
  ['ü:密碼', 'w7w65a+G56K8'],
  ['😀:🔑', '8J+YgDrwn5SR'],
  ['\ud800', '77+9'],
  ['\udc00', '77+9'],
] as const;

const DECODE_CASES = [
  ...ENCODE_CASES.map(
    ([value, encoded]) => [encoded, value.toWellFormed()] as const,
  ),
  ['Zg', 'f'],
  ['Zm8', 'fo'],
  [' \tZm9v\r\nOmJhcg==\f', 'foo:bar'],
  ['Zh==', 'f'],
  ['Zm9=', 'fo'],
  ['/w==', '\ufffd'],
  ['wyg=', '\ufffd('],
  ['4oI=', '\ufffd'],
  ['77+9', '\ufffd'],
] as const;

describe.skipIf(typeof Buffer === 'undefined')('base64 (Buffer)', () => {
  let base64: typeof import('./base64.js').base64;

  beforeAll(async () => {
    base64 = await importBase64();
  });

  afterAll(() => {
    vi.resetModules();
  });

  it.each(ENCODE_CASES)('encodes %j as %j', (value, encoded) => {
    expect(base64.encode(value)).toEqual(encoded);
  });

  it.each(DECODE_CASES)('decodes %j as %j', (encoded, value) => {
    expect(base64.decode(encoded)).toEqual(value);
  });

  it.each(ENCODE_CASES)('round-trips %j', (value) => {
    expect(base64.decode(base64.encode(value))).toEqual(value.toWellFormed());
  });
});

describe.skipIf(!Uint8Array.prototype.toBase64)('base64 (Uint8Array)', () => {
  let base64: typeof import('./base64.js').base64;

  beforeAll(async () => {
    vi.stubGlobal('Buffer', undefined);
    base64 = await importBase64();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it.each(ENCODE_CASES)('encodes %j as %j', (value, encoded) => {
    expect(base64.encode(value)).toEqual(encoded);
  });

  it.each(DECODE_CASES)('decodes %j as %j', (encoded, value) => {
    expect(base64.decode(encoded)).toEqual(value);
  });

  it.each(ENCODE_CASES)('round-trips %j', (value) => {
    expect(base64.decode(base64.encode(value))).toEqual(value.toWellFormed());
  });
});
