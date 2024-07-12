import { testPropagateErrors } from '../helpers/testPropagateErrors.js';
import { endpoints } from '../../../src/endpoints/server.js';
import { testAuth, variables } from '../../variables.js';
import { client } from './testClient.js';

/**
 * Test suit for the Sprite.ready() method.
 * It tests the following:
 * 1. Makes a properly formatted `GET` request to `/api/v1/ready`
 * 2. Returns `true` if the server returns a 204
 * 3. Should propegate errors from internal methods
 */
describe('SpriteBase.serverReady()', () => {
  it(`should make a properly formatted GET request to ${endpoints.ready}`, async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response());

    // Act
    await client.serverReady();

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.ready}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${testAuth}`,
          'Content-Type': 'application/json'
        }
      }
    );
  });

  it(`should return true when the server returns a 204`, async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204
    } as Response);

    // Act
    const status = await client.serverReady();

    // Assert
    expect(status).toBe(true);
  });

  testPropagateErrors(client.serverReady);
});
