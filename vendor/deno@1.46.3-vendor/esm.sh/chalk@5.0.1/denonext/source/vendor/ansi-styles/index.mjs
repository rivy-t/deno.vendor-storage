/* esm.sh - chalk@5.0.1/source/vendor/ansi-styles/index */
var s = (l = 0) => (e) => `\x1B[${e + l}m`,
  b = (l = 0) => (e) => `\x1B[${38 + l};5;${e}m`,
  u = (l = 0) => (e, r, t) => `\x1B[${38 + l};2;${e};${r};${t}m`;
function h() {
  let l = new Map(),
    e = {
      modifier: {
        reset: [0, 0],
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        overline: [53, 55],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29],
      },
      color: {
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        blackBright: [90, 39],
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39],
      },
      bgColor: {
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        bgBlackBright: [100, 49],
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49],
      },
    };
  e.color.gray = e.color.blackBright,
    e.bgColor.bgGray = e.bgColor.bgBlackBright,
    e.color.grey = e.color.blackBright,
    e.bgColor.bgGrey = e.bgColor.bgBlackBright;
  for (let [r, t] of Object.entries(e)) {
    for (let [o, n] of Object.entries(t)) {
      e[o] = { open: `\x1B[${n[0]}m`, close: `\x1B[${n[1]}m` },
        t[o] = e[o],
        l.set(n[0], n[1]);
    }
    Object.defineProperty(e, r, { value: t, enumerable: !1 });
  }
  return Object.defineProperty(e, "codes", { value: l, enumerable: !1 }),
    e.color.close = "\x1B[39m",
    e.bgColor.close = "\x1B[49m",
    e.color.ansi = s(),
    e.color.ansi256 = b(),
    e.color.ansi16m = u(),
    e.bgColor.ansi = s(10),
    e.bgColor.ansi256 = b(10),
    e.bgColor.ansi16m = u(10),
    Object.defineProperties(e, {
      rgbToAnsi256: {
        value: (r, t, o) =>
          r === t && t === o
            ? r < 8 ? 16 : r > 248 ? 231 : Math.round((r - 8) / 247 * 24) + 232
            : 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(t / 255 * 5) +
              Math.round(o / 255 * 5),
        enumerable: !1,
      },
      hexToRgb: {
        value: (r) => {
          let t = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(r.toString(16));
          if (!t) {
            return [0, 0, 0];
          }
          let { colorString: o } = t.groups;
          o.length === 3 && (o = [...o].map((a) => a + a).join(""));
          let n = Number.parseInt(o, 16);
          return [n >> 16 & 255, n >> 8 & 255, n & 255];
        },
        enumerable: !1,
      },
      hexToAnsi256: {
        value: (r) => e.rgbToAnsi256(...e.hexToRgb(r)),
        enumerable: !1,
      },
      ansi256ToAnsi: {
        value: (r) => {
          if (r < 8) {
            return 30 + r;
          }
          if (r < 16) {
            return 90 + (r - 8);
          }
          let t, o, n;
          if (r >= 232) {
            t = ((r - 232) * 10 + 8) / 255, o = t, n = t;
          } else {
            r -= 16;
            let g = r % 36;
            t = Math.floor(r / 36) / 5,
              o = Math.floor(g / 6) / 5,
              n = g % 6 / 5;
          }
          let a = Math.max(t, o, n) * 2;
          if (a === 0) {
            return 30;
          }
          let i = 30 +
            (Math.round(n) << 2 | Math.round(o) << 1 | Math.round(t));
          return a === 2 && (i += 60), i;
        },
        enumerable: !1,
      },
      rgbToAnsi: {
        value: (r, t, o) => e.ansi256ToAnsi(e.rgbToAnsi256(r, t, o)),
        enumerable: !1,
      },
      hexToAnsi: {
        value: (r) => e.ansi256ToAnsi(e.hexToAnsi256(r)),
        enumerable: !1,
      },
    }),
    e;
}
var c = h(), B = c;
export { B as default };
//# sourceMappingURL=index.mjs.map
