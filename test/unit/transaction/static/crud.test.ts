// Lib
import { Dialect } from '@/database/Database.js';
import { Routes } from '@/database/routes.js';
import { Rest } from '@/rest/Rest.js';
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';
import { Transaction } from '@/transaction/Transaction.js';

// Testing
import {
  TestDatabaseSession as SESSION,
  headersWithTransaction as headers,
  variables
} from '@test/variables.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.COMMAND}/${variables.databaseName}`;

describe('SpriteTransaction.crud()', () => {
  it(`should make a properly formatted POST request to ${ENDPOINT}, and returns the result of the post request`, async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);

    const TRX = new SpriteTransaction(SESSION, variables.sessionId);
    const PARAMS = { test: 'Params' };

    // Act
    const result = await Transaction.crud(
      SESSION,
      TRX,
      Dialect.SQL,
      variables.nonEmptyString,
      PARAMS
    );

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        language: Dialect.SQL,
        command: variables.nonEmptyString,
        params: PARAMS
      }),
      keepalive: true
    });
    expect(result).toEqual(variables.jsonResponse.result);
  });

  it('forwards errors from internal methods', async () => {
    // Arrange
    jest.spyOn(Rest, 'postJson').mockImplementationOnce(() => {
      throw new Error('Simulated Error');
    });

    // Act
    const TRX = new SpriteTransaction(SESSION, variables.sessionId);
    const crudPromise = TRX.crud(Dialect.SQL, variables.nonEmptyString);

    // Assert
    await expect(crudPromise).rejects.toMatchSnapshot();
  });
});
