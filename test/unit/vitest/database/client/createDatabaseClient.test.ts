import { ArcadeDatabaseClient } from '@/database/ArcadeDatabaseClient.js';
import { createDatabaseClient } from '@/database/createDatabaseClient.js';
import {
  TEST_ARCADE,
  TEST_DATABASE_CONTEXT,
  TEST_DATABASE_NAME
} from '@test/fixtures/index.js';
import { describe, expect, it, vi } from 'vitest';

// Arrange
vi.mock('@/database/static/exists.js', () => ({
  exists: vi.fn(async () => true)
}));

const { exists } = await import('@/database/static/exists.js');
const database = createDatabaseClient(TEST_DATABASE_NAME, TEST_ARCADE);

describe('createDatabaseClient()', () => {
  it('returns an instance of ArcadeDatabaseClient', () => {
    // Assert
    expect(database).toBeInstanceOf(ArcadeDatabaseClient);
  });

  it('provides the database name to the ArcadeDatabaseClient instance', () => {
    // Assert
    expect(database.name).toEqual(TEST_DATABASE_NAME);
  });

  it('provides the arcade context to the ArcadeDatabaseClient instance', async () => {
    // Arrange
    vi.mocked(exists).mockReset();

    // Act
    await database.exists();

    // Assert
    expect(vi.mocked(exists)).toHaveBeenCalledWith(
      expect.objectContaining({ arcade: TEST_ARCADE })
    );
  });

  it('provides the arcade context to the ArcadeDatabaseClient instance', async () => {
    // Arrange
    vi.mocked(exists).mockReset();

    // Act
    await database.exists();

    // Assert
    expect(vi.mocked(exists)).toHaveBeenCalledWith(TEST_DATABASE_CONTEXT);
  });
});
