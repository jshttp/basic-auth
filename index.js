'use strict'
/*!
 * basic-auth
 * Copyright(c) 2013 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */
var Auth = (function () {
  function Auth (req) {
    if (!req) {
      throw new TypeError('argument req is required')
    }
    if (typeof req !== 'object') {
      throw new TypeError('argument req is required to be an object')
    }
    this.request = req
  }
  Auth.decodeBase64 = function (str) {
    return Auth.Buffer.from(str, 'base64').toString()
  }
  Auth.getAuthorization = function (req) {
    if (!req.headers || typeof req.headers !== 'object' || !('authorization' in req.headers)) {
      throw new TypeError('argument req is required to have headers property')
    }
    return req.headers.authorization
  }
  Auth.directParse = function (string) {
    if (typeof string !== 'string') {
      return undefined
    }
    var match = Auth.CREDENTIALS_REGEXP.exec(string)
    if (!match) {
      return undefined
    }
    var userPass = Auth.USER_PASS_REGEXP.exec(Auth.decodeBase64(match[1]))
    if (!userPass) {
      return undefined
    }
    return new Credentials(userPass[1], userPass[2])
  }
  Auth.prototype.parse = function () {
    var header = Auth.getAuthorization(this.request)
    return Auth.directParse(header)
  }
  Auth.Buffer = require('safe-buffer').Buffer
  Auth.CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/
  Auth.USER_PASS_REGEXP = /^([^:]*):(.*)$/
  return Auth
}())
var Credentials = (function () {
  function Credentials (name, pass) {
    this.name = name
    this.pass = pass
  }
  return Credentials
}())
module.exports = function (req) {
  var parseObj = new Auth(req)
  return parseObj.parse()
}
module.exports.parse = Auth.directParse
