// spell-checker:ignore (jargon) bikeshed falsey glob globbing sep seps truthy vendored ; (js) gmsu imsu msu ; (libs) micromatch picomatch ; (names) Deno JSPM SkyPack ; (options) globstar nobrace noquantifiers nocase nullglob ; (people) Roy Ivy III * rivy ; (utils) xargs
// ref: [bash shell expansion](https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_03_04.html) @@ <https://archive.is/GFMJ1>
// ref: [GNU ~ bash shell expansions](https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html) @@ <https://archive.is/lHgK6>
// ESM conversion refs
// ref: <https://esbuild.github.io/plugins>
// ref: <https://github.com/postui/esm.sh/blob/master/server/build.go>
// ref: <https://github.com/postui/esm.sh>
// ref: <https://esbuild.github.io/plugins/#resolve-results>
// ref: <https://dev.to/ije/introducing-esm-cdn-for-npm-deno-1mpo> // `esm` client?
// ref: <https://github.com/remorses/esbuild-plugins>
// ref: <https://github.com/snowpackjs/rollup-plugin-polyfill-node>
// ref: <https://esbuild.github.io/plugins/#resolve-callbacks>
// ref: <https://www.google.com/search?q=using+esbuild+polyfill&oq=using+esbuild+polyfill&aqs=chrome..69i57.7740j0j1&sourceid=chrome&ie=UTF-8>
// ref: <https://github.com/evanw/esbuild/issues/298>
// ref: <https://github.com/evanw/esbuild/blob/03a33e6e007467d99989ecf82fad61bd928a71aa/CHANGELOG.md#0717>
// ref: <https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5>
// ref: <https://www.npmjs.com/package/path-browserify>
// ref: <https://github.com/evanw/esbuild/issues/85>
// ref: <https://stackoverflow.com/questions/61821038/how-to-use-npm-module-in-deno>
// ref: <https://jspm.org/docs/cdn>
// esm.sh
// * use deno/std@0.134.0 to avoid permission prompts (deno/std@0.135.0+ causes permission prompts; see <https://github.com/denoland/deno_std/issues/2097>)
// import Braces from 'https://esm.sh/v135/braces@3.0.2?deno-std=0.134.0';
// esm.sh (un-minimized, readable source)
// import Braces from 'https://esm.sh/v135/braces@3.0.2?deno-std=0.134.0&dev';
// import BracesM from 'https://esm.sh/v135/braces@3.0.2?deno-std=0.134.0&no-dts';
import BracesM from "../../../../../../cdn.jsdelivr.net/npm/braces@3.0.2/+esm.js";
import type BracesT from "../../vendor/@types/braces@3.0.5/index.d.ts"; // use locally vendored (and modified) types
const Braces = BracesM as typeof BracesT;
// jspm.dev
// import * as BracesT from 'https://cdn.jsdelivr.net/gh/DefinitelyTyped/DefinitelyTyped@7121cbff79/types/braces/index.d.ts';
// import BracesM from 'https://jspm.dev/npm:braces@3.0.2';
// const Braces = BracesM as typeof BracesT;
const DQ = `"`;
const SQ = `'`;
const DQStringReS = `${DQ}[^${DQ}]*(?:${DQ}|$)`; // double-quoted string (unbalanced at end-anchor is allowed)
// const SQStringReS = `${SQ}[^${SQ}]*(?:${SQ}|$)`; // single-quoted string (unbalanced at end-anchor is allowed)
const SQStringStrictReS = "'[^']*'"; // single-quoted string (quote balance is required)
// const DQReS = `[${DQ}]`; // double or single quote character class
const QReS = `[${DQ}${SQ}]`; // double or single quote character class
// const cNonDQReS = `(?:(?!${DQReS}).)`; // non-(double or single)-quote character
const cNonQReS = `(?:(?!${QReS}).)`; // non-(double or single)-quote character
const tokenRe = new RegExp(
  `^((?:${DQStringReS}|${SQStringStrictReS}|${cNonQReS}+|[${SQ}]))(.*?$)`,
  "msu",
); // == (tokenFragment)(restOfString)
// `expand`
/** Brace expand a string argument.

* - Bash-like brace expansion (compatible with the Bash v4.3 specification).
* - Quotes (single or double) are used to protect braces from expansion;
    unbalanced quotes are allowed (and parsed as if completed by the end of the string).
    No character escape sequences are recognized.
* - Supports lists/sets, ranges/sequences, and range increments.

Uses the ['braces'](https://github.com/micromatch/braces) JS module.

@returns Array of expansions (possibly empty)
@example
```js
const text = '{a,b} text string {1..10..2}';
const expansion = expand(text);
```
*/
export function expand(s: string) {
  // brace expand a string
  const arr = [];
  s = s.replace(/^\s+/msu, ""); // trim leading whitespace
  // console.warn('xBraces.expand()', { s });
  let text = "";
  while (s) {
    const m = s.match(tokenRe);
    // console.warn('xBraces.expand()', { s, m });
    if (m) {
      let matchStr = m[1];
      if (matchStr.length > 0) {
        const bracesEscChar = "\\"; // `braces` escape character == backslash
        if (
          matchStr[0] === DQ ||
          (matchStr.length > 1 && matchStr[0] === SQ &&
            matchStr[matchStr.length - 1] === SQ)
        ) {
          // "..." or '...' => escape contents
          const qChar = matchStr[0];
          const spl = matchStr.split(qChar);
          matchStr = spl[1];
          // escape contents
          // * 1st, escape the braces escape character
          matchStr = matchStr.replace(
            bracesEscChar,
            `${bracesEscChar}${bracesEscChar}`,
          );
          // * escape string contents
          matchStr = matchStr.replace(/(.)/gmsu, `${bracesEscChar}$1`);
          // add surrounding escaped quotes
          matchStr =
            `${bracesEscChar}${qChar}${matchStr}${bracesEscChar}${qChar}`;
        } else {
          // unquoted text => escape special characters
          // * 1st, escape the braces escape character
          matchStr = matchStr.replace(
            bracesEscChar,
            `${bracesEscChar}${bracesEscChar}`,
          );
          // * escape any 'special' (braces escape, glob, "`", or "'") characters
          matchStr = matchStr.replace(
            new RegExp(`([\\${bracesEscChar}?*\\[\\]\`'])`, "gmsu"),
            `${bracesEscChar}$1`,
          );
        }
      }
      text += matchStr;
      s = m[2];
      if (!s) {
        arr.push(text);
        text = "";
      }
    } else {
      arr.push(text);
      text = s = "";
    }
  }
  // console.warn('xBraces.expand()', { arr });
  // return arr.flatMap((v) => Braces.expand(v));
  return arr.flatMap((v) => Braces.expand(v)).map((v) =>
    v.replace(/\\(\\)/gmsu, "$1")
  );
}
