import { booleanAdminCommand } from '@/admin/static/booleanAdminCommand.js';
import { DISCONNECT_CLUSTER } from '@/admin/static/commands/DISCONNECT_CLUSTER.js';
import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';

/**
 * Disconnects the server from the cluster.
 * @param server The server to use to disconnect from the cluster.
 * @returns The response from the server.
 * @throws `Error` if the cluster could not be disconnected.
 */
export async function disconnectCluster(
  context: ArcadeAdminContext
): Promise<boolean> {
  try {
    return await booleanAdminCommand(context, DISCONNECT_CLUSTER);
  } catch (error) {
    throw new Error(
      'There was an error when attempting to disconnect from the cluster.',
      { cause: error }
    );
  }
}
