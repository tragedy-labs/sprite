// Vitest;
import { describe, expect, it } from 'vitest';

// Lib
import { ArcadeDatabaseContext } from '@/context/index.js';
import {
    ADMIN_ROUTES,
    DATABASE_ROUTES,
    DatabaseEndpoints,
    Endpoints
} from '@/routes/index.js';

// Fixtures
import { TEST_ARCADE, TEST_DATABASE_NAME } from '@test/fixtures/index.js';

describe('ArcadeDatabaseContext', () => {
  // Arrange
  const context = new ArcadeDatabaseContext(TEST_DATABASE_NAME, TEST_ARCADE);

  it('sets internal properties', () => {
    // Act
    const endpoints = Endpoints.database(TEST_ARCADE, TEST_DATABASE_NAME);

    // Assert
    expect(context.endpoints).toEqual(endpoints);
    expect(context.arcade).toBe(TEST_ARCADE);
    expect(context.name).toBe(TEST_DATABASE_NAME);
  });

  it('buildEndPoints returns the expected shape', () => {
    // Arrange
    const expectedShape: DatabaseEndpoints = {
      [DATABASE_ROUTES.COMMAND]: new URL(
        `${TEST_ARCADE.urls.rest}/${DATABASE_ROUTES.COMMAND}/${TEST_DATABASE_NAME}`
      ),
      [DATABASE_ROUTES.QUERY]: new URL(
        `${TEST_ARCADE.urls.rest}/${DATABASE_ROUTES.QUERY}/${TEST_DATABASE_NAME}`
      ),
      [DATABASE_ROUTES.BEGIN]: new URL(
        `${TEST_ARCADE.urls.rest}/${DATABASE_ROUTES.BEGIN}/${TEST_DATABASE_NAME}`
      ),
      [DATABASE_ROUTES.COMMIT]: new URL(
        `${TEST_ARCADE.urls.rest}/${DATABASE_ROUTES.COMMIT}/${TEST_DATABASE_NAME}`
      ),
      [DATABASE_ROUTES.ROLLBACK]: new URL(
        `${TEST_ARCADE.urls.rest}/${DATABASE_ROUTES.ROLLBACK}/${TEST_DATABASE_NAME}`
      ),
      [DATABASE_ROUTES.EXISTS]: new URL(
        `${TEST_ARCADE.urls.rest}/${DATABASE_ROUTES.EXISTS}/${TEST_DATABASE_NAME}`
      ),
      server: new URL(`${TEST_ARCADE.urls.rest}/${ADMIN_ROUTES.COMMAND}`)
    };

    // Assert
    expect(context.endpoints).toEqual(expectedShape);
  });
});
