// spell-checker:ignore (js/ts) gmsu
// spell-checker:ignore (names) Deno
// spell-checker:ignore (people) Roy Ivy III * rivy
// spell-checker:ignore (shell/CMD) PATHEXT
// spell-checker:ignore (vars) ARGP ARGX
import { $path } from "./$deps.ts";
import { permitsAsync } from "./$shared.TLA.ts";
import {
  commandVOf,
  deQuote,
  envAsync,
  intoURL,
  isWinOS,
  /* mightUseFileSystemCase, */
  pathEquivalent,
  pathFromURL,
  permitsSync,
  projectURL,
  toCommonCase,
  traversal,
} from "./$shared.ts";
import * as $commandLine from "../lib/commandLine.ts";
import * as $args from "../lib/xArgs.ts";
//===
const atImportPermissions = Deno?.permissions?.querySync != null
  ? permitsSync()
  : await permitsAsync();
const permittedRead = atImportPermissions.read.state === "granted";
const permittedRun = atImportPermissions.run.state === "granted";
const denoExecPath = permittedRead ? Deno.execPath() : undefined;
const denoMainModule = permittedRead ? Deno.mainModule : undefined;
// ToDO? : make this a configurable option (with default == `!isWinOS`); OTOH, current usage should be correct 99+% of the time
// const caseSensitiveFiles = mightUseFileSystemCase();
const caseSensitiveFiles = !isWinOS;
const execPathExtensions = isWinOS
  ? (await envAsync("PATHEXT"))?.split($path.delimiter).filter(Boolean).map(
    toCommonCase,
  ) ?? []
  : undefined;
// const pathsOfPATH = env('PATH')?.split($path.delimiter) ?? [];
//===
// assumptions/configuration
// * These are assumptions (of varying _fragility_) based on current (2021-12-28) practice of the Deno executable.
// * If the runner (ie, `deno`) would supply `argv0`, the raw args, and the args supplied to itself, much of this fragility would evaporate
// * and compatibility with other runners (such as NodeJS) should be more achievable.
// *note*: any non-standalone process is considered a "deno-like" runner (eg, in the form `<runner> <options..> eval/run <options..> script_name <script_options..>`)
// *note*: using a runner with a different, unexpected name may still lead to unexpected argument parsing results
const denoRunnerNameReS = "^deno(?:[.]exe)?$";
const possibleDenoRunnerNameReS = "^deno(?:[.-].*)*(?:[.]com|com)?$";
const isDenoEvalReS = `${$path.SEP_PATTERN.source}[$]deno[$]eval[.]js$`;
const enhancedShellRx = new RegExp("[\\/][^\\/]*?sh$", "ms"); // (sh, bash, dash, ...)
const removableExtensions = (execPathExtensions ?? []).concat(
  ".cjs",
  ".cts",
  ".mjs",
  ".mts",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".deno.ts",
);
// *
// `underEnhancedShell` == process has been executed by a modern shell (sh, bash, ...) which supplies correctly expanded arguments to the process (via `Deno.args()`)
const underEnhancedShell =
  (((await envAsync("SHELL")) || "").match(enhancedShellRx) || []).length > 0;
const defaultRunner = "deno";
const defaultRunnerArgs = ["run", "-A"];
const shimEnvPrefix = ["DENO_SHIM_", "SHIM_"];
const shimEnvBaseNames = [
  "URL",
  "TARGET",
  "ARG0",
  "ARGS",
  "ARGV",
  "ARGV0",
  "PIPE",
  "EXEC",
];
//===
/** * process appears to have been invoked from a compiled standalone binary executable (note: moderately fragile) */
// ... seems correct up to Deno-v2.1.6 (2025-01-21 ~ ToDO: verify)
// ref: [deno ~ Runtime API for 'standalone'](https://github.com/denoland/deno/issues/15996) @@ <https://archive.is/Sooka>
// ref: [SO ~ [deno] Determine if compiled](https://stackoverflow.com/questions/76647896/determine-if-running-uncompiled-ts-script-or-compiled-deno-executa> @@ <https://archive.is/g7xws>
// ref: [deno ~ PR - add `Deno.standalone` API](https://github.com/denoland/deno/pull/18402) @@ <https://archive.is/SX4ZM>
export const likelyIsStandalone =
  $path.basename(pathFromURL(projectURL) ?? "") ===
    `deno-compile-${$path.basename(denoExecPath ?? "")}`;
export const likelyIsDenoRunner = !!$path.basename(denoExecPath ?? "").match(
  denoRunnerNameReS,
);
export const possibleDenoRunner = likelyIsDenoRunner ||
  !!$path.basename(denoExecPath ?? "").match(possibleDenoRunnerNameReS);
/** * process was invoked by direct execution */
export const isDirectExecution =
  likelyIsStandalone /* || (denoExecPath ? !$path.basename(denoExecPath).match(runnerNameReS) : undefined) */;
/** * process was invoked as an eval script (eg, `deno eval ...`) */
export const isEval = denoMainModule
  ? !!denoMainModule.match(isDenoEvalReS)
  : undefined;
//===
// NOTE: when multiple sources of process information are available, enhanced-shim supplied information is given priority
// * enhanced-shim supplied data will generally have the most accurate/cleanest information, especially the best `argv0`
//===
// shim-supplied process information
// ... TARGET and ARGS could be avoided if Deno supplies raw argument text or Win32 `GetCommandLine()` is available and full text formatting control of sub-process arguments is enabled
// ref: [🐛/🙏🏻 CLI apps need original command line (WinOS)](https://github.com/denoland/deno/issues/9871)
// ref: [The quotation in cmd of Deno.run](https://github.com/denoland/deno/issues/8852)
// ... b/c `deno` runs scripts either directly or via a shim; ARG0 still has value to assist the target process to reveal true executable text (needed when generating correct help text)
// ref: [🙏🏻 [feat/req] supply $0/%0 to shimmed scripts (cross-platform)](https://github.com/denoland/deno/issues/9874
// ToDO? ~ decide whether to check permissions and error/warn or gracefully degrade; if unable to set (and clear) SHIM env variables, should we proceed? is using SHIM_TARGET good enough? what about calling self?
/** * summary of information transmitted by 'shim'-executable initiating the main script, when available */
export const shim = await (async () => {
  const parts: {
    /** * path/URL-string of script targeted by shim */
    TARGET?: string;
    /** * original `argv[0]` which invoked this process (if/when available) */
    ARG0?: string;
    /** * original argument text string */
    ARGS?: string;
    // useful ~ for Windows modification of parent environment (needed for creation of equivalents for enhanced-`cd` (`enhan-cd`, `goto`, `scd`, ...) and `source` applications) // spell-checker:ignore enhan
    // ... PIPE is a BAT/CMD file used to allow passage of ENV variable and CWD changes back up to the parent process (needed for utilities like `cdd`, `source`, etc.)
    /** * path of pipe file (an escape hatch which allows modification of parent environment (variables and CWD)) */
    PIPE?: string;
    // implementation detail // ToDO? remove as implementation detail?
    // ... EXEC is really an implementation detail (for maximum command line content flexibility within a no-'Terminate batch job (Y/N)?' formulated batch file)
    /** * executable path of secondary shim (when needed; generally defined only for Windows) */
    EXEC?: string;
    /** * URL of process script targeted by enhanced-shim process data (compact/string form)
     */
    // * used to gate shim-provided information to the correct process, avoiding interpretation of information passed through xProcess-naive intermediary processes
    targetURL?: string;
    runner?: string;
    runnerArgs?: string[];
    scriptName?: string;
    scriptCode?: string;
    scriptArgs?: string[];
  } = {};
  parts.TARGET = (await envAsync("SHIM_TARGET")) ||
    (await envAsync("SHIM_URL")) ||
    (await envAsync("DENO_SHIM_URL"));
  parts.ARG0 = (await envAsync("SHIM_ARG0")) ??
    (await envAsync("SHIM_ARGV0")) ??
    (await envAsync("DENO_SHIM_ARG0"));
  parts.ARGS = (await envAsync("SHIM_ARGS")) ??
    (await envAsync("SHIM_ARGV")) ??
    (await envAsync("DENO_SHIM_ARGS"));
  parts.PIPE = (await envAsync("SHIM_PIPE")) ??
    (await envAsync("DENO_SHIM_PIPE"));
  parts.EXEC = (await envAsync("SHIM_EXEC")) ??
    (await envAsync("DENO_SHIM_EXEC"));
  //
  parts.runner = undefined;
  parts.runnerArgs = undefined;
  parts.scriptName = undefined;
  parts.scriptCode = undefined;
  parts.scriptArgs = undefined;
  parts.targetURL = intoURL(deQuote(parts.TARGET))?.href;
  if (
    /* aka `isEnhancedShimTarget` */
    parts.targetURL &&
    pathEquivalent(parts.targetURL, denoMainModule)
  ) {
    // shim is targeting current process
    parts.ARGS = parts.ARGS ?? ""; // redefine undefined ARGS as an empty string ('') when targeted by an enhanced shim
    parts.runner = parts.ARG0;
    parts.runnerArgs = [];
  } else if (parts.targetURL && pathEquivalent(parts.targetURL, denoExecPath)) {
    // shim is targeting runner
    if (!parts.ARGS) {
      parts.runner = parts.ARG0;
    }
    // o/w assume execution in `deno` style as `<runner>` + `<options..> eval/run <options..> script_name <script_options..>`
    // * so, find and use *second* non-option in ARGS as script name
    const words = parts.ARGS ? $args.wordSplitCLText(parts.ARGS) : [];
    let idx = 0;
    let nonOptionN = 0;
    for (const word of words) {
      idx++;
      if (!deQuote(word)?.startsWith("-")) {
        nonOptionN++;
      }
      if (nonOptionN > 1) {
        parts.runner = parts.ARG0;
        parts.runnerArgs = words.slice(0, idx - 1);
        if (isEval) {
          parts.scriptName = "$deno$eval";
          parts.scriptCode = words.slice(idx - 1, idx)[0];
        } else {
          parts.scriptName = words.slice(idx - 1, idx)[0];
          parts.scriptCode = undefined;
        }
        parts.scriptArgs = words.slice(idx);
        break;
      }
    }
  }
  return parts;
})();
// ToDO?: evaluate the proper course of action for shim info targeted at other processes
//  ... * generally, a process expecting to be a target should likely clear the SHIM info for any sub-processes it creates
// consume/reset SHIM environment variables to avoid interpretation by a subsequent process
const envVarNames = shimEnvPrefix.flatMap((prefix) =>
  shimEnvBaseNames.map((base) => prefix + base)
);
await Promise.all(envVarNames.map(async (name) => {
  if (
    (await Deno.permissions?.query({ name: "env", variable: "name" })).state ===
      "granted"
  ) {
    Deno.env.delete(name);
  }
}));
//===
export const isEnhancedShimTarget = (shim.targetURL &&
  (pathEquivalent(shim.targetURL, denoMainModule) ||
    (pathEquivalent(shim.targetURL, denoExecPath) &&
      pathEquivalent(shim.scriptName, denoMainModule)))) ||
  false;
//===
// command line data for current process
/** * process command line, when available */
export const commandLine = $commandLine.GetCommandLine();
/** * process command line ~ split into semantic parts */
export const commandLineParts = (() => {
  // note: algorithm requires finding non-option words, so final text is a reconstruction instead of verbatim (though it should only differ in whitespace between words, if at all)
  // * necessary b/c `deno`, which already does this work, doesn't/won't supply the raw args
  const parts: {
    runner?: string;
    runnerArgs?: string[];
    scriptName?: string;
    scriptCode?: string;
    scriptArgs?: string[];
  } = {};
  const words = commandLine ? $args.wordSplitCLText(commandLine) : undefined;
  if (words == null) {
    return parts;
  }
  if (isDirectExecution) {
    parts.scriptName = words.slice(0, 1)[0];
    parts.scriptCode = undefined;
    parts.scriptArgs = words.slice(1);
  } else {
    // o/w assume execution in `deno` style as `<runner> <options..> eval/run <options..> script_name <script_options..>`
    // * so, find *third* non-option
    let idx = 0;
    let nonOptionN = 0;
    let foundEndOfOptions = false;
    for (const word of words) {
      idx++;
      if (deQuote(word) === "--") {
        foundEndOfOptions = true;
        continue;
      }
      if (foundEndOfOptions || !deQuote(word)?.startsWith("-")) {
        nonOptionN++;
      }
      if (nonOptionN > 2) {
        parts.runner = words.slice(0, 1)[0];
        parts.runnerArgs = words.slice(1, idx - 1);
        parts.scriptName = words.slice(idx - 1, idx)[0];
        parts.scriptArgs = words.slice(idx);
        break;
      }
    }
  }
  return parts;
})();
//===
/** * path string of main script file (best guess from all available sources) */
export const pathURL =
  (isEnhancedShimTarget
    ? intoURL(deQuote(shim.scriptName))?.href
    : undefined) ??
    (isDirectExecution
      ? denoExecPath
      : intoURL(deQuote(commandLineParts.scriptName))?.href ?? denoMainModule);
/** * base name (eg, NAME.EXT) of main script file (from best guess path) */
const pathUrlBase = $path.parse(pathURL || "").base;
/** * determine if base has a removable extension and return it (note: longer extensions have priority) */
const removableExtension = removableExtensions
  .sort((a, b) => b.length - a.length)
  .find((e) =>
    caseSensitiveFiles
      ? pathUrlBase.endsWith(e)
      : toCommonCase(pathUrlBase).endsWith(toCommonCase(e))
  );
/** * name of main script file (from best guess path) */
export const name = pathUrlBase.length > 0
  ? decodeURIComponent(
    removableExtension
      ? pathUrlBase.slice(0, removableExtension.length * -1)
      : pathUrlBase,
  )
  : undefined;
// console.warn({
// 	name,
// 	commandVOf: ((name != null) && permittedRun) ? (await commandVOf(name)) : 'not-permitted',
// 	runner: shim.runner,
// });
// simplify shim.runner when possible (heuristic for POSIX-like executables)
if (
  !isWinOS && name != null && permittedRun &&
  shim.runner === (await commandVOf(name))
) {
  // console.warn({ name, commandVOf: await commandVOf(name), shim });
  // `command -v NAME` maps the short `name` back to `shim.runner` => replace `shim.runner` with `name`
  shim.runner = name;
}
// console.warn({
// 	name,
// 	commandVOf: ((name != null) && permittedRun) ? (await commandVOf(name)) : 'not-permitted',
// 	runner: shim.runner,
// });
/** * executable text string which initiated/invoked execution of the current process */
export const argv0 = (isEnhancedShimTarget ? shim.runner : undefined) ??
  commandLineParts.runner ?? denoExecPath;
/** * runner specific command line options */
export const execArgv = [
  ...((isEnhancedShimTarget ? shim.runnerArgs : undefined) ??
    commandLineParts.runnerArgs ?? []),
];
/** * executable string which can be used to re-run current application; eg, `Deno.run({cmd: [ runAs, ... ]});` */
export const runAs = isEnhancedShimTarget && shim.runner
  ? [shim.runner, ...(shim.runnerArgs ?? []), shim.scriptName].filter(Boolean)
    .join(" ")
  : commandLineParts.runner
  ? [
    commandLineParts.runner,
    ...(commandLineParts.runnerArgs ?? []),
    commandLineParts.scriptName,
  ]
    .filter(Boolean)
    .join(" ")
  : isDirectExecution
  ? [commandLineParts.scriptName].filter(Boolean).join(" ")
  : isEval
  ? [defaultRunner, "eval", /* ToDO?: find reference to eval text */ "..."]
    .join(" ")
  : pathURL?.length
  ? [
    defaultRunner,
    ...defaultRunnerArgs,
    $args.reQuote(
      decodeURIComponent(
        traversal(pathURL || "")?.replace(/^-/, `.${$path.SEP}-`) ?? "",
      ),
    ),
  ].join(" ")
  : undefined;
//===
/** * calculated or supplied `argv0` is available for interpretation/expansion */
export const haveSuppliedArgv0 = Boolean(
  (isEnhancedShimTarget && shim.ARG0) || commandLineParts.runner ||
    isDirectExecution,
);
/** * shim supplies enhanced arguments */
export const haveEnhancedShimArgs = Boolean(
  pathEquivalent(pathURL, shim.scriptName) && shim.scriptArgs,
);
// ref: [🐛/🙏🏻? ~ CLI apps need original command line (WinOS)](https://github.com/denoland/deno/issues/9871)
/** * raw arguments are available for interpretation/expansion OR an "advanced" runner/shell is assumed to have already done correct argument expansion */
export const haveEnhancedArgs = Boolean(
  isEnhancedShimTarget || haveEnhancedShimArgs || commandLine ||
    underEnhancedShell,
);
/** impaired '$0' and/or argument resolution, ie:
- process name (eg, '$0') is not supplied and must be determined heuristically
- and/or only *processed* arguments are available (via `Deno.args()`) which have *lost quote-context* and cannot distinguish `...` from `"..."`
*/
export const impaired = isWinOS
  ? !(haveEnhancedArgs && haveSuppliedArgv0)
  : /* POSIX-like */ !haveSuppliedArgv0;
export const impairedWarningMessage = () => {
  return impaired
    ? `degraded capacity (faulty ${
      [
        !haveSuppliedArgv0 ? '"$0"' : "",
        !haveEnhancedArgs ? "argument" : "",
      ]
        .filter(Boolean)
        .join(" and ")
    } resolution); full/correct function requires an enhanced runner or shim (use \`dxr\` or install with \`dxi\`)`
    : undefined;
};
export const warnIfImpaired = (
  writer: (...args: unknown[]) => void = (args) =>
    console.warn(`WARN/[${name}]:`, args),
) => {
  const msg = impairedWarningMessage();
  if (msg != undefined) {
    writer(msg);
  }
};
//===
// FixME/ToDO: [2023-01-26; rivy] add limiter for max size of returned args (leaving rest un-expanded)
// ... for use by SHIMs passing args via ENV (max env space ~32kiB [ref: <https://devblogs.microsoft.com/oldnewthing/20100203-00/?p=15083> @@ <https://archive.is/dMe0P>])
// ... limit to 8kiB as default for limit == true (heuristic)
// ... instead output large SHIM_ARGS to a temporary file (%TEMP%/SHIM_ARGS.{sha1(TARGET_URL)})
/** * Promise for an array of 'shell'-expanded arguments; simple pass-through of `Deno.args` for non-Windows platforms */
export const argsAsync = async () => {
  if (!isWinOS || underEnhancedShell) {
    return [...Deno.args]; // pass-through of `Deno.args` for non-Windows platforms // ToDO: investigate how best to use *readonly* Deno.args
  }
  return await $args.argsAsync((() => {
    if (isEnhancedShimTarget) {
      if (shim.scriptArgs != null) {
        return [...shim.scriptArgs].filter(Boolean);
      }
      if (shim.ARGS != null) {
        return shim.ARGS;
      }
    }
    if (commandLineParts.scriptArgs != undefined) {
      return commandLineParts.scriptArgs;
    }
    return Deno.args;
  })()); // ToDO: add type ArgsOptions = { suppressExpansion: boolean } == { suppressExpansion: false }
};
/** * array of 'shell'-expanded arguments; simple pass-through of `Deno.args` for non-Windows platforms */
export const argsSync = () => {
  if (!isWinOS || underEnhancedShell) {
    return [...Deno.args]; // pass-through of `Deno.args` for non-Windows platforms // ToDO: investigate how best to use *readonly* Deno.args
  }
  return $args.argsSync((() => {
    if (isEnhancedShimTarget) {
      if (shim.scriptArgs != null) {
        return [...shim.scriptArgs].filter(Boolean);
      }
      if (shim.ARGS != null) {
        return shim.ARGS;
      }
    }
    if (commandLineParts.scriptArgs != undefined) {
      return commandLineParts.scriptArgs;
    }
    return Deno.args;
  })()); // ToDO: add type ArgsOptions = { suppressExpansion: boolean } == { suppressExpansion: false }
};
/** * array of 'shell'-expanded arguments; simple pass-through of `Deno.args` for non-Windows platforms */
export const args = argsSync;
