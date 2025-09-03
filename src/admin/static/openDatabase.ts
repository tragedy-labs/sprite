import { booleanAdminCommand } from '@/admin/static/booleanAdminCommand.js';
import { OPEN_DATABASE } from '@/admin/static/commands/OPEN_DATABASE.js';
import { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';

/**
 * Open a database on the ArcadeDB server
 * @param server - The server to use to open the database.
 * @param databaseName - The name of the database to open.
 * @returns `true` if the database was opened.
 * @throws `Error` if the database could not be opened.
 */
export async function openDatabase(
  adminContext: ArcadeAdminContext,
  databaseName: string
): Promise<boolean> {
  try {
    return await booleanAdminCommand(adminContext, OPEN_DATABASE(databaseName));
  } catch (error) {
    throw new Error(`Unabled to open database "${databaseName}`, {
      cause: error
    });
  }
}
