
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';
import { testClient as client } from './testClient.js';
import {TRANSACTION_ID_REGEX} from '@/validation/regex/TRX.js';

const regex = TRANSACTION_ID_REGEX;

describe('SpriteDatabase.newTransaction', () => {
  it('has a valid transaction ID', async () => {
    const transaction = await client.newTransaction();
    expect(transaction).toBeInstanceOf(SpriteTransaction); // Ensure transaction is an instance of SpriteTransaction
    expect(transaction.id).toMatch(regex); // Check if transaction ID matches the regex pattern
  });
});
