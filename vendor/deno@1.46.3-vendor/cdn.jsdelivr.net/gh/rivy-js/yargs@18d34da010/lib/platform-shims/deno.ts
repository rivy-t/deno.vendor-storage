/* global Deno */
import {
  assertNotEquals,
  assertStrictEquals,
} from "../../../../../../deno.land/std@0.134.0/testing/asserts.ts";
import {
  basename,
  dirname,
  extname,
  posix,
} from "../../../../../../deno.land/std@0.134.0/path/mod.ts";
import cliui from "../../../../../../deno.land/x/cliui@v7.0.4-deno/deno.ts";
import escalade from "../../../../../../cdn.jsdelivr.net/gh/rivy-fix/escalade@19b6c73c3e/deno/sync.ts"; // 3.1.1-deno-rivy
import Parser from "../../../../../../cdn.jsdelivr.net/gh/rivy-fix/yargs-parser@78e3cb983e/deno.ts"; // 21.1.1-deno-rivy
import y18n from "../../../../../../cdn.jsdelivr.net/gh/rivy-fix/y18n@4035918354/deno.ts"; // v5.0.8-deno-rivy+1 // Deno-v2.1.5+ fixes
import { YError } from "../../build/lib/yerror.js";
const REQUIRE_ERROR = "require is not supported by ESM";
const REQUIRE_DIRECTORY_ERROR =
  "loading a directory of commands is not supported yet for ESM";
const DENO_ENV_PERMITTED: boolean =
  (await Deno.permissions.query({ name: "env" })).state === "granted";
const DENO_READ_CWD_PERMITTED: boolean =
  (await Deno.permissions.query({ name: "read", path: "." })).state ===
    "granted";
// Deno removes argv[0] and argv[1] from Deno.args:
const argv = ["deno run", ...Deno.args];
const __dirname = new URL(".", import.meta.url).pathname;
// Yargs supports environment variables with prefixes, e.g., MY_APP_FOO,
// MY_APP_BAR. Environment variables are also used to detect locale.
const cwd = DENO_READ_CWD_PERMITTED ? Deno.cwd() : "";
const env: {
  [key: string]: string;
} = DENO_ENV_PERMITTED ? Deno.env.toObject() : {};
const path = {
  basename: basename,
  dirname: dirname,
  extname: extname,
  relative: (p1: string, p2: string) => {
    try {
      return posix.relative(p1, p2);
    } catch (err) {
      // Some yargs features require read access to the file system,
      // e.g., support for multiple locales.
      if (
        (err as {
          name?: string;
        })?.name !== "PermissionDenied"
      ) {
        throw err;
      }
      return p1;
    }
  },
  resolve: posix.resolve,
};
// TODO: replace with Deno.consoleSize(Deno.stdout.rid)
// once this feature is stable:
const columns = 80;
export default {
  assert: {
    notStrictEqual: assertNotEquals,
    strictEqual: assertStrictEquals,
  },
  cliui: cliui,
  findUp: escalade,
  getEnv: (key: string) => {
    return env[key];
  },
  inspect: Deno.inspect,
  getCallerFile: () => undefined,
  getProcessArgvBin: () => {
    return "deno";
  },
  mainFilename: cwd,
  Parser: Parser,
  path: path,
  process: {
    argv: () => argv,
    cwd: () => cwd,
    emitWarning: (warning: string | Error, type?: string) => {},
    execPath: () => {
      try {
        return Deno.execPath();
      } catch (_err) {
        return "deno";
      }
    },
    exit: Deno.exit,
    nextTick: globalThis.queueMicrotask,
    stdColumns: columns ?? null,
  },
  readFileSync: Deno.readTextFileSync,
  require: () => {
    throw new YError(REQUIRE_ERROR);
  },
  requireDirectory: () => {
    throw new YError(REQUIRE_DIRECTORY_ERROR);
  },
  stringWidth: (str: string) => {
    return [...str].length;
  },
  y18n: y18n({
    directory: posix.resolve(__dirname, "../../locales"),
    updateFiles: false,
  }),
};
