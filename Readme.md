# basic-auth

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

var header = auth.header('user', 'pass');
// => 'Basic akhhaslkdhlhf=='
```

# License

  MIT
