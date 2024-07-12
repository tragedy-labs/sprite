import { client } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import { variables, testAuth } from '../../../variables.js';
import { SpriteTransaction } from '../../../../src/SpriteTransaction.js';

describe('SpriteDatabase.newTransaction()', () => {
  it(`should make a properly formatted POST request to ${endpoints.beginTransaction}/${variables.databaseName}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204,
      headers: new Headers({
        'arcadedb-session-id': variables.sessionId
      })
    } as Response);
    await client.newTransaction();

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.beginTransaction}/${variables.databaseName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${testAuth}`,
          'Content-Type': 'application/json'
        },
        body: null
      }
    );
  });

  it(`it should pass the isolationLevel parameter to the body of the request when set to REPEATABLE_READ`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204,
      headers: new Headers({
        Authorization: `Basic ${testAuth}`,
        'Content-Type': 'application/json',
        'arcadedb-session-id': variables.sessionId
      })
    } as Response);
    await client.newTransaction('REPEATABLE_READ');

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.beginTransaction}/${variables.databaseName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${testAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isolationLevel: 'REPEATABLE_READ' })
      }
    );
  });

  it('should return an instance of SpriteTransaction', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204,
      headers: new Headers({
        Authorization: `Basic ${testAuth}`,
        'Content-Type': 'application/json',
        'arcadedb-session-id': variables.sessionId
      })
    } as Response);
    const trx = await client.newTransaction();

    expect(trx).toBeInstanceOf(SpriteTransaction);
  });

  it('should error if it receives a non-204 response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 205
    } as Response);
    await expect(client.newTransaction()).rejects.toMatchSnapshot();
  });

  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('fetch failed'));

    await expect(client.newTransaction()).rejects.toMatchSnapshot();
  });

  it('should error if the headers do not contain an arcadedb-session-id', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204
    } as Response);
    const trxPromise = client.newTransaction();
    await expect(trxPromise).rejects.toMatchSnapshot();
  });
});
