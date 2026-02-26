import { describe, it, assert } from 'vitest';
import auth from './index';

function request(authorization?: string) {
  return {
    headers: {
      authorization: authorization,
    },
  };
}

describe('auth(req)', function () {
  describe('arguments', function () {
    describe('req', function () {
      it('should be required', function () {
        assert.throws(auth as any, /argument req is required/);
      });

      it('should accept a request', function () {
        var req = request('basic Zm9vOmJhcg==');
        var creds = auth(req);
        assert.strictEqual(creds?.name, 'foo');
        assert.strictEqual(creds?.pass, 'bar');
      });

      it('should reject null', function () {
        assert.throws(auth.bind(null, null as any), /argument req is required/);
      });

      it('should reject a number', function () {
        assert.throws(auth.bind(null, 42 as any), /argument req is required/);
      });

      it('should reject an object without headers', function () {
        assert.throws(auth.bind(null, {}), /argument req is required/);
      });
    });
  });

  describe('with no Authorization field', function () {
    it('should return undefined', function () {
      var req = request();
      assert.strictEqual(auth(req), undefined);
    });
  });

  describe('with malformed Authorization field', function () {
    it('should return undefined', function () {
      var req = request('Something');
      assert.strictEqual(auth(req), undefined);
    });
  });

  describe('with malformed Authorization scheme', function () {
    it('should return undefined', function () {
      var req = request('basic_Zm9vOmJhcg==');
      assert.strictEqual(auth(req), undefined);
    });
  });

  describe('with malformed credentials', function () {
    it('should return undefined', function () {
      var req = request('basic Zm9vcgo=');
      assert.strictEqual(auth(req), undefined);
    });
  });

  describe('with valid credentials', function () {
    it('should return .name and .pass', function () {
      var req = request('basic Zm9vOmJhcg==');
      var creds = auth(req);
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, 'bar');
    });
  });

  describe('with empty password', function () {
    it('should return .name and .pass', function () {
      var req = request('basic Zm9vOg==');
      var creds = auth(req);
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, '');
    });
  });

  describe('with empty userid', function () {
    it('should return .name and .pass', function () {
      var req = request('basic OnBhc3M=');
      var creds = auth(req);
      assert.strictEqual(creds?.name, '');
      assert.strictEqual(creds?.pass, 'pass');
    });
  });

  describe('with empty userid and pass', function () {
    it('should return .name and .pass', function () {
      var req = request('basic Og==');
      var creds = auth(req);
      assert.strictEqual(creds?.name, '');
      assert.strictEqual(creds?.pass, '');
    });
  });

  describe('with colon in pass', function () {
    it('should return .name and .pass', function () {
      var req = request('basic Zm9vOnBhc3M6d29yZA==');
      var creds = auth(req);
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, 'pass:word');
    });
  });

  describe('with scheme "Basic"', function () {
    it('should return .name and .pass', function () {
      var req = request('Basic Zm9vOmJhcg==');
      var creds = auth(req);
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, 'bar');
    });
  });

  describe('with scheme "BASIC"', function () {
    it('should return .name and .pass', function () {
      var req = request('BASIC Zm9vOmJhcg==');
      var creds = auth(req);
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, 'bar');
    });
  });

  describe('with scheme "BaSiC"', function () {
    it('should return .name and .pass', function () {
      var req = request('BaSiC Zm9vOmJhcg==');
      var creds = auth(req);
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, 'bar');
    });
  });
});
