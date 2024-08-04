import {
  ArcadeTransactionIsolationLevel,
  SpriteTransaction
} from '../transaction/SpriteTransaction.js';
import {
  ArcadeQueryParameters,
  ArcadeSupportedQueryLanguages,
  Database
} from './Database.js';
import {
  DatabaseSession,
  ISpriteDatabaseExistingSession,
  ISpriteDatabaseNewSession
} from '../session/DatabaseSession.js';
import { Server } from '@/server/Server.js';

/**
 * Interact with a database, perform queries, issue commands to manage
 * records, types, and settings.
 * @param parameters The fields necessary to perform operations on a specific database.
 * @returns an instance of SpriteDatabase
 * @example
 *
 * const db = new SpriteDatabase({
 *   username: 'aUser',
 *   password: 'aPassword',
 *   address: 'http://localhost:2480',
 *   databaseName: 'aDatabase'
 * });
 *
 * type DocumentTypes = {
 *   aDocument: {
 *     aField: string
 *   }
 * }
 *
 * async function databaseExample() {
 *  const client = db.documents<DocumentTypes>();
 *   try {
 *     await db.transaction(async (trx) => {
 *       await db.createType('aDocument', trx);
 *       db.createDocument('aDocument', trx, {
 *         data: {
 *           aField: 'aValue'
 *         }
 *       })
 *     });
 *     const schema = await db.getSchema();
 *     console.log(schema);
 *     // [...]
 *   } catch (error) {
 *     console.log(error);
 *     // handle error conditions
 *   }
 * }
 *
 * databaseExample();
 */
class SpriteDatabase {
  private session: DatabaseSession;

  constructor(params: ISpriteDatabaseExistingSession);
  constructor(params: ISpriteDatabaseNewSession);
  constructor(
    params: ISpriteDatabaseExistingSession | ISpriteDatabaseNewSession
  ) {
    this.session = new DatabaseSession(params);
  }
  /**
   * Executes a command on the target database. This method should only be used
   * for non-transactional, non-idempotent statements such as: `CREATE`, `ALTER`, or `DROP`.
   *
   * CRUD operations must be part of a transaction, otherwise changes will not persist.
   * Use the {@link SpriteTransaction.crud | `SpriteTransaction.crud()`} for this purpose.
   *
   * If you are trying to execute idempotent commands see {@link SpriteDatabase.query | `SpriteDatabase.query()`}.
   *
   * @note
   * If the command you are issuing is sending JSON data, you must stringify the
   * data with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify | `JSON.stringify()`}.
   *
   * ```ts
   * db.command<InsertDocument<DocumentType>>(
   *   'sql',
   *   `INSERT INTO DocumentType CONTENT ${JSON.stringify({ aProperty: 'aValue' })}`,
   *   trx,
   * );
   * ```
   *
   * @note
   * This package includes type definitions to help you issue commands with typed return values.
   * For example: `CreateType`, `DeleteFrom`, `ArcadeDocument`, etc. You can use these
   * like so:
   *
   * ```ts
   * db.command<InsertDocument<DocumentType>>(
   *   'sql',
   *   'INSERT INTO DocumentType',
   *   trx
   * );
   * ```
   *
   * @note
   * Schema updates (i.e. `CREATE TYPE`, etc) are non-idempotent, but are also non-transactional.
   * Therefore, transactions are optional on this method.
   *
   * @param language The language the command is written in.
   * @param command The command to execute in the given language.
   * @param transaction The transaction to perform this command within.
   * @returns The `result` property of the command response from the server,
   * typically this is an `Array`
   * @throw `Error` when it cannot execute the command.
   * @see
   * {@link SpriteDatabase.query | `SpriteDatabase.query()`}\
   * {@link SpriteDatabase.transaction | `SpriteDatabase.transaction()`}
   * @example
   *
   * const db = new SpriteDatabase({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   *   databaseName: 'aDatabase'
   * });
   *
   * async function spriteCommandExample() {
   *   try {
   *     const result = await db.command<CreateDocumentType>(
   *       'sql',
   *       'CREATE document TYPE aType',
   *     );
   *     console.log(result);
   *     // [ { operation: 'create document type', typeName: 'aType' } ]
   *     return result;
   *   } catch (error) {
   *     // handle error conditions
   *     console.error(error);
   *   }
   * };
   *
   * spriteCommandExample();
   */
  public command = async (
    language: ArcadeSupportedQueryLanguages,
    command: string,
    parameters?: Record<string, any>
  ) => Database.command(this.session, language, command, parameters);
  /**
   * Returns information about query execution planning of a specific statement,
   * without executing the statement itself.
   * @param sql The SQL command to explain.
   * @returns The explanation of the command.
   * @example
   *
   * const db = new SpriteDatabase({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   *   databaseName: 'aDatabase'
   * });
   *
   * async function spriteExplainExample() {
   *   try {
   *     const explanation = await db.explain("SELECT FROM schema:types");
   *     console.log(explanation);
   *     // {
   *     //   executionPlan: {
   *     //     type: 'QueryExecutionPlan',
   *     //     javaType: 'com.arcadedb.query.sql.executor.SelectExecutionPlan',
   *     //     cost: -1,
   *     //     prettyPrint: '+ FETCH DATABASE METADATA TYPES',
   *     //     steps: [ [Object] ]
   *     //   },
   *     //   executionPlanAsString: '+ FETCH DATABASE METADATA TYPES'
   *     // }
   *     return explanation;
   *   } catch (error) {
   *     console.error(error);
   *     // handle error conditions
   *   }
   * };
   *
   * spriteExplainExample();
   */
  public explain = async (sql: string) => Database.explain(this.session, sql);
  /**
   * Return the current schema.
   * @returns An array of objects describing the schema.
   * @example
   * async function getSchemaExample() {
   *   try {
   *     const schema = await db.getSchema();
   *     console.log(schema);
   *     // [...]
   *     return schema;
   *   } catch (error) {
   *     console.log(error);
   *     // handle error conditions
   *   }
   * }
   *
   * getSchemaExample();
   */
  public getSchema = async () => Database.getSchema(this.session);
  /**
   * Executes a query against the target database. This method only executes
   * idempotent statements (that cannot change the database), namely `SELECT`
   * and `MATCH`.
   *
   * **The execution of non-idempotent commands will throw an
   * `IllegalArgumentException` exception.**
   *
   * If you are trying to execute
   * non-idempotent commands, see the {@link SpriteDatabase.query} method.
   *
   * @note
   * This library includes type definitions to assist in writing queries with
   * typed return values. For example: `ArcadeDocument`, `ArcadeEdge`, etc.
   * You can use these like so:
   *
   * ```ts
   * const result = await db.query<ArcadeDocument<DocumentType>>(
   *  'sql',
   *  'SELECT * FROM aType WHERE aProperty == "aValue"'
   * );
   * ```
   *
   * @param language The language of the query.
   * @param command The command to execute in the given language.
   * @returns The `result` property of the query response from the server,
   * this is an Array containing the result set of the query.
   * @see {@link SpriteDatabase.command | `SpriteDatabase.command()`}
   * @example
   *
   * const db = new SpriteDatabase({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   *   databaseName: 'aDatabase'
   * });
   *
   * type DocumentType = {
   *   aProperty: string
   * }
   *
   * async function spriteQueryExample() {
   *   try {
   *     const result = await db.query<ArcadeDocument<DocumentType>>(
   *       'sql',
   *       'SELECT * FROM DocumentType WHERE aProperty == "aValue"'
   *     );
   *     console.log(result);
   *     // [{
   *     //   '@rid': '#0:0',
   *     //   '@cat': 'd',
   *     //   '@type': 'DocumentType',
   *     //   aProperty: 'aValue'
   *     // }];
   *     return result
   *   } catch (error) {
   *     console.error(error);
   *     // handle error conditions
   *   }
   * };
   *
   * spriteQueryExample();
   */
  public query = async (
    language: ArcadeSupportedQueryLanguages,
    command: string,
    parameters?: ArcadeQueryParameters
  ) => Database.query(this.session, language, command, parameters);
  /**
   * Creates a new transaction and passes it as an argument to a callback which
   * represents the transaction scope. The transaction is committed when the
   * callback resolves. The transaction can be rolled back by invoking
   * `SpriteTransaction.rollback()` within the callback.
   * @param callback The callback to execute within the transaction scope.
   * @param isolationLevel The isolation level of the transaction.
   * @see
   * {@link SpriteDatabase.newTransaction | SpriteDatabase.newTransaction()} \
   * {@link SpriteTransaction.commit | SpriteTransaction.commit()}
   * @returns void
   * @example
   *
   * const db = new SpriteDatabase({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   *   databaseName: 'aSpriteDatabase'
   * });
   *
   * type DocumentType = {
   *   aProperty: string
   * }
   *
   * async function transactionExample() {
   *   try {
   *     await db.command<CreatDocumentType>(
   *       'sql',
   *       'CREATE document TYPE aType',
   *     );
   *     await db.transaction(async (trx) => {
   *       db.command<InsertDocument<DocumentType>(
   *         'aType',
   *         trx,
   *         {
   *           aProperty: 'aValue'
   *         }
   *       );
   *     });
   *   } catch (error) {
   *     console.error(error);
   *     // handle error conditions
   *   }
   * };
   *
   * transactionExample();
   */
  public transaction = async <T>(
    callback: (trx: SpriteTransaction) => Promise<T>,
    isolationLevel?: ArcadeTransactionIsolationLevel
  ) => Database.transaction<T>(this.session, callback, isolationLevel);
  /**
   * Creates and returns a new {@link SpriteTransaction}.
   * Operations requiring the transaction should be executed using
   * the `crud()` method on the returned object. The
   * transaction can be committed using the `commit()` method, and
   * rolled-back by invoking `rollback()`.
   * @param isolationLevel The isolation level of the transaction.
   * @see
   * {@link SpriteTransaction}
   * @returns void
   * @example
   *
   * const db = new SpriteDatabase({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   *   databaseName: 'aSpriteDatabase'
   * });
   *
   * type DocumentType = {
   *   aProperty: string
   * }
   *
   * async function transactionExample() {
   *   try {
   *     await db.command<CreatDocumentType>(
   *       'sql',
   *       'CREATE document TYPE aType',
   *     );
   *     await db.transaction(async (trx) => {
   *       db.command<InsertDocument<DocumentType>(
   *         'aType',
   *         trx,
   *         {
   *           aProperty: 'aValue'
   *         }
   *       );
   *     });
   *   } catch (error) {
   *     console.error(error);
   *     // handle error conditions
   *   }
   * };
   *
   * transactionExample();
   */
  public newTransaction = async <T>(
    isolationLevel?: ArcadeTransactionIsolationLevel
  ) => Database.beginTransaction(this.session, isolationLevel);
  /**
   * Check to see if this database exists on the server
   * (i.e. the database was created).
   * @returns `true` if the database exists.
   * @throws `Error` if the database does not exist.
   * @example
   * async function databaseExistsExample() {
   *   try {
   *     const exists = await db.exists();
   *     console.log(exists);
   *     // true
   *   } catch (error) {
   *     console.error(error);
   *     // handle error conditions
   *   }
   * }
   *
   * databaseExistsExample();
   */
  public exists = async () =>
    Database.exists(this.session, this.session.databaseName);
  /**
   * Create a new database on the server.
   * @returns `true` if the database was created.
   * @throws `Error` if the database could not be created.
   * @example
   * async function createDatabaseExample() {
   *   try {
   *     const exists = await db.exits();
   *     if (!exits) {
   *       const created = await db.create();
   *       console.log(created);
   *       // true
   *     }
   *   } catch (error) {
   *     console.error(error);
   *     // handle error conditions
   *   }
   * }
   *
   * createDatabaseExample();
   */
  public create = async () =>
    Server.createDatabase(this.session, this.session.databaseName);
}

export { SpriteDatabase };
