import { client, dbClient as SpriteDatabase } from './testClient.js';
import { variables } from '../../../../variables.js';
import { SpriteTransaction } from '@/SpriteTransaction.js';

describe('ModalityBase.transaction()', () => {
  beforeEach(() => {
    jest
      .spyOn(SpriteDatabase, 'commitTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
  });
  it(`correctly passes isolationLevel argument to SpriteDatabase.newTransaction`, async () => {
    jest
      .spyOn(SpriteDatabase, 'newTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SpriteDatabase, variables.sessionId);
      });

    await client.transaction(() => {}, 'REPEATABLE_READ');

    expect(SpriteDatabase.newTransaction).toHaveBeenCalledWith(
      'REPEATABLE_READ'
    );
  });

  it(`correctly passes a new SpriteTransaction to the callback`, async () => {
    jest
      .spyOn(SpriteDatabase, 'newTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SpriteDatabase, variables.sessionId);
      });

    let transaction: SpriteTransaction | undefined = undefined;
    await client.transaction((trx) => {
      transaction = trx;
    });

    expect(transaction).toBeInstanceOf(SpriteTransaction);
  });

  it(`correctly commits the transaction before returning`, async () => {
    jest
      .spyOn(SpriteDatabase, 'newTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SpriteDatabase, variables.sessionId);
      });

    const transaction = await client.transaction(() => {});

    expect(transaction).toBe(true);
  });

  it(`it executes the callback once`, async () => {
    jest
      .spyOn(SpriteDatabase, 'newTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SpriteDatabase, variables.sessionId);
      });

    let count = 0;
    await client.transaction(() => {
      ++count;
    });

    expect(count).toBe(1);
  });

  it('throws an error if an error occurs within the callback', async () => {
    const transactionPromise = client.transaction(() => {
      throw new Error('Simulated error');
    });
    await expect(transactionPromise).rejects.toMatchSnapshot();
  });
});
