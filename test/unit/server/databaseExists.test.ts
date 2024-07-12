import { endpoints } from '@/endpoints/server.js';
import { testAuth, variables } from '../../variables.js';
import { client } from './testClient.js';

describe('SpriteServer.databaseExists()', () => {
  it('should make a properly formatted fetch request with supplied options', async () => {
    // Arrange
    const options: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${testAuth}`,
        'Content-Type': 'application/json'
      }
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        result: true
      })
    } as Response);

    // Act
    await client.databaseExists(variables.databaseName);

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.exists}/${variables.databaseName}`,
      options
    );
  });

  it('should forward the "true" result for a 200 status response from the server', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        result: true
      })
    } as Response);
    const response = await client.databaseExists(variables.databaseName);

    expect(response).toBe(true);
  });

  it('should forward the "false" result for a 200 status response from the server', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        result: false
      })
    } as Response);
    const response = await client.databaseExists(variables.databaseName);

    expect(response).toBe(false);
  });

  it('should error if it receives a non-boolean result', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        result: 'ok'
      })
    } as Response);

    await expect(
      client.databaseExists(variables.databaseName)
    ).rejects.toMatchSnapshot();
  });

  it('should error if it recieves a 400 status from the server', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 400
    } as Response);

    await expect(
      client.databaseExists(variables.databaseName)
    ).rejects.toMatchSnapshot();
  });

  it('should error if it recieves an unexpected status from the server', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 999
    } as Response);

    await expect(
      client.databaseExists(variables.databaseName)
    ).rejects.toMatchSnapshot();
  });
});
