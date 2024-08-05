import { ServerSession } from '../session/ServerSession.js';
import { ISpriteBaseSession } from '../session/Session.js';
import { SpriteDatabase } from '../database/SpriteDatabase.js';
import {
  ArcadeServerInformation,
  ArcadeServerInformationLevel,
  ISpriteCreateArcadeUser,
  Server,
  SpriteArcadeServerEvents
} from './Server.js';

/**
 * Methods for interact with an ArcadeDB server. Manage databases, users, etc.
 * @param {ISpriteRestClientConnectionParameters} parameters Connection details to access the server with.
 * @example
 *
 * const client = new SpriteServer({
 *   username: 'aUser',
 *   password: 'aPassword',
 *   address: 'http://localhost:2480',
 * });
 *
 * async function serverReadyExample() {
 *   try {
 *     const ready = await client.serverReady();
 *     if (ready) {
 *       console.log(ready);
 *       // true;
 *     }
 *   } catch (error) {
 *     throw new Error(
 *       'An error occurred while running example.',
 *       { cause: error }
 *     );
 *   }
 * }
 *
 * serverReadyExample();
 */
class SpriteServer {
  private _session: ServerSession;
  constructor(parameters: ServerSession);
  constructor(parameters: ISpriteBaseSession);
  constructor(parameters: ISpriteBaseSession | ServerSession) {
    if (parameters instanceof ServerSession) {
      this._session = parameters;
    } else {
      this._session = new ServerSession(parameters);
    }
  }
  /**
   * Returns a `boolean` value indicating if the ArcadeDB server is ready.\
   * Useful for remote monitoring of server readiness.
   * @returns `true` if the server is ready, otherwise `false`.
   * @example
   *
   * const client = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function serverReadyExample() {
   *   try {
   *     const ready = await client.serverReady();
   *     if (ready) {
   *       console.log(ready);
   *       // true;
   *     }
   *   } catch (error) {
   *     throw new Error(
   *       'An error occurred while running example.',
   *       { cause: error }
   *     );
   *   }
   * }
   *
   * serverReadyExample();
   */
  serverReady = async (): Promise<boolean> => Server.serverReady(this._session);
  /**
   * When you close a database in ArcadeDB, it:
   * 1. Frees up resources on the server: The database instance is released, and the associated resources, such as memory, threads, and file handles, are returned to the system. This helps to reduce the server's memory footprint and free up resources for other tasks.
   * 2. Releases it from RAM: The database instance is removed from the server's RAM, which means that the database's metadata, schema, and cached data are no longer stored in memory. This helps to reduce memory usage.
   * 3. Prevents further operations: Once the database is closed, users can no longer perform operations on the database, such as executing queries, creating new records, or modifying existing data. The database is effectively "offline" until it's reopened.
   *
   * @param databaseName The name of the database to close.
   * @returns The response from the server.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function closeDatabaseExample(databaseName: string) {
   *   try {
   *     const closed = await server.closeDatabase(databaseName);
   *     console.log(closed);
   *     // true
   *   } catch (error) {
   *     // manage error conditions
   *     console.error(error);
   *   }
   * };
   *
   * closeDatabaseExample('aDatabase');
   */
  closeDatabase = async (databaseName: string): Promise<boolean> =>
    Server.closeDatabase(this._session, databaseName);
  /**
   *
   * When you "open" a database in ArcadeDB, it means you're creating an instance of the database in memory, allocating resources, and making the database available for operations. Here's what happens when you open a database:
   *
   * 1. Create a new database instance: A new database instance is created in memory, which includes the database's metadata, schema, and cached data. This instance is used to manage the database's resources and provide access to the data.
   * 2. Allocate resources: The database instance allocates the necessary resources, such as memory, threads, and file handles, to support the database's operations. This ensures that the database has the necessary resources to handle incoming requests.
   * 3. Load database metadata and schema: The database's metadata and schema are loaded into memory, which includes information about the database's structure, indexes, and relationships.
   * 4. Connect to the underlying storage: The database instance establishes a connection to the underlying storage, such as disk storage, to access the database files.
   * 5. Make the database available for operations: The database is now available for users to perform operations, such as executing queries, creating new records, or modifying existing data.
   *
   * @param databaseName The name of the database to open.
   * @returns The response from the server.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function openDatabaseExample(databaseName: string) {
   *   try {
   *     const open = await server.openDatabase(databaseName);
   *     console.log(open);
   *     // true
   *   } catch (error) {
   *     // handle errors
   *     console.error(error);
   *   }
   * };
   *
   * openDatabaseExample('aDatabase');
   */
  openDatabase = async (databaseName: string): Promise<boolean> =>
    Server.openDatabase(this._session, databaseName);
  /**
   * Returns a `SpriteDatabase` instance for the supplied `databaseName`,
   * using the authorization details of the `SpriteServer` instance.
   * @param databaseName The name of the database to create a client for.
   * @returns An instance of `SpriteDatabase`.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function databaseExample() {
   *   try {
   *     const database = await server.database('aDatabase');
   *     // returns an instance of SpriteDatabase
   *     console.log(database.name);
   *   } catch (error) {
   *     // handle errors
   *     console.error(error);
   *   }
   * };
   *
   * databaseExample();
   */
  database = (databaseName: string): SpriteDatabase =>
    Server.database(this._session, databaseName);
  /**
   * Sends a command to the ArcadeDB server and returns the response.
   *
   * This method provides a way to execute arbitrary commands on the server, such as creating databases, executing queries, or performing administrative tasks.
   *
   * @param command The command to send to the server, such as `CREATE DATABASE aDatabase`. The command string should be a valid ArcadeDB command, and it's case-sensitive.
   * @returns The response from the server, simplified from the raw JSON response. The response object will contain the `result` property, which can be a boolean value (e.g., `OK`), a string, or an object. Other properties may include `user`, `version`, and `serverName`.
   * @throws If the command fails to execute, an error will be thrown with a message describing the problem. The error object will contain a `cause` property with the underlying error.
   *
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function commandExample(databaseName: string) {
   *   try {
   *     const response = await server.command(`CREATE DATABASE ${databaseName}`);
   *     console.log(response);
   *     // {
   *     //   user: 'aUser',
   *     //   version: '24.x.x',
   *     //   serverName: 'ArcadeDB_0',
   *     //   result: 'ok'
   *     // }
   *   } catch (error) {
   *     // Will throw an error for conditions such as:
   *     // Invalid credentials, Database Already Exists, etc.
   *     console.error(error);
   *     // {
   *     //   message: 'Encountered an error when sending a command to the server.',
   *     //   cause: Error: Invalid credentials
   *     // }
   *   }
   * }
   *
   * commandExample('aDatabase');
   */
  command = async <T>(command: string): Promise<T> =>
    Server.command(this._session, command);
  /**
   * Connects this server to a cluster with `address`.
   * @param address The address of the cluster to connect (i.e. 192.168.0.1)
   * @returns The response from the server.
   * @throws `Error` if the cluster could not be connected.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function connectClusterExample(address: string) {
   *   try {
   *     const connected = await server.connectCluster(address);
   *     console.log(connected);
   *     // true
   *   } catch (error) {
   *     console.log(error);
   *     // handle error conditions
   *   }
   * }
   *
   * connectClusterExample('192.168.0.1');
   */
  connectCluster = async (address: string): Promise<boolean> =>
    Server.connectCluster(this._session, address);
  /**
   * Create a database
   * @param databaseName The name of the database to create.
   * @returns An instance of `SpriteDatabase`, targeting the created database.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function createDatabaseExample(databaseName: string) {
   *   try {
   *     const database = await server.createDatabase(databaseName);
   *     console.log(database.name);
   *     // 'aDatabase'
   *   } catch (error) {
   *     console.log(error);
   *     // handle error conditions
   *   }
   * }
   *
   * createDatabaseExample('aDatabase');
   */
  createDatabase = async (databaseName: string) =>
    Server.createDatabase(this._session, databaseName);
  /**
   * Create a user. `username`, `password`, and access controls to multiple databases
   * can be established using the `databases` property of the input parameters.
   * The `databases` object uses 'groups' to grant access controls. Assigning
   * a user to groups within a specific database grants them the permissions associated
   * with those groups for a particular database.
   * @param username The `username` of the user to create.
   * @param password The `password` of the user to create.
   * @param databases An object of databases to add the user to, and their permissions (groups they belong to).
   * @returns `true` if the user was created successfully.
   * @throws `Error` if the user could not be created.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function createUserExample(details: ISpriteCreateArcadeUser) {
   *   try {
   *     const created = await server.createUser(details);
   *     console.log(created);
   *     // true
   *   } catch (error) {
   *     console.error(error);
   *     // handle error conditions
   *   }
   * }
   *
   * createUserExample({
   *   username: 'myUsername',
   *   password: 'myPassword',
   *   databases: {
   *     "FirstDatabase": "admin"
   *     "SecondDatabase": "user"
   *   }
   * });
   */
  createUser = async (params: ISpriteCreateArcadeUser): Promise<boolean> =>
    Server.createUser(this._session, params);
  /**
   * Disconnects the server from the cluster.
   * @returns The response from the server.
   * @throws `Error` if the cluster could not be disconnected.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function disconnectClusterExample() {
   *   try {
   *     const disconnected = await server.disconnectCluster();
   *     console.log(disconnected);
   *     // true
   *   } catch (error) {
   *     console.error(error);
   *     // handle error condition
   *   }
   * }
   *
   * disconnectClusterExample();
   */
  disconnectCluster = async (): Promise<boolean> =>
    Server.disconnectCluster(this._session);
  /**
   * Drop a database
   * @param databaseName The name of the database to drop.
   * @returns `true` if successfully dropped.
   * @throws `Error` if the database could not be dropped.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function dropDatabaseExample(databaseName: string) {
   *   try {
   *     const dropped = await server.dropDatabase(databaseName);
   *     console.log(dropped);
   *     // true
   *   } catch (error) {
   *     console.error(error);
   *     // handle error condition
   *   }
   * }
   *
   * dropDatabaseExample('aDatabase');
   */
  dropDatabase = async (databaseName: string): Promise<boolean> =>
    Server.dropDatabase(this._session, databaseName);
  /**
   * Drop a user from the ArcadeDB server.
   * @param username The `username` of the user to drop from the ArcadeDB server.
   * @returns `true` if the user was successfully dropped.
   * @throws `Error` if the user could not be dropped.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function dropUserExample(username: string) {
   *   try {
   *     const dropped = await server.dropUser(username);
   *     console.log(dropped);
   *     // true
   *   } catch (error) {
   *     console.error(error);
   *     // handle error condition
   *   }
   * }
   *
   * dropUserExample('aUser');
   */
  dropUser = async (username: string): Promise<boolean> =>
    Server.dropUser(this._session, username);
  /**
   * Retrieves a list of server events, optionally a filename of the form
   * `server-event-log-yyyymmdd-HHMMSS.INDEX.jsonl` (where INDEX is a integer, i.e. 0)
   * can be given to retrieve older event logs.
   * @returns An object containing he server events from the server, and filenames of the associated logs.
   * @throws `Error` if there was a problem fetching the event logs.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function getServerEventsExample() {
   *   try {
   *     const events = await server.getServerEvents();
   *     console.log(events);
   *     // {
   *     //    events: [
   *     //      {
   *     //        "time":"2024-01-30 06:37:20.325",
   *     //        "type":"INFO","component":"Server",
   *     //        "message":"ArcadeDB Server started in \\u0027development\\u0027 mode (CPUs\\u003d8 MAXRAM\\u003d3.84GB)"}]
   *     //      }
   *     //    ],
   *     //    files: [
   *     //      "server-event-log-20240205-060106.13.jsonl",
   *     //      "server-event-log-20240204-185020.12.jsonl",
   *     //      "server-event-log-20240204-063235.11.jsonl",
   *     //      "server-event-log-20240131-205254.10.jsonl",
   *     //      "server-event-log-20240130-133802.9.jsonl"
   *     //    ]
   *     // }
   *   } catch (error) {
   *     console.error(error);
   *     // handle error condition
   *   }
   * }
   *
   * getServerEventsExample();
   */
  getEvents = async (): Promise<SpriteArcadeServerEvents> =>
    Server.getEvents(this._session);
  /**
   * Returns the current configuration.
   * @param mode The level of informatio detail to return.
   * * `basic` returns minimal server information
   * * `default` returns full server configuration (default value when no parameter is given)
   * * `cluster` returns the cluster layout
   * @returns The response from the server.
   * @throws `Error` if the information could not be retrieved.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function getInformationExample(mode: ArcadeServerInformationLevel) {
   *   try {
   *     const information = await sprite.getInformation(mode);
   *     console.log(information);
   *     // {
   *     //   user: 'aUser',
   *     //   version: '24.x.x',
   *     //   serverName: 'ArcadeDB_0'
   *     // }
   *   } catch (error) {
   *     console.error(error);
   *     // handle error condition
   *   }
   * }
   *
   * getInformationExample('basic');
   */
  getInformation = async <M extends ArcadeServerInformationLevel = 'default'>(
    mode?: M
  ): Promise<ArcadeServerInformation<M>> =>
    Server.getInformation(this._session, mode);
  /**
   * Returns a list of database names that are present on the server.
   * @returns {Promise<Array<string>>} A list (array) of database names present on the server.
   * @throws `Error` if the database list could not be retrieved.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function listDatabasesExample() {
   *   try {
   *     const list = await sprite.listDatabases();
   *     console.log(list);
   *     // [ 'databaseName' ]
   *   } catch (error) {
   *     console.error(error);
   *     // handle error condition
   *   }
   * }
   *
   * listDatabasesExample();
   */
  listDatabases = async (): Promise<Array<string>> =>
    Server.listDatabases(this._session);
  /**
   * Gracefully shutdown the server.\
   * `TODO:` This works, in that it does shutdown the server, but the fetch throws
   * before it resolves, guessing because the server is shutting down. A CURL, however,
   * returns an empty `204` response as the documentation indicates.
   * @returns `true` if the server is successfully shutdown.
   * @throws `Error` if there is a problem attempting the shutdown.
   * @example
   *
   * const server = new SpriteServer({
   *   username: 'aUser',
   *   password: 'aPassword',
   *   address: 'http://localhost:2480',
   * });
   *
   * async function shutdownExample() {
   *   try {
   *     const shutdown = await server.shutdown();
   *     console.log(shutdown);
   *   } catch (error) {
   *     console.error(error);
   *     // handle error condition
   *   }
   * }
   *
   * shutdownExample();
   */
  shutdown = async (): Promise<boolean> => Server.shutdown(this._session);
}

export { SpriteServer };
