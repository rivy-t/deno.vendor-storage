// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Merge multiple streams into a single one, taking order into account, and each stream
 * will wait for a chunk to enqueue before the next stream can append another chunk.
 * If a stream ends before other ones, the others will be cancelled.
 *
 * @example
 * ```ts
 * import { earlyZipReadableStreams } from "https://deno.land/std@$STD_VERSION/streams/early_zip_readable_streams.ts";
 *
 * const stream1 = ReadableStream.from(["1", "2", "3"]);
 * const stream2 = ReadableStream.from(["a", "b", "c"]);
 * const zippedStream = earlyZipReadableStreams(stream1, stream2);
 *
 * await Array.fromAsync(zippedStream); // ["1", "a", "2", "b", "3", "c"];
 * ```
 */
export function earlyZipReadableStreams<T>(
  ...streams: ReadableStream<T>[]
): ReadableStream<T> {
  const readers = streams.map((s) => s.getReader());
  return new ReadableStream<T>({
    async start(controller) {
      try {
        loop: while (true) {
          for (const reader of readers) {
            const { value, done } = await reader.read();
            if (!done) {
              controller.enqueue(value!);
            } else {
              await Promise.all(readers.map((reader) => reader.cancel()));
              break loop;
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
