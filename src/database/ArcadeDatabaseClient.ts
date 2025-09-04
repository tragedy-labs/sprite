import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import {
    arcadeCommand,
    arcadeQuery,
    exists,
    explain,
    getSchema
} from '@/database/static/index.js';
import {
    beginTransaction,
    manageTransaction,
    Transaction
} from '@/database/transaction/index.js';
import type { ArcadeTransactionIsolationLevel } from '@/database/transaction/types.js';
import type {
    ArcadeQueryParameters,
    ArcadeSupportedQueryLanguages
} from '@/database/types.js';

/**
 * Interacts with a database, performing queries and issuing commands to manage
 * records, types, and settings.
 * @param parameters The fields necessary to connect to and interact with a specific database.
 * @returns An instance of SpriteDatabase.
 * @example
 * ```ts
 *
 * const arcade = new Arcade({
 *   username: 'aUser',
 *   password: 'aPassowrd',
 *   host: 'localhost',
 *   port: 2480
 * })
 *
 * const db = new Database('aDatabase', arcade);
 *
 * type DocumentTypes = {
 *   aDocument: {
 *     aField: string
 *   }
 * }
 *
 * async function databaseExample() {
 *   const client = db.documents<DocumentTypes>();
 *   try {
 *     await db.transaction(async (trx) => {
 *       await db.createType('aDocument', trx);
 *       trx.crud('sql', 'INSERT INTO aDocument CONTENT { "aField": "aValue" }');
 *     });
 *     const schema = await db.getSchema();
 *     console.log(schema);
 *     // [...]
 *   } catch (error) {
 *     console.error(error);
 *     // handle error conditions
 *   }
 * }
 *
 * databaseExample();
 * ```
 */
export class ArcadeDatabaseClient {
  readonly #context: ArcadeDatabaseContext;
  constructor(context: ArcadeDatabaseContext) {
    this.#context = context;
  }
  /** The name of the database */
  get name() {
    return this.#context.name;
  }
  /**
   * Executes a command on the target database. This method should only be used
   * for non-transactional, non-idempotent statements such as `CREATE`, `ALTER`, or `DROP`.
   *
   * CRUD operations must be part of a transaction; otherwise, changes will not persist.
   * Use the {@link SpriteTransaction.crud | `SpriteTransaction.crud()`} method for this purpose.
   *
   * If you need to execute idempotent commands, see {@link SpriteDatabase.query | `SpriteDatabase.query()`}.
   *
   * @note
   * This package includes type definitions to help you issue commands with typed return values.
   *
   * ```ts
   * db.command<CreateDocumentType>(
   *   'sql',
   *   'CREATE DOCUMENT TYPE aType'
   * );
   * ```
   * @param language The language in which the command is written (e.g. SQL).
   * @param command The command to execute in the given language.
   * @returns The `result` property of the command response from the server,
   * typically an `Array`.
   * @throws `Error` if the command cannot be executed.
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
   *       'CREATE DOCUMENT TYPE aType',
   *     );
   *     console.log(result);
   *     // [ { operation: 'create document type', typeName: 'aType' } ]
   *     return result;
   *   } catch (error) {
   *     // handle error conditions
   *     console.error(error);
   *   }
   * }
   *
   * spriteCommandExample();
   */
  public command = async <T = unknown>(
    language: ArcadeSupportedQueryLanguages,
    command: string,
    parameters?: Record<string, unknown>
  ): Promise<T> => arcadeCommand(this.#context, language, command, parameters);
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
  public explain = async (sql: string) => explain(this.#context, sql);
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
  public getSchema = async () => getSchema(this.#context);
  /**
   * Executes a query against the target database. This method only executes
   * idempotent statements (that cannot change the database), namely `SELECT`
   * and `MATCH`.
   *
   * **The execution of non-idempotent commands will throw an
   * `IllegalArgumentException` exception.**
   *
   * If you are trying to execute
   * non-idempotent commands, see the {@link SpriteDatabase.command} method.
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
  public query = async <T = unknown>(
    language: ArcadeSupportedQueryLanguages,
    command: string,
    parameters?: ArcadeQueryParameters
  ) => arcadeQuery<T>(this.#context, language, command, parameters);
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
   *       trx.crud<InsertDocument<DocumentType>(
   *         'sql',
   *         'INSERT INTO aType SET aProperty = :aProperty',
   *         { aProperty: 'aValue' }
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
    callback: (trx: Transaction) => Promise<T>,
    isolationLevel?: ArcadeTransactionIsolationLevel
  ) => manageTransaction<T>(this.#context, callback, isolationLevel);
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
   *
   *     const trx = await db.newTransaction();
   *     await trx.crud<InsertDocument<DocumentType>(
   *       'sql',
   *       'INSERT INTO aType SET aProperty = :aProperty',
   *       { aProperty: 'aValue' }
   *     );
   *     await trx.commit();
   *   } catch (error) {
   *     console.error(error);
   *     // handle error conditions
   *   }
   * };
   *
   * transactionExample();
   */
  public newTransaction = async (
    isolationLevel?: ArcadeTransactionIsolationLevel
  ): Promise<Transaction> => beginTransaction(this.#context, isolationLevel);
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
  public exists = async () => exists(this.#context);
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
  //public create = async () =>
  //Server.createDatabase(this.#context.context, this.#context.name);
}
