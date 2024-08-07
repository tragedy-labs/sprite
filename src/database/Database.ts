import { Routes } from './routes.js';
import { EXPLAIN, SELECT_SCHEMA } from './commands/index.js';
import { Rest } from '../rest/Rest.js';
import { SpriteTransaction } from '../transaction/SpriteTransaction.js';
import { DatabaseSession } from '../session/DatabaseSession.js';
import { HeaderKeys } from '../rest/SpriteHeaders.js';
import {
  ArcadeGetSchemaResponse,
  ArcadeSqlExplanation
} from '@/types/database.js';
import { ArcadeTransactionIsolationLevel } from '@/transaction/Transaction.js';

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
  | { command: string; params: Record<string, unknown> };

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
    parameters?: Record<string, unknown>
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
  public static getSchema = async (
    session: DatabaseSession
  ): Promise<ArcadeGetSchemaResponse> => {
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
      const result = await this.query<ArcadeSqlExplanation>(
        session,
        Dialect.SQL,
        EXPLAIN(sql)
      );
      return result[0];
    } catch (error) {
      throw new Error(`Could not retreive explanation for ${sql}.`, {
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
