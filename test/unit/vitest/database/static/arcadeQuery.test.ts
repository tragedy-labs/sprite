import { QueryLanguages } from '@/database/index.js';
import { arcadeQuery } from '@/database/static/arcadeQuery.js';
import {
    TEST_COMMAND_INPUT,
    TEST_DATABASE_CONTEXT,
    TEST_DATABASE_NAME,
    TEST_HEADERS,
    TEST_JSON_RESPONSE
} from '@test/fixtures/index.js';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

const ENDPOINT = TEST_DATABASE_CONTEXT.endpoints.query.toString();

describe('arcadeQuery()', async () => {
  beforeEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => TEST_JSON_RESPONSE
    } as Response);

    // Act
    await arcadeQuery(
      TEST_DATABASE_CONTEXT,
      QueryLanguages.SQL,
      TEST_COMMAND_INPUT
    );

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT.endpoints.query,
      {
        method: 'POST',
        headers: TEST_HEADERS,
        body: JSON.stringify({
          language: QueryLanguages.SQL,
          command: TEST_COMMAND_INPUT
        }),
        keepalive: true
      }
    );
  });

  it('should handle a 200 response by returning the result property from the json response', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => TEST_JSON_RESPONSE
    } as Response);

    // Act
    const result = await arcadeQuery(
      TEST_DATABASE_CONTEXT,
      QueryLanguages.SQL,
      TEST_COMMAND_INPUT
    );

    // Assert
    expect(result).toMatchObject(TEST_JSON_RESPONSE.result);
  });

  it('should handle a 400 response (invalid query language) by throwing an error', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 400
    } as Response);

    // Act & Assert
    await expect(
      arcadeQuery(
        TEST_DATABASE_CONTEXT,
        /* @ts-expect-error - testing error */
        'invalidQueryLanguage',
        TEST_COMMAND_INPUT
      )
    ).rejects.toMatchSnapshot();
  });

  it('should handle a 500 response by throwing an error', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 500,
      json: async () => ({
        error: 'Internal error',
        detail: `Database \u0027${TEST_DATABASE_NAME}\u0027 is not available`,
        exception: 'com.arcadedb.exception.DatabaseOperationException'
      })
    } as Response);

    // Act & Assert
    await expect(
      arcadeQuery(TEST_DATABASE_CONTEXT, QueryLanguages.SQL, TEST_COMMAND_INPUT)
    ).rejects.toMatchSnapshot();
  });

  it('should handle an unexpected status code by throwing an error', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 999,
      statusText: 'Unknown Error'
    } as Response);

    // Act & Assert
    await expect(
      arcadeQuery(TEST_DATABASE_CONTEXT, QueryLanguages.SQL, TEST_COMMAND_INPUT)
    ).rejects.toMatchSnapshot();
  });
});
