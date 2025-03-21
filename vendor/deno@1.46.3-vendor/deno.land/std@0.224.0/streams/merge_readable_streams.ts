// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
/**
 * Merge multiple streams into a single one, not taking order into account.
 * If a stream ends before other ones, the other will continue adding data,
 * and the finished one will not add any more data.
 *
 * @example
 * ```ts
 * import { mergeReadableStreams } from "https://deno.land/std@$STD_VERSION/streams/merge_readable_streams.ts";
 *
 * const stream1 = ReadableStream.from(["1", "2", "3"]);
 * const stream2 = ReadableStream.from(["a", "b", "c"]);
 *
 * // ["2", "c", "a", "b", "3", "1"]
 * await Array.fromAsync(mergeReadableStreams(stream1, stream2));
 * ```
 */
export function mergeReadableStreams<T>(
  ...streams: ReadableStream<T>[]
): ReadableStream<T> {
  const resolvePromises = streams.map(() => Promise.withResolvers<void>());
  return new ReadableStream<T>({
    start(controller) {
      let mustClose = false;
      Promise.all(resolvePromises.map(({ promise }) => promise))
        .then(() => {
          controller.close();
        })
        .catch((error) => {
          mustClose = true;
          controller.error(error);
        });
      for (const [index, stream] of streams.entries()) {
        (async () => {
          try {
            for await (const data of stream) {
              if (mustClose) {
                break;
              }
              controller.enqueue(data);
            }
            resolvePromises[index]!.resolve();
          } catch (error) {
            resolvePromises[index]!.reject(error);
          }
        })();
      }
    },
  });
}
