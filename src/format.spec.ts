import { describe, it, assert } from 'vitest';
import { format } from './index';

describe('format(credentials)', function () {
  describe('arguments', function () {
    describe('credentials', function () {
      it('should be required', function () {
        assert.throws(
          () => (format as any)(),
          /argument credentials is required/,
        );
      });

      it('should accept credentials', function () {
        const header = format({ name: 'foo', pass: 'bar' });
        assert.strictEqual(header, 'Basic Zm9vOmJhcg==');
      });

      it('should reject null', function () {
        assert.throws(
          format.bind(null, null as any),
          /argument credentials is required/,
        );
      });

      it('should reject a number', function () {
        assert.throws(
          format.bind(null, 42 as any),
          /argument credentials is required/,
        );
      });

      it('should reject a string', function () {
        assert.throws(
          format.bind(null, '' as any),
          /argument credentials is required/,
        );
      });

      it('should reject an object without name', function () {
        assert.throws(
          format.bind(null, { pass: 'bar' } as any),
          /argument credentials is required to have name and pass properties/,
        );
      });

      it('should reject an object without pass', function () {
        assert.throws(
          format.bind(null, { name: 'foo' } as any),
          /argument credentials is required to have name and pass properties/,
        );
      });

      it('should reject an object with non-string name', function () {
        assert.throws(
          format.bind(null, { name: 42, pass: 'bar' } as any),
          /argument credentials is required to have name and pass properties/,
        );
      });

      it('should reject an object with non-string pass', function () {
        assert.throws(
          format.bind(null, { name: 'foo', pass: 42 } as any),
          /argument credentials is required to have name and pass properties/,
        );
      });

      it('should reject userid containing colon', function () {
        assert.throws(
          format.bind(null, { name: 'foo:bar', pass: 'baz' }),
          /must not contain a colon or control characters/,
        );
      });

      it('should reject control chars in userid', function () {
        assert.throws(
          format.bind(null, { name: 'foo\u0000bar', pass: 'baz' }),
          /must not contain a colon or control characters/,
        );
      });

      it('should reject control chars in password', function () {
        assert.throws(
          format.bind(null, { name: 'foo', pass: 'bar\u007f' }),
          /must not contain control characters/,
        );
      });
    });
  });

  describe('with valid credentials', function () {
    it('should return header', function () {
      const header = format({ name: 'foo', pass: 'bar' });
      assert.strictEqual(header, 'Basic Zm9vOmJhcg==');
    });
  });

  describe('with empty password', function () {
    it('should throw', function () {
      assert.throws(
        format.bind(null, { name: 'foo', pass: '' }),
        /argument credentials.name and credentials.pass must not be empty/,
      );
    });
  });

  describe('with empty userid', function () {
    it('should throw', function () {
      assert.throws(
        format.bind(null, { name: '', pass: 'pass' }),
        /argument credentials.name and credentials.pass must not be empty/,
      );
    });
  });

  describe('with empty userid and pass', function () {
    it('should throw', function () {
      assert.throws(
        format.bind(null, { name: '', pass: '' }),
        /argument credentials.name and credentials.pass must not be empty/,
      );
    });
  });
});
