import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import { QueryLanguages } from '@/database/constants/languages.js';
import { arcadeQuery } from '@/database/static/arcadeQuery.js';
import { SELECT_SCHEMA } from '@/database/static/sql/SELECT_SCHEMA.js';
import type { ArcadeGetSchemaResponse } from '@/types/database.js';

/**
 * Return the current schema.
 * @param database - The {@link ArcadeDatabaseContext `ArcadeDatabaseContext`} to retrieve the schema from.
 * @returns An array of objects describing the schema.
 * @example
 * ```ts
 * async function getSchemaExample() {
 *   try {
 *     const schema = await getSchema(db);
 *     console.log(schema);
 *     // [...]
 *     return schema;
 *   } catch (error) {
 *     console.log(error);
 *     // handle error conditions
 *   }
 * }
 *
 * getSchemaExample();
 * ```
 */
export async function getSchema(
  databaseContext: ArcadeDatabaseContext
): Promise<ArcadeGetSchemaResponse> {
  try {
    return await arcadeQuery(
      databaseContext,
      QueryLanguages.SQL,
      SELECT_SCHEMA
    );
  } catch (error) {
    throw new Error(
      `Could not retrieve schema from database: ${databaseContext.name}`,
      {
        cause: error
      }
    );
  }
}
