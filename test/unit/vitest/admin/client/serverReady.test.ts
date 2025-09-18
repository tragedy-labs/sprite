// Vitest
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

// Fixture
import {
  TEST_ADMIN_CLIENT,
  TEST_ADMIN_CONTEXT,
  TEST_ERROR_PROPAGATION_MESSAGE
} from '@test/fixtures/index.js';

// Arrange
vi.mock('@/admin/static/serverReady.js', () => {
  return { serverReady: vi.fn(() => true) };
});

// Import once dependencies are mocked
const { serverReady } = await import('@/admin/static/serverReady.js');

describe('ArcadeAdminClient.serverReady()', async () => {
  afterEach(() => vi.mocked(serverReady).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call serverShutdown() with the ArcadeAdminContext', async () => {
    // Act
    await TEST_ADMIN_CLIENT.serverReady();
    // Assert
    expect(vi.mocked(serverReady)).toHaveBeenCalledWith(TEST_ADMIN_CONTEXT);
  });

  it('should return the output of serverReady()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.serverReady();

    // Assert
    expect(result).toBe(true);
  });

  it('should propagate errors from serverReady()', async () => {
    // Arrange
    vi.mocked(serverReady).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(TEST_ADMIN_CLIENT.serverReady()).rejects.toThrow(
      TEST_ERROR_PROPAGATION_MESSAGE
    );
  });
});
