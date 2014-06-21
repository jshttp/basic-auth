var assert = require('assert');
var auth = require('..');

function request(authorization) {
  return {
    headers: {
      authorization: authorization
    }
  }
}

describe('auth(req)', function(){
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

  describe('with malformed credentials', function(){
    it('should return null', function(){
      var req = request('basic Zm9vcgo=');
      assert(null == auth(req));
    })
  })

  describe('with valid credentials', function(){
    it('should return .user and .pass', function(){
      var req = request('basic Zm9vOmJhcg==');
      auth(req).should.eql({ name: 'foo', pass: 'bar' });
    })
  })
})

describe('auth.header(user, pass)', function(){
  describe('with a password param', function(){
    it('should return the password in the base64 encoding', function(){
      var expected = 'Basic ' + (new Buffer('user:pass')).toString('base64');
      auth.header('user', 'pass').should.eql(expected);
    })
  })

  describe('without a password param', function(){
    it('should not return the password in the base64 encoding', function(){
      var expected = 'Basic ' + (new Buffer('user')).toString('base64');
      auth.header('user').should.eql(expected);
    })
  })
})
