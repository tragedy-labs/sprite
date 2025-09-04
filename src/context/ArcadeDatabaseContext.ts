import { ArcadeServer } from '@/context/ArcadeServer.js';
import type {
    ArcadeClientContext,
    ArcadeClientEndpoints
} from '@/context/types.js';
import { DATABASE_ROUTES } from '@/database/constants/routes.js';

type DatabaseRoutes = typeof DATABASE_ROUTES;
type DatabaseEndpoints = ArcadeClientEndpoints<DatabaseRoutes> & {
  server: URL;
};

export class ArcadeDatabaseContext
  implements ArcadeClientContext<DatabaseRoutes>
{
  readonly #server: ArcadeServer;
  readonly #endpoints: DatabaseEndpoints;
  readonly #databaseName: string;
  constructor(databaseName: string, server: ArcadeServer) {
    this.#server = server;
    this.#databaseName = databaseName;
    this.#endpoints = ArcadeDatabaseContext.buildEndPoints(
      this.#server,
      databaseName
    );
  }
  get server() {
    return this.#server;
  }
  get endpoints() {
    return this.#endpoints;
  }
  get name() {
    return this.#databaseName;
  }
  /**
   * Builds the endpoints for the session.
   * @param routes - The routes to build endpoints for.
   * @param prefix - The prefix for the endpoints.
   * @param suffix - The optional suffix for the endpoints.
   * @returns A record of the session's endpoints.
   */
  protected static buildEndPoints(
    server: ArcadeServer,
    name: string
  ): DatabaseEndpoints {
    const endpoints = {} as DatabaseEndpoints;

    Object.values(DATABASE_ROUTES).forEach((route) => {
      endpoints[route] = new URL(`${server.urls.rest}/${route}/${name}`);
    });

    endpoints.server = new URL(`${server.urls.rest}/${name}`);

    return endpoints;
  }
}
