/* esm.sh - 7zip-min@2.0.0 */
import __Process$ from "node:process";
import * as __0$ from "node:util";
import * as __1$ from "node:child_process";
import * as __2$ from "../../../esm.sh/7zip-bin@5.1.1/denonext/7zip-bin.mjs";
var require = (n) => {
  const e = (m) => typeof m.default < "u" ? m.default : m,
    c = (m) => Object.assign({ __esModule: true }, m);
  switch (n) {
    case "node:util":
      return e(__0$);
    case "node:child_process":
      return e(__1$);
    case "7zip-bin":
      return e(__2$);
    default:
      console.error('module "' + n + '" not found');
      return null;
  }
};
var x = Object.create;
var y = Object.defineProperty;
var z = Object.getOwnPropertyDescriptor;
var v = Object.getOwnPropertyNames;
var A = Object.getPrototypeOf, S = Object.prototype.hasOwnProperty;
var d =
  ((n) =>
    typeof require < "u"
      ? require
      : typeof Proxy < "u"
      ? new Proxy(n, { get: (t, e) => (typeof require < "u" ? require : t)[e] })
      : n)(function (n) {
      if (typeof require < "u") {
        return require.apply(this, arguments);
      }
      throw Error('Dynamic require of "' + n + '" is not supported');
    });
var j = (n, t) => () => (t || n((t = { exports: {} }).exports, t), t.exports);
var q = (n, t, e, o) => {
  if (t && typeof t == "object" || typeof t == "function") {
    for (let i of v(t)) {
      !S.call(n, i) && i !== e &&
        y(n, i, {
          get: () => t[i],
          enumerable: !(o = z(t, i)) || o.enumerable,
        });
    }
  }
  return n;
};
var M = (
  n,
  t,
  e,
) => (e = n != null ? x(A(n)) : {},
  q(
    t || !n || !n.__esModule
      ? y(e, "default", { value: n, enumerable: !0 })
      : e,
    n,
  ));
var k = j((c) => {
  "use strict";
  var $ = d("node:util").promisify,
    B = d("node:child_process").spawn,
    g = d("7zip-bin").path7za,
    E = "electron" in __Process$.versions && __Process$.argv.length > 1 &&
      __Process$.argv[1]?.includes("app.asar"),
    I = E ? g.replace("app.asar", "app.asar.unpacked") : g;
  function L(n, t, e) {
    typeof t == "function" && e === void 0
      ? (e = t, s(["x", n, "-y"], e))
      : s(["x", n, "-y", "-o" + t], e);
  }
  function T(n, t, e) {
    s(["a", t, n], e);
  }
  function C(n, t) {
    s(["l", "-slt", "-ba", n], t);
  }
  function H(n, t) {
    s(n, t);
  }
  function s(n, t) {
    t = N(t);
    let e = B(I, n, { windowsHide: !0 }), o = "";
    e.on("error", function (i) {
      t(i);
    }),
      e.on("exit", function (i) {
        i
          ? t(
            new Error(`7-zip exited with code ${i}
${o}`),
          )
          : n[0] === "l"
          ? t(null, R(o))
          : t(null, o);
      }),
      e.stdout.on("data", (i) => {
        o += i.toString();
      }),
      e.stderr.on("data", (i) => {
        o += i.toString();
      });
  }
  function N(n) {
    let t = !1;
    return function () {
      t || (t = !0, n.apply(this, Array.prototype.slice.call(arguments)));
    };
  }
  function R(n) {
    if (!n.length) {
      return [];
    }
    n = n.replace(
      /(\r\n|\n|\r)/gm,
      `
`,
    );
    let t = n.split(/^\s*$/m),
      e = [],
      o = {
        Path: "name",
        Size: "size",
        "Packed Size": "compressed",
        Attributes: "attr",
        Modified: "dateTime",
        CRC: "crc",
        Method: "method",
        Block: "block",
        Encrypted: "encrypted",
      };
    if (!t.length) {
      return [];
    }
    for (let i of t) {
      if (!i.length) {
        continue;
      }
      let r = {},
        m = i.split(`
`);
      if (m.length) {
        for (let w of m) {
          let a = w.split(/ = (.*)/s);
          if (a.length !== 3) {
            continue;
          }
          let p = a[0].trim(), h = a[1].trim();
          if (o[p]) {
            if (o[p] === "dateTime") {
              let f = h.split(" ");
              if (f.length !== 2) {
                continue;
              }
              r.date = f[0], r.time = f[1];
            } else {
              r[o[p]] = h;
            }
          }
        }
        Object.keys(r).length && e.push(r);
      }
    }
    return e;
  }
  function l(n) {
    return function (...t) {
      return typeof t[t.length - 1] == "function"
        ? n.apply(this, t)
        : $(n).apply(this, t);
    };
  }
  c.unpack = l(L);
  c.pack = l(T);
  c.list = l(C);
  c.cmd = l(H);
});
var u = M(k()), { unpack: D, pack: F, list: G, cmd: J } = u, K = u.default ?? u;
export { D as unpack, F as pack, G as list, J as cmd, K as default };
//# sourceMappingURL=7zip-min.mjs.map
