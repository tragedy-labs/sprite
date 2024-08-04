// Lib
import { Database, Dialect } from '@/database/Database.js';
import { Routes } from '@/database/routes.js';

// Test
import {
  variables,
  headers,
  TestDatabaseSession as SESSION
} from '@test/variables.js';

describe('Database.command()', () => {
  it(`should make a properly formatted POST request to ${Routes.QUERY}/${variables.databaseName}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);

    await Database.command(SESSION, Dialect.SQL, variables.nonEmptyString);

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${variables.apiRoute}${Routes.COMMAND}/${variables.databaseName}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language: Dialect.SQL,
          command: variables.nonEmptyString
        }),
        keepalive: true
      }
    );
  });

  it('should handle a 200 response by returning the data from the response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);
    const result = await Database.command(
      SESSION,
      Dialect.SQL,
      variables.nonEmptyString
    );
    expect(result).toMatchSnapshot();
  });

  it('should handle a 400 response by throwing an error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 400
    } as Response);
    await expect(
      /* @ts-expect-error - testing error */
      Database.command(SESSION, 'invalid', variables.nonEmptyString)
    ).rejects.toMatchSnapshot();
  });

  it('should handle a 500 response by throwing an error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 500,
      json: async () => ({
        error: 'Internal error',
        detail: `Database \u0027${variables.databaseName}\u0027 is not available`,
        exception: 'com.arcadedb.exception.DatabaseOperationException'
      })
    } as Response);
    await expect(
      Database.command(SESSION, Dialect.SQL, variables.nonEmptyString)
    ).rejects.toMatchSnapshot();
  });

  it('should handle an unexpected status code by throwing an error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 999,
      statusText: variables.nonEmptyString
    } as Response);
    await expect(
      Database.command(SESSION, Dialect.SQL, variables.nonEmptyString)
    ).rejects.toMatchSnapshot();
  });
});
