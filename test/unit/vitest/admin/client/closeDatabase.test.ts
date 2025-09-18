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
vi.mock('@/admin/static/closeDatabase.js', () => {
  return { closeDatabase: vi.fn(() => TEST_DATABASE_NAME) };
});

// Import once dependencies are mocked
const { closeDatabase } = await import('@/admin/static/closeDatabase.js');

describe('ArcadeDatabaseClient.closeDatabase()', async () => {
  afterEach(() => vi.mocked(closeDatabase).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call closeDatabase() with the ArcadeAdminContext and the database name', async () => {
    // Act
    await TEST_ADMIN_CLIENT.closeDatabase(TEST_DATABASE_NAME);
    // Assert
    expect(vi.mocked(closeDatabase)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      TEST_DATABASE_NAME
    );
  });

  it('should return the output of closeDatabase()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.closeDatabase(TEST_DATABASE_NAME);

    // Assert
    expect(result).toBe(TEST_DATABASE_NAME);
  });

  it('should propagate errors from closeDatabase()', async () => {
    // Arrange
    vi.mocked(closeDatabase).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(
      TEST_ADMIN_CLIENT.closeDatabase(TEST_COMMAND_INPUT)
    ).rejects.toThrow(TEST_ERROR_PROPAGATION_MESSAGE);
  });
});
