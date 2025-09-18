// Vitest
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

// Fixture
import {
    TEST_ADMIN_CLIENT,
    TEST_ADMIN_CONTEXT,
    TEST_ERROR_PROPAGATION_MESSAGE
} from '@test/fixtures/index.js';

// Arrange
vi.mock('@/admin/static/serverShutdown.js', () => {
  return { serverShutdown: vi.fn(() => true) };
});

// Import once dependencies are mocked
const { serverShutdown } = await import('@/admin/static/serverShutdown.js');

describe('ArcadeAdminClient.shutdown()', async () => {
  afterEach(() => vi.mocked(serverShutdown).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call serverShutdown() with the ArcadeAdminContext', async () => {
    // Act
    await TEST_ADMIN_CLIENT.shutdown();
    // Assert
    expect(vi.mocked(serverShutdown)).toHaveBeenCalledWith(TEST_ADMIN_CONTEXT);
  });

  it('should return the output of serverShutdown()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.shutdown();

    // Assert
    expect(result).toBe(true);
  });

  it('should propagate errors from serverShutdown()', async () => {
    // Arrange
    vi.mocked(serverShutdown).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(TEST_ADMIN_CLIENT.shutdown()).rejects.toThrow(
      TEST_ERROR_PROPAGATION_MESSAGE
    );
  });
});
