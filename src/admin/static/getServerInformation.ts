import type {
  ArcadeServerInformation,
  ArcadeServerInformationLevel
} from '@/admin/types.js';
import type { ArcadeAdminContext } from '@/context/ArcadeAdminContext.js';
import { ArcadeFetchError } from '@/errors/ArcadeFetchError.js';

/**
 * Returns the current configuration.
 * @param server The server to use to retrieve the configuration.
 * @param mode The level of informatio detail to return.
 * * `basic` returns minimal server information
 * * `default` returns full server configuration (default value when no parameter is given)
 * * `cluster` returns the cluster layout
 * @returns The server information.
 * @throws `Error` if the server information could not be retrieved.
 */
export async function getServerInformation<
  IL extends ArcadeServerInformationLevel = 'default'
>(
  adminContext: ArcadeAdminContext,
  mode?: IL
): Promise<ArcadeServerInformation<IL>> {
  try {
    // TODO: There should be a method to modify the URL
    // in the Rest class with parameters like this, for now this
    // works
    // TODO: The repetition of the RequestInit is less
    // than ideal
    const response = await fetch(
      `${adminContext.server.urls.rest}/server?mode=${mode || 'default'}`,
      {
        method: 'GET',
        headers: adminContext.server.headers,
        keepalive: true
      }
    );

    switch (response.status) {
      case 200: {
        const jsonResponse = await response.json();
        return jsonResponse.result;
      }
      case 403:
      case 404:
      case 500:
      default:
        throw new ArcadeFetchError(response);
    }
  } catch (error) {
    throw new Error(`Could not get ArcadeDB server information.`, {
      cause: error
    });
  }
}
