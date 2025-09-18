import {
  TEST_COMMAND_INPUT,
  TEST_DATABASE_CONTEXT,
  TEST_ERROR_PROPAGATION_MESSAGE
} from '@test/fixtures/index.js';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Arrange
vi.mock('@/database/static/explain.js', () => {
  return {
    explain: vi.fn(async () => true)
  };
});

// Import once dependencies are mocked
const { explain } = await import('@/database/static/explain.js');
const { ArcadeDatabaseClient } = await import(
  '@/database/ArcadeDatabaseClient.js'
);
const TEST_DATABASE_CLIENT = new ArcadeDatabaseClient(TEST_DATABASE_CONTEXT);

describe('ArcadeDatabaseClient.explain()', async () => {
  beforeEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it('should call explain() with the ArcadeDatabaseContext', async () => {
    // Act
    await TEST_DATABASE_CLIENT.explain(TEST_COMMAND_INPUT);
    // Asserts
    expect(vi.mocked(explain)).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT,
      TEST_COMMAND_INPUT
    );
  });

  it('should return the output of explain()', async () => {
    // Arrange
    const result = await TEST_DATABASE_CLIENT.explain(TEST_COMMAND_INPUT);
    // Asserts
    expect(result).toBe(true);
  });

  it('should propagate errors from explain', async () => {
    // Arrange
    vi.mocked(explain).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(
      TEST_DATABASE_CLIENT.explain(TEST_COMMAND_INPUT)
    ).rejects.toThrow(TEST_ERROR_PROPAGATION_MESSAGE);
  });
});
