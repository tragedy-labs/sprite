import { TypeNames } from './database.js';

/**
 * The object returned in the response of a `DELETE`
 * command.
 */
export type DeleteFromCount = { count: number };

/**
 * The response of a `DELETE` command.
 */
export type ArcadeDeleteFromResponse = Array<DeleteFromCount>;

/**
 * The object returned as a receipt of a successfully executed
 * operation.
 */
export type RecordOperationResponse = {
  /** The operation executed */
  operation: string;
  /** The type which was the focus of the operation */
  typeName: string;
};

/** Result from the ArcadeDB server for a `CREATE TYPE` command */
export type ArcadeCreateTypeResponse = Array<RecordOperationResponse>;

/** Result from the ArcadeDB server for a `DROP TYPE` command */
export type ArcadeDropTypeResponse = Array<RecordOperationResponse>;

/** Result from the ArcadeDB server for a `CREATE EDGE` command */
export type ArcadeCreateEdgeResponse<E, N extends TypeNames<E>> = Array<E[N]>;

/** Result from the ArcadeDB server for a `UPDATE [@rid]` command */
export type ArcadeUpdateOneResponse = Array<RecordOperationResponse>;
