import { booleanAdminCommand } from '@/admin/static/booleanAdminCommand.js';
import { CONNECT_CLUSTER } from '@/admin/static/commands/CONNECT_CLUSTER.js';
import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';

/**
 * Connects this server to a cluster with `address`.
 * @param server The server to use to connect to the cluster.
 * @param address The address of the cluster to connect (i.e. 192.168.0.1)
 * @returns The response from the server.
 * @throws `Error` if the cluster could not be connected.
 */
export async function connectCluster(
  context: ArcadeAdminContext,
  address: string
): Promise<boolean> {
  try {
    return await booleanAdminCommand(context, CONNECT_CLUSTER(address));
  } catch (error) {
    throw new Error(
      `There was an error attempting to connect cluster at: ${address}`,
      { cause: error }
    );
  }
}
