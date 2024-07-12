import {
  ArcadeGetSchemaResponse,
  ArcadeSqlExplanation,
  ArcadeSupportedQueryLanguages,
  ArcadeTypeDefinition,
  AsArcadeDocuments,
  AsArcadeEdges,
  AsArcadeVertices,
  ISpriteDatabaseClientParameters,
  ISpriteDatabaseConnectionParameters,
  SpriteTransactionCallback
} from './types/database.js';
import { ArcadeDatabaseError } from './errors/ArcadeDatabaseError.js';
import { SpriteTransaction } from './SpriteTransaction.js';
import { endpoints } from './endpoints/database.js';
import { isNewClient } from './utilities/isNewClient.js';
import { SpriteRestClient } from './SpriteRestClient.js';
import { ArcadeTransactionIsolationLevel } from './types/transaction.js';
import { DocumentModality } from './modes/DocumentModality.js';
import { GraphModality } from './modes/GraphModality.js';
import { SqlDialect } from './dialects/SqlDialect.js';

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
  /** The rest client, handles auth and connection details  */
  private _client: SpriteRestClient;
  /** Methods for performing SQL operations on the database. */
  private _dialect: SqlDialect | undefined;
  /** The name of the database */
  private _name: string;
  /** Modality for operations involving document records */
  private _documentModality: DocumentModality<unknown> | undefined;
  /** Modality for operations involving vertex & edge records */
  private _graphModality: GraphModality<unknown, unknown> | undefined;
  constructor(parameters: ISpriteDatabaseClientParameters);
  constructor(parameters: ISpriteDatabaseConnectionParameters);
  constructor(
    parameters:
      | ISpriteDatabaseConnectionParameters
      | ISpriteDatabaseClientParameters
  ) {
    if (isNewClient(parameters)) {
      const { databaseName, ...clientParameters } =
        parameters as ISpriteDatabaseConnectionParameters;
      this._name = databaseName;
      this._client = new SpriteRestClient(clientParameters);
    } else {
      const { client, databaseName } =
        parameters as ISpriteDatabaseClientParameters;
      this._client = client;
      this._name = databaseName;
    }
  }
  /** The name of the database. */
  get name() {
    return this._name;
  }
  /**
   * Private getter for this._dialect, to avoid
   * prematurly creating the sql dialect if they are not
   * needed.
   */
  private get dialect() {
    if (!this._dialect) {
      this._dialect = new SqlDialect(this);
    }
    return this._dialect;
  }
  /** Helper function for building enpoints */
  private _endpoint = (endpoint: string) => `${endpoint}/${this.name}`;
  /**
   * Returns a modality for working with document records within the database.
   * @returns {DocumentModality} A database document modality.
   */
  documentModality = <T>(): DocumentModality<AsArcadeDocuments<T>> => {
    if (!this._documentModality) {
      this._documentModality = new DocumentModality<unknown>(
        this,
        this.dialect
      );
    }
    return this._documentModality as DocumentModality<AsArcadeDocuments<T>>;
  };
  /**
   * Returns a modality for working with graph records within the database.
   * @returns A database graph modality.
   */
  graphModality = <V, E>(): GraphModality<
    AsArcadeVertices<V>,
    AsArcadeEdges<E>
  > => {
    if (!this._graphModality) {
      this._graphModality = new GraphModality<unknown, unknown>(
        this,
        this.dialect
      );
    }
    return this._graphModality as GraphModality<
      AsArcadeVertices<V>,
      AsArcadeEdges<E>
    >;
  };
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
  query = async <T>(
    language: ArcadeSupportedQueryLanguages,
    command: string
  ): Promise<Array<T>> => {
    const response = await this._client.fetch(this._endpoint(endpoints.query), {
      method: 'POST',
      body: JSON.stringify({
        language,
        command
      })
    });

    // 200 OK
    // 400 invalid language, invalid query
    // 500 database does not exist, cannot execute query
    // 403, 404 are handled by SpriteBase.fetch()

    switch (response.status) {
      case 200: {
        const { result } = await response.json();
        return result;
      }
      case 400:
        throw new Error(
          `Invalid language or query. Status: ${response.status}`
        );
      case 500: {
        const message = await response.json();
        throw new Error(
          `${message.error}. ${message.detail}. Status: ${response.status}`
        );
      }
      default:
        throw new Error(
          `Unknown error. Status: ${response.status}, StatusText: ${response.statusText}`
        );
    }
  };
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
  explain = async (sql: string): Promise<ArcadeSqlExplanation> => {
    try {
      const [result] = await this.query<ArcadeSqlExplanation>(
        'sql',
        `EXPLAIN ${sql}`
      );
      return result;
    } catch (error) {
      throw new Error(
        `Could not retreive explanation from the server for ${sql}.`,
        { cause: error }
      );
    }
  };
  /**
   * Executes a command on the target database. This method should only be used
   * for non-idempotent statements (that can change the database), such as `INSERT`,
   * `CREATE`, and `DELETE`.
   *
   * Commands to perform CRUD operations must have a transaction passed to them,
   * otherwise your changes will not be persisted. There is a method with a
   * non-optional transaction parameter, {@link SpriteDatabase.crud | `SpriteDatabase.crud()`},
   * this is safer way to write your functionality.
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
  command = async <T>(
    language: ArcadeSupportedQueryLanguages,
    command: string,
    transaction?: SpriteTransaction
  ): Promise<T> => {
    const response = await this._client.fetch(
      this._endpoint(endpoints.command),
      {
        method: 'POST',
        body: JSON.stringify({
          language,
          command
        }),
        headers: transaction
          ? { 'arcadedb-session-id': transaction.id }
          : undefined
      }
    );

    switch (response.status) {
      case 200: {
        const { result } = await response.json();
        return result;
      }
      // TODO: need to find an example of a command that returns 202
      // case 202:
      //  break;
      case 400:
        throw new Error(
          `Invalid language or command. Status: ${response.status}`
        );
      case 500:
        throw new ArcadeDatabaseError(await response.json());
      default:
        throw new Error(
          `Unknown error. Status: ${response.status}, StatusText: ${response.statusText}`
        );
    }
  };
  /**
   * A method for issuing commands that perform CRUD.
   * This method is a safer way to write functionality as the transaction
   * argument is not optional.
   * @param language The language the command is written in.
   * @param command The command to execute in the given language.
   * @param transaction The transaction to perform this command within.
   * @returns The `result` property of the command response from the server. This will be an `Array` for CRUD operations.
   * @throw `Error` when it cannot execute the command.
   * @see
   * {@link SpriteDatabase.command | `SpriteDatabase.command()`}\
   * {@link SpriteDatabase.query | `SpriteDatabase.query()`}\
   * {@link SpriteDatabase.transaction | `SpriteDatabase.transaction()`}
   * @example
   * async function crudExample() {
   *   try {
   *     const trx = await db.newTransaction();
   *     const record = await db.crud(
   *       'sql',
   *       'INSERT INTO aType',
   *       trx
   *     );
   *     trx.commit();
   *     return record;
   *   } catch (error) {
   *     console.log(error);
   *     // handle error conditions
   *   }
   * }
   */
  crud = (
    language: ArcadeSupportedQueryLanguages,
    command: string,
    transaction: SpriteTransaction
  ) => this.command(language, command, transaction);
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
  getSchema = async (): Promise<ArcadeGetSchemaResponse> => {
    try {
      const result = await this.query<ArcadeTypeDefinition>(
        'sql',
        'SELECT FROM schema:types'
      );
      return result;
    } catch (error) {
      throw new Error(`Could not get schema for database ${this.name}`, {
        cause: error
      });
    }
  };
  /**
   * Begins a transaction on the server, managed as a session.
   * @param isolationLevel The isolation level for the transaction, defaults to `READ_COMMITED`.
   * @returns An instance of a SpriteTransaction to be passed to methods that require it an argument.
   * @example
   *
   * async function newTransactionExample() {
   *   try {
   *     await db.command(
   *       'sql',
   *       'CREATE document TYPE aType',
   *     );
   *     const trx = await db.newTransaction();
   *     const record = await db.command(
   *       'sql',
   *       'INSERT INTO aType',
   *       trx
   *     );
   *     trx.commit();
   *     return record;
   *   } catch (error) {
   *     console.log(error);
   *     // handle error conditions
   *   }
   * }
   *
   * transactionExample();
   */
  newTransaction = async (
    isolationLevel?: ArcadeTransactionIsolationLevel
  ): Promise<SpriteTransaction> => {
    try {
      // 'READ_COMMITTED' is default in ARCADEDB,
      // so we don't bother sending that
      const response = await this._client.fetch(
        this._endpoint(endpoints.beginTransaction),
        {
          method: 'POST',
          body:
            isolationLevel === 'REPEATABLE_READ'
              ? JSON.stringify({ isolationLevel })
              : null
        }
      );

      if (response.status !== 204) {
        throw new Error(
          `Server returned an unexpected response. Status: ${response.status} / ${response.statusText}.`
        );
      }

      const sessionId = response.headers?.get('arcadedb-session-id');

      // this is weird, but the headers could be null, so we need to check
      // if the sessionId exists, (might as well check the type)
      // but we should error if it's not a string, because we can't return
      // a transaction without a sessionId
      if (!sessionId || typeof sessionId !== 'string') {
        throw new Error('Invalid transaction key received from server.');
      }
      return new SpriteTransaction(this, sessionId);
    } catch (error) {
      throw new Error(
        `Unable to begin transaction in database "${this.name}".`,
        { cause: error }
      );
    }
  };
  /**
   * Commits a transaction on the server, provided a transaction id.
   * Provide the id obtained from the transaction returned from invoking
   * `SpriteDatabase.newTransaction()`.
   * @note You can use the `SpriteTransaction.commit()` method directly.
   * @param transactionId The ID of the transaction to commit.
   * @returns Promise that resolves to boolean `true` if successful, and `false` otherwise.
   * @throws Error if it cannot commit the transaction.
   * @example
   * async function commitTransactionExample() {
   *   try {
   *     const trx = await db.newTransaction();
   *     await db.command(
   *       'sql',
   *       'INSERT INTO aType',
   *     );
   *
   *     console.log(trx.id);
   *     // 'AS-0000000-0000-0000-0000-00000000000'
   *
   *     db.commitTransaction(trx.id);
   *   } catch (error) {
   *     console.log(error);
   *     // handle error conditions
   *   }
   * }
   *
   * commitTransactionExample();
   */
  commitTransaction = async (transactionId: string): Promise<boolean> => {
    try {
      const result = await this._client.fetch(
        this._endpoint(endpoints.commitTransaction),
        {
          method: 'POST',
          headers: {
            'arcadedb-session-id': transactionId
          }
        }
      );
      if (result.status === 204) {
        return true;
      } else {
        throw new Error(
          `Unexpected response from the server when attemping to commit transaction ${transactionId}`
        );
      }
    } catch (error) {
      throw new Error(`Unable to commit transaction ${transactionId}`, {
        cause: error
      });
    }
  };
  /**
   * Rolls back a transaction on the server. Provide the session id obtained with the `SpriteDatabase.newTransaction()` method.
   * @param transactionId The ID of the transaction to commit.
   * @returns The response from the server.
   * @example
   * async function rollbackTransactionExample() {
   *   try {
   *     const trx = await db.newTransaction();
   *     await db.command(
   *       'sql',
   *       'INSERT INTO aType',
   *       trx
   *     );
   *     console.log(trx.id);
   *     // 'AS-0000000-0000-0000-0000-00000000000'
   *     db.rollbackTransaction(trx.id);
   *     return trx;
   *   } catch (error) {
   *     console.log(error);
   *     // handle error conditions
   *   }
   * }
   *
   * rollbackTransactionExample();
   */
  rollbackTransaction = async (transactionId: string): Promise<boolean> => {
    try {
      const result = await this._client.fetch(
        this._endpoint(endpoints.rollbackTransaction),
        {
          method: 'POST',
          headers: {
            'arcadedb-session-id': transactionId
          }
        }
      );
      if (result.status === 204) {
        return true;
      } else {
        throw new Error(
          `Unexpected response from the server when attemping to rollback transaction ${transactionId}`
        );
      }
    } catch (error) {
      throw new Error(`Unable to rollback transaction ${transactionId}`, {
        cause: error
      });
    }
  };
  /**
   * Helps to manage a transaction by automatically invoking `newTransaction`,
   * and passing the returned `SpriteTransaction` to a callback as an argument,
   * to be passed to non-idempotent databases operations in the callback scope.
   * `SpriteTransaction.commit()` is called automatically after the callback
   * is executed.
   * @param callback
   * @param isolationLevel
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
  transaction = async (
    callback: SpriteTransactionCallback,
    isolationLevel?: ArcadeTransactionIsolationLevel
  ): Promise<boolean> => {
    try {
      const trx = await this.newTransaction(isolationLevel);
      await callback(trx);
      return await trx.commit();
    } catch (error) {
      throw new Error(`Could not complete transaction.`, { cause: error });
    }
  };
}

export { SpriteDatabase };
