/**
 * The parameters required to connect to the ArcadeDB server.
 */
export interface ISpriteRestClientConnectionParameters {
  /** The URL (including port) of the database. (i.e. http://localhost:2480/) */
  address: string;
  /** The username to connect to the database. (i.e. "root") */
  username: string;
  /** The password to connect to the database. (i.e. "myPassword") */
  password: string;
}

/**
 * Stores the details of the server connection for use in
 * fetch requests with the ArcadeDB Server.
 */
export interface ISpriteConnection {
  /** The URL (including port) of the database. (i.e. http://localhost:2480/) */
  address: string;
  /** The headers of the Fetch request */
  headers: {
    'Content-Type': string;
    Authorization: string;
  };
}
