var assert = require('assert')
var sinon = require('sinon')
var auth = require('..')

function request (authorization) {
  return {
    headers: {
      authorization: authorization
    }
  }
}

describe('auth(req)', function () {
  describe('arguments', function () {
    describe('req', function () {
      it('should be required', function () {
        assert.throws(auth, /argument req is required/)
      })

      it('should accept a request', function () {
        var req = request('basic Zm9vOmJhcg==')
        var creds = auth(req)
        assert.equal(creds.name, 'foo')
        assert.equal(creds.pass, 'bar')
      })

      it('should accept a koa context', function () {
        var ctx = { req: request('basic Zm9vOmJhcg==') }
        var creds = auth(ctx)
        assert.equal(creds.name, 'foo')
        assert.equal(creds.pass, 'bar')
      })

      it('should reject null', function () {
        assert.throws(auth.bind(null, null), /argument req is required/)
      })

      it('should reject a number', function () {
        assert.throws(auth.bind(null, 42), /argument req is required/)
      })

      it('should reject an object without headers', function () {
        assert.throws(auth.bind(null, {}), /argument req is required/)
      })
    })
  })

  describe('with no Authorization field', function () {
    it('should return undefined', function () {
      var req = request()
      assert.strictEqual(auth(req), undefined)
    })
  })

  describe('with malformed Authorization field', function () {
    it('should return undefined', function () {
      var req = request('Something')
      assert.strictEqual(auth(req), undefined)
    })
  })

  describe('with malformed Authorization scheme', function () {
    it('should return undefined', function () {
      var req = request('basic_Zm9vOmJhcg==')
      assert.strictEqual(auth(req), undefined)
    })
  })

  describe('with malformed credentials', function () {
    it('should return undefined', function () {
      var req = request('basic Zm9vcgo=')
      assert.strictEqual(auth(req), undefined)
    })
  })

  describe('with valid credentials', function () {
    it('should return .name and .pass', function () {
      var req = request('basic Zm9vOmJhcg==')
      var creds = auth(req)
      assert.equal(creds.name, 'foo')
      assert.equal(creds.pass, 'bar')
    })
  })

  describe('with empty password', function () {
    it('should return .name and .pass', function () {
      var req = request('basic Zm9vOg==')
      var creds = auth(req)
      assert.equal(creds.name, 'foo')
      assert.equal(creds.pass, '')
    })
  })

  describe('with empty userid', function () {
    it('should return .name and .pass', function () {
      var req = request('basic OnBhc3M=')
      var creds = auth(req)
      assert.equal(creds.name, '')
      assert.equal(creds.pass, 'pass')
    })
  })

  describe('with empty userid and pass', function () {
    it('should return .name and .pass', function () {
      var req = request('basic Og==')
      var creds = auth(req)
      assert.equal(creds.name, '')
      assert.equal(creds.pass, '')
    })
  })

  describe('with colon in pass', function () {
    it('should return .name and .pass', function () {
      var req = request('basic Zm9vOnBhc3M6d29yZA==')
      var creds = auth(req)
      assert.equal(creds.name, 'foo')
      assert.equal(creds.pass, 'pass:word')
    })
  })
})

describe('auth.parse(string)', function () {
  describe('with undefined string', function () {
    it('should return undefined', function () {
      assert.strictEqual(auth.parse(), undefined)
    })
  })

  describe('with malformed string', function () {
    it('should return undefined', function () {
      assert.strictEqual(auth.parse('Something'), undefined)
    })
  })

  describe('with malformed scheme', function () {
    it('should return undefined', function () {
      assert.strictEqual(auth.parse('basic_Zm9vOmJhcg=='), undefined)
    })
  })

  describe('with malformed credentials', function () {
    it('should return undefined', function () {
      assert.strictEqual(auth.parse('basic Zm9vcgo='), undefined)
    })
  })

  describe('with valid credentials', function () {
    it('should return .name and .pass', function () {
      var creds = auth.parse('basic Zm9vOmJhcg==')
      assert.equal(creds.name, 'foo')
      assert.equal(creds.pass, 'bar')
    })
  })

  describe('with empty password', function () {
    it('should return .name and .pass', function () {
      var creds = auth.parse('basic Zm9vOg==')
      assert.equal(creds.name, 'foo')
      assert.equal(creds.pass, '')
    })
  })

  describe('with empty userid', function () {
    it('should return .name and .pass', function () {
      var creds = auth.parse('basic OnBhc3M=')
      assert.equal(creds.name, '')
      assert.equal(creds.pass, 'pass')
    })
  })

  describe('with empty userid and pass', function () {
    it('should return .name and .pass', function () {
      var creds = auth.parse('basic Og==')
      assert.equal(creds.name, '')
      assert.equal(creds.pass, '')
    })
  })

  describe('with colon in pass', function () {
    it('should return .name and .pass', function () {
      var creds = auth.parse('basic Zm9vOnBhc3M6d29yZA==')
      assert.equal(creds.name, 'foo')
      assert.equal(creds.pass, 'pass:word')
    })
  })
})

describe('auth.middleware', function () {
  beforeEach(function () {
    process.env.BASIC_AUTH = ''
  })

  describe('with empty BASIC_AUTH', function () {
    it('should call next with no validation', function () {
      var req = request()
      var next = sinon.spy()

      var middleware = auth.middleware()
      middleware(req, null, next)

      assert(next.calledOnce)
      assert(next.args[0].length === 0)
    })
  })

  describe('with valid BASIC_AUTH', function () {
    describe('with valid credentials', function () {
      it('should call next with no error', function () {
        var req = request('basic Zm9vOmJhcg==')
        var next = sinon.spy()
        process.env.BASIC_AUTH = 'foo:bar'

        var middleware = auth.middleware()
        middleware(req, null, next)

        assert(next.calledOnce)
        assert(next.args[0].length === 0)
      })
    })

    describe('with invalid credentials', function () {
      it('should call next with error instance of Error', function () {
        var req = request('basic Zm9vOmJhcg==')
        var next = sinon.spy()
        process.env.BASIC_AUTH = 'foo:foo'

        var middleware = auth.middleware()
        middleware(req, null, next)

        assert(next.calledOnce)
        var err = next.args[0][0]
        assert(err instanceof Error)
      })

      it('should call next with error instance of CustomError', function () {
        var req = request('basic Zm9vOmJhcg==')
        var next = sinon.spy()
        process.env.BASIC_AUTH = 'foo:foo'
        function CustomError () {}

        var middleware = auth.middleware(CustomError)
        middleware(req, null, next)

        assert(next.calledOnce)
        var err = next.args[0][0]
        assert(err instanceof CustomError)
      })
    })
  })
})
