import { PredicateFunction } from "../predicate-function/index.d.ts";
export declare type PredicateType<Type extends PredicateFunction> = Type extends
  (target: any, ...rest: any[]) => target is infer NarrowedType ? NarrowedType
  : never;
