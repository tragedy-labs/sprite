import {
  TEST_ADMIN_CONTEXT,
  TEST_COMMAND_INPUT,
  TEST_COMMAND_OUTPUT,
  TEST_ERROR_PROPAGATION_MESSAGE
} from '@test/fixtures/index.js';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Arrange
vi.mock('@/admin/static/adminCommand.js', () => {
  return {
    adminCommand: vi.fn(async () => TEST_COMMAND_OUTPUT)
  };
});

// Import once dependencies are mocked
const { adminCommand } = await import('@/admin/static/adminCommand.js');
const { ArcadeAdminClient } = await import('@/admin/ArcadeAdminClient.js');
const TEST_ADMIN_CLIENT = new ArcadeAdminClient(TEST_ADMIN_CONTEXT);

describe('ArcadeDatabaseClient.command()', async () => {
  beforeEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it('should call adminCommand() with the given command, and the ArcadeDatabaseContext', async () => {
    // Act
    await TEST_ADMIN_CLIENT.command(TEST_COMMAND_INPUT);

    // Assert
    expect(vi.mocked(adminCommand)).toHaveBeenCalledWith(
      TEST_ADMIN_CONTEXT,
      TEST_COMMAND_INPUT
    );
  });

  it('should return the output of adminCommand()', async () => {
    // Arrange
    const result = await TEST_ADMIN_CLIENT.command(TEST_COMMAND_INPUT);

    // Assert
    expect(result).toBe(TEST_COMMAND_OUTPUT);
  });

  it('should propagate errors from adminCommand', async () => {
    // Arrange
    vi.mocked(adminCommand).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(TEST_ADMIN_CLIENT.command(TEST_COMMAND_INPUT)).rejects.toThrow(
      TEST_ERROR_PROPAGATION_MESSAGE
    );
  });
});
