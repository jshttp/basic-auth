# basic-auth

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Generic basic auth Authorization header field parser for whatever.

## Installation

```
$ npm install basic-auth
```

## Example

  Pass a node request or koa Context object to the module exported. If
  parsing fails `undefined` is returned, otherwise an object with
  `.name` and `.pass`.

```js
var auth = require('basic-auth');
var user = auth(req);
// => { name: 'something', pass: 'whatever' }

```

### With vanilla node.js http server

```js
var http = require('http')
var auth = require('basic-auth')

// Create server
var server = http.createServer(function(req, res){
  var credentials = auth(req)

  if (!credentials || credentials.name !== 'john' || credentials.pass !== 'secret') {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="example"'
    })
    res.end()
  } else {
    res.end('Access granted');
  }
})

// Listen
server.listen(3000)
```

# License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/basic-auth.svg?style=flat
[npm-url]: https://npmjs.org/package/basic-auth
[node-version-image]: https://img.shields.io/badge/node.js-%3E%3D_0.8-brightgreen.svg?style=flat
[node-version-url]: http://nodejs.org/download/
[travis-image]: https://img.shields.io/travis/jshttp/basic-auth.svg?style=flat
[travis-url]: https://travis-ci.org/jshttp/basic-auth
[coveralls-image]: https://img.shields.io/coveralls/jshttp/basic-auth.svg?style=flat
[coveralls-url]: https://coveralls.io/r/jshttp/basic-auth?branch=master
[downloads-image]: https://img.shields.io/npm/dm/basic-auth.svg?style=flat
[downloads-url]: https://npmjs.org/package/basic-auth
