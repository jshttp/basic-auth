import { describe, it, assert } from 'vitest';
import { parse } from './index';

describe('parse(string)', function () {
  describe('with undefined string', function () {
    it('should return undefined', function () {
      assert.strictEqual((parse as any)(), undefined);
    });
  });

  describe('with malformed string', function () {
    it('should return undefined', function () {
      assert.strictEqual(parse('Something'), undefined);
    });
  });

  describe('with malformed scheme', function () {
    it('should return undefined', function () {
      assert.strictEqual(parse('basic_Zm9vOmJhcg=='), undefined);
    });
  });

  describe('with malformed credentials', function () {
    it('should return undefined', function () {
      assert.strictEqual(parse('basic Zm9vcgo='), undefined);
    });
  });

  describe('with valid credentials', function () {
    it('should return .name and .pass', function () {
      var creds = parse('basic Zm9vOmJhcg==');
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, 'bar');
    });
  });

  describe('with empty password', function () {
    it('should return .name and .pass', function () {
      var creds = parse('basic Zm9vOg==');
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, '');
    });
  });

  describe('with empty userid', function () {
    it('should return .name and .pass', function () {
      var creds = parse('basic OnBhc3M=');
      assert.strictEqual(creds?.name, '');
      assert.strictEqual(creds?.pass, 'pass');
    });
  });

  describe('with empty userid and pass', function () {
    it('should return .name and .pass', function () {
      var creds = parse('basic Og==');
      assert.strictEqual(creds?.name, '');
      assert.strictEqual(creds?.pass, '');
    });
  });

  describe('with colon in pass', function () {
    it('should return .name and .pass', function () {
      var creds = parse('basic Zm9vOnBhc3M6d29yZA==');
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, 'pass:word');
    });
  });

  describe('with scheme "Basic"', function () {
    it('should return .name and .pass', function () {
      var creds = parse('Basic Zm9vOmJhcg==');
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, 'bar');
    });
  });

  describe('with scheme "BASIC"', function () {
    it('should return .name and .pass', function () {
      var creds = parse('BASIC Zm9vOmJhcg==');
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, 'bar');
    });
  });

  describe('with scheme "BaSiC"', function () {
    it('should return .name and .pass', function () {
      var creds = parse('BaSiC Zm9vOmJhcg==');
      assert.strictEqual(creds?.name, 'foo');
      assert.strictEqual(creds?.pass, 'bar');
    });
  });
});
