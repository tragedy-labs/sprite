import { booleanAdminCommand } from '@/admin/static/booleanAdminCommand.js';
import { DROP_USER } from '@/admin/static/commands/DROP_USER.js';
import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';

/**
 * Drop a user from the ArcadeDB server.
 * @param server The server to use to drop the user.
 * @param username The `username` of the user to drop from the ArcadeDB server.
 * @returns `true` if the user was successfully dropped.
 * @throws `Error` if the user could not be dropped.
 */
export async function dropUser(
  context: ArcadeAdminContext,
  username: string
): Promise<boolean> {
  try {
    return await booleanAdminCommand(context, DROP_USER(username));
  } catch (error) {
    throw new Error(`Could not drop user ${username}.`, { cause: error });
  }
}
