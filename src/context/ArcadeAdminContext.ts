import { ADMIN_ROUTES } from '@/admin/constants/routes.js';
import { Arcade } from '@/context/Arcade.js';
import type {
    ArcadeClientContext,
    ArcadeClientEndpoints
} from '@/context/types.js';

type AdminRoutes = typeof ADMIN_ROUTES;
type AdminEndpoints = ArcadeClientEndpoints<AdminRoutes>;

export class ArcadeAdminContext implements ArcadeClientContext<AdminRoutes> {
  readonly #arcade: Arcade;
  readonly #endpoints: AdminEndpoints;
  constructor(arcade: Arcade) {
    this.#arcade = arcade;
    this.#endpoints = ArcadeAdminContext.buildEndPoints(this.#arcade);
  }
  get arcade() {
    return this.#arcade;
  }
  get endpoints() {
    return this.#endpoints;
  }
  /**
   * Builds the endpoints for the server.
   * @param routes - The routes to build endpoints for.
   * @returns A record of the session's endpoints.
   */
  protected static buildEndPoints(arcade: Arcade): AdminEndpoints {
    const endpoints = {} as AdminEndpoints;

    Object.values(ADMIN_ROUTES).forEach((route) => {
      endpoints[route] = new URL(`${arcade.urls.rest}/${route}`);
    });

    return endpoints;
  }
}
