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
vi.mock('@/admin/static/openDatabase.js', () => {
  return { openDatabase: vi.fn(() => TEST_DATABASE_NAME) };
});

// Import once dependencies are mocked
const { openDatabase } = await import('@/admin/static/openDatabase.js');

describe('ArcadeDatabaseClient.openDatabase()', async () => {
  afterEach(() => vi.mocked(openDatabase).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call openDatabase() with the ArcadeAdminContext and the database name', async () => {
    // Act
    await TEST_ADMIN_CLIENT.openDatabase(TEST_DATABASE_NAME);
    // Assert
    expect(vi.mocked(openDatabase)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      TEST_DATABASE_NAME
    );
  });

  it('should return the output of openDatabase()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.openDatabase(TEST_DATABASE_NAME);

    // Assert
    expect(result).toBe(TEST_DATABASE_NAME);
  });

  it('should propagate errors from openDatabase()', async () => {
    // Arrange
    vi.mocked(openDatabase).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(
      TEST_ADMIN_CLIENT.openDatabase(TEST_COMMAND_INPUT)
    ).rejects.toThrow(TEST_ERROR_PROPAGATION_MESSAGE);
  });
});
