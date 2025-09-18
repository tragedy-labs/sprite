// Testing
import { rollbackTransaction } from '@/database/transaction/rollbackTransaction.js';
import {
  SESSION_ID,
  TEST_DATABASE_CONTEXT,
  TEST_HEADERS_WITH_SESSION,
  TEST_TRX
} from '@test/fixtures/index.js';
import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  MockInstance,
  vi
} from 'vitest';

describe('rollbackTransaction()', () => {
  let fetchSpy: MockInstance;
  const ENDPOINT = TEST_DATABASE_CONTEXT.endpoints.rollback.toString();

  afterEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204
    } as Response);

    await rollbackTransaction(TEST_DATABASE_CONTEXT, TEST_TRX);

    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      body: null,
      headers: TEST_HEADERS_WITH_SESSION,
      keepalive: true
    };

    expect(fetchSpy).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT.endpoints.rollback,
      REQUEST_INIT
    );
  });

  it('should error if no transaction is provided', async () => {
    // @ts-expect-error - an instance of Transaction is required
    await expect(rollbackTransaction(SESSION_ID)).rejects.toMatchSnapshot();
  });

  it('should error if it receives a non-204 response', async () => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 205
    } as Response);

    await expect(
      rollbackTransaction(TEST_DATABASE_CONTEXT, TEST_TRX)
    ).rejects.toMatchSnapshot();
  });

  it('should propagate errors from internal methods', async () => {
    fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('fetch failed'));

    await expect(
      rollbackTransaction(TEST_DATABASE_CONTEXT, TEST_TRX)
    ).rejects.toMatchSnapshot();
  });
});
