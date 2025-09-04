import { CommandResponse } from '@/admin/constants/commandResponse.js';
import { adminCommand } from '@/admin/static/adminCommand.js';
import { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';

/**
 * Internal method for sending commands to the server in which a JSON response
 * containing an `ok` value in the `result` property is expected. `ok` is then
 * returned as a simple boolean (`true`) value
 * @param adminContext - The server to use to send the command.
 * @param command - The [command](https://docs.arcadedb.com/#HTTP-ServerCommand) to send to the server, such as `CREATE DATABASE`.
 * @returns `true` if the command was successful.
 * @throws `Error` if the command could not be executed.
 */
export async function booleanAdminCommand(
  context: ArcadeAdminContext,
  command: string
): Promise<boolean> {
  const response = await adminCommand(context, command);
  if (response === CommandResponse.OK) {
    return true;
  } else {
    return false;
  }
}
