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
vi.mock('@/admin/static/createUser.js', () => {
  return { createUser: vi.fn(() => TEST_USER_PARAMS.username) };
});

// Import once dependencies are mocked
const { createUser } = await import('@/admin/static/createUser.js');

describe('ArcadeDatabaseClient.createUser()', async () => {
  afterEach(() => vi.mocked(createUser).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call createUser() with the ArcadeAdminContext and the database name', async () => {
    // Act
    await TEST_ADMIN_CLIENT.createUser(TEST_USER_PARAMS);
    // Assert
    expect(vi.mocked(createUser)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      TEST_USER_PARAMS
    );
  });

  it('should return the output of createUser()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.createUser(TEST_USER_PARAMS);

    // Assert
    expect(result).toBe(TEST_USER_PARAMS.username);
  });

  it('should propagate errors from createUser()', async () => {
    // Arrange
    vi.mocked(createUser).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(
      TEST_ADMIN_CLIENT.createUser(TEST_USER_PARAMS)
    ).rejects.toThrow(TEST_ERROR_PROPAGATION_MESSAGE);
  });
});
