import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';
import { Rest } from '@/rest/Rest.js';

/**
 * Sends a command to the ArcadeDB.arcade.
 * @param adminContext - The session to use to send the command.
 * @param command - The command to send to the.arcade.
 * @returns The response from the.arcade.
 * @throws `Error` if the command could not be executed.
 */
export async function adminCommand<T>(
  context: ArcadeAdminContext,
  command: string
): Promise<T> {
  try {
    return await Rest.postJson(
      context.endpoints.server,
      context.arcade.headers,
      JSON.stringify({
        command
      })
    );
  } catch (error) {
    throw new Error(
      `There was an error when attemping to execute a command on the ArcadeDB Server. See aggregate error for details.`,
      { cause: error }
    );
  }
}
