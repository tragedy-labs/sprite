import { Arcade } from '@/context/Arcade.js';
import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import { ArcadeDatabaseClient } from '@/database/ArcadeDatabaseClient.js';

/**
 * Convenience method to create a `DatabaseClient` in one step.
 * @param name - The name of the database to create a client for
 * @param arcade - The points to the ArcadeDB server that the database exists on
 * @throws `Error` propagated from the constructor of the created `ArcadeDatabaseContext`
 * @returns A new database client instance
 */
export function createDatabaseClient(
  name: string,
  arcade: Arcade
): ArcadeDatabaseClient {
  const databaseContext = new ArcadeDatabaseContext(name, arcade);
  return new ArcadeDatabaseClient(databaseContext);
}
