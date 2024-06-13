// https://mswjs.io/docs/faq/#requestresponsetextencoder-is-not-defined-jest
// https://github.com/mswjs/msw/discussions/1934
const { TextDecoder, TextEncoder, ReadableStream } = require('node:util');

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
});

const { fetch, Headers, Request, Response } = require('undici');

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Headers: { value: Headers },
  Request: { value: Request },
  Response: { value: Response },
});
