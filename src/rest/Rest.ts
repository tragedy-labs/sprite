import { SpriteTransaction } from '../transaction/SpriteTransaction.js';
import { HttpClient } from './HttpClient.js';
import { JsonResponse } from './JsonResponse.js';
import { SpriteHeaders } from './SpriteHeaders.js';
import { SpriteBody, SpriteRestBody } from './SpriteBody.js';
import { Routes as DatabaseRoutes } from '../database/routes.js';
import { Routes as ServerRoutes } from '../server/routes.js';
import { Session } from '../session/Session.js';

type ApiRoutes = DatabaseRoutes | ServerRoutes | string;

enum Method {
  POST = 'POST',
  GET = 'GET'
}

/**
 * Static methods for making RESTful API calls.
 */
class Rest {
  /**
   * Make a {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET `GET`} request.
   * @param route The route (key) to target in the request.
   * @param session The `Session` to target in the request.
   * @returns A promise that resolves to a {@link https://developer.mozilla.org/en-US/docs/Web/API/Response `Response`} object.
   */
  public static async get(
    route: ApiRoutes,
    session: Session
  ): Promise<Response> {
    return HttpClient.request(session.endpoints[route], {
      method: Method.GET,
      headers: SpriteHeaders.compose(session),
      keepalive: true
    });
  }
  /**
   * Make a {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET `GET`} request in which a JSON response is expected.
   * @param route The route (key) to target in the request.
   * @param session The `Session` to target in the request.
   * @returns The json response from the ArcadeDB Server.
   */
  public static async getJson<T>(
    route: ApiRoutes,
    session: Session
  ): Promise<T> {
    return JsonResponse.parse<T>(await this.get(route, session));
  }
  /**
   * Make a {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST `POST`} request.
   * @param session The `Session` to target in the request.
   * @param endpoint The relative endpoint of request.
   * @param body The {@link https://developer.mozilla.org/en-US/docs/Web/API/Request/body body} to include in the request.
   * @param headers The {@link https://developer.mozilla.org/en-US/docs/Web/API/Request/headers headers} to include in the request.
   * @returns A promise that resolves to a {@link https://developer.mozilla.org/en-US/docs/Web/API/Response `Response`} object.
   */
  public static async post(
    route: ApiRoutes,
    body: SpriteRestBody,
    session: Session,
    transaction?: SpriteTransaction
  ): Promise<Response> {
    return HttpClient.request(session.endpoints[route], {
      method: Method.POST,
      headers: SpriteHeaders.compose(session, transaction),
      body: body ? SpriteBody.compose(body) : null,
      keepalive: true
    });
  }
  /**
   * Make a {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST `POST`} request in which a JSON response is expected.
   * @param route The route (key) to target in the request.
   * @param body The {@link https://developer.mozilla.org/en-US/docs/Web/API/Request/body body} to include in the request.
   * @param session The `DatabaseSession` to target in the request.
   * @param transaction The `SpriteTransaction` to target in the request.
   * @returns The json response from the ArcadeDB Server.
   */
  public static async postJson<T>(
    route: ApiRoutes,
    body: SpriteRestBody,
    session: Session,
    transaction?: SpriteTransaction
  ): Promise<T> {
    return JsonResponse.parse<T>(
      await this.post(route, body, session, transaction)
    );
  }
}

export { Rest };
