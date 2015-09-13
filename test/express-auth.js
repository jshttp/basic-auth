var auth = require('..');
var chai = require('chai');
var httpMocks = require('node-mocks-http');

chai.use(require('chai-spies'));
var expect = chai.expect;

describe('auth.express(ops)', function() {
  var req, res, next;

  beforeEach(function() {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: { 'authorization' : 'basic Zm9vOmJhcg==' }
    });

    res = httpMocks.createResponse();

    next = chai.spy();
  });

  describe('with right credentials', function() {

    var middleware = auth.express({
      user: 'foo', pass: 'bar'
    });

    it('should call next()', function() {
      middleware(req, res, next);

      expect(next).to.have.been.called();
    });

  });

  describe('with wrong credentials', function() {

    var middleware = auth.express({
      user: 'baz', pass: 'qux'
    });

    it('should not call next()', function() {
      middleware(req, res, next);

      expect(next).not.to.have.been.called();
    });

    it('should set authenticate header', function() {
      req.hostname = 'madeupsite.com';
      res.setHeader = chai.spy();

      middleware(req, res, next);

      expect(res.setHeader).to.have.been.called
        .with('WWW-Authenticate', 'Basic realm="madeupsite.com"');
    });

    it('should send 401 status', function() {
      res.sendStatus = chai.spy();

      middleware(req, res, next);

      expect(res.sendStatus).to.have.been.called.with(401);
    });

  });

  describe('with unsafe mode active', function() {

    var middleware = auth.express({
      unsafe: true
    });

    it('should call next()', function() {
      middleware(req, res, next);

      expect(next).to.have.been.called();
    });

  });

  describe('with whitelist defined', function() {

    var middleware = auth.express({
      whitelist: ['/']
    });

    it('should call next() when path is whitelisted', function() {
      middleware(req, res, next);

      expect(next).to.have.been.called();
    });

  });

  describe('with custom authenticate realm', function() {

    var middleware = auth.express({
      realm: 'SomeRealm'
    });

    it('should set authenticate header', function() {
      res.setHeader = chai.spy();

      middleware(req, res, next);

      expect(res.setHeader).to.have.been.called
        .with('WWW-Authenticate', 'Basic realm="SomeRealm"');
    });

  });

});

