// Lib
import { Database } from '@/database/Database.js';
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';

// Testing
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteTransaction.commit()', () => {
  it('should send the provided sessionId to SpriteDatabase.commitTransaction()', async () => {
    jest
      .spyOn(Database, 'commitTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
    const TRX = new SpriteTransaction(SESSION, variables.sessionId);

    await TRX.commit();

    expect(Database.commitTransaction).toHaveBeenCalledWith(SESSION, TRX);
  });
  it('should update the committed status)', async () => {
    jest
      .spyOn(Database, 'commitTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
    const transaction = new SpriteTransaction(SESSION, variables.sessionId);

    await transaction.commit();

    expect(transaction.committed).toBe(true);
  });
});
