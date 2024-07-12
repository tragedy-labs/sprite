import { SpriteTransaction } from '../../../src/SpriteTransaction.js';
import { variables } from '../../variables.js';
import { client as SpriteDatabase } from '../database/client/testClient.js';

describe('SpriteTransaction.committed', () => {
  it('should store the committed status)', async () => {
    const transaction = new SpriteTransaction(
      SpriteDatabase,
      variables.sessionId
    );

    expect(transaction.committed).toBe(false);
  });
});
