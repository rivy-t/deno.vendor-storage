/* esm.sh - ansi-regex@4.1.1 */
var f = Object.create;
var n = Object.defineProperty;
var i = Object.getOwnPropertyDescriptor;
var l = Object.getOwnPropertyNames;
var j = Object.getPrototypeOf, m = Object.prototype.hasOwnProperty;
var o = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var A = (e, t, r, a) => {
  if (t && typeof t == "object" || typeof t == "function") {
    for (let d of l(t)) {
      !m.call(e, d) && d !== r &&
        n(e, d, {
          get: () => t[d],
          enumerable: !(a = i(t, d)) || a.enumerable,
        });
    }
  }
  return e;
};
var Z = (
  e,
  t,
  r,
) => (r = e != null ? f(j(e)) : {},
  A(
    t || !e || !e.__esModule
      ? n(r, "default", { value: e, enumerable: !0 })
      : r,
    e,
  ));
var c = o((p, u) => {
  "use strict";
  u.exports = (e) => {
    e = Object.assign({ onlyFirst: !1 }, e);
    let t = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
    ].join("|");
    return new RegExp(t, e.onlyFirst ? void 0 : "g");
  };
});
var s = Z(c()), x = s.default ?? s;
export { x as default };
//# sourceMappingURL=ansi-regex.mjs.map
