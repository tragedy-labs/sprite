// Lib
import { Routes } from '@/database/routes.js';
import { Transaction } from '@/transaction/Transaction.js';

// Testing
import {
  variables,
  headersWithTransaction as headers,
  TestDatabaseSession as SESSION,
  testTransaction as TRX
} from '@test/variables.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.ROLLBACK}/${variables.databaseName}`;

describe('SpriteTransaction.rollback()', () => {
  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204
    } as Response);
    await Transaction.rollback(SESSION, TRX);

    // TODO: I don't like using a null body
    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      body: null,
      headers,
      keepalive: true
    };

    expect(global.fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
  });
  it('should error for a non-204 response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 205
    } as Response);
    await expect(Transaction.rollback(SESSION, TRX)).rejects.toMatchSnapshot();
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
    await expect(Transaction.rollback(SESSION, TRX)).rejects.toMatchSnapshot();
  });
  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new Error('Generic Error For Testing'));
    await expect(
      // @ts-expect-error - testing error
      Transaction.rollback(SESSION, '')
    ).rejects.toMatchSnapshot();
  });
});
