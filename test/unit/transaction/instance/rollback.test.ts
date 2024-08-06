// Lib
import { Database } from '@/database/Database.js';
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';

// Testing
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteTransaction.rollback()', () => {
  it('should send the provided sessionId to SpriteDatabase.rollbackTransaction()', async () => {
    jest
      .spyOn(Database, 'rollbackTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
    const TRX = new SpriteTransaction(SESSION, variables.sessionId);

    await TRX.rollback();

    expect(Database.rollbackTransaction).toHaveBeenCalledWith(SESSION, TRX);
  });
  it('should return the result of SpriteDatabase.rollbackTransaction()', async () => {
    jest
      .spyOn(Database, 'rollbackTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
    const transaction = new SpriteTransaction(SESSION, variables.sessionId);

    const result = await transaction.rollback();

    expect(result).toBe(true);
  });
});
