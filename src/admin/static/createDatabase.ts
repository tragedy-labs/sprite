import { booleanAdminCommand } from '@/admin/static/booleanAdminCommand.js';
import { CREATE_DATABASE } from '@/admin/static/commands/CREATE_DATABASE.js';
import { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';
import { validateDatabaseName } from '@/validation/index.js';

/**
 * Create a database
 * @param server The server to use to create the database.
 * @param databaseName The name of the database to create.
 * @returns An instance of `SpriteDatabase`, targeting the created database.
 * @throws `Error` if the database could not be created.
 */
export async function createDatabase(
  adminContext: ArcadeAdminContext,
  databaseName: string
) {
  try {
    validateDatabaseName(databaseName);
    const created = await booleanAdminCommand(
      adminContext,
      CREATE_DATABASE(databaseName)
    );
    if (created) {
      return created;
    } else {
      throw new Error(
        `Received an unexpected response from the server when attempting to create database "${databaseName}"`
      );
    }
  } catch (error) {
    throw new Error(`Failed to create database "${databaseName}".`, {
      cause: error
    });
  }
}
