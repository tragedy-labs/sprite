import {
    TEST_DATABASE_CONTEXT,
    TEST_ERROR_PROPAGATION_MESSAGE
} from '@test/fixtures/index.js';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Arrange
vi.mock('@/database/static/exists.js', () => {
  return {
    exists: vi.fn(async () => true)
  };
});

// Import once dependencies are mocked
const { exists } = await import('@/database/static/exists.js');
const { ArcadeDatabaseClient } = await import(
  '@/database/ArcadeDatabaseClient.js'
);
const TEST_DATABASE_CLIENT = new ArcadeDatabaseClient(TEST_DATABASE_CONTEXT);

describe('ArcadeDatabaseClient.exists()', async () => {
  beforeEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it('should call exists() with the ArcadeDatabaseContext', async () => {
    // Act
    await TEST_DATABASE_CLIENT.exists();
    // Asserts
    expect(vi.mocked(exists)).toHaveBeenCalledWith(TEST_DATABASE_CONTEXT);
  });

  it('should return the output of exists()', async () => {
    // Arrange
    const result = await TEST_DATABASE_CLIENT.exists();
    // Asserts
    expect(result).toBe(true);
  });

  it('should propagate errors from exists', async () => {
    // Arrange
    vi.mocked(exists).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(TEST_DATABASE_CLIENT.exists()).rejects.toThrow(
      TEST_ERROR_PROPAGATION_MESSAGE
    );
  });
});
