import { client } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import { variables, testAuth } from '../../../variables.js';

describe('SpriteDatabase.query()', () => {
  it(`should make a properly formatted POST request to ${endpoints.query}/${variables.databaseName}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);
    await client.query('gremlin', variables.nonEmptyString);

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.query}/${variables.databaseName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${testAuth}`,
          'Content-Type': 'application/json'
        },
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
    const result = await client.query('gremlin', variables.nonEmptyString);
    expect(result).toMatchSnapshot();
  });

  it('should handle a 400 response by throwing an error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 400
    } as Response);
    await expect(
      client.query('sql', variables.nonEmptyString)
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
      client.query('gremlin', variables.nonEmptyString)
    ).rejects.toMatchSnapshot();
  });

  it('should handle an unexpected status code by throwing an error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 418,
      statusText: variables.nonEmptyString
    } as Response);
    await expect(
      client.query('gremlin', variables.nonEmptyString)
    ).rejects.toMatchSnapshot();
  });
});
