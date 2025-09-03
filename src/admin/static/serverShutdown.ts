import { SHUTDOWN } from '@/admin/static/commands/SHUTDOWN.js';
import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';
import { Rest } from '@/rest/Rest.js';

/**
 * Gracefully shutdown the server.
 * @param context - Identifies the server which should be shutdown.
 * @returns `true` if the server is successfully shutdown.
 * @throws `Error` if there is a problem attempting the shutdown.
 */
export async function serverShutdown(
  context: ArcadeAdminContext
): Promise<boolean> {
  try {
    const response = await Rest.post(
      context.endpoints.server,
      { command: SHUTDOWN },
      context.server.headers
    );
    return response.status === 204;
  } catch (error) {
    throw new Error(
      `There was an error when attempting to shutdown the ArcadeDB server at.`,
      { cause: error }
    );
  }
}
