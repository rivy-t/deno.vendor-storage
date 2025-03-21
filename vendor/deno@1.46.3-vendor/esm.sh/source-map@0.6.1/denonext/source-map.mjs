/* esm.sh - source-map@0.6.1 */
var Ne = Object.create;
var ie = Object.defineProperty;
var Ge = Object.getOwnPropertyDescriptor;
var Ie = Object.getOwnPropertyNames;
var xe = Object.getPrototypeOf, Te = Object.prototype.hasOwnProperty;
var A = (n, e) => () => (e || n((e = { exports: {} }).exports, e), e.exports);
var De = (n, e, r, t) => {
  if (e && typeof e == "object" || typeof e == "function") {
    for (let o of Ie(e)) {
      !Te.call(n, o) && o !== r &&
        ie(n, o, {
          get: () => e[o],
          enumerable: !(t = Ge(e, o)) || t.enumerable,
        });
    }
  }
  return n;
};
var qe = (
  n,
  e,
  r,
) => (r = n != null ? Ne(xe(n)) : {},
  De(
    e || !n || !n.__esModule
      ? ie(r, "default", { value: n, enumerable: !0 })
      : r,
    n,
  ));
var ue = A((V) => {
  var se = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    .split("");
  V.encode = function (n) {
    if (0 <= n && n < se.length) {
      return se[n];
    }
    throw new TypeError("Must be between 0 and 63: " + n);
  };
  V.decode = function (n) {
    var e = 65,
      r = 90,
      t = 97,
      o = 122,
      i = 48,
      s = 57,
      c = 43,
      u = 47,
      f = 26,
      l = 52;
    return e <= n && n <= r
      ? n - e
      : t <= n && n <= o
      ? n - t + f
      : i <= n && n <= s
      ? n - i + l
      : n == c
      ? 62
      : n == u
      ? 63
      : -1;
  };
});
var k = A((J) => {
  var le = ue(), $ = 5, ae = 1 << $, ce = ae - 1, fe = ae;
  function je(n) {
    return n < 0 ? (-n << 1) + 1 : (n << 1) + 0;
  }
  function Pe(n) {
    var e = (n & 1) === 1, r = n >> 1;
    return e ? -r : r;
  }
  J.encode = function (e) {
    var r = "", t, o = je(e);
    do t = o & ce, o >>>= $, o > 0 && (t |= fe), r += le.encode(t); while (
      o > 0
    );
    return r;
  };
  J.decode = function (e, r, t) {
    var o = e.length, i = 0, s = 0, c, u;
    do {
      if (r >= o) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      if (u = le.decode(e.charCodeAt(r++)), u === -1) {
        throw new Error("Invalid base64 digit: " + e.charAt(r - 1));
      }
      c = !!(u & fe), u &= ce, i = i + (u << s), s += $;
    } while (c);
    t.value = Pe(i), t.rest = r;
  };
});
var I = A((S) => {
  function Be(n, e, r) {
    if (e in n) {
      return n[e];
    }
    if (arguments.length === 3) {
      return r;
    }
    throw new Error('"' + e + '" is a required argument.');
  }
  S.getArg = Be;
  var he = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/,
    Ue = /^data:.+\,.+$/;
  function D(n) {
    var e = n.match(he);
    return e
      ? { scheme: e[1], auth: e[2], host: e[3], port: e[4], path: e[5] }
      : null;
  }
  S.urlParse = D;
  function N(n) {
    var e = "";
    return n.scheme && (e += n.scheme + ":"),
      e += "//",
      n.auth && (e += n.auth + "@"),
      n.host && (e += n.host),
      n.port && (e += ":" + n.port),
      n.path && (e += n.path),
      e;
  }
  S.urlGenerate = N;
  function Z(n) {
    var e = n, r = D(n);
    if (r) {
      if (!r.path) {
        return n;
      }
      e = r.path;
    }
    for (
      var t = S.isAbsolute(e), o = e.split(/\/+/), i, s = 0, c = o.length - 1;
      c >= 0;
      c--
    ) {
      i = o[c],
        i === "." ? o.splice(c, 1) : i === ".." ? s++ : s > 0 &&
          (i === "" ? (o.splice(c + 1, s), s = 0) : (o.splice(c, 2), s--));
    }
    return e = o.join("/"),
      e === "" && (e = t ? "/" : "."),
      r ? (r.path = e, N(r)) : e;
  }
  S.normalize = Z;
  function ge(n, e) {
    n === "" && (n = "."), e === "" && (e = ".");
    var r = D(e), t = D(n);
    if (t && (n = t.path || "/"), r && !r.scheme) {
      return t && (r.scheme = t.scheme), N(r);
    }
    if (r || e.match(Ue)) {
      return e;
    }
    if (t && !t.host && !t.path) {
      return t.host = e, N(t);
    }
    var o = e.charAt(0) === "/" ? e : Z(n.replace(/\/+$/, "") + "/" + e);
    return t ? (t.path = o, N(t)) : o;
  }
  S.join = ge;
  S.isAbsolute = function (n) {
    return n.charAt(0) === "/" || he.test(n);
  };
  function Fe(n, e) {
    n === "" && (n = "."), n = n.replace(/\/$/, "");
    for (var r = 0; e.indexOf(n + "/") !== 0;) {
      var t = n.lastIndexOf("/");
      if (t < 0 || (n = n.slice(0, t), n.match(/^([^\/]+:\/)?\/*$/))) {
        return e;
      }
      ++r;
    }
    return Array(r + 1).join("../") + e.substr(n.length + 1);
  }
  S.relative = Fe;
  var de = function () {
    var n = Object.create(null);
    return !("__proto__" in n);
  }();
  function pe(n) {
    return n;
  }
  function ze(n) {
    return ve(n) ? "$" + n : n;
  }
  S.toSetString = de ? pe : ze;
  function Qe(n) {
    return ve(n) ? n.slice(1) : n;
  }
  S.fromSetString = de ? pe : Qe;
  function ve(n) {
    if (!n) {
      return !1;
    }
    var e = n.length;
    if (
      e < 9 || n.charCodeAt(e - 1) !== 95 || n.charCodeAt(e - 2) !== 95 ||
      n.charCodeAt(e - 3) !== 111 || n.charCodeAt(e - 4) !== 116 ||
      n.charCodeAt(e - 5) !== 111 || n.charCodeAt(e - 6) !== 114 ||
      n.charCodeAt(e - 7) !== 112 || n.charCodeAt(e - 8) !== 95 ||
      n.charCodeAt(e - 9) !== 95
    ) {
      return !1;
    }
    for (var r = e - 10; r >= 0; r--) {
      if (n.charCodeAt(r) !== 36) {
        return !1;
      }
    }
    return !0;
  }
  function We(n, e, r) {
    var t = G(n.source, e.source);
    return t !== 0 || (t = n.originalLine - e.originalLine, t !== 0) ||
        (t = n.originalColumn - e.originalColumn, t !== 0 || r) ||
        (t = n.generatedColumn - e.generatedColumn, t !== 0) ||
        (t = n.generatedLine - e.generatedLine, t !== 0)
      ? t
      : G(n.name, e.name);
  }
  S.compareByOriginalPositions = We;
  function Ve(n, e, r) {
    var t = n.generatedLine - e.generatedLine;
    return t !== 0 ||
        (t = n.generatedColumn - e.generatedColumn, t !== 0 || r) ||
        (t = G(n.source, e.source), t !== 0) ||
        (t = n.originalLine - e.originalLine, t !== 0) ||
        (t = n.originalColumn - e.originalColumn, t !== 0)
      ? t
      : G(n.name, e.name);
  }
  S.compareByGeneratedPositionsDeflated = Ve;
  function G(n, e) {
    return n === e ? 0 : n === null ? 1 : e === null ? -1 : n > e ? 1 : -1;
  }
  function $e(n, e) {
    var r = n.generatedLine - e.generatedLine;
    return r !== 0 || (r = n.generatedColumn - e.generatedColumn, r !== 0) ||
        (r = G(n.source, e.source), r !== 0) ||
        (r = n.originalLine - e.originalLine, r !== 0) ||
        (r = n.originalColumn - e.originalColumn, r !== 0)
      ? r
      : G(n.name, e.name);
  }
  S.compareByGeneratedPositionsInflated = $e;
  function Je(n) {
    return JSON.parse(n.replace(/^\)]}'[^\n]*\n/, ""));
  }
  S.parseSourceMapInput = Je;
  function ke(n, e, r) {
    if (
      e = e || "",
        n && (n[n.length - 1] !== "/" && e[0] !== "/" && (n += "/"), e = n + e),
        r
    ) {
      var t = D(r);
      if (!t) {
        throw new Error("sourceMapURL could not be parsed");
      }
      if (t.path) {
        var o = t.path.lastIndexOf("/");
        o >= 0 && (t.path = t.path.substring(0, o + 1));
      }
      e = ge(N(t), e);
    }
    return Z(e);
  }
  S.computeSourceURL = ke;
});
var Y = A((_e) => {
  var K = I(), X = Object.prototype.hasOwnProperty, E = typeof Map < "u";
  function O() {
    this._array = [], this._set = E ? new Map() : Object.create(null);
  }
  O.fromArray = function (e, r) {
    for (var t = new O(), o = 0, i = e.length; o < i; o++) {
      t.add(e[o], r);
    }
    return t;
  };
  O.prototype.size = function () {
    return E ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  O.prototype.add = function (e, r) {
    var t = E ? e : K.toSetString(e),
      o = E ? this.has(e) : X.call(this._set, t),
      i = this._array.length;
    (!o || r) && this._array.push(e),
      o || (E ? this._set.set(e, i) : this._set[t] = i);
  };
  O.prototype.has = function (e) {
    if (E) {
      return this._set.has(e);
    }
    var r = K.toSetString(e);
    return X.call(this._set, r);
  };
  O.prototype.indexOf = function (e) {
    if (E) {
      var r = this._set.get(e);
      if (r >= 0) {
        return r;
      }
    } else {
      var t = K.toSetString(e);
      if (X.call(this._set, t)) {
        return this._set[t];
      }
    }
    throw new Error('"' + e + '" is not in the set.');
  };
  O.prototype.at = function (e) {
    if (e >= 0 && e < this._array.length) {
      return this._array[e];
    }
    throw new Error("No element indexed by " + e);
  };
  O.prototype.toArray = function () {
    return this._array.slice();
  };
  _e.ArraySet = O;
});
var Ce = A((Se) => {
  var me = I();
  function Ze(n, e) {
    var r = n.generatedLine,
      t = e.generatedLine,
      o = n.generatedColumn,
      i = e.generatedColumn;
    return t > r || t == r && i >= o ||
      me.compareByGeneratedPositionsInflated(n, e) <= 0;
  }
  function B() {
    this._array = [],
      this._sorted = !0,
      this._last = { generatedLine: -1, generatedColumn: 0 };
  }
  B.prototype.unsortedForEach = function (e, r) {
    this._array.forEach(e, r);
  };
  B.prototype.add = function (e) {
    Ze(this._last, e)
      ? (this._last = e, this._array.push(e))
      : (this._sorted = !1, this._array.push(e));
  };
  B.prototype.toArray = function () {
    return this._sorted ||
      (this._array.sort(me.compareByGeneratedPositionsInflated),
        this._sorted = !0),
      this._array;
  };
  Se.MappingList = B;
});
var H = A((ye) => {
  var q = k(), v = I(), U = Y().ArraySet, Ke = Ce().MappingList;
  function M(n) {
    n || (n = {}),
      this._file = v.getArg(n, "file", null),
      this._sourceRoot = v.getArg(n, "sourceRoot", null),
      this._skipValidation = v.getArg(n, "skipValidation", !1),
      this._sources = new U(),
      this._names = new U(),
      this._mappings = new Ke(),
      this._sourcesContents = null;
  }
  M.prototype._version = 3;
  M.fromSourceMap = function (e) {
    var r = e.sourceRoot, t = new M({ file: e.file, sourceRoot: r });
    return e.eachMapping(function (o) {
      var i = {
        generated: { line: o.generatedLine, column: o.generatedColumn },
      };
      o.source != null &&
      (i.source = o.source,
        r != null && (i.source = v.relative(r, i.source)),
        i.original = { line: o.originalLine, column: o.originalColumn },
        o.name != null && (i.name = o.name)), t.addMapping(i);
    }),
      e.sources.forEach(function (o) {
        var i = o;
        r !== null && (i = v.relative(r, o)),
          t._sources.has(i) || t._sources.add(i);
        var s = e.sourceContentFor(o);
        s != null && t.setSourceContent(o, s);
      }),
      t;
  };
  M.prototype.addMapping = function (e) {
    var r = v.getArg(e, "generated"),
      t = v.getArg(e, "original", null),
      o = v.getArg(e, "source", null),
      i = v.getArg(e, "name", null);
    this._skipValidation || this._validateMapping(r, t, o, i),
      o != null &&
      (o = String(o), this._sources.has(o) || this._sources.add(o)),
      i != null && (i = String(i), this._names.has(i) || this._names.add(i)),
      this._mappings.add({
        generatedLine: r.line,
        generatedColumn: r.column,
        originalLine: t != null && t.line,
        originalColumn: t != null && t.column,
        source: o,
        name: i,
      });
  };
  M.prototype.setSourceContent = function (e, r) {
    var t = e;
    this._sourceRoot != null && (t = v.relative(this._sourceRoot, t)),
      r != null
        ? (this._sourcesContents ||
          (this._sourcesContents = Object.create(null)),
          this._sourcesContents[v.toSetString(t)] = r)
        : this._sourcesContents &&
          (delete this._sourcesContents[v.toSetString(t)],
            Object.keys(this._sourcesContents).length === 0 &&
            (this._sourcesContents = null));
  };
  M.prototype.applySourceMap = function (e, r, t) {
    var o = r;
    if (r == null) {
      if (e.file == null) {
        throw new Error(
          `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`,
        );
      }
      o = e.file;
    }
    var i = this._sourceRoot;
    i != null && (o = v.relative(i, o));
    var s = new U(), c = new U();
    this._mappings.unsortedForEach(function (u) {
      if (u.source === o && u.originalLine != null) {
        var f = e.originalPositionFor({
          line: u.originalLine,
          column: u.originalColumn,
        });
        f.source != null &&
          (u.source = f.source,
            t != null && (u.source = v.join(t, u.source)),
            i != null && (u.source = v.relative(i, u.source)),
            u.originalLine = f.line,
            u.originalColumn = f.column,
            f.name != null && (u.name = f.name));
      }
      var l = u.source;
      l != null && !s.has(l) && s.add(l);
      var g = u.name;
      g != null && !c.has(g) && c.add(g);
    }, this),
      this._sources = s,
      this._names = c,
      e.sources.forEach(function (u) {
        var f = e.sourceContentFor(u);
        f != null &&
          (t != null && (u = v.join(t, u)),
            i != null && (u = v.relative(i, u)),
            this.setSourceContent(u, f));
      }, this);
  };
  M.prototype._validateMapping = function (e, r, t, o) {
    if (r && typeof r.line != "number" && typeof r.column != "number") {
      throw new Error(
        "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.",
      );
    }
    if (
      !(e && "line" in e && "column" in e && e.line > 0 && e.column >= 0 &&
        !r && !t && !o)
    ) {
      if (
        e && "line" in e && "column" in e && r && "line" in r &&
        "column" in r && e.line > 0 && e.column >= 0 && r.line > 0 &&
        r.column >= 0 && t
      ) {
        return;
      }
      throw new Error(
        "Invalid mapping: " +
          JSON.stringify({ generated: e, source: t, original: r, name: o }),
      );
    }
  };
  M.prototype._serializeMappings = function () {
    for (
      var e = 0,
        r = 1,
        t = 0,
        o = 0,
        i = 0,
        s = 0,
        c = "",
        u,
        f,
        l,
        g,
        h = this._mappings.toArray(),
        d = 0,
        L = h.length;
      d < L;
      d++
    ) {
      if (f = h[d], u = "", f.generatedLine !== r) {
        for (e = 0; f.generatedLine !== r;) {
          u += ";", r++;
        }
      } else if (d > 0) {
        if (!v.compareByGeneratedPositionsInflated(f, h[d - 1])) {
          continue;
        }
        u += ",";
      }
      u += q.encode(f.generatedColumn - e),
        e = f.generatedColumn,
        f.source != null &&
        (g = this._sources.indexOf(f.source),
          u += q.encode(g - s),
          s = g,
          u += q.encode(f.originalLine - 1 - o),
          o = f.originalLine - 1,
          u += q.encode(f.originalColumn - t),
          t = f.originalColumn,
          f.name != null &&
          (l = this._names.indexOf(f.name), u += q.encode(l - i), i = l)),
        c += u;
    }
    return c;
  };
  M.prototype._generateSourcesContent = function (e, r) {
    return e.map(function (t) {
      if (!this._sourcesContents) {
        return null;
      }
      r != null && (t = v.relative(r, t));
      var o = v.toSetString(t);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, o)
        ? this._sourcesContents[o]
        : null;
    }, this);
  };
  M.prototype.toJSON = function () {
    var e = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings(),
    };
    return this._file != null && (e.file = this._file),
      this._sourceRoot != null && (e.sourceRoot = this._sourceRoot),
      this._sourcesContents &&
      (e.sourcesContent = this._generateSourcesContent(
        e.sources,
        e.sourceRoot,
      )),
      e;
  };
  M.prototype.toString = function () {
    return JSON.stringify(this.toJSON());
  };
  ye.SourceMapGenerator = M;
});
var Le = A((b) => {
  b.GREATEST_LOWER_BOUND = 1;
  b.LEAST_UPPER_BOUND = 2;
  function ee(n, e, r, t, o, i) {
    var s = Math.floor((e - n) / 2) + n, c = o(r, t[s], !0);
    return c === 0
      ? s
      : c > 0
      ? e - s > 1
        ? ee(s, e, r, t, o, i)
        : i == b.LEAST_UPPER_BOUND
        ? e < t.length ? e : -1
        : s
      : s - n > 1
      ? ee(n, s, r, t, o, i)
      : i == b.LEAST_UPPER_BOUND
      ? s
      : n < 0
      ? -1
      : n;
  }
  b.search = function (e, r, t, o) {
    if (r.length === 0) {
      return -1;
    }
    var i = ee(-1, r.length, e, r, t, o || b.GREATEST_LOWER_BOUND);
    if (i < 0) {
      return -1;
    }
    for (; i - 1 >= 0 && t(r[i], r[i - 1], !0) === 0;) {
      --i;
    }
    return i;
  };
});
var Ae = A((Me) => {
  function re(n, e, r) {
    var t = n[e];
    n[e] = n[r], n[r] = t;
  }
  function Xe(n, e) {
    return Math.round(n + Math.random() * (e - n));
  }
  function ne(n, e, r, t) {
    if (r < t) {
      var o = Xe(r, t), i = r - 1;
      re(n, o, t);
      for (var s = n[t], c = r; c < t; c++) {
        e(n[c], s) <= 0 && (i += 1, re(n, i, c));
      }
      re(n, i + 1, c);
      var u = i + 1;
      ne(n, e, r, u - 1), ne(n, e, u + 1, t);
    }
  }
  Me.quickSort = function (n, e) {
    ne(n, e, 0, n.length - 1);
  };
});
var Oe = A((F) => {
  var a = I(), te = Le(), x = Y().ArraySet, Ye = k(), j = Ae().quickSort;
  function p(n, e) {
    var r = n;
    return typeof n == "string" && (r = a.parseSourceMapInput(n)),
      r.sections != null ? new w(r, e) : new _(r, e);
  }
  p.fromSourceMap = function (n, e) {
    return _.fromSourceMap(n, e);
  };
  p.prototype._version = 3;
  p.prototype.__generatedMappings = null;
  Object.defineProperty(p.prototype, "_generatedMappings", {
    configurable: !0,
    enumerable: !0,
    get: function () {
      return this.__generatedMappings ||
        this._parseMappings(this._mappings, this.sourceRoot),
        this.__generatedMappings;
    },
  });
  p.prototype.__originalMappings = null;
  Object.defineProperty(p.prototype, "_originalMappings", {
    configurable: !0,
    enumerable: !0,
    get: function () {
      return this.__originalMappings ||
        this._parseMappings(this._mappings, this.sourceRoot),
        this.__originalMappings;
    },
  });
  p.prototype._charIsMappingSeparator = function (e, r) {
    var t = e.charAt(r);
    return t === ";" || t === ",";
  };
  p.prototype._parseMappings = function (e, r) {
    throw new Error("Subclasses must implement _parseMappings");
  };
  p.GENERATED_ORDER = 1;
  p.ORIGINAL_ORDER = 2;
  p.GREATEST_LOWER_BOUND = 1;
  p.LEAST_UPPER_BOUND = 2;
  p.prototype.eachMapping = function (e, r, t) {
    var o = r || null, i = t || p.GENERATED_ORDER, s;
    switch (i) {
      case p.GENERATED_ORDER:
        s = this._generatedMappings;
        break;
      case p.ORIGINAL_ORDER:
        s = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
    }
    var c = this.sourceRoot;
    s.map(function (u) {
      var f = u.source === null ? null : this._sources.at(u.source);
      return f = a.computeSourceURL(c, f, this._sourceMapURL), {
        source: f,
        generatedLine: u.generatedLine,
        generatedColumn: u.generatedColumn,
        originalLine: u.originalLine,
        originalColumn: u.originalColumn,
        name: u.name === null ? null : this._names.at(u.name),
      };
    }, this).forEach(e, o);
  };
  p.prototype.allGeneratedPositionsFor = function (e) {
    var r = a.getArg(e, "line"),
      t = {
        source: a.getArg(e, "source"),
        originalLine: r,
        originalColumn: a.getArg(e, "column", 0),
      };
    if (t.source = this._findSourceIndex(t.source), t.source < 0) {
      return [];
    }
    var o = [],
      i = this._findMapping(
        t,
        this._originalMappings,
        "originalLine",
        "originalColumn",
        a.compareByOriginalPositions,
        te.LEAST_UPPER_BOUND,
      );
    if (i >= 0) {
      var s = this._originalMappings[i];
      if (e.column === void 0) {
        for (var c = s.originalLine; s && s.originalLine === c;) {
          o.push({
            line: a.getArg(s, "generatedLine", null),
            column: a.getArg(s, "generatedColumn", null),
            lastColumn: a.getArg(s, "lastGeneratedColumn", null),
          }), s = this._originalMappings[++i];
        }
      } else {
        for (
          var u = s.originalColumn;
          s && s.originalLine === r && s.originalColumn == u;
        ) {
          o.push({
            line: a.getArg(s, "generatedLine", null),
            column: a.getArg(s, "generatedColumn", null),
            lastColumn: a.getArg(s, "lastGeneratedColumn", null),
          }), s = this._originalMappings[++i];
        }
      }
    }
    return o;
  };
  F.SourceMapConsumer = p;
  function _(n, e) {
    var r = n;
    typeof n == "string" && (r = a.parseSourceMapInput(n));
    var t = a.getArg(r, "version"),
      o = a.getArg(r, "sources"),
      i = a.getArg(r, "names", []),
      s = a.getArg(r, "sourceRoot", null),
      c = a.getArg(r, "sourcesContent", null),
      u = a.getArg(r, "mappings"),
      f = a.getArg(r, "file", null);
    if (t != this._version) {
      throw new Error("Unsupported version: " + t);
    }
    s && (s = a.normalize(s)),
      o = o.map(String).map(a.normalize).map(function (l) {
        return s && a.isAbsolute(s) && a.isAbsolute(l) ? a.relative(s, l) : l;
      }),
      this._names = x.fromArray(i.map(String), !0),
      this._sources = x.fromArray(o, !0),
      this._absoluteSources = this._sources.toArray().map(function (l) {
        return a.computeSourceURL(s, l, e);
      }),
      this.sourceRoot = s,
      this.sourcesContent = c,
      this._mappings = u,
      this._sourceMapURL = e,
      this.file = f;
  }
  _.prototype = Object.create(p.prototype);
  _.prototype.consumer = p;
  _.prototype._findSourceIndex = function (n) {
    var e = n;
    if (
      this.sourceRoot != null && (e = a.relative(this.sourceRoot, e)),
        this._sources.has(e)
    ) {
      return this._sources.indexOf(e);
    }
    var r;
    for (r = 0; r < this._absoluteSources.length; ++r) {
      if (this._absoluteSources[r] == n) {
        return r;
      }
    }
    return -1;
  };
  _.fromSourceMap = function (e, r) {
    var t = Object.create(_.prototype),
      o = t._names = x.fromArray(e._names.toArray(), !0),
      i = t._sources = x.fromArray(e._sources.toArray(), !0);
    t.sourceRoot = e._sourceRoot,
      t.sourcesContent = e._generateSourcesContent(
        t._sources.toArray(),
        t.sourceRoot,
      ),
      t.file = e._file,
      t._sourceMapURL = r,
      t._absoluteSources = t._sources.toArray().map(function (d) {
        return a.computeSourceURL(t.sourceRoot, d, r);
      });
    for (
      var s = e._mappings.toArray().slice(),
        c = t.__generatedMappings = [],
        u = t.__originalMappings = [],
        f = 0,
        l = s.length;
      f < l;
      f++
    ) {
      var g = s[f], h = new we();
      h.generatedLine = g.generatedLine,
        h.generatedColumn = g.generatedColumn,
        g.source &&
        (h.source = i.indexOf(g.source),
          h.originalLine = g.originalLine,
          h.originalColumn = g.originalColumn,
          g.name && (h.name = o.indexOf(g.name)),
          u.push(h)),
        c.push(h);
    }
    return j(t.__originalMappings, a.compareByOriginalPositions), t;
  };
  _.prototype._version = 3;
  Object.defineProperty(_.prototype, "sources", {
    get: function () {
      return this._absoluteSources.slice();
    },
  });
  function we() {
    this.generatedLine = 0,
      this.generatedColumn = 0,
      this.source = null,
      this.originalLine = null,
      this.originalColumn = null,
      this.name = null;
  }
  _.prototype._parseMappings = function (e, r) {
    for (
      var t = 1,
        o = 0,
        i = 0,
        s = 0,
        c = 0,
        u = 0,
        f = e.length,
        l = 0,
        g = {},
        h = {},
        d = [],
        L = [],
        C,
        P,
        m,
        R,
        oe;
      l < f;
    ) {
      if (e.charAt(l) === ";") {
        t++, l++, o = 0;
      } else if (e.charAt(l) === ",") {
        l++;
      } else {
        for (
          C = new we(), C.generatedLine = t, R = l;
          R < f && !this._charIsMappingSeparator(e, R);
          R++
        );
        if (P = e.slice(l, R), m = g[P], m) {
          l += P.length;
        } else {
          for (m = []; l < R;) {
            Ye.decode(e, l, h), oe = h.value, l = h.rest, m.push(oe);
          }
          if (m.length === 2) {
            throw new Error("Found a source, but no line and column");
          }
          if (m.length === 3) {
            throw new Error("Found a source and line, but no column");
          }
          g[P] = m;
        }
        C.generatedColumn = o + m[0],
          o = C.generatedColumn,
          m.length > 1 &&
          (C.source = c + m[1],
            c += m[1],
            C.originalLine = i + m[2],
            i = C.originalLine,
            C.originalLine += 1,
            C.originalColumn = s + m[3],
            s = C.originalColumn,
            m.length > 4 && (C.name = u + m[4], u += m[4])),
          L.push(C),
          typeof C.originalLine == "number" && d.push(C);
      }
    }
    j(L, a.compareByGeneratedPositionsDeflated),
      this.__generatedMappings = L,
      j(d, a.compareByOriginalPositions),
      this.__originalMappings = d;
  };
  _.prototype._findMapping = function (e, r, t, o, i, s) {
    if (e[t] <= 0) {
      throw new TypeError(
        "Line must be greater than or equal to 1, got " + e[t],
      );
    }
    if (e[o] < 0) {
      throw new TypeError(
        "Column must be greater than or equal to 0, got " + e[o],
      );
    }
    return te.search(e, r, i, s);
  };
  _.prototype.computeColumnSpans = function () {
    for (var e = 0; e < this._generatedMappings.length; ++e) {
      var r = this._generatedMappings[e];
      if (e + 1 < this._generatedMappings.length) {
        var t = this._generatedMappings[e + 1];
        if (r.generatedLine === t.generatedLine) {
          r.lastGeneratedColumn = t.generatedColumn - 1;
          continue;
        }
      }
      r.lastGeneratedColumn = 1 / 0;
    }
  };
  _.prototype.originalPositionFor = function (e) {
    var r = {
        generatedLine: a.getArg(e, "line"),
        generatedColumn: a.getArg(e, "column"),
      },
      t = this._findMapping(
        r,
        this._generatedMappings,
        "generatedLine",
        "generatedColumn",
        a.compareByGeneratedPositionsDeflated,
        a.getArg(e, "bias", p.GREATEST_LOWER_BOUND),
      );
    if (t >= 0) {
      var o = this._generatedMappings[t];
      if (o.generatedLine === r.generatedLine) {
        var i = a.getArg(o, "source", null);
        i !== null &&
          (i = this._sources.at(i),
            i = a.computeSourceURL(this.sourceRoot, i, this._sourceMapURL));
        var s = a.getArg(o, "name", null);
        return s !== null && (s = this._names.at(s)), {
          source: i,
          line: a.getArg(o, "originalLine", null),
          column: a.getArg(o, "originalColumn", null),
          name: s,
        };
      }
    }
    return { source: null, line: null, column: null, name: null };
  };
  _.prototype.hasContentsOfAllSources = function () {
    return this.sourcesContent
      ? this.sourcesContent.length >= this._sources.size() &&
        !this.sourcesContent.some(function (e) {
          return e == null;
        })
      : !1;
  };
  _.prototype.sourceContentFor = function (e, r) {
    if (!this.sourcesContent) {
      return null;
    }
    var t = this._findSourceIndex(e);
    if (t >= 0) {
      return this.sourcesContent[t];
    }
    var o = e;
    this.sourceRoot != null && (o = a.relative(this.sourceRoot, o));
    var i;
    if (this.sourceRoot != null && (i = a.urlParse(this.sourceRoot))) {
      var s = o.replace(/^file:\/\//, "");
      if (i.scheme == "file" && this._sources.has(s)) {
        return this.sourcesContent[this._sources.indexOf(s)];
      }
      if ((!i.path || i.path == "/") && this._sources.has("/" + o)) {
        return this.sourcesContent[this._sources.indexOf("/" + o)];
      }
    }
    if (r) {
      return null;
    }
    throw new Error('"' + o + '" is not in the SourceMap.');
  };
  _.prototype.generatedPositionFor = function (e) {
    var r = a.getArg(e, "source");
    if (r = this._findSourceIndex(r), r < 0) {
      return { line: null, column: null, lastColumn: null };
    }
    var t = {
        source: r,
        originalLine: a.getArg(e, "line"),
        originalColumn: a.getArg(e, "column"),
      },
      o = this._findMapping(
        t,
        this._originalMappings,
        "originalLine",
        "originalColumn",
        a.compareByOriginalPositions,
        a.getArg(e, "bias", p.GREATEST_LOWER_BOUND),
      );
    if (o >= 0) {
      var i = this._originalMappings[o];
      if (i.source === t.source) {
        return {
          line: a.getArg(i, "generatedLine", null),
          column: a.getArg(i, "generatedColumn", null),
          lastColumn: a.getArg(i, "lastGeneratedColumn", null),
        };
      }
    }
    return { line: null, column: null, lastColumn: null };
  };
  F.BasicSourceMapConsumer = _;
  function w(n, e) {
    var r = n;
    typeof n == "string" && (r = a.parseSourceMapInput(n));
    var t = a.getArg(r, "version"), o = a.getArg(r, "sections");
    if (t != this._version) {
      throw new Error("Unsupported version: " + t);
    }
    this._sources = new x(), this._names = new x();
    var i = { line: -1, column: 0 };
    this._sections = o.map(function (s) {
      if (s.url) {
        throw new Error("Support for url field in sections not implemented.");
      }
      var c = a.getArg(s, "offset"),
        u = a.getArg(c, "line"),
        f = a.getArg(c, "column");
      if (u < i.line || u === i.line && f < i.column) {
        throw new Error("Section offsets must be ordered and non-overlapping.");
      }
      return i = c, {
        generatedOffset: { generatedLine: u + 1, generatedColumn: f + 1 },
        consumer: new p(a.getArg(s, "map"), e),
      };
    });
  }
  w.prototype = Object.create(p.prototype);
  w.prototype.constructor = p;
  w.prototype._version = 3;
  Object.defineProperty(w.prototype, "sources", {
    get: function () {
      for (var n = [], e = 0; e < this._sections.length; e++) {
        for (var r = 0; r < this._sections[e].consumer.sources.length; r++) {
          n.push(this._sections[e].consumer.sources[r]);
        }
      }
      return n;
    },
  });
  w.prototype.originalPositionFor = function (e) {
    var r = {
        generatedLine: a.getArg(e, "line"),
        generatedColumn: a.getArg(e, "column"),
      },
      t = te.search(r, this._sections, function (i, s) {
        var c = i.generatedLine - s.generatedOffset.generatedLine;
        return c || i.generatedColumn - s.generatedOffset.generatedColumn;
      }),
      o = this._sections[t];
    return o
      ? o.consumer.originalPositionFor({
        line: r.generatedLine - (o.generatedOffset.generatedLine - 1),
        column: r.generatedColumn -
          (o.generatedOffset.generatedLine === r.generatedLine
            ? o.generatedOffset.generatedColumn - 1
            : 0),
        bias: e.bias,
      })
      : { source: null, line: null, column: null, name: null };
  };
  w.prototype.hasContentsOfAllSources = function () {
    return this._sections.every(function (e) {
      return e.consumer.hasContentsOfAllSources();
    });
  };
  w.prototype.sourceContentFor = function (e, r) {
    for (var t = 0; t < this._sections.length; t++) {
      var o = this._sections[t], i = o.consumer.sourceContentFor(e, !0);
      if (i) {
        return i;
      }
    }
    if (r) {
      return null;
    }
    throw new Error('"' + e + '" is not in the SourceMap.');
  };
  w.prototype.generatedPositionFor = function (e) {
    for (var r = 0; r < this._sections.length; r++) {
      var t = this._sections[r];
      if (t.consumer._findSourceIndex(a.getArg(e, "source")) !== -1) {
        var o = t.consumer.generatedPositionFor(e);
        if (o) {
          var i = {
            line: o.line + (t.generatedOffset.generatedLine - 1),
            column: o.column +
              (t.generatedOffset.generatedLine === o.line
                ? t.generatedOffset.generatedColumn - 1
                : 0),
          };
          return i;
        }
      }
    }
    return { line: null, column: null };
  };
  w.prototype._parseMappings = function (e, r) {
    this.__generatedMappings = [], this.__originalMappings = [];
    for (var t = 0; t < this._sections.length; t++) {
      for (
        var o = this._sections[t], i = o.consumer._generatedMappings, s = 0;
        s < i.length;
        s++
      ) {
        var c = i[s], u = o.consumer._sources.at(c.source);
        u = a.computeSourceURL(o.consumer.sourceRoot, u, this._sourceMapURL),
          this._sources.add(u),
          u = this._sources.indexOf(u);
        var f = null;
        c.name &&
          (f = o.consumer._names.at(c.name),
            this._names.add(f),
            f = this._names.indexOf(f));
        var l = {
          source: u,
          generatedLine: c.generatedLine +
            (o.generatedOffset.generatedLine - 1),
          generatedColumn: c.generatedColumn +
            (o.generatedOffset.generatedLine === c.generatedLine
              ? o.generatedOffset.generatedColumn - 1
              : 0),
          originalLine: c.originalLine,
          originalColumn: c.originalColumn,
          name: f,
        };
        this.__generatedMappings.push(l),
          typeof l.originalLine == "number" && this.__originalMappings.push(l);
      }
    }
    j(this.__generatedMappings, a.compareByGeneratedPositionsDeflated),
      j(this.__originalMappings, a.compareByOriginalPositions);
  };
  F.IndexedSourceMapConsumer = w;
});
var be = A((Ee) => {
  var He = H().SourceMapGenerator,
    z = I(),
    er = /(\r?\n)/,
    rr = 10,
    T = "$$$isSourceNode$$$";
  function y(n, e, r, t, o) {
    this.children = [],
      this.sourceContents = {},
      this.line = n ?? null,
      this.column = e ?? null,
      this.source = r ?? null,
      this.name = o ?? null,
      this[T] = !0,
      t != null && this.add(t);
  }
  y.fromStringWithSourceMap = function (e, r, t) {
    var o = new y(),
      i = e.split(er),
      s = 0,
      c = function () {
        var h = L(), d = L() || "";
        return h + d;
        function L() {
          return s < i.length ? i[s++] : void 0;
        }
      },
      u = 1,
      f = 0,
      l = null;
    return r.eachMapping(function (h) {
      if (l !== null) {
        if (u < h.generatedLine) {
          g(l, c()), u++, f = 0;
        } else {
          var d = i[s] || "", L = d.substr(0, h.generatedColumn - f);
          i[s] = d.substr(h.generatedColumn - f),
            f = h.generatedColumn,
            g(l, L),
            l = h;
          return;
        }
      }
      for (; u < h.generatedLine;) {
        o.add(c()), u++;
      }
      if (f < h.generatedColumn) {
        var d = i[s] || "";
        o.add(d.substr(0, h.generatedColumn)),
          i[s] = d.substr(h.generatedColumn),
          f = h.generatedColumn;
      }
      l = h;
    }, this),
      s < i.length && (l && g(l, c()), o.add(i.splice(s).join(""))),
      r.sources.forEach(function (h) {
        var d = r.sourceContentFor(h);
        d != null &&
          (t != null && (h = z.join(t, h)), o.setSourceContent(h, d));
      }),
      o;
    function g(h, d) {
      if (h === null || h.source === void 0) {
        o.add(d);
      } else {
        var L = t ? z.join(t, h.source) : h.source;
        o.add(new y(h.originalLine, h.originalColumn, L, d, h.name));
      }
    }
  };
  y.prototype.add = function (e) {
    if (Array.isArray(e)) {
      e.forEach(function (r) {
        this.add(r);
      }, this);
    } else if (e[T] || typeof e == "string") {
      e && this.children.push(e);
    } else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " +
          e,
      );
    }
    return this;
  };
  y.prototype.prepend = function (e) {
    if (Array.isArray(e)) {
      for (var r = e.length - 1; r >= 0; r--) {
        this.prepend(e[r]);
      }
    } else if (e[T] || typeof e == "string") {
      this.children.unshift(e);
    } else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " +
          e,
      );
    }
    return this;
  };
  y.prototype.walk = function (e) {
    for (var r, t = 0, o = this.children.length; t < o; t++) {
      r = this.children[t],
        r[T] ? r.walk(e) : r !== "" &&
          e(r, {
            source: this.source,
            line: this.line,
            column: this.column,
            name: this.name,
          });
    }
  };
  y.prototype.join = function (e) {
    var r, t, o = this.children.length;
    if (o > 0) {
      for (r = [], t = 0; t < o - 1; t++) {
        r.push(this.children[t]), r.push(e);
      }
      r.push(this.children[t]), this.children = r;
    }
    return this;
  };
  y.prototype.replaceRight = function (e, r) {
    var t = this.children[this.children.length - 1];
    return t[T]
      ? t.replaceRight(e, r)
      : typeof t == "string"
      ? this.children[this.children.length - 1] = t.replace(e, r)
      : this.children.push("".replace(e, r)),
      this;
  };
  y.prototype.setSourceContent = function (e, r) {
    this.sourceContents[z.toSetString(e)] = r;
  };
  y.prototype.walkSourceContents = function (e) {
    for (var r = 0, t = this.children.length; r < t; r++) {
      this.children[r][T] && this.children[r].walkSourceContents(e);
    }
    for (
      var o = Object.keys(this.sourceContents), r = 0, t = o.length;
      r < t;
      r++
    ) {
      e(z.fromSetString(o[r]), this.sourceContents[o[r]]);
    }
  };
  y.prototype.toString = function () {
    var e = "";
    return this.walk(function (r) {
      e += r;
    }),
      e;
  };
  y.prototype.toStringWithSourceMap = function (e) {
    var r = { code: "", line: 1, column: 0 },
      t = new He(e),
      o = !1,
      i = null,
      s = null,
      c = null,
      u = null;
    return this.walk(function (f, l) {
      r.code += f,
        l.source !== null && l.line !== null && l.column !== null
          ? ((i !== l.source || s !== l.line || c !== l.column ||
            u !== l.name) &&
            t.addMapping({
              source: l.source,
              original: { line: l.line, column: l.column },
              generated: { line: r.line, column: r.column },
              name: l.name,
            }),
            i = l.source,
            s = l.line,
            c = l.column,
            u = l.name,
            o = !0)
          : o &&
            (t.addMapping({ generated: { line: r.line, column: r.column } }),
              i = null,
              o = !1);
      for (var g = 0, h = f.length; g < h; g++) {
        f.charCodeAt(g) === rr
          ? (r.line++,
            r.column = 0,
            g + 1 === h ? (i = null, o = !1) : o &&
              t.addMapping({
                source: l.source,
                original: { line: l.line, column: l.column },
                generated: { line: r.line, column: r.column },
                name: l.name,
              }))
          : r.column++;
      }
    }),
      this.walkSourceContents(function (f, l) {
        t.setSourceContent(f, l);
      }),
      { code: r.code, map: t };
  };
  Ee.SourceNode = y;
});
var Re = A((Q) => {
  Q.SourceMapGenerator = H().SourceMapGenerator;
  Q.SourceMapConsumer = Oe().SourceMapConsumer;
  Q.SourceNode = be().SourceNode;
});
var W = qe(Re()),
  { SourceMapGenerator: dr, SourceMapConsumer: pr, SourceNode: vr } = W,
  _r = W.default ?? W;
export {
  _r as default,
  dr as SourceMapGenerator,
  pr as SourceMapConsumer,
  vr as SourceNode,
};
//# sourceMappingURL=source-map.mjs.map
