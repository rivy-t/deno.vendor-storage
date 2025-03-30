/* esm.sh - chalk@2.4.2 */
import __Process$ from "node:process";
import * as __0$ from "../../../esm.sh/escape-string-regexp@1.0.5.js";
import * as __1$ from "../../../esm.sh/ansi-styles@3.2.1.js";
import * as __2$ from "../../../esm.sh/supports-color@5.5.0.js";
var require = (n) => {
  const e = (m) => typeof m.default < "u" ? m.default : m,
    c = (m) => Object.assign({ __esModule: true }, m);
  switch (n) {
    case "escape-string-regexp":
      return e(__0$);
    case "ansi-styles":
      return e(__1$);
    case "supports-color":
      return e(__2$);
    default:
      console.error('module "' + n + '" not found');
      return null;
  }
};
var G = Object.create;
var v = Object.defineProperty;
var M = Object.getOwnPropertyDescriptor;
var T = Object.getOwnPropertyNames;
var L = Object.getPrototypeOf, N = Object.prototype.hasOwnProperty;
var m =
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
var w = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var q = (e, t, s, l) => {
  if (t && typeof t == "object" || typeof t == "function") {
    for (let n of T(t)) {
      !N.call(e, n) && n !== s &&
        v(e, n, {
          get: () => t[n],
          enumerable: !(l = M(t, n)) || l.enumerable,
        });
    }
  }
  return e;
};
var I = (
  e,
  t,
  s,
) => (s = e != null ? G(L(e)) : {},
  q(
    t || !e || !e.__esModule
      ? v(s, "default", { value: e, enumerable: !0 })
      : s,
    e,
  ));
var R = w((Q, x) => {
  "use strict";
  var X =
      /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
    E = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
    B = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
    U = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi,
    W = new Map([
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
  function C(e) {
    return e[0] === "u" && e.length === 5 || e[0] === "x" && e.length === 3
      ? String.fromCharCode(parseInt(e.slice(1), 16))
      : W.get(e) || e;
  }
  function D(e, t) {
    let s = [], l = t.trim().split(/\s*,\s*/g), n;
    for (let o of l) {
      if (!isNaN(o)) {
        s.push(Number(o));
      } else if (n = o.match(B)) {
        s.push(n[2].replace(U, (g, u, p) => u ? C(u) : p));
      } else {
        throw new Error(
          `Invalid Chalk template style argument: ${o} (in style '${e}')`,
        );
      }
    }
    return s;
  }
  function F(e) {
    E.lastIndex = 0;
    let t = [], s;
    for (; (s = E.exec(e)) !== null;) {
      let l = s[1];
      if (s[2]) {
        let n = D(l, s[2]);
        t.push([l].concat(n));
      } else {
        t.push([l]);
      }
    }
    return t;
  }
  function _(e, t) {
    let s = {};
    for (let n of t) {
      for (let o of n.styles) {
        s[o[0]] = n.inverse ? null : o.slice(1);
      }
    }
    let l = e;
    for (let n of Object.keys(s)) {
      if (Array.isArray(s[n])) {
        if (!(n in l)) {
          throw new Error(`Unknown Chalk style: ${n}`);
        }
        s[n].length > 0 ? l = l[n].apply(l, s[n]) : l = l[n];
      }
    }
    return l;
  }
  x.exports = (e, t) => {
    let s = [], l = [], n = [];
    if (
      t.replace(X, (o, g, u, p, P, A) => {
        if (g) {
          n.push(C(g));
        } else if (p) {
          let b = n.join("");
          n = [],
            l.push(s.length === 0 ? b : _(e, s)(b)),
            s.push({ inverse: u, styles: F(p) });
        } else if (P) {
          if (s.length === 0) {
            throw new Error("Found extraneous } in Chalk template literal");
          }
          l.push(_(e, s)(n.join(""))), n = [], s.pop();
        } else {
          n.push(A);
        }
      }),
        l.push(n.join("")),
        s.length > 0
    ) {
      let o = `Chalk template literal is missing ${s.length} closing bracket${
        s.length === 1 ? "" : "s"
      } (\`}\`)`;
      throw new Error(o);
    }
    return l.join("");
  };
});
var $ = w((V, a) => {
  "use strict";
  var d = m("escape-string-regexp"),
    r = m("ansi-styles"),
    y = m("supports-color").stdout,
    Y = R(),
    k = __Process$.platform === "win32" &&
      !(__Process$.env.TERM || "").toLowerCase().startsWith("xterm"),
    S = ["ansi", "ansi", "ansi256", "ansi16m"],
    O = new Set(["gray"]),
    c = Object.create(null);
  function j(e, t) {
    t = t || {};
    let s = y ? y.level : 0;
    e.level = t.level === void 0 ? s : t.level,
      e.enabled = "enabled" in t ? t.enabled : e.level > 0;
  }
  function i(e) {
    if (!this || !(this instanceof i) || this.template) {
      let t = {};
      return j(t, e),
        t.template = function () {
          let s = [].slice.call(arguments);
          return J.apply(null, [t.template].concat(s));
        },
        Object.setPrototypeOf(t, i.prototype),
        Object.setPrototypeOf(t.template, t),
        t.template.constructor = i,
        t.template;
    }
    j(this, e);
  }
  k && (r.blue.open = "\x1B[94m");
  for (let e of Object.keys(r)) {
    r[e].closeRe = new RegExp(d(r[e].close), "g"),
      c[e] = {
        get() {
          let t = r[e];
          return f.call(
            this,
            this._styles ? this._styles.concat(t) : [t],
            this._empty,
            e,
          );
        },
      };
  }
  c.visible = {
    get() {
      return f.call(this, this._styles || [], !0, "visible");
    },
  };
  r.color.closeRe = new RegExp(d(r.color.close), "g");
  for (let e of Object.keys(r.color.ansi)) {
    O.has(e) || (c[e] = {
      get() {
        let t = this.level;
        return function () {
          let l = {
            open: r.color[S[t]][e].apply(null, arguments),
            close: r.color.close,
            closeRe: r.color.closeRe,
          };
          return f.call(
            this,
            this._styles ? this._styles.concat(l) : [l],
            this._empty,
            e,
          );
        };
      },
    });
  }
  r.bgColor.closeRe = new RegExp(d(r.bgColor.close), "g");
  for (let e of Object.keys(r.bgColor.ansi)) {
    if (O.has(e)) {
      continue;
    }
    let t = "bg" + e[0].toUpperCase() + e.slice(1);
    c[t] = {
      get() {
        let s = this.level;
        return function () {
          let n = {
            open: r.bgColor[S[s]][e].apply(null, arguments),
            close: r.bgColor.close,
            closeRe: r.bgColor.closeRe,
          };
          return f.call(
            this,
            this._styles ? this._styles.concat(n) : [n],
            this._empty,
            e,
          );
        };
      },
    };
  }
  var z = Object.defineProperties(() => {}, c);
  function f(e, t, s) {
    let l = function () {
      return H.apply(l, arguments);
    };
    l._styles = e, l._empty = t;
    let n = this;
    return Object.defineProperty(l, "level", {
      enumerable: !0,
      get() {
        return n.level;
      },
      set(o) {
        n.level = o;
      },
    }),
      Object.defineProperty(l, "enabled", {
        enumerable: !0,
        get() {
          return n.enabled;
        },
        set(o) {
          n.enabled = o;
        },
      }),
      l.hasGrey = this.hasGrey || s === "gray" || s === "grey",
      l.__proto__ = z,
      l;
  }
  function H() {
    let e = arguments, t = e.length, s = String(arguments[0]);
    if (t === 0) {
      return "";
    }
    if (t > 1) {
      for (let n = 1; n < t; n++) {
        s += " " + e[n];
      }
    }
    if (!this.enabled || this.level <= 0 || !s) {
      return this._empty ? "" : s;
    }
    let l = r.dim.open;
    k && this.hasGrey && (r.dim.open = "");
    for (let n of this._styles.slice().reverse()) {
      s = n.open + s.replace(n.closeRe, n.open) + n.close,
        s = s.replace(/\r?\n/g, `${n.close}$&${n.open}`);
    }
    return r.dim.open = l, s;
  }
  function J(e, t) {
    if (!Array.isArray(t)) {
      return [].slice.call(arguments, 1).join(" ");
    }
    let s = [].slice.call(arguments, 2), l = [t.raw[0]];
    for (let n = 1; n < t.length; n++) {
      l.push(String(s[n - 1]).replace(/[{}\\]/g, "\\$&")),
        l.push(String(t.raw[n]));
    }
    return Y(e, l.join(""));
  }
  Object.defineProperties(i.prototype, c);
  a.exports = i();
  a.exports.supportsColor = y;
  a.exports.default = a.exports;
});
var h = I($()), { supportsColor: Z } = h, ee = h.default ?? h;
export { ee as default, Z as supportsColor };
//# sourceMappingURL=chalk.mjs.map
