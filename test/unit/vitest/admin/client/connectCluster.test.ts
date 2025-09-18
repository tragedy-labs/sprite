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
vi.mock('@/admin/static/connectCluster.js', () => {
  return { connectCluster: vi.fn(() => TEST_DATABASE_NAME) };
});

// Import once dependencies are mocked
const { connectCluster } = await import('@/admin/static/connectCluster.js');

describe('ArcadeDatabaseClient.connectCluster()', async () => {
  afterEach(() => vi.mocked(connectCluster).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call connectCluster() with the ArcadeAdminContext and the provided address', async () => {
    // Act
    await TEST_ADMIN_CLIENT.connectCluster(TEST_DATABASE_NAME);
    // Assert
    expect(vi.mocked(connectCluster)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      TEST_DATABASE_NAME
    );
  });

  it('should return the output of connectCluster()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.connectCluster(TEST_DATABASE_NAME);

    // Assert
    expect(result).toBe(TEST_DATABASE_NAME);
  });

  it('should propagate errors from connectCluster()', async () => {
    // Arrange
    vi.mocked(connectCluster).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(
      TEST_ADMIN_CLIENT.connectCluster(TEST_COMMAND_INPUT)
    ).rejects.toThrow(TEST_ERROR_PROPAGATION_MESSAGE);
  });
});
