// Lib
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';
import { Routes } from '@/database/routes.js';

// Testing
import {
  TestDatabaseSession as SESSION,
  headers,
  testAuth,
  variables
} from '@test/variables.js';
import { Transaction } from '@/transaction/Transaction.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.BEGIN}/${variables.databaseName}`;

describe('Database.beginTransaction()', () => {
  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204,
      headers: new Headers({
        'arcadedb-session-id': variables.sessionId
      })
    } as Response);
    await Transaction.begin(SESSION);

    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers,
      body: null,
      keepalive: true
    };

    expect(global.fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
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
    await Transaction.begin(SESSION, 'REPEATABLE_READ');

    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        isolationLevel: 'REPEATABLE_READ'
      }),
      keepalive: true
    };

    expect(global.fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
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
    const trx = await Transaction.begin(SESSION);

    expect(trx).toBeInstanceOf(SpriteTransaction);
  });

  it('should error if it receives a non-204 response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 205
    } as Response);
    await expect(Transaction.begin(SESSION)).rejects.toMatchSnapshot();
  });

  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('fetch failed'));

    await expect(Transaction.begin(SESSION)).rejects.toMatchSnapshot();
  });

  it('should error if the headers do not contain an arcadedb-session-id', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204
    } as Response);
    const trxPromise = Transaction.begin(SESSION);
    await expect(trxPromise).rejects.toMatchSnapshot();
  });
});
