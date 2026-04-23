/*!
 * basic-auth
 * Copyright(c) 2013 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Object to represent user credentials.
 */
export interface Credentials {
  name: string;
  pass: string;
}

/**
 * Parse basic auth to object.
 *
 * @param {string} string
 * @return {object}
 * @public
 */

export function parse(string: string): Credentials | undefined {
  if (typeof string !== 'string') {
    return undefined;
  }

  // parse header
  const match = CREDENTIALS_REGEXP.exec(string);

  if (!match) {
    return undefined;
  }

  // decode user pass
  const userPass = USER_PASS_REGEXP.exec(decodeBase64(match[1]));

  if (!userPass) {
    return undefined;
  }

  // return credentials object
  return new CredentialsImpl(userPass[1], userPass[2]);
}

/**
 * RegExp for basic auth credentials
 *
 * credentials = auth-scheme 1*SP token68
 * auth-scheme = "Basic" ; case insensitive
 * token68     = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" ) *"="
 * @private
 */

const CREDENTIALS_REGEXP =
  /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;

/**
 * RegExp for basic auth user/pass
 *
 * user-pass   = userid ":" password
 * userid      = *<TEXT excluding ":">
 * password    = *TEXT
 * @private
 */

const USER_PASS_REGEXP = /^([^:]*):(.*)$/;

type Uint8ArrayWithBase64 = typeof Uint8Array & {
  fromBase64?: (str: string) => Uint8Array;
};

type BufferLike = {
  from(
    input: string,
    encoding: 'base64',
  ): { toString(encoding: 'utf-8'): string };
};

const NodeBuffer = (globalThis as any).Buffer as BufferLike | undefined;

const textDecoder = new TextDecoder('utf-8');

/**
 * Decode base64 string.
 * @private
 */
const decodeBase64: (str: string) => string = (() => {
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

class CredentialsImpl implements Credentials {
  name: string;
  pass: string;

  constructor(name: string, pass: string) {
    this.name = name;
    this.pass = pass;
  }
}
