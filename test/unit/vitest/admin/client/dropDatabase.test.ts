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
vi.mock('@/admin/static/dropDatabase.js', () => {
  return { dropDatabase: vi.fn(() => TEST_DATABASE_NAME) };
});

// Import once dependencies are mocked
const { dropDatabase } = await import('@/admin/static/dropDatabase.js');

describe('ArcadeDatabaseClient.dropDatabase()', async () => {
  afterEach(() => vi.mocked(dropDatabase).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call dropDatabase() with the ArcadeAdminContext and the database name', async () => {
    // Act
    await TEST_ADMIN_CLIENT.dropDatabase(TEST_DATABASE_NAME);
    // Assert
    expect(vi.mocked(dropDatabase)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      TEST_DATABASE_NAME
    );
  });

  it('should return the output of dropDatabase()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.dropDatabase(TEST_DATABASE_NAME);

    // Assert
    expect(result).toBe(TEST_DATABASE_NAME);
  });

  it('should propagate errors from dropDatabase()', async () => {
    // Arrange
    vi.mocked(dropDatabase).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(
      TEST_ADMIN_CLIENT.dropDatabase(TEST_COMMAND_INPUT)
    ).rejects.toThrow(TEST_ERROR_PROPAGATION_MESSAGE);
  });
});
