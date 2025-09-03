import { booleanAdminCommand } from '@/admin/static/booleanAdminCommand.js';
import { CLOSE_DATABASE } from '@/admin/static/commands/CLOSE_DATABASE.js';
import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';

/**
 * Close a database on the ArcadeDB server.
 * @param server The server to use to close the database.
 * @param databaseName The name of the database to close.
 * @returns The response from the server.
 * @throws `Error` if the database could not be closed.
 */
export async function closeDatabase(
  adminContext: ArcadeAdminContext,
  databaseName: string
): Promise<boolean> {
  try {
    return await booleanAdminCommand(
      adminContext,
      CLOSE_DATABASE(databaseName)
    );
  } catch (error) {
    throw new Error(`Unabled to close database "${databaseName}`, {
      cause: error
    });
  }
}
