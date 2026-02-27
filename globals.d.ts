// Adapted from file://./node_modules/typescript/lib/lib.dom.d.ts so we don't have to include the entire DOM lib
// Ref: https://github.com/microsoft/TypeScript/issues/31535, https://github.com/microsoft/TypeScript/issues/41727, https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1685

/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/atob) */
declare function atob(data: string): string;
/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/btoa) */
declare function btoa(data: string): string;

type AllowSharedBufferSource =
  | ArrayBufferLike
  | ArrayBufferView<ArrayBufferLike>;

interface TextDecodeOptions {
  stream?: boolean;
}

interface TextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

/**
 * The **`TextDecoder`** interface represents a decoder for a specific text encoding, such as `UTF-8`, `ISO-8859-2`, `KOI8-R`, `GBK`, etc.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder)
 */
interface TextDecoder extends TextDecoderCommon {
  /**
   * The **`TextDecoder.decode()`** method returns a string containing text decoded from the buffer passed as a parameter.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/decode)
   */
  decode(input?: AllowSharedBufferSource, options?: TextDecodeOptions): string;
}

// eslint-disable-next-line no-var
declare var TextDecoder: {
  prototype: TextDecoder;
  new (label?: string, options?: TextDecoderOptions): TextDecoder;
};

interface TextEncoderEncodeIntoResult {
  read: number;
  written: number;
}

/**
 * TextEncoder takes a stream of code points as input and emits a stream of UTF-8 bytes.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder)
 */
interface TextEncoder extends TextEncoderCommon {
  /**
   * Returns the result of running UTF-8's encoder.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder/encode)
   */
  encode(input?: string): Uint8Array;
  /**
   * Runs UTF-8's encoder on source, stores the result of that operation into destination, and returns the progress made as an object.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder/encodeInto)
   */
  encodeInto(
    source: string,
    destination: Uint8Array,
  ): TextEncoderEncodeIntoResult;
}

// eslint-disable-next-line no-var
declare var TextEncoder: {
  prototype: TextEncoder;
  new (): TextEncoder;
};

interface TextDecoderCommon {
  /**
   * Returns encoding's name, lowercased.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/encoding)
   */
  readonly encoding: string;
  /**
   * Returns true if error mode is "fatal", otherwise false.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/fatal)
   */
  readonly fatal: boolean;
  /**
   * Returns the value of ignore BOM.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextDecoder/ignoreBOM)
   */
  readonly ignoreBOM: boolean;
}

interface TextEncoderCommon {
  /**
   * Returns "utf-8".
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextEncoder/encoding)
   */
  readonly encoding: string;
}
