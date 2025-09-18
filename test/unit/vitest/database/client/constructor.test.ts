import {
    TEST_DATABASE_CLIENT,
    TEST_DATABASE_CONTEXT
} from '@test/fixtures/index.js';
import { describe, expect, it } from 'vitest';

describe('ArcadeDatabaseClient.constructor()', async () => {
  it('should set the name property to the database name supplied in the AradeDatabaseContext', async () => {
    // Assert
    expect(TEST_DATABASE_CLIENT.name).toEqual(TEST_DATABASE_CONTEXT.name);
  });
});
