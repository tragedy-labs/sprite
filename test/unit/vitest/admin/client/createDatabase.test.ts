// Vitest
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

// Fixture
import {
    TEST_ADMIN_CLIENT,
    TEST_ADMIN_CONTEXT,
    TEST_COMMAND_INPUT,
    TEST_DATABASE_NAME,
    TEST_ERROR_PROPAGATION_MESSAGE
} from '@test/fixtures/index.js';

// Arrange
vi.mock('@/admin/static/createDatabase.js', () => {
  return { createDatabase: vi.fn(() => TEST_DATABASE_NAME) };
});

// Import once dependencies are mocked
const { createDatabase } = await import('@/admin/static/createDatabase.js');

describe('ArcadeDatabaseClient.createDatabase()', async () => {
  afterEach(() => vi.mocked(createDatabase).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call createDatabase() with the ArcadeAdminContext and the database name', async () => {
    // Act
    await TEST_ADMIN_CLIENT.createDatabase(TEST_DATABASE_NAME);
    // Assert
    expect(vi.mocked(createDatabase)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      TEST_DATABASE_NAME
    );
  });

  it('should return the output of createDatabase()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.createDatabase(TEST_DATABASE_NAME);

    // Assert
    expect(result).toBe(TEST_DATABASE_NAME);
  });

  it('should propagate errors from createDatabase()', async () => {
    // Arrange
    vi.mocked(createDatabase).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(
      TEST_ADMIN_CLIENT.createDatabase(TEST_COMMAND_INPUT)
    ).rejects.toThrow(TEST_ERROR_PROPAGATION_MESSAGE);
  });
});
