//== * SHARED exports
// spell-checker:ignore (fns) chdir
// spell-checker:ignore (env) WSL WSLENV
// spell-checker:ignore (jargon) distro falsey truthy
// spell-checker:ignore (js/ts) gmsu
// spell-checker:ignore (names) Alacritty Cmder ConEmu Deno EditorConfig JSdelivr
// spell-checker:ignore (modules) stringz
// spell-checker:ignore (shell/WinOS) CONIN CONOUT
// spell-checker:ignore (yargs) positionals
import { DenoVx, Deprecated } from "./$deprecated.ts";
import { $colors, $fs, $path } from "./$deps.ts";
import { atImportPermissions, atImportPermitCWD } from "./$shared.TLA.ts";
//===
/** Indicates whether host platform is a Windows OS. */
export const fnIsWinOS: () => boolean = () => {
  // deno-lint-ignore no-explicit-any
  const global: any = globalThis;
  return (global.Deno?.build.os === "windows" ||
    global.navigator?.platform?.startsWith("Win") ||
    global.process?.platform?.startsWith("win") ||
    false);
};
export const isWinOS = fnIsWinOS();
//===
// ref: <https://en.wikipedia.org/wiki/Uniform_Resource_Identifier> , <https://stackoverflow.com/questions/48953298/whats-the-difference-between-a-scheme-and-a-protocol-in-a-url>
export type PathPlatform = "POSIX" | "WinOS";
export const pathPlatforms: PathPlatform[] = ["POSIX", "WinOS"];
export type ForPathPlatform = "host" | PathPlatform;
export type PathAndUrlOptions = {
  enablePanicReturns?: boolean; // enable panic returns (ie, throw from functions for errors)
  // * options.fileStemMayMatchDevice == true ~ inclusive, non-strict matching == will match if file prefix/stem matches any of `specialDeviceStemNames` (Win10-style [or earlier] compatible matching)
  // * options.fileStemMayMatchDevice == false ~ strict matching == only complete file name may match any of `specialDeviceStemNames` (Win11-style [or later] compatible matching)
  fileStemMayMatchDevice?: boolean; // allow file stem to match device name (eg, 'C:' or '\\\\server\\share')
  platform?: ForPathPlatform; // assumed platform for platform/OS-specific path/URL handling
  singleLetterSchemeAsDrive?: boolean | "WinOS-only"; // interpret single letter URL schemes as drive letters (needed for Windows-style paths)
};
const PathAndUrlOptionsDefault: Required<PathAndUrlOptions> = {
  enablePanicReturns: false,
  fileStemMayMatchDevice:
    true, /* file prefix/stem may match `special devices` (Win10-style) */
  platform: "host",
  singleLetterSchemeAsDrive: true,
};
//===
export const projectName: string | undefined = "dxx";
export const VERSION = "0.0.16";
// note: `projectURL` has some inherent instability for compiled scripts; this can be mitigated by using a CDN source for the compilation (eg, JSdelivr.net, Statically.io, GitHack.com)
export const projectURL = new URL("../..", import.meta.url); // note: `new URL('.', ...)` => dirname(...); `new URL('..', ...) => dirname(dirname(...))
export const projectPath = pathFromURL(projectURL);
export const projectLocations = {
  benchmarks: new URL("bench", projectURL),
  changelog: new URL("CHANGELOG.mkd", projectURL),
  editorconfig: new URL(".editorconfig", projectURL),
  examples: new URL("eg", projectURL),
  licenses: [new URL("LICENSE", projectURL)],
  readme: new URL("README.md", projectURL),
  source: new URL("src", projectURL),
  tests: new URL("tests", projectURL),
  vendor: new URL("vendor", projectURL),
  version: new URL("VERSION", projectURL),
};
// // ToDO: investigate best practice for portability of PATH_SEP_PATTERN // note: WinOS => /[\\/]+/ ; *nix => /\/+/
// // * currently, treating paths as WinOS-compatible with both backslash and forward-slash as path separators (on both WinOS and *nix platforms)
// export const PATH_SEP_PATTERN = /[\\/]+/;
//===
// export const atImportPermissions = await permitsAsync();
// ref: <https://medium.com/deno-the-complete-reference/textencoder-and-textdecoder-in-deno-cfca83be1792> @@ <https://archive.is/tO0rE>
// export { decode, encode } from 'https://deno.land/std@0.85.0/encoding/utf8.ts'; // 'utf8.ts' was removed via commit 5bc18f5d86
export const decoder = new TextDecoder(); // default == 'utf-8'
export const encoder = new TextEncoder(); // *always* 'utf-8'
export const decode = (input?: Uint8Array): string => decoder.decode(input);
export const encode = (input?: string): Uint8Array => encoder.encode(input);
//=== * stack inspection functions
function getFramesFromError(error: Error): Array<string> {
  let stack: Error["stack"] | null = null;
  let frames: string[];
  // // retrieve stack from `Error`
  // // ref: <https://github.com/winstonjs/winston/issues/401#issuecomment-61913086>
  // try {
  stack = error.stack;
  // } catch (e) {
  // 	try {
  // 		const previous = e?.__previous__ || e?.__previous;
  // 		stack = previous && previous.stack;
  // 	} catch (_) {
  // 		stack = null;
  // 	}
  // }
  // handle different stack formats
  if (stack) {
    if (Array.isArray(stack)) {
      frames = Array(stack);
    } else {
      frames = stack.toString().split("\n");
    }
  } else {
    frames = [];
  }
  // console.debug({ stack, frames });
  return frames;
}
function stackTrace() {
  // ref: <https://stackoverflow.com/questions/591857/how-can-i-get-a-javascript-stack-trace-when-i-throw-an-exception>
  // ref: [`get-current-line`](https://github.com/bevry/get-current-line/blob/9364df5392c89e9540314787493dbe142e8ce99d/source/index.ts)
  return getFramesFromError(new Error("stack trace"));
}
export function callersFromStackTrace() {
  const callers = stackTrace()
    .slice(1)
    .map((s) => {
      const match = s.match(/^.*\s[(]?(.*?)[)]?$/m);
      if (!match) {
        return undefined;
      }
      return match[1];
    })
    .filter(Boolean);
  return callers;
}
//====
function zip<T extends string | number | symbol, U>(a: T[], b: U[]) {
  const c: Record<T, U> = {} as Record<T, U>;
  a.map((e: T, idx: number) => (c[e] = b[idx]));
  return c;
}
const DenoPermissionNames: Deno.PermissionName[] = DenoVx.PermissionNames();
// FixME: [2024-09-25; rivy] revise permits functions to allow for optional configuration parameters for each permission
export function permitsSync(
  names: Deno.PermissionName[] = DenoPermissionNames,
) {
  const permits: Record<Deno.PermissionName, Deno.PermissionStatus> = zip(
    names,
    names
      .map((name) => Deno.permissions?.querySync?.({ name }))
      .map((e) => e ?? { state: "granted", onchange: null }),
  );
  return permits;
}
export async function havePermit(permitName: Deno.PermissionName) {
  const names = [permitName];
  const permits =
    (await Promise.all(names.map((name) => Deno.permissions?.query({ name }))))
      .map((e) => e ?? { state: "granted", onchange: null });
  const allGranted = !permits.find((permit) => permit.state !== "granted");
  return allGranted;
}
export async function haveAllPermits(permitNames: Deno.PermissionName[]) {
  const permits = (await Promise.all(
    permitNames.map((name) => Deno.permissions?.query({ name })),
  )).map((e) => e ?? { state: "granted", onchange: null });
  const allGranted = !permits.find((permit) => permit.state !== "granted");
  return allGranted;
}
export async function haveMissingPermits(
  permitNames: Deno.PermissionName[] = [],
) {
  return await haveUnGrantedPermits(permitNames);
}
export async function haveUnGrantedPermits(
  permitNames: Deno.PermissionName[] = [],
) {
  // ToDO: [2023-09-09; rivy] consider deduplication of `permitNames` contents
  const permits = (await Promise.all(
    permitNames.map((name) => Deno.permissions?.query({ name })),
  )).map((e) => e ?? { state: "granted", onchange: null });
  const allGranted = !permits.find((permit) => permit.state !== "granted");
  return !allGranted;
}
export async function unGrantedPermits(
  permitNames: Deno.PermissionName[] = [],
) {
  const permits = await Promise.all(permitNames.map(async (name) => {
    return { name, permitStatus: await Deno.permissions?.query({ name }) };
  }));
  const missing = permits
    .filter((permit) => permit.permitStatus.state !== "granted")
    .map((permit) => permit.name);
  return missing;
}
export function havePermitSync(permitName: Deno.PermissionName) {
  const names = [permitName];
  const permits = names
    .map((name) => Deno.permissions?.querySync?.({ name }))
    .map((e) => e ?? { state: "granted", onchange: null });
  const allGranted = !permits.find((permit) => permit.state !== "granted");
  return allGranted;
}
export function haveAllPermitsSync(permitNames: Deno.PermissionName[]) {
  const permits = permitNames
    .map((name) => Deno.permissions?.querySync?.({ name }))
    .map((e) => e ?? { state: "granted", onchange: null });
  const allGranted = !permits.find((permit) => permit.state !== "granted");
  return allGranted;
}
export function haveMissingPermitsSync(
  permitNames: Deno.PermissionName[] = [],
) {
  return haveUnGrantedPermitsSync(permitNames);
}
export function haveUnGrantedPermitsSync(
  permitNames: Deno.PermissionName[] = [],
) {
  // ToDO: [2023-09-09; rivy] consider deduplication of `permitNames` contents
  const permits = permitNames
    .map((name) => Deno.permissions?.querySync?.({ name }))
    .map((e) => e ?? { state: "granted", onchange: null });
  const allGranted = !permits.find((permit) => permit.state !== "granted");
  return !allGranted;
}
export function unGrantedPermitsSync(permitNames: Deno.PermissionName[] = []) {
  const permits = permitNames.map((name) => {
    return { name, permitStatus: Deno.permissions?.querySync?.({ name }) };
  });
  const missing = permits
    .filter((permit) => permit.permitStatus.state !== "granted")
    .map((permit) => permit.name);
  return missing;
}
function composeMissingPermitsMessage(permitNames: Deno.PermissionName[] = []) {
  /** Sorted, non-duplicated, permission names (used for flag generation) */
  const flagNames = permitNames.length > 0
    ? [...new Set(permitNames.sort())]
    : ["all"];
  const plural = flagNames.length > 1;
  const msg = `Missing required permission${
    plural ? "s" : ""
  }; re-run with required permission${plural ? "s" : ""} (${
    flagNames.map((name) => $colors.green(`\`--allow-${name}\``)).join(", ")
  })`;
  return msg;
}
export async function abortIfMissingPermits(
  permitNames: Deno.PermissionName[] = [],
  options?: {
    exitCode?: number;
    label?: string;
    writer?: (...args: unknown[]) => void;
  },
) {
  options = options != null ? options : {};
  options.exitCode ??= 1;
  // const callers = callersFromStackTrace();
  // const top = callers[callers.length - 1];
  // const url = top?.replace(/(:\d+:\d+)$/, ''); // remove trailing position info (LINE_N:CHAR_POSITION)
  // const name = $path.parse(url ?? '').name;
  if (options.writer == null) {
    options.writer = (args) =>
      console.error(
        $colors.bgRed(
          $colors.bold(` ${options?.label ? `${options.label}:` : ""}ERR! `),
        ),
        $colors.red("*"),
        args,
      );
  }
  // console.warn({ options });
  // console.warn({ callers, top, url, name });
  const missing = await unGrantedPermits(permitNames);
  if (missing.length > 0) {
    options.writer(composeMissingPermitsMessage(missing));
    Deno.exit(options.exitCode);
  }
}
export function abortIfMissingPermitsSync(
  permitNames: Deno.PermissionName[] = [],
  options?: {
    exitCode?: number;
    label?: string;
    writer?: (...args: unknown[]) => void;
  },
) {
  options = options != null ? options : {};
  options.exitCode ??= 1;
  // const callers = callersFromStackTrace();
  // const top = callers[callers.length - 1];
  // const url = top?.replace(/(:\d+:\d+)$/, ''); // remove trailing position info (LINE_N:CHAR_POSITION)
  // const name = $path.parse(url ?? '').name;
  if (options.writer == null) {
    options.writer = (args) =>
      console.error(
        $colors.bgRed(
          $colors.bold(` ${options?.label ? `${options.label}:` : ""}ERR! `),
        ),
        $colors.red("*"),
        args,
      );
  }
  // console.warn({ options });
  // console.warn({ callers, top, url, name });
  const missing = unGrantedPermitsSync(permitNames);
  if (missing.length > 0) {
    options.writer(composeMissingPermitsMessage(missing));
    Deno.exit(options.exitCode);
  }
}
export async function panicIfMissingPermits(
  permitNames: Deno.PermissionName[] = [],
) {
  const missing = await unGrantedPermits(permitNames);
  if (missing.length > 0) {
    const err = new Error(composeMissingPermitsMessage(missing));
    err.stack = undefined;
    throw err;
  }
}
export function panicIfMissingPermitsSync(
  permitNames: Deno.PermissionName[] = [],
) {
  const missing = unGrantedPermitsSync(permitNames);
  if (missing.length > 0) {
    const err = new Error(composeMissingPermitsMessage(missing));
    err.stack = undefined;
    throw err;
  }
}
//===
const DQ = '"';
const SQ = `'`;
// const DQStringReS = `${DQ}[^${DQ}]*(?:${DQ}|$)`; // double-quoted string (unbalanced at end-of-line is allowed)
// const SQStringReS = `${SQ}[^${SQ}]*(?:${SQ}|$)`; // single-quoted string (unbalanced at end-of-line is allowed)
// const DQStringStrictReS = '"[^"]*"'; // double-quoted string (quote balance is required)
// const SQStringStrictReS = "'[^']*'"; // single-quoted string (quote balance is required)
const deDQStringReS = `${DQ}([^${DQ}]*)(?:${DQ}|$)`; // sub-match/extractor for contents of double-quoted string (unbalanced at end-of-line is allowed)
const deSQStringReS = `${SQ}([^${SQ}]*)(?:${SQ}|$)`; // sub-match/extractor for contents of single-quoted string (unbalanced at end-of-line is allowed)
const deQuoteRx = new RegExp(
  `([^${DQ}${SQ}]+)|${deDQStringReS}|${deSQStringReS}`,
  "gmsu",
);
// `deQuote()`
/** Remove quotes from text string (`s`). */
export function deQuote(s?: string) {
  if (!s) {
    return s;
  }
  return s.replace(deQuoteRx, "$1$2$3");
}
//===
export const atImportCWD = (() => {
  const permit = atImportPermitCWD ||
    Deno?.permissions?.querySync?.({ name: "read", path: "." })?.state ===
      "granted";
  return tryFn(() => (permit ? Deno.cwd() : undefined));
})();
// `cwd()`
/** Return the value of the current working directory (or `undefined` for errors or not allowed access).
* - will *not panic*
* - will *not prompt* for permission if `options.guard` is `true`
@param options `{ guard }` • verify unrestricted CWD access permission prior to access attempt (avoids Deno prompts/panics); defaults to `true`
@tags `no-panic`, `no-throw` ; `no-prompt` ; `allow-read=.`
*/
export function cwd(options?: {
  guard: boolean;
}) {
  const guard = options?.guard ?? true;
  const useDenoCWD = !guard ||
    Deno?.permissions?.querySync?.({ name: "read", path: "." })?.state ===
      "granted";
  return tryFn(() => (useDenoCWD ? Deno.cwd() : undefined));
}
// `cwdOfDrive()`
/** Return the value of the current working directory for `drive` (or `undefined` for errors or not allowed access).
* - will *not panic*
* - will *not prompt* for permission if `options.guard` is `true`
@param drive • target drive letter (eg, `'C'`)
@param options `{ guard }` • verify unrestricted CWD access permission prior to access attempt (avoids Deno prompts/panics); defaults to `true`
@tags `no-panic`, `no-throw` ; `no-prompt` ; `allow-env` or `allow-read=.,DRIVE:`
*/
export function cwdOfDrive(drive?: string | null, options?: {
  guard: boolean;
}) {
  // when possible, use (faster, but undocumented) environment variable `%=X:%` to peek at the current drive letter path instead of using `chdir('X:')`; using `Deno.env.toObject()['=X:']`
  // ... ref: <https://superuser.com/questions/1655266/a-complete-list-of-relative-paths-variables-in-windows-explorer-in-windows> @@ <https://archive.is/3hzVa>
  // ... ref: <https://stackoverflow.com/a/46019856/43774> @@ <https://archive.is/ghmY3>
  drive = drive?.slice(0, 1);
  const guard = options?.guard ?? true;
  const useDenoEnv = drive != null &&
    (!guard ||
      Deno?.permissions?.querySync?.({ name: "env", variable: `=${drive}:` })
          ?.state === "granted");
  drive = drive?.toLocaleUpperCase(); // for consistency, always use uppercase drive letter
  // console.warn('cwdOfDrive()', { drive, useDenoEnv });
  if (useDenoEnv) {
    const env = tryFn(() => Deno.env.toObject());
    if (env != null) {
      const containsDriveCWDs = Object.keys(env)?.find((v) =>
        v.match(/^[=]?[A-Z]:$/)
      ) != null;
      const path = containsDriveCWDs
        ? env[`=${drive}:`] ?? `${drive}:\\`
        : undefined;
      if (path != null) {
        return path;
      }
    }
  }
  // * verify CWD is accessible
  const CWD = cwd(options);
  if (CWD == null) {
    return undefined;
  }
  if (drive == null) {
    return CWD;
  }
  // console.warn('cwdOfDrive()', { drive, guard, useDenoEnv, CWD });
  return tryFn(() => {
    // console.warn('cwdOfDrive()', { drive, CWD });
    // * verify chdir(CWD) works
    if (!chdir(CWD, options)) {
      return undefined;
    }
    if (!chdir(`${drive}:`, options)) {
      return undefined;
    }
    const targetCWD = Deno.cwd();
    // console.warn('cwdOfDrive()', { drive, CWD, targetCWD });
    chdir(CWD);
    return targetCWD;
  });
}
// `chdir()`
/** Return `true` after successful `Deno.chdir()` or `false` for errors or not allowed access.
* - will *not panic*
* - will *not prompt* for permission if `options.guard` is `true`
@param options `{ guard }` • verify unrestricted CWD access permission *at time of module import* prior to access attempt (avoids Deno prompts/panics); defaults to `true`
@tags `no-panic`, `no-throw` ; `no-prompt` ; `allow-read=TARGET_DIRECTORY`
*/
export function chdir(directory?: string | URL, options?: {
  guard: boolean;
}) {
  if (directory == null || directory === "") {
    return false;
  }
  const guard = options != null ? options.guard : true;
  const permit = !guard ||
    Deno?.permissions?.querySync?.({ name: "read", path: directory })?.state ===
      "granted";
  // console.warn('chdir()', { directory, guard, permit });
  return tryFnOr(() => {
    if (!permit) {
      return false;
    }
    Deno.chdir(directory);
    return true;
  }, false);
}
//===
let envObject: Record<string, string> | undefined = undefined;
// `env()`
/** Return the value of the environment variable `varName` (or `undefined` if non-existent or not allowed access).
* - will *not panic*
* - will *not prompt* for permission if `options.guard` is `true`
@param options `{ guard }` • verify unrestricted environment access permission *at time of module import* prior to access attempt (avoids Deno prompts/panics); defaults to `true`
@tags `no-panic`, `no-throw` ; `no-prompt`
@tags `allow-env[=...]`
*/
export function env(varName: string, options?: {
  guard: boolean;
}) {
  const guard = options != null ? options.guard : true;
  const permit = !guard ||
    atImportPermissions.env.state === "granted" ||
    Deno.permissions?.querySync?.({ name: "env", variable: varName })?.state ===
      "granted";
  const permitEnvAll = !guard ||
    atImportPermissions.env.state === "granted" ||
    Deno.permissions?.querySync?.({ name: "env" })?.state === "granted";
  if (permit) {
    return tryFnOr(
      () => Deno.env.get(varName),
      permitEnvAll
        ? tryFn(() => {
          if (envObject == null) {
            envObject = Deno.env.toObject();
          }
          return envObject[varName];
        })
        : undefined,
    );
  }
  return undefined;
}
// `envAsync()`
/** Return the current value of the environment variable `varName` (or `undefined` if non-existent or not allowed access).
* - will *not panic*
* - will *not prompt* for permission if `options.guard` is `true`
@param options `{ guard }` • verify current and name-specific environment access permission prior to access attempt (avoids Deno prompts/panics); defaults to `true`
@tags `no-panic`, `no-throw` ; `no-prompt`
@tags `allow-env[=...]`
*/
export async function envAsync(varName: string, options?: {
  guard: boolean;
}) {
  const guard = options != null ? options.guard : true;
  const permit = !guard ||
    atImportPermissions.env.state === "granted" ||
    (await Deno.permissions?.query?.({ name: "env", variable: varName }))
        ?.state === "granted";
  const permitEnvAll = !guard ||
    atImportPermissions.env.state === "granted" ||
    (await Deno.permissions?.query?.({ name: "env" }))?.state === "granted";
  if (permit) {
    return tryFnOr(
      () => Deno.env.get(varName),
      permitEnvAll
        ? tryFn(() => {
          if (envObject == null) {
            envObject = Deno.env.toObject();
          }
          return envObject[varName];
        })
        : undefined,
    );
  }
  return undefined;
}
//===
// `denoOpenSyncNT()`
/** Open a file specified by `path`, using `options`.
*
* `path` is normalized prior to use.
*
* - will *not panic*
* - will *not prompt* for permission if `options.guard` is `true` (which is the default)
*
* * _`no-throw`_ function (returns `undefined` upon any error)
*
* * _NOTE_: for WinOS, the _`--allow-all`_ permission is required for access to network/UNC and device paths; [2024-10-05; rivy] refs: <https://github.com/denoland/deno/pull/25132> , <https://github.com/denoland/deno/issues/24703>.
*
@param options `{ guard }` • verify read/write permissions prior to access attempt (avoids Deno prompts/panics); defaults to `true`
@tags `no-panic`, `no-throw` ; `no-prompt` ; `allow-env`
*/
export function denoOpenSyncNT(
  path?: string | URL,
  options?: Deno.OpenOptions & {
    guard?: boolean;
  },
) {
  // no-throw `Deno.openSync(..)`
  path = intoPath(path);
  options = options ?? { read: true };
  const guard = options.guard ?? true;
  if (path == null || path === "") {
    return undefined;
  }
  if (
    !guard &&
    options.read &&
    Deno.permissions?.querySync?.({ name: "read", path })?.state !== "granted"
  ) {
    return undefined;
  }
  if (
    !guard &&
    (options.write || options.append) &&
    Deno.permissions?.querySync?.({ name: "write", path })?.state !== "granted"
  ) {
    return undefined;
  }
  // console.warn({ path, options, guard });
  try {
    return Deno.openSync(path, options);
  } catch {
    // avoid panics
    // * includes catching 'NotCapable' panics (eg, for network/UNC or device paths on WinOS without `--allow-all`); ref: <https://github.com/denoland/deno/issues/26045>
    return undefined;
  }
}
//===
export function ifThenElse<T>(
  condition: boolean,
  ifTrue: T | (() => T),
  ifFalse: T | (() => T),
) {
  if (condition) {
    return typeof ifTrue === "function" ? (ifTrue as () => T)() : ifTrue;
  }
  return typeof ifFalse === "function" ? (ifFalse as () => T)() : ifFalse;
}
export function ifThen<T>(condition: boolean, ifTrue: T | (() => T)) {
  return ifThenElse(condition, ifTrue, undefined);
}
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
//===
// `isFileURL()`
/** Determine if `url` is a file-type URL (ie, uses the 'file:' protocol), naming a local file resource. */
export function isFileURL(url: URL) {
  return url.protocol === "file:";
}
// `isValidURL()`
/** Determine if the supplied text string (`s`) is a valid URL, relative to an optional `base` URL. */
export function isValidURL(s: string, base?: URL, options?: PathAndUrlOptions) {
  return !!validURL(s, base, options);
}
// `validURL()`
/** Convert the supplied text string (`s`) into a valid URL, relative to an optional `base` URL (`undefined` if `s` [relative to `base`] isn't a valid URL).
* * `no-throw` ~ function returns `undefined` upon any error
@tags `no-panic`, `no-throw`, `no-prompt`
*/
export function validURL(s: string, base?: URL, options?: PathAndUrlOptions) {
  return intoURL(s, base, options);
}
//===
// `pathIsAbsolute()`
export function pathIsAbsolute(path: string, options?: PathAndUrlOptions) {
  options = { ...PathAndUrlOptionsDefault, ...options };
  const $platformPath = options.platform === "WinOS"
    ? $path.win32
    : $path.posix;
  path = path.replace(/^[/\\][/\\][.?][/\\]/, "");
  return $platformPath.isAbsolute(path);
}
export function pathIsAbsoluteWithDrive(
  path: string,
  options?: PathAndUrlOptions,
) {
  return path.match(/^[A-Za-z]:/) && pathIsAbsolute(path, options);
}
export function pathIsRelativeWithDrive(
  path: string,
  options?: PathAndUrlOptions,
) {
  return path.match(/^[A-Za-z]:/) && !pathIsAbsolute(path, options);
}
// `absolutePath()`
/** Join all path segments, returning an absolute, syntactically normalized path.
* * Normalization is done solely syntactically, *without* considering/resolving file system symlinks.
* * `no-throw` ~ will *not panic* (function returns `undefined` upon any error)
@param pathSegments • path segment array
@tags `no-panic`, `no-throw`
*/
export function absolutePath(...pathSegments: string[]) {
  if (pathSegments.length === 0) {
    return undefined;
  }
  let currentPath: string | undefined = undefined;
  let currentDrive: string | undefined = undefined;
  for (const segment of pathSegments) {
    if (segment == null || segment === "") {
      continue;
    }
    const [_match, _prefix, drive, path] =
      segment?.match(/^([/\\][/\\][.?][/\\])?(?:([A-Za-z]):)?(.*)$/) ?? [];
    // console.warn('absolutePath', { segment, abs: $path.isAbsolute(segment), prefix, drive, path });
    if ($path.isAbsolute(segment)) {
      currentPath = segment;
      currentDrive = drive;
    } else {
      const currentChanging = currentPath == null ||
        (drive && currentDrive !== drive);
      if (currentChanging) {
        currentPath = cwdOfDrive(drive ?? currentDrive);
        if (currentPath == null) {
          return undefined;
        }
        currentDrive = currentPath?.match(
          /^([/\\][/\\][.?][/\\])?(?:([A-Za-z]):)?(.*)$/,
        )?.[2];
      }
      // console.warn('absolutePath', { currentPath, currentDrive, segment, prefix, drive, path });
      currentPath = $path.join(currentPath ?? "", path ?? "");
    }
    // console.warn('absolutePath', { currentPath, currentDrive });
  }
  // return $path.resolve(...pathSegments);
  return currentPath;
}
// `intoPath()`
/** Extract the "path", in normalized (Deno-compatible) form, from a path string or URL.
* * `no-throw` ~ function returns `undefined` upon any error
@param path • path/URL-string (may already be in URL format [ie, 'file://...']) or URL
@tags `no-panic`, `no-throw`
*/
export function intoPath(path?: string | URL, options?: PathAndUrlOptions) {
  if (path == null) {
    return undefined;
  }
  return pathFromURL(
    path instanceof URL ? path : intoURL(path, undefined, options),
    options,
  );
}
// `intoURL()`
/** Convert a `path` string into a standard `URL` object, relative to an optional `base` reference URL.
* * `no-throw` ~ function returns `undefined` upon any error
@param path • path/URL-string (may already be in URL href/string format [ie, 'scheme://...'])
@param base • baseline URL reference point ~ defaults to `$path.toFileUrl(atImportCWD + $path.SEP)`; _note_: per usual relative URL rules, if `base` does not have a trailing separator, determination of path is relative the _the parent of `base`_
@param options ~ defaults to `{platform: 'host', singleLetterSchemeAsDrive: true}`
@tags `no-panic`, `no-throw` ; `no-prompt`
*/
export function intoURL(
  path?: string,
  base?: URL,
  options?: PathAndUrlOptions,
): URL | undefined;
export function intoURL(path?: string, ...args: unknown[]) {
  try {
    if (path == null || path === "") {
      return undefined;
    }
    const base = args?.length > 0 && args[0] instanceof URL
      ? (args.shift() as URL)
      : atImportPermitCWD && atImportCWD != null
      ? (() => {
        try {
          return $path.toFileUrl(atImportCWD + $path.SEP);
        } catch {
          return undefined;
        }
      })()
      : undefined;
    const options = {
      ...PathAndUrlOptionsDefault,
      ...ifThen(args?.length > 0, args.shift() as PathAndUrlOptions),
    };
    const forWinOS = options.platform === "WinOS" ||
      (options.platform === "host" && isWinOS);
    const $platformPath = forWinOS ? $path.win32 : $path.posix;
    const singleLetterSchemeAsDrive =
      (options.singleLetterSchemeAsDrive === "WinOS-only" && forWinOS) ||
      !!options.singleLetterSchemeAsDrive;
    // console.warn({ path, forWinOS });
    if (!forWinOS) {
      return new URL(path, base); // for POSIX-like platform; no further processing required
    }
    // * for WinOS
    const scheme = (path.match(/^[A-Za-z][A-Za-z0-9+-.]*(?=:)/) || [])[0]; // per [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986#section-3.1) @@ <https://archive.md/qMjTD#26.25%>
    const pathIsURL = scheme != null &&
      scheme.length > (singleLetterSchemeAsDrive ? 1 : 0);
    // const pathIsFileURL = scheme === 'file';
    // console.warn({ path, base, options, scheme, pathIsURL });
    // console.warn({ path, pathIsURL });
    if (pathIsURL) {
      return new URL(path, base);
    }
    const pathDrive = path.match(/^[A-Za-z]:/)?.[0];
    const pathHost = path.match(/^[/\\][/\\]([^/\\]+)/)?.[1];
    // console.warn({ path, pathDrive, pathHost });
    if (pathDrive == null && pathHost == null) {
      return new URL(path, base);
    }
    let pathname = (() => {
      // const pathIsAbsolute = $platformPath.isAbsolute(path);
      // if (pathIsAbsolute && pathDrive == null && pathHost == null) {
      // 	// * path is absolute and has no leading drive letter or host name
      // 	return path;
      // }
      // console.warn({ base });
      if (base == null) {
        return undefined;
      }
      const basePath = base.protocol === "file:"
        ? $platformPath.fromFileUrl(base)
        : base.pathname;
      const baseDrive = basePath.match(/^[A-Za-z]:/)?.[0];
      // console.warn({ basePath, baseDrive });
      // * work-around for `Deno.std::path.resolve()` not handling drive letters correctly
      const finalDrive = pathDrive ??
        baseDrive /*  ?? cwd()?.match(/^[A-Za-z]:/)?.[0] */;
      // const CWD = ifThen(finalDrive != null, cwd());
      // const CWDDrive = CWD?.match(/^[A-Za-z]:/)?.[0];
      // console.warn({ base, basePath, baseDrive, pathDrive, finalDrive /* CWD, CWDDrive */ });
      // const finalDriveCWDNeeded =
      // 	CWD != null &&
      // 	finalDrive != null &&
      // 	CWDDrive?.toLocaleUpperCase() != finalDrive?.toLocaleUpperCase();
      // const finalDriveCWD = (finalDriveCWDNeeded ? cwdOfDrive(finalDrive) : undefined) ?? '';
      const finalDriveCWD = cwdOfDrive(finalDrive) ?? "";
      const resolved = /* pathIsAbsolute
                ? $platformPath.resolve(path)
                :  */
        $platformPath.resolve(basePath, finalDriveCWD, path);
      return resolved;
    })();
    // console.warn({ pathname });
    if (pathname == null) {
      return undefined;
    }
    // NOTE: UNC paths of the form `\\localhost\...` will fail conversion to a file-URL with a TypeError (invalid hostname) => convert to `\\.\UNC\localhost\...`
    pathname = pathname.replace(/^([/\\][/\\]localhost[/\\])/, "\\\\.\\UNC$1");
    // encode any path starting with '\\?\...' into an alternate path ('\\.\?\...')
    // * [why] ~ WinOS device paths may be in the form of `\\?\...`, but '?' is an invalid URL host name
    // *   ... so, encode any path starting with '\\?\...' into an alternate "pseudo-device" path ('\\.\?\...' [which is otherwise invalid/unused by WinOS])
    // *   ... platform restriction is not needed as valid POSIX-like paths should never have this prefix
    // *   ... this does require decoding when the path is retrieved from the URL (ie, using `pathFromURL()`)
    pathname = pathname.replace(/^([/\\][/\\])[?]([/\\])/, "$1.$2?$2");
    const url = $platformPath.toFileUrl(pathname);
    // console.warn({ pathIsURL, path, pathname, url });
    return url;
  } catch (_error) {
    return undefined;
    // throw _error;
  }
}
// `pathFromURL()`
/** Extract the "path" (absolute file path for 'file://' URLs, otherwise the href URL-string) from the `url`.
* * `no-throw` ~ function returns `undefined` upon any error
@param url • URL for path extraction
@tags `no-panic`, `no-throw`
*/
export function pathFromURL(url?: URL, options?: PathAndUrlOptions) {
  if (url == null) {
    return undefined;
  }
  try {
    options = { ...PathAndUrlOptionsDefault, ...options };
    // console.warn('pathFromURL:', { url, options });
    // const isWinOS = Deno.build.os === 'windows';
    const forWinOS = options.platform === "WinOS" ||
      (options.platform === "host" && isWinOS);
    const $platformPath = forWinOS ? $path.win32 : $path.posix;
    let path = url.href;
    // console.warn('pathFromURL:', { url, href: path });
    if (url.protocol === "file:") {
      path = $platformPath.fromFileUrl(path);
    }
    // console.warn('pathFromURL:', { path, intoPlatformPath: intoPlatformPath(path) });
    return intoPlatformPath(path, options);
  } catch (_error) {
    if (options?.enablePanicReturns) {
      throw _error;
    }
    return undefined;
  }
}
// `isWinOsDeviceName()`
export function isWinOsDeviceName(path: string, options?: PathAndUrlOptions) {
  // ref: [WinOS Paths (includes Win10-style vs Win11-style info)](https://chrisdenton.github.io/omnipath/print.html) @@ <https://archive.is/90Elx>
  // ref: [Naming Files, Paths, and Namespaces](https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file) @@ <https://archive.is/TtpI2>
  if (path.length === 0) {
    return false;
  }
  // if (Deno.build.os !== 'windows') return false; // WinOS-only
  // if (path.match(/^[/\\][/\\][.?][/\\]/)) return false;
  // * options.fileStemMayMatch == true ~ inclusive, non-strict matching == will match if file prefix/stem matches any of `specialDeviceStemNames` (Win10-style [or earlier] compatible matching)
  // * options.fileStemMayMatch == false ~ strict matching == only complete file name may match any of `specialDeviceStemNames` (Win11-style [or later] compatible matching)
  options = { ...PathAndUrlOptionsDefault, ...options };
  // const isWinOS = Deno.build.os === 'windows';
  const forWinOS = options.platform === "WinOS" ||
    (options.platform === "host" && isWinOS);
  if (!forWinOS) {
    return false; // WinOS-only
  }
  const $platformPath = forWinOS ? $path.win32 : $path.posix;
  const specialDeviceBaseNames = ["CONIN$", "CONOUT$"];
  const specialDeviceStemNames = ([] as string[]).concat(
    ["CON", "PRN", "AUX", "NUL"], // legacy device names
    [
      "COM0",
      "COM1",
      "COM2",
      "COM3",
      "COM4",
      "COM5",
      "COM6",
      "COM7",
      "COM8",
      "COM9",
    ], // legacy COM device names
    ["COM¹", "COM²", "COM³"], // legacy COM device names (with ISO/IEC 8859-1 superscript digits)
    [
      "LPT0",
      "LPT1",
      "LPT2",
      "LPT3",
      "LPT4",
      "LPT5",
      "LPT6",
      "LPT7",
      "LPT8",
      "LPT9",
    ], // legacy LPT device names
    ["LPT¹", "LPT²", "LPT³"],
  );
  const fileBaseName = $platformPath.basename(path).toLocaleUpperCase(); // include any extension
  const fileStem = fileBaseName.replace(/[.].*$/, "").trimEnd();
  const match = specialDeviceBaseNames.includes(fileBaseName) ||
    specialDeviceStemNames.includes(fileBaseName) ||
    (options.fileStemMayMatchDevice &&
      specialDeviceStemNames.includes(fileStem));
  // console.warn('isWinOsDeviceName:', { path, fileBaseName, filePrefix, match });
  return match;
}
// `intoPlatformPath()`
/** Rewrite `path` into a platform API compatible version (required to correctly handle certain types of WinOS paths).
*
* For WinOS, this reverses device encoding and converts paths into 'verbatim' file paths when required.
* * `no-throw` ~ function returns `undefined` upon any error
@param path • path/URL-string
@param options `{ fileStemMayMatch }` • if `true`, file prefix/stem may match any of the special device names (Win10-style [or earlier] compatible matching); if `false`, only complete file name may match any of the special device names (Win11-style [or later] compatible matching)
@tags `no-panic`, `no-throw`
*/
export function intoPlatformPath(path?: string, options?: PathAndUrlOptions) {
  // console.warn('intoPlatformPath:', { arg: path });
  if (path == null || path === "") {
    return undefined;
  }
  options = { ...PathAndUrlOptionsDefault, ...options };
  // console.warn('intoPlatformPath():', { path, options });
  // const isWinOS = Deno.build.os === 'windows';
  const forWinOS = options.platform === "WinOS" ||
    (options.platform === "host" && isWinOS);
  if (!forWinOS) {
    return path; // only WinOS paths require special handling/sanitization
  }
  const $platformPath = forWinOS ? $path.win32 : $path.posix;
  // * WinOS-only ~ decode any device path of the form '\\.\?\...' (otherwise invalid/unused) back into the standard '\\?\...' path
  path = path.replace(/^([/\\][/\\])[.][/\\][?]([/\\])/, "$1?$2");
  // console.warn('intoPlatformPath:', { path });
  // WinOS ~ handle special device paths
  // ref: [File path formats](https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats) @@ <https://archive.is/0shPL>
  // ref: [Naming Files, Paths, and Namespaces](https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file) @@ <https://archive.is/TtpI2>
  // ref: [WinOS Paths (includes Win10-style vs Win11-style)](https://chrisdenton.github.io/omnipath/print.html) @@ <https://archive.is/90Elx>
  // * no further processing for paths with device prefixes (eg, '\\.\', '\\?\' [and equivalent slash variants])
  if (!path.match(/^[/\\][/\\][.?][/\\]/)) {
    // * convert paths which contain device names into 'verbatim' file paths
    // * note: to generate the most compatible resultant paths, Win10-style prefix/stem matching is used
    //     ... this will result in some unneeded conversions to 'verbatim'-type paths for Win-11+ platforms, but they remain compatible
    if (isWinOsDeviceName(path, options)) {
      const resolvedPath = absolutePath(path); // 'verbatim' paths must be in absolute/resolved form
      path =
        `${$platformPath.sep}${$platformPath.sep}?${$platformPath.sep}${resolvedPath}`;
    }
  }
  // `\\?\...` is likely the more "correct" prefix as it skips further Windows normalization via `GetFullPathName()`; but Deno and the standard URL class do not support it
  // * instead use the usually equivalent `\\.\` prefix for better compatibility with Deno and the standard URL class
  path = path.replace(
    /^[/\\][/\\][?][/\\]/,
    `${$platformPath.sep}${$platformPath.sep}.${$platformPath.sep}`,
  );
  // * additionally, Deno does not support '//./' as a prefix, so always replace it with the equivalent '\\.\' instead
  path = path.replace(
    /^[/\\][/\\][.][/\\]/,
    `${$platformPath.sep}${$platformPath.sep}.${$platformPath.sep}`,
  );
  // // * combine into one regex replacement
  // path = path.replace(
  // 	/^[/\\][/\\][.?][/\\]/,
  // 	`${$platformPath.sep}${$platformPath.sep}.${$platformPath.sep}`,
  // );
  // console.warn('intoPlatformPath:', { ret: path });
  return path;
}
//===
// `ensureAsPath()`
/** Ensure "path" is a valid path/URL-string (by conversion if needed) or *panic*.
@param path • path/URL-string (may already be in URL file format [ie, 'file://...']) or URL
@tags `may-panic` • may throw `Deno.errors.InvalidData` if `path` is not valid
*/
export function ensureAsPath(path?: string | URL, options?: PathAndUrlOptions) {
  const p = intoPath(path, options);
  if (p == null || p === "") {
    throw new Deno.errors.InvalidData("Invalid path");
  }
  return p;
}
// `ensureAsURL()`
/** Ensure "path" is a valid URL (by conversion if needed) or *panic*.
@param path • path/URL-string (may already be in URL file format [ie, 'file://...']) or URL
@tags `may-panic` • may throw `Deno.errors.InvalidData` if `path` is not a valid URL
*/
export function ensureAsURL(path: string | URL, options?: PathAndUrlOptions) {
  if (path instanceof URL) {
    return path;
  }
  const url = intoURL(path, undefined, options);
  if (url == null) {
    throw new Deno.errors.InvalidData("Invalid URL");
  }
  return url;
}
//===
/** 'read' permission state at time of module import
- *avoids* permission prompts
*/
// const allowRead = (await Deno.permissions?.query({ name: 'read' })).state === 'granted';
const allowRead = atImportPermissions.read.state === "granted";
const allowRun = atImportPermissions.run.state === "granted";
// `traversal()`
/** Determine the traversal path to `goal` from `base`.
- _Returned path will be relative to `base` iff `goal` shares a common origin/prefix with `base`, o/w it will be an absolute path_
- _Relative `goal` or `base` paths are evaluated as relative to the `atImportCWD` directory_
@param goal • target path
@param base • starting path ~ defaults to `$path.toFileUrl((atImportCWD ?? '')+$path.SEP)`; _note_: per usual relative URL rules, if `base` does not have a trailing separator, determination of path is relative the _the parent of `base`_
*/
export function traversal(
  goal: string | URL,
  base: string | URL = allowRead
    ? $path.toFileUrl((atImportCWD ?? "") + $path.SEP)
    : "",
) {
  const url = goal instanceof URL ? goal : intoURL(goal);
  const baseURL = base instanceof URL ? base : intoURL(base);
  const commonOrigin = url &&
    baseURL &&
    url.origin.localeCompare(baseURL.origin, undefined, {
        sensitivity: "accent",
      }) == 0 &&
    url.protocol.localeCompare(baseURL.protocol, undefined, {
        sensitivity: "accent",
      }) == 0;
  // console.warn({ goal, url, base, baseURL, commonOrigin });
  const basePath = pathFromURL(baseURL);
  const goalPath = pathFromURL(url);
  if (commonOrigin && basePath && goalPath) {
    const commonPathPrefix = longestCommonPrefix(
      // ToDO: add option to turn on/off file comparison case-sensitivity
      mightUseFileSystemCase() ? basePath : toCommonCase(basePath),
      mightUseFileSystemCase() ? goalPath : toCommonCase(goalPath),
    ).replace(/[^\/]*$/, "");
    // console.warn({ basePath, goalPath, commonPathPrefix });
    // console.warn({
    // 	basePathSlice: basePath.slice(commonPathPrefix.length),
    // 	goalPathSlice: goalPath.slice(commonPathPrefix.length),
    // });
    return $path.relative(
      basePath.slice(commonPathPrefix.length),
      goalPath.slice(commonPathPrefix.length),
    );
  }
  return url ? url.href : undefined;
}
//===
export function isEmpty(x: unknown) {
  if (x == null) {
    return true;
  }
  if (typeof x === "function") {
    return true;
  }
  if (typeof x === "object") {
    if (x.constructor === Object && Object.keys(x).length === 0) {
      return true;
    }
  }
  if (
    (x as {
      length: number;
    }).length === 0
  ) {
    return true;
  }
  return false;
}
//===
const falseyValues: string[] = ["", "0", "f", "false", "n", "no", "off"];
// const falseyValues: string[] = ['', '0', 'f', 'false', 'n', 'never', 'no', 'none', 'off'];
export type Truthy = false | string;
// `isFalsey()`
export function isFalsey(s: string): boolean {
  return toTruthy(s) == false;
}
// `isTruthy()`
export function isTruthy(s?: string): boolean {
  return toTruthy(s) != false;
}
// `toTruthy()`
export function toTruthy(s?: string): Truthy {
  if (!s || falseyValues.includes(s)) {
    return false;
  }
  return s;
}
//===
// ToDO: investigate [`stringz`](https://github.com/sallar/stringz)
// ref: <https://coolaj86.com/articles/how-to-count-unicode-characters-in-javascript> @@ <https://archive.is/5nzNP>
// ref: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length#unicode> @@ <https://archive.is/DdIu6>
// ToDO: benchmark `getCharacterLength()` vs `s.length()`
export function getCharacterLength(s: string) {
  // The string iterator that is used here iterates over characters, not mere UTF-16 code units
  return [...s].length;
}
export function longestCommonPrefix(...arr: string[]) {
  let prefix = "";
  if (arr.length === 0) {
    return prefix;
  }
  if (arr.length === 1) {
    return arr[0];
  }
  for (let i = 0; i < arr[0].length; i++) {
    const char = arr[0][i];
    for (let j = 1; j < arr.length; j++) {
      if (arr[j][i] !== char) {
        return prefix;
      }
    }
    prefix += char;
  }
  return prefix;
}
/** * Convert string to a (locale sensitive) known case; useful for case-insensitive comparisons */
export function toCommonCase(s: string) {
  return s.toLocaleLowerCase();
}
//===
export function stableSort<T = unknown>(
  arr: T[],
  compare: (a: T, b: T) => number,
) {
  return arr
    .map((item, index) => ({ item, index }))
    .sort((a, b) => compare(a.item, b.item) || a.index - b.index)
    .map(({ item }) => item);
}
//===
function existsSync(path: string) {
  try {
    return $fs.existsSync(path);
  } catch {
    return false;
  }
}
export function firstPathContaining(goal: string, paths: string[]) {
  for (const path of paths) {
    const p = $path.join(path, goal);
    if (existsSync(p)) {
      return path;
    }
  }
}
//===
export function pathNormalizeSlashes(path: string) {
  // * replace all doubled-slashes with singles except for leading (for WinOS network paths) and those following schemes
  // * note: 'scheme' is defined per [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986#section-3.1) @@ <https://archive.md/qMjTD#26.25%>
  return path.replaceAll(
    /(?<!^|[A-Za-z][A-Za-z0-9+-.]*:\/?)([\\\/])[\\\/]+/gmsu,
    "$1",
  );
}
export function pathToOS(p: string) {
  return isWinOS ? pathToWinOS(p) : pathToPOSIX(p);
}
export function pathToPOSIX(p: string) {
  // ToDO: convert to use of $path.SEP_PATTERN
  return p.replace(/\\/g, $path.posix.sep);
}
export function pathToWinOS(p: string) {
  return p.replace(/\//g, $path.win32.sep);
}
export function pathEquivalent(a?: string, b?: string) {
  // console.warn({ a, b });
  // console.warn({ aURL: intoURL(a), bURL: intoURL(b) });
  return a === b || intoURL(a)?.href === intoURL(b)?.href;
}
export function UrlEquivalent(a?: URL, b?: URL) {
  // console.warn({ a, b });
  return a === b || a?.href === b?.href;
}
//===
// ref: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat>
export function formatDuration(
  durationInMS: number,
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 3,
    maximumFractionDigits: 5,
  },
): string {
  const [unit, n] = durationInMS > 1000
    ? ["s", durationInMS / 1000]
    : ["ms", durationInMS];
  const NumberFormat = new Intl.NumberFormat(undefined, options);
  return `${NumberFormat.format(n)} ${unit}`;
}
export function formatN(
  n: number,
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 3,
    maximumFractionDigits: 5,
  },
): string {
  const NumberFormat = new Intl.NumberFormat(undefined, options);
  return NumberFormat.format(n);
}
export function performanceDuration(tag: string) {
  const now = performance.now();
  try {
    const performanceEntries = (() => {
      let entries = performance.getEntriesByName(tag, "mark");
      if (entries.length > 0) {
        return entries;
      }
      entries = entries.concat(performance.getEntriesByName(`${tag}:begin`));
      entries = entries.concat(performance.getEntriesByName(`${tag}:start`));
      entries = entries.concat(performance.getEntriesByName(`${tag}:end`));
      entries = entries.concat(performance.getEntriesByName(`${tag}:stop`));
      if (entries.length > 0) {
        return entries;
      }
      return undefined;
    })();
    // if ((performanceEntries == null) || performanceEntries.length < 2) return undefined;
    if (performanceEntries == null) {
      return undefined;
    }
    const duration = (performanceEntries.pop()?.startTime ?? now) -
      (performanceEntries.shift()?.startTime ?? now);
    return duration;
  } catch (_) {
    return undefined;
  }
}
export function durationText(tag: string): string | undefined {
  const duration = performanceDuration(tag);
  if (duration != null) {
    return `${tag} done (duration: ${
      formatDuration(duration, { maximumFractionDigits: 3 })
    })`;
  }
  return undefined;
}
//===
// ref: <https://stackoverflow.com/questions/3104410/identify-cygwin-linux-windows-using-environment-variables> , <https://stackoverflow.com/questions/714100/os-detecting-makefile>
// ref: <https://stackoverflow.com/questions/38086185/how-to-check-if-a-program-is-run-in-bash-on-ubuntu-on-windows-and-not-just-plain>
// ref: [CLI and emojis](https://news.ycombinator.com/item?id=25311114) @@ <https://archive.is/xL2BL>
// `isWSL()`
/** Determine if OS platform is 'Windows Subsystem for Linux'.
@param options `{ allowFsFallback }` • allow fallback to file system read if needed; defaults to `true`
@tags `no-panic`, `no-throw` ; `no-prompt`
@tags [`allow-read=/proc/sys/kernel/osrelease`]
*/
/* spell-checker:ignore (env) OSID (path) osrelease */
export function isWSL(options?: {
  allowFsFallback?: boolean;
}) {
  // * POSIX-like and contains one of the WSL signal environment variables or a known WSL version (via *osrelease*)
  options = options ?? { allowFsFallback: true };
  // ref: <https://stackoverflow.com/questions/38086185/how-to-check-if-a-program-is-run-in-bash-on-ubuntu-on-windows-and-not-just-plain> @@ <https://archive.is/KWV5a>
  // FixME!: environment variables are *not* preserved across side-logins (ie, `sudo -i` causes them to disappear)
  // ** likely need to test uname, version, and/or files ... ref: <https://github.com/microsoft/WSL/issues/4555>
  // ** shortcut without touching the file system if the environment variable(s) are present
  // NOTE, in general, for better user usability... (ref: <https://superuser.com/questions/232231/how-do-i-make-sudo-preserve-my-environment-variables>)
  // * add `sudo echo 'Default:%sudo env_keep+="IS_WSL WSLENV WSL_*"' > /etc/sudoers.d/WSL-env_keep` for WSL
  // * add `sudo echo 'Default:%sudo env_keep+="WT_*"' > /etc/sudoers.d/WT-env_keep` for MS Windows Terminal variables
  // * (as an aside...) add `sudo echo 'Default:%sudo env_keep+="LANG LC_*"' > /etc/sudoers.d/SSH-env_keep` for SSH
  if (isWinOS) {
    return false;
  }
  const hasWslEnvVar = ["IS_WSL", "WSL_DISTRO_NAME"].some((envVar) =>
    Boolean(env(envVar))
  );
  if (hasWslEnvVar) {
    return true;
  }
  const hasWslOsIdTag = `;${env("OSID_tags")};`.toLocaleLowerCase().includes(
    ";wsl;",
  );
  if (hasWslOsIdTag) {
    return true;
  }
  return wslVersion(options) != null ? true : undefined;
}
// `wslVersion()`
/** Determine the WSL version; undefined if not WSL or version not determinable.
@param options `{ allowFsFallback }` • allow fallback to file system read if needed for version determination; defaults to `true`
@tags `no-panic`, `no-throw` ; `no-prompt` ; `allow-read=/proc/sys/kernel/osrelease`
*/
/* spell-checker:ignore (path) osrelease */
export function wslVersion(options?: {
  allowFsFallback?: boolean;
}) {
  options = options ?? { allowFsFallback: true };
  const osIdTags = `;${env("OSID_tags")};`.toLocaleLowerCase();
  if (osIdTags.includes(";wsl1;")) {
    return 1;
  }
  if (osIdTags.includes(";wsl2;")) {
    return 2;
  }
  if (!options.allowFsFallback) {
    return undefined;
  }
  const osReleaseTextPath = "/proc/sys/kernel/osrelease";
  const osReleaseTextReadGranted = Deno.permissions?.querySync({
    name: "read",
    path: osReleaseTextPath,
  })?.state === "granted";
  const osReleaseText = osReleaseTextReadGranted
    ? Deno.readTextFileSync(osReleaseTextPath).trim().toLocaleLowerCase()
    : undefined;
  if (osReleaseText?.endsWith("-wsl2")) {
    return 2;
  }
  if (osReleaseText?.match(/-microsoft(-|$)/)) {
    return 1;
  }
  return undefined;
}
// `canDisplayUnicode()`
/** Determine if unicode display is supported under the current platform and console constraint. */
export function canDisplayUnicode() {
  if (!isWinOS) {
    // POSIX-like
    // ref: <https://stackoverflow.com/questions/3104410/identify-cygwin-linux-windows-using-environment-variables> , <https://stackoverflow.com/questions/714100/os-detecting-makefile>
    // ref: <https://stackoverflow.com/questions/38086185/how-to-check-if-a-program-is-run-in-bash-on-ubuntu-on-windows-and-not-just-plain>
    const isOldTerminal = ["cygwin", "linux"].includes(env("TERM") ?? "");
    const isWSL_ = isWSL() ?? false;
    return (
      !isOldTerminal && // fail for old terminals
      // * not isWSL
      ((!isWSL_ &&
        Boolean(
          env("LC_ALL")?.match(/[.]utf-?8$/i) ||
            env("LANG")?.match(/[.]utf-?8$/i),
        )) /* LC_ALL or LANG handles UTF-8? */ || // * isWSL
        (isWSL_ && Boolean(env("WT_SESSION")))) // only MS Windows Terminal is supported; 'alacritty' and 'ConEmu/cmder' hosts not detectable
    );
  }
  // WinOS
  // note: 'alacritty' will, by default, set TERM to 'xterm-256color'
  return (["alacritty", "xterm-256color"].includes(env("TERM") ?? "") || // [alacritty](https://github.com/alacritty/alacritty)
    Boolean(env("ConEmuPID")) || // [ConEmu](https://conemu.github.io) and [cmder](https://cmder.net)
    Boolean(env("WT_SESSION"))); // MS Windows Terminal
}
export function mightUseColor() {
  // respects `NO_COLOR` env var override; use 'truthy' values?
  // ref: <https://no-color.org> @@ <https://archive.is/Z5N1d>
  return !env("NO_COLOR");
}
export function mightUseFileSystemCase() {
  // * respects `USE_FS_CASE` env var override (for WinOS); use 'truthy' values?
  // POSIX is case-sensitive
  // WinOS is *usually* (~99+%) case-insensitive/case-preserving, but *can* be case-sensitive (on a directory-by-directory basis)
  // ref: <https://stackoverflow.com/questions/7199039/file-paths-in-windows-environment-not-case-sensitive> @@ <https://archive.is/i0xzb>
  // ref: <https://nodejs.org/en/docs/guides/working-with-different-filesystems> @@ <https://archive.is/qSRjE>
  // ref: <https://en.wikipedia.org/wiki/Filename> @@ <https://archive.is/cqe6g>
  return !isWinOS /* assumed to be POSIX-like */ || !env("USE_FS_CASE");
}
export function mightUseUnicode() {
  // respects `NO_UNICODE` and `USE_UNICODE` env var overrides (in that order of priority); use 'truthy' values?
  if (env("NO_UNICODE")) {
    return false;
  }
  if (env("USE_UNICODE")) {
    return true;
  }
  return canDisplayUnicode();
}
//===
export const commandVOf = (name: string) => {
  if (!allowRun) {
    return Promise.resolve(undefined);
  }
  try {
    const process = Deprecated.Deno.run({
      cmd: [
        ...(isWinOS
          ? ["cmd", "/x/d/c"]
          : env("SHELL") != null
          ? [env("SHELL") ?? "bash", "-c"]
          : []),
        `command -v ${name}`,
      ],
      stdin: "null",
      stderr: "piped",
      stdout: "piped",
    });
    // console.warn('commandVOf(): process created');
    return Promise.all([
      process.status(),
      process.output(), /* , process.stderrOutput() */
    ])
      .then(([status, out /* , err */]) => {
        // console.warn('commandVOf', { status: status, out: decode(out) /* , err: decode(err) */ });
        return status.success
          ? decode(out)?.replace(/(\r|\r\n|\n)+$/, "")
          : undefined;
      })
      .finally(() => process.close());
  } catch (_) {
    // console.warn('commandVOf(): catch()');
    return Promise.resolve(undefined);
  }
};
//===
// note: defined here to avoid circular dependency
// VERSION handler
// `fetch()` implementation (requires read [for local runs] or network permissions)
import { fetch } from "./xFetch.ts"; // 'file://'-compatible `fetch()`
// import { intoURL, projectLocations, projectURL } from '../../tests/$shared.ts';
// import { logger } from '../../tests/$shared.ts';
const EOL = /\n|\r\n?/;
const versionURL = projectLocations.version;
// logger.trace({ projectURL, projectLocations, versionURL });
// console.warn({ projectURL, projectLocations, versionURL });
// projectVersionText == first non-empty line (EOL trimmed) from VERSION
const projectVersionTextViaFetch = await (versionURL &&
    (versionURL.protocol === "file:"
      ? (await Deno.permissions.query({ name: "read", path: versionURL }))
        .state === "granted"
      : (await Deno.permissions.query({
        name: "net",
        host: versionURL.host.length > 0 ? versionURL.host : undefined,
      })).state === "granted")
  ? fetch(versionURL)
    .then((resp) => (resp.ok ? resp.text() : undefined))
    .then((text) => text?.split(EOL).filter((s) => s)[0])
    .catch((_) => undefined)
  : Promise.resolve(undefined));
// `import ...` implementation (note: requires project-level synchronization tooling)
const projectVersionTextViaImport = VERSION;
const projectVersionTagFromURL = ((url) => {
  // version from `versionURL`
  // # CDNs (see "cdn/kb-CDN.mkd")
  // - Deno.Land • <https://deno.land/x/dxx@[TAG/VERSION]/src/dxi.ts> ## note: @TAG/VERSION is optional
  // - jsdelivr • <https://cdn.jsdelivr.net/gh/OWNER/REPO@[TAG|COMMITISH]/src/dxi.ts> ## note: avoid branch as the CDN caches it at least semi-permanently
  // - BitBucket (raw) • <https://bitbucket.org/OWNER/REPO/raw/[BRANCH|TAG|COMMITISH]/src/dxi.ts>
  // - GitHub (raw) • <https://github.com/OWNER/REPO/raw/[BRANCH|TAG|COMMITISH]/src/dxi.ts> , <https://raw.githubusercontent.com/OWNER/REPO/[BRANCH|TAG|COMMITISH]/src/dxi.ts>
  // - GitLab (raw) • <https://gitlab.com/OWNER/REPO/-/raw/[BRANCH|TAG|COMMITISH]/src/dxi.ts>
  // - GitHack • <https://rawcdn.githack.com/OWNER/REPO/[BRANCH|TAG|COMMITISH]/eg/args.ts> , <https://bbcdn.githack.com/OWNER/REPO/raw/[BRANCH|TAG|COMMITISH]/LICENSE> , <https://glcdn.githack.com/OWNER/REPO/-/raw/[BRANCH|TAG|COMMITISH]/LICENSE>
  // - (*broken*) statically • <https://cdn.statically.io/bb/:user/:repo/:tag/:file> , <https://cdn.statically.io/gh/:user/:repo/:tag/:file> , <https://cdn.statically.io/gl/:user/:repo/:tag/:file>
  //   * broken; "Couldn't complete your request." with "https://cdn.statically.io/gh/rivy/deno.dxx/v0.0.15/src/dxi.ts"
  if (url?.protocol === "file:") {
    return undefined;
  }
  return url?.pathname?.match(/.*[@/](.*?)[/]VERSION$/)?.[1];
})(versionURL);
export type vOptions = {
  maxCommitHashDisplaySize?: number; // maximum length of commit hash to include in version string; < 1 == no limit
};
// set default maxCommitHashDisplaySize to 8 to avoid collisions
// - even on *extremely* large projects, # of commits between versions should be significantly less than 10,000
// ref: from "Hash Collision Probability by Input Size.xlsx"
// * 1% collision probability between 600 commits using 6 hex digits
// * 1% collision probability between 3,000 commits using 7 hex digits
// * 1% collision probability between 10,000 commits using 8 hex digits
// * 1% collision probability between 150,000 commits using 10 hex digits
// * 1% collision probability between 2,500,000 commits using 12 hex digits
const vOptionsDefault: Required<vOptions> = { maxCommitHashDisplaySize: 8 };
function v(options?: vOptions) {
  const options_ = options ?? vOptionsDefault;
  // uses 'relaxed' semantic versioning (allows for variable length version numbers [M, M.m, M.m.r, M.m.r.n, etc])
  // ref: [Semantic Versioning](https://semver.org) @@ <https://archive.is/Z02ta>
  // simple 'relaxed' semantic version tag = /[vV]?\d+([.]\d+)*/
  // extended 'relaxed' semantic version tag = /[vV]?\d+([.]\d+)*([-].*)?/
  const tagIsCommitHash =
    projectVersionTagFromURL?.match(/^[0-9a-fA-F]{5,}$/) != null; // heuristic: any string of solely 5+ hex digits is assumed to be a commit hash
  if (tagIsCommitHash) {
    return `${projectVersionTextViaImport}+${
      projectVersionTagFromURL.slice(0, options_.maxCommitHashDisplaySize)
    }`;
  }
  const vFromTag = projectVersionTagFromURL?.match(
    /^[vV]?\d+([.]\d+)*([-].*)?$/,
  )?.[0];
  if (vFromTag != null) {
    return vFromTag;
  }
  return `${projectVersionTextViaImport}+${
    projectVersionTagFromURL ? `(${projectVersionTagFromURL})` : ""
  }`;
}
export const $version = {
  versionURL,
  projectVersionTagFromURL,
  projectVersionTextViaFetch,
  projectVersionTextViaImport,
  v,
};
//=== * logger
export * as $logger from "./axe/$mod.ts";
//===
import * as $logger from "./axe/$mod.ts";
$logger.logger.suspend(); // initialize common/global logger to 'suspended' state to allow for local module use without unwanted outputs
export const logger = $logger.logger; // export logger (note: in the *suspended state*)
// console.warn({ atImportPermitCWD, atImportCWD });
// console.warn({ url_cwd: intoURL('.') });
// console.warn({ url_abs: intoURL('file:///C:/Users/Roy/AARK/Projects/deno/dxx/repo.GH') }); // spell-checker:ignore AARK
// console.warn({ url_rel: intoURL('relative_dir/file.foo') });
// console.warn({ url_rel_drive: intoURL('c:relative_dir/file.foo') });
// console.warn({ url_rel_drive_alt: intoURL('d:relative_dir/file.foo') });
// Deno.openSync('//hoard/vault', { read: true, write: true });
// console.warn({
// 	cwd: cwd(),
// 	cwdOf: cwdOfDrive(),
// 	cwdOfC: cwdOfDrive('C'),
// 	cwdOfD: cwdOfDrive('d:/'),
// });
// console.error(intoPlatformPath(absolutePath('CON')));
