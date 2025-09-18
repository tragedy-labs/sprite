// Testing
import { beginTransaction } from '@/database/transaction/beginTransaction.js';
import { Transaction } from '@/database/transaction/Transaction.js';
import {
  SESSION_ID,
  TEST_AUTH,
  TEST_DATABASE_CONTEXT,
  TEST_HEADERS,
  TEST_HEADERS_WITH_SESSION
} from '@test/fixtures/index.js';
import { afterEach, describe, expect, it, MockInstance, vi } from 'vitest';

const ENDPOINT = TEST_DATABASE_CONTEXT.endpoints.begin.toString();

describe('beginTransaction()', () => {
  // Reset spies before each test
  let fetchSpy: MockInstance;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204,
      headers: new Headers(TEST_HEADERS_WITH_SESSION)
    } as Response);

    await beginTransaction(TEST_DATABASE_CONTEXT);

    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers: TEST_HEADERS,
      body: null,
      keepalive: true
    };

    expect(fetchSpy).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT.endpoints.begin,
      REQUEST_INIT
    );
  });

  it(`should pass the isolationLevel parameter to the body of the request when set to REPEATABLE_READ`, async () => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204,
      headers: new Headers({
        Authorization: `Basic ${TEST_AUTH}`,
        'Content-Type': 'application/json',
        'arcadedb-session-id': SESSION_ID
      })
    } as Response);

    await beginTransaction(TEST_DATABASE_CONTEXT, 'REPEATABLE_READ');

    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers: TEST_HEADERS,
      body: JSON.stringify({
        isolationLevel: 'REPEATABLE_READ'
      }),
      keepalive: true
    };

    expect(fetchSpy).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT.endpoints.begin,
      REQUEST_INIT
    );
  });

  it('should return an instance of SpriteTransaction', async () => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204,
      headers: new Headers({
        Authorization: `Basic ${TEST_AUTH}`,
        'Content-Type': 'application/json',
        'arcadedb-session-id': SESSION_ID
      })
    } as Response);

    const trx = await beginTransaction(TEST_DATABASE_CONTEXT);

    expect(trx).toBeInstanceOf(Transaction);
  });

  it('should error if it receives a non-204 response', async () => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 205
    } as Response);

    await expect(
      beginTransaction(TEST_DATABASE_CONTEXT)
    ).rejects.toMatchSnapshot();
  });

  it('should propagate errors from internal methods', async () => {
    fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('fetch failed'));

    await expect(
      beginTransaction(TEST_DATABASE_CONTEXT)
    ).rejects.toMatchSnapshot();
  });

  it('should error if the headers do not contain an arcadedb-session-id', async () => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204
    } as Response);

    await expect(
      beginTransaction(TEST_DATABASE_CONTEXT)
    ).rejects.toMatchSnapshot();
  });
});
