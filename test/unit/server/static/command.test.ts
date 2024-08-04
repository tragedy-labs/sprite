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

describe('Server.command()', () => {
  it(`should make a properly formatted fetch request with supplied options to ${ENDPOINT}`, async () => {
    // Arrange

    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({ command: 'non-empty string' }),
      keepalive: true
    };

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await Server.command(SESSION, 'non-empty string');

    // Assert
    expect(fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
  });
});
