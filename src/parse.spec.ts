import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { base64 } from './base64.js';
import { parse } from './index.js';

describe('parse(string)', function () {
  describe('with non string', function () {
    it('should throw', function () {
      expect(() => parse(undefined as any)).toThrow(/Expected a string/);
    });
  });

  describe('with malformed string', function () {
    it('should return undefined', function () {
      expect(parse('Something')).toEqual(undefined);
    });
  });

  describe('with malformed scheme', function () {
    it('should return undefined', function () {
      expect(parse('basic_Zm9vOmJhcg==')).toEqual(undefined);
    });
  });

  describe('with malformed credentials', function () {
    it('should return undefined', function () {
      expect(parse('basic Zm9vcgo=')).toEqual(undefined);
    });
  });

  describe('with non-base64 characters', function () {
    it.each(['.', '_', '~', '-', '!'])(
      'should reject embedded %j',
      function (character) {
        expect(parse(`Basic Zm9v${character}OmJhcg==`)).toEqual(undefined);
      },
    );

    it.each(['77-_Og==', '77-9Og==', '77+/Og==!'])(
      'should reject %j',
      function (credentials) {
        expect(parse(`Basic ${credentials}`)).toEqual(undefined);
      },
    );
  });

  describe('with standard base64 alphabet symbols', function () {
    it('should accept plus and slash', function () {
      expect(parse('Basic 77+/Og==')).toEqual({
        name: '\uffff',
        pass: '',
      });
    });
  });

  describe('with valid credentials', function () {
    it('should return .name and .pass', function () {
      expect(parse('basic Zm9vOmJhcg==')).toEqual({ name: 'foo', pass: 'bar' });
    });
  });

  describe('with unpadded credentials', () => {
    it.each([
      ['Zm9vOg', 'foo', ''],
      ['Zm9vOmI', 'foo', 'b'],
      ['Zm9vOmJh', 'foo', 'ba'],
    ])('accepts %j', (encoded, name, pass) => {
      expect(parse(`Basic ${encoded}`)).toEqual({ name, pass });
    });
  });

  describe('with empty password', function () {
    it('should return .name and .pass', function () {
      expect(parse('basic Zm9vOg==')).toEqual({ name: 'foo', pass: '' });
    });
  });

  describe('with empty userid', function () {
    it('should return .name and .pass', function () {
      expect(parse('basic OnBhc3M=')).toEqual({ name: '', pass: 'pass' });
    });
  });

  describe('with empty userid and pass', function () {
    it('should return .name and .pass', function () {
      expect(parse('basic Og==')).toEqual({ name: '', pass: '' });
    });
  });

  describe('with colon in pass', function () {
    it('should return .name and .pass', function () {
      expect(parse('basic Zm9vOnBhc3M6d29yZA==')).toEqual({
        name: 'foo',
        pass: 'pass:word',
      });
    });
  });

  describe('with scheme "Basic"', function () {
    it('should return .name and .pass', function () {
      expect(parse('Basic Zm9vOmJhcg==')).toEqual({ name: 'foo', pass: 'bar' });
    });
  });

  describe('with scheme "BASIC"', function () {
    it('should return .name and .pass', function () {
      expect(parse('BASIC Zm9vOmJhcg==')).toEqual({ name: 'foo', pass: 'bar' });
    });
  });

  describe('with scheme "BaSiC"', function () {
    it('should return .name and .pass', function () {
      expect(parse('BaSiC Zm9vOmJhcg==')).toEqual({ name: 'foo', pass: 'bar' });
    });
  });
});

describe('base64 structure', () => {
  beforeEach(() => {
    vi.spyOn(base64, 'decode').mockImplementation(() => {
      throw new Error('Malformed base64 must be rejected before decoding');
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    'Y',
    'Zm9vOmJhcgYYY',
    'Zm9vOg=',
    'Zm9vOg===',
    'Zm9vOg====',
    'Zm9vOg======',
    'Zm9vOg========',
    'Zm9vOmJh========',
    'Zm9vOmI==',
    'Zm9vOmJh=',
    'Zm9vOmJh====',
    'Zm9v=OmJhcg==',
  ])('rejects malformed base64 %j', (encoded) => {
    expect(parse(`Basic ${encoded}`)).toEqual(undefined);
    expect(base64.decode).not.toHaveBeenCalled();
  });
});
