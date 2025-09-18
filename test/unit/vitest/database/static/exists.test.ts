import { exists } from '@/database/static/exists.js';
import {
  TEST_DATABASE_CONTEXT,
  TEST_HEADERS,
  TEST_JSON_RESPONSE
} from '@test/fixtures/index.js';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

const ENDPOINT = TEST_DATABASE_CONTEXT.endpoints.exists.toString();

describe('exists()', async () => {
  beforeEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => TEST_JSON_RESPONSE
    } as Response);

    const REQUEST_INIT: RequestInit = {
      method: 'GET',
      headers: TEST_HEADERS,
      keepalive: true
    };

    // Act
    await exists(TEST_DATABASE_CONTEXT);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT.endpoints.exists,
      REQUEST_INIT
    );
  });

  it('should forward the "true" result for a 200 status response from the server', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => TEST_JSON_RESPONSE
    } as Response);

    // Act
    const response = await exists(TEST_DATABASE_CONTEXT);

    // Assert
    expect(response).toBe(true);
  });

  it('should forward the "false" result for a 200 status response from the server', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({ result: false })
    } as Response);

    // Act
    const response = await exists(TEST_DATABASE_CONTEXT);

    // Assert
    expect(response).toBe(false);
  });

  it('should error if it receives a non-boolean result', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        result: 'ok'
      })
    } as Response);

    // Act & Assert
    await expect(exists(TEST_DATABASE_CONTEXT)).rejects.toMatchSnapshot();
  });

  it('should error if it recieves a 400 status from the server', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 400
    } as Response);

    // Act & Assert
    await expect(exists(TEST_DATABASE_CONTEXT)).rejects.toMatchSnapshot();
  });

  it('should error if it recieves an unexpected status from the server', async () => {
    // Arrange
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 999
    } as Response);

    // Act & Assert
    await expect(exists(TEST_DATABASE_CONTEXT)).rejects.toMatchSnapshot();
  });
});
