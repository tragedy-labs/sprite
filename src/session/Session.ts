import { SpriteHeadersInit, SpriteHeaders } from '../rest/SpriteHeaders.js';
import { ISpriteAuthParameters } from '../rest/Auth.js';
import { Routes as DatabaseRoutes } from '../database/routes.js';
import { Routes as ServerRoutes } from '../server/routes.js';
import {
  ISpriteDatabaseExistingSession,
  ISpriteDatabaseNewSession
} from './DatabaseSession.js';

export interface ISpriteBaseSession extends ISpriteAuthParameters {
  address: string;
}

export function isNewSession(
  parameters:
    | ISpriteDatabaseNewSession
    | ISpriteDatabaseExistingSession
    | ISpriteBaseSession
) {
  if (
    Object.hasOwn(parameters, 'address') &&
    Object.hasOwn(parameters, 'username') &&
    Object.hasOwn(parameters, 'password')
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Base class for handling common session functionality.
 */
class Session {
  public address: string;
  public headers: SpriteHeadersInit;
  public endpoints: Record<string, string> = {};
  constructor(
    params:
      | ISpriteBaseSession
      | ISpriteDatabaseExistingSession
      | ISpriteDatabaseNewSession
  ) {
    if (isNewSession(params)) {
      const { username, address, password } = params as ISpriteBaseSession;
      // remove trailing slash from the address
      this.address = address.replace(/\/$/, '');
      this.headers = SpriteHeaders.initialize(username, password);
    } else {
      const { session } = params as ISpriteDatabaseExistingSession;
      this.address = session.address;
      this.headers = session.headers;
    }
  }

  /**
   * Builds the endpoints for the session.
   * @param routes - The routes to build endpoints for.
   * @param prefix - The prefix for the endpoints.
   * @param suffix - The optional suffix for the endpoints.
   * @returns A record of the session's endpoints.
   */
  protected buildEndPoints(
    routes: typeof DatabaseRoutes | typeof ServerRoutes,
    suffix?: string
  ): Record<string, string> {
    const endpoints: Record<string, string> = {};
    const prefix = `${this.address}/api/v1`;

    Object.values(routes).forEach((route) => {
      endpoints[route] = suffix
        ? `${prefix}/${route}/${suffix}`
        : `${prefix}/${route}`;
    });

    if (suffix) {
      endpoints.server = `${prefix}/${'server'}`;
    }

    return endpoints;
  }
}

export { Session };
