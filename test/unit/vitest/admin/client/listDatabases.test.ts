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
vi.mock('@/admin/static/listDatabases.js', () => {
  return { listDatabases: vi.fn(() => TEST_JSON_RESPONSE) };
});

// Import once dependencies are mocked
const { listDatabases } = await import('@/admin/static/listDatabases.js');

describe('ArcadeDatabaseClient.listDatabases()', async () => {
  afterEach(() => vi.mocked(listDatabases).mockReset());
  afterAll(vi.restoreAllMocks);

  it('should call listDatabases() with the ArcadeAdminContext', async () => {
    // Act
    await TEST_ADMIN_CLIENT.listDatabases();
    // Assert
    expect(vi.mocked(listDatabases)).toHaveBeenCalledWith(TEST_ADMIN_CONTEXT);
  });

  it('should return the output of listDatabases()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.listDatabases();

    // Assert
    expect(result).toBe(TEST_JSON_RESPONSE);
  });

  it('should propagate errors from listDatabases()', async () => {
    // Arrange
    vi.mocked(listDatabases).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(TEST_ADMIN_CLIENT.listDatabases()).rejects.toThrow(
      TEST_ERROR_PROPAGATION_MESSAGE
    );
  });
});
