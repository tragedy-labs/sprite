import { Routes } from './routes.js';
import { EXPLAIN, SELECT_SCHEMA } from './commands/index.js';
import { Rest } from '../rest/Rest.js';
import {
  ArcadeTransactionIsolationLevel,
  SpriteTransaction
} from '../transaction/SpriteTransaction.js';
import { DatabaseSession } from '../session/DatabaseSession.js';
import { HeaderKeys } from '../rest/SpriteHeaders.js';
import { ArcadeSqlExplanation } from '@/types/database.js';

export enum Dialect {
  SQL = 'sql',
  SQLSCRIPT = 'sqlscript',
  GRAPHQL = 'graphql',
  CYPHER = 'cypher',
  GREMLIN = 'gremlin',
  MONGO = 'mongo'
}

export type ArcadeQueryParameters = Record<string, boolean | string | number>;

export type ArcadeCommand =
  | string
  | { command: string; params: Record<string, any> };

/**
 * The Query languages supported by ArcadeDB, supplied as a parameter
 * to `SpriteDatabase.query()` and `SpriteDatabase.command()`
 */
export type ArcadeSupportedQueryLanguages =
  | 'sql'
  | 'sqlscript'
  | 'graphql'
  | 'cypher'
  | 'gremlin'
  | 'mongo';

/**
 * Static methods for common database operations.
 */
class Database {
  /**
   * Static method to execute a command on the database.s
   * @param session The {@link DatabaseSession `DatabaseSession`} to execute the command on.
   * @param language The language of the command.
   * @param command The command to execute.
   * @param transaction The transaction to execute the command in.
   * @returns The result of the command.
   */
  public static command = async <T>(
    session: DatabaseSession,
    language: ArcadeSupportedQueryLanguages,
    command: ArcadeCommand,
    parameters?: Record<string, any>
  ): Promise<T> => {
    try {
      return await Rest.postJson(
        Routes.COMMAND,
        {
          language,
          command,
          params: parameters
        },
        session
      );
    } catch (error) {
      throw new Error(
        `Could not perform command on database: ${session.databaseName}`,
        { cause: error }
      );
    }
  };
  /**
   * Static method to query the database.
   * @param session The {@link DatabaseSession `DatabaseSession`} to execute the query on.
   * @param language The language of the query.
   * @param command The query to execute.
   * @param parameters
   * @returns The result-set of the query.
   */
  public static query = async <T>(
    session: DatabaseSession,
    language: ArcadeSupportedQueryLanguages,
    command: string,
    parameters?: ArcadeQueryParameters
  ): Promise<T[]> =>
    Rest.postJson<T[]>(
      Routes.QUERY,
      { language, command, params: parameters },
      session
    );
  /**
   * Static method to get the schema of the database.
   * @param session The {@link DatabaseSession `DatabaseSession`} to target for the schema.
   * @returns The schema of the database.
   */
  public static getSchema = async (session: DatabaseSession): Promise<any> => {
    try {
      return await this.query(session, Dialect.SQL, SELECT_SCHEMA);
    } catch (error) {
      throw new Error(
        `Could not retreive schema from database: ${session.databaseName}`,
        {
          cause: error
        }
      );
    }
  };
  /**
   * Static method to explain a query.
   * @param session The {@link DatabaseSession `DatabaseSession`} to target for the explanation.
   * @param sql The SQL query to explain.
   * @returns The explanation of the query.
   */
  public static explain = async (
    session: DatabaseSession,
    sql: string
  ): Promise<ArcadeSqlExplanation> => {
    try {
      const result = await this.query<ArcadeSqlExplanation>(session, Dialect.SQL, EXPLAIN(sql));
      return result[0];
    } catch (error) {
      throw new Error(`Could not retreive explanation for ${sql}.`, {
        cause: error
      });
    }
  };
  /**
   * Static method to execute a transaction.
   * @param session The {@link DatabaseSession `DatabaseSession`} to execute the transaction on.
   * @param callback The callback to execute within transaction context.
   * @param somethingElse Some other parameter to pass to the transaction.
   * @returns A touple containing result of the transaction, and a boolean indicating if the transaction was committed or rolled-back.
   */
  public static transaction = async <T = void>(
    session: DatabaseSession,
    callback: (trx: SpriteTransaction) => Promise<T>,
    isolationLevel?: ArcadeTransactionIsolationLevel
  ): Promise<[boolean, T]> => {
    const trx = await this.beginTransaction(session, isolationLevel);
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
   * Static method to begin a transaction.
   * @param session The {@link DatabaseSession `DatabaseSession`} to begin the transaction on.
   * @param isolationLevel The isolation level of the transaction.
   * @returns A {@link SpriteTransaction `SpriteTransaction`} instance for the target session.
   */
  public static beginTransaction = async (
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
  public static commitTransaction = async (
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
   * Static method to rollback a transaction.
   * @param session The {@link DatabaseSession `DatabaseSession`} to rollback the transaction on.
   * @param transaction The id of the transaction to rollback.
   * @returns `true` if the transaction was rolled back.
   */
  public static rollbackTransaction = async (
    session: DatabaseSession,
    transaction: SpriteTransaction
  ) => {
    try {
      const result = await Rest.post(
        Routes.ROLLBACK,
        null,
        session,
        transaction
      );
      if (result.status === 204) {
        return true;
      } else {
        throw new Error(
          `Unexpected response from the server when attemping to rollback transaction ${transaction.id}`
        );
      }
    } catch (error) {
      throw new Error(`Unable to rollback transaction ${transaction.id}`, {
        cause: error
      });
    }
  };
  /**
   * Check to see if the database exists.
   * @param session The session to use to check for the database.
   * @param databaseName The name of the database to check for existence.
   * @returns `true` if database exists, `false` if not
   * @throws `Error` if the existence of the database could not be verified.
   */
  public static exists = async (
    session: DatabaseSession,
    databaseName: string
  ): Promise<boolean> => {
    try {
      const response = await Rest.get(Routes.EXISTS, session);
      switch (response.status) {
        case 200: {
          const { result } = await response.json();
          if (typeof result === 'boolean') {
            return result;
          } else {
            throw new Error(
              `Recieved an unexpected result from the server, expected boolean, recieved: [${result}] which has a type of: ${typeof result}.`
            );
          }
        }
        case 400:
          throw new Error(
            `No database name was passed to the server. Recieved: [${databaseName}].`
          );
        default:
          throw new Error(
            `Received an unexpected status code from the server when attempting to check if database "${databaseName}" exists.`
          );
      }
    } catch (error) {
      throw new Error(
        `Encountered an error when checking to see if database "${databaseName}" exists`,
        { cause: error }
      );
    }
  };
}

export { Database };
