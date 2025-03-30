/* esm.sh - ansi-styles@3.2.1 */
import * as __0$ from "../../../esm.sh/color-convert@1.9.3.js";
var require = (n) => {
  const e = (m) => typeof m.default < "u" ? m.default : m,
    c = (m) => Object.assign({ __esModule: true }, m);
  switch (n) {
    case "color-convert":
      return e(__0$);
    default:
      console.error('module "' + n + '" not found');
      return null;
  }
};
var y = Object.create;
var m = Object.defineProperty;
var h = Object.getOwnPropertyDescriptor;
var d = Object.getOwnPropertyNames;
var p = Object.getPrototypeOf, C = Object.prototype.hasOwnProperty;
var w =
  ((r) =>
    typeof require < "u"
      ? require
      : typeof Proxy < "u"
      ? new Proxy(r, { get: (e, n) => (typeof require < "u" ? require : e)[n] })
      : r)(function (r) {
      if (typeof require < "u") {
        return require.apply(this, arguments);
      }
      throw Error('Dynamic require of "' + r + '" is not supported');
    });
var j = (r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports);
var $ = (r, e, n, a) => {
  if (e && typeof e == "object" || typeof e == "function") {
    for (let o of d(e)) {
      !C.call(r, o) && o !== n &&
        m(r, o, {
          get: () => e[o],
          enumerable: !(a = h(e, o)) || a.enumerable,
        });
    }
  }
  return r;
};
var k = (
  r,
  e,
  n,
) => (n = r != null ? y(p(r)) : {},
  $(
    e || !r || !r.__esModule
      ? m(n, "default", { value: r, enumerable: !0 })
      : n,
    r,
  ));
var f = j((A, B) => {
  "use strict";
  var s = w("color-convert"),
    l = (r, e) =>
      function () {
        return `\x1B[${r.apply(s, arguments) + e}m`;
      },
    c = (r, e) =>
      function () {
        let n = r.apply(s, arguments);
        return `\x1B[${38 + e};5;${n}m`;
      },
    b = (r, e) =>
      function () {
        let n = r.apply(s, arguments);
        return `\x1B[${38 + e};2;${n[0]};${n[1]};${n[2]}m`;
      };
  function O() {
    let r = new Map(),
      e = {
        modifier: {
          reset: [0, 0],
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29],
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          gray: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39],
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49],
        },
      };
    e.color.grey = e.color.gray;
    for (let o of Object.keys(e)) {
      let t = e[o];
      for (let i of Object.keys(t)) {
        let g = t[i];
        e[i] = { open: `\x1B[${g[0]}m`, close: `\x1B[${g[1]}m` },
          t[i] = e[i],
          r.set(g[0], g[1]);
      }
      Object.defineProperty(e, o, { value: t, enumerable: !1 }),
        Object.defineProperty(e, "codes", { value: r, enumerable: !1 });
    }
    let n = (o) => o, a = (o, t, i) => [o, t, i];
    e.color.close = "\x1B[39m",
      e.bgColor.close = "\x1B[49m",
      e.color.ansi = { ansi: l(n, 0) },
      e.color.ansi256 = { ansi256: c(n, 0) },
      e.color.ansi16m = { rgb: b(a, 0) },
      e.bgColor.ansi = { ansi: l(n, 10) },
      e.bgColor.ansi256 = { ansi256: c(n, 10) },
      e.bgColor.ansi16m = { rgb: b(a, 10) };
    for (let o of Object.keys(s)) {
      if (typeof s[o] != "object") {
        continue;
      }
      let t = s[o];
      o === "ansi16" && (o = "ansi"),
        "ansi16" in t &&
        (e.color.ansi[o] = l(t.ansi16, 0), e.bgColor.ansi[o] = l(t.ansi16, 10)),
        "ansi256" in t &&
        (e.color.ansi256[o] = c(t.ansi256, 0),
          e.bgColor.ansi256[o] = c(t.ansi256, 10)),
        "rgb" in t &&
        (e.color.ansi16m[o] = b(t.rgb, 0), e.bgColor.ansi16m[o] = b(t.rgb, 10));
    }
    return e;
  }
  Object.defineProperty(B, "exports", { enumerable: !0, get: O });
});
var u = k(f()), M = u.default ?? u;
export { M as default };
//# sourceMappingURL=ansi-styles.mjs.map
