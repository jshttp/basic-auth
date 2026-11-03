import { describe, it, expect } from 'vitest';
import { format } from './index.js';

describe('format(credentials)', function () {
  describe('arguments', function () {
    describe('credentials', function () {
      it('should be required', function () {
        expect(() => (format as any)()).toThrow(/Expected an object/);
      });

      it('should accept credentials', function () {
        const header = format({ name: 'foo', pass: 'bar' });
        expect(header).toEqual('Basic Zm9vOmJhcg==');
      });

      it('should reject null', function () {
        expect(format.bind(null, null as any)).toThrow(/Expected an object/);
      });

      it('should reject a number', function () {
        expect(format.bind(null, 42 as any)).toThrow(/Expected an object/);
      });

      it('should reject a string', function () {
        expect(format.bind(null, '' as any)).toThrow(/Expected an object/);
      });

      it('should reject an object without name', function () {
        expect(format.bind(null, { pass: 'bar' } as any)).toThrow(
          /Object must have string properties "name" and "pass"/,
        );
      });

      it('should reject an object without pass', function () {
        expect(format.bind(null, { name: 'foo' } as any)).toThrow(
          /Object must have string properties "name" and "pass"/,
        );
      });

      it('should reject an object with non-string name', function () {
        expect(format.bind(null, { name: 42, pass: 'bar' } as any)).toThrow(
          /Object must have string properties "name" and "pass"/,
        );
      });

      it('should reject an object with non-string pass', function () {
        expect(format.bind(null, { name: 'foo', pass: 42 } as any)).toThrow(
          /Object must have string properties "name" and "pass"/,
        );
      });

      it('should reject userid containing colon', function () {
        expect(format.bind(null, { name: 'foo:bar', pass: 'baz' })).toThrow(
          /must not contain a colon/,
        );
      });

      it('should reject control chars in userid', function () {
        expect(
          format.bind(null, { name: 'foo\u0000bar', pass: 'baz' }),
        ).toThrow(/must not contain control characters/);
      });

      it('should reject control chars in password', function () {
        expect(format.bind(null, { name: 'foo', pass: 'bar\u007f' })).toThrow(
          /must not contain control characters/,
        );
      });
    });
  });

  describe('with valid credentials', function () {
    it('should return header', function () {
      const header = format({ name: 'foo', pass: 'bar' });
      expect(header).toEqual('Basic Zm9vOmJhcg==');
    });
  });

  describe('with empty password', function () {
    it('should return header', function () {
      const header = format({ name: 'foo', pass: '' });
      expect(header).toEqual('Basic Zm9vOg==');
    });
  });

  describe('with empty userid', function () {
    it('should return header', function () {
      const header = format({ name: '', pass: 'pass' });
      expect(header).toEqual('Basic OnBhc3M=');
    });
  });

  describe('with empty userid and pass', function () {
    it('should return header', function () {
      const header = format({ name: '', pass: '' });
      expect(header).toEqual('Basic Og==');
    });
  });
});
