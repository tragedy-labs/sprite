/**
 * The parameters required to connect to the ArcadeDB server.
 */
export interface ISpriteAuthParameters {
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

export class Auth {
  /**
   * Formats the connection parameters into a configuration object that can be used to interact with the ArcadeDB server.
   * @param username The username
   * @param password The password
   * @returns A base64 encoded auth string and additional formatting to use in request headers.
   * @throws `Error` if valid parameter types are not received, or something else causes an error when building the object.
   */
  public static basic = (username: string, password: string): string => {
    try {
      const base64EncodedCredentials = this.encodeCredentials(
        username,
        password
      );
      return `Basic ${base64EncodedCredentials}`;
    } catch (error) {
      throw new Error('There was an error building the authorization header', {
        cause: error
      });
    }
  };
  /**
   * Base64 Encodes the `username` and `password` for use in the `Authorization` header.
   * This is a cross-platform solution for nodejs, or browser apps.
   * `btoa()` is marked as deprecated in nodejs, so this solution avoids deprecation
   * warnings.
   * @param username The string username to encode.
   * @param password The string password to encode.
   * @returns The base64 encoded credentials.
   * @example
   * const encoded = await this.encodeCredentials("root", "password");
   * console.log(encoded);
   * // "cm9vdDpwYXNzd29yZA=="
   */
  public static encodeCredentials = (
    username: string,
    password: string
  ): string => {
    if (!username) {
      throw new Error('A username is required to encode credentials.');
    }
    if (!password) {
      throw new Error('A password is required to encode credentials.');
    }
    const credentials = `${username}:${password}`;
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      return window.btoa(credentials);
    } else if (typeof Buffer === 'function') {
      return Buffer.from(credentials, 'utf-8').toString('base64');
    } else {
      throw new Error(
        'Could not determine the encoding function to use given the current JavaScript environment.'
      );
    }
  };
}
