/* esm.sh - supports-color@5.5.0 */
import __Process$ from "node:process";
import * as __0$ from "node:os";
import * as __1$ from "../../../esm.sh/has-flag@3.0.0.js";
var require = (n) => {
  const e = (m) => typeof m.default < "u" ? m.default : m,
    c = (m) => Object.assign({ __esModule: true }, m);
  switch (n) {
    case "node:os":
      return e(__0$);
    case "has-flag":
      return e(__1$);
    default:
      console.error('module "' + n + '" not found');
      return null;
  }
};
var C = Object.create;
var f = Object.defineProperty;
var O = Object.getOwnPropertyDescriptor;
var E = Object.getOwnPropertyNames;
var T = Object.getPrototypeOf, m = Object.prototype.hasOwnProperty;
var R =
  ((r) =>
    typeof require < "u"
      ? require
      : typeof Proxy < "u"
      ? new Proxy(r, { get: (e, o) => (typeof require < "u" ? require : e)[o] })
      : r)(function (r) {
      if (typeof require < "u") {
        return require.apply(this, arguments);
      }
      throw Error('Dynamic require of "' + r + '" is not supported');
    });
var I = (r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports);
var M = (r, e, o, l) => {
  if (e && typeof e == "object" || typeof e == "function") {
    for (let i of E(e)) {
      !m.call(r, i) && i !== o &&
        f(r, i, {
          get: () => e[i],
          enumerable: !(l = O(e, i)) || l.enumerable,
        });
    }
  }
  return r;
};
var d = (
  r,
  e,
  o,
) => (o = r != null ? C(T(r)) : {},
  M(
    e || !r || !r.__esModule
      ? f(o, "default", { value: r, enumerable: !0 })
      : o,
    r,
  ));
var a = I((h, p) => {
  "use strict";
  var _ = R("node:os"), s = R("has-flag"), t = __Process$.env, n;
  s("no-color") || s("no-colors") || s("color=false")
    ? n = !1
    : (s("color") || s("colors") || s("color=true") || s("color=always")) &&
      (n = !0);
  "FORCE_COLOR" in t &&
    (n = t.FORCE_COLOR.length === 0 || parseInt(t.FORCE_COLOR, 10) !== 0);
  function A(r) {
    return r === 0
      ? !1
      : { level: r, hasBasic: !0, has256: r >= 2, has16m: r >= 3 };
  }
  function L(r) {
    if (n === !1) {
      return 0;
    }
    if (s("color=16m") || s("color=full") || s("color=truecolor")) {
      return 3;
    }
    if (s("color=256")) {
      return 2;
    }
    if (r && !r.isTTY && n !== !0) {
      return 0;
    }
    let e = n ? 1 : 0;
    if (__Process$.platform === "win32") {
      let o = _.release().split(".");
      return Number(__Process$.versions.node.split(".")[0]) >= 8 &&
          Number(o[0]) >= 10 && Number(o[2]) >= 10586
        ? Number(o[2]) >= 14931 ? 3 : 2
        : 1;
    }
    if ("CI" in t) {
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some((o) =>
          o in t
        ) || t.CI_NAME === "codeship"
        ? 1
        : e;
    }
    if ("TEAMCITY_VERSION" in t) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(t.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (t.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in t) {
      let o = parseInt((t.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (t.TERM_PROGRAM) {
        case "iTerm.app":
          return o >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(t.TERM)
      ? 2
      : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
          t.TERM,
        ) || "COLORTERM" in t
      ? 1
      : (t.TERM === "dumb", e);
  }
  function c(r) {
    let e = L(r);
    return A(e);
  }
  p.exports = {
    supportsColor: c,
    stdout: c(__Process$.stdout),
    stderr: c(__Process$.stderr),
  };
});
var u = d(a()),
  { supportsColor: v, stdout: x, stderr: b } = u,
  P = u.default ?? u;
export { b as stderr, P as default, v as supportsColor, x as stdout };
//# sourceMappingURL=supports-color.mjs.map
