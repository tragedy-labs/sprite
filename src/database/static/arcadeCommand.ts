import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import { DATABASE_ROUTES } from '@/database/constants/routes.js';
import type {
    ArcadeQueryParameters,
    ArcadeSupportedQueryLanguages
} from '@/database/types.js';
import { Rest } from '@/rest/Rest.js';

/**
 * Static method to execute a command on the database.
 * @param session - The {@link ArcadeDatabaseContext `ArcadeDatabaseContext`} to execute the command on.
 * @param language - The query language the command is written in.
 * @param command - The command to execute.
 * @param parameters - A map of parameters to pass to the query engine, where parameters are prefixed with a colon (`:parameterName`).
 * @see {@link ArcadeSupportedQueryLanguages}
 * @returns The result of the command.
 */
export async function arcadeCommand<RT, QP = ArcadeQueryParameters>(
  databaseContext: ArcadeDatabaseContext,
  language: ArcadeSupportedQueryLanguages,
  command: string,
  parameters?: QP
): Promise<RT> {
  try {
    return await Rest.postJson(
      DATABASE_ROUTES.COMMAND,
      {
        language,
        command,
        params: parameters
      },
      databaseContext
    );
  } catch (error) {
    throw new Error(
      `Could not perform command on database: ${databaseContext.name}`,
      {
        cause: error
      }
    );
  }
}
