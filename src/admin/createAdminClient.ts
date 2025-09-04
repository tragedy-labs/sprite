import { ArcadeAdminClient } from '@/admin/ArcadeAdminClient.js';
import { Arcade } from '@/context/Arcade.js';
import { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';

/**
 * Convenience method to create a `AdminClient` in one step.
 * @param arcade - The points to the ArcadeDB server to create a client for.
 * @throws `Error` propagated from the constructor of the created `ArcadeAdminContext`
 * @returns A new admin client instance
 */
export function createAdminClient(arcade: Arcade): ArcadeAdminClient {
  const adminContext = new ArcadeAdminContext(arcade);
  return new ArcadeAdminClient(adminContext);
}
