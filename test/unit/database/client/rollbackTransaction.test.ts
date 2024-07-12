import { client } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import { variables, testAuth } from '../../../variables.js';

describe('SpriteDatabase.rollbackTransaction()', () => {
  it(`should make a properly formatted POST request to ${endpoints.rollbackTransaction}/${variables.databaseName}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204
    } as Response);
    await client.rollbackTransaction(variables.sessionId);

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.rollbackTransaction}/${variables.databaseName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${testAuth}`,
          'Content-Type': 'application/json',
          'arcadedb-session-id': variables.sessionId
        }
      }
    );
  });
  it('should error for a non-204 response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 205
    } as Response);
    await expect(
      client.rollbackTransaction(variables.sessionId)
    ).rejects.toMatchSnapshot();
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
    await expect(client.rollbackTransaction('')).rejects.toMatchSnapshot();
  });
  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new Error('Generic Error For Testing'));
    await expect(client.rollbackTransaction('')).rejects.toMatchSnapshot();
  });
});
