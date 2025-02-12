var assert = require('assert')
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
        assert.strictEqual(creds.name, 'foo')
        assert.strictEqual(creds.pass, 'bar')
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
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, 'bar')
    })
  })

  describe('with empty password', function () {
    it('should return .name and .pass', function () {
      var req = request('basic Zm9vOg==')
      var creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, '')
    })
  })

  describe('with empty userid', function () {
    it('should return .name and .pass', function () {
      var req = request('basic OnBhc3M=')
      var creds = auth(req)
      assert.strictEqual(creds.name, '')
      assert.strictEqual(creds.pass, 'pass')
    })
  })

  describe('with empty userid and pass', function () {
    it('should return .name and .pass', function () {
      var req = request('basic Og==')
      var creds = auth(req)
      assert.strictEqual(creds.name, '')
      assert.strictEqual(creds.pass, '')
    })
  })

  describe('with colon in pass', function () {
    it('should return .name and .pass', function () {
      var req = request('basic Zm9vOnBhc3M6d29yZA==')
      var creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, 'pass:word')
    })
  })

  describe('with scheme "Basic"', function () {
    it('should return .name and .pass', function () {
      var req = request('Basic Zm9vOmJhcg==')
      var creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, 'bar')
    })
  })

  describe('with scheme "BASIC"', function () {
    it('should return .name and .pass', function () {
      var req = request('BASIC Zm9vOmJhcg==')
      var creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, 'bar')
    })
  })

  describe('with scheme "BaSiC"', function () {
    it('should return .name and .pass', function () {
      var req = request('BaSiC Zm9vOmJhcg==')
      var creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, 'bar')
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
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, 'bar')
    })
  })

  describe('with empty password', function () {
    it('should return .name and .pass', function () {
      var creds = auth.parse('basic Zm9vOg==')
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, '')
    })
  })

  describe('with empty userid', function () {
    it('should return .name and .pass', function () {
      var creds = auth.parse('basic OnBhc3M=')
      assert.strictEqual(creds.name, '')
      assert.strictEqual(creds.pass, 'pass')
    })
  })

  describe('with empty userid and pass', function () {
    it('should return .name and .pass', function () {
      var creds = auth.parse('basic Og==')
      assert.strictEqual(creds.name, '')
      assert.strictEqual(creds.pass, '')
    })
  })

  describe('with colon in pass', function () {
    it('should return .name and .pass', function () {
      var creds = auth.parse('basic Zm9vOnBhc3M6d29yZA==')
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, 'pass:word')
    })
  })

  describe('with scheme "Basic"', function () {
    it('should return .name and .pass', function () {
      var req = request('Basic Zm9vOmJhcg==')
      var creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, 'bar')
    })
  })

  describe('with scheme "BASIC"', function () {
    it('should return .name and .pass', function () {
      var req = request('BASIC Zm9vOmJhcg==')
      var creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, 'bar')
    })
  })

  describe('with scheme "BaSiC"', function () {
    it('should return .name and .pass', function () {
      var req = request('BaSiC Zm9vOmJhcg==')
      var creds = auth(req)
      assert.strictEqual(creds.name, 'foo')
      assert.strictEqual(creds.pass, 'bar')
    })
  })
})

describe('auth.format(credentials)', function () {
  describe('arguments', function () {
    describe('credentials', function () {
      it('should be required', function () {
        assert.throws(auth.format, /argument credentials is required/)
      })

      it('should accept credentials', function () {
        var header = auth.format({ name: 'foo', pass: 'bar' })
        assert.strictEqual(header, 'Basic Zm9vOmJhcg==')
      })

      it('should reject null', function () {
        assert.throws(auth.format.bind(null, null), /argument credentials is required/)
      })

      it('should reject a number', function () {
        assert.throws(auth.format.bind(null, 42), /argument credentials is required/)
      })

      it('should reject a string', function () {
        assert.throws(auth.format.bind(null, ''), /argument credentials is required/)
      })

      it('should reject an object without name', function () {
        assert.throws(auth.format.bind(null, { pass: 'bar' }), /argument credentials is required to have name and pass properties/)
      })

      it('should reject an object without pass', function () {
        assert.throws(auth.format.bind(null, { name: 'foo' }), /argument credentials is required to have name and pass properties/)
      })

      it('should reject an object with non-string name', function () {
        assert.throws(auth.format.bind(null, { name: 42, pass: 'bar' }), /argument credentials is required to have name and pass properties/)
      })

      it('should reject an object with non-string pass', function () {
        assert.throws(auth.format.bind(null, { name: 'foo', pass: 42 }), /argument credentials is required to have name and pass properties/)
      })
    })
  })

  describe('with valid credentials', function () {
    it('should return header', function () {
      var header = auth.format({ name: 'foo', pass: 'bar' })
      assert.strictEqual(header, 'Basic Zm9vOmJhcg==')
    })
  })

  describe('with empty password', function () {
    it('should return header', function () {
      var header = auth.format({ name: 'foo', pass: '' })
      assert.strictEqual(header, 'Basic Zm9vOg==')
    })
  })

  describe('with empty userid', function () {
    it('should return header', function () {
      var header = auth.format({ name: '', pass: 'pass' })
      assert.strictEqual(header, 'Basic OnBhc3M=')
    })
  })

  describe('with empty userid and pass', function () {
    it('should return header', function () {
      var header = auth.format({ name: '', pass: '' })
      assert.strictEqual(header, 'Basic Og==')
    })
  })
})
