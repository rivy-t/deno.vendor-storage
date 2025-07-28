import unknown from "./unknown.d.ts";
import object from "./object.d.ts";
import array from "./array.d.ts";
import string from "./string.d.ts";
import number from "./number.d.ts";
import boolean from "./boolean.d.ts";
import Schema from "./Schema.d.ts";
import DateType from "./DateType.d.ts";
import {
  MergeSchemaParameters,
  SchemaInput,
  SchemaParameters,
  SchemaResolveType,
  SchemaReturnType,
  SchemaValidatorFunction,
} from "./schema/io.d.ts";
import { PathError, ValidationError } from "./schema/errors.d.ts";
import { isPromiseLike, ResolvedValue } from "./schema/utils.d.ts";
export declare type Type<S> = SchemaResolveType<S>;
export type {
  MergeSchemaParameters,
  PathError,
  ResolvedValue,
  SchemaInput,
  SchemaParameters,
  SchemaReturnType,
  SchemaValidatorFunction,
  ValidationError,
};
export default Schema;
export { array, boolean, DateType, number, object, string, unknown };
export { isPromiseLike };
