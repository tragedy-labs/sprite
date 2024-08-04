import { DatabaseSession } from '../session/DatabaseSession.js';
import {
  ArcadeSupportedQueryLanguages,
  Database
} from '../database/Database.js';
import { Rest } from '../rest/Rest.js';
import { Routes } from '../database/routes.js';

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

// TODO: I feel like this can be optimized quite a bit,
// maybe a similar facade pattern?

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
   *
   * @param language
   * @param command
   * @param params
   * @returns
   */
  crud = async (
    language: ArcadeSupportedQueryLanguages,
    command: string,
    params?: Record<string, boolean | string | number>
  ) => {
    try {
      return await Rest.postJson(
        Routes.COMMAND,
        { language, command, params },
        this._session,
        this
      );
    } catch (error) {
      throw new Error(`Could not perform CRUD operation ${command}`, {
        cause: error
      });
    }
  };
}
