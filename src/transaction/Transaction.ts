import { DatabaseSession } from '../session/DatabaseSession.js';
import { ArcadeSupportedQueryLanguages } from '../database/Database.js';
import { Rest } from '../rest/Rest.js';
import { Routes } from '../database/routes.js';
import { SpriteTransaction } from './SpriteTransaction.js';
import { HeaderKeys } from '@/rest/SpriteHeaders.js';

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
   * Static method to begin a transaction.
   * @param session The {@link DatabaseSession `DatabaseSession`} to begin the transaction on.
   * @param isolationLevel The isolation level of the transaction.
   * @returns A {@link SpriteTransaction `SpriteTransaction`} instance for the target session.
   */
  public static begin = async (
    session: DatabaseSession,
    isolationLevel?: ArcadeTransactionIsolationLevel
  ): Promise<SpriteTransaction> => {
    try {
      // 'READ_COMMITTED' is default in ARCADEDB,
      // so we don't bother sending that
      const response = await Rest.post(
        Routes.BEGIN,
        isolationLevel === 'REPEATABLE_READ'
          ? JSON.stringify({ isolationLevel })
          : null,
        session
      );

      if (response.status !== 204) {
        throw new Error(
          `Server returned an unexpected response. Status: ${response.status} / ${response.statusText}.`
        );
      }

      const transactionId = response.headers?.get(HeaderKeys.ArcadeSessionId);

      // because the headers could be null
      // TODO: this isn't a good way to check for the transactionId
      if (!transactionId || typeof transactionId !== 'string') {
        throw new Error('Invalid transaction key received from server.');
      } else {
        return new SpriteTransaction(session, transactionId);
      }
    } catch (error) {
      throw new Error(
        `Unable to begin transaction in database "${session.databaseName}".`,
        { cause: error }
      );
    }
  };
  /**
   * Static method to commit a transaction.
   * @param session The {@link DatabaseSession `DatabaseSession`} to commit the transaction on.
   * @param transaction The id of the transaction to commit.
   * @returns `true` if the transaction was committed.
   */
  public static commit = async (
    session: DatabaseSession,
    transaction: SpriteTransaction
  ) => {
    try {
      const result = await Rest.post(Routes.COMMIT, null, session, transaction);
      if (result.status === 204) {
        return true;
      } else {
        throw new Error(
          `Unexpected response from the server when attemping to commit transaction ${transaction.id}`
        );
      }
    } catch (error) {
      throw new Error(`Unable to commit transaction ${transaction.id}`, {
        cause: error
      });
    }
  };
  /**
   * Static method to manage a transaction within the scope.
   * @param session The {@link DatabaseSession `DatabaseSession`} to execute the transaction on.
   * @param callback The callback to execute within transaction context.
   * @param isolationLevel The {@link ArcadeTransactionIsolationLevel isolationLevel} of the transaction.
   * @returns A touple containing result of the transaction, and a boolean indicating if the transaction was committed or rolled-back.
   */
  public static manage = async <T = void>(
    session: DatabaseSession,
    callback: (trx: SpriteTransaction) => Promise<T>,
    isolationLevel?: ArcadeTransactionIsolationLevel
  ): Promise<[boolean, T]> => {
    const trx = await this.begin(session, isolationLevel);
    try {
      const result = await callback(trx);
      if (trx.rolledBack) {
        return [false, result];
      } else {
        await trx.commit();
        return [true, result];
      }
    } catch (error) {
      // Attempt to rollback the transaction
      try {
        await trx.rollback();
        throw new Error(`Transaction ${trx.id} failed and was rolled back.`, {
          cause: error
        });
      } catch (rollbackError) {
        throw new Error(
          `Transaction ${trx.id} failed and rollback also failed.`,
          { cause: rollbackError }
        );
      }
    }
  };
  /**
   * Static method to execute CRUD as part of a transaction.
   * @param language The {@link ArcadeSupportedQueryLanguages `ArcadeSupportedQueryLanguages`} to use for the command.
   * @param command The CRUD command to execute.
   * @param params The parameters to pass to the command.
   * @returns The result of the CRUD operation.
   * @throws Error if the CRUD operation fails.
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
