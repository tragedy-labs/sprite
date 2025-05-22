// Lib
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';
import { Transaction } from '@/transaction/Transaction.js';

// Testing
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteTransaction.rollback()', () => {
  it('should send the provided sessionId to Transaction.rollback()', async () => {
    jest
      .spyOn(Transaction, 'rollback')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
    const TRX = new SpriteTransaction(SESSION, variables.sessionId);

    await TRX.rollback();

    expect(Transaction.rollback).toHaveBeenCalledWith(SESSION, TRX);
  });
  it('should return the result of Transaction.rollback()', async () => {
    jest
      .spyOn(Transaction, 'rollback')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
    const transaction = new SpriteTransaction(SESSION, variables.sessionId);

    const result = await transaction.rollback();

    expect(result).toBe(true);
  });
});
