import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';
import { Rest } from '@/rest/Rest.js';

/**
 * Returns a `boolean` value indicating if the ArcadeDB server is ready.\
 * Useful for remote monitoring of server readiness.
 * @param context - Identifies the ArcadeDB Server to check the status of.
 * @returns `true` if the server is ready, otherwise `false`.
 * @throws `Error` if the server status could not be checked.
 */
export async function serverReady(
  context: ArcadeAdminContext
): Promise<boolean> {
  try {
    const response = await Rest.get(
      context.endpoints.ready,
      context.server.headers
    );
    return response.status === 204;
  } catch (error) {
    throw new Error('Unable to check the server status.', { cause: error });
  }
}
