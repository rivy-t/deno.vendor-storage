//== * DEPendencies for CLI-type applications
// 'https://cdn.jsdelivr.net/gh/rivy-js/yargs@6d3786caa7' (aka 'v17.5.2-deno-rivy'); yargs-v17.5.2-deno with permission fixes
//==== modules
// DONE: [2023-11-22; rivy] ~ ToDO: [2023-11-19; rivy] fix...
// ```text
// $ deno check --reload "https://cdn.jsdelivr.net/gh/rivy-js/yargs@2607dfd9a47f9402/deno.ts"
// Warning Implicitly using latest version (0.207.0) for https://deno.land/std/testing/asserts.ts
// Warning Implicitly using latest version (0.207.0) for https://deno.land/std/path/mod.ts
// Warning Implicitly using latest version (0.207.0) for https://deno.land/std/fmt/printf.ts
// ```
// * revise URL to use 'esm.sh' instead of 'cdn.jsdelivr.net' for compatibility with Deno-2.0 "import" permission defaults
// export { default as $yargs } from 'https://cdn.jsdelivr.net/gh/rivy-js/yargs@6be59a7fda/deno.ts'; // v17.7.2-deno-rivy
// export { default as $yargs } from 'https://esm.sh/gh/rivy-js/yargs@18d34da010/deno.ts?pin=v135'; // v17.7.2-deno-rivy+1 // Deno-v2.1.5+ fixes
export { default as $yargs } from "../../../../../../cdn.jsdelivr.net/gh/rivy-js/yargs@18d34da010/deno.ts"; // v17.7.2-deno-rivy+1 // Deno-v2.1.5+ fixes
//==== types
// export type { Arguments as YargsArguments } from 'https://esm.sh/gh/rivy-js/yargs@f4b8034a75/deno-types.ts'; // v17.7.2-deno-rivy
declare type ArgsOutput = (string | number)[];
// spell-checker:ignore () bcoe
// TODO(bcoe): attempt to get the types for YargsInstance working again.
export interface Arguments {
  /** Non-option arguments */
  _: ArgsOutput;
  /** Arguments after the end-of-options flag `--` */
  "--"?: ArgsOutput;
  /** All remaining options */
  // deno-lint-ignore no-explicit-any
  [argName: string]: any;
}
export type { Arguments as YargsArguments };
