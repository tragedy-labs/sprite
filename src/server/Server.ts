import { ServerSession } from '../session/ServerSession.js';
import { Rest } from '../rest/Rest.js';
import { Routes } from './routes.js';
import { SpriteDatabase } from '../database/SpriteDatabase.js';
import { ArcadeValidation } from '../validation/ArcadeValidation.js';
import {
  type IArcadeCreateUser,
  CLOSE_DATABASE,
  CONNECT_CLUSTER,
  CREATE_DATABASE,
  CREATE_USER,
  DISCONNECT_CLUSTER,
  DROP_DATABASE,
  DROP_USER,
  GET_SERVER_EVENTS,
  OPEN_DATABASE,
  SHUTDOWN
} from './commands/index.js';
import { ArcadeFetchError } from '../errors/ArcadeFetchError.js';

enum CommandResponse {
  OK = 'ok'
}

/**
 * The level of detail that should be returned for a
 * `SpriteServer.getInformation()` request
 * @default 'default'
 */
export type ArcadeServerInformationLevel = 'basic' | 'default' | 'cluster';

/**
 * The metadata returned from the server on every operation.
 */
export type ArcadeServerBasicInformation = {
  /** The user who performed the operation */
  user: string;
  /** The version of ArcadeDB on the server */
  version: string;
  /** The name of the server */
  serverName: string;
};

export type ArcadeServerInfoSetting = {
  key: string;
  value: unknown;
  description: string;
  overridden: boolean;
  default: unknown;
};

export type ArcadeServerInfoMetrics = {
  meters: object;
  events: { errors: number; warnings: number; info: number; hints: number };
  profiler: {
    readCacheUsed: object;
    writeCacheUsed: object;
    cacheMax: object;
    pagesRead: object;
    pagesWritten: object;
    pagesReadSize: object;
    pagesWrittenSize: object;
    pageFlushQueueLength: object;
    asyncQueueLength: object;
    asyncParallelLevel: object;
    pageCacheHits: object;
    pageCacheMiss: object;
    totalOpenFiles: object;
    maxOpenFiles: object;
    walPagesWritten: object;
    walBytesWritten: object;
    walTotalFiles: 8;
    concurrentModificationExceptions: object;
    txCommits: object;
    txRollbacks: object;
    createRecord: object;
    readRecord: object;
    updateRecord: object;
    deleteRecord: object;
    queries: object;
    commands: object;
    scanType: object;
    scanBucket: object;
    iterateType: object;
    iterateBucket: object;
    countType: object;
    countBucket: object;
    evictionRuns: object;
    pagesEvicted: object;
    readCachePages: object;
    writeCachePages: object;
    indexCompactions: object;
    diskFreeSpace: object;
    diskTotalSpace: object;
    diskFreeSpacePerc: object;
    gcTime: object;
    ramHeapUsed: object;
    ramHeapMax: object;
    ramHeapAvailablePerc: object;
    ramOsUsed: object;
    ramOsTotal: object;
    cpuLoad: object;
    jvmSafePointTime: object;
    jvmSafePointCount: object;
    jvmAvgSafePointTime: object;
    totalDatabases: object;
    cpuCores: object;
    configuration: object;
  };
};

export type ArcadeServerDefaultInformation = ArcadeServerBasicInformation & {
  metrics: ArcadeServerInfoMetrics;
  settings: ArcadeServerInfoSetting[];
};

export type ArcadeServerClusterInformation = object;

export type ArcadeServerInformation<T extends ArcadeServerInformationLevel> = {
  basic: ArcadeServerBasicInformation;
  default: ArcadeServerDefaultInformation;
  cluster: ArcadeServerClusterInformation;
}[T];

/**
 * Parameters necessary to create a user in ArcadeDB
 */
export interface ISpriteCreateArcadeUser {
  /** The username of the database user to create */
  username: string;
  /** The password of the database user to create */
  password: string;
  /**
   * An object containing databases to add the user to, and the
   * permisisions to grant them \
   * (i.e. `{ myDatabase: "ADMIN" }`)
   */
  databases: Record<string, string>;
}

/** Describes an event on the ArcadeDB server */
export type SpriteArcadeServerEvent = {
  time: string;
  type: string;
  message: string;
};

/** The ArcadeDB Server Events Log */
export type SpriteArcadeServerEvents = {
  /** The list of server events */
  events: SpriteArcadeServerEvent[];
  /** Event log files */
  files: string[];
};

/**
 * Static methods to interact with an ArcadeDB server.
 */
class Server {
  /**
   * Returns a `boolean` value indicating if the ArcadeDB server is ready.\
   * Useful for remote monitoring of server readiness.
   * @param session The session to use to check the server status.
   * @returns `true` if the server is ready, otherwise `false`.
   * @throws `Error` if the server status could not be checked.
   */
  public static serverReady = async (
    session: ServerSession
  ): Promise<boolean> => {
    try {
      const response = await Rest.get(Routes.READY, session);
      return response.status === 204;
    } catch (error) {
      throw new Error('Unable to check the server status.', { cause: error });
    }
  };
  /**
   * Close a database on the ArcadeDB server.
   * @param session The session to use to close the database.
   * @param databaseName The name of the database to close.
   * @returns The response from the server.
   * @throws `Error` if the database could not be closed.
   */
  public static closeDatabase = async (
    session: ServerSession,
    databaseName: string
  ): Promise<boolean> => {
    try {
      return await this._booleanCommand(session, CLOSE_DATABASE(databaseName));
    } catch (error) {
      throw new Error(`Unabled to close database "${databaseName}`, {
        cause: error
      });
    }
  };
  /**
   * Open a database on the ArcadeDB server
   * @param session The session to use to open the database.
   * @param databaseName The name of the database to open.
   * @returns `true` if the database was opened.
   * @throws `Error` if the database could not be opened.
   */
  public static openDatabase = async (
    session: ServerSession,
    databaseName: string
  ): Promise<boolean> => {
    try {
      return await this._booleanCommand(session, OPEN_DATABASE(databaseName));
    } catch (error) {
      throw new Error(`Unabled to open database "${databaseName}`, {
        cause: error
      });
    }
  };
  /**
   * Returns an `SpriteDatabase` instance for the supplied `databaseName`,
   * using the authorization details of the `Session` instance.
   * @param session The session to use to create the database client.
   * @param databaseName The name of the database to create a client for.
   * @returns An instance of `SpriteDatabase`.
   * @throws `Error` if the database could not be created.
   */
  public static database = (
    session: ServerSession,
    databaseName: string
  ): SpriteDatabase => new SpriteDatabase({ session: session, databaseName });
  /**
   * Sends a command to the ArcadeDB server and returns the response.
   * @param session The session to use to send the command.
   * @param command The command to send to the server.
   * @returns The response from the server.
   * @throws `Error` if the command could not be executed.
   */
  public static command = async <T>(
    session: ServerSession,
    command: string
  ): Promise<T> => {
    try {
      return await Rest.postJson(
        Routes.COMMAND,
        JSON.stringify({
          command
        }),
        session
      );
    } catch (error) {
      throw new Error(
        `There was an error when attemping to execute a command on the ArcadeDB Server. See aggregate error for details.`,
        { cause: error }
      );
    }
  };
  /**
   * Internal method for sending commands to the server in which a JSON response
   * containing an `ok` value in the `result` property is expected. `ok` is then
   * returned as a simple boolean (`true`) value
   * @param session The session to use to send the command.
   * @param command The [command](https://docs.arcadedb.com/#HTTP-ServerCommand) to send to the server, such as `CREATE DATABASE`.
   * @returns `true` if the command was successful.
   * @throws `Error` if the command could not be executed.
   */
  private static _booleanCommand = async (
    session: ServerSession,
    command: string
  ): Promise<boolean> => {
    const response = await this.command(session, command);
    if (response === CommandResponse.OK) {
      return true;
    } else {
      return false;
    }
  };
  /**
   * Connects this server to a cluster with `address`.
   * @param session The session to use to connect to the cluster.
   * @param address The address of the cluster to connect (i.e. 192.168.0.1)
   * @returns The response from the server.
   * @throws `Error` if the cluster could not be connected.
   */
  public static connectCluster = async (
    session: ServerSession,
    address: string
  ): Promise<boolean> => {
    try {
      return await this._booleanCommand(session, CONNECT_CLUSTER(address));
    } catch (error) {
      throw new Error(
        `There was an error attempting to connect cluster at: ${address}`,
        { cause: error }
      );
    }
  };
  /**
   * Create a database
   * @param session The session to use to create the database.
   * @param databaseName The name of the database to create.
   * @returns An instance of `SpriteDatabase`, targeting the created database.
   * @throws `Error` if the database could not be created.
   */
  public static createDatabase = async (
    session: ServerSession,
    databaseName: string
  ) => {
    try {
      ArcadeValidation.databaseName(databaseName);
      const created = await this._booleanCommand(
        session,
        CREATE_DATABASE(databaseName)
      );
      if (created) {
        return this.database(session, databaseName);
      } else {
        throw new Error(
          `Received an unexpected response from the server when attempting to create database "${databaseName}"`
        );
      }
    } catch (error) {
      throw new Error(`Failed to create database "${databaseName}".`, {
        cause: error
      });
    }
  };
  /**
   * Create a user. `username`, `password`, and access controls to multiple databases
   * can be established using the `databases` property of the input parameters.
   * @param session The session to use to create the user.
   * @param username The `username` of the user to create.
   * @param password The `password` of the user to create.
   * @param databases An object of databases to add the user to, and their permissions (groups they belong to).
   * @returns `true` if the user was created successfully.
   * @throws `Error` if the user could not be created.
   */
  public static createUser = async (
    session: ServerSession,
    params: ISpriteCreateArcadeUser
  ): Promise<boolean> => {
    try {
      if (
        !Object.prototype.hasOwnProperty.call(params, 'username') ||
        !Object.prototype.hasOwnProperty.call(params, 'password') ||
        !Object.prototype.hasOwnProperty.call(params, 'databases')
      ) {
        throw new TypeError(
          `The object supplied as an argument must contain 'username', 'password', and 'databases' properties. Received: ${JSON.stringify(
            params
          )}`
        );
      }

      // TODO:
      // ArcadeDB by default requires 4 character minimum length for passwords.
      // The problem is they return a 403 if it's under 4 characters. That could
      // be confusing because it isn't really explained and could be confused with a
      // 403 for invalid credentials from user error establishing authorization
      // through the client. Further question: the manual indicates that it's a 8
      // character minimum, but in practice it's 4 (for non-root users)
      if (!(params.password.length > 3)) {
        throw new TypeError(
          `The password must be at least 4 characters in length, received: ${params.password}, which is ${params.password.length} characters long.`
        );
      }

      // ArcadeDB uses a 'name' property for the user account.
      // This is fine if all you are collecting is a 'username',
      // but in many use cases a user's 'name' and their 'username'
      // will be different fields, and to avoid complication for
      // end users, we are collecting 'username' and manually
      // changing it to 'name' as arcadedb expects.
      const expectedParameters: IArcadeCreateUser = {
        name: params.username,
        password: params.password,
        databases: params.databases
      };

      return await this._booleanCommand(
        session,
        CREATE_USER(expectedParameters)
      );
    } catch (error) {
      const databaseListString = Object.keys(params.databases).join(', ');
      throw new Error(
        `Could not create user ${params.username}. In database(s): ${databaseListString}`,
        { cause: error }
      );
    }
  };
  /**
   * Disconnects the server from the cluster.
   * @param session The session to use to disconnect from the cluster.
   * @returns The response from the server.
   * @throws `Error` if the cluster could not be disconnected.
   */
  public static disconnectCluster = async (
    session: ServerSession
  ): Promise<boolean> => {
    try {
      return await this._booleanCommand(session, DISCONNECT_CLUSTER);
    } catch (error) {
      throw new Error(
        'There was an error when attempting to disconnect from the cluster.',
        { cause: error }
      );
    }
  };
  /**
   * Drop a database
   * @param session The session to use to drop the database.
   * @param databaseName The name of the database to drop.
   * @returns `true` if successfully dropped.
   * @throws `Error` if the database could not be dropped.
   */
  public static dropDatabase = async (
    session: ServerSession,
    databaseName: string
  ): Promise<boolean> => {
    try {
      return await this._booleanCommand(session, DROP_DATABASE(databaseName));
    } catch (error) {
      throw new Error(`Failed to drop database.`, {
        cause: error
      });
    }
  };
  /**
   * Drop a user from the ArcadeDB server.
   * @param session The session to use to drop the user.
   * @param username The `username` of the user to drop from the ArcadeDB server.
   * @returns `true` if the user was successfully dropped.
   * @throws `Error` if the user could not be dropped.
   */
  public static dropUser = async (
    session: ServerSession,
    username: string
  ): Promise<boolean> => {
    try {
      return await this._booleanCommand(session, DROP_USER(username));
    } catch (error) {
      throw new Error(`Could not drop user ${username}.`, { cause: error });
    }
  };
  /**
   * Retrieves a list of server events, optionally a filename of the form
   * `server-event-log-yyyymmdd-HHMMSS.INDEX.jsonl` (where INDEX is a integer, i.e. 0)
   * can be given to retrieve older event logs.
   * @param session The session to use to retrieve the server events.
   * @returns An object containing he server events from the server, and filenames of the associated logs.
   * @throws `Error` if there was a problem fetching the event logs.
   */
  public static getEvents = async (
    session: ServerSession
  ): Promise<SpriteArcadeServerEvents> => {
    try {
      return await this.command<SpriteArcadeServerEvents>(
        session,
        GET_SERVER_EVENTS
      );
    } catch (error) {
      throw new Error(
        `There was an error when attempting to retrieve ArcadeDB server event logs.`,
        { cause: error }
      );
    }
  };
  /**
   * Returns the current configuration.
   * @param session The session to use to retrieve the configuration.
   * @param mode The level of informatio detail to return.
   * * `basic` returns minimal server information
   * * `default` returns full server configuration (default value when no parameter is given)
   * * `cluster` returns the cluster layout
   * @returns The server information.
   * @throws `Error` if the server information could not be retrieved.
   */
  public static getInformation = async <
    M extends ArcadeServerInformationLevel = 'default'
  >(
    session: ServerSession,
    mode?: M
  ): Promise<ArcadeServerInformation<M>> => {
    try {
      // TODO: There should be a method to modify the URL
      // in the Rest class with parameters like this, for now this
      // works
      // TODO: The repetition of the RequestInit is less
      // than ideal
      const response = await fetch(
        `${session.address}/api/v1/server?mode=${mode || 'default'}`,
        {
          method: 'GET',
          headers: session.headers,
          keepalive: true
        }
      );

      switch (response.status) {
        case 200: {
          const jsonResponse = await response.json();
          return jsonResponse.result;
        }
        case 403:
        case 404:
        case 500:
        default:
          throw new ArcadeFetchError(response);
      }
    } catch (error) {
      throw new Error(`Could not get ArcadeDB server information.`, {
        cause: error
      });
    }
  };
  /**
   * Returns a list of database names that are present on the server.
   * @param session The session to use to retrieve the database list.
   * @returns {Promise<Array<string>>} A list (array) of database names present on the server.
   * @throws `Error` if the database list could not be retrieved.
   */
  public static listDatabases = async (
    session: ServerSession
  ): Promise<Array<string>> => {
    try {
      return await Rest.getJson(Routes.DATABASES, session);
    } catch (error) {
      throw new Error(
        'Encountered an error when attemping to fetch list of databases from the server.',
        { cause: error }
      );
    }
  };
  /**
   * Gracefully shutdown the server.\
   * `TODO:` This works, in that it does shutdown the server, but the fetch throws
   * before it resolves, guessing because the server is shutting down. A CURL, however,
   * returns an empty `204` response as the documentation indicates.
   * @param session The session to use to shutdown the server.
   * @returns `true` if the server is successfully shutdown.
   * @throws `Error` if there is a problem attempting the shutdown.
   */
  public static shutdown = async (session: ServerSession): Promise<boolean> => {
    try {
      const response = await Rest.post(
        Routes.COMMAND,
        { command: SHUTDOWN },
        session
      );
      return response.status === 204;
    } catch (error) {
      throw new Error(
        `There was an error when attempting to shutdown the ArcadeDB server at.`,
        { cause: error }
      );
    }
  };
}

export { Server };
