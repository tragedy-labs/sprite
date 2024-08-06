// Lib
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';

// Testing
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteTransaction.committed', () => {
  it('should store the committed status)', async () => {
    const transaction = new SpriteTransaction(SESSION, variables.sessionId);

    expect(transaction.committed).toBe(false);
  });
});
