// Lib
import { Database, Dialect } from '@/database/Database.js';
import { Routes } from '@/database/routes.js';

// Testing
import {
  variables,
  TestDatabaseSession as SESSION,
  headers
} from '@test/variables.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.QUERY}/${variables.databaseName}`;

describe('Database.explain()', () => {
  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);

    const toExplain = 'SELECT * FROM bucketName';
    await Database.explain(SESSION, toExplain);

    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        language: Dialect.SQL,
        command: `EXPLAIN ${toExplain}`
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
    await expect(Database.explain(SESSION, '')).rejects.toMatchSnapshot();
  });
});
