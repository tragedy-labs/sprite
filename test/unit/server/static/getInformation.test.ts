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

describe('SpriteServer.getInformation()', () => {
  it('should make a properly formatted fetch request with supplied options', async () => {
    // Arrange
    const REQUEST_INIT: RequestInit = {
      method: 'GET',
      headers,
      keepalive: true
    };

    const mode = 'basic';

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await Server.getInformation(SESSION, mode);

    // Assert
    expect(fetch).toHaveBeenCalledWith(`${ENDPOINT}?mode=basic`, REQUEST_INIT);
  });

  it('should return the result for a 200 status', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);

    const response = await Server.getInformation(SESSION);

    expect(response).toBe(variables.jsonResponse.result);
  });

  it('should return an error for a 403 status', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 403
    } as Response);
    expect(() => Server.getInformation(SESSION)).rejects.toMatchSnapshot();
  });
});
