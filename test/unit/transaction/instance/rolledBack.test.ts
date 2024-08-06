// Lib
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';

// Testing
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteTransaction.rolledBack', () => {
  it('should store the rolledBack status)', async () => {
    const transaction = new SpriteTransaction(SESSION, variables.sessionId);

    expect(transaction.rolledBack).toBe(false);
  });
});
