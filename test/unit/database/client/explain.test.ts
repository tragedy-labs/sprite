import { client } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import { variables, testAuth } from '../../../variables.js';

describe('SpriteDatabase.explain()', () => {
  it(`should make a properly formatted POST request to ${endpoints.query}/${variables.databaseName}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);
    const toExplain = 'SELECT * FROM bucketName';
    await client.explain(toExplain);

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.query}/${variables.databaseName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${testAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          language: 'sql',
          command: `EXPLAIN ${toExplain}`
        })
      }
    );
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
    await expect(client.explain('')).rejects.toMatchSnapshot();
  });
});
