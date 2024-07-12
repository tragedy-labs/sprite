import { SpriteTransaction } from '../../../src/SpriteTransaction.js';
import { variables } from '../../variables.js';
import { client as SpriteDatabase } from '../database/client/testClient.js';

describe('SpriteTransaction.id', () => {
  it('should store and return the id of the transaction)', async () => {
    const transaction = new SpriteTransaction(
      SpriteDatabase,
      variables.sessionId
    );

    expect(transaction.id).toBe(variables.sessionId);
  });
});
