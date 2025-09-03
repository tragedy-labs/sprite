import { ADMIN_ROUTES } from '@/admin/constants/routes.js';
import { ArcadeClientContext } from '@/context/types.js';
import { DATABASE_ROUTES } from '@/database/constants/routes.js';
import { Transaction } from '@/database/transaction/index.js';
import { ArcadeHeaders } from '@/rest/ArcadeHeaders.js';
import { HttpClient } from '@/rest/HttpClient.js';
import { JsonResponse } from '@/rest/JsonResponse.js';
import { SpriteBody, SpriteRestBody } from '@/rest/SpriteBody.js';

type AdminRoute = (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];
type DatabaseRoute = (typeof DATABASE_ROUTES)[keyof typeof DATABASE_ROUTES];
type ArcadeRoute = AdminRoute | DatabaseRoute;

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
   * @param context.- The `ArcadeClientContext` to target in the request.
   * @returns A promise that resolves to a {@link https://developer.mozilla.org/en-US/docs/Web/API/Response `Response`} object.
   */
  public static async get(
    route: ArcadeRoute,
    context: ArcadeClientContext
  ): Promise<Response> {
    return HttpClient.request(context.endpoints[route], {
      method: Method.GET,
      headers: ArcadeHeaders.compose(context.server.headers),
      keepalive: true
    });
  }
  /**
   * Make a {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET `GET`} request in which a JSON response is expected.
   * @param route - The route (key) to target in the request.
   * @param context.- The `ArcadeClientContext` to target in the request.
   * @returns The json response from the ArcadeDB Server.
   */
  public static async getJson<T>(
    route: ArcadeRoute,
    context: ArcadeClientContext
  ): Promise<T> {
    return JsonResponse.parse<T>(await this.get(route, context));
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
    route: ArcadeRoute,
    body: SpriteRestBody,
    context: ArcadeClientContext,
    transaction?: Transaction
  ): Promise<Response> {
    return HttpClient.request(context.endpoints[route], {
      method: Method.POST,
      headers: ArcadeHeaders.compose(context.server.headers, transaction),
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
    route: ArcadeRoute,
    body: SpriteRestBody,
    context: ArcadeClientContext,
    transaction?: Transaction
  ): Promise<T> {
    return JsonResponse.parse<T>(
      await this.post(route, body, context, transaction)
    );
  }
}

export { Rest };
