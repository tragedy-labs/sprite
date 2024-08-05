import { ArcadeDatabaseError } from '../errors/ArcadeDatabaseError.js';

/**
 * Return the JSON from a REST Response from ArcadeDB.
 */
class JsonResponse {
  /**
   * Await the response from the server, and handle it as JSON.
   * @param response The `fetch` {@link https://developer.mozilla.org/en-US/docs/Web/API/Response `Response`} object.
   * @returns The `result` property from the JSON supplied from ArcadeDB.
   * @throws If ArcadeDB returns an exception.
   */
  static async parse<T>(response: Response): Promise<T> {
    const json = await response.json();
    if (Object.hasOwn(json, 'result')) {
      return json.result;
    } else if (Object.hasOwn(json, 'error')) {
      throw new ArcadeDatabaseError(json);
    } else {
      return json;
    }
  }
}

export { JsonResponse };
