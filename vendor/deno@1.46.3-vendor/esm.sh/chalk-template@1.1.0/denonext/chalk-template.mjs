/* esm.sh - chalk-template@1.1.0 */
import k, { chalkStderr as y } from "../../../esm.sh/chalk@5.4.1_2.js";
var b =
    /(?:\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.))|(?:{(~)?(#?[\w:]+(?:\([^)]*\))?(?:\.#?[\w:]+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(})|((?:.|[\r\n\f])+?)/gi,
  m =
    /(?:^|\.)(?:(?:(\w+)(?:\(([^)]*)\))?)|(?:#(?=[:a-fA-F\d]{2,})([a-fA-F\d]{6})?(?::([a-fA-F\d]{6}))?))/g,
  x = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
  A = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi,
  T = new Map([
    [
      "n",
      `
`,
    ],
    ["r", "\r"],
    ["t", "	"],
    ["b", "\b"],
    ["f", "\f"],
    ["v", "\v"],
    ["0", "\0"],
    ["\\", "\\"],
    ["e", "\x1B"],
    ["a", "\x07"],
  ]);
function d(t) {
  let n = t[0] === "u", e = t[1] === "{";
  return n && !e && t.length === 5 || t[0] === "x" && t.length === 3
    ? String.fromCodePoint(Number.parseInt(t.slice(1), 16))
    : n && e
    ? String.fromCodePoint(Number.parseInt(t.slice(2, -1), 16))
    : T.get(t) || t;
}
function F(t, n) {
  let e = [], l = n.trim().split(/\s*,\s*/g), s;
  for (let r of l) {
    let o = Number(r);
    if (!Number.isNaN(o)) {
      e.push(o);
    } else if (s = r.match(x)) {
      e.push(s[2].replace(A, (a, u, i) => u ? d(u) : i));
    } else {
      throw new Error(
        `Invalid Chalk template style argument: ${r} (in style '${t}')`,
      );
    }
  }
  return e;
}
function g(t) {
  let n = Number.parseInt(t, 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255];
}
function S(t) {
  m.lastIndex = 0;
  let n = [], e;
  for (; (e = m.exec(t)) !== null;) {
    let l = e[1];
    e[2]
      ? n.push([l, ...F(l, e[2])])
      : e[3] || e[4]
      ? (e[3] && n.push(["rgb", ...g(e[3])]),
        e[4] && n.push(["bgRgb", ...g(e[4])]))
      : n.push([l]);
  }
  return n;
}
function c(t) {
  function n(l) {
    let s = {};
    for (let o of l) {
      for (let a of o.styles) {
        s[a[0]] = o.inverse ? null : a.slice(1);
      }
    }
    let r = t;
    for (let [o, a] of Object.entries(s)) {
      if (Array.isArray(a)) {
        if (!(o in r)) {
          throw new Error(`Unknown Chalk style: ${o}`);
        }
        r = a.length > 0 ? r[o](...a) : r[o];
      }
    }
    return r;
  }
  function e(l) {
    let s = [], r = [], o = [];
    if (
      l.replace(b, (a, u, i, f, w, E) => {
        if (u) {
          o.push(d(u));
        } else if (f) {
          let h = o.join("");
          o = [],
            r.push(s.length === 0 ? h : n(s)(h)),
            s.push({ inverse: i, styles: S(f) });
        } else if (w) {
          if (s.length === 0) {
            throw new Error("Found extraneous } in Chalk template literal");
          }
          r.push(n(s)(o.join(""))), o = [], s.pop();
        } else {
          o.push(E);
        }
      }),
        r.push(o.join("")),
        s.length > 0
    ) {
      throw new Error(
        `Chalk template literal is missing ${s.length} closing bracket${
          s.length === 1 ? "" : "s"
        } (\`}\`)`,
      );
    }
    return r.join("");
  }
  return e;
}
function p(t) {
  function n(e, ...l) {
    if (!Array.isArray(e) || !Array.isArray(e.raw)) {
      throw new TypeError("A tagged template literal must be provided");
    }
    let s = [e.raw[0]];
    for (let r = 1; r < e.raw.length; r++) {
      s.push(String(l[r - 1]).replace(/[{}\\]/g, "\\$&"), String(e.raw[r]));
    }
    return t(s.join(""));
  }
  return n;
}
var j = (t) => p(c(t)), N = c(k), I = p(N), C = c(y), R = p(C);
export {
  C as templateStderr,
  c as makeTemplate,
  I as default,
  j as makeTaggedTemplate,
  N as template,
  R as chalkTemplateStderr,
};
//# sourceMappingURL=chalk-template.mjs.map
