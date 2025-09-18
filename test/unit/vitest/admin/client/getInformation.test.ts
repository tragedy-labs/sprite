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
vi.mock('@/admin/static/getServerInformation.js', () => {
  return { getServerInformation: vi.fn(() => TEST_JSON_RESPONSE) };
});

// Import once dependencies are mocked
const { getServerInformation } = await import(
  '@/admin/static/getServerInformation.js'
);

describe('ArcadeAdminClient.getInformation()', async () => {
  afterEach(() => vi.mocked(getServerInformation).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call getServerInformation() with the ArcadeAdminContext and no mode value', async () => {
    // Act
    await TEST_ADMIN_CLIENT.getInformation();

    // Assert
    expect(vi.mocked(getServerInformation)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      undefined
    );
  });
  it('should call getServerInformation() with the ArcadeAdminContext and basic mode', async () => {
    // Act
    await TEST_ADMIN_CLIENT.getInformation('basic');

    // Assert
    expect(vi.mocked(getServerInformation)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      'basic'
    );
  });

  it('should call getServerInformation() with the ArcadeAdminContext and default mode', async () => {
    // Act
    await TEST_ADMIN_CLIENT.getInformation('default');

    // Assert
    expect(vi.mocked(getServerInformation)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      'default'
    );
  });

  it('should call getServerInformation() with the ArcadeAdminContext and cluster mode', async () => {
    // Act
    await TEST_ADMIN_CLIENT.getInformation('cluster');

    // Assert
    expect(vi.mocked(getServerInformation)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      'cluster'
    );
  });

  it('should return the output of getServerInformation()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.getInformation();

    // Assert
    expect(result).toBe(TEST_JSON_RESPONSE);
  });

  it('should propagate errors from getServerInformation()', async () => {
    // Arrange
    vi.mocked(getServerInformation).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(TEST_ADMIN_CLIENT.getInformation()).rejects.toThrow(
      TEST_ERROR_PROPAGATION_MESSAGE
    );
  });
});
