export type ArcadeSelectTimeoutStrategy = 'EXCEPTION' | 'RETURN';

/**
 * The possible record types, as expected to be
 * supplied to a `CREATE TYPE` sql operation.
 */
export type ArcadeRecordType = 'document' | 'edge' | 'vertex';

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

/**
 * How the bucket will be selected for a newly created record of this type
 * @default 'round-robin'
 */
export type ArcadeBucketSelectionStrategies =
  | 'round-robin'
  | 'thread'
  | 'partitioned<primary-key>';

/**
 * A type definition returned by ArcadeDB when a getSchema command
 * is compeleted.
 */
export type ArcadeTypeDefinition = {
  /** The name of the type */
  name: string;
  /** The category of the type (document, vertex, or edge) */
  type: ArcadeRecordType;
  /**
   * The number of records with this type name
   */
  records: number;
  /**
   * The buckets associated with this type.
   */
  buckets: Array<string>;
  /** How the bucket will be selected for a newly created record of this type */
  bucketSelectionStrategy: ArcadeBucketSelectionStrategies;
  /**
   * Super types associated with this type.
   */
  parentTypes: Array<string>;
  /**
   * Properties defined for this type.
   */
  properties: Array<string>;
  /** Indexes defined for records of this type */
  indexes: Array<string>;
  /** An object for custom user-defined properties for this type */
  custom: Record<string, unknown>;
};

/** The response from a `SpriteDatabase.getSchema()` query */
export type ArcadeGetSchemaResponse = ArcadeTypeDefinition[];

export type ArcadeSqlExaplantionExecutionPlanStep = {
  cost: number;
  description: string;
  javaType: string;
  name: string;
  subSteps: ArcadeSqlExaplantionExecutionPlanStep[];
  targetNode: string;
  type: string;
};

/** SQL Explanation Execution Plan */
export type ArcadeSqlExplanationExecutionPlan = {
  type: 'QueryExecutionPlan' | 'DDLExecutionPlan';
  javaType: string;
  cost: number;
  prettyPrint: string;
  steps: ArcadeSqlExaplantionExecutionPlanStep[];
};

/**
 * An object representing the explanation of an
 * SQL command.
 */
export type ArcadeSqlExplanation = {
  executionPlan: ArcadeSqlExplanationExecutionPlan;
  executionPlanAsString: string;
};
