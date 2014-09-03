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

  describe('with empty password', function(){
    it('should return .user and .pass', function(){
      var req = request('basic Zm9vOg==');
      auth(req).should.eql({ name: 'foo', pass: ''});
    })
  })

  describe('with empty userid', function(){
    it('should return .user and .pass', function(){
      var req = request('basic ' + new Buffer(':pass').toString('base64'));
      auth(req).should.eql({ name: '', pass: 'pass'});
    })
  })

  describe('with empty userid and pass', function(){
    it('should return .user and .pass', function(){
      var req = request('basic ' + new Buffer(':').toString('base64'));
      auth(req).should.eql({ name: '', pass: ''});
    })
  })

  describe('with colon in pass', function(){
    it('should return .user and .pass', function(){
      var req = request('basic ' + new Buffer('foo:pass:word').toString('base64'));
      auth(req).should.eql({ name: 'foo', pass: 'pass:word'});
    })
  })
})
