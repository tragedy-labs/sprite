// Lib
import { Routes } from '@/database/routes.js';
import { Database } from '@/database/Database.js';

// Testing
import {
  testTransaction as TRX,
  TestDatabaseSession as SESSION,
  headersWithTransaction as headers,
  variables
} from '@test/variables.js';

const endpoint = `${variables.address}${variables.apiRoute}${Routes.COMMIT}/${variables.databaseName}`;

describe('Database.commitTransaction()', () => {
  it(`should make a properly formatted POST request to ${endpoint}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204
    } as Response);
    await Database.commitTransaction(SESSION, TRX);

    // TODO: I don't like using a null body, look into this
    const requestInit: RequestInit = {
      method: 'POST',
      body: null,
      headers,
      keepalive: true
    };

    expect(global.fetch).toHaveBeenCalledWith(endpoint, requestInit);
  });
  it('should error if no transaction is provided', async () => {
    // Act & Assert
    // @ts-expect-error - an instance of SpriteTransaction is required
    await expect(Database.commitTransaction(SESSION)).rejects.toMatchSnapshot();
  });
  it('should error for a non-204 response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 205
    } as Response);
    await expect(
      Database.commitTransaction(SESSION, TRX)
    ).rejects.toMatchSnapshot();
  });
  it('should forward errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValue(new Error('The fetch failed.'));

    await expect(
      Database.commitTransaction(SESSION, TRX)
    ).rejects.toMatchSnapshot();
  });
});
