/* esm.sh - escape-string-regexp@1.0.5 */
var i = Object.create;
var s = Object.defineProperty;
var n = Object.getOwnPropertyDescriptor;
var m = Object.getOwnPropertyNames;
var u = Object.getPrototypeOf, d = Object.prototype.hasOwnProperty;
var g = (r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports);
var l = (r, e, t, p) => {
  if (e && typeof e == "object" || typeof e == "function") {
    for (let o of m(e)) {
      !d.call(r, o) && o !== t &&
        s(r, o, {
          get: () => e[o],
          enumerable: !(p = n(e, o)) || p.enumerable,
        });
    }
  }
  return r;
};
var x = (
  r,
  e,
  t,
) => (t = r != null ? i(u(r)) : {},
  l(
    e || !r || !r.__esModule
      ? s(t, "default", { value: r, enumerable: !0 })
      : t,
    r,
  ));
var f = g((w, c) => {
  "use strict";
  var h = /[|\\{}()[\]^$+*?.]/g;
  c.exports = function (r) {
    if (typeof r != "string") {
      throw new TypeError("Expected a string");
    }
    return r.replace(h, "\\$&");
  };
});
var a = x(f()), y = a.default ?? a;
export { y as default };
//# sourceMappingURL=escape-string-regexp.mjs.map
