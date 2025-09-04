import { booleanAdminCommand } from '@/admin/static/booleanAdminCommand.js';
import {
  CREATE_USER,
  type ArcadeCreateUser
} from '@/admin/static/commands/CREATE_USER.js';
import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';

/**
 * Parameters necessary to create a user in ArcadeDB
 */
export interface SpriteCreateArcadeUser {
  /** The username of the database user to create */
  username: string;
  /** The password of the database user to create */
  password: string;
  /**
   * An object containing databases to add the user to, and the
   * permisisions to grant them \
   * (i.e. `{ myDatabase: "ADMIN" }`)
   */
  databases: Record<string, string>;
}

/**
 * Create a user. `username`, `password`, and access controls to multiple databases
 * can be established using the `databases` property of the input parameters.
 * @param server - The server to use to create the user.
 * @param username - The `username` of the user to create.
 * @param password - The `password` of the user to create.
 * @param databases - An object of databases to add the user to, and their permissions (groups they belong to).
 * @returns `true` if the user was created successfully.
 * @throws `Error` if the user could not be created.
 */
export async function createUser(
  context: ArcadeAdminContext,
  params: SpriteCreateArcadeUser
): Promise<boolean> {
  try {
    if (
      !Object.prototype.hasOwnProperty.call(params, 'username') ||
      !Object.prototype.hasOwnProperty.call(params, 'password') ||
      !Object.prototype.hasOwnProperty.call(params, 'databases')
    ) {
      throw new TypeError(
        `The object supplied as an argument must contain 'username', 'password', and 'databases' properties. Received: ${JSON.stringify(
          params
        )}`
      );
    }

    // TODO:
    // ArcadeDB by default requires 4 character minimum length for passwords.
    // The problem is they return a 403 if it's under 4 characters. That could
    // be confusing because it isn't really explained and could be confused with a
    // 403 for invalid credentials from user error establishing authorization
    // through the client. Further question: the manual indicates that it's a 8
    // character minimum, but in practice it's 4 (for non-root users)
    if (!(params.password.length > 3)) {
      throw new TypeError(
        `The password must be at least 4 characters in length, received: ${params.password}, which is ${params.password.length} characters long.`
      );
    }

    // ArcadeDB uses a 'name' property for the user account.
    // This is fine if all you are collecting is a 'username',
    // but in many use cases a user's 'name' and their 'username'
    // will be different fields, and to avoid complication for
    // end users, we are collecting 'username' and manually
    // changing it to 'name' as arcadedb expects.
    const expectedParameters: ArcadeCreateUser = {
      name: params.username,
      password: params.password,
      databases: params.databases
    };

    return await booleanAdminCommand(context, CREATE_USER(expectedParameters));
  } catch (error) {
    const databaseListString = Object.keys(params.databases).join(', ');
    throw new Error(
      `Could not create user ${params.username}. In database(s): ${databaseListString}`,
      { cause: error }
    );
  }
}
