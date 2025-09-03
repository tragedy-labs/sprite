import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import { QueryLanguages } from '@/database/constants/languages.js';
import {
  commitTransaction,
  execute,
  rollbackTransaction
} from '@/database/transaction/index.js';
import type { ArcadeQueryParameters } from '@/database/types.js';

/**
 * A transaction in Sprite, contains the transaction id, and methods to
 * commit or rollback the transaction.
 * @param database the `ArcadeDatabaseContext` the transaction is taking place of
 * @param transactionId the id of the transaction
 */
export class Transaction {
  readonly #database: ArcadeDatabaseContext;
  readonly #id: string;
  /** State */
  private isRolledBack = false;
  private isCommitted = false;
  constructor(database: ArcadeDatabaseContext, transactionId: string) {
    this.#database = database;
    this.#id = transactionId;
  }
  /** The trasaction ID */
  get id() {
    return this.#id;
  }
  /** Whether or not the transaction has been rolledback */
  get rolledBack() {
    return this.isRolledBack;
  }
  /** Whether or not the transaction has been committed */
  get committed() {
    return this.isCommitted;
  }
  /**
   * Commit the transaction.
   * @returns `true` if the transaction was commited.
   */
  commit = async () => {
    this.isCommitted = await commitTransaction(this.#database, this);
    return this.isCommitted;
  };
  /**
   * Rollback the transaction.
   * @returns `true` if the transaction was commited.
   */
  rollback = async () => {
    this.isRolledBack = await rollbackTransaction(this.#database, this);
    return this.isRolledBack;
  };
  /**
   * Execute an operation as part of the transaction.
   * @param language the query language to use
   * @param command the command to execute
   * @param params the (optional) parameters to pass to the command
   * @returns the result of the CRUD operation
   */
  execute = async <T>(
    language: QueryLanguages,
    command: string,
    parameters?: ArcadeQueryParameters
  ): Promise<T> =>
    execute<T>(this.#database, this, language, command, parameters);
}
