var assert = require('assert');
var auth = require('..');

function request(authorization) {
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

  describe('with no Authorization field', function(){
    it('should return null', function(){
      var req = request();
      assert(null == auth(req));
    })
  })

  describe('with malformed Authorization field', function(){
    it('should return null', function(){
      var req = request('Something');
      assert(null == auth(req));
    })
  })

  describe('with malformed Authorization scheme', function(){
    it('should return null', function(){
      var req = request('basic_Zm9vOmJhcg==');
      assert(null == auth(req));
    })
  })

  describe('with malformed credentials', function(){
    it('should return null', function(){
      var req = request('basic Zm9vcgo=');
      assert(null == auth(req));
    })
  })

  describe('with valid credentials', function(){
    it('should return .name and .pass', function(){
      var req = request('basic Zm9vOmJhcg==');
      var creds = auth(req);
      assert.equal(creds.name, 'foo');
      assert.equal(creds.pass, 'bar');
    })
  })

  describe('with empty password', function(){
    it('should return .name and .pass', function(){
      var req = request('basic Zm9vOg==');
      var creds = auth(req);
      assert.equal(creds.name, 'foo');
      assert.equal(creds.pass, '');
    })
  })

  describe('with empty userid', function(){
    it('should return .name and .pass', function(){
      var req = request('basic OnBhc3M=');
      var creds = auth(req);
      assert.equal(creds.name, '');
      assert.equal(creds.pass, 'pass');
    })
  })

  describe('with empty userid and pass', function(){
    it('should return .name and .pass', function(){
      var req = request('basic Og==');
      var creds = auth(req);
      assert.equal(creds.name, '');
      assert.equal(creds.pass, '');
    })
  })

  describe('with colon in pass', function(){
    it('should return .name and .pass', function(){
      var req = request('basic Zm9vOnBhc3M6d29yZA==');
      var creds = auth(req);
      assert.equal(creds.name, 'foo');
      assert.equal(creds.pass, 'pass:word');
    })
  })
})
