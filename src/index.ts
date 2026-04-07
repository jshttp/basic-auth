/*!
 * basic-auth
 * Copyright(c) 2013 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

import { Buffer } from 'node:buffer';

export = auth;

/**
 * Parse the Authorization header field of a request
 * @public
 */

function auth(req: auth.IncomingMessageLike): auth.Credentials | undefined {
  if (!req) {
    throw new TypeError('argument req is required');
  }

  if (typeof req !== 'object') {
    throw new TypeError('argument req is required to be an object');
  }

  // get header
  const header = getAuthorization(req);

  // parse header
  return auth.parse(header ?? '');
}

namespace auth {
  /**
   * Object to represent user credentials.
   */
  export interface Credentials {
    name: string;
    pass: string;
  }

  export interface IncomingMessageLike {
    headers?: {
      authorization?: string;
    };
  }

  /**
   * Parse basic auth to object.
   *
   * @param {string} string
   * @return {object}
   * @public
   */

  export function parse(string: string): auth.Credentials | undefined {
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

/**
 * Decode base64 string.
 * @private
 */

function decodeBase64(str: string): string {
  return Buffer.from(str, 'base64').toString();
}

/**
 * Get the Authorization header from request object.
 * @private
 */

function getAuthorization(req: auth.IncomingMessageLike) {
  if (!req.headers || typeof req.headers !== 'object') {
    throw new TypeError('argument req is required to have headers property');
  }

  return req.headers.authorization;
}

class CredentialsImpl implements auth.Credentials {
  name: string;
  pass: string;

  constructor(name: string, pass: string) {
    this.name = name;
    this.pass = pass;
  }
}
