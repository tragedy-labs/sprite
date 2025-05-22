// Lib
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';

// Testing
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteTransaction.id', () => {
  it('should store and return the id of the transaction)', async () => {
    const transaction = new SpriteTransaction(SESSION, variables.sessionId);

    expect(transaction.id).toBe(variables.sessionId);
  });
});
