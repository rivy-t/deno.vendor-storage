/* esm.sh - has-flag@3.0.0 */
import __Process$ from "node:process";
var m = Object.create;
var c = Object.defineProperty;
var u = Object.getOwnPropertyDescriptor;
var x = Object.getOwnPropertyNames;
var d = Object.getPrototypeOf, f = Object.prototype.hasOwnProperty;
var h = (s, t) => () => (t || s((t = { exports: {} }).exports, t), t.exports);
var j = (s, t, o, r) => {
  if (t && typeof t == "object" || typeof t == "function") {
    for (let e of x(t)) {
      !f.call(s, e) && e !== o &&
        c(s, e, {
          get: () => t[e],
          enumerable: !(r = u(t, e)) || r.enumerable,
        });
    }
  }
  return s;
};
var O = (
  s,
  t,
  o,
) => (o = s != null ? m(d(s)) : {},
  j(
    t || !s || !s.__esModule
      ? c(o, "default", { value: s, enumerable: !0 })
      : o,
    s,
  ));
var p = h((l, i) => {
  "use strict";
  i.exports = (s, t) => {
    t = t || __Process$.argv;
    let o = s.startsWith("-") ? "" : s.length === 1 ? "-" : "--",
      r = t.indexOf(o + s),
      e = t.indexOf("--");
    return r !== -1 && (e === -1 ? !0 : r < e);
  };
});
var n = O(p()), P = n.default ?? n;
export { P as default };
//# sourceMappingURL=has-flag.mjs.map
