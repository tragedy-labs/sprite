import { Transaction } from '@/database/transaction/index.js';
import { ArcadeBasicHeadersInit, ArcadeHeaders } from '@/rest/ArcadeHeaders.js';
import { HttpClient } from '@/rest/HttpClient.js';
import { JsonResponse } from '@/rest/JsonResponse.js';
import { SpriteBody, SpriteRestBody } from '@/rest/SpriteBody.js';

const enum Method {
  GET = 'GET',
  POST = 'POST'
}

/**
 * Static methods for making RESTful API calls.
 */
class Rest {
  /**
   * Make a {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET `GET`} request.
   * @param route - The route (key) to target in the request.
   * @param headers - The {@link https://developer.mozilla.org/en-US/docs/Web/API/Request/headers headers} to include in the request.
   * @returns A promise that resolves to a {@link https://developer.mozilla.org/en-US/docs/Web/API/Response `Response`} object.
   */
  public static async get(
    url: URL,
    headers: ArcadeBasicHeadersInit
  ): Promise<Response> {
    return HttpClient.request(url, {
      method: Method.GET,
      headers: ArcadeHeaders.compose(headers),
      keepalive: true
    });
  }
  /**
   * Make a {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET `GET`} request in which a JSON response is expected.
   * @param route - The route (key) to target in the request.
   * @param headers - The {@link https://developer.mozilla.org/en-US/docs/Web/API/Request/headers headers} to include in the request.
   * @returns The json response from the ArcadeDB Server.
   */
  public static async getJson<T>(
    url: URL,
    headers: ArcadeBasicHeadersInit
  ): Promise<T> {
    return JsonResponse.parse<T>(await this.get(url, headers));
  }
  /**
   * Make a {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST `POST`} request.
   * @param context.- The `ArcadeClientContext` to target in the request.
   * @param endpoint - The relative endpoint of request.
   * @param body - The {@link https://developer.mozilla.org/en-US/docs/Web/API/Request/body body} to include in the request.
   * @param headers - The {@link https://developer.mozilla.org/en-US/docs/Web/API/Request/headers headers} to include in the request.
   * @returns A promise that resolves to a {@link https://developer.mozilla.org/en-US/docs/Web/API/Response `Response`} object.
   */
  public static async post(
    url: URL,
    headers: ArcadeBasicHeadersInit,
    body: SpriteRestBody,
    transaction?: Transaction
  ): Promise<Response> {
    return HttpClient.request(url, {
      method: Method.POST,
      headers: ArcadeHeaders.compose(headers, transaction),
      body: body ? SpriteBody.compose(body) : null,
      keepalive: true
    });
  }
  /**
   * Make a {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST `POST`} request in which a JSON response is expected.
   * @param route - The route (key) to target in the request.
   * @param body - The {@link https://developer.mozilla.org/en-US/docs/Web/API/Request/body body} to include in the request.
   * @param context.- The `ArcadeClientContext` to target in the request.
   * @param transaction - The `Transaction` to target in the request.
   * @returns The json response from the ArcadeDB Server.
   */
  public static async postJson<T>(
    url: URL,
    headers: ArcadeBasicHeadersInit,
    body: SpriteRestBody,
    transaction?: Transaction
  ): Promise<T> {
    return JsonResponse.parse<T>(
      await this.post(url, headers, body, transaction)
    );
  }
}

export { Rest };
