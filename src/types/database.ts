import { ValidSuperTypeKey } from './type.js';

export type ArcadeSelectTimeoutStrategy = 'EXCEPTION' | 'RETURN';

/**
 * The possible record types, as expected to be
 * supplied to a `CREATE TYPE` sql operation.
 */
export type ArcadeRecordType = 'document' | 'edge' | 'vertex';

/**
 * Options to create a new type with.
 */
export interface ISpriteCreateTypeOptions<S, N extends TypeNames<S>> {
  /**
   * When set to true, the type creation will be ignored if the
   * type already exists (instead of failing with an error).
   * @default false
   */
  ifNotExists?: boolean;
  /**
   * Defines a super-type you want to extend with this type.
   */
  extends?: ValidSuperTypeKey<S, N>;
  /**
   * A bucket-name, or an array of bucket-names you want this type to use.
   */
  buckets?: string | Array<string>;
  /**
   * Defines the total number of buckets you want to create for this type. The
   * @default 1
   */
  totalBuckets?: number;
}

/**
 * Options for a `deleteFrom` operation as executed
 * via a `SpriteDatabase` repository.
 */
export interface ISpriteDeleteFromOptions<
  S,
  N extends TypeNames<S>,
  P extends keyof WithRid<S, N>
> {
  /**
   * Designates conditions to filter the result-set.
   */
  where: SpriteWhereClause<S, N, P>;
  /**
   * The duration of the timeout in milliseconds.
   */
  timeout?: number;
  /**
   * Defines the maximum number of records in the result-set.
   * @default undefined
   */
  limit?: number;
  /**
   * Defines what is returned following the command: the count of the records before (`BEFORE`) or following deletion (`COUNT`).
   * @default 'COUNT'
   */
  return?: 'COUNT' | 'BEFORE';
}

/**
 * Options for a database.dropType() command
 */
export interface ISpriteDropTypeOptions {
  /**
   * Prevent errors if the type does not exits when attempting to drop it.
   * @default false;
   */
  ifExists?: boolean;
  /**
   * Defines whether the command drops non-empty edge and vertex types. Note, this can
   * disrupt data consistency. Be sure to create a backup before running it.
   * @default: false
   */
  unsafe?: boolean;
}

/** Options to insert a new record with */
export interface ISpriteInsertRecordOptions<T> {
  /** The data to populate the newly created reacord with */
  data?: OmitMeta<T> | OmitMeta<T>[];
  /** The bucket to store the record in */
  bucket?: string;
}

// TODO: have not checked these for compatibility with ArcadeDB
export declare const COMPARISON_OPERATORS: readonly [
  '=',
  '==',
  '!=',
  '<>',
  '>',
  '>=',
  '<',
  '<=',
  'in',
  'not in',
  'is',
  'is not',
  'like',
  'not like',
  'match',
  'ilike',
  'not ilike',
  '@>',
  '<@',
  '&&',
  '?',
  '?&',
  '!<',
  '!>',
  '<=>',
  '!~',
  '~',
  '~*',
  '!~*',
  '@@',
  '@@@',
  '!!',
  '<->',
  'regexp',
  'is distinct from',
  'is not distinct from'
];

/** Operators for a `WHERE` sql statement */
export type SpriteOperators = (typeof COMPARISON_OPERATORS)[number];

/**
 * An array with three items used to describe a `where` statement.
 * @example ['@rid', '==', '#0:0']
 */
export type SpriteWhereClause<
  S,
  N extends TypeNames<S>,
  P extends keyof WithRid<S, N>
> = [P, SpriteOperators, WithRid<S, N>[P]];

/** Options for a `selectFrom` operation, as executed via a `SpriteDatabase` repository. */
export interface ISpriteSelectFromOptions<
  S,
  N extends keyof S,
  P extends keyof WithRid<S, N>
> {
  /**
   * Designates conditions to filter the result-set.
   */
  where?: SpriteWhereClause<S, N, P>;
  /**
   * Designates the field with which to order the result-set.
   * Use the optional 'ASC' and 'DESC' operators to define the direction of the order.
   */
  orderBy?: {
    field: keyof S[N];
    /**
     * Defines the direction to sort the result (ASCending or DESCending).
     * @default 'ASC'.
     */
    direction?: 'ASC' | 'DESC';
  };
  /**
   * Defines the number of records you want to skip from the start of the result-set.
   * You mayfind this useful in Pagination, when using it in conjunction with the
   * limit `option`.
   */
  skip?: number;
  /**
   * Defines the maximum number of records in the result-set. You may find this useful in
   * Pagination, when using it in conjunction with the `skip` option.
   */
  limit?: number;
  /**
   * Defines the maximum time in milliseconds for the query, and optionally the
   * exception strategy to use.
   */
  timeout?: {
    /**
     *  The duration of the timeout in milliseconds.
     */
    duration: number;
    /**
     * The timeout strategy to use.\
     * `RETURN` Truncates the result-set, returning the data collected up to the timeout.\
     * `EXCEPTION` Raises an exception.
     */
    strategy?: ArcadeSelectTimeoutStrategy;
  };
}

/**
 * The possible categories of a record in ArcadeDB,
 * as they appear in the record's `@cat` property.
 */
export type ArcadeRecordCategory = 'd' | 'e' | 'v';

type RecordMetaBase<C extends ArcadeRecordCategory> = {
  /** The id of the record. */
  '@rid': string;
  /** The category of the record. */
  '@cat': C;
  /** The type of the record. */
  '@type': string;
};

/**
 * The metadata for an Edge record in
 * ArcadeDB
 */
export interface EdgeRecordMeta extends RecordMetaBase<'e'> {
  /** The `@rid` of the vertex the edge goes to */
  '@in': string;
  /** The `@rid` of the vertex the edge comes from */
  '@out': string;
}

/**
 * The base metadata for record in
 * ArcadeDB.
 */
export type RecordMeta<C extends ArcadeRecordCategory = ArcadeRecordCategory> =
  C extends 'e' ? EdgeRecordMeta : RecordMetaBase<C>;

export type OmitMeta<T> = Omit<T, keyof RecordMeta | keyof EdgeRecordMeta>;

/** Options to insert a new record with */
export interface ISpriteInsertRecordOptions<T> {
  /** The data to populate the newly created reacord with */
  data?: OmitMeta<T> | OmitMeta<T>[];
  /** The bucket to store the record in */
  bucket?: string;
}

/**
 * The TypeNames in a supplied schema.
 */
export type TypeNames<Schema> = keyof Schema;

/**
 * A base type, with an `@rid` property added.
 */
export type WithRid<S, N extends TypeNames<S>> = OmitMeta<S[N]> & {
  '@rid': string;
};
