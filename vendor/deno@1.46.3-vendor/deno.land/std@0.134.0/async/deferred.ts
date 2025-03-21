// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
// TODO(ry) It'd be better to make Deferred a class that inherits from
// Promise, rather than an interface. This is possible in ES2016, however
// typescript produces broken code when targeting ES5 code.
// See https://github.com/Microsoft/TypeScript/issues/15202
// At the time of writing, the github issue is closed but the problem remains.
export interface Deferred<T> extends Promise<T> {
  readonly state: "pending" | "fulfilled" | "rejected";
  resolve(value?: T | PromiseLike<T>): void;
  // deno-lint-ignore no-explicit-any
  reject(reason?: any): void;
}
/** Creates a Promise with the `reject` and `resolve` functions
 * placed as methods on the promise object itself. It allows you to do:
 *
 * ```ts
 *     import { deferred } from "./deferred.ts";
 *
 *     const p = deferred<number>();
 *     // ...
 *     p.resolve(42);
 * ```
 */
export function deferred<T>(): Deferred<T> {
  let methods;
  let state = "pending";
  const promise = new Promise<T>((resolve, reject): void => {
    methods = {
      async resolve(value: T | PromiseLike<T>) {
        await value;
        state = "fulfilled";
        resolve(value);
      },
      // deno-lint-ignore no-explicit-any
      reject(reason?: any) {
        state = "rejected";
        reject(reason);
      },
    };
  });
  Object.defineProperty(promise, "state", { get: () => state });
  return Object.assign(promise, methods) as Deferred<T>;
}
