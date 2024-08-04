// Lib
import { Routes } from '@/server/routes.js';
import { Server } from '@/server/Server.js';

// Testing
import {
  TestServerSession as SESSION,
  headers,
  variables
} from '@test/variables.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.READY}`;

/**
 * Test suit for the Sprite.ready() method.
 * It tests the following:
 * 1. Makes a properly formatted `GET` request to `/api/v1/ready`
 * 2. Returns `true` if the server returns a 204
 * 3. Should propegate errors from internal methods
 */
describe('SpriteBase.serverReady()', () => {
  it(`should make a properly formatted GET request to ${ENDPOINT}`, async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response());

    const REQUEST_INIT: RequestInit = {
      method: 'GET',
      headers,
      keepalive: true
    };

    // Act
    await Server.serverReady(SESSION);

    // Assert
    expect(fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
  });

  it(`should return true when the server returns a 204`, async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204
    } as Response);

    // Act
    const status = await Server.serverReady(SESSION);

    // Assert
    expect(status).toBe(true);
  });

  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(Server.serverReady(SESSION)).rejects.toMatchSnapshot();
  });
});
