// Lib
import { Database } from '@/database/Database.js';
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';

// Testing
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteDatabase.transaction()', () => {
  beforeEach(() => {
    jest
      .spyOn(Database, 'commitTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
  });
  it(`correctly passes isolationLevel argument to SpriteDatabase.newTransaction`, async () => {
    jest
      .spyOn(Database, 'beginTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SESSION, variables.sessionId);
      });

    await Database.transaction(SESSION, async () => {}, 'REPEATABLE_READ');

    expect(Database.beginTransaction).toHaveBeenCalledWith(
      SESSION,
      'REPEATABLE_READ'
    );
  });

  it(`correctly passes a new SpriteTransaction to the callback`, async () => {
    jest
      .spyOn(Database, 'beginTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SESSION, variables.sessionId);
      });

    const [, transaction] = await Database.transaction<SpriteTransaction>(
      SESSION,
      async (trx: SpriteTransaction) => {
        return trx;
      }
    );

    expect(transaction).toBeInstanceOf(SpriteTransaction);
  });

  it(`correctly commits the transaction before returning`, async () => {
    jest
      .spyOn(Database, 'beginTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SESSION, variables.sessionId);
      });

    const [commited] = await Database.transaction(SESSION, async () => {});
    expect(commited).toBe(true);
  });

  it(`it executes the callback once`, async () => {
    jest
      .spyOn(Database, 'beginTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SESSION, variables.sessionId);
      });

    let count = 0;
    await Database.transaction(SESSION, async () => {
      ++count;
    });

    expect(count).toBe(1);
  });

  // TODO: Maybe the boolean value should be the first value in the touple
  it('if the transaction is rolled back it returns a touple containing the transactions return value, and a boolean false value', async () => {
    jest
      .spyOn(Database, 'beginTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SESSION, variables.sessionId);
      });

    jest
      .spyOn(Database, 'rollbackTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });

    const [bool, trx] = await Database.transaction(
      SESSION,
      async (trx: SpriteTransaction) => {
        await trx.rollback();
        return trx;
      }
    );
    expect(bool).toBe(false);
    expect(trx).toBeInstanceOf(SpriteTransaction);
    expect(trx.rolledBack).toBe(true);
  });

  it('if an error occurs within the callback it rolls back the transaction', async () => {
    jest
      .spyOn(Database, 'beginTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SESSION, variables.sessionId);
      });

    jest
      .spyOn(Database, 'rollbackTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });

    await expect(
      Database.transaction(SESSION, async () => {
        throw new Error('Simulated error');
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('throws an error if an error occurs within the callback', async () => {
    jest
      .spyOn(Database, 'beginTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SESSION, variables.sessionId);
      });
    const transactionPromise = Database.transaction(SESSION, () => {
      throw new Error('Simulated error');
    });
    await expect(transactionPromise).rejects.toMatchSnapshot();
  });

  it('rollsback the transaction if an error occurs within the error handling', async () => {
    jest
      .spyOn(Database, 'beginTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SESSION, variables.sessionId);
      });

    jest
      .spyOn(Database, 'rollbackTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });

    let transaction: SpriteTransaction | undefined;

    const transactionPromise = Database.transaction(
      SESSION,
      async (trx: SpriteTransaction) => {
        transaction = trx;
        throw new Error('Simulated error');
      }
    );

    await expect(transactionPromise).rejects.toThrowErrorMatchingSnapshot();
    expect(transaction?.rolledBack).toBe(true);
  });

  it('throws an error if the transaction fails to rollback in the error handling', async () => {
    jest
      .spyOn(Database, 'beginTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SESSION, variables.sessionId);
      });

    jest
      .spyOn(Database, 'rollbackTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        throw new Error('Simulated error');
      });

    await expect(
      Database.transaction(SESSION, async () => {
        throw new Error('Simulated error');
      })
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
