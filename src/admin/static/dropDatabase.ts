import { booleanAdminCommand } from '@/admin/static/booleanAdminCommand.js';
import { DROP_DATABASE } from '@/admin/static/commands/DROP_DATABASE.js';
import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';

/**
 * Drop a database
 * @param server The server to use to drop the database.
 * @param databaseName The name of the database to drop.
 * @returns `true` if successfully dropped.
 * @throws `Error` if the database could not be dropped.
 */
export async function dropDatabase(
  adminContext: ArcadeAdminContext,
  databaseName: string
): Promise<boolean> {
  try {
    return await booleanAdminCommand(adminContext, DROP_DATABASE(databaseName));
  } catch (error) {
    throw new Error(`Failed to drop database.`, {
      cause: error
    });
  }
}
