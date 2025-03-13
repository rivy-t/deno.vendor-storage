/* esm.sh - 7zip-bin@5.1.1 */
import __Process$ from "node:process";
import * as __0$ from "node:path";
var require = n => {
    const e = m => typeof m.default < "u" ? m.default : m, c = m => Object.assign({ __esModule: true }, m);
    switch (n) {
        case "node:path": return e(__0$);
        default:
            console.error('module "' + n + '" not found');
            return null;
    }
};
var m = Object.create;
var c = Object.defineProperty;
var u = Object.getOwnPropertyDescriptor;
var h = Object.getOwnPropertyNames;
var _ = Object.getPrototypeOf, f = Object.prototype.hasOwnProperty;
var d = (r => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(r, { get: (e, a) => (typeof require < "u" ? require : e)[a] }) : r)(function (r) {
    if (typeof require < "u")
        return require.apply(this, arguments);
    throw Error('Dynamic require of "' + r + '" is not supported');
});
var l = (r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports);
var x = (r, e, a, o) => {
    if (e && typeof e == "object" || typeof e == "function")
        for (let t of h(e))
            !f.call(r, t) && t !== a && c(r, t, { get: () => e[t], enumerable: !(o = u(e, t)) || o.enumerable });
    return r;
};
var j = (r, e, a) => (a = r != null ? m(_(r)) : {}, x(e || !r || !r.__esModule ? c(a, "default", { value: r, enumerable: !0 }) : a, r));
var p = l(i => {
    "use strict";
    var s = d("node:path");
    function z() { return __Process$.env.USE_SYSTEM_7ZA === "true" ? "7za" : __Process$.platform === "darwin" ? s.join("/7zip-bin@5.1.1/denonext", "mac", __Process$.arch, "7za") : __Process$.platform === "win32" ? s.join("/7zip-bin@5.1.1/denonext", "win", __Process$.arch, "7za.exe") : s.join("/7zip-bin@5.1.1/denonext", "linux", __Process$.arch, "7za"); }
    i.path7za = z();
    i.path7x = s.join("/7zip-bin@5.1.1/denonext", "7x.sh");
});
var n = j(p()), { path7za: E, path7x: g } = n, q = n.default ?? n;
export { q as default, g as path7x, E as path7za };
//# sourceMappingURL=7zip-bin.mjs.map
