// Vitest
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

// Fixture
import {
  TEST_ADMIN_CLIENT,
  TEST_ADMIN_CONTEXT,
  TEST_ERROR_PROPAGATION_MESSAGE,
  TEST_USER_PARAMS
} from '@test/fixtures/index.js';

// Arrange
vi.mock('@/admin/static/dropUser.js', () => {
  return { dropUser: vi.fn(() => TEST_USER_PARAMS.username) };
});

// Import once dependencies are mocked
const { dropUser } = await import('@/admin/static/dropUser.js');

describe('ArcadeDatabaseClient.dropUser()', async () => {
  afterEach(() => vi.mocked(dropUser).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call dropUser() with the ArcadeAdminContext and the database name', async () => {
    // Act
    await TEST_ADMIN_CLIENT.dropUser(TEST_USER_PARAMS.username);
    // Assert
    expect(vi.mocked(dropUser)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      TEST_USER_PARAMS.username
    );
  });

  it('should return the output of dropUser()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.dropUser(TEST_USER_PARAMS.username);

    // Assert
    expect(result).toBe(TEST_USER_PARAMS.username);
  });

  it('should propagate errors from dropUser()', async () => {
    // Arrange
    vi.mocked(dropUser).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(
      TEST_ADMIN_CLIENT.dropUser(TEST_USER_PARAMS.username)
    ).rejects.toThrow(TEST_ERROR_PROPAGATION_MESSAGE);
  });
});
