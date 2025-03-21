// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { toReadableStream } from "../io/to_readable_stream.ts";
import type { Closer, Reader } from "../io/types.ts";
export type { Closer };
/**
 * Options for {@linkcode readableStreamFromReader}.
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode toReadableStream} instead.
 */
export interface ReadableStreamFromReaderOptions {
  /** If the `reader` is also a `Closer`, automatically close the `reader`
   * when `EOF` is encountered, or a read error occurs.
   *
   * @default {true}
   */
  autoClose?: boolean;
  /** The size of chunks to allocate to read, the default is ~16KiB, which is
   * the maximum size that Deno operations can currently support. */
  chunkSize?: number;
  /** The queuing strategy to create the `ReadableStream` with. */
  strategy?: {
    highWaterMark?: number | undefined;
    size?: undefined;
  };
}
/**
 * Create a {@linkcode ReadableStream} of {@linkcode Uint8Array}s from a
 * {@linkcode Reader}.
 *
 * When the pull algorithm is called on the stream, a chunk from the reader
 * will be read.  When `null` is returned from the reader, the stream will be
 * closed along with the reader (if it is also a `Closer`).
 *
 * An example converting a `Deno.FsFile` into a readable stream:
 *
 * ```ts
 * import { readableStreamFromReader } from "https://deno.land/std@$STD_VERSION/streams/readable_stream_from_reader.ts";
 *
 * const file = await Deno.open("./file.txt", { read: true });
 * const fileStream = readableStreamFromReader(file);
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode toReadableStream} instead.
 */
export function readableStreamFromReader(
  reader: Reader | (Reader & Closer),
  options: ReadableStreamFromReaderOptions = {},
): ReadableStream<Uint8Array> {
  return toReadableStream(reader, options);
}
