import { client, testTransaction } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import {
  variables,
  headersWithTransaction as headers
} from '../../../variables.js';

describe('SpriteDatabase.command()', () => {
  it(`should make a properly formatted POST request to ${endpoints.query}/${variables.databaseName}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);
    await client.command('gremlin', variables.nonEmptyString, testTransaction);

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}/${variables.databaseName}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language: 'gremlin',
          command: variables.nonEmptyString
        })
      }
    );
  });

  it('should handle a 200 response by returning the data from the response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);
    const result = await client.command(
      'gremlin',
      variables.nonEmptyString,
      testTransaction
    );
    expect(result).toMatchSnapshot();
  });

  it('should handle a 400 response by throwing an error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 400
    } as Response);
    await expect(
      // @ts-expect-error invalid language, invalid query
      client.command('invalid', variables.nonEmptyString)
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
      client.command('gremlin', variables.nonEmptyString, testTransaction)
    ).rejects.toMatchSnapshot();
  });

  it('should handle an unexpected status code by throwing an error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 999,
      statusText: variables.nonEmptyString
    } as Response);
    await expect(
      client.command('gremlin', variables.nonEmptyString, testTransaction)
    ).rejects.toMatchSnapshot();
  });
});
