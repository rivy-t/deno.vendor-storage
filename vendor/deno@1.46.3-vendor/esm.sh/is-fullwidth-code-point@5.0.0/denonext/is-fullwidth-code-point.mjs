/* esm.sh - is-fullwidth-code-point@5.0.0 */
import { eastAsianWidth as e } from "../../../esm.sh/get-east-asian-width@1.3.0.js";
function r(t) {
  return Number.isInteger(t) ? e(t) === 2 : !1;
}
export { r as default };
//# sourceMappingURL=is-fullwidth-code-point.mjs.map
