/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/braces@3.0.2/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import e from "../../../cdn.jsdelivr.net/npm/fill-range@7.0.1/+esm.js";
var t, n = {};
(t = n).isInteger = (e) =>
  "number" == typeof e
    ? Number.isInteger(e)
    : "string" == typeof e && "" !== e.trim() && Number.isInteger(Number(e)),
  t.find = (e, t) => e.nodes.find((e) => e.type === t),
  t.exceedsLimit = (e, n, r = 1, a) =>
    !1 !== a && !(!t.isInteger(e) || !t.isInteger(n)) &&
    (Number(n) - Number(e)) / Number(r) >= a,
  t.escapeNode = (e, t = 0, n) => {
    let r = e.nodes[t];
    r && (n && r.type === n || "open" === r.type || "close" === r.type) &&
      !0 !== r.escaped && (r.value = "\\" + r.value, r.escaped = !0);
  },
  t.encloseBrace = (e) =>
    "brace" === e.type && e.commas >> 0 + e.ranges >> 0 == 0 &&
    (e.invalid = !0, !0),
  t.isInvalidBrace = (e) =>
    !("brace" !== e.type ||
      !0 !== e.invalid && !e.dollar &&
        (e.commas >> 0 + e.ranges >> 0 != 0 && !0 === e.open &&
            !0 === e.close || (e.invalid = !0, 0))),
  t.isOpenOrClose = (e) =>
    "open" === e.type || "close" === e.type || !0 === e.open || !0 === e.close,
  t.reduce = (e) =>
    e.reduce(
      (
        e,
        t,
      ) => ("text" === t.type && e.push(t.value),
        "range" === t.type && (t.type = "text"),
        e),
      [],
    ),
  t.flatten = (...e) => {
    const t = [],
      n = (e) => {
        for (let r = 0; r < e.length; r++) {
          let a = e[r];
          Array.isArray(a) ? n(a) : void 0 !== a && t.push(a);
        }
        return t;
      };
    return n(e), t;
  };
const r = n;
var a = (e, t = {}) => {
  let n = (e, a = {}) => {
    let l = t.escapeInvalid && r.isInvalidBrace(a),
      s = !0 === e.invalid && !0 === t.escapeInvalid,
      p = "";
    if (e.value) {
      return (l || s) && r.isOpenOrClose(e) ? "\\" + e.value : e.value;
    }
    if (e.value) {
      return e.value;
    }
    if (e.nodes) {
      for (let t of e.nodes) {
        p += n(t);
      }
    }
    return p;
  };
  return n(e);
};
const l = e, s = n;
var p = (e, t = {}) => {
  let n = (e, r = {}) => {
    let a = s.isInvalidBrace(r),
      p = !0 === e.invalid && !0 === t.escapeInvalid,
      o = !0 === a || !0 === p,
      i = !0 === t.escapeInvalid ? "\\" : "",
      A = "";
    if (!0 === e.isOpen) {
      return i + e.value;
    }
    if (!0 === e.isClose) {
      return i + e.value;
    }
    if ("open" === e.type) {
      return o ? i + e.value : "(";
    }
    if ("close" === e.type) {
      return o ? i + e.value : ")";
    }
    if ("comma" === e.type) {
      return "comma" === e.prev.type ? "" : o ? e.value : "|";
    }
    if (e.value) {
      return e.value;
    }
    if (e.nodes && e.ranges > 0) {
      let n = s.reduce(e.nodes), r = l(...n, { ...t, wrap: !1, toRegex: !0 });
      if (0 !== r.length) {
        return n.length > 1 && r.length > 1 ? `(${r})` : r;
      }
    }
    if (e.nodes) {
      for (let t of e.nodes) {
        A += n(t, e);
      }
    }
    return A;
  };
  return n(e);
};
const o = e,
  i = a,
  A = n,
  u = (e = "", t = "", n = !1) => {
    let r = [];
    if (e = [].concat(e), !(t = [].concat(t)).length) {
      return e;
    }
    if (!e.length) {
      return n ? A.flatten(t).map((e) => `{${e}}`) : t;
    }
    for (let a of e) {
      if (Array.isArray(a)) {
        for (let e of a) {
          r.push(u(e, t, n));
        }
      } else {
        for (let e of t) {
          !0 === n && "string" == typeof e && (e = `{${e}}`),
            r.push(Array.isArray(e) ? u(a, e, n) : a + e);
        }
      }
    }
    return A.flatten(r);
  };
var R = (e, t = {}) => {
  let n = void 0 === t.rangeLimit ? 1e3 : t.rangeLimit,
    r = (e, a = {}) => {
      e.queue = [];
      let l = a, s = a.queue;
      for (; "brace" !== l.type && "root" !== l.type && l.parent;) {
        l = l.parent, s = l.queue;
      }
      if (e.invalid || e.dollar) {
        return void s.push(u(s.pop(), i(e, t)));
      }
      if ("brace" === e.type && !0 !== e.invalid && 2 === e.nodes.length) {
        return void s.push(u(s.pop(), ["{}"]));
      }
      if (e.nodes && e.ranges > 0) {
        let r = A.reduce(e.nodes);
        if (A.exceedsLimit(...r, t.step, n)) {
          throw new RangeError(
            "expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.",
          );
        }
        let a = o(...r, t);
        return 0 === a.length && (a = i(e, t)),
          s.push(u(s.pop(), a)),
          void (e.nodes = []);
      }
      let p = A.encloseBrace(e), R = e.queue, _ = e;
      for (; "brace" !== _.type && "root" !== _.type && _.parent;) {
        _ = _.parent, R = _.queue;
      }
      for (let t = 0; t < e.nodes.length; t++) {
        let n = e.nodes[t];
        "comma" !== n.type || "brace" !== e.type
          ? "close" !== n.type
            ? n.value && "open" !== n.type
              ? R.push(u(R.pop(), n.value))
              : n.nodes && r(n, e)
            : s.push(u(s.pop(), R, p))
          : (1 === t && R.push(""), R.push(""));
      }
      return R;
    };
  return A.flatten(r(e));
};
const _ = a,
  {
    MAX_LENGTH: C,
    CHAR_BACKSLASH: f,
    CHAR_BACKTICK: E,
    CHAR_COMMA: d,
    CHAR_DOT: c,
    CHAR_LEFT_PARENTHESES: y,
    CHAR_RIGHT_PARENTHESES: H,
    CHAR_LEFT_CURLY_BRACE: v,
    CHAR_RIGHT_CURLY_BRACE: g,
    CHAR_LEFT_SQUARE_BRACKET: h,
    CHAR_RIGHT_SQUARE_BRACKET: m,
    CHAR_DOUBLE_QUOTE: T,
    CHAR_SINGLE_QUOTE: L,
    CHAR_NO_BREAK_SPACE: S,
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: x,
  } = {
    MAX_LENGTH: 65536,
    CHAR_0: "0",
    CHAR_9: "9",
    CHAR_UPPERCASE_A: "A",
    CHAR_LOWERCASE_A: "a",
    CHAR_UPPERCASE_Z: "Z",
    CHAR_LOWERCASE_Z: "z",
    CHAR_LEFT_PARENTHESES: "(",
    CHAR_RIGHT_PARENTHESES: ")",
    CHAR_ASTERISK: "*",
    CHAR_AMPERSAND: "&",
    CHAR_AT: "@",
    CHAR_BACKSLASH: "\\",
    CHAR_BACKTICK: "`",
    CHAR_CARRIAGE_RETURN: "\r",
    CHAR_CIRCUMFLEX_ACCENT: "^",
    CHAR_COLON: ":",
    CHAR_COMMA: ",",
    CHAR_DOLLAR: "$",
    CHAR_DOT: ".",
    CHAR_DOUBLE_QUOTE: '"',
    CHAR_EQUAL: "=",
    CHAR_EXCLAMATION_MARK: "!",
    CHAR_FORM_FEED: "\f",
    CHAR_FORWARD_SLASH: "/",
    CHAR_HASH: "#",
    CHAR_HYPHEN_MINUS: "-",
    CHAR_LEFT_ANGLE_BRACKET: "<",
    CHAR_LEFT_CURLY_BRACE: "{",
    CHAR_LEFT_SQUARE_BRACKET: "[",
    CHAR_LINE_FEED: "\n",
    CHAR_NO_BREAK_SPACE: " ",
    CHAR_PERCENT: "%",
    CHAR_PLUS: "+",
    CHAR_QUESTION_MARK: "?",
    CHAR_RIGHT_ANGLE_BRACKET: ">",
    CHAR_RIGHT_CURLY_BRACE: "}",
    CHAR_RIGHT_SQUARE_BRACKET: "]",
    CHAR_SEMICOLON: ";",
    CHAR_SINGLE_QUOTE: "'",
    CHAR_SPACE: " ",
    CHAR_TAB: "\t",
    CHAR_UNDERSCORE: "_",
    CHAR_VERTICAL_LINE: "|",
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\ufeff",
  };
const I = a,
  O = p,
  N = R,
  B = (e, t = {}) => {
    if ("string" != typeof e) {
      throw new TypeError("Expected a string");
    }
    let n = t || {},
      r = "number" == typeof n.maxLength ? Math.min(C, n.maxLength) : C;
    if (e.length > r) {
      throw new SyntaxError(
        `Input length (${e.length}), exceeds max characters (${r})`,
      );
    }
    let a,
      l = { type: "root", input: e, nodes: [] },
      s = [l],
      p = l,
      o = l,
      i = 0,
      A = e.length,
      u = 0,
      R = 0;
    const I = () => e[u++],
      O = (e) => {
        if (
          "text" === e.type && "dot" === o.type && (o.type = "text"),
            !o || "text" !== o.type || "text" !== e.type
        ) {
          return p.nodes.push(e), e.parent = p, e.prev = o, o = e, e;
        }
        o.value += e.value;
      };
    for (O({ type: "bos" }); u < A;) {
      if (p = s[s.length - 1], a = I(), a !== x && a !== S) {
        if (a !== f) {
          if (a !== m) {
            if (a !== h) {
              if (a !== y) {
                if (a !== H) {
                  if (a !== T && a !== L && a !== E) {
                    if (a !== v) {
                      if (a !== g) {
                        if (a === d && R > 0) {
                          if (p.ranges > 0) {
                            p.ranges = 0;
                            let e = p.nodes.shift();
                            p.nodes = [e, { type: "text", value: _(p) }];
                          }
                          O({ type: "comma", value: a }), p.commas++;
                        } else if (a === c && R > 0 && 0 === p.commas) {
                          let e = p.nodes;
                          if (0 === R || 0 === e.length) {
                            O({ type: "text", value: a });
                            continue;
                          }
                          if ("dot" === o.type) {
                            if (
                              p.range = [],
                                o.value += a,
                                o.type = "range",
                                3 !== p.nodes.length && 5 !== p.nodes.length
                            ) {
                              p.invalid = !0, p.ranges = 0, o.type = "text";
                              continue;
                            }
                            p.ranges++, p.args = [];
                            continue;
                          }
                          if ("range" === o.type) {
                            e.pop();
                            let t = e[e.length - 1];
                            t.value += o.value + a, o = t, p.ranges--;
                            continue;
                          }
                          O({ type: "dot", value: a });
                        } else {
                          O({ type: "text", value: a });
                        }
                      } else {
                        if ("brace" !== p.type) {
                          O({ type: "text", value: a });
                          continue;
                        }
                        let e = "close";
                        p = s.pop(),
                          p.close = !0,
                          O({ type: e, value: a }),
                          R--,
                          p = s[s.length - 1];
                      }
                    } else {
                      R++;
                      let e = o.value && "$" === o.value.slice(-1) ||
                        !0 === p.dollar;
                      p = O({
                        type: "brace",
                        open: !0,
                        close: !1,
                        dollar: e,
                        depth: R,
                        commas: 0,
                        ranges: 0,
                        nodes: [],
                      }),
                        s.push(p),
                        O({ type: "open", value: a });
                    }
                  } else {
                    let e, n = a;
                    for (!0 !== t.keepQuotes && (a = ""); u < A && (e = I());) {
                      if (e !== f) {
                        if (e === n) {
                          !0 === t.keepQuotes && (a += e);
                          break;
                        }
                        a += e;
                      } else {
                        a += e + I();
                      }
                    }
                    O({ type: "text", value: a });
                  }
                } else {
                  if ("paren" !== p.type) {
                    O({ type: "text", value: a });
                    continue;
                  }
                  p = s.pop(),
                    O({ type: "text", value: a }),
                    p = s[s.length - 1];
                }
              } else {
                p = O({ type: "paren", nodes: [] }),
                  s.push(p),
                  O({ type: "text", value: a });
              }
            } else {
              let e;
              for (i++; u < A && (e = I());) {
                if (a += e, e !== h) {
                  if (e !== f) {
                    if (e === m && (i--, 0 === i)) {
                      break;
                    }
                  } else {
                    a += I();
                  }
                } else {
                  i++;
                }
              }
              O({ type: "text", value: a });
            }
          } else {
            O({ type: "text", value: "\\" + a });
          }
        } else {
          O({ type: "text", value: (t.keepEscaping ? a : "") + I() });
        }
      }
    }
    do {
      if (p = s.pop(), "root" !== p.type) {
        p.nodes.forEach((e) => {
          e.nodes ||
            ("open" === e.type && (e.isOpen = !0),
              "close" === e.type && (e.isClose = !0),
              e.nodes || (e.type = "text"),
              e.invalid = !0);
        });
        let e = s[s.length - 1], t = e.nodes.indexOf(p);
        e.nodes.splice(t, 1, ...p.nodes);
      }
    } while (s.length > 0);
    return O({ type: "eos" }), l;
  },
  U = (e, t = {}) => {
    let n = [];
    if (Array.isArray(e)) {
      for (let r of e) {
        let e = U.create(r, t);
        Array.isArray(e) ? n.push(...e) : n.push(e);
      }
    } else {
      n = [].concat(U.create(e, t));
    }
    return t && !0 === t.expand && !0 === t.nodupes && (n = [...new Set(n)]), n;
  };
U.parse = (e, t = {}) => B(e, t),
  U.stringify = (e, t = {}) => I("string" == typeof e ? U.parse(e, t) : e, t),
  U.compile = (
    e,
    t = {},
  ) => ("string" == typeof e && (e = U.parse(e, t)), O(e, t)),
  U.expand = (e, t = {}) => {
    "string" == typeof e && (e = U.parse(e, t));
    let n = N(e, t);
    return !0 === t.noempty && (n = n.filter(Boolean)),
      !0 === t.nodupes && (n = [...new Set(n)]),
      n;
  },
  U.create = (e, t = {}) =>
    "" === e || e.length < 3
      ? [e]
      : !0 !== t.expand
      ? U.compile(e, t)
      : U.expand(e, t);
var b = U,
  K = b.compile,
  P = b.create,
  M = b.expand,
  G = b.parse,
  D = b.stringify;
export {
  b as default,
  D as stringify,
  G as parse,
  K as compile,
  M as expand,
  P as create,
};
//# sourceMappingURL=/sm/01aa63db053ef55275014a5479171954120179faedd7e688977a310e1d4b5032.map
