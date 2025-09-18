// Vitest
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

// Fixture
import {
  TEST_ADMIN_CLIENT,
  TEST_ADMIN_CONTEXT,
  TEST_ERROR_PROPAGATION_MESSAGE,
  TEST_JSON_RESPONSE
} from '@test/fixtures/index.js';

// Arrange
vi.mock('@/admin/static/getServerEvents.js', () => {
  return { getServerEvents: vi.fn(() => TEST_JSON_RESPONSE) };
});

// Import once dependencies are mocked
const { getServerEvents } = await import('@/admin/static/getServerEvents.js');

describe('ArcadeDatabaseClient.getEvents()', async () => {
  afterEach(() => vi.mocked(getServerEvents).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call getServerEvents() with the ArcadeAdminContext', async () => {
    // Act
    await TEST_ADMIN_CLIENT.getEvents();
    // Assert
    expect(vi.mocked(getServerEvents)).toHaveBeenCalledWith(TEST_ADMIN_CONTEXT);
  });

  it('should return the output of getServerEvents()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.getEvents();

    // Assert
    expect(result).toBe(TEST_JSON_RESPONSE);
  });

  it('should propagate errors from getServerEvents()', async () => {
    // Arrange
    vi.mocked(getServerEvents).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(TEST_ADMIN_CLIENT.getEvents()).rejects.toThrow(
      TEST_ERROR_PROPAGATION_MESSAGE
    );
  });
});
