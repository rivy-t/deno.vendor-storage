import { CamelCase } from "../camel-case/index.d.ts";
export declare type DeepCamelCaseProperties<Type> = Type extends
  Record<string, unknown> ? {
    [Key in keyof Type as CamelCase<Key>]: DeepCamelCaseProperties<Type[Key]>;
  }
  : Type;
