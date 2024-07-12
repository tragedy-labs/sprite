import { endpoints } from '../../../src/endpoints/server.js';
import { testAuth, variables } from '../../variables.js';
import { client } from './testClient.js';

describe('SpriteServer.openDatabase()', () => {
  it(`should make a properly formatted POST request to ${endpoints.command}`, async () => {
    // Arrange
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${testAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command: `OPEN DATABASE ${variables.databaseName}`
      })
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({
        result: 'ok'
      })
    } as Response);

    // Act
    await client.openDatabase(variables.databaseName);

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}`,
      options
    );
  });

  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    expect(() =>
      client.openDatabase(variables.databaseName)
    ).rejects.toMatchSnapshot();
  });
});
