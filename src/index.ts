/*!
 * basic-auth
 * Copyright(c) 2013 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

import { base64 } from './base64.js';

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
    throw new TypeError('Expected a string');
  }

  // parse header
  const match = CREDENTIALS_REGEXP.exec(string);
  if (!match) return undefined;

  // decode user pass
  const userPass = base64.decode(match[1]);
  const colonIndex = userPass.indexOf(':');
  if (colonIndex === -1) return undefined;

  return {
    name: userPass.slice(0, colonIndex),
    pass: userPass.slice(colonIndex + 1),
  };
}

/**
 * Format Basic Authorization Header
 *
 * @param {Credentials} credentials
 * @return {string}
 * @public
 */
export function format(credentials: Credentials): string {
  if (typeof credentials !== 'object' || credentials === null) {
    throw new TypeError('Expected an object');
  }

  if (
    typeof credentials.name !== 'string' ||
    typeof credentials.pass !== 'string'
  ) {
    throw new TypeError('Object must have string properties "name" and "pass"');
  }

  // RFC 7617 disallows colon in username
  if (credentials.name.includes(':')) {
    throw new TypeError('Object "name" must not contain a colon');
  }

  const str = credentials.name + ':' + credentials.pass;

  if (CONTROL_CHARS_REGEXP.test(str)) {
    throw new TypeError(
      'Object "name" and "pass" must not contain control characters',
    );
  }

  return 'Basic ' + base64.encode(str);
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
 * RegExp for RFC 5234 CTL characters (US-ASCII 0-31 and 127).
 * @private
 */
const CONTROL_CHARS_REGEXP = /[\x00-\x1F\x7F]/;
