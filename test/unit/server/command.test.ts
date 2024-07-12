import { endpoints } from '../../../src/endpoints/server.js';
import { testAuth, variables } from '../../variables.js';
import { client } from './testClient.js';

describe('Sprite.command()', () => {
  it('should make a properly formatted fetch request with supplied options', async () => {
    // Arrange
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${testAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command: 'non-empty string' })
    };

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await client.command('non-empty string');

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}`,
      options
    );
  });
});
