/**
 * Represents a value that can be null.
 */
export type Nullable<T> = T | null;

/**
 * Represents a value that can be undefined.
 */
export type Optional<T> = T | undefined;

/**
 * Represents an object where all properties and nested properties are optional.
 */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T;

/**
 * Represents an object where all properties and nested properties are readonly.
 */
export type DeepReadonly<T> = T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]>; } : T;

/**
 * Strictly omits properties K from type T, ensuring K is a key of T.
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

/**
 * Strictly picks properties K from type T, ensuring K is a key of T.
 */
export type StrictPick<T, K extends keyof T> = Pick<T, K>;

/**
 * Merges two types F and S, with properties in S overriding properties in F.
 */
export type Merge<F, S> = Omit<F, keyof S> & S;

/**
 * Prettifies a type intersection for better readability in TypeScript IDE hover tooltips.
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Extracts union of all property values of a given type T.
 */
export type ValueOf<T> = T[keyof T];

/**
 * Extracts keys of T whose property values extend type V.
 */
export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

/**
 * Represents an array containing at least one element of type T.
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Branded type helper for creating nominal types.
 */
export type Brand<K, T> = K & { readonly __brand: T };

/**
 * Branded string type representing a Universally Unique Identifier (UUID).
 */
export type UUID = Brand<string, 'UUID'>;

/**
 * Branded string type representing an ISO 8601 Date string.
 */
export type ISODate = Brand<string, 'ISODate'>;

/**
 * Branded string type representing a JSON-serialized string.
 */
export type JSONString = Brand<string, 'JSONString'>;
