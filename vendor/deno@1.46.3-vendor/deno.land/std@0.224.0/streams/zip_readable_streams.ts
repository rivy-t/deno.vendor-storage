// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Merge multiple streams into a single one, taking order into account, and
 * each stream will wait for a chunk to enqueue before the next stream can
 * append another chunk. If a stream ends before other ones, the others will
 * continue adding data in order, and the finished one will not add any more
 * data.
 *
 * @example
 * ```ts
 * import { zipReadableStreams } from "https://deno.land/std@$STD_VERSION/streams/zip_readable_streams.ts";
 *
 * const stream1 = ReadableStream.from(["1", "2", "3"]);
 * const stream2 = ReadableStream.from(["a", "b", "c"]);
 * const zippedStream = zipReadableStreams(stream1, stream2);
 *
 * await Array.fromAsync(zippedStream); // ["1", "a", "2", "b", "3", "c"];
 * ```
 */
export function zipReadableStreams<T>(
  ...streams: ReadableStream<T>[]
): ReadableStream<T> {
  const readers = new Set(streams.map((s) => s.getReader()));
  return new ReadableStream<T>({
    async start(controller) {
      try {
        let resolved = 0;
        while (resolved !== streams.length) {
          for (const reader of readers) {
            const { value, done } = await reader.read();
            if (!done) {
              controller.enqueue(value!);
            } else {
              resolved++;
              readers.delete(reader);
            }
          }
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}
