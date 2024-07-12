import { client, dbClient as SpriteDatabase } from './testClient.js';
import { variables } from '../../../../variables.js';
import { SpriteTransaction } from '../../../../../src/SpriteTransaction.js';

describe('ModalityBase.newTransaction()', () => {
  it(`correctly passes all options to SpriteDatabase.newTransaction`, async () => {
    jest
      .spyOn(SpriteDatabase, 'newTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SpriteDatabase, variables.sessionId);
      });

    await client.newTransaction('REPEATABLE_READ');

    expect(SpriteDatabase.newTransaction).toHaveBeenCalledWith(
      'REPEATABLE_READ'
    );
  });

  it(`returns an instance of SpriteTransaction`, async () => {
    jest
      .spyOn(SpriteDatabase, 'newTransaction')
      .mockImplementationOnce(async (): Promise<SpriteTransaction> => {
        return new SpriteTransaction(SpriteDatabase, variables.sessionId);
      });

    const trx = await client.newTransaction('REPEATABLE_READ');

    expect(trx).toBeInstanceOf(SpriteTransaction);
  });
});
