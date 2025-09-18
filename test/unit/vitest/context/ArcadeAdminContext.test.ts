// Vitest
import { describe, expect, it } from 'vitest';

// Lib
import { ADMIN_ROUTES, AdminEndpoints, Endpoints } from '@/routes/index.js';

// Fixtures
import { TEST_ADMIN_CONTEXT, TEST_ARCADE } from '@test/fixtures/index.js';

describe('ArcadeAdminContext', () => {
  it('sets internal properties', () => {
    // Arrange & Act
    const endpoints = Endpoints.admin(TEST_ARCADE);

    // Assert
    expect(TEST_ADMIN_CONTEXT.endpoints).toEqual(endpoints);
    expect(TEST_ADMIN_CONTEXT.arcade).toBe(TEST_ARCADE);
  });

  it('buildEndPoints returns the expected shape', () => {
    // Arrange
    const expectedShape: AdminEndpoints = {
      [ADMIN_ROUTES.COMMAND]: new URL(
        `${TEST_ARCADE.urls.rest}/${ADMIN_ROUTES.COMMAND}`
      ),
      [ADMIN_ROUTES.DATABASES]: new URL(
        `${TEST_ARCADE.urls.rest}/${ADMIN_ROUTES.DATABASES}`
      ),
      [ADMIN_ROUTES.EXISTS]: new URL(
        `${TEST_ARCADE.urls.rest}/${ADMIN_ROUTES.EXISTS}`
      ),
      [ADMIN_ROUTES.READY]: new URL(
        `${TEST_ARCADE.urls.rest}/${ADMIN_ROUTES.READY}`
      )
    };

    // Assert
    expect(TEST_ADMIN_CONTEXT.endpoints).toEqual(expectedShape);
  });
});
