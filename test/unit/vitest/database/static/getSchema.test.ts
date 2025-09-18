import { QueryLanguages } from '@/database/index.js';
import { getSchema } from '@/database/static/getSchema.js';
import {
    TEST_DATABASE_CONTEXT,
    TEST_HEADERS,
    TEST_JSON_RESPONSE
} from '@test/fixtures/index.js';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

const ENDPOINT = TEST_DATABASE_CONTEXT.endpoints.query.toString();

describe('getSchema()', () => {
  beforeEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => TEST_JSON_RESPONSE
    } as Response);

    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({
        language: QueryLanguages.SQL,
        command: `SELECT FROM schema:types`
      }),
      keepalive: true
    };

    // Act
    await getSchema(TEST_DATABASE_CONTEXT);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT.endpoints.query,
      REQUEST_INIT
    );
  });

  it('should propagate errors from the server', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 500,
      json: async () => ({
        error: 'Generic Error For Testing',
        detail: 'This is just an error for testing purposes',
        exception: 'com.arcadedb.exception.AnArbitraryException'
      })
    } as Response);

    // Act & Assert
    await expect(getSchema(TEST_DATABASE_CONTEXT)).rejects.toMatchSnapshot();
  });
});
