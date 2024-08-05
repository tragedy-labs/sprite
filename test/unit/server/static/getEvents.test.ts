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

describe('SpriteServer.getEvents()', () => {
  it('should make a properly formatted fetch request with supplied options', async () => {
    // Arrange
    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        command: 'GET SERVER EVENTS'
      }),
      keepalive: true
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await Server.getEvents(SESSION);

    // Assert
    expect(fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
  });
  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(Server.getEvents(SESSION)).rejects.toMatchSnapshot();
  });
});
