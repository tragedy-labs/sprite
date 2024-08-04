// Lib
import { Database, Dialect } from '@/database/Database.js';
import { Routes } from '@/database/routes.js';

// Testing
import {
  variables,
  testAuth,
  TestDatabaseSession as SESSION,
  headers
} from '@test/variables.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.QUERY}/${variables.databaseName}`;

describe('Database.getSchema()', () => {
  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({ result: [] })
    } as Response);

    await Database.getSchema(SESSION);

    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        language: Dialect.SQL,
        command: `SELECT FROM schema:types`
      }),
      keepalive: true
    };

    expect(global.fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
  });
  it('should propagate errors from the server', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 500,
      json: async () => ({
        error: 'Generic Error For Testing',
        detail: 'This is just an error for testing purposes',
        exception: 'com.arcadedb.exception.AnArbitraryException'
      })
    } as Response);

    await expect(Database.getSchema(SESSION)).rejects.toMatchSnapshot();
  });
});
