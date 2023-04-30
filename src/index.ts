/*!
 * basic-auth
 * Copyright(c) 2013 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Create an instance of Authorization header field of a request.
 * @class Auth
 * @public
 */

class Auth{

   /**
    * Module dependencies.
    *
    * @private
    * @static
    * @memberof Auth
    */
   private static Buffer = require('safe-buffer').Buffer;


    /**
     * RegExp for basic auth credentials
     *
     * credentials = auth-scheme 1*SP token68
     * auth-scheme = "Basic" ; case insensitive
     * token68     = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" ) *"="
     * @private
     * @static
     * @memberof Auth
     */
    private static CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;


    /**
     * RegExp for basic auth user/pass
     *
     * user-pass   = userid ":" password
     * userid      = *<TEXT excluding ":">
     * password    = *TEXT
     * @private
     * @static
     * @memberof Auth
     */
    private static USER_PASS_REGEXP = /^([^:]*):(.*)$/;


    /**
     *  Hold request input
     *
     * @private
     * @type {Request}
     * @memberof Auth
     */
    private request: Request;


    /**
     * Creates an instance of Auth.
     * 
     * @param {Request} req
     * @memberof Auth
     */
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
     *
     * @private
     * @static
     * @param {string} str
     * @returns {string}
     * @memberof Auth
     */
    private static decodeBase64 (str: string): string {
        return Auth.Buffer.from(str, 'base64').toString()
    }


    /**
     * Get the Authorization header from request object.
     *
     * @private
     * @static
     * @param {Request} req
     * @returns {string}
     * @memberof Auth
     */
    private static getAuthorization (req:Request):string {
        if (!req.headers || typeof req.headers !== 'object' || !("authorization" in req.headers)) {
            throw new TypeError('argument req is required to have headers property')
        }

        return req.headers.authorization as string;
    }


    /**
     * Parse basic auth to object.
     *
     * @static
     * @param {string} string
     * @returns {(Credentials | undefined)}
     * @memberof Auth
     */
    static directParse (string:string): Credentials | undefined {
        if (typeof string !== 'string') {
            return undefined;
        }
        // parse header
        const match = Auth.CREDENTIALS_REGEXP.exec(string)
    
        if (!match) {
            return undefined;
        }
        
        // decode user pass
        const userPass = Auth.USER_PASS_REGEXP.exec(Auth.decodeBase64(match[1]))
    

        if (!userPass) {
            return undefined;
        }
    
        // return credentials object
        return new Credentials(userPass[1], userPass[2])
    }

    
    /**
     * Parse basic auth to object.
     *
     * @returns {(Credentials | undefined)}
     * @memberof Auth
     */
    parse (): Credentials | undefined {
        // get header
        const header = Auth.getAuthorization(this.request);
        return Auth.directParse(header);
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
    return parseObj.parse();
}
module.exports.parse= Auth.directParse;