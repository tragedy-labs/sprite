import { adminCommand } from '@/admin/static/adminCommand.js';
import { GET_SERVER_EVENTS } from '@/admin/static/commands/GET_SERVER_EVENTS.js';
import type { ArcadeServerEvents } from '@/admin/types.js';
import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';

/**
 * Retrieves a list of server events, optionally a filename of the form
 * `server-event-log-yyyymmdd-HHMMSS.INDEX.jsonl` (where INDEX is a integer, i.e. 0)
 * can be given to retrieve older event logs.
 * @param server - The server to use to retrieve the server events.
 * @returns An object containing he server events from the server, and filenames of the associated logs.
 * @throws `Error` if there was a problem fetching the event logs.
 */
export async function getServerEvents(
  adminContext: ArcadeAdminContext
): Promise<ArcadeServerEvents> {
  try {
    return await adminCommand<ArcadeServerEvents>(
      adminContext,
      GET_SERVER_EVENTS
    );
  } catch (error) {
    throw new Error(
      `There was an error when attempting to retrieve ArcadeDB server event logs.`,
      { cause: error }
    );
  }
}
