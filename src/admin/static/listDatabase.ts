import { Routes } from '@/admin/constants/routes.js';
import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';
import { Rest } from '@/rest/Rest.js';

/**
 * Returns a list of database names that are present on the server.
 * @param server - The server to use to retrieve the database list.
 * @returns A list (array) of database names present on the server.
 * @throws `Error` if the database list could not be retrieved.
 */
export async function listDatabases(
  adminContext: ArcadeAdminContext
): Promise<Array<string>> {
  try {
    return await Rest.getJson(Routes.DATABASES, adminContext);
  } catch (error) {
    throw new Error(
      'Encountered an error when attemping to fetch list of databases from the server.',
      { cause: error }
    );
  }
}
