/* esm.sh - slice-ansi@7.1.0 */
import c from "../../../esm.sh/ansi-styles@6.2.1_2.js";
import p from "../../../esm.sh/is-fullwidth-code-point@5.0.0.js";
var C = new Set([27, 155]),
  P = "0".codePointAt(0),
  m = "9".codePointAt(0),
  f = new Set(),
  l = new Map();
for (let [e, n] of c.codes) {
  f.add(c.color.ansi(n)), l.set(c.color.ansi(e), c.color.ansi(n));
}
function I(e) {
  if (f.has(e)) {
    return e;
  }
  if (l.has(e)) {
    return l.get(e);
  }
  e = e.slice(2), e.includes(";") && (e = e[0] + "0");
  let n = c.codes.get(Number.parseInt(e, 10));
  return n ? c.color.ansi(n) : c.reset.open;
}
function A(e) {
  for (let n = 0; n < e.length; n++) {
    let t = e.codePointAt(n);
    if (t >= P && t <= m) {
      return n;
    }
  }
  return -1;
}
function S(e, n) {
  e = e.slice(n, n + 19);
  let t = A(e);
  if (t !== -1) {
    let o = e.indexOf("m", t);
    return o === -1 && (o = e.length), e.slice(0, o + 1);
  }
}
function x(e, n = Number.POSITIVE_INFINITY) {
  let t = [], o = 0, s = 0;
  for (; o < e.length;) {
    let u = e.codePointAt(o);
    if (C.has(u)) {
      let i = S(e, o);
      if (i) {
        t.push({ type: "ansi", code: i, endCode: I(i) }), o += i.length;
        continue;
      }
    }
    let r = p(u), d = String.fromCodePoint(u);
    if (
      t.push({ type: "character", value: d, isFullWidth: r }),
        o += d.length,
        s += r ? 2 : d.length,
        s >= n
    ) {
      break;
    }
  }
  return t;
}
function a(e) {
  let n = [];
  for (let t of e) {
    t.code === c.reset.open
      ? n = []
      : f.has(t.code)
      ? n = n.filter((o) => o.endCode !== t.code)
      : (n = n.filter((o) => o.endCode !== t.endCode), n.push(t));
  }
  return n;
}
function N(e) {
  return a(e).map(({ endCode: o }) => o).reverse().join("");
}
function b(e, n, t) {
  let o = x(e, t), s = [], u = 0, r = "", d = !1;
  for (let i of o) {
    if (t !== void 0 && u >= t) {
      break;
    }
    i.type === "ansi" ? (s.push(i), d && (r += i.code)) : (!d && u >= n &&
      (d = !0, s = a(s), r = s.map(({ code: h }) => h).join("")),
      d && (r += i.value),
      u += i.isFullWidth ? 2 : i.value.length);
  }
  return r += N(s), r;
}
export { b as default };
//# sourceMappingURL=slice-ansi.mjs.map
