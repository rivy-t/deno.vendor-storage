/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/deepmerge@4.3.1/dist/cjs.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var r = function (r) {
  return function (r) {
    return !!r && "object" == typeof r;
  }(r) && !function (r) {
    var t = Object.prototype.toString.call(r);
    return "[object RegExp]" === t || "[object Date]" === t || function (r) {
      return r.$$typeof === e;
    }(r);
  }(r);
};
var e = "function" == typeof Symbol && Symbol.for
  ? Symbol.for("react.element")
  : 60103;
function t(r, e) {
  return !1 !== e.clone && e.isMergeableObject(r)
    ? u((t = r, Array.isArray(t) ? [] : {}), r, e)
    : r;
  var t;
}
function n(r, e, n) {
  return r.concat(e).map(function (r) {
    return t(r, n);
  });
}
function c(r) {
  return Object.keys(r).concat(function (r) {
    return Object.getOwnPropertySymbols
      ? Object.getOwnPropertySymbols(r).filter(function (e) {
        return Object.propertyIsEnumerable.call(r, e);
      })
      : [];
  }(r));
}
function o(r, e) {
  try {
    return e in r;
  } catch (r) {
    return !1;
  }
}
function a(r, e, n) {
  var a = {};
  return n.isMergeableObject(r) && c(r).forEach(function (e) {
    a[e] = t(r[e], n);
  }),
    c(e).forEach(function (c) {
      (function (r, e) {
        return o(r, e) &&
          !(Object.hasOwnProperty.call(r, e) &&
            Object.propertyIsEnumerable.call(r, e));
      })(r, c) || (o(r, c) && n.isMergeableObject(e[c])
        ? a[c] = function (r, e) {
          if (!e.customMerge) {
            return u;
          }
          var t = e.customMerge(r);
          return "function" == typeof t ? t : u;
        }(c, n)(r[c], e[c], n)
        : a[c] = t(e[c], n));
    }),
    a;
}
function u(e, c, o) {
  (o = o || {}).arrayMerge = o.arrayMerge || n,
    o.isMergeableObject = o.isMergeableObject || r,
    o.cloneUnlessOtherwiseSpecified = t;
  var u = Array.isArray(c);
  return u === Array.isArray(e)
    ? u ? o.arrayMerge(e, c, o) : a(e, c, o)
    : t(c, o);
}
u.all = function (r, e) {
  if (!Array.isArray(r)) {
    throw new Error("first argument should be an array");
  }
  return r.reduce(function (r, t) {
    return u(r, t, e);
  }, {});
};
var i = u, f = i.all;
export { f as all, i as default };
//# sourceMappingURL=/sm/fb2e4939b32233cd39a4d27168eb2a9bb4b0f59b59f62837b44dba8b638be18f.map
