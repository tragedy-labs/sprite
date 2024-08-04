// Lib
import { Database, Dialect } from '@/database/Database.js';
import { Routes } from '@/database/routes.js';

// Testing
import {
  TestDatabaseSession as SESSION,
  headers,
  variables
} from '@test/variables.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.QUERY}/${variables.databaseName}`;

describe('Database.query()', () => {
  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);
    await Database.query(SESSION, Dialect.GREMLIN, variables.nonEmptyString);

    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        language: Dialect.GREMLIN,
        command: variables.nonEmptyString
      }),
      keepalive: true
    };

    expect(global.fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
  });

  it('should handle a 200 response by returning the data from the response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);
    const result = await Database.query(
      SESSION,
      Dialect.GREMLIN,
      variables.nonEmptyString
    );
    expect(result).toMatchSnapshot();
  });

  it('should handle a 400 response by throwing an error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 400
    } as Response);
    await expect(
      Database.query(SESSION, Dialect.GREMLIN, variables.nonEmptyString)
    ).rejects.toMatchSnapshot();
  });

  it('should handle a 500 response by throwing an error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 500,
      json: async () => ({
        error: 'Internal error',
        detail: 'Database \u0027school\u0027 is not available',
        exception: 'com.arcadedb.exception.DatabaseOperationException'
      })
    } as Response);
    await expect(
      Database.query(SESSION, Dialect.GREMLIN, variables.nonEmptyString)
    ).rejects.toMatchSnapshot();
  });

  it('should handle an unexpected status code by throwing an error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 418,
      statusText: variables.nonEmptyString
    } as Response);
    await expect(
      Database.query(SESSION, Dialect.GREMLIN, variables.nonEmptyString)
    ).rejects.toMatchSnapshot();
  });
});
