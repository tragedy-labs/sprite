import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import type {
    ArcadeQueryParameters,
    ArcadeSupportedQueryLanguages
} from '@/database/types.js';
import { Rest } from '@/rest/Rest.js';

/**
 * A flexible query function which accepts the language type as a parameter.
 * @param context - The {@link ArcadeDatabaseContext `ArcadeDatabaseContext`} to execute the query on.
 * @param language - The language of the query.
 * @param query - The query to execute.
 * @param parameters - An object representing the values for the parameterized query.
 * @returns The result-set of the query.
 */
export async function arcadeQuery<RT, QP = ArcadeQueryParameters>(
  context: ArcadeDatabaseContext,
  language: ArcadeSupportedQueryLanguages,
  query: string,
  parameters?: QP
): Promise<RT[]> {
  return Rest.postJson<RT[]>(context.endpoints.query, context.arcade.headers, {
    language,
    command: query,
    params: parameters
  });
}
