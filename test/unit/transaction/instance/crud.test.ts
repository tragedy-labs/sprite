// Lib
import { Dialect } from '@/database/Database.js';
import { Rest } from '@/rest/Rest.js';
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';
import { Transaction } from '@/transaction/Transaction.js';

// Testing
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteTransaction.crud()', () => {
  it(`should call Transaction.crud with session, transaction, language, command, and parameters`, async () => {
    // Arrange
    jest
      .spyOn(Transaction, 'crud')
      .mockResolvedValueOnce(variables.jsonResponse.result);

    const TRX = new SpriteTransaction(SESSION, variables.sessionId);
    const PARAMS = { test: 'Params' };

    // Act
    const result = await TRX.crud(
      Dialect.SQL,
      variables.nonEmptyString,
      PARAMS
    );

    // Assert
    expect(Transaction.crud).toHaveBeenCalledWith(
      SESSION,
      TRX,
      Dialect.SQL,
      variables.nonEmptyString,
      PARAMS
    );
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
