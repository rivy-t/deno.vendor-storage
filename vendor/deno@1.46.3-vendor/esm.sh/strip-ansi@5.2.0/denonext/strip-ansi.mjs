/* esm.sh - strip-ansi@5.2.0 */
import * as __0$ from "../../../esm.sh/ansi-regex@4.1.1.js";
var require = (n) => {
  const e = (m) => typeof m.default < "u" ? m.default : m,
    c = (m) => Object.assign({ __esModule: true }, m);
  switch (n) {
    case "ansi-regex":
      return e(__0$);
    default:
      console.error('module "' + n + '" not found');
      return null;
  }
};
var u = Object.create;
var c = Object.defineProperty;
var l = Object.getOwnPropertyDescriptor;
var m = Object.getOwnPropertyNames;
var x = Object.getPrototypeOf, d = Object.prototype.hasOwnProperty;
var n =
  ((e) =>
    typeof require < "u"
      ? require
      : typeof Proxy < "u"
      ? new Proxy(e, { get: (t, s) => (typeof require < "u" ? require : t)[s] })
      : e)(function (e) {
      if (typeof require < "u") {
        return require.apply(this, arguments);
      }
      throw Error('Dynamic require of "' + e + '" is not supported');
    });
var j = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var q = (e, t, s, a) => {
  if (t && typeof t == "object" || typeof t == "function") {
    for (let r of m(t)) {
      !d.call(e, r) && r !== s &&
        c(e, r, {
          get: () => t[r],
          enumerable: !(a = l(t, r)) || a.enumerable,
        });
    }
  }
  return e;
};
var y = (
  e,
  t,
  s,
) => (s = e != null ? u(x(e)) : {},
  q(
    t || !e || !e.__esModule
      ? c(s, "default", { value: e, enumerable: !0 })
      : s,
    e,
  ));
var i = j((b, o) => {
  "use strict";
  var A = n("ansi-regex"),
    f = (e) => typeof e == "string" ? e.replace(A(), "") : e;
  o.exports = f;
  o.exports.default = f;
});
var p = y(i()), g = p.default ?? p;
export { g as default };
//# sourceMappingURL=strip-ansi.mjs.map
