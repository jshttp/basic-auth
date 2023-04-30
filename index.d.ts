/*!
 * basic-auth
 * Copyright(c) 2013 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */
declare class Auth {
    private static Buffer;
    private static CREDENTIALS_REGEXP;
    private static USER_PASS_REGEXP;
    private request;
    constructor(req: Request);
    private static decodeBase64;
    private static getAuthorization;
    static directParse(string: string): Credentials | undefined;
    parse(): Credentials | undefined;
}
declare class Credentials {
    name: string;
    pass: string;
    constructor(name: string, pass: string);
}
