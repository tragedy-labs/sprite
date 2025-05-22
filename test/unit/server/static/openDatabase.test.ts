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

describe('SpriteServer.openDatabase()', () => {
  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    // Arrange
    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        command: `open database ${variables.databaseName}`
      }),
      keepalive: true
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({
        result: 'ok'
      })
    } as Response);

    // Act
    await Server.openDatabase(SESSION, variables.databaseName);

    // Assert
    expect(fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
  });

  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    expect(() =>
      Server.openDatabase(SESSION, variables.databaseName)
    ).rejects.toMatchSnapshot();
  });
});
