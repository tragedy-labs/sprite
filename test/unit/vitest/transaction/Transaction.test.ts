import { SESSION_ID, TEST_DATABASE_CONTEXT } from '@test/fixtures/index.js';
import { afterAll, afterEach, describe, expect, test, vi } from 'vitest';

vi.mock('@/database/transaction/commitTransaction', () => {
  return {
    commitTransaction: vi.fn(async () => true)
  };
});

vi.mock('@/database/transaction/rollbackTransaction', () => {
  return {
    rollbackTransaction: vi.fn(async () => true)
  };
});

describe('Transaction', async () => {
  const { Transaction } = await import('@/database/transaction/Transaction.js');

  afterEach(vi.resetAllMocks);

  afterAll(() => {
    vi.restoreAllMocks();
  });
  test('commit calls commitTransaction', async () => {
    const trx = new Transaction(TEST_DATABASE_CONTEXT, SESSION_ID);

    const result = await trx.commit();

    expect(result).toBe(true);

    const { commitTransaction } = await import(
      '@/database/transaction/commitTransaction.js'
    );
    expect(vi.mocked(commitTransaction)).toHaveBeenCalledTimes(1);
  });

  test('rollback calls rollbackTransaction', async () => {
    const trx = new Transaction(TEST_DATABASE_CONTEXT, SESSION_ID);

    const result = await trx.rollback();

    expect(result).toBe(true);

    const { rollbackTransaction } = await import(
      '@/database/transaction/rollbackTransaction.js'
    );
    expect(vi.mocked(rollbackTransaction)).toHaveBeenCalledTimes(1);
  });
});
