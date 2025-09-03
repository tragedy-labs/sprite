import { ADMIN_ROUTES } from '@/admin/constants/routes.js';
import { ArcadeServer } from '@/context/ArcadeServer.js';
import type {
  ArcadeClientContext,
  ArcadeClientEndpoints
} from '@/context/types.js';

type AdminRoutes = typeof ADMIN_ROUTES;
type AdminEndpoints = ArcadeClientEndpoints<AdminRoutes>;

export class ArcadeAdminContext implements ArcadeClientContext<AdminRoutes> {
  readonly #server: ArcadeServer;
  readonly #endpoints: AdminEndpoints;
  constructor(server: ArcadeServer) {
    this.#server = server;
    this.#endpoints = ArcadeAdminContext.buildEndPoints(this.#server);
  }
  get server() {
    return this.#server;
  }
  get endpoints() {
    return this.#endpoints;
  }
  /**
   * Builds the endpoints for the server.
   * @param routes - The routes to build endpoints for.
   * @returns A record of the session's endpoints.
   */
  protected static buildEndPoints(server: ArcadeServer): AdminEndpoints {
    const endpoints = {} as AdminEndpoints;

    Object.values(ADMIN_ROUTES).forEach((route) => {
      endpoints[route] = new URL(`${server.urls.rest}/${route}`);
    });

    return endpoints;
  }
}
