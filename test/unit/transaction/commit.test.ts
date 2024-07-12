import { SpriteTransaction } from '../../../src/SpriteTransaction.js';
import { variables } from '../../variables.js';
import { client as SpriteDatabase } from '../database/client/testClient.js';

describe('SpriteTransaction.commit()', () => {
  it('should send the provided sessionId to SpriteDatabase.commitTransaction()', async () => {
    jest
      .spyOn(SpriteDatabase, 'commitTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
    const transaction = new SpriteTransaction(
      SpriteDatabase,
      variables.sessionId
    );

    await transaction.commit();

    expect(SpriteDatabase.commitTransaction).toHaveBeenCalledWith(
      variables.sessionId
    );
  });
  it('should update the committed status)', async () => {
    jest
      .spyOn(SpriteDatabase, 'commitTransaction')
      .mockImplementationOnce(async (): Promise<boolean> => {
        return true;
      });
    const transaction = new SpriteTransaction(
      SpriteDatabase,
      variables.sessionId
    );

    await transaction.commit();

    expect(transaction.committed).toBe(true);
  });
});
