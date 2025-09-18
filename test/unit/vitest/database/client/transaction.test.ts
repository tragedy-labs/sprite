import {
  TEST_DATABASE_CONTEXT,
  TEST_ERROR_PROPAGATION_MESSAGE
} from '@test/fixtures/index.js';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Arrange
vi.mock('@/database/transaction/manageTransaction.js', () => {
  return {
    manageTransaction: vi.fn(async () => true)
  };
});

// Import once dependencies are mocked
const { manageTransaction } = await import(
  '@/database/transaction/manageTransaction.js'
);
const { ArcadeDatabaseClient } = await import(
  '@/database/ArcadeDatabaseClient.js'
);
const TEST_DATABASE_CLIENT = new ArcadeDatabaseClient(TEST_DATABASE_CONTEXT);
const TEST_CALLBACK = async () => true;

describe('ArcadeDatabaseClient.transaction()', async () => {
  beforeEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it('should call manageTransaction() with the ArcadeDatabaseContext', async () => {
    // Act
    await TEST_DATABASE_CLIENT.transaction(TEST_CALLBACK);
    // Asserts
    expect(vi.mocked(manageTransaction)).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT,
      TEST_CALLBACK,
      undefined
    );
  });

  it('should call manageTransaction() with READ_COMMITED if supplied as an argument', async () => {
    // Act
    await TEST_DATABASE_CLIENT.transaction(TEST_CALLBACK, 'READ_COMMITTED');
    // Asserts
    expect(vi.mocked(manageTransaction)).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT,
      TEST_CALLBACK,
      'READ_COMMITTED'
    );
  });

  it('should call manageTransaction() with REPEATABLE_READ if supplied as an argument', async () => {
    // Act
    await TEST_DATABASE_CLIENT.transaction(TEST_CALLBACK, 'REPEATABLE_READ');
    // Asserts
    expect(vi.mocked(manageTransaction)).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT,
      TEST_CALLBACK,
      'REPEATABLE_READ'
    );
  });

  it('should return the output of transaction()', async () => {
    // Arrange
    const result = await TEST_DATABASE_CLIENT.transaction(TEST_CALLBACK);
    // Asserts
    expect(result).toBe(true);
  });

  it('should propagate errors from transaction', async () => {
    // Arrange
    vi.mocked(manageTransaction).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(
      TEST_DATABASE_CLIENT.transaction(TEST_CALLBACK)
    ).rejects.toThrow(TEST_ERROR_PROPAGATION_MESSAGE);
  });
});
