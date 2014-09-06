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
