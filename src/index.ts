/*!
 * basic-auth
 * Copyright(c) 2013 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Parse the Authorization header field of a request.
 *
 * @param {object} req
 * @return {object} with .name and .pass
 * @public
 */

class Auth{
    /**
     * Module dependencies.
     * @private
    */
    private Buffer = require('safe-buffer').Buffer;

    /**
     * RegExp for basic auth credentials
     *
     * credentials = auth-scheme 1*SP token68
     * auth-scheme = "Basic" ; case insensitive
     * token68     = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" ) *"="
     * @private
     */
    private CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;

    /**
     * RegExp for basic auth user/pass
     *
     * user-pass   = userid ":" password
     * userid      = *<TEXT excluding ":">
     * password    = *TEXT
     * @private
     */
    private USER_PASS_REGEXP = /^([^:]*):(.*)$/;


    private request: Request;


    constructor(req:Request){
        if (!req) {
            throw new TypeError('argument req is required')
        }
    
        if (typeof req !== 'object') {
            throw new TypeError('argument req is required to be an object')
        }

        this.request = req;
    }

    /**
     * Decode base64 string.
     * @private
     */

    private decodeBase64 (str: string): string {
        return Buffer.from(str, 'base64').toString()
    }

    /**
     * Get the Authorization header from request object.
     * @private
     */

    private getAuthorization (req:Request):string {
        if (!req.headers || typeof req.headers !== 'object' || !("authorization" in req.headers)) {
            throw new TypeError('argument req is required to have headers property')
        }

        return req.headers.authorization as string;
    }

    /**
     * Parse basic auth to object.
     *
     * @param {string} string
     * @return {object}
     * @public
     */

    parse (): Credentials | undefined {
        // get header
        const header = this.getAuthorization(this.request);

        if (typeof header !== 'string') {
            return undefined;
        }
    
        // parse header
        const match = this.CREDENTIALS_REGEXP.exec(header)
    
        if (!match) {
            return undefined;
        }
        
        // decode user pass
        const userPass = this.USER_PASS_REGEXP.exec(this.decodeBase64(match[1]))
    

        if (!userPass) {
            return undefined;
        }
    
        // return credentials object
        return new Credentials(userPass[1], userPass[2])
    }

    directParse (string: string): Credentials | undefined{
        if (typeof string !== 'string') {
            return undefined
          }
        
          // parse header
          var match = this.CREDENTIALS_REGEXP.exec(string);
        
          if (!match) {
            return undefined
          }
        
          // decode user pass
          var userPass = this.USER_PASS_REGEXP.exec(this.decodeBase64(match[1]))
        
          if (!userPass) {
            return undefined
          }
        
          // return credentials object
          return new Credentials(userPass[1], userPass[2])
    }
}


/**
 * class to represent user credentials.
 * @private
 */

class Credentials {
    name: string;
    pass: string;
    constructor(name:string, pass:string){
        this.name = name;
        this.pass = pass
    }
}



/**
 * Module exports.
 * @public
 */

module.exports = function(req:Request){
    const parseObj = new Auth(req);
    this.prototype.parse = parseObj.directParse;
    return parseObj.parse();
}