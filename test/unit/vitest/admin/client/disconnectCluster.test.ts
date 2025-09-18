// Vitest
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

// Fixture
import {
  TEST_ADMIN_CLIENT,
  TEST_ADMIN_CONTEXT,
  TEST_DATABASE_NAME,
  TEST_ERROR_PROPAGATION_MESSAGE
} from '@test/fixtures/index.js';

// Arrange
vi.mock('@/admin/static/disconnectCluster.js', () => {
  return { disconnectCluster: vi.fn(() => TEST_DATABASE_NAME) };
});

// Import once dependencies are mocked
const { disconnectCluster } = await import(
  '@/admin/static/disconnectCluster.js'
);

describe('ArcadeDatabaseClient.disconnectCluster()', async () => {
  afterEach(() => vi.mocked(disconnectCluster).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call disconnectCluster() with the ArcadeAdminContext', async () => {
    // Act
    await TEST_ADMIN_CLIENT.disconnectCluster();
    // Assert
    expect(vi.mocked(disconnectCluster)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT
    );
  });

  it('should return the output of disconnectCluster()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.disconnectCluster();

    // Assert
    expect(result).toBe(TEST_DATABASE_NAME);
  });

  it('should propagate errors from disconnectCluster()', async () => {
    // Arrange
    vi.mocked(disconnectCluster).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(TEST_ADMIN_CLIENT.disconnectCluster()).rejects.toThrow(
      TEST_ERROR_PROPAGATION_MESSAGE
    );
  });
});
