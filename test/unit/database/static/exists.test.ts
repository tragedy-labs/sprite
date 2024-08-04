// Lib
import { Database } from '@/database/Database.js';
import { Routes } from '@/database/routes.js';

// Testing
import {
  TestDatabaseSession as SESSION,
  headers,
  variables
} from '@test/variables.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.EXISTS}/${variables.databaseName}`;

describe('Database.exists()', () => {
  it('should make a properly formatted fetch request with supplied options', async () => {
    // Arrange
    const REQUEST_INIT: RequestInit = {
      method: 'GET',
      headers,
      keepalive: true
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        result: true
      })
    } as Response);

    // Act
    await Database.exists(SESSION, variables.databaseName);

    // Assert
    expect(fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
  });

  it('should forward the "true" result for a 200 status response from the server', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        result: true
      })
    } as Response);
    const response = await Database.exists(SESSION, variables.databaseName);

    expect(response).toBe(true);
  });

  it('should forward the "false" result for a 200 status response from the server', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        result: false
      })
    } as Response);
    const response = await Database.exists(SESSION, variables.databaseName);

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
      Database.exists(SESSION, variables.databaseName)
    ).rejects.toMatchSnapshot();
  });

  it('should error if it recieves a 400 status from the server', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 400
    } as Response);

    await expect(
      Database.exists(SESSION, variables.databaseName)
    ).rejects.toMatchSnapshot();
  });

  it('should error if it recieves an unexpected status from the server', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 999
    } as Response);

    await expect(
      Database.exists(SESSION, variables.databaseName)
    ).rejects.toMatchSnapshot();
  });
});
