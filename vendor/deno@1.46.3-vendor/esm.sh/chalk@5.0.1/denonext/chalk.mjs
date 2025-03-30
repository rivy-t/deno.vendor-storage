/* esm.sh - chalk@5.0.1 */
import n from "./source/vendor/ansi-styles/index.mjs";
var j = /\b(Chrome|Chromium)\//.test(navigator.userAgent),
  v = j ? { level: 1, hasBasic: !0, has256: !1, has16m: !1 } : !1,
  E = { stdout: v, stderr: v },
  y = E;
function O(e, t, r) {
  let o = e.indexOf(t);
  if (o === -1) {
    return e;
  }
  let l = t.length, s = 0, c = "";
  do c += e.substr(s, o - s) + t + r, s = o + l, o = e.indexOf(t, s); while (
    o !== -1
  );
  return c += e.slice(s), c;
}
function x(e, t, r, o) {
  let l = 0, s = "";
  do {
    let c = e[o - 1] === "\r";
    s += e.substr(l, (c ? o - 1 : o) - l) + t + (c
      ? `\r
`
      : `
`) +
      r,
      l = o + 1,
      o = e.indexOf(
        `
`,
        l,
      );
  } while (o !== -1);
  return s += e.slice(l), s;
}
var { stdout: A, stderr: C } = y,
  h = Symbol("GENERATOR"),
  i = Symbol("STYLER"),
  f = Symbol("IS_EMPTY"),
  m = ["ansi", "ansi", "ansi256", "ansi16m"],
  u = Object.create(null),
  T = (e, t = {}) => {
    if (
      t.level && !(Number.isInteger(t.level) && t.level >= 0 && t.level <= 3)
    ) {
      throw new Error("The `level` option should be an integer from 0 to 3");
    }
    let r = A ? A.level : 0;
    e.level = t.level === void 0 ? r : t.level;
  },
  S = class {
    constructor(t) {
      return R(t);
    }
  },
  R = (e) => {
    let t = (...r) => r.join(" ");
    return T(t, e), Object.setPrototypeOf(t, a.prototype), t;
  };
function a(e) {
  return R(e);
}
Object.setPrototypeOf(a.prototype, Function.prototype);
for (let [e, t] of Object.entries(n)) {
  u[e] = {
    get() {
      let r = d(this, b(t.open, t.close, this[i]), this[f]);
      return Object.defineProperty(this, e, { value: r }), r;
    },
  };
}
u.visible = {
  get() {
    let e = d(this, this[i], !0);
    return Object.defineProperty(this, "visible", { value: e }), e;
  },
};
var p = (e, t, r, ...o) =>
    e === "rgb"
      ? t === "ansi16m"
        ? n[r].ansi16m(...o)
        : t === "ansi256"
        ? n[r].ansi256(n.rgbToAnsi256(...o))
        : n[r].ansi(n.rgbToAnsi(...o))
      : e === "hex"
      ? p("rgb", t, r, ...n.hexToRgb(...o))
      : n[r][e](...o),
  P = ["rgb", "hex", "ansi256"];
for (let e of P) {
  u[e] = {
    get() {
      let { level: r } = this;
      return function (...o) {
        let l = b(p(e, m[r], "color", ...o), n.color.close, this[i]);
        return d(this, l, this[f]);
      };
    },
  };
  let t = "bg" + e[0].toUpperCase() + e.slice(1);
  u[t] = {
    get() {
      let { level: r } = this;
      return function (...o) {
        let l = b(p(e, m[r], "bgColor", ...o), n.bgColor.close, this[i]);
        return d(this, l, this[f]);
      };
    },
  };
}
var I = Object.defineProperties(() => {}, {
    ...u,
    level: {
      enumerable: !0,
      get() {
        return this[h].level;
      },
      set(e) {
        this[h].level = e;
      },
    },
  }),
  b = (e, t, r) => {
    let o, l;
    return r === void 0
      ? (o = e, l = t)
      : (o = r.openAll + e, l = t + r.closeAll),
      { open: e, close: t, openAll: o, closeAll: l, parent: r };
  },
  d = (e, t, r) => {
    let o = (...l) => w(o, l.length === 1 ? "" + l[0] : l.join(" "));
    return Object.setPrototypeOf(o, I), o[h] = e, o[i] = t, o[f] = r, o;
  },
  w = (e, t) => {
    if (e.level <= 0 || !t) {
      return e[f] ? "" : t;
    }
    let r = e[i];
    if (r === void 0) {
      return t;
    }
    let { openAll: o, closeAll: l } = r;
    if (t.includes("\x1B")) {
      for (; r !== void 0;) {
        t = O(t, r.close, r.open), r = r.parent;
      }
    }
    let s = t.indexOf(`
`);
    return s !== -1 && (t = x(t, l, o, s)), o + t + l;
  };
Object.defineProperties(a.prototype, u);
var B = a(), N = a({ level: C ? C.level : 0 });
var Y = B;
export {
  A as supportsColor,
  C as supportsColorStderr,
  N as chalkStderr,
  S as Chalk,
  Y as default,
};
//# sourceMappingURL=chalk.mjs.map
