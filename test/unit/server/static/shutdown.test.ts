// Lib
import { Routes } from '@/server/routes.js';
import { Server } from '@/server/Server.js';

// Testing
import {
  TestServerSession as SESSION,
  headers,
  variables
} from '@test/variables.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.COMMAND}`;

describe('SpriteServer.shutdown()', () => {
  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    // Arrange
    const options: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        command: `shutdown`
      }),
      keepalive: true
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await Server.shutdown(SESSION);

    // Assert
    expect(fetch).toHaveBeenCalledWith(ENDPOINT, options);
  });
  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(Server.shutdown(SESSION)).rejects.toMatchSnapshot();
  });
});
