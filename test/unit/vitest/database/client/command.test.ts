import { QueryLanguages } from '@/database/index.js';
import {
  TEST_COMMAND_INPUT,
  TEST_COMMAND_INPUT_PARAMS,
  TEST_COMMAND_OUTPUT,
  TEST_DATABASE_CONTEXT,
  TEST_ERROR_PROPAGATION_MESSAGE
} from '@test/fixtures/index.js';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Arrange
vi.mock('@/database/static/arcadeCommand.js', () => {
  return {
    arcadeCommand: vi.fn(async () => TEST_COMMAND_OUTPUT)
  };
});

// Import once dependencies are mocked
const { arcadeCommand } = await import('@/database/static/arcadeCommand.js');
const { ArcadeDatabaseClient } = await import(
  '@/database/ArcadeDatabaseClient.js'
);
const TEST_DATABASE_CLIENT = new ArcadeDatabaseClient(TEST_DATABASE_CONTEXT);

describe('ArcadeDatabaseClient.command()', async () => {
  beforeEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it('should call arcadeCommand() with the given command, and the ArcadeDatabaseContext', async () => {
    // Act
    await TEST_DATABASE_CLIENT.command(
      QueryLanguages.SQL,
      TEST_COMMAND_INPUT,
      TEST_COMMAND_INPUT_PARAMS
    );

    // Assert
    expect(vi.mocked(arcadeCommand)).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT,
      QueryLanguages.SQL,
      TEST_COMMAND_INPUT,
      TEST_COMMAND_INPUT_PARAMS
    );
  });

  it('should return the output of arcadeCommand()', async () => {
    // Arrange
    const result = await TEST_DATABASE_CLIENT.command(
      QueryLanguages.SQL,
      TEST_COMMAND_INPUT,
      TEST_COMMAND_INPUT_PARAMS
    );

    // Assert
    expect(result).toBe(TEST_COMMAND_OUTPUT);
  });

  it('should propagate errors from arcadeCommand', async () => {
    // Arrange
    vi.mocked(arcadeCommand).mockRejectedValueOnce(
      new Error(TEST_ERROR_PROPAGATION_MESSAGE)
    );

    // Act & Assert
    await expect(
      TEST_DATABASE_CLIENT.command(
        QueryLanguages.SQL,
        TEST_COMMAND_INPUT,
        TEST_COMMAND_INPUT_PARAMS
      )
    ).rejects.toThrow(TEST_ERROR_PROPAGATION_MESSAGE);
  });
});
