// consolidated deprecated APIs
// ref: [Deno 1.x to 2.x Migration Guide](https://docs.deno.com/runtime/manual/advanced/migrate_deprecations)
// deno-lint-ignore-file no-namespace
// export const Deprecated = {
// 	// $deprecated: true,
// 	// $deprecated_since: '2023-11-22',
// 	// $deprecated_use_instead: 'src/lib/%24deps.cli.ts',
// 	// $deprecated_reason: 'consolidated deprecated APIs',
// 	// $deprecated_remove_after: '2024-11-22',
// 	Deno: { run: Deno.run, RunOptions: Deno.RunOptions },
// };
// import ... 'jsr:...' requires a Deno-v1.40.0+ (early use in Deno-v1.39.1+)
// import { readAll } from 'jsr:@std/io@0.224.0/read-all';
import { readAll } from "../../../../../../cdn.jsdelivr.net/gh/denoland/std@0.224.0/io/read_all.ts";
// import type { Reader as DenoReader } from 'jsr:@std/io@0.224.0/types';
// import type { Writer as DenoWriter } from 'jsr:@std/io@0.224.0/types';
// import type { WriterSync as DenoWriterSync } from 'jsr:@std/io@0.224.0/types';
import type { Closer as DenoCloser } from "../../../../../../cdn.jsdelivr.net/gh/denoland/std@0.224.0/io/types.ts";
import type { Reader as DenoReader } from "../../../../../../cdn.jsdelivr.net/gh/denoland/std@0.224.0/io/types.ts";
import type { ReaderSync as DenoReaderSync } from "../../../../../../cdn.jsdelivr.net/gh/denoland/std@0.224.0/io/types.ts";
import type { Writer as DenoWriter } from "../../../../../../cdn.jsdelivr.net/gh/denoland/std@0.224.0/io/types.ts";
import type { WriterSync as DenoWriterSync } from "../../../../../../cdn.jsdelivr.net/gh/denoland/std@0.224.0/io/types.ts";
// vendored Deno-v1 types
import * as _DenoV1NS from "../../vendor/@types/deno@1.46.3/lib.deno.ns.d.ts";
export type DenoV1RID = DenoV1NS.RID;
// type guards
export function isDenoV1(o: unknown): o is typeof DenoV1NS.Deno {
  const v = (o as {
    version?: {
      deno?: string;
    };
  })?.version?.deno;
  return !!v?.startsWith("1.");
}
export function isDenoV1RID(id: unknown): id is DenoV1NS.RID {
  return typeof id === "number";
}
export function hasCloseMethod(x: unknown): x is {
  close: () => void;
} {
  return (
    typeof x === "object" && x != null && "close" in x &&
    typeof x?.close === "function"
    // && typeof x.close() === 'undefined'
  );
}
export function hasIsTerminalMethod(x: unknown): x is {
  isTerminal: () => boolean;
} {
  return (typeof x === "object" &&
    x != null &&
    "isTerminal" in x &&
    typeof x?.isTerminal === "function" &&
    typeof x.isTerminal() === "boolean");
}
// utility functions
function tryFnOr<T>(fn: () => T, fallback: T) {
  try {
    return fn();
  } catch (_) {
    return fallback;
  }
}
function tryFn<T>(fn: () => T) {
  return tryFnOr(fn, undefined);
}
//
export const DenoV1 = isDenoV1(Deno)
  ? (Deno as unknown as typeof DenoV1NS.Deno)
  : undefined;
// export const DenoAsVx = DenoAsV1 ?? globalThis.Deno;
// ToDO: add CLI permissions options generator for various Deno versions; `generatePermissionOptions(version: string): string[]`
//   ... eg, `--unstable --allow-ffi` for Deno-v1.30.0+; to `--unstable-ffi` for Deno-v1.40.0+; to `--allow-ffi` for Deno-v2.0.0+
export const DenoVx = {
  PermissionNames: (): Deno.PermissionName[] => {
    const names: Deno.PermissionName[] = [
      "env",
      "ffi",
      "net",
      "read",
      "run",
      "sys",
      "write",
    ];
    const isDenoPreV2 = Deno.version.deno.split(".").map(Number)[0] < 2;
    // @ts-ignore -- add `hrtime` permission for Deno-v1 (removed in Deno-v2+)
    if (isDenoPreV2) {
      names.push("hrtime");
    }
    return names;
  },
  /** Close the given resource ID (`rid`) which has been previously opened, such
     * as via opening or creating a file. Closing a file when you are finished
     * with it is important to avoid leaking resources.
     *
     * ```ts
     * const file = await Deno.open("my_file.txt");
     * // do work with "file" object
     * Deno.close(file.rid);
     * ```
     *
     * It is recommended to define the variable with the `using` keyword so the
     * runtime will automatically close the resource when it goes out of scope.
     * Doing so negates the need to manually close the resource.
     *
     * ```ts
     * using file = await Deno.open("my_file.txt");
     * // do work with "file" object
     * ```
     *
     @param `id` • a resource id or object containing `close() => void` and/or `rid: number` (eg, `FsFile`)
     @category I/O
     @tags `no-panic`, `no-throw`
     */
  close: (
    // id?: globalThis.Deno.FsFile | DenoV1NS.Deno.FsFile | { rid: DenoV1RID } | DenoV1RID,
    // id?: DenoV1NS.Deno.Closer | { rid: DenoV1RID } | DenoV1RID,
    id?: {
      close(): void;
    } | {
      rid: DenoV1RID;
    } | DenoV1RID,
  ): void => {
    if (id == null) {
      return;
    }
    try {
      if (hasCloseMethod(id)) {
        return id.close();
      }
      const rid = typeof id === "number" ? id : id.rid;
      return DenoV1?.close(rid);
    } catch (_) {
      // ignore errors/panics
    }
  },
  /**
     *  Check if a given resource is a TTY (a terminal).
     *
     * ```ts
     * // This example is system and context specific
     * const nonTTY = Deno.openSync("my_file.txt").rid;
     * const nonTtyRID = nonTTY.rid;
     * const tty = Deno.openSync("/dev/tty6");
     * console.log(Deno.isatty(nonTTY)); // false
     * console.log(Deno.isatty(nonTtyRID)); // false
     * console.log(Deno.isatty(tty)); // true
     * ```
     *
     @param `id` • a resource id or object containing `isTerminal() => boolean` and/or `rid: number` (eg, `FsFile`)
     @category I/O
     @tags `no-panic`, `no-throw`
     */
  isatty: (
    id?:
      // | DenoV1NS.Deno.FsFile
      // | globalThis.Deno.FsFile
      {
        isTerminal: () => boolean;
      } | {
        rid: DenoV1RID;
      } | DenoV1RID,
  ): boolean => {
    if (id == null) {
      return false;
    }
    if (hasIsTerminalMethod(id)) {
      return tryFn(() => id.isTerminal()) ?? false;
    }
    const rid = typeof id === "number" ? id : id.rid;
    return tryFn(() => DenoV1?.isatty(rid)) ?? false;
  },
  /**
     * Read Reader `r` until EOF (`null`) and resolve to the content as `Uint8Array`.
     *
     @category I/O
     */
  readAll: DenoV1?.readAll ?? readAll,
};
// FixME: [2024-09-25; rivy] -- import { Deno as denoV1 } from 'https://github.com/denoland/deno/blob/e27a19c02c537626d7874f7521f4e39d6dfad0af/cli/tsc/dts/lib.deno.unstable.d.ts';
// import * as denoV1T from 'https://cdn.jsdelivr.net/gh/denoland/deno@e27a19c02c537626d7874f7521f4e39d6dfad0af/cli/tsc/dts/lib.deno.unstable.d.ts';
// import _denoV1 = denoV1T.Deno;
// import * as BracesT from 'https://cdn.jsdelivr.net/gh/DefinitelyTyped/DefinitelyTyped@7121cbff79/types/braces/index.d.ts';
export namespace Deprecated {
  export namespace Deno {
    // deprecated since: ...
    // use instead: ...
    // remove with: Deno v2.0.0
    // NOTE: Deno-v1.40.x (specifically v1.40.0 through v1.40.2) may produce warnings when accessing `Deno.run` and/or `rid` here (which can be suppressed with `DENO_NO_DEPRECATION_WARNINGS=1`)
    // * ref: <https://github.com/denoland/deno/commit/c62615bfe5a070c2517f3af3208d4308c72eb054>
    // @ts-ignore -- `rid` properties are "soft-removed" in Deno v2
    export const stderr = { rid: globalThis.Deno.stderr.rid };
    // @ts-ignore -- `rid` properties are "soft-removed" in Deno v2
    export const stdin = { rid: globalThis.Deno.stdin.rid };
    // @ts-ignore -- `rid` properties are "soft-removed" in Deno v2
    export const stdout = { rid: globalThis.Deno.stdout.rid };
    // @ts-ignore -- `run` is "soft-removed" in Deno v2
    export const run = DenoV1?.run ?? globalThis.Deno.run;
    export type RunOptions = DenoV1NS.Deno.RunOptions;
    export type ProcessStatus = DenoV1NS.Deno.ProcessStatus;
    export type Closer = DenoCloser;
    export type Reader = DenoReader;
    export type ReaderSync = DenoReaderSync;
    export type Writer = DenoWriter;
    export type WriterSync = DenoWriterSync;
  }
}
// export const Adapter = { isTerminal: () => };
