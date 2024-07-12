import { ArcadeDatabaseError } from './errors/ArcadeDatabaseError.js';
import { ArcadeFetchError } from './errors/ArcadeFetchError.js';
import { endpoints } from './endpoints/server.js';
import {
  ISpriteConnection,
  ISpriteRestClientConnectionParameters
} from './types/client.js';

/**
 * Handles the fetch implementation and formatting of credentials.
 */
class SpriteRestClient {
  connection: ISpriteConnection;
  constructor(parameters: ISpriteRestClientConnectionParameters) {
    this.connection = this.getConnection(parameters);
  }
  /**
   * Formats the connection parameters into a configuration object that can be used to interact with the ArcadeDB server.
   * @param params The username, password, and address of the database.
   * @returns The configuration necessary to have REST interactions with the ArcadeDB server.
   * @throws `Error` if valid parameter types are not received, or something else causes an error when building the object.
   */
  getConnection = (
    params: ISpriteRestClientConnectionParameters
  ): ISpriteConnection => {
    try {
      const base64EncodedCredentials = this.encodeCredentials(
        params.username,
        params.password
      );
      return {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${base64EncodedCredentials}`
        },
        address: params.address
      };
    } catch (error) {
      throw new Error('There was an error building the connection object.', {
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
  encodeCredentials = (username: string, password: string): string => {
    // TODO: I have not tried this is Deno or a browser environment.
    try {
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
    } catch (error) {
      throw new Error('Could not base64 encode the credentials.', {
        cause: error
      });
    }
  };
  /**
   * A convenience method for making REST calls to the ArcadeDB server.\
   * It allows for relative paths to be used as endpoints, and automatically appends
   * the server address and the `Authorization` header to the request.\
   * It also handles the response from the server, throwing an error if the server returns
   * a non-200 status code.
   * @param endpoint The relative path to the endpoint (i.e. /api/v1/ready)
   * @param options The request options for the fetch api.
   * @returns The fetch response
   */
  fetch = async (
    endpoint: string,
    { method = 'GET', body, headers }: RequestInit = {}
  ): Promise<Response> => {
    const response = await fetch(`${this.connection.address}${endpoint}`, {
      method,
      headers: headers
        ? {
            ...this.connection.headers,
            ...headers
          }
        : this.connection.headers,
      body
    });
    switch (response.status) {
      case 403:
      case 404:
        throw new ArcadeFetchError(response);
      default:
        return response;
    }
  };
  /**
   * Fetch API wrapper for making REST calls to the ArcadeDB server and returning a
   * JavaScript object of type `<T>`. This method typically returns the `result` property
   * of the response object from ArcadeDB, but may also throw an `Error` depending on the
   * outcome of the database operation.
   * @param endpoint
   * @param requestParameters
   * @returns The response from the server, typically the `result` property of the response.
   * @example
   * const response = await sprite.arcadeJson<boolean>(endpoint, parameters);
   * console.log(response);
   * // true
   */
  fetchJson = async <T>(
    endpoint: string,
    parameters?: RequestInit
  ): Promise<T> => {
    const response = await this.fetch(endpoint, parameters);
    const json = await response.json();
    if ('result' in json) {
      return json.result;
    } else if ('error' in json) {
      throw new ArcadeDatabaseError(json);
    } else {
      return json;
    }
  };
  /**
   * Issue a command to the server.
   * @param command The command to perform on the server.
   * @returns The response from the server
   * @throws If the command could not be executed
   */
  serverCommand = async <T>(command: string): Promise<T> => {
    try {
      const body = JSON.stringify({
        command
      });
      return await this.fetchJson<T>(endpoints.command, {
        method: 'POST',
        body
      });
    } catch (error) {
      throw new Error(
        `Encountered an error when sending a command to the server.`,
        { cause: error }
      );
    }
  };
}

export { SpriteRestClient };
