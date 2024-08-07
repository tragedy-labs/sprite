// Lib
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';
import { Transaction } from '@/transaction/Transaction.js';

// Testing
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteTransaction.commit()', () => {
  it('should send the provided sessionId to Transaction.commit()', async () => {
    jest
      .spyOn(Transaction, 'commit')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
    const TRX = new SpriteTransaction(SESSION, variables.sessionId);

    await TRX.commit();

    expect(Transaction.commit).toHaveBeenCalledWith(SESSION, TRX);
  });
  it('should update the committed status)', async () => {
    jest
      .spyOn(Transaction, 'commit')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
    const transaction = new SpriteTransaction(SESSION, variables.sessionId);

    await transaction.commit();

    expect(transaction.committed).toBe(true);
  });
});
