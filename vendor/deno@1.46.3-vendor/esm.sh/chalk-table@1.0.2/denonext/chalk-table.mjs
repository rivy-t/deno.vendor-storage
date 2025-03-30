/* esm.sh - chalk-table@1.0.2 */
import * as __0$ from "../../../esm.sh/chalk@2.4.2.js";
import * as __1$ from "../../../esm.sh/strip-ansi@5.2.0.js";
var require = (n) => {
  const e = (m) => typeof m.default < "u" ? m.default : m,
    c = (m) => Object.assign({ __esModule: true }, m);
  switch (n) {
    case "chalk":
      return e(__0$);
    case "strip-ansi":
      return e(__1$);
    default:
      console.error('module "' + n + '" not found');
      return null;
  }
};
var p = Object.create;
var u = Object.defineProperty;
var j = Object.getOwnPropertyDescriptor;
var y = Object.getOwnPropertyNames;
var w = Object.getPrototypeOf, A = Object.prototype.hasOwnProperty;
var d =
  ((e) =>
    typeof require < "u"
      ? require
      : typeof Proxy < "u"
      ? new Proxy(e, { get: (a, f) => (typeof require < "u" ? require : a)[f] })
      : e)(function (e) {
      if (typeof require < "u") {
        return require.apply(this, arguments);
      }
      throw Error('Dynamic require of "' + e + '" is not supported');
    });
var E = (e, a) => () => (a || e((a = { exports: {} }).exports, a), a.exports);
var g = (e, a, f, t) => {
  if (a && typeof a == "object" || typeof a == "function") {
    for (let n of y(a)) {
      !A.call(e, n) && n !== f &&
        u(e, n, {
          get: () => a[n],
          enumerable: !(t = j(a, n)) || t.enumerable,
        });
    }
  }
  return e;
};
var b = (
  e,
  a,
  f,
) => (f = e != null ? p(w(e)) : {},
  g(
    a || !e || !e.__esModule
      ? u(f, "default", { value: e, enumerable: !0 })
      : f,
    e,
  ));
var o = E((q, m) => {
  var C = d("chalk"), h = d("strip-ansi");
  m.exports = (e, a) => {
    let f = (
      r,
      c,
    ) => (typeof r > "u" && (r = ""),
      "" + r + new Array(Math.max(c - h("" + r).length + 1, 0)).join(" "));
    if (typeof e == "object" && Array.isArray(e)) {
      let r = a;
      a = e, e = r;
    }
    e || (e = {}), e.intersectionCharacter || (e.intersectionCharacter = "+");
    let t;
    e.columns
      ? t = e.columns
      : (t = [],
        a.forEach((r) =>
          Object.keys(r).filter((c) => t.indexOf(c) === -1).forEach((c) => {
            t.push(c);
          })
        )),
      t = t.map(
        (
          r,
        ) => (typeof r == "string" && (r = { name: r, field: r }),
          r.name = C.bold(r.name),
          r.width = h(r.name).length,
          r),
      ),
      a.forEach((r) =>
        t.forEach((c) => {
          typeof r[c.field] > "u" ||
            (c.width = Math.max(c.width, ("" + h(r[c.field])).length));
        })
      );
    let n = [],
      i = [""].concat(t.map((r) => new Array(r.width + 1).join("-"))).concat([
        "",
      ]).join("-" + e.intersectionCharacter + "-");
    n.push(i),
      n.push(
        [""].concat(t.map((r) => f(r.name, r.width))).concat([""]).join(" | "),
      ),
      n.push(i),
      a.forEach((r) => {
        n.push(
          [""].concat(t.map((c) => f(r[c.field], c.width))).concat([""]).join(
            " | ",
          ),
        );
      }),
      n.push(i);
    let s = " ".repeat(e.leftPad) || "";
    return s + n.map((r) => r.replace(/^[ -]/, "").replace(/[ -]$/, "")).join(
      `
` + s,
    );
  };
});
var l = b(o()), x = l.default ?? l;
export { x as default };
//# sourceMappingURL=chalk-table.mjs.map
