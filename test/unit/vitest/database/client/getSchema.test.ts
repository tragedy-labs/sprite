import {
    TEST_DATABASE_CONTEXT,
    TEST_ERROR_PROPAGATION_MESSAGE
} from '@test/fixtures/index.js';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Arrange
vi.mock('@/database/static/getSchema.js', () => {
  return {
    getSchema: vi.fn(async () => true)
  };
});

// Import once dependencies are mocked
const { getSchema } = await import('@/database/static/getSchema.js');
const { ArcadeDatabaseClient } = await import(
  '@/database/ArcadeDatabaseClient.js'
);
const TEST_DATABASE_CLIENT = new ArcadeDatabaseClient(TEST_DATABASE_CONTEXT);

describe('ArcadeDatabaseClient.getSchema()', async () => {
  beforeEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it('should call getSchema() with the ArcadeDatabaseContext', async () => {
    // Act
    await TEST_DATABASE_CLIENT.getSchema();
    // Asserts
    expect(vi.mocked(getSchema)).toHaveBeenCalledWith(TEST_DATABASE_CONTEXT);
  });

  it('should return the output of getSchema()', async () => {
    // Arrange
    const result = await TEST_DATABASE_CLIENT.getSchema();
    // Asserts
    expect(result).toBe(true);
  });

  it('should propagate errors from getSchema', async () => {
    // Arrange
    vi.mocked(getSchema).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(TEST_DATABASE_CLIENT.getSchema()).rejects.toThrow(
      TEST_ERROR_PROPAGATION_MESSAGE
    );
  });
});
