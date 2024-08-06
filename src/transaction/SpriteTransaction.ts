import { DatabaseSession } from '../session/DatabaseSession.js';
import {
  ArcadeSupportedQueryLanguages,
  Database
} from '../database/Database.js';
import { Rest } from '../rest/Rest.js';
import { Routes } from '../database/routes.js';
import { Transaction } from './Transaction.js';

/**
 * isolationLevel is the isolation level for the current transaction,
 * either `READ_COMMITTED` or `REPEATABLE_READ`. For details on what
 * isolation level dictates about the transaction, see the [ArcadeDB
 * documentation](https://docs.arcadedb.com/#HTTP-Begin)
 * @default READ_COMMITTED
 */
export type ArcadeTransactionIsolationLevel =
  | 'READ_COMMITTED'
  | 'REPEATABLE_READ';

/**
 * A transaction in Sprite, contains the transaction id, and methods to
 * commit or rollback the transaction.
 * @param session the `DatabaseSession` the transaction is taking place of
 * @param transactionId the id of the transaction
 */
export class SpriteTransaction {
  private _session: DatabaseSession;
  private _id: string;
  /** State */
  private _rolledBack = false;
  private _committed = false;
  constructor(session: DatabaseSession, transactionId: string) {
    this._session = session;
    this._id = transactionId;
  }
  /** The trasaction ID */
  get id() {
    return this._id;
  }
  /** Whether or not the transaction has been rolledback */
  get rolledBack() {
    return this._rolledBack;
  }
  /** Whether or not the transaction has been committed */
  get committed() {
    return this._committed;
  }
  /**
   * Commit the transaction.
   * @returns `true` if the transaction was commited.
   */
  commit = async () => {
    this._committed = await Database.commitTransaction(this._session, this);
    return this.committed;
  };
  /**
   * Rollback the transaction.
   * @returns `true` if the transaction was commited.
   */
  rollback = async () => {
    this._rolledBack = await Database.rollbackTransaction(this._session, this);
    return this.rolledBack;
  };
  /**
   * Perform a CRUD operation in the transaction.
   * @param language the query language to use
   * @param command the command to execute
   * @param params the (optional) parameters to pass to the command
   * @returns
   */
  crud = async <T>(
    language: ArcadeSupportedQueryLanguages,
    command: string,
    parameters?: Record<string, boolean | string | number>
  ): Promise<T> =>
    Transaction.crud<T>(this._session, this, language, command, parameters);
}
