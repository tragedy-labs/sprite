import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import { Rest } from '@/rest/Rest.js';

/**
 * Check to see if the database exists.
 * @param context - The database to use to check for the database.
 * @param databaseName - The name of the database to check for existence.
 * @returns `true` if database exists, `false` if not
 * @throws `Error` if the existence of the database could not be verified.
 */
export async function exists(context: ArcadeDatabaseContext): Promise<boolean> {
  try {
    const response = await Rest.get(
      context.endpoints.exists,
      context.arcade.headers
    );
    switch (response.status) {
      case 200: {
        const { result } = await response.json();
        if (typeof result === 'boolean') {
          return result;
        } else {
          throw new Error(
            `Recieved an unexpected result from the server, expected boolean, recieved: [${result}] which has a type of: ${typeof result}.`
          );
        }
      }
      case 400:
        throw new Error(
          `Likely an undefined or malformed database name. Recieved: [${context.name}] as a name.`
        );
      default:
        throw new Error(
          `Received an unexpected status code from the server when attempting to check if database "${context.name}" exists.`
        );
    }
  } catch (error) {
    throw new Error(
      `Encountered an error when checking to see if database "${context.name}" exists`,
      { cause: error }
    );
  }
}
