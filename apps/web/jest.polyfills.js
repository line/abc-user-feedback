// https://github.com/mswjs/msw/issues/1916
const { TextDecoder, TextEncoder } = require('node:util');
const { ReadableStream } = require('node:stream/web'); // <--- this did the magic

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
});

const { Blob, File } = require('node:buffer');
const { fetch, Response, Request, FormData, Headers } = require('undici');

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response },
});
