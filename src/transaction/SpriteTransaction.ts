import { DatabaseSession } from '../session/DatabaseSession.js';
import { ArcadeSupportedQueryLanguages } from '../database/Database.js';
import { Transaction } from './Transaction.js';

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
    this._committed = await Transaction.commit(this._session, this);
    return this.committed;
  };
  /**
   * Rollback the transaction.
   * @returns `true` if the transaction was commited.
   */
  rollback = async () => {
    this._rolledBack = await Transaction.rollback(this._session, this);
    return this.rolledBack;
  };
  /**
   * Perform a CRUD operation in the transaction.
   * @param language the query language to use
   * @param command the command to execute
   * @param params the (optional) parameters to pass to the command
   * @returns the result of the CRUD operation
   */
  crud = async <T>(
    language: ArcadeSupportedQueryLanguages,
    command: string,
    parameters?: Record<string, boolean | string | number>
  ): Promise<T> =>
    Transaction.crud<T>(this._session, this, language, command, parameters);
}
