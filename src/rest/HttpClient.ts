import { ArcadeFetchError } from '../errors/ArcadeFetchError.js';
import { SpriteHeadersInit } from './SpriteHeaders.js';

export interface DatabaseSession {
  address: string;
  auth: string;
  databaseName: string;
  headers: HeadersInit;
}

export interface SpriteRequestInit extends RequestInit {
  headers: SpriteHeadersInit;
}

/*
 * NOTE:
 * It seems a bit redundant to have this class, but it's a good way to encapsulate
 * the HTTP request logic in one place. Additionally, this likely a stub for a
 * more complex implementation.
 */

/**
 * Utility class for making HTTP requests to the ArcadeDB server.
 */
class HttpClient {
  /**
   * Make a request to the server.
   * @param session The `SpriteDatabaseSession` to target in the request.
   * @param relativeEndpoint The relative {@link https://docs.arcadedb.com/#HTTP-API endpoint} for the request, if it's a database endpoint it includes the database name. Any composition must be handled by the calling method.
   * @param requestInit A `fetch` `RequestInit` object: `{ methods, headers, body }`.
   * @returns
   */
  public static async request(
    endpoint: string,
    requestInit: SpriteRequestInit
  ): Promise<Response> {
    try {
      const response: Response = await fetch(endpoint, requestInit);
      return this.handleResponse(response);
    } catch (error) {
      if (error instanceof ArcadeFetchError) {
        throw error;
      } else {
        throw new Error(
          'There was a problem fetching from the supplied database server. Check the address and try again.'
        );
      }
    }
  }
  /**
   * Handles error handling of the response, or returns the response if nothing went wrong.
   * @param response
   * @returns
   * @throws If there is a {@link https://httpstatuses.io/403 `403`} or {@link https://httpstatuses.io/404 `404`} error.
   * @see {@link ArcadeFetchError}
   */
  private static handleResponse(response: Response) {
    switch (response.status) {
      case 403:
      case 404:
        throw new ArcadeFetchError(response);
      default:
        return response;
    }
  }
}

export { HttpClient };
