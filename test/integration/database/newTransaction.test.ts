import { SpriteTransaction } from '../../../src/SpriteTransaction.js';
import { TRANSACTION_ID_REGEX } from '../regex.js';
import { testClient as client } from './testClient.js';

const regex = TRANSACTION_ID_REGEX;

describe('SpriteDatabase.newTransaction', () => {
  it('has a valid transaction ID', async () => {
    const transaction = await client.newTransaction();
    expect(transaction).toBeInstanceOf(SpriteTransaction); // Ensure transaction is an instance of SpriteTransaction
    expect(transaction.id).toMatch(regex); // Check if transaction ID matches the regex pattern
  });
});
