import { SHUTDOWN } from '@/admin/static/commands/SHUTDOWN.js';
import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';
import { Routes } from '@/database/index.js';
import { Rest } from '@/rest/Rest.js';

/**
 * Gracefully shutdown the server.
 * @param adminContext - The `AdminContext` used to target the server which should be shutdown.
 * @returns `true` if the server is successfully shutdown.
 * @throws `Error` if there is a problem attempting the shutdown.
 */
export async function serverShutdown(
  adminContext: ArcadeAdminContext
): Promise<boolean> {
  try {
    const response = await Rest.post(
      Routes.COMMAND,
      { command: SHUTDOWN },
      adminContext
    );
    return response.status === 204;
  } catch (error) {
    throw new Error(
      `There was an error when attempting to shutdown the ArcadeDB adminContext at.`,
      { cause: error }
    );
  }
}
