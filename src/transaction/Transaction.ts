import { DatabaseSession } from '../session/DatabaseSession.js';
import { ArcadeSupportedQueryLanguages } from '../database/Database.js';
import { Rest } from '../rest/Rest.js';
import { Routes } from '../database/routes.js';
import { SpriteTransaction } from './SpriteTransaction.js';

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
 * Static class for performing operations on or in a transaction.
 */
export class Transaction {
  /**
   *
   * @param language
   * @param command
   * @param params
   * @returns
   */
  public static crud = async <T>(
    session: DatabaseSession,
    transaction: SpriteTransaction,
    language: ArcadeSupportedQueryLanguages,
    command: string,
    params?: Record<string, boolean | string | number>
  ): Promise<T> => {
    try {
      return await Rest.postJson<T>(
        Routes.COMMAND,
        { language, command, params },
        session,
        transaction
      );
    } catch (error) {
      throw new Error(`Could not perform CRUD operation ${command}`, {
        cause: error
      });
    }
  };
}
