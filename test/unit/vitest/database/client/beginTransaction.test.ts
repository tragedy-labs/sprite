import {
    TEST_DATABASE_CLIENT,
    TEST_DATABASE_CONTEXT,
    TEST_ERROR_PROPAGATION_MESSAGE,
    TEST_TRX
} from '@test/fixtures/index.js';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Arrange
vi.mock('@/database/transaction/beginTransaction.js', () => {
  return {
    beginTransaction: vi.fn(async () => TEST_TRX)
  };
});

// Import once mocked
const { beginTransaction } = await import(
  '@/database/transaction/beginTransaction.js'
);

describe('ArcadeDatabaseClient.beginTransaction()', async () => {
  beforeEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it('should call beginTransaction() with the unique session instance', async () => {
    // Act
    await TEST_DATABASE_CLIENT.beginTransaction();

    // Assert
    // NOTE: `undefined` because isolation level is always forwarded to the static function
    expect(vi.mocked(beginTransaction)).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT,
      undefined
    );
  });

  it('should call the Database.beginTransaction() with READ_COMMITED if supplied as an argument', async () => {
    // Act
    await TEST_DATABASE_CLIENT.beginTransaction('READ_COMMITTED');

    // Assert
    expect(vi.mocked(beginTransaction)).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT,
      'READ_COMMITTED'
    );
  });

  it('should call the Database.beginTransaction() with REPEATABLE_READ if supplied as an argument', async () => {
    // Act
    await TEST_DATABASE_CLIENT.beginTransaction('REPEATABLE_READ');

    // Assert
    expect(vi.mocked(beginTransaction)).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT,
      'REPEATABLE_READ'
    );
  });

  it('should return the output of the Database.beginTransaction() method', async () => {
    // Act
    const result = await TEST_DATABASE_CLIENT.beginTransaction();

    // Asserts
    expect(result).toBe(TEST_TRX);
  });

  it('should propagate errors from beginTransaction', async () => {
    // Arrange
    vi.mocked(beginTransaction).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(TEST_DATABASE_CLIENT.beginTransaction()).rejects.toThrow(
      TEST_ERROR_PROPAGATION_MESSAGE
    );
  });
});
