import { client } from './testClient.js';
import { endpoints } from '@/endpoints/database.js';
import { variables, testAuth } from '../../../variables.js';

describe('SpriteDatabase.commitTransaction()', () => {
  it(`should make a properly formatted POST request to ${endpoints.commitTransaction}/${variables.databaseName}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204
    } as Response);
    await client.commitTransaction(variables.sessionId);

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.commitTransaction}/${variables.databaseName}`,
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
  it('should error if no sessionId is provided', async () => {
    // Act & Assert
    // @ts-expect-error sessionId is required
    await expect(client.commitTransaction()).rejects.toMatchSnapshot();
  });
  it('should error for a non-204 response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 205
    } as Response);
    await expect(
      client.commitTransaction(variables.sessionId)
    ).rejects.toMatchSnapshot();
  });
});
